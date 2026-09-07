# Guardias Cloud v14

Sistema web para la gestión y visualización de guardias semanales de un equipo de trabajo.

Guardias Cloud permite consultar quién está de guardia actualmente, visualizar la rotación semanal, administrar integrantes y gestionar la recuperación de contraseñas.

## ✨ Características

### 🔐 Autenticación
- Inicio de sesión mediante **usuario de red y contraseña**.
- Opción **Recordar usuario**.
- Opción **Recordar contraseña** para el entorno de demostración.
- Mostrar/ocultar contraseña.
- Recuperación de contraseña mediante correo electrónico.
- Código de verificación de 6 dígitos.
- Código de recuperación con expiración de 10 minutos en el modo demo.
- Cambio de contraseña con confirmación.
- Mostrar/ocultar contraseña en:
  - Inicio de sesión.
  - Agregar integrante.
  - Editar integrante.
  - Nueva contraseña.
  - Confirmar nueva contraseña.

### 👥 Administración del equipo
Los administradores pueden:

- Agregar integrantes.
- Editar integrantes.
- Eliminar integrantes.
- Modificar nombre.
- Modificar usuario de red.
- Modificar correo de recuperación.
- Modificar contraseña.
- Asignar o quitar permisos de administrador.

### 🛡️ Protección al eliminar integrantes
Antes de eliminar un integrante, el sistema comprueba si está asignado a la **guardia de la semana actual**.

- Si está de guardia actualmente, **no se permite eliminarlo**.
- Si no está asignado a la guardia actual, puede eliminarse.

Esto evita romper la rotación vigente.

### 🗓️ Rotación de guardias
- Rotación semanal de lunes a domingo.
- La guardia termina el domingo a las 11:59 p. m.
- La siguiente guardia comienza el lunes.
- Visualización de la guardia actual.
- Visualización de próximas guardias.
- Calendario semanal.
- Configuración del integrante que inicia la rotación.
- Validación para que la fecha de inicio de una rotación sea lunes.

### 🔔 Notificaciones
El usuario puede activar o desactivar las notificaciones.

Opciones disponibles:

- 24 horas antes — recomendado.
- 48 horas antes.
- 72 horas antes.

La preferencia se guarda localmente en el modo demo.

### 🌐 Idiomas
Interfaz completamente disponible en:

- 🇪🇸 Español
- 🇺🇸 English

La traducción incluye botones, etiquetas, mensajes, placeholders, calendario, recuperación de contraseña, administración y mensajes de validación.

### 🌙 Tema oscuro
Incluye modo oscuro con elementos adaptados para mantener la legibilidad:

- Textos blancos.
- Menú lateral visible.
- Encabezados visibles.
- Estados activos diferenciados.
- Formularios y tarjetas adaptados al tema.

### 📱 Diseño responsive
La interfaz está diseñada para funcionar en:

- Android.
- Teléfonos móviles.
- Tablets.
- Computadoras de escritorio.

---

## 🆕 Cambios de la versión 14

### Recuperación de contraseña
Se corrigió la pantalla de recuperación para que el bloque de bienvenida no aparezca allí.

**Inicio de sesión:**
> Acceso seguro  
> Bienvenido de nuevo

**Recuperación:**
> Acceso seguro  
> Recuperar contraseña

Al volver al inicio de sesión, el bloque de bienvenida vuelve a mostrarse.

### Contraseñas
Se agregaron controles para mostrar y ocultar contraseñas en todos los formularios correspondientes.

### Eliminación de integrantes
Ahora se verifica la rotación semanal antes de permitir eliminar a un integrante.

### Carné eliminado
El campo **Carné** fue eliminado completamente de la interfaz y del flujo de usuario.

El sistema conserva un **ID interno** para uso técnico de la aplicación, pero el usuario ya no verá ni tendrá que introducir ningún carné.

---

## 🧩 Arquitectura

El proyecto está preparado para trabajar con una arquitectura cliente-servidor:

