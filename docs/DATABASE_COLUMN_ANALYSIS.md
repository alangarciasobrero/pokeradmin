# ANÁLISIS DE COLUMNAS DE BASE DE DATOS
## Reporte generado: 2025-11-26

### ✅ TABLAS Y COLUMNAS EN USO ACTIVO

#### **users**
- ✅ id, username, password_hash, full_name - USO PRINCIPAL
- ✅ email, phone_number, nickname - Perfil de usuario
- ✅ current_points - Sistema de ranking
- ✅ avatar - Perfil visual
- ✅ role - Control de acceso (admin/user)
- ✅ is_player - Flag para jugadores activos
- ✅ is_deleted - Soft delete
- ✅ createdAt, updatedAt - Timestamps
- ⚠️ **first_name** - POCO USO: Solo en imports de CSV y migración de players
- ⚠️ **last_name** - POCO USO: Solo en imports de CSV y migración de players
- ⚠️ **suspended** - DEFINIDO PERO NUNCA USADO en lógica de negocio

#### **tournaments**
- ✅ id, tournament_name, start_date - USO PRINCIPAL
- ✅ buy_in, re_entry, knockout_bounty - Configuración de juego
- ✅ starting_stack, blind_levels, small_blind - Estructura de juego
- ✅ count_to_ranking, double_points - Sistema de puntos
- ✅ punctuality_discount - Descuentos para puntualidad
- ✅ registration_open - Control de inscripciones
- ✅ end_date - Cierre de torneo

#### **registrations**
- ✅ id, user_id, tournament_id - USO PRINCIPAL
- ✅ registration_date - Timestamp de inscripción
- ✅ action_type - Tipo de acción (1=buy-in, 2=re-entry, 3=duplo)
- ✅ punctuality - Flag para descuento de puntualidad
- ✅ position - Posición final (se actualiza al cerrar torneo)

#### **results**
- ✅ id, tournament_id, user_id - USO PRINCIPAL
- ✅ position - Posición final
- ✅ final_table - Flag para mesa final

#### **payments**
- ✅ id, user_id, amount, payment_date - USO PRINCIPAL
- ✅ source - Origen del pago (tournament/cash/cash_request/etc)
- ✅ reference_id - ID de registro o cash participant
- ✅ paid - Estado de pago
- ✅ paid_amount - Monto efectivamente pagado
- ✅ method - Método de pago
- ✅ personal_account - Flag para cuenta personal
- ✅ recorded_by_name - Admin que registró el pago
- ✅ createdAt, updatedAt - Timestamps

#### **cash_games**
- ✅ id, small_blind, start_datetime - USO PRINCIPAL
- ✅ end_datetime - Cierre de mesa
- ✅ total_commission, total_tips - Comisiones acumuladas
- ✅ dealer - Nombre del dealer actual

#### **cash_participants**
- ✅ id, cash_game_id, user_id - USO PRINCIPAL
- ✅ joined_at, left_at - Timestamps de entrada/salida
- ⚠️ **seat_number** - DEFINIDO PERO POCO USADO (opcional en registro)

#### **seasons**
- ✅ id, nombre, descripcion - USO PRINCIPAL
- ✅ fecha_inicio, fecha_fin - Rango de temporada
- ✅ torneos_totales, torneos_jugados - Contadores
- ✅ estado - Estado de temporada
- ✅ createdAt, updatedAt - Timestamps

#### **historical_points**
- ✅ id, record_date, user_id, season_id - USO PRINCIPAL
- ✅ tournament_id, result_id - Referencias
- ✅ action_type - Tipo de acción (attendance/reentry/final_table/placement/bonus)
- ✅ description - Descripción del punto
- ✅ points - Puntos otorgados

#### **ranking_history**
- ✅ id, fecha, user_id, season_id - USO PRINCIPAL
- ✅ posicion, puntos_acumulados - Datos de ranking
- ✅ torneos_jugados - Contador de torneos

#### **commission_pools**
- ✅ id, pool_type - USO PRINCIPAL (monthly/quarterly/copa_don_humberto/house)
- ✅ period_identifier - Identificador de período
- ✅ accumulated_amount - Monto acumulado
- ✅ status - Estado (active/closed/paid)
- ✅ closed_at, paid_at - Timestamps de cierre y pago
- ✅ notes - Notas adicionales
- ✅ created_at, updated_at - Timestamps

#### **settings**
- ✅ id, key, value - USO PRINCIPAL para configuraciones
- ✅ description - Descripción de la configuración
- ✅ updated_at - Timestamp

#### **tournament_points**
- ✅ id, tournament_id, position, points - USO PRINCIPAL
- Sistema de tabla de puntos por posición

---

### ⚠️ TABLAS LEGACY / OBSOLETAS

#### **players** - ⚠️ TABLA LEGACY
Esta tabla era el sistema antiguo de jugadores. Ahora se usa **users** con `is_player=true`.

**Columnas:**
- id, first_name, last_name, email, phone_number, nickname
- created_at, current_points, suspended, is_deleted

**Estado:** 
- ❌ Modelo existe pero **NO SE USA** en código de producción
- ⚠️ Solo hay menciones en código de desarrollo/migración
- ✅ **RECOMENDACIÓN: DEPRECAR COMPLETAMENTE**

---

### 📊 RESUMEN DE COLUMNAS CON POCO/NINGÚN USO

1. **users.first_name y users.last_name**
   - Solo se usan en imports CSV y migración de players
   - No se muestran en la UI (se usa full_name)
   - **Recomendación:** Considerar hacer NULLABLE o eliminar si no se planea usar

2. **users.suspended**
   - Definido en modelo pero **nunca usado** en lógica de negocio
   - No hay UI ni funcionalidad para suspender usuarios
   - **Recomendación:** Implementar funcionalidad o eliminar columna

3. **cash_participants.seat_number**
   - Opcional y raramente usado
   - No se muestra en ninguna UI
   - **Recomendación:** Mantener por flexibilidad, pero no es crítico

4. **Toda la tabla players**
   - Sistema legacy completamente reemplazado por users
   - **Recomendación:** ELIMINAR tabla después de confirmar migración completa

---

### 🔧 ACCIONES RECOMENDADAS

#### Prioridad ALTA:
1. ✅ Eliminar tabla **players** (ya no se usa)
2. ✅ Revisar si hay FKs que apunten a players y eliminarlas

#### Prioridad MEDIA:
3. ⚠️ Implementar funcionalidad de **suspended** o eliminar la columna
4. ⚠️ Decidir si mantener **first_name/last_name** o hacerlas opcionales

#### Prioridad BAJA:
5. 💡 Documentar mejor el uso de **seat_number** en cash_participants

---

### 📝 NOTAS ADICIONALES

- Todas las tablas principales están siendo usadas correctamente
- El sistema de payments es robusto y flexible
- El sistema de puntos e historical_points funciona bien
- Commission pools está correctamente implementado
- Settings permite configuración dinámica

**Conclusión:** El esquema está en buen estado. Solo necesita limpieza de tabla legacy (players) y decisión sobre columnas poco usadas (suspended, first_name, last_name).
