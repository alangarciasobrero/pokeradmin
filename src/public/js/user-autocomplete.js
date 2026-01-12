(function(){
  // Simple autocomplete using datalist and a hidden input to store selected user_id
  async function searchUsers(q){
    if (!q || q.length < 2) return [];
    try {
      const res = await fetch(`/api/users/search?q=${encodeURIComponent(q)}&limit=20`);
      const j = await res.json();
      return j.data || [];
    } catch (err) {
      console.error('user search error', err);
      return [];
    }
  }

  function attachAutocomplete(opts){
    const input = document.querySelector(opts.inputSelector);
    const hidden = document.querySelector(opts.hiddenSelector);
    const datalist = document.querySelector(opts.datalistSelector);
    if (!input || !hidden || !datalist) return;

    let lastResults = [];

    input.addEventListener('input', async (e) => {
      const q = input.value.trim();
      if (q.length < 2) return;
      const users = await searchUsers(q);
      lastResults = users;
      // clear datalist
      datalist.innerHTML = '';
      users.forEach(u => {
        const opt = document.createElement('option');
        // display username - full_name
        opt.value = `${u.username}${u.full_name ? ' - ' + u.full_name : ''}`;
        opt.dataset.uid = u.id;
        datalist.appendChild(opt);
      });
    });

    // when the input loses focus, try to match selected option and set hidden value
    input.addEventListener('change', (e) => {
      const val = input.value;
      const matched = lastResults.find(u => {
        const label = `${u.username}${u.full_name ? ' - ' + u.full_name : ''}`;
        return label === val;
      });
      if (matched) {
        hidden.value = matched.id;
      } else {
        // if user cleared or typed arbitrary text, clear hidden
        hidden.value = '';
      }
    });
  }

  // create user via admin quick-create endpoint
  async function createUser(username, full_name) {
    try {
      const res = await fetch('/admin/users/quick-create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, full_name })
      });
      const j = await res.json();
      if (!res.ok) throw j;
      return j;
    } catch (err) {
      console.error('create user error', err);
      throw err;
    }
  }

  // expose
  window.UserAutocomplete = { attach: attachAutocomplete, createUser };
})();
