# Implementación del Sistema de Comisiones y Pozos Acumulados

## ✅ Completado

### 1. Modelos de Base de Datos
- **`Setting`** - Tabla para configuración persistente (comisiones, porcentajes)
- **`CommissionPool`** - Tabla para rastrear pozos acumulados con estados (active/closed/paid)

### 2. Integración de Historical Points en Ranking
- **Modificado `adminRankingRoutes.ts`** para sumar todos los `historical_points` al calcular el ranking
- Los puntos ahora se agregan automáticamente desde la tabla `historical_points`
- Se re-ordenan los jugadores después de sumar los puntos históricos
- **Vista actualizada** para mostrar columna de "Puntos Históricos" además del total

### 3. Configuración de Comisiones (Admin UI)
**Ruta:** `/admin/games/settings/commissions`
- Formulario para editar porcentajes de comisión:
  - Comisión total (%)
  - Ranking trimestral (%)
  - Especial del mes (%)
  - Copa Don Humberto (%)
  - Casa (%)
- Se almacena en la tabla `settings`
- Valores por defecto: 20% total (1% + 1% + 1% + 17%)

### 4. Dashboard de Pozos Acumulados
**Ruta:** `/admin/games/settings/pools`
- **Vista resumen** con 4 cards mostrando acumulados por tipo:
  - 💰 Especial Mensual
  - 🏆 Ranking Trimestral
  - 👑 Copa Don Humberto
  - 🏠 Casa
- **Tabla histórica** de todos los pozos con:
  - Estados: Activo / Cerrado / Pagado
  - Acciones: Cerrar pozo / Marcar como pagado
- **Control por admin**: puede cerrar pozos y marcarlos como pagados cuando se liquidan

### 5. Scripts de Inicialización
- **`sync_commission_tables.ts`** - Crea las tablas nuevas (settings, commission_pools)
- **`init_commission_config.ts`** - Inicializa configuración por defecto y pozos del período actual

### 6. Enlaces en Admin Settings
- Agregados enlaces desde `/admin/games/settings` a las nuevas secciones

## 📊 Flujo de Trabajo

1. **Admin configura porcentajes** en `/admin/games/settings/commissions`
2. **Al cerrar torneos**, el sistema calcula comisiones y las distribuye a pozos según configuración
3. **Admin revisa acumulados** en `/admin/games/settings/pools`
4. **Admin cierra pozos** cuando decide terminar un ranking (mensual, trimestral, etc.)
5. **Admin marca como pagado** cuando liquida el premio

## 🚀 Cómo Usar

### Inicialización (primera vez)
```bash
# Crear tablas
node -r ts-node/register scripts/sync_commission_tables.ts

# Configuración inicial
node -r ts-node/register scripts/init_commission_config.ts
```

### Acceso Admin
1. Ir a `/admin/games/settings`
2. Click en "💰 Configurar Comisiones" para editar porcentajes
3. Click en "📊 Ver Pozos Acumulados" para dashboard

## 📝 Pendiente de Implementar

### Cálculo Automático de Comisiones
Cuando se cierra un torneo (vía `/admin/tournaments/:id/close`), el sistema debe:
1. Calcular comisión total según configuración (ej: 20% del pozo)
2. Distribuir según porcentajes:
   - 1% → pozo mensual del período actual
   - 1% → pozo trimestral del período actual
   - 1% → Copa Don Humberto del año actual
   - 17% → casa del mes actual
3. Actualizar `accumulated_amount` de cada `CommissionPool`

### Puntos por Cajas (150/200 según día)
- Lunes/Miércoles: 150 puntos por caja total
- Viernes: 200 puntos por caja total
- Distribuir entre mesa final según porcentajes

### Bonus de Asistencia
- 🥉 Bronce: 500pts (3 jornadas/semana)
- 🥈 Plata: 2000pts (10 jornadas/mes)
- 🥇 Oro: 5000pts (28/35 jornadas)
- 💎 Diamante: 10000pts (32/35 jornadas)
- ⚫ Black: 10000pts (16 mesas finales)

## 🎯 Estado Actual

✅ **Infraestructura completa** para gestión de comisiones y pozos
✅ **Historical points integrados** en ranking visible
✅ **UI admin funcional** para configurar y monitorear

⏳ **Falta**: Lógica de negocio para calcular/distribuir comisiones automáticamente cuando se cierra torneo
⏳ **Falta**: Implementación de bonus de asistencia y puntos por cajas
