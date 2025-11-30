(function(){
  // Minimal typeahead + quick-create modal for admin flows
  async function searchUsers(q, limit=20){
    if (!q || q.length < 2) return [];
    try {
      const res = await fetch(`/api/users/search?q=${encodeURIComponent(q)}&limit=${limit}`);
      if (!res.ok) return [];
      const j = await res.json();
      return j.data || [];
    } catch (e) { console.error('searchUsers error', e); return []; }
  }

  function createDropdown(input){
    // create or reuse dropdown element
    let dd = input.parentNode.querySelector('.ta-dropdown');
    if (!dd) {
      dd = document.createElement('div');
      dd.className = 'ta-dropdown';
      // set width to match input and ensure parent positioned
      dd.style.width = (input.offsetWidth) + 'px';
      input.parentNode.style.position = 'relative';
      input.parentNode.appendChild(dd);
    }
    return dd;
  }

  function attachTypeahead(opts){
    const input = document.querySelector(opts.inputSelector);
    const hidden = document.querySelector(opts.hiddenSelector);
    if (!input) return;
    const minChars = opts.minChars || 2;
    const dd = createDropdown(input);
    let results = [];
    let selectedIndex = -1;

    input.addEventListener('input', async () => {
      const q = input.value.trim();
      hidden && (hidden.value = '');
      selectedIndex = -1;
      if (q.length < minChars) { dd.innerHTML = ''; return; }
      results = await searchUsers(q, opts.limit || 20);
      dd.innerHTML = '';
      results.forEach((u, idx) => {
        const item = document.createElement('div');
        item.className = 'ta-item';
        item.style.padding = '6px 8px';
        item.style.cursor = 'pointer';
        const label = u.username + (u.full_name ? (' - ' + u.full_name) : '');
        // mark if user already registered in current tournament (page may set window.REGISTERED_USERS as a Set of ids)
        const isRegistered = (window.REGISTERED_USERS && window.REGISTERED_USERS.has && window.REGISTERED_USERS.has(String(u.id))) || (window.REGISTERED_USERS && window.REGISTERED_USERS.has && window.REGISTERED_USERS.has(Number(u.id)));
        item.textContent = label + (isRegistered ? ' (inscrito)' : '');
        item.dataset.uid = u.id;
        item.dataset.idx = idx;
        item.addEventListener('click', () => {
          selectUser(u, item.textContent);
        });
        dd.appendChild(item);
      });
    });

    // Keyboard navigation
    input.addEventListener('keydown', async (e) => {
      const items = dd.querySelectorAll('.ta-item');
      
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        selectedIndex = Math.min(selectedIndex + 1, items.length - 1);
        highlightItem(items, selectedIndex);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        selectedIndex = Math.max(selectedIndex - 1, 0);
        highlightItem(items, selectedIndex);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const q = input.value.trim();
        
        // Si hay un item seleccionado con las flechas
        if (selectedIndex >= 0 && items[selectedIndex]) {
          const selectedItem = items[selectedIndex];
          const userId = selectedItem.dataset.uid;
          const user = results.find(u => String(u.id) === userId);
          if (user) {
            selectUser(user, selectedItem.textContent);
          }
        }
        // Si hay resultados pero ninguno seleccionado, seleccionar el primero
        else if (results.length > 0) {
          selectUser(results[0], items[0].textContent);
        }
        // Si no hay resultados y hay texto, abrir modal de crear usuario
        else if (q.length >= minChars) {
          dd.innerHTML = '';
          if (opts.onNoResults) {
            opts.onNoResults(q);
          }
        }
      } else if (e.key === 'Escape') {
        dd.innerHTML = '';
        selectedIndex = -1;
      }
    });

    function selectUser(user, displayText) {
      input.value = displayText;
      hidden && (hidden.value = user.id);
      dd.innerHTML = '';
      selectedIndex = -1;
    }

    function highlightItem(items, index) {
      items.forEach((item, idx) => {
        if (idx === index) {
          item.style.backgroundColor = 'rgba(255, 215, 0, 0.2)';
        } else {
          item.style.backgroundColor = '';
        }
      });
    }

    // hide on outside click
    document.addEventListener('click', (ev) => {
      if (!input.contains(ev.target) && !dd.contains(ev.target)) dd.innerHTML = '';
    });
  }

  // Quick-create modal
  function openQuickCreate(opts){
    const inputEl = document.querySelector(opts.inputSelector);
    const hiddenEl = document.querySelector(opts.hiddenSelector);
    // build modal
    let modal = document.getElementById('ta-quickcreate-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'ta-quickcreate-modal';
      modal.className = 'ta-modal';
      const content = document.createElement('div'); content.className = 'ta-modal-content';
      content.innerHTML = `<h3>Crear usuario rápido</h3>
        <div class="ta-quickcreate-form">
          <input id="ta_qc_username" placeholder="username" />
          <input id="ta_qc_fullname" placeholder="Nombre completo (opcional)" />
          <div class="actions">
            <button id="ta_qc_create" class="btn btn-primary">Crear</button>
            <button id="ta_qc_cancel" class="btn">Cancelar</button>
          </div>
          <div id="ta_qc_msg" class="ta-qc-msg" style="margin-top:0.5rem;color:#900"></div>
        </div>`;
      modal.appendChild(content);
      document.body.appendChild(modal);
      // wire buttons
      document.getElementById('ta_qc_cancel').addEventListener('click', () => { modal.style.display = 'none'; });
      document.getElementById('ta_qc_create').addEventListener('click', async () => {
        const uEl = document.getElementById('ta_qc_username');
        const fEl = document.getElementById('ta_qc_fullname');
        const u = uEl ? (uEl.value || '').trim() : '';
        const f = fEl ? (fEl.value || '').trim() : '';
        const msg = document.getElementById('ta_qc_msg');
        if (!u) { msg.textContent = 'username requerido'; return; }
        try {
          const res = await fetch('/admin/users/quick-create', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: u, full_name: f }) });
          const j = await res.json();
          if (!res.ok) { msg.textContent = j && j.error ? j.error : 'Error creando usuario'; return; }
          // success: set hidden and input
          hiddenEl && (hiddenEl.value = j.id);
          inputEl && (inputEl.value = `${j.username}${j.full_name ? ' - ' + j.full_name : ''}`);
          modal.style.display = 'none';
          // Show temp password if generated
          if (j.tempPassword) {
            setTimeout(() => {
              alert(`✅ Usuario creado exitosamente!\n\n` +
                    `👤 Username: ${j.username}\n` +
                    `🔑 Contraseña temporal: ${j.tempPassword}\n\n` +
                    `⚠️ IMPORTANTE: Guarda esta contraseña.`);
            }, 100);
          }
        } catch (e) {
          msg.textContent = 'Error de red';
        }
      });
    }
    // reset or prefill fields and show
    const uReset = document.getElementById('ta_qc_username'); 
    if (uReset) uReset.value = opts.prefillUsername || '';
    const fReset = document.getElementById('ta_qc_fullname'); 
    if (fReset) fReset.value = '';
    const msgReset = document.getElementById('ta_qc_msg'); 
    if (msgReset) msgReset.textContent = '';
    modal.style.display = 'flex';
  }

  window.TypeaheadQuickCreate = { attach: attachTypeahead, openQuickCreate };
})();
