# Fotaza 2 - Trabajo Final Integrador Programación Web II

Fotaza 2 es una aplicación web de comunidad de fotografías desarrollada como Trabajo Final Integrador para Programación Web II.

La plataforma permite registrar usuarios, publicar fotografías, comentar, valorar imágenes, seguir usuarios, guardar publicaciones en colecciones, denunciar contenido, moderar publicaciones, buscar contenido con filtros avanzados y contactar al autor de una imagen mediante el sistema de "Me interesa" y mensajería privada.

## Tecnologías utilizadas

* Node.js
* Express
* PUG como motor de vistas del lado servidor
* MySQL
* Sequelize ORM
* Sequelize CLI
* JWT para autenticación
* Cookies HTTP para sesión
* Multer para carga de imágenes locales
* CSS personalizado


## Instalación

Clonar el repositorio:

```bash
git clone <URL_DEL_REPOSITORIO>
cd <NOMBRE_DEL_PROYECTO>
```

Instalar dependencias:

```bash
npm install
```

Crear la base de datos en MySQL:

```sql
CREATE DATABASE fotaza_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;
```

Crear un archivo `.env` en la raíz del proyecto tomando como base `.env.example`:

```env
PORT=3000

DB_HOST=localhost
DB_PORT=3306
DB_NAME=fotaza_db
DB_USER=root
DB_PASSWORD=

JWT_SECRET=change_this_secret

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Ejecutar migraciones y seeders:

```bash
npm run db:init
```

Iniciar la aplicación:

```bash
npm start
```

La aplicación quedará disponible en:

```text
http://localhost:3000
```

## Scripts disponibles

```bash
npm start
```

Inicia el servidor en modo normal.

```bash
npm run dev
```

Inicia el servidor en modo desarrollo usando `node --watch`.

```bash
npm run db:migrate
```

Ejecuta las migraciones pendientes.

```bash
npm run db:seed
```

Ejecuta los seeders pendientes.

```bash
npm run db:init
```

Ejecuta migraciones y seeders.

```bash
npm run db:reset
```

Elimina las migraciones aplicadas, vuelve a migrar y vuelve a cargar los datos demo.

## Usuarios de prueba

Todos los usuarios demo tienen la contraseña:

```text
123456
```

| Rol           | Email                                               | Uso                                  |
| ------------- | --------------------------------------------------- | ------------------------------------ |
| Administrador | [admin@fotaza.com](mailto:admin@fotaza.com)         | Acceso a moderación general          |
| Validador     | [validador@fotaza.com](mailto:validador@fotaza.com) | Acceso a moderación general          |
| Usuario       | [jonathan@fotaza.com](mailto:jonathan@fotaza.com)   | Usuario común con publicaciones demo |
| Usuario       | [camila@fotaza.com](mailto:camila@fotaza.com)       | Usuario común con publicaciones demo |

## Funcionalidades implementadas

### Autenticación

* Registro de usuarios.
* Inicio de sesión.
* Cierre de sesión.
* Sesión mediante JWT guardado en cookie.
* Roles de usuario: administrador, validador y usuario común.
* Protección de rutas privadas.
* Restricción de rutas según rol.

### Publicaciones e imágenes

* Creación de publicaciones.
* Carga de imágenes.
* Licencias de imagen: con copyright y sin copyright.
* Marca de agua opcional.
* Etiquetas por publicación.
* Visualización de publicaciones.
* Detalle de publicación.
* Los usuarios no autenticados solo ven imágenes sin copyright.

### Comentarios

* Los usuarios autenticados pueden comentar imágenes.
* El autor de la publicación puede cerrar o reabrir comentarios.
* Los comentarios eliminados por moderación no se muestran.
* Los usuarios no autenticados no pueden comentar.

### Valoraciones

* Los usuarios autenticados pueden valorar imágenes de otros usuarios.
* El autor no puede valorar sus propias imágenes.
* Cada usuario puede valorar una imagen una sola vez.
* Se calcula promedio de valoración y cantidad de votos.

### Seguidores

* Un usuario puede seguir a otro.
* Un usuario puede dejar de seguir a otro.
* No se permite seguirse a uno mismo.
* Perfil público con cantidad de seguidores, seguidos y publicaciones.
* Feed de usuarios seguidos.

### Notificaciones

* Notificaciones por comentarios.
* Notificaciones por valoraciones.
* Notificaciones por seguidores.
* Notificaciones por denuncias.
* Notificaciones por interés en imágenes.
* Notificaciones por mensajes privados.
* Contador de notificaciones no leídas en la navegación.
* Opción para marcar notificaciones como leídas.

### Colecciones y favoritos

* Creación de colecciones personales.
* Listado de colecciones del usuario.
* Guardado de publicaciones en colecciones.
* Eliminación de publicaciones guardadas.
* Prevención de duplicados dentro de una misma colección.

### Búsqueda avanzada

* Búsqueda por texto.
* Filtro por autor.
* Filtro por etiqueta.
* Filtro por licencia.
* Filtro por valoración mínima.
* Filtro por fecha desde y hasta.
* Respeta permisos de visualización para usuarios no autenticados.

### Denuncias de imágenes

* Los usuarios autenticados pueden denunciar imágenes de otros usuarios.
* No se permite denunciar imágenes propias.
* No se permite denunciar dos veces la misma imagen mientras la denuncia esté pendiente.
* La publicación queda bloqueada para edición cuando recibe denuncias.
* Al llegar al umbral configurado de denuncias, la publicación pasa a revisión.
* Administradores y validadores pueden revisar denuncias.
* Se puede desestimar una denuncia.
* Se puede dar de baja una publicación.
* El autor acumula publicaciones dadas de baja.
* Si un autor acumula demasiadas publicaciones dadas de baja, se desactiva su cuenta.

### Denuncias de comentarios

* Los usuarios autenticados pueden denunciar comentarios de otros usuarios.
* No se permite denunciar comentarios propios.
* El usuario que denunció puede cancelar su denuncia mientras esté pendiente.
* El autor de una publicación puede revisar denuncias sobre comentarios realizados en sus publicaciones.
* Administradores y validadores pueden revisar denuncias de comentarios.
* Se puede desestimar una denuncia.
* Se puede borrar un comentario denunciado.

### Moderación

* Panel de moderación para administradores y validadores.
* Revisión de publicaciones bajo denuncia.
* Desestimación de denuncias.
* Baja de publicaciones denunciadas.
* Registro del usuario que revisó la denuncia.
* Fecha de revisión de denuncia.

### Me interesa y mensajería privada

* Los usuarios pueden marcar interés en imágenes de otros usuarios.
* Se crea una solicitud de interés.
* Se crea una conversación privada entre interesado y autor.
* El interesado puede enviar un mensaje inicial.
* El autor recibe una notificación.
* Ambos usuarios pueden continuar la conversación.
* Cada usuario solo puede ver sus propias conversaciones.

## Estructura general del proyecto

```text
src/
  app.js
  config/
  database/
    migrations/
    models/
    seeders/
  middlewares/
  modules/
    auth/
    users/
    publications/
    comments/
    ratings/
    reports/
    moderation/
    followers/
    notifications/
    collections/
    search/
    interests/
    messages/

views/
  layouts/
  partials/
  auth/
  home/
  publications/
  users/
  collections/
  notifications/
  comments/
  moderation/
  search/
  messages/
  errors/

public/
  css/
  img/
  js/
  uploads/
```

## Base de datos

El proyecto utiliza una base de datos relacional MySQL administrada mediante Sequelize.

La estructura incluye tablas para:

* roles
* usuarios
* publicaciones
* imágenes
* etiquetas
* relación publicación-etiqueta
* comentarios
* valoraciones
* seguidores
* notificaciones
* colecciones
* publicaciones guardadas en colecciones
* denuncias de imágenes
* denuncias de comentarios
* solicitudes de interés
* conversaciones
* mensajes privados

Las tablas utilizan claves primarias, claves foráneas, índices, restricciones de unicidad e integridad referencial.

## Datos demo

El proyecto incluye seeders con datos de prueba:

* usuarios por rol
* publicaciones
* imágenes demo locales
* etiquetas
* comentarios
* valoraciones
* seguidores
* colecciones
* notificaciones

Las imágenes demo se encuentran en:

```text
public/img/
```

## Problemas encontrados y soluciones aplicadas

### Error por migraciones duplicadas

Durante el desarrollo, algunas migraciones fueron renombradas o reejecutadas mientras sus tablas ya existían. Esto podía generar errores como índices duplicados o tablas existentes.

Solución aplicada:

* Revisar la tabla `SequelizeMeta`.
* Usar `npm run db:reset` durante desarrollo.
* Evitar renombrar migraciones ya ejecutadas.

### Error por columnas inexistentes en seeders

Al crear datos demo aparecieron errores por columnas que no existían en la estructura final de la base, como `public_id` o `is_private`.

Solución aplicada:

* Ajustar el seeder para que coincida exactamente con las migraciones reales del proyecto.

### Bloqueo al dar de baja publicaciones

Al dar de baja publicaciones denunciadas, una notificación creada fuera de la transacción podía provocar que la operación quedara esperando.

Solución aplicada:

* Permitir que `createNotification` reciba una transacción.
* Ejecutar las notificaciones de moderación dentro de la misma transacción.

### Denuncias desestimadas que seguían apareciendo como activas

Después de desestimar una denuncia, el detalle de publicación seguía mostrando que el usuario ya había denunciado.

Solución aplicada:

* Filtrar denuncias por `status = 'pending'` al cargar publicaciones.
* Permitir reactivar denuncias desestimadas si el usuario vuelve a denunciar.

## Autor

Jonathan Muñoz

Trabajo Final Integrador - Programación Web II
