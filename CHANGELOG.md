# Changelog

## 2025-10-18 — Unificar players → users; añadir `is_player`

- Unificación de `players` dentro de `users`. Se introdujo el flag boolean `is_player` para marcar qué usuarios tienen perfil jugador.
- Scripts y SQL de migración incluidos (`scripts/ensure_is_player.ts`, `sql/20251018_add_is_player.sql`).
- Actualizaciones en modelos (`User`, `CashGame`, `Registration`, `Result`) y rutas (API CRUD de usuarios, panel admin para partidas).
- Recordatorio: hacer backup antes de aplicar en producción.
