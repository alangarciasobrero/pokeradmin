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

    input.addEventListener('input', async () => {
      const q = input.value.trim();
      hidden && (hidden.value = '');
      if (q.length < minChars) { dd.innerHTML = ''; return; }
      results = await searchUsers(q, opts.limit || 20);
      dd.innerHTML = '';
      results.forEach(u => {
        const item = document.createElement('div');
        item.className = 'ta-item';
        item.style.padding = '6px 8px';
        item.style.cursor = 'pointer';
        const label = u.username + (u.full_name ? (' - ' + u.full_name) : '');
        // mark if user already registered in current tournament (page may set window.REGISTERED_USERS as a Set of ids)
        const isRegistered = (window.REGISTERED_USERS && window.REGISTERED_USERS.has && window.REGISTERED_USERS.has(String(u.id))) || (window.REGISTERED_USERS && window.REGISTERED_USERS.has && window.REGISTERED_USERS.has(Number(u.id)));
        item.textContent = label + (isRegistered ? ' (inscrito)' : '');
        item.dataset.uid = u.id;
        item.addEventListener('click', () => {
          input.value = item.textContent;
          hidden && (hidden.value = item.dataset.uid);
          dd.innerHTML = '';
        });
        dd.appendChild(item);
      });
    });

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
        } catch (e) {
          msg.textContent = 'Error de red';
        }
      });
    }
    // reset fields and show
    const uReset = document.getElementById('ta_qc_username'); if (uReset) uReset.value = '';
    const fReset = document.getElementById('ta_qc_fullname'); if (fReset) fReset.value = '';
    const msgReset = document.getElementById('ta_qc_msg'); if (msgReset) msgReset.textContent = '';
    modal.style.display = 'flex';
  }

  window.TypeaheadQuickCreate = { attach: attachTypeahead, openQuickCreate };
})();
