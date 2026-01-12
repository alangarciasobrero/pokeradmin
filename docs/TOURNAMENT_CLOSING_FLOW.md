# Flujo de Cierre de Torneo - Explicación Completa

## 📋 Estado Actual del Sistema

### Problema Identificado
El flujo actual de cierre de torneo tiene **2 etapas confusas** y **NO permite asignar posiciones** correctamente a los jugadores.

---

## 🔴 FLUJO ACTUAL (PROBLEMÁTICO)

### Botón 1: "Cerrar Inscripciones"
**¿Qué hace?**
- Simplemente cambia `tournament.registration_open = false`
- Impide que se registren más jugadores
- NO tiene nada que ver con finalizar el torneo
- NO calcula premios ni comisiones

**Código:**
```typescript
router.post('/:id/close-registrations', requireAdmin, async (req: Request, res: Response) => {
  const t = await Tournament.findByPk(id);
  t.registration_open = false;
  await t.save();
});
```

---

### Botón 2: "Cerrar Torneo"
**¿Qué hace?**
- Simplemente marca `tournament.end_date = new Date()`
- NO distribuye premios
- NO calcula comisiones
- NO guarda posiciones

**Código:**
```typescript
router.post('/:id/close-tournament', requireAdmin, async (req: Request, res: Response) => {
  const t = await Tournament.findByPk(id);
  t.end_date = new Date();
  await t.save();
});
```

---

### Botón 3: "Finalizar y Distribuir Premios" (Modal)
**¿Qué hace?** ✅ ESTE ES EL IMPORTANTE
1. Abre modal con vista previa de:
   - Pozo total calculado (suma de pagos)
   - Comisión sugerida (10% por defecto, editable)
   - Premios sugeridos (50/30/20 o winner-takes-all)
   - Lista de participantes

2. **Botón "Asignar como ganador"**: 
   - **NO asigna posición final del torneo**
   - Solo rellena automáticamente el dropdown de "a quién dar premio"
   - Es un helper UI para asignar premios rápido

3. Al confirmar:
   - Crea Payment de comisión (source='commission')
   - Crea Payment de premios (source='tournament_payout', negativos)
   - Marca `registration_open = false` y `end_date = now`
   - 🆕 Distribuye comisión a pozos (mensual/trimestral/copa/casa)
   - 🆕 Calcula y distribuye puntos por cajas a mesa final

**Código:**
```typescript
router.post('/:id/confirm-close', requireAdmin, async (req: Request, res: Response) => {
  // Calcula pot desde payments
  // Valida que premios no excedan pot
  // Crea Payment para comisión
  // Crea Payments negativos para premios
  // Distribuye comisión a pozos
  // Distribuye puntos por cajas
  // Finaliza torneo
});
```

---

## ❌ PROBLEMA PRINCIPAL: NO SE GUARDAN POSICIONES

### ¿Dónde deberían guardarse las posiciones?
En la tabla **`results`**:
```sql
CREATE TABLE results (
  id INT PRIMARY KEY,
  tournament_id INT,
  user_id INT,
  position INT,           -- ⭐ POSICIÓN FINAL
  points INT,             -- Puntos obtenidos según points_table.json
  bounty_count INT,
  final_table BOOLEAN,    -- ⭐ SI LLEGÓ A MESA FINAL
  prize_amount DECIMAL,
  created_at TIMESTAMP
);
```

### ¿Qué ruta existe para guardar posiciones?
Sí existe: **POST `/admin/games/tournaments/:id/positions`**

```typescript
router.post('/:id/positions', requireAdmin, async (req: Request, res: Response) => {
  const { positions } = req.body; 
  // positions = [{ registration_id, user_id, position }, ...]
  
  // Para cada position:
  // - Busca en points_table el puntaje correspondiente
  // - Determina si llegó a mesa final (position <= 9)
  // - Crea registro en Result con position, points, final_table
});
```

**PERO**: Esta ruta **NO está integrada en el UI del modal** de cierre.

---

## 🔧 LO QUE FALTA IMPLEMENTAR

### Problema 1: Modal no permite asignar posiciones
**Solución requerida:**
- Agregar inputs de posición en el modal (1º, 2º, 3º, etc.)
- Cambiar "Asignar como ganador" por "Asignar posición"
- Al confirmar, enviar `positions` array además de `prizes`

### Problema 2: confirm-close no guarda en `results`
**Solución requerida:**
- Después de crear premios, llamar a la lógica de `/positions`
- Crear registros en `Result` con position, points, final_table

