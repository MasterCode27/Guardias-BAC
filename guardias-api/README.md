# Guardias Cloud API — recuperación por correo

Esta API complementa la versión web de Guardias Cloud. Sirve para el login y, principalmente, para enviar códigos reales de recuperación por correo.

## Servicio de correo

Usa Brevo Transactional Email. El plan gratis actualmente incluye 300 envíos de email al día. La API de Brevo requiere una API key y un remitente verificado.

1. Crea una cuenta en Brevo.
2. Genera una API key.
3. Verifica el correo/remitente que usarás para enviar los mensajes.
4. Copia `.env.example` a `.env` y completa `BREVO_API_KEY`, `BREVO_SENDER_EMAIL` y `BREVO_SENDER_NAME`.
5. Cambia los correos reales de `users.json`.
6. Instala/usa Node.js 18+ y ejecuta `npm start`.

## Conectar el frontend

En la consola del navegador puedes establecer la URL de la API:

```js
GuardiasAPI.setBase('https://TU-API.example.com')
```

Después recarga la página.

## Flujo

- El usuario escribe su correo.
- La API genera un código aleatorio de 6 dígitos usando `crypto.randomInt`.
- El código se guarda solamente como hash y vence en 10 minutos.
- Brevo envía el código al correo asociado.
- El usuario escribe el código y la nueva contraseña.
- El código se invalida después de utilizarse.

### Importante

GitHub Pages es hosting estático: no debe contener la API key de Brevo. El envío real necesita ejecutarse en un backend/serverless con el secreto guardado como variable de entorno. El frontend seguirá funcionando en modo demo sin backend, pero ese modo solo puede mostrar el código en pantalla y no puede enviar correo real.
