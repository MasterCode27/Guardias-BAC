# Guardias Cloud v17

Versión web local/demo de Guardias Cloud.

## Cambios v15.17
- Botón **Instalar y crear acceso directo** que utiliza el diálogo nativo de instalación del navegador/PWA cuando está disponible.
- Si el navegador no expone el diálogo automáticamente, el botón indica usar el menú del navegador y la opción **Instalar y crear acceso directo**. No se abre una pantalla personalizada de instalación.
- Manifest PWA con iconos 192x192 y 512x512.
- Service Worker actualizado a v15.17.
- Corregidos los botones **¿Olvidaste tu contraseña?** y **Volver al inicio de sesión**.
- Recuperación demo: correo → código de 6 dígitos → nueva contraseña.

## Modo demo
No usa API ni base de datos. Los datos se almacenan en `localStorage`.

## Sesión
La sesión de usuario se conserva al recargar la página durante un máximo de 5 minutos. Si el usuario cierra la aplicación/pestaña, la sesión de la sesión actual se elimina mediante `sessionStorage`.


## v15.17 — Progreso semanal
La barra de progreso de la guardia ahora representa la semana completa de 7 días (lunes 00:00 a lunes 00:00). El porcentaje disminuye de forma continua conforme avanza la semana y muestra el tiempo restante en días, horas y minutos.

## Usuario especial: Nelson Mercado

- Usuario de red: `nmercado`
- Contraseña inicial de demostración: `Guardia2026!`
- Rol: Administrador
- Marcado como siempre de guardia.
- No participa en la rotación y no aparece en el calendario.
- En Inicio verá su estado como **Siempre de guardia**.


## v17 · Automatización de notificaciones
- Aviso personal antes de la próxima guardia: respeta 24/48/72 horas.
- Aviso diario a las 06:00 de quién está de guardia ese día.
- Aviso a las 06:00 del último día de la guardia indicando que termina ese día.
- Se programan eventos por dispositivo cuando el usuario activa las notificaciones.
- Usa Notification Triggers cuando el navegador los expone y mantiene un respaldo con temporizadores mientras la aplicación está activa.
- Incluye iconos específicos para notificaciones para evitar usar directamente el icono cuadrado de la PWA.

> Nota: en esta versión local/GitHub Pages, "todos los dispositivos" significa cada dispositivo donde el usuario haya activado las notificaciones y haya permitido que el sistema las programe. Para enviar una notificación desde un único servidor a todos los dispositivos de un usuario, la siguiente etapa debe incorporar Web Push + backend/base de datos.
