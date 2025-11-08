(function(){
  // Simple modal builder and quick-pay flow for admins
  function createModal() {
    const modal = document.createElement('div');
    modal.className = 'qp-modal';
    modal.style = 'position:fixed;inset:0;background:rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center;z-index:1200';
    modal.innerHTML = `
      <div class="qp-modal-content" style="background:#fff;padding:1rem;border-radius:6px;max-width:720px;width:100%;">
        <h3>Pagar rápido</h3>
        <div id="qp-body">Cargando...</div>
        <div style="margin-top:1rem;display:flex;gap:0.5rem;justify-content:flex-end;">
          <button id="qp-confirm" class="btn btn-primary">Registrar pago</button>
          <button id="qp-cancel" class="btn">Cancelar</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    return modal;
  }

  function formatMoney(n){ return (Number(n||0)).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2}); }

  async function openQuickPay(userId){
    const modal = createModal();
    const body = modal.querySelector('#qp-body');
    const cancelBtn = modal.querySelector('#qp-cancel');
    const confirmBtn = modal.querySelector('#qp-confirm');

    try {
      const res = await fetch(`/admin/payments/user/${userId}/movements`);
      if (!res.ok) throw new Error('fetch movements failed');
      const j = await res.json();
      const movements = j.movements || [];
      const personal = j.personal || [];
      const creditAvailable = Number(j.creditAvailable || 0);

      // compute debt of day
      const debtDay = movements.reduce((s,m)=> s + (Number(m.remaining||0)), 0);
      const personalDebt = personal.reduce((s,p)=> s + (Number(p.remaining||0)), 0);

      let html = `<p><strong>Jugador ID:</strong> ${userId}</p>`;
      html += `<p>Deuda del día: <strong id="qp-debtDay">${formatMoney(debtDay)}</strong></p>`;
      html += `<p>Cuenta personal deuda: <strong id="qp-personalDebt">${formatMoney(personalDebt)}</strong> — Crédito disponible: <strong id="qp-creditAvail">${formatMoney(creditAvailable)}</strong></p>`;

      html += `<label><input type="checkbox" id="qp-usePersonal" /> Usar cuenta personal (sumar deuda histórica o usar crédito si existe)</label>`;
  html += `<div style="margin-top:0.5rem">`;
  html += `<label>Monto a registrar ahora: <input id="qp-amount" type="number" step="0.01" value="${debtDay.toFixed(2)}" style="width:10rem" /></label>`;
  html += `<label style="margin-left:0.5rem">Método: <select id="qp-method"><option value="efectivo">Efectivo</option><option value="tarjeta">Tarjeta</option><option value="transfer">Transferencia</option><option value="otro">Otro</option></select></label>`;
  html += `</div>`;
  html += `<div id="qp-overpay" style="margin-top:0.6rem;display:none;color:#900;border:1px solid #fcc;padding:0.5rem;border-radius:4px">`;
  html += `<p><strong>Advertencia:</strong> El monto ingresado supera la deuda total del jugador. El exceso se registrará como crédito a favor. Por favor confirme que desea crear crédito:</p>`;
  html += `<label><input type="checkbox" id="qp-confirm-overpay" /> Confirmo crear crédito por el exceso</label>`;
  html += `</div>`;

      // movements details
      html += `<h4 style="margin-top:0.6rem">Movimientos del día</h4>`;
      if (movements.length === 0) html += `<p>No hay movimientos del día</p>`;
      else {
        html += `<table style="width:100%;border-collapse:collapse;margin-top:0.4rem">`;
        html += `<thead><tr><th style="text-align:left">Ref</th><th>Monto</th><th>Pagado</th><th>Remaining</th></tr></thead><tbody>`;
        movements.forEach(m => {
          html += `<tr><td>${m.source}${m.reference_id ? ' #' + m.reference_id : ''}</td><td style="text-align:right">${formatMoney(m.amount)}</td><td style="text-align:right">${formatMoney(m.paid_amount)}</td><td style="text-align:right">${formatMoney(m.remaining)}</td></tr>`;
        });
        html += `</tbody></table>`;
      }

      // personal debts list
      html += `<h4 style="margin-top:0.6rem">Cuenta personal (elementos)</h4>`;
      if (personal.length === 0) html += `<p>No hay deudas personales</p>`;
      else {
        html += `<ul>`;
        personal.forEach(p => html += `<li>ID ${p.id}: monto ${formatMoney(p.amount)} — pagado ${formatMoney(p.paid_amount)} — restante ${formatMoney(p.remaining)}</li>`);
        html += `</ul>`;
      }

      body.innerHTML = html;

      // wire checkbox behavior
      const usePersonal = modal.querySelector('#qp-usePersonal');
      const amtInput = modal.querySelector('#qp-amount');
      const methodSelect = modal.querySelector('#qp-method');

      function updateAmountOnCheckbox(){
        if (!usePersonal || !amtInput) return;
        if (usePersonal.checked){
          // if credit available, keep amount at debtDay but inform; if personalDebt exists, set amount to debtDay+personalDebt
          if (creditAvailable > 0 && personalDebt <= 0){
            // keep amount as debtDay (credit will be used server-side)
            amtInput.value = Number(debtDay).toFixed(2);
          } else {
            amtInput.value = Number(debtDay + personalDebt).toFixed(2);
          }
        } else {
          amtInput.value = Number(debtDay).toFixed(2);
        }
        // after changing amount, re-evaluate overpay warning
        evaluateOverpay();
      }
      usePersonal.addEventListener('change', updateAmountOnCheckbox);

      // evaluate if amount > total debt and show confirmation checkbox if so
      function evaluateOverpay(){
        const overpayDiv = modal.querySelector('#qp-overpay');
        const overpayChk = modal.querySelector('#qp-confirm-overpay');
        const amt = Number(amtInput.value) || 0;
        const totalDebt = Number(debtDay) + Number(personalDebt || 0);
        if (amt > totalDebt + 0.0001){
          if (overpayDiv) overpayDiv.style.display = 'block';
          // require explicit confirmation checkbox
          if (overpayChk) {
            confirmBtn.disabled = !(overpayChk.checked === true);
            overpayChk.addEventListener('change', () => { confirmBtn.disabled = !(overpayChk.checked === true); });
          } else {
            confirmBtn.disabled = true;
          }
        } else {
          if (overpayDiv) overpayDiv.style.display = 'none';
          if (overpayChk) overpayChk.checked = false;
          confirmBtn.disabled = false;
        }
      }

      // confirm handler
      confirmBtn.addEventListener('click', async () => {
        confirmBtn.disabled = true;
        try {
          const amt = Number(amtInput.value) || 0;
          const usePers = !!(usePersonal && usePersonal.checked);
          const method = methodSelect.value || 'manual';
          const idemp = 'qp-' + Date.now() + '-' + Math.floor(Math.random()*100000);

          const payload = { userId, amount: amt, useCredit: usePers, method, idempotencyKey: idemp };
          const r = await fetch('/admin/payments/settle', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
          const jr = await r.json();
          if (r.ok && jr.ok){
            alert('Pago registrado correctamente');
            // refresh participants table if function available, else reload
            if (window.loadParticipants) try { window.loadParticipants(); } catch(e){ location.reload(); }
            document.body.removeChild(modal);
          } else {
            alert('Error registrando pago: ' + (jr && jr.error ? jr.error : JSON.stringify(jr)));
          }
        } catch (e) {
          alert('Error en la petición: ' + e);
        } finally { confirmBtn.disabled = false; }
      });

      cancelBtn.addEventListener('click', () => { try { document.body.removeChild(modal); } catch(e){} });

    } catch (e) {
      body.innerHTML = '<p>Error cargando movimientos</p>';
      console.error(e);
      cancelBtn.addEventListener('click', () => { try { document.body.removeChild(modal); } catch(e){} });
    }
  }

  // delegate click for quick-pay buttons
  document.addEventListener('click', (ev) => {
    const t = ev.target;
    if (!t) return;
    const btn = t.closest && (t.closest('.quick-pay-btn') || (t.classList && t.classList.contains('quick-pay-btn') ? t : null));
    const el = btn || t;
    if (el && el.getAttribute && el.getAttribute('data-user-id')){
      const uid = Number(el.getAttribute('data-user-id'));
      openQuickPay(uid);
    }
  });
  // expose a test-friendly global so E2E tests can call openQuickPay directly
  try {
    if (typeof window !== 'undefined') {
      (window).OpenQuickPay = async function(uid){
        try {
          (window).__OpenQuickPay_invocations = (window.__OpenQuickPay_invocations || 0) + 1;
          console.log('OpenQuickPay invoked for', uid);
        } catch(e){}
        return openQuickPay(uid);
      };
      (window).__qp_loaded = true;
    }
  } catch (e) {
    /* ignore in non-browser envs */
  }
})();
