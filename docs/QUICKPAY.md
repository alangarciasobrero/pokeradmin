# Pagar rápido (Quick Pay)

Resumen rápido

- Botón "Pagar rápido" en la tabla de participantes (pantalla de detalles del torneo) para admins.
- Modal que muestra: movimientos del día (expectations), elementos de la cuenta personal (deudas históricas), y crédito disponible.
- Comportamiento por defecto: el monto por defecto que aparece en el modal es la "deuda del día".
- Checkbox "Usar cuenta personal": al marcarlo se incluye la deuda histórica en el monto por defecto (si existe), o se indica que se usará crédito si hay saldo a favor.
- Si el monto ingresado es mayor que la deuda total (día + deuda personal), aparece una advertencia y el admin debe confirmar explícitamente que quiere crear crédito por el exceso.

Endpoints relevantes

- GET /admin/payments/user/:id/movements
  - Retorna: { movements: [...], personal: [...], creditAvailable: number }
  - movements: expectativas del día con campos { id, source, reference_id, amount, paid_amount, remaining }
  - personal: elementos de cuenta personal (personal_account=true) con { id, amount, paid_amount, remaining }
  - creditAvailable: monto disponible a favor (suma de `credit` menos `credit_consumed`)

- POST /admin/payments/settle
  - Payload ejemplo:
    {
      "userId": 123,
      "amount": 350.00,
      "useCredit": true,
      "method": "efectivo",
      "idempotencyKey": "uuid-v4"
    }
  - Lógica del servidor:
    1. Si `useCredit` = true, consume crédito disponible (crea entries `credit_consumed`) para pagar expectations del día.
    2. Aplica `amount` recibido a expectations no pagadas (orden por fecha), creando `settlement` rows y actualizando `paid_amount` en las expectations.
    3. Si queda monto, lo aplica a `personal_account` (entries con personal_account=true) generando `settlement_personal`.
    4. Si sobra monto después de todo, crea `source='credit'` para representar saldo a favor.
  - Soporta `idempotencyKey` para evitar duplicados.

Notas de auditoría

- Cada movimiento queda registrado en `payments` y se preserva el historial.
- Sobrepagos se registran como `credit` y deben confirmarse explícitamente por el admin.

Cómo probar manualmente (dev)

1. Login como admin (dev helper `/dev/login-admin`).
2. Ir a un torneo con participantes. Hacer click en "Pagar rápido" en la fila de un participante.
3. Revisar datos del modal y confirmar pago.
4. Verificar la tabla de participantes (se actualiza y deja de mostrar deudas saldadas).

