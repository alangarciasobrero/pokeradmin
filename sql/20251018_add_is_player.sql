-- Añade columna is_player y copia valores desde role='player'
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS is_player BOOLEAN NOT NULL DEFAULT FALSE;

-- Marcar como player los registros con role='player' (si existieran)
UPDATE users SET is_player = TRUE WHERE role = 'player';

-- Opcional: si querés limpiar el ENUM y dejar sólo admin/user, ejecuta after review:
-- ALTER TABLE users MODIFY COLUMN role ENUM('admin','user') NOT NULL DEFAULT 'admin';

-- Nota: haz backup antes de ejecutar. Ejecuta con MySQL Workbench o cliente CLI.
