function updateBulkPaymentInfo() {
  const checkboxes = document.querySelectorAll('.payment-checkbox:checked');
  let total = 0;
  let count = 0;
  
  checkboxes.forEach(cb => {
    const amount = parseFloat(cb.dataset.amount || 0);
    const paid = parseFloat(cb.dataset.paid || 0);
    const pending = Math.max(0, amount - paid);
    total += pending;
    count++;
  });
  
  const selectedCountEl = document.getElementById('selectedCount');
  const selectedTotalEl = document.getElementById('selectedTotal');
  
  if (selectedCountEl) {
    selectedCountEl.textContent = `${count} seleccionados`;
  }
  if (selectedTotalEl) {
    selectedTotalEl.textContent = `Total pendiente: $${total.toLocaleString('es-AR', {minimumFractionDigits: 0, maximumFractionDigits: 0})}`;
  }
}

function selectAllPending() {
  const checkboxes = document.querySelectorAll('.payment-checkbox');
  const allChecked = Array.from(checkboxes).every(cb => cb.checked);
  
  checkboxes.forEach(cb => {
    cb.checked = !allChecked;
  });
  
  updateBulkPaymentInfo();
}

function toggleAllCheckboxes(masterCheckbox) {
  const checkboxes = document.querySelectorAll('.payment-checkbox');
  checkboxes.forEach(cb => {
    cb.checked = masterCheckbox.checked;
  });
  updateBulkPaymentInfo();
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('bulkPaymentForm');
  if (form) {
    form.addEventListener('submit', function(e) {
      const checkboxes = document.querySelectorAll('.payment-checkbox:checked');
      
      if (checkboxes.length === 0) {
        e.preventDefault();
        alert('Selecciona al menos un movimiento para pagar');
        return false;
      }
      
      // Los checkboxes ya están dentro del form, no necesitamos agregar nada más
      return true;
    });
  }
});
