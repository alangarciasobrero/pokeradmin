
// Script de prueba: crea usuarios de ejemplo para testear el login.
// No usar en producción. Puedes modificar los usuarios y contraseñas para tests locales.
import bcrypt from 'bcrypt';
import User from './src/models/User';
import sequelize from './src/services/database';

async function createUser(username: string, password: string, full_name: string, role: 'admin' | 'user' = 'admin') {
  const password_hash = await bcrypt.hash(password, 10);
  await User.create({ username, password_hash, full_name, role });
  console.log(`Usuario creado: ${username} (${role})`);
}

async function main() {
  await sequelize.authenticate();
  // Cambia estos valores para crear distintos usuarios
  await createUser('admin', 'admin123', 'Administrador Principal', 'admin');
  await createUser('test1', 'clave123', 'Usuario de Prueba 1', 'user');
  await createUser('test2', 'clave456', 'Usuario de Prueba 2', 'user');
  await createUser('test3', 'clave789', 'Usuario de Prueba 3', 'user');
  await sequelize.close();
}

main().catch(e => { console.error(e); process.exit(1); });
