# Guardias Cloud v15.12

Versión web local/demo de Guardias Cloud.

## Cambios v15.12
- Botón **Instalar y crear acceso directo** que utiliza el diálogo nativo de instalación del navegador/PWA cuando está disponible.
- Si el navegador no expone el diálogo automáticamente, el botón indica usar el menú del navegador y la opción **Instalar y crear acceso directo**. No se abre una pantalla personalizada de instalación.
- Manifest PWA con iconos 192x192 y 512x512.
- Service Worker actualizado a v15.12.
- Corregidos los botones **¿Olvidaste tu contraseña?** y **Volver al inicio de sesión**.
- Recuperación demo: correo → código de 6 dígitos → nueva contraseña.

## Modo demo
No usa API ni base de datos. Los datos se almacenan en `localStorage`.

Usuario administrador: `rdumas`
Contraseña inicial: `Guardia2026!`
Correo demo: `angelramses2703@gmail.com`


## Sesión
La sesión de usuario se conserva al recargar la página durante un máximo de 5 minutos. Si el usuario cierra la aplicación/pestaña, la sesión de la sesión actual se elimina mediante `sessionStorage`.


## v15.12 — Progreso semanal
La barra de progreso de la guardia ahora representa la semana completa de 7 días (lunes 00:00 a lunes 00:00). El porcentaje disminuye de forma continua conforme avanza la semana y muestra el tiempo restante en días, horas y minutos.
