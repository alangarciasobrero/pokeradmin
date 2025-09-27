
# PokerAdmin

## Descripción
PokerAdmin es una API REST desarrollada en Node.js y TypeScript para la gestión de torneos de poker, jugadores e inscripciones. Utiliza Express como framework web y Sequelize para la conexión y manipulación de datos en una base de datos MySQL.

## Características principales
- Gestión de torneos con todos los campos relevantes (nombre, fecha, buy-in, stack inicial, etc.)
- Endpoints RESTful para crear y consultar torneos
- Arquitectura modular con rutas, modelos y repositorios separados
- Configuración de base de datos mediante variables de entorno (.env)

## Estructura del proyecto

```
├── src/
│   ├── app.ts                # Configuración principal de Express
│   ├── server.ts             # Inicialización del servidor y conexión a la base de datos
│   ├── models/               # Modelos Sequelize (Tournament, Player, Registration)
│   ├── routes/               # Rutas de la API (tournamentRoutes, userRoutes, etc.)
│   ├── repositories/         # Lógica de acceso a datos (TournamentRepository)
│   └── services/             # Servicios como la conexión a la base de datos
├── .env                      # Variables de entorno para la configuración
├── package.json              # Dependencias y scripts
├── tsconfig.json             # Configuración de TypeScript
```

## Instalación y configuración

1. **Clona el repositorio:**
	```bash
	git clone https://github.com/alangarciasobrero/pokeradmin.git
	cd pokeradmin
	```

2. **Instala las dependencias:**
	```bash
	npm install
	```

3. **Configura la base de datos:**
	- Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido (ajusta los valores según tu entorno):
	  ```env
	  DB_NAME=nombre_db
	  DB_USER=usuario
	  DB_PASS=contraseña
	  DB_HOST=localhost
	  DB_DIALECT=mysql
	  ```

4. **Ejecuta el servidor en modo desarrollo:**
	```bash
	npm run dev
	```
	El servidor estará disponible en `http://localhost:3000` por defecto.

## Endpoints principales

### Torneos
- `GET /api/tournaments` — Lista todos los torneos
- `POST /api/tournaments` — Crea un nuevo torneo (requiere todos los campos definidos en el modelo)

Ejemplo de cuerpo para crear un torneo:
```json
{
  "tournament_name": "Sunday Major",
  "start_date": "2025-10-05",
  "buy_in": 100000.00,
  "re_entry": 1,
  "knockout_bounty": 0.00,
  "starting_stack": 50000,
  "count_to_ranking": true,
  "double_points": false,
  "blind_levels": 12,
  "small_blind": 500,
  "punctuality_discount": 20.00
}
```

## Scripts disponibles
- `npm run dev` — Ejecuta el servidor en modo desarrollo con recarga automática
- `npm run build` — Compila el proyecto TypeScript a JavaScript en la carpeta `dist`
- `npm start` — Ejecuta el servidor en modo producción (requiere haber ejecutado `npm run build`)

## Requisitos
- Node.js >= 18
- MySQL

## Notas técnicas
- El proyecto utiliza Sequelize para la gestión de modelos y migraciones automáticas.
- La configuración de la base de datos se realiza mediante variables de entorno para mayor seguridad y flexibilidad.
- El código está modularizado para facilitar la escalabilidad y el mantenimiento.

## Contribuir
Si deseas contribuir, por favor abre un issue o envía un pull request.

## Licencia
Este proyecto está bajo la licencia ISC.