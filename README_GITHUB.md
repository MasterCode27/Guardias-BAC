# Guardias Cloud v15.10

Versión web local/demo de Guardias Cloud.

## Cambios v15.10
- Botón **Instalar y crear acceso directo** que utiliza el diálogo nativo de instalación del navegador/PWA cuando está disponible.
- Si el navegador no expone el diálogo automáticamente, el botón indica usar el menú del navegador y la opción **Instalar y crear acceso directo**. No se abre una pantalla personalizada de instalación.
- Manifest PWA con iconos 192x192 y 512x512.
- Service Worker actualizado a v15.10.
- Corregidos los botones **¿Olvidaste tu contraseña?** y **Volver al inicio de sesión**.
- Recuperación demo: correo → código de 6 dígitos → nueva contraseña.

## Modo demo
No usa API ni base de datos. Los datos se almacenan en `localStorage`.

Usuario administrador: `rdumas`
Contraseña inicial: `Guardia2026!`
Correo demo: `angelramses2703@gmail.com`


## Sesión
La sesión de usuario se conserva al recargar la página durante un máximo de 5 minutos. Si el usuario cierra la aplicación/pestaña, la sesión de la sesión actual se elimina mediante `sessionStorage`.
