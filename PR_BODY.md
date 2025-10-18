# chore(users): unificar players → users, añadir `is_player` y panel/admin mejoras

Resumen de cambios

- Unificación de `players` en `users`: se eliminó el modelo/route `Player` y se actualizó la app para usar `users` como fuente única.
- Nuevo flag `is_player` (boolean) en la tabla `users` para indicar si un usuario tiene perfil de jugador.
- Script y SQL de migración:
  - `scripts/ensure_is_player.ts` — detecta/crea la columna `is_player` compatible con MySQL y marca los usuarios con `role='player'`.
  - `sql/20251018_add_is_player.sql` — SQL de referencia para ejecutar manualmente.
  - `scripts/mark_players.ts` — helper alternativo (requiere que la columna exista).
- Cambios en modelos y rutas:
  - `src/models/User.ts` actualizado (nuevos campos, `email` ahora nullable, `role` default `'user'`, `is_player` boolean).
  - `src/models/CashGame.ts`, `Registration.ts`, `Result.ts` y rutas relacionadas actualizadas para usar `user_id` (backward compatible con `player_id`).
- Nuevas rutas y vistas admin:
  - `src/routes/userApiRoutes.ts` (CRUD REST para usuarios).
  - `src/routes/adminGamesRoutes.ts` y vistas `src/views/admin_games.handlebars`, `src/views/admin/live_summary.handlebars` (panel admin con pestañas).
- Scripts y limpieza:
  - Se añadieron scripts de migración y se eliminaron artefactos de `Player` obsoletos (`src/models/Player.ts`, `src/routes/playerRoutes.ts`, etc).

Pruebas realizadas (smoke)

- Ejecuté `scripts/ensure_is_player.ts` en un entorno de desarrollo: agregó la columna `is_player` y actualizó 11 filas con `role='player'`.
- Creé un usuario de prueba vía API y verifiqué que aparece en `GET /api/users`.
- Hice login como admin y verifiqué que `GET /admin/games` renderiza correctamente.

Checklist para merge (recomendado)

- [ ] Hacer backup de la tabla `users` en production.
- [ ] Ejecutar migración en staging (usar `scripts/ensure_is_player.ts` o `sql/20251018_add_is_player.sql`).
- [ ] Ejecutar pruebas E2E manuales: creación de usuarios, login admin, registrations/results/cash-games.
- [ ] Revisar endpoints admin y permisos (`requireAdmin`).

Notas de migración y rollback

- SQL para añadir columna y marcar players (archivo `sql/20251018_add_is_player.sql`).
- Rollback de datos (si fuese necesario):
  - `UPDATE users SET is_player = FALSE WHERE role <> 'player';`
  - Para eliminar la columna: `ALTER TABLE users DROP COLUMN is_player;` (hacer backup primero).

Comandos útiles

```powershell
# Ejecutar script de migración programática
node -r ts-node/register scripts/ensure_is_player.ts

# Crear tag de release
git tag -a v2025.10.18-unify-users -m "Unificar players->users, is_player flag, admin UI"
git push origin --tags
```

Archivos clave

- `src/models/User.ts`
- `scripts/ensure_is_player.ts`, `scripts/mark_players.ts`
- `sql/20251018_add_is_player.sql`
- `src/routes/userApiRoutes.ts`
- `src/views/admin_games.handlebars`, `src/views/admin/live_summary.handlebars`

-- Fin del PR body