```text
Navegador / App
      │
      ▼
Frontend Guardias Cloud
      │
      ▼
API REST
      │
      ├── Autenticación
      ├── Recuperación de contraseña
      ├── Gestión de integrantes
      └── Gestión de rotaciones
      │
      ▼
Base de datos
```

El frontend puede funcionar en modo demostración utilizando `localStorage`.

Para producción se recomienda utilizar:

- API HTTPS.
- Base de datos real.
- Contraseñas almacenadas mediante hash seguro.
- Autenticación basada en sesión/token.
- Autorización para operaciones administrativas.
- Variables de entorno para secretos.

---

## 📁 Estructura del proyecto

```text
GuardiasCloud/
│
├── index.html
├── app.js
├── api.js
├── styles.css
├── sw.js
├── manifest.webmanifest
├── .nojekyll
│
├── guardias-api/
│   ├── server.js
│   ├── package.json
│   ├── users.json
│   ├── .env.example
│   └── README.md
│
├── README.md
└── README_GITHUB.md
```

---

## 🚀 Ejecutar localmente

El frontend puede abrirse directamente desde `index.html`.

Para ejecutar la API:

```bash
cd guardias-api
npm install
node server.js
```

La API utiliza el puerto configurado en:

```env
PORT=3000
```

---

## 📧 Recuperación de contraseña por correo

La API incluye integración con un servicio de correo transaccional como Brevo.

Variables de entorno:

```env
BREVO_API_KEY=tu_api_key
BREVO_SENDER_EMAIL=correo@tudominio.com
BREVO_SENDER_NAME=Guardias Cloud
APP_ORIGIN=http://localhost:3000
PORT=3000
```

**Nunca publiques la API Key en GitHub.**

Utiliza un archivo `.env` local y agrégalo a `.gitignore`.

GitHub Pages es únicamente hosting estático y no debe utilizarse para guardar claves privadas ni enviar correos directamente.

---

## 🧪 Usuarios de demostración

El entorno demo contiene usuarios de prueba.

Usuario administrador:

```text
Usuario de red: rdumas
Contraseña: Guardia2026!
```

El correo configurado para probar recuperación de contraseña de `rdumas` es:

```text
angelramses2703@gmail.com
```

> Estas credenciales son únicamente para demostración. No deben utilizarse en un entorno de producción.

---

## 🔑 Recuperación en modo demo

Si la API de correo no está configurada, la recuperación puede funcionar en modo demostración.

El sistema:

1. Solicita el correo.
2. Genera un código de 6 dígitos.
3. Muestra el código de prueba dentro de la aplicación.
4. Permite introducir el código.
5. Solicita la nueva contraseña.
6. Solicita confirmar la contraseña.
7. Actualiza la contraseña local.
8. El código deja de ser válido después de utilizarse o al superar los 10 minutos.

---

## ⚠️ Seguridad

La versión demo utiliza almacenamiento local para facilitar las pruebas.

**No utilizar este mecanismo como almacenamiento de credenciales en producción.**

Para producción:

- Usar `bcrypt`, `Argon2` o un mecanismo equivalente para las contraseñas.
- No almacenar contraseñas en texto plano.
- No almacenar contraseñas en `localStorage`.
- Proteger los endpoints administrativos.
- Validar permisos en el servidor.
- Utilizar HTTPS.
- Utilizar una base de datos.
- Proteger las variables de entorno.
- Implementar control de sesiones y expiración de tokens.
- Registrar operaciones administrativas mediante auditoría.

---

## 📌 Recomendación para GitHub Pages

El frontend puede publicarse como sitio estático.

En GitHub:

1. Subir el contenido del proyecto al repositorio.
2. Ir a **Settings → Pages**.
3. Seleccionar la rama principal.
4. Seleccionar `/root` como carpeta.
5. Guardar.
6. Esperar la publicación del sitio.

Para recuperación real por correo y operaciones protegidas, la API debe estar desplegada en un servidor o plataforma compatible con Node.js/serverless.

---

## 📄 Licencia

Proyecto destinado a uso y desarrollo del sistema **Guardias Cloud**.

Copyright © 2026 Guardias Cloud.
