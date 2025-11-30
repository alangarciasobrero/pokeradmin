# Flujo Correcto de Torneos - 2 Etapas

## 📋 Flujo Implementado

### **Etapa 1: Cerrar Inscripciones** 🔒
**Botón:** "🔒 Cerrar Inscripciones"  
**Acción:** `POST /admin/games/tournaments/:id/close-registrations`

**¿Qué hace?**
- Marca `tournament.registration_open = false`
- Bloquea nuevos registros de jugadores
- **NO calcula nada**
- **NO asigna posiciones**
- **NO distribuye premios**

**Cuándo usarlo:**
- Al comenzar el torneo
- Para evitar que se registren más jugadores durante el juego

---

### **Etapa 2: Finalizar Torneo** 🏁
**Botón:** "🏁 Finalizar Torneo y Asignar Premios"  
**Acción:** Abre modal → `POST /admin/games/tournaments/:id/confirm-close`

**¿Qué hace?**

#### 📊 Modal muestra:

1. **💰 Resumen Financiero**
   - Pozo total (suma de pagos)
   - Total de cajas
   - Desglose de comisiones:
     - 🏢 Casa: 18%
     - 🏆 Ranking Temporada: 1%
     - ⭐ Ranking Anual: 1%
   - Pozo disponible para premios

2. **🏆 Puntos de Ranking (Mesa Final - Top 9)**
   - Tabla con porcentajes por posición:
     - 1º: 23%, 2º: 17%, 3º: 14%, 4º: 11%, 5º: 9%
     - 6º: 8%, 7º: 7%, 8º: 6%, 9º: 5%
   - Total puntos = (150 o 200) × número de cajas
   - Dropdown para asignar jugador a cada posición

3. **💵 Premios en Efectivo (Top 20)**
   - Tabla con porcentajes por posición:
     - 1º-9º: mismos % que ranking
     - 10º-20º: 0%
   - Montos editables
   - Dropdown para asignar jugador a cada premio

#### ⚙️ Al confirmar, el backend:

1. **Valida** que suma de premios no exceda el pozo
2. **Crea Payment de comisión** (source='commission')
3. **Crea Payments de premios** (source='tournament_payout', negativos)
4. **✨ Crea registros en Result**:
   ```javascript
   {
     tournament_id: id,
     user_id: userId,
     position: 1..20,              // Posición final
     points: 100..6,               // Desde points_table.json
     final_table: position <= 9,   // Boolean
     prize_amount: XXX,            // EUR
     bounty_count: 0
   }
   ```
5. **Marca torneo cerrado**: `registration_open = false`, `end_date = now`
6. **Distribuye comisión** a pozos (casa/temporada/anual)
7. **Distribuye puntos por cajas** a mesa final con porcentajes

---

## 🎯 Diferencia Clave

| Acción | Cerrar Inscripciones | Finalizar Torneo |
|--------|---------------------|------------------|
| **Timing** | Al empezar el juego | Al terminar el torneo |
| **Bloquea registros** | ✅ Sí | ✅ Sí (ya cerrados) |
| **Asigna posiciones** | ❌ No | ✅ Sí (en Result) |
| **Calcula premios** | ❌ No | ✅ Sí |
| **Distribuye comisiones** | ❌ No | ✅ Sí |
| **Actualiza ranking** | ❌ No | ✅ Sí |

---

## 🔄 Flujo Completo del Usuario

### 1️⃣ **Antes del Torneo**
- Admin crea torneo
- Jugadores se registran

### 2️⃣ **Al Comenzar el Juego**
- Admin hace clic en "🔒 Cerrar Inscripciones"
- Ya no se permiten más registros
- Torneo en progreso

### 3️⃣ **Durante el Torneo**
- Se juega el torneo
- Se eliminan jugadores
- Se determina mesa final

### 4️⃣ **Al Terminar el Torneo**
- Admin hace clic en "🏁 Finalizar Torneo y Asignar Premios"
- Se abre modal con cálculos automáticos
- Admin asigna:
  - ✅ Posiciones finales (1º-20º) usando dropdowns
  - ✅ Premios en efectivo (edita montos si necesario)
- Admin hace clic en "✓ Confirmar y Finalizar Torneo"

### 5️⃣ **Backend Ejecuta Automáticamente**
- ✅ Guarda posiciones en Result
- ✅ Calcula puntos de ranking
- ✅ Crea pagos de premios
- ✅ Distribuye comisiones a pozos
- ✅ Distribuye puntos por cajas
- ✅ Actualiza ranking general

### 6️⃣ **Resultado Final**
- ✅ Torneo cerrado
- ✅ Posiciones guardadas
- ✅ Premios registrados
- ✅ Ranking actualizado
- ✅ Comisiones distribuidas

---

## 📝 Endpoints

### Cerrar Inscripciones
```
POST /admin/games/tournaments/:id/close-registrations
Body: (vacío)
Response: Redirect a /admin/games/tournaments/:id
```

### Reabrir Inscripciones
```
POST /admin/games/tournaments/:id/open-registrations
Body: (vacío)
Response: Redirect a /admin/games/tournaments/:id
```

### Preview de Cierre (para modal)
```
GET /admin/games/tournaments/:id/preview-close
Response: {
  pot: 5000,
  commissionPct: 20,
  commissionHousePct: 18,
  commissionSeasonPct: 1,
  commissionAnnualPct: 1,
  commissionHouse: 900,
  commissionSeason: 50,
  commissionAnnual: 50,
  commissionAmount: 1000,
  prizePool: 4000,
  defaultPrizes: [...],
  rankingPointsDistribution: [...],
  participants: [...]
}
```

### Finalizar Torneo
```
POST /admin/games/tournaments/:id/confirm-close
Body: {
  commissionPct: 20,
  prizes: [{ position, user_id, amount }, ...],
  positions: [{ position, user_id }, ...]
}
Response: {
  ok: true,
  pot: 5000,
  commissionAmount: 1000,
  prizePool: 4000
}
```

---

## ✅ Estado Actual

- ✅ Botón "Cerrar Inscripciones" separado (simple POST)
- ✅ Botón "Finalizar Torneo" con modal completo
- ✅ Modal muestra resumen financiero con comisiones correctas (18%+1%+1%)
- ✅ Modal muestra puntos de ranking para top 9
- ✅ Modal muestra premios para top 20
- ✅ Backend guarda posiciones en Result
- ✅ Backend calcula puntos de ranking
- ✅ Backend distribuye comisiones
- ✅ Backend distribuye puntos por cajas

**Fecha:** 23 de noviembre, 2025  
**Estado:** ✅ Flujo correcto implementado - 2 botones separados
