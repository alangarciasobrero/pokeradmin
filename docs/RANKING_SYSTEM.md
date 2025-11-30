# Sistema de Ranking - Ramos Poker

## 📊 Cálculo de Puntos por Torneo

### Puntos Base por Posición
Los puntos se distribuyen según una tabla de posiciones (configurable en `rankingCalculator.ts`).

### Puntos por Cajas (Buy-ins + Re-entries)
- **Lunes y Miércoles:** 150 puntos por caja total
- **Viernes:** 200 puntos por caja total
- Estos puntos se reparten entre los jugadores que llegaron a **Mesa Final** según porcentajes fijos configurables

### Doble Ranking
En torneos marcados con `double_points = true`, **todos los puntos suman el doble**.

### Puntos por Asistencia
- **100 puntos** por asistir a cada fecha de torneo (todos los participantes)

### Puntos por Re-entry
- **100 puntos** por cada re-entry realizado (puntos personales del jugador)

---

## 🏆 Bonus de Asistencia

### 🥉 BRONCE
**500 puntos extras** para jugadores que asistan a las **3 jornadas de la semana** (Lunes, Miércoles, Viernes)

### 🥈 PLATA
**2,000 puntos extras** para jugadores que asistan al menos **10 jornadas mensuales**

### 🥇 ORO
**5,000 puntos extras** para jugadores que asistan al menos **28 jornadas** de las 35 que dura el ranking

### 💎 DIAMANTE
**10,000 puntos extras** para jugadores que asistan al menos **32 jornadas** de las 35 que dura el ranking

### ⚫ BLACK (Mesa Final)
**10,000 puntos extras** para jugadores que hayan disputado al menos **16 mesas finales**

---

## 💰 Sistema de Comisiones

### Estructura General
- **Comisión total:** 20% del pozo acumulado (buy-in + re-entries)
- **Knockout/Bounty:** NO forma parte del pozo ni tiene comisión
  - Es un monto adicional por jugador que se reparte en la mesa
  - Quien elimina a un jugador se queda con su bounty
  - No suma al prize pool ni se le aplica comisión

### Distribución de la Comisión (20% del pozo)

1. **18% - Casa**
   - Comisión operativa

2. **1% - Ranking de la Temporada**
   - Pozo acumulado para el ranking trimestral/temporada de colores

3. **1% - Ranking Anual**
   - Pozo acumulado para el ranking del año completo

---

## 🎯 Premios del Ranking

El ranking garantiza:
- **Campeón (1er lugar):** 2 entradas al Día 1B del torneo final
- **Puestos 2-10:** 1 entrada al Día 1B del torneo final

---

## 📋 Implementación Técnica

### Modelos
- `Tournament.double_points` - Marca torneos de doble ranking
- `HistoricalPoint.action_type` - Tipos: `attendance`, `reentry`, `final_table`, `placement`, `bonus`
- `Result.final_table` - Marca si el jugador llegó a mesa final

### Cálculos Pendientes
- [ ] Calcular puntos por cajas según día de la semana
- [ ] Distribuir puntos de cajas entre mesa final
- [ ] Implementar bonus Bronce (3 jornadas semanales)
- [ ] Implementar bonus Plata (10 jornadas mensuales)
- [ ] Implementar bonus Oro (28 de 35 jornadas)
- [ ] Implementar bonus Diamante (32 de 35 jornadas)
- [ ] Implementar bonus Black (16 mesas finales)
- [ ] Sistema de comisiones: 20% del pozo (buy-in + re-entries), bounty excluido
- [ ] Integrar `historical_points` en vista de ranking

### Nota sobre Bounty/Knockout
El campo `tournament.knockout_bounty` representa el monto adicional por jugador que NO suma al pozo del torneo. Este dinero se juega en la mesa y se reparte entre jugadores (quien elimina se queda con el bounty del eliminado). No se le aplica comisión ni entra en el cálculo de premios del prize pool.

### Configuración
- Porcentajes de distribución de puntos de cajas: configurables
- Tabla de puntos por posición: configurables
- Duración de ranking: 35 jornadas (configurable por temporada)