### Problema 3: Botones redundantes
**Propuesta:**
- "Cerrar Inscripciones": Mantener (útil para bloquear nuevos registros antes del torneo)
- "Cerrar Torneo": Eliminar o renombrar a "Marcar como Finalizado" (solo para casos sin premios)
- "Finalizar y Distribuir Premios": ⭐ **ESTE DEBE SER EL FLUJO PRINCIPAL**

---

## ✅ FLUJO CORRECTO PROPUESTO

### 1. Durante el torneo
- Admin puede "Cerrar Inscripciones" cuando empieza el juego (opcional)

### 2. Al finalizar el torneo
- Admin hace clic en **"Finalizar y Distribuir Premios"**
- Modal muestra:
  - Lista de participantes
  - Para cada premio: **Dropdown de jugador** + **Input de posición**
  - Pozo, comisión, premios editables
- Admin asigna posiciones y premios
- Admin confirma

### 3. Backend ejecuta (en confirm-close):
```typescript
1. Validar que premios no excedan pot
2. Crear Payment de comisión
3. Crear Payments de premios (negativos)
4. ⭐ NUEVO: Crear registros en Result con positions, points, final_table
5. Distribuir comisión a pozos
6. Calcular y distribuir puntos por cajas a mesa final
7. Marcar torneo como cerrado
```

---

## 📊 IMPACTO EN RANKING

### Actualmente:
- `adminRankingRoutes` calcula ranking desde tabla `results`
- Si `results` está vacía → ranking solo muestra historical_points

### Con la solución:
- confirm-close crea registros en `results`
- Ranking automáticamente suma:
  - Puntos de torneos (desde results.points)
  - Puntos históricos (desde historical_points)
  - Total correcto

---

## 🎯 RESUMEN EJECUTIVO

### ¿Qué hace cada botón AHORA?
1. **Cerrar Inscripciones**: Solo bloquea nuevos registros
2. **Cerrar Torneo**: Solo marca fecha de fin (inútil)
3. **Finalizar y Distribuir Premios**: Calcula premios y comisiones
4. **"Asignar como ganador"**: Helper UI para rellenar dropdown de premio

### ¿Qué FALTA?
- ❌ Guardar posiciones finales en tabla `results`
- ❌ Calcular puntos según `points_table.json`
- ❌ Marcar quiénes llegaron a mesa final

### ¿Qué IMPLEMENTAR?
1. Modificar modal para incluir inputs de posición
2. Modificar `confirm-close` para crear registros en `Result`
3. Reutilizar lógica existente de `/positions` endpoint

---

## 🚀 PRÓXIMOS PASOS

### Opción A: Flujo Simplificado (Recomendado)
**Unificar todo en confirm-close:**
- Modal pide: premios + posiciones
- Backend: guarda premios, posiciones, comisiones, puntos por cajas
- Eliminar botón "Cerrar Torneo" redundante

### Opción B: Flujo en 2 Etapas
**Separar asignación de posiciones:**
1. Admin usa modal para asignar posiciones → guarda en `results`
2. Admin usa modal para distribuir premios → guarda pagos

### Opción C: Formulario Dedicado
**Crear página separada:**
- `/admin/games/tournaments/:id/finalize`
- Formulario completo con tabla de posiciones + premios
- Más espacio visual, menos restricciones de modal

---

## 📝 NOTAS TÉCNICAS

### Tabla `results` vs `registrations`
- `registrations`: Quién se inscribió (con action_type: buyin/reentry/duplo)
- `results`: Quién ganó y en qué posición (con points, prize_amount, final_table)

### Cálculo de puntos
```javascript
// points_table.json
{ "1": 100, "2": 70, "3": 50, ... }

// Backend al guardar position
const pointsTable = JSON.parse(fs.readFileSync('points_table.json'));
const points = pointsTable[position.toString()] || 0;
```

### Mesa final
```javascript
const finalTable = position <= 9; // Primeros 9 lugares
```

### Puntos por cajas
```javascript
// Se calculan en confirm-close
const boxPoints = bonusService.calculateBoxPoints(date, totalBoxes);
// 150 pts/caja (Lun/Mié) o 200 pts/caja (Vie)
// Se distribuyen entre usuarios de mesa final por porcentajes
```

---

**Fecha:** 22 de noviembre, 2025
**Estado:** Documentación técnica
