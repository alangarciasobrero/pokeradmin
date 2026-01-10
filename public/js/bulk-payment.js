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
  const bulkAmountEl = document.getElementById('bulkAmount');
  const bulkControlsEl = document.getElementById('bulkControls');
  
  if (selectedCountEl) {
    selectedCountEl.textContent = `${count} seleccionados`;
  }
  if (selectedTotalEl) {
    selectedTotalEl.textContent = `Total pendiente: $${total.toLocaleString('es-AR', {minimumFractionDigits: 0, maximumFractionDigits: 0})}`;
  }
  
  // Mostrar/ocultar controles de pago múltiple
  if (bulkControlsEl) {
    bulkControlsEl.style.display = count > 0 ? 'block' : 'none';
  }
  
  // Actualizar automáticamente el campo de monto con el total pendiente
  if (bulkAmountEl && count > 0) {
    bulkAmountEl.value = total.toFixed(2);
  } else if (bulkAmountEl && count === 0) {
    bulkAmountEl.value = '';
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
      // Solo validar si el submit viene del botón de pagar seleccionados
      const submitButton = e.submitter;
      if (submitButton && submitButton.classList.contains('btn-pay-selected')) {
        const checkboxes = document.querySelectorAll('.payment-checkbox:checked');
        
        if (checkboxes.length === 0) {
          e.preventDefault();
          alert('Selecciona al menos un movimiento para pagar');
          return false;
        }
      }
      
      return true;
    });
  }
  
  // Prevenir que los formularios individuales activen la validación del bulk form
  const individualForms = document.querySelectorAll('.payment-form-individual');
  individualForms.forEach(function(form) {
    form.addEventListener('submit', function(e) {
      e.stopPropagation(); // Evitar que el evento llegue al formulario padre
    });
  });
});
