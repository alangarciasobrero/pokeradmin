function updateBulkPaymentInfo() {
  const checkboxes = document.querySelectorAll('.payment-checkbox:checked');
  let total = 0;
  let count = 0;
  
  checkboxes.forEach(cb => {
    const amount = parseFloat(cb.dataset.amount || 0);
    const paid = parseFloat(cb.dataset.paid || 0);
    // Para montos negativos (historical/adjustment), usar valor absoluto
    const pending = amount < 0 ? Math.abs(amount) - paid : Math.max(0, amount - paid);
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

// Función para enviar el formulario de pago masivo
function submitBulkPayment() {
  const checkboxes = document.querySelectorAll('.payment-checkbox:checked');
  
  console.log('submitBulkPayment - checkboxes encontrados:', checkboxes.length);
  
  if (checkboxes.length === 0) {
    alert('⚠️ No seleccionaste ningún movimiento');
    return false;
  }
  
  const amountInput = document.getElementById('bulkAmount');
  const methodSelect = document.querySelector('#bulkPaymentForm select[name="method"]');
  
  if (!amountInput || !amountInput.value || parseFloat(amountInput.value) <= 0) {
    alert('⚠️ Ingresa un monto válido');
    if (amountInput) amountInput.focus();
    return false;
  }
  
  if (!methodSelect || !methodSelect.value) {
    alert('⚠️ Selecciona un método de pago');
    return false;
  }
  
  // Todo validado, enviar el formulario sin pasar por el event listener
  const form = document.getElementById('bulkPaymentForm');
  if (form) {
    console.log('Form encontrado, action:', form.action);
    console.log('Form method:', form.method);
    console.log('Checkboxes dentro del form:', form.querySelectorAll('.payment-checkbox:checked').length);
    // Remover temporalmente el listener para evitar doble validación
    form.onsubmit = null;
    console.log('Enviando formulario...');
    form.submit();
    console.log('Form.submit() ejecutado');
  } else {
    console.log('ERROR: No se encontró el formulario');
  }
}

// Función para validar antes de enviar el formulario (solo se usa si se envía con Enter u otro método)
function validateBulkPayment(event) {
  console.log('validateBulkPayment ejecutado');
  const checkboxes = document.querySelectorAll('.payment-checkbox:checked');
  
  console.log('validateBulkPayment - checkboxes encontrados:', checkboxes.length);
  
  if (checkboxes.length === 0) {
    event.preventDefault();
    alert('⚠️ Selecciona al menos un movimiento para pagar');
    return false;
  }
  
  const amountInput = document.getElementById('bulkAmount');
  if (!amountInput || !amountInput.value || parseFloat(amountInput.value) <= 0) {
    event.preventDefault();
    alert('⚠️ Ingresa un monto válido');
    if (amountInput) amountInput.focus();
    return false;
  }
  
  console.log('Validación exitosa, enviando formulario');
  return true;
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('bulkPaymentForm');
  if (form) {
    form.addEventListener('submit', validateBulkPayment);
  }
  
  // Prevenir que los formularios individuales activen la validación del bulk form
  const individualForms = document.querySelectorAll('.payment-form-individual');
  individualForms.forEach(function(form) {
    form.addEventListener('submit', function(e) {
      e.stopPropagation(); // Evitar que el evento llegue al formulario padre
    });
  });
});

// Función para enviar pagos individuales sin conflicto con el bulk form
function submitIndividualPayment(userId, paymentId) {
  const amountInput = document.getElementById(`amount-${paymentId}`);
  const methodSelect = document.getElementById(`method-${paymentId}`);
  
  if (!amountInput || !methodSelect) {
    alert('Error: no se encontraron los campos del formulario');
    return;
  }
  
  const amount = amountInput.value;
  const method = methodSelect.value;
  
  if (!amount || parseFloat(amount) <= 0) {
    alert('Por favor ingresa un monto válido');
    amountInput.focus();
    return;
  }
  
  // Crear y enviar un formulario temporal
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = `/admin/users/${userId}/payments/${paymentId}/mark-paid`;
  
  const amountField = document.createElement('input');
  amountField.type = 'hidden';
  amountField.name = 'paid_amount';
  amountField.value = amount;
  form.appendChild(amountField);
  
  const methodField = document.createElement('input');
  methodField.type = 'hidden';
  methodField.name = 'method';
  methodField.value = method;
  form.appendChild(methodField);
  
  document.body.appendChild(form);
  form.submit();
}
