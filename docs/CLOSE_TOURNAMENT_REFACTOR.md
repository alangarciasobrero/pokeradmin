# Refactorización: Flujo de Cierre de Torneo

## ✅ Cambios Implementados

### 1. **Botón "Cerrar Inscripciones"** - Flujo Principal

**Antes:**
- Solo cambiaba `tournament.registration_open = false`
- No calculaba nada

**Ahora:**
- Abre modal completo con toda la información del torneo
- Calcula y muestra:
  - 💰 Pozo total
  - 💵 Comisiones (20% editables)
  - 🏆 Puntos de ranking para top 9 (mesa final)
  - 💶 Premios en efectivo para top 20

---

## 📊 Modal de Finalización

### Información Mostrada:

#### 1. **Resumen Financiero**
```
Pozo total: XXX EUR
Total cajas: XX
Comisiones (Total 20%):
  🏢 Casa: 18% = XXX EUR
  🏆 Ranking Temporada: 1% = XXX EUR
  ⭐ Ranking Anual: 1% = XXX EUR
  Total comisión: XXX EUR
Pozo para premios: XXX EUR
```

#### 2. **Puntos de Ranking - Mesa Final (Top 9)**
| Posición | % | Puntos | Jugador |
|----------|---|--------|---------|
| 1º | 23% | XXX | [dropdown] |
| 2º | 17% | XXX | [dropdown] |
| 3º | 14% | XXX | [dropdown] |
| 4º | 11% | XXX | [dropdown] |
| 5º | 9% | XXX | [dropdown] |
| 6º | 8% | XXX | [dropdown] |
| 7º | 7% | XXX | [dropdown] |
| 8º | 6% | XXX | [dropdown] |
| 9º | 5% | XXX | [dropdown] |

**Total:** Suma de todos los puntos = puntos por cajas del torneo
- Lunes/Miércoles: 150 pts × total cajas
- Viernes: 200 pts × total cajas

#### 3. **Premios en Efectivo (Top 20)**
| Posición | % | Monto EUR | Jugador |
|----------|---|-----------|---------|
| 1º | 23% | XXX | [dropdown] |
| 2º | 17% | XXX | [dropdown] |
| 3º | 14% | XXX | [dropdown] |
| 4º | 11% | XXX | [dropdown] |
| 5º | 9% | XXX | [dropdown] |
| 6º | 8% | XXX | [dropdown] |
| 7º | 7% | XXX | [dropdown] |
| 8º | 6% | XXX | [dropdown] |
| 9º | 5% | XXX | [dropdown] |
| 10º-20º | 0% | 0 | - |

---

## 🔧 Backend: Endpoint `POST /admin/games/tournaments/:id/confirm-close`

### Request Body:
```json
{
  "commissionPct": 20,
  "prizes": [
    { "position": 1, "user_id": 123, "amount": 1500.50 },
    { "position": 2, "user_id": 456, "amount": 1000.00 },
    ...
  ],
  "positions": [
    { "position": 1, "user_id": 123 },
    { "position": 2, "user_id": 456 },
    ...
  ]
}
```

### Proceso Ejecutado:

1. **Validar premios** no excedan pozo disponible
2. **Crear Payment de comisión** (source='commission')
3. **Crear Payments de premios** (source='tournament_payout', negativos)
4. **✨ NUEVO: Crear registros en Result**:
   ```javascript
   {
     tournament_id: id,
     user_id: userId,
     position: position,
     points: rankingPoints,        // desde points_table.json
     final_table: position <= 9,   // booleano
     prize_amount: prizeAmount,
     bounty_count: 0
   }
   ```
5. **Finalizar torneo**: `registration_open = false`, `end_date = now`
6. **Distribuir comisión** a pozos (mensual/trimestral/copa/casa)
7. **Distribuir puntos por cajas** a mesa final con porcentajes

### Response:
```json
{
  "ok": true,
  "pot": 5000,
  "commissionAmount": 1000,
  "prizePool": 4000
}
```

---

## 📋 Tabla `results`

### Registros Creados:
```sql
INSERT INTO results (
  tournament_id,
  user_id,
  position,       -- 1, 2, 3, etc.
  points,         -- desde points_table.json
  final_table,    -- true si position <= 9
  prize_amount,   -- monto del premio en EUR
  bounty_count
) VALUES ...
```

### Ejemplo:
| tournament_id | user_id | position | points | final_table | prize_amount |
|---------------|---------|----------|--------|-------------|--------------|
| 42 | 123 | 1 | 100 | true | 1150.50 |
| 42 | 456 | 2 | 75 | true | 850.00 |
| 42 | 789 | 9 | 26 | true | 200.00 |
| 42 | 234 | 15 | 12 | false | 0.00 |

---

## 🎯 Cálculo de Puntos de Ranking

### 1. **Puntos Base** (desde `points_table.json`)
```json
{
  "points": [100, 75, 60, 50, 45, 40, 36, 32, 29, 26, 24, 22, 20, 18, 16, 14, 12, 10, 8, 6]
}
```
- 1º lugar = 100 pts
- 2º lugar = 75 pts
- 3º lugar = 60 pts
- etc.

### 2. **Puntos por Cajas** (distribuidos a mesa final)
```javascript
const dayOfWeek = tournamentDate.getDay();
const pointsPerBox = (dayOfWeek === 5) ? 200 : 150; // Viernes vs Lun/Mié
const totalBoxPoints = pointsPerBox * totalBoxes;
```

