<p align="center">
  <a href="http://nestjs.com/" target="blank">
    <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" />
  </a>
</p>

<p align="center">
  Una plantilla base para aplicaciones NestJS con autenticación lista para usar.
</p>

---

## 🛠️ Descripción del proyecto

Este proyecto es una **plantilla base** en NestJS diseñada para evitar empezar desde cero cada vez que necesitas autenticación en una nueva app.

Incluye:

- Registro de usuarios (`/auth/register`)
- Inicio de sesión (`/auth/login`)
- Generación y validación de JWT
- Protección de rutas con `JwtAuthGuard`
- Soporte para roles (`@Roles()`) y `RolesGuard`
- CRUD de usuarios restringido por rol
- Encriptación segura de contraseñas con bcrypt
- Integración con MongoDB (Mongoose)
- Variables de entorno y validación con Joi

Ideal para usar como **punto de partida** en cualquier aplicación que requiera autenticación y control de usuarios.

---

## ⚙️ Instalación

```bash
npm install
```

## ▶️ Comandos

Ejecutar en desarrollo

```bash
npm run start:dev
```

## Producción

```bash
npm run start:prod
```

## Tests

```bash
npm run test        # Unit tests
npm run test:e2e    # End to end
npm run test:cov    # Cobertura
```
