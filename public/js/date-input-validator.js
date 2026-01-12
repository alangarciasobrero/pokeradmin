/**
 * date-input-validator.js
 * Script global para validación de inputs de fecha en formato dd/mm/yyyy
 */

document.addEventListener('DOMContentLoaded', function() {
	const dateInputs = document.querySelectorAll('.date-input');
	
	dateInputs.forEach(input => {
		// Validar al escribir
		input.addEventListener('input', function(e) {
			let value = e.target.value.replace(/[^0-9/]/g, '');
			
			// Auto-agregar barras
			if (value.length === 2 && !value.includes('/')) {
				value += '/';
			} else if (value.length === 5 && value.split('/').length === 2) {
				value += '/';
			}
			
			// Limitar a 10 caracteres (dd/mm/yyyy)
			value = value.substring(0, 10);
			e.target.value = value;
			
			// Validar formato completo
			if (value.length === 10) {
				const isValid = validateDateDMY(value);
				e.target.classList.toggle('invalid', !isValid);
			} else {
				e.target.classList.remove('invalid');
			}
		});
		
		// Validar al salir del campo
		input.addEventListener('blur', function(e) {
			const value = e.target.value.trim();
			if (value && value.length === 10) {
				const isValid = validateDateDMY(value);
				if (!isValid) {
					alert('Fecha inválida. Use el formato dd/mm/yyyy (ej: 31/12/2025)');
					e.target.focus();
				}
			}
		});
	});
	
	function validateDateDMY(dateStr) {
		const parts = dateStr.split('/');
		if (parts.length !== 3) return false;
		
		const day = parseInt(parts[0], 10);
		const month = parseInt(parts[1], 10);
		const year = parseInt(parts[2], 10);
		
		if (isNaN(day) || isNaN(month) || isNaN(year)) return false;
		if (day < 1 || day > 31) return false;
		if (month < 1 || month > 12) return false;
		if (year < 1900 || year > 2100) return false;
		
		// Verificar fecha válida
		const date = new Date(year, month - 1, day);
		return date.getDate() === day && date.getMonth() === month - 1 && date.getFullYear() === year;
	}
});