**Distribución mesa final:**
| Posición | % | Cálculo |
|----------|---|---------|
| 1º | 23% | totalBoxPoints × 0.23 |
| 2º | 17% | totalBoxPoints × 0.17 |
| 3º | 14% | totalBoxPoints × 0.14 |
| 4º | 11% | totalBoxPoints × 0.11 |
| 5º | 9% | totalBoxPoints × 0.09 |
| 6º | 8% | totalBoxPoints × 0.08 |
| 7º | 7% | totalBoxPoints × 0.07 |
| 8º | 6% | totalBoxPoints × 0.06 |
| 9º | 5% | totalBoxPoints × 0.05 |

**Total:** 100% de los puntos por cajas

### 3. **Total Puntos del Jugador**
```
Total = Puntos Base (position) + Puntos por Cajas (% de mesa final) + Bonos históricos
```

---

## 🏆 Integración con Ranking

### Vista `/admin/games/ranking`

**Query ejecutado:**
```javascript
// 1. Sumar puntos desde results
const resultsPoints = SUM(results.points) GROUP BY user_id

// 2. Sumar puntos históricos
const historicalPoints = SUM(historical_points.points) GROUP BY user_id

// 3. Total por jugador
total_points = resultsPoints + historicalPoints
```

**Columnas mostradas:**
- Posición
- Jugador
- Puntos de Torneos (desde results)
- Puntos Históricos (desde historical_points)
- **Total Puntos**
- Ganancias

---

## 🔄 Flujo Completo de Usuario

### Admin cierra torneo:

1. **Hacer clic en "🏁 Cerrar Inscripciones y Finalizar Torneo"**

2. **Se abre modal mostrando:**
   - Pozo total calculado
   - Comisión editable (20%)
   - Tabla de puntos de ranking (top 9)
   - Tabla de premios (top 20)

3. **Admin asigna:**
   - Jugadores a cada posición (dropdown)
   - Ajusta montos de premios si necesario
   - Ajusta % de comisión si necesario

4. **Hacer clic en "✓ Confirmar y Finalizar"**

5. **Backend ejecuta:**
   - ✅ Guarda Payment de comisión
   - ✅ Guarda Payments de premios
   - ✅ **Crea registros en Result** con positions, points, final_table
   - ✅ Marca torneo como cerrado
   - ✅ Distribuye comisión a pozos
   - ✅ Distribuye puntos por cajas a mesa final

6. **Resultado:**
   - ✅ Torneo cerrado
   - ✅ Premios registrados
   - ✅ Posiciones guardadas
   - ✅ Ranking actualizado
   - ✅ Comisiones distribuidas

---

## 📝 Cambios en Archivos

### `src/routes/adminTournamentRoutes.ts`
- ✅ Modificado `GET /:id/preview-close`:
  - Agregado cálculo de `boxPoints`
  - Agregado `rankingPointsDistribution` con porcentajes
  - Cambiado comisión default a 20%
  - Agregado `prizePercentages` para top 20

- ✅ Modificado `POST /:id/confirm-close`:
  - Agregado parámetro `positions` en body
  - Agregado creación de registros en `Result`
  - Integrado cálculo de ranking points desde `points_table.json`
  - Mantiene distribución de comisiones y puntos por cajas

### `src/views/tournaments/detail.handlebars`
- ✅ Modificado botón "Cerrar Inscripciones":
  - Renombrado a "🏁 Cerrar Inscripciones y Finalizar Torneo"
  - Abre modal completo con toda la info

- ✅ Eliminado botón "Cerrar Torneo" (redundante)

- ✅ Modificado modal:
  - Layout mejorado con secciones coloreadas
  - Tabla de puntos de ranking (top 9) con porcentajes
  - Tabla de premios (top 20) con porcentajes
  - Dropdowns para asignar jugadores
  - Validación de suma de premios vs pozo

- ✅ Modificado handler de confirmación:
  - Recolecta `positions` desde dropdowns de ranking
  - Envía `positions` junto con `prizes` y `commissionPct`
  - Muestra mensaje de éxito con detalles

---

## ✅ Estado Actual

### Funcionalidades Completadas:
- ✅ Modal completo con cálculos de pot, comisiones, premios y puntos
- ✅ Distribución de puntos de ranking según porcentajes (23/17/14/11/9/8/7/6/5%)
- ✅ Distribución de premios según porcentajes (23/17/14/11/9/8/7/6/5% + 10-20 en 0%)
- ✅ Guardado de posiciones en tabla `Result`
- ✅ Cálculo automático de `final_table` (position <= 9)
- ✅ Cálculo de ranking points desde `points_table.json`
- ✅ Integración con distribución de comisiones a pozos
- ✅ Integración con distribución de puntos por cajas

### Pendiente de Testing:
- 🔍 Probar flujo completo en navegador
- 🔍 Verificar que se crean correctamente los registros en `Result`
- 🔍 Validar que el ranking muestra correctamente los puntos
- 🔍 Confirmar distribución de comisiones a pozos
- 🔍 Confirmar distribución de puntos por cajas

---

**Fecha:** 23 de noviembre, 2025  
**Estado:** Implementación completa, listo para testing
