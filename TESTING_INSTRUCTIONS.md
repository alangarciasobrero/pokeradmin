Instrucciones rápidas para ejecutar la suite de pruebas e integración (local):

1) Instalar dependencias (incluye devDependencies añadidos):

```powershell
npm install
```

2) Ejecutar TypeScript check:

```powershell
npx tsc --noEmit
```

3) Ejecutar tests (Jest):

```powershell
npm test
```

Notas:
- Se añadió un test de integración `tests/adminRanking.test.ts` que usa la ruta de desarrollo `/dev/login-admin` para iniciar sesión como admin y luego accede a `/admin/games/ranking`.
- Para permitir que `/dev/login-admin` esté disponible en tests, la prueba pone `process.env.NODE_ENV = 'development'` antes de importar la app.
- Si deseas instalar sólo `supertest` manualmente:

```powershell
npm install --save-dev supertest @types/supertest
```

- Si algún test falla por dependencias o por la configuración de la base de datos, puedes ejecutar tests unitarios aislados con:

```powershell
npx jest tests/rankingCalculator.test.ts --runInBand
```

Si querés que continúe con más tests de integración o ajustar la lógica del ranking, mañana retomo y automatizo más casos (creación de inscripciones, filtros y cobertura de fallback `player_id` vs `user_id`).
