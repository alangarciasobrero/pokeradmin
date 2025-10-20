# chore(users): unificar players → users, añadir `is_player` y panel/admin mejoras

Resumen de cambios

 Feature: Admin tournaments CRUD (SSR) and dev auto-login
 
 Additional change set pending in a follow-up branch: registrations (SSR) to allow admins to register players into tournaments from the admin UI. That work will add a minimal admin list and create form for registrations and wire it to the existing `Registration` model and `/api/registrations` endpoints.
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
