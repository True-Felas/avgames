# AVGames — Documentación del Proyecto

## 1. Descripción General

**AVGames** (Retro Store) es una plataforma e-commerce de videojuegos retro con estética **synthwave/80s**. Permite a los usuarios navegar un catálogo de juegos retro, añadirlos a un carrito, realizar un proceso de compra con pago simulado y descargar los archivos asociados (ZIPs). Incluye un panel de administración completo para gestionar productos, categorías, usuarios y estadísticas de la plataforma. El sistema implementa un mecanismo de **niveles de usuario** basado en el número de descargas.

### Stack Tecnológico

| Capa | Tecnología |
|---|---|
| **Backend** | Laravel 11 (PHP 8.2+) |
| **Frontend** | React 18 + TypeScript (Inertia.js) |
| **Base de Datos** | SQLite / MySQL / PostgreSQL |
| **Estilos** | Tailwind CSS (tema synthwave personalizado) |
| **Autenticación** | Laravel Fortify (login, registro, 2FA) |
| **Storage** | Laravel Storage (disco `games` para ZIPs, disco `public` para imágenes) |
| **Bundler** | Vite |

---

## 2. Requisitos Funcionales

| ID | Requisito | Actor(es) |
|---|---|---|
| RF-01 | Registro de usuario con nombre, email y contraseña | Visitante |
| RF-02 | Inicio de sesión con email y contraseña | Visitante |
| RF-03 | Autenticación en dos factores (2FA) opcional | Usuario |
| RF-04 | Navegación por el catálogo de productos con paginación | Visitante / Usuario |
| RF-05 | Búsqueda de productos por nombre, desarrollador o publisher | Visitante / Usuario |
| RF-06 | Filtrado de productos por categoría, plataforma, precio y estado | Visitante / Usuario |
| RF-07 | Visualización del detalle de un producto | Visitante / Usuario |
| RF-08 | Añadir productos al carrito (requiere archivo descargable activo) | Visitante / Usuario |
| RF-09 | Gestionar carrito (modificar cantidad, eliminar, vaciar) | Visitante / Usuario |
| RF-10 | Realizar checkout con datos de facturación y método de pago | Usuario autenticado |
| RF-11 | Pago simulado (tarjeta de crédito, PayPal, transferencia bancaria) | Usuario autenticado |
| RF-12 | Confirmación automática para pedidos gratuitos (total = 0) | Usuario autenticado |
| RF-13 | Descargar archivos de juegos comprados o gratuitos | Usuario autenticado |
| RF-14 | Ver historial de pedidos y detalle de cada pedido | Usuario autenticado |
| RF-15 | Ver perfil con estadísticas (pedidos, descargas, nivel) | Usuario autenticado |
| RF-16 | Sistema de niveles de usuario basado en descargas (cada 5 descargas = 1 nivel) | Usuario autenticado |
| RF-17 | Panel de administración con dashboard de estadísticas | Administrador |
| RF-18 | CRUD completo de productos (crear, leer, actualizar, eliminar) | Administrador |
| RF-19 | CRUD completo de categorías | Administrador |
| RF-20 | Gestión de archivos descargables por producto (subir/editar/eliminar ZIPs) | Administrador |
| RF-21 | Gestión de usuarios (listar, ver detalle, banear, suspender, activar, eliminar) | Administrador |
| RF-22 | Vista de estadísticas avanzadas (descargas por día, por categoría, por plataforma, top users) | Administrador |
| RF-23 | Modificar nivel y experiencia de un usuario manualmente | Administrador |
| RF-24 | Promover/revocar privilegios de administrador a un usuario | Administrador |

---

## 3. Requisitos No Funcionales

| ID | Requisito | Detalle |
|---|---|---|
| RNF-01 | **Seguridad** | Las descargas requieren autenticación. Las rutas de admin están protegidas por middleware `auth + verified + admin`. Las contraseñas se almacenan hasheadas. |
| RNF-02 | **Rendimiento** | Paginación en listados (20 elementos/página). Carga lazy de relaciones con Eloquent. |
| RNF-03 | **Usabilidad** | Diseño responsivo con estética retro/synthwave consistente. SPA con Inertia.js (sin recargas de página). |
| RNF-04 | **Mantenibilidad** | Arquitectura MVC (Laravel). Separación clara backend/frontend. Migrations versionadas. Seeders y factories para datos de prueba. |
| RNF-05 | **Compatibilidad** | PHP 8.2+, Node.js 18+, navegadores modernos (Chrome, Firefox, Edge, Safari). |
| RNF-06 | **Integridad de datos** | Foreign keys con `onDelete('cascade')`. Validación de formularios tanto en frontend como en backend. |
| RNF-07 | **Extensibilidad** | Sistema de roles simple (`is_admin`), preparado para ampliación. Múltiples métodos de pago soportados. |

---

## 4. Diagrama de Casos de Uso

```
┌─────────────────────────────────────────────────────────────────────┐
│                            AVGames                                  │
│                                                                     │
│                                                                     │
│   ┌──────────────────────────┐                                      │
│   │   Registrarse (CU-01)    │◄──── Visitante                       │
│   └──────────────────────────┘                                      │
│                                                                     │
│   ┌──────────────────────────┐                                      │
│   │   Iniciar Sesión (CU-02) │◄──── Visitante                       │
│   └────────────┬─────────────┘                                      │
│                │ «include»                                          │
│                ▼                                                     │
│   ┌──────────────────────────┐                                      │
│   │   Ver Catálogo (CU-03)   │◄──── Visitante / Usuario             │
│   └──────────────────────────┘                                      │
│                                                                     │
│   ┌──────────────────────────┐                                      │
│   │   Buscar Productos       │◄──── Visitante / Usuario             │
│   │        (CU-04)           │                                      │
│   └──────────────────────────┘                                      │
│                                                                     │
│   ┌──────────────────────────┐                                      │
│   │   Filtrar por Categoría  │◄──── Visitante / Usuario             │
│   │        (CU-05)           │                                      │
│   └──────────────────────────┘                                      │
│                                                                     │
│   ┌──────────────────────────┐                                      │
│   │   Ver Detalle Producto   │◄──── Visitante / Usuario             │
│   │        (CU-06)           │                                      │
│   └──────────────────────────┘                                      │
│                                                                     │
│   ┌──────────────────────────┐      ┌──────────────────────┐        │
│   │  Añadir al Carrito       │◄─────│                      │        │
│   │        (CU-07)           │      │                      │        │
│   └──────────────────────────┘      │      Usuario         │        │
│                                     │   (autenticado)      │        │
│   ┌──────────────────────────┐      │                      │        │
│   │  Gestionar Carrito       │◄─────│                      │        │
│   │        (CU-08)           │      │                      │        │
│   └──────────────────────────┘      └──────────┬───────────┘        │
│                                                │                    │
│   ┌──────────────────────────┐                 │                    │
│   │  Realizar Checkout       │◄────────────────┤                    │
│   │        (CU-09)           │                 │                    │
│   └────────────┬─────────────┘                 │                    │
│                │ «include»                     │                    │
│                ▼                                │                    │
│   ┌──────────────────────────┐                 │                    │
│   │  Pago Simulado (CU-10)   │                 │                    │
│   └────────────┬─────────────┘                 │                    │
│                │ «include»                     │                    │
│                ▼                                │                    │
│   ┌──────────────────────────┐                 │                    │
│   │  Descargar Juego (CU-11) │◄────────────────┤                    │
│   └──────────────────────────┘                 │                    │
│                                                │                    │
│   ┌──────────────────────────┐                 │                    │
│   │  Ver Pedidos (CU-12)     │◄────────────────┤                    │
│   └──────────────────────────┘                 │                    │
│                                                │                    │
│   ┌──────────────────────────┐                 │                    │
│   │  Ver Perfil (CU-13)     │◄─────────────────┘                    │
│   └──────────────────────────┘                                      │
│                                                                     │
│   ════════════════════════════════════════════                       │
│                                                                     │
│   ┌──────────────────────────┐      ┌──────────────────────┐        │
│   │  Dashboard Admin (CU-14) │◄─────│                      │        │
│   └──────────────────────────┘      │                      │        │
│                                     │   Administrador      │        │
│   ┌──────────────────────────┐      │   (is_admin=true)    │        │
│   │  CRUD Productos (CU-15)  │◄─────│                      │        │
│   └──────────────────────────┘      │                      │        │
│                                     │                      │        │
│   ┌──────────────────────────┐      │                      │        │
│   │  CRUD Categorías (CU-16) │◄─────│                      │        │
│   └──────────────────────────┘      │                      │        │
│                                     │                      │        │
│   ┌──────────────────────────┐      │                      │        │
│   │  Gestionar Archivos      │◄─────│                      │        │
│   │  Descargables (CU-17)    │      │                      │        │
│   └──────────────────────────┘      │                      │        │
│                                     │                      │        │
│   ┌──────────────────────────┐      │                      │        │
│   │  Gestionar Usuarios      │◄─────│                      │        │
│   │        (CU-18)           │      │                      │        │
│   └──────────────────────────┘      │                      │        │
│                                     │                      │        │
│   ┌──────────────────────────┐      │                      │        │
│   │  Ver Estadísticas        │◄─────│                      │        │
│   │        (CU-19)           │      │                      │        │
│   └──────────────────────────┘      └──────────────────────┘        │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘

Relaciones «include»:

  CU-07 (Añadir al Carrito)  ──«include»──► CU-02 (Iniciar Sesión)
  CU-09 (Checkout)           ──«include»──► CU-02 (Iniciar Sesión)
  CU-09 (Checkout)           ──«include»──► CU-10 (Pago Simulado)  [si total > 0]
  CU-10 (Pago Simulado)     ──«include»──► CU-11 (Descargar Juego)
  CU-11 (Descargar Juego)   ──«include»──► CU-02 (Iniciar Sesión)
  CU-14..CU-19 (Admin)      ──«include»──► CU-02 (Iniciar Sesión) + rol admin
```

> **Nota sobre la relación con Login**: Todos los casos de uso que requieren autenticación (CU-07 a CU-19) incluyen el caso de uso CU-02 (Iniciar Sesión) como precondición. Si el usuario no ha iniciado sesión, el sistema lo redirige automáticamente a la pantalla de login. Los casos de uso de administración (CU-14 a CU-19) además requieren que el usuario tenga el flag `is_admin = true`.

---

## 5. Descripción de Casos de Uso

### CU-01: Registrarse

| Campo | Descripción |
|---|---|
| **Actor** | Visitante |
| **Descripción** | Un visitante crea una cuenta proporcionando nombre, email y contraseña |
| **Precondición** | El email no está registrado previamente |
| **Flujo Principal** | 1. Visitante accede a `/register`<br>2. Rellena nombre, email, contraseña y confirmación<br>3. Sistema valida datos y crea la cuenta<br>4. Se redirige al dashboard (perfil) |
| **Postcondición** | Usuario creado con `level=1`, `status=active`, `is_admin=false` |

### CU-02: Iniciar Sesión

| Campo | Descripción |
|---|---|
| **Actor** | Visitante |
| **Descripción** | Un visitante inicia sesión con sus credenciales |
| **Precondición** | El usuario tiene una cuenta registrada |
| **Flujo Principal** | 1. Visitante accede a `/login`<br>2. Introduce email y contraseña<br>3. Sistema valida credenciales<br>4. Si tiene 2FA activado, solicita el código<br>5. Se redirige al dashboard/perfil |
| **Flujo Alternativo** | Si las credenciales son incorrectas, se muestra un error. Si el usuario está baneado, se le deniega el acceso. |
| **Postcondición** | Sesión iniciada |

### CU-03: Ver Catálogo de Productos

| Campo | Descripción |
|---|---|
| **Actor** | Visitante / Usuario |
| **Descripción** | El usuario navega por el catálogo de productos disponibles |
| **Precondición** | Ninguna |
| **Flujo Principal** | 1. Usuario accede a `/library`<br>2. Sistema muestra productos activos paginados (12/página)<br>3. Usuario puede navegar entre páginas |
| **Postcondición** | Se muestran los productos activos con imagen, nombre, precio y categoría |

### CU-04: Buscar Productos

| Campo | Descripción |
|---|---|
| **Actor** | Visitante / Usuario |
| **Descripción** | El usuario busca productos por texto libre |
| **Precondición** | Ninguna |
| **Flujo Principal** | 1. Usuario escribe en el buscador global del header<br>2. Pulsa *Enter*<br>3. Sistema redirige a `/library?search=TÉRMINO`<br>4. Se filtran productos por nombre, descripción, developer y publisher |
| **Postcondición** | Lista filtrada de productos |

### CU-05: Filtrar por Categoría

| Campo | Descripción |
|---|---|
| **Actor** | Visitante / Usuario |
| **Descripción** | El usuario filtra productos seleccionando una categoría |
| **Precondición** | Existen categorías activas con productos |
| **Flujo Principal** | 1. Usuario selecciona una categoría en el sidebar o en la page Discover<br>2. Sistema filtra y muestra solo productos de esa categoría |
| **Postcondición** | Lista filtrada por categoría |

### CU-06: Ver Detalle de Producto

| Campo | Descripción |
|---|---|
| **Actor** | Visitante / Usuario |
| **Descripción** | El usuario ve la información completa de un producto |
| **Precondición** | Producto existe y está activo |
| **Flujo Principal** | 1. Usuario accede a `/product/{slug}`<br>2. Sistema muestra nombre, imagen, galería, descripción, precio, plataforma, developer, publisher, rating, descargas y botones de acción |
| **Postcondición** | Producto visualizado |

### CU-07: Añadir al Carrito

| Campo | Descripción |
|---|---|
| **Actor** | Usuario autenticado |
| **Descripción** | El usuario añade un producto al carrito de compras |
| **Precondición** | Producto activo con al menos un `ProductFile` activo (archivo ZIP). Requiere login (<<include>> CU-02). |
| **Flujo Principal** | 1. Usuario hace clic en "ADD TO CART"<br>2. Backend valida que el producto tiene archivo(s) descargable(s)<br>3. Se añade al carrito (se crea automáticamente si no existe)<br>4. Se actualiza el contador del carrito en el header |
| **Flujo Alternativo** | Si el producto no tiene archivos activos, el botón muestra "NOT AVAILABLE FOR DOWNLOAD". Si se intenta forzar desde URL, devuelve error 422. |
| **Postcondición** | Producto añadido al carrito |

### CU-08: Gestionar Carrito

| Campo | Descripción |
|---|---|
| **Actor** | Visitante / Usuario |
| **Descripción** | El usuario modifica las cantidades o elimina productos del carrito |
| **Precondición** | Carrito con al menos un producto |
| **Flujo Principal** | 1. Usuario accede a `/cart`<br>2. Visualiza resumen con subtotal, IVA (21%) y total<br>3. Puede modificar cantidades, eliminar productos o vaciar el carrito<br>4. Pulsa "PROCEED TO CHECKOUT" para proceder al pago |
| **Postcondición** | Carrito actualizado |

### CU-09: Realizar Checkout

| Campo | Descripción |
|---|---|
| **Actor** | Usuario autenticado |
| **Descripción** | El usuario completa el proceso de compra |
| **Precondición** | Carrito con productos. Requiere login (<<include>> CU-02). |
| **Flujo Principal (Pedido de pago)** | 1. Usuario accede a `/checkout`<br>2. Rellena datos de facturación (nombre, dirección, ciudad, código postal, país)<br>3. Selecciona método de pago (tarjeta, PayPal, transferencia)<br>4. Acepta los términos<br>5. Pulsa "COMPLETE ORDER"<br>6. Sistema crea Order con status `pending`<br>7. Redirige a `/payment/{order}` (<<include>> CU-10) |
| **Flujo Alternativo (Pedido gratuito, total = 0)** | 1. Usuario acepta los términos<br>2. Pulsa "GET FREE GAMES"<br>3. Sistema crea Order con status `completed` y `payment_method=free`<br>4. Redirige directamente a Download Queue |
| **Postcondición** | Order creada, carrito vaciado |

### CU-10: Pago Simulado

| Campo | Descripción |
|---|---|
| **Actor** | Usuario autenticado |
| **Descripción** | El usuario simula un pago a través de formularios ficticios |
| **Precondición** | Order en estado `pending`. |
| **Flujo Principal** | 1. Sistema muestra la pantalla de pago `/payment/{order}` con formulario según método:<br>&emsp;• **Tarjeta de crédito**: Nº tarjeta, fecha expiración, CVV → "PAY €XX.XX"<br>&emsp;• **PayPal**: Email → "PAY WITH PAYPAL"<br>&emsp;• **Transferencia**: IBAN ficticio, concepto → "I HAVE MADE THE TRANSFER"<br>2. Usuario rellena datos ficticios y confirma<br>3. Sistema marca order como `completed` y `payment_status=paid`<br>4. Redirige a Download Queue |
| **Postcondición** | Order completada, archivos disponibles para descarga |

### CU-11: Descargar Juego

| Campo | Descripción |
|---|---|
| **Actor** | Usuario autenticado |
| **Descripción** | El usuario descarga un archivo ZIP de un juego |
| **Precondición** | Usuario autenticado (<<include>> CU-02). Para productos de pago, tener una Order `completed` que incluya el producto. |
| **Flujo Principal** | 1. Usuario accede a la Download Queue o a la ficha del producto<br>2. Pulsa el botón de descarga<br>3. Backend valida autorización (`canDownload`)<br>4. Se incrementa el contador de descargas del fichero<br>5. Se registra la descarga en `user_downloads`<br>6. Se recalcula y persiste el nivel del usuario<br>7. Se sirve el archivo ZIP |
| **Postcondición** | Archivo descargado, estadísticas actualizadas, nivel potencialmente actualizado |

### CU-12: Ver Historial de Pedidos

| Campo | Descripción |
|---|---|
| **Actor** | Usuario autenticado |
| **Descripción** | El usuario consulta sus pedidos anteriores |
| **Precondición** | Login activo |
| **Flujo Principal** | 1. Usuario accede a `/orders`<br>2. Sistema muestra listado paginado con nº pedido, fecha, total, estado<br>3. Puede hacer clic para ver el detalle (`/orders/{order}`) |
| **Postcondición** | Listado de pedidos mostrado |

### CU-13: Ver Perfil

| Campo | Descripción |
|---|---|
| **Actor** | Usuario autenticado |
| **Descripción** | El usuario visualiza su perfil con estadísticas |
| **Precondición** | Login activo |
| **Flujo Principal** | 1. Usuario accede a `/profile`<br>2. Sistema muestra: nombre, email, avatar, nivel, barra de progreso, total de pedidos, total gastado, total de descargas |
| **Postcondición** | Perfil visualizado |

### CU-14: Dashboard Administración

| Campo | Descripción |
|---|---|
| **Actor** | Administrador |
| **Descripción** | El administrador accede al panel de control con métricas globales |
| **Precondición** | Login activo + `is_admin = true` |
| **Flujo Principal** | 1. Admin accede a `/admin`<br>2. Sistema muestra: total usuarios, productos, pedidos, descargas, gráficos de descargas/día, nuevos usuarios/día, top productos, top users, descargas por categoría, actividad reciente |
| **Postcondición** | Dashboard visualizado |

### CU-15: CRUD de Productos

| Campo | Descripción |
|---|---|
| **Actor** | Administrador |
| **Descripción** | Gestión completa de productos en el catálogo |
| **Precondición** | Login activo + `is_admin = true` |
| **Flujo Principal** | Crear, listar, editar y eliminar productos con todos sus campos (nombre, slug, descripción, precio, precio oferta, imagen, galería, stock, plataforma, developer, publisher, rating, is_featured, is_new_release, is_active) |
| **Postcondición** | Producto creado/actualizado/eliminado |

### CU-16: CRUD de Categorías

| Campo | Descripción |
|---|---|
| **Actor** | Administrador |
| **Descripción** | Gestión completa de categorías del catálogo |
| **Precondición** | Login activo + `is_admin = true` |
| **Flujo Principal** | Crear, listar, editar y eliminar categorías (nombre, slug, descripción, icono, color, orden, activo) |
| **Postcondición** | Categoría creada/actualizada/eliminada |

### CU-17: Gestionar Archivos Descargables

| Campo | Descripción |
|---|---|
| **Actor** | Administrador |
| **Descripción** | Subir, editar y eliminar archivos ZIP asociados a un producto |
| **Precondición** | Login activo + `is_admin = true` + producto existente |
| **Flujo Principal** | 1. Admin accede a `/admin/products/{id}/files`<br>2. Puede ver archivos existentes, subir nuevos, editar descripción/versión, activar/desactivar, eliminar |
| **Postcondición** | Archivo gestionado |

### CU-18: Gestionar Usuarios

| Campo | Descripción |
|---|---|
| **Actor** | Administrador |
| **Descripción** | Ver, buscar, filtrar y administrar cuentas de usuario |
| **Precondición** | Login activo + `is_admin = true` |
| **Flujo Principal** | 1. Admin accede a `/admin/users`<br>2. Puede buscar por nombre/email, filtrar por status (active/suspended/banned)<br>3. Puede ver detalle con historial de descargas<br>4. Acciones: banear, suspender temporalmente, activar, promover a admin, modificar nivel/XP, eliminar cuenta |
| **Postcondición** | Usuario gestionado |

### CU-19: Ver Estadísticas Avanzadas

| Campo | Descripción |
|---|---|
| **Actor** | Administrador |
| **Descripción** | Consultar métricas avanzadas de la plataforma |
| **Precondición** | Login activo + `is_admin = true` |
| **Flujo Principal** | 1. Admin accede a `/admin/statistics`<br>2. Puede seleccionar período (7, 30, 90 días)<br>3. Visualiza: top 20 productos, descargas a lo largo del tiempo, top descargadores, descargas por categoría, distribución por plataforma, crecimiento de usuarios, actividad por hora |
| **Postcondición** | Estadísticas visualizadas |

---

## 6. Diagrama Entidad-Relación (E-R)

```
┌───────────────────────┐
│        USERS           │
├───────────────────────┤
│ id (PK)               │
│ name                  │
│ email (UNIQUE)        │
│ email_verified_at     │
│ password              │
│ is_admin              │        ┌──────────────────────┐
│ level                 │        │     CATEGORIES        │
│ experience            │        ├──────────────────────┤
│ status (ENUM)         │        │ id (PK)              │
│ suspended_until       │        │ name                 │
│ ban_reason            │        │ slug (UNIQUE)        │
│ avatar                │        │ description          │
│ two_factor_secret     │        │ icon                 │
│ two_factor_recovery   │        │ color                │
│ remember_token        │        │ is_active            │
│ created_at            │        │ sort_order           │
│ updated_at            │        │ created_at           │
└──┬────────┬───────┬───┘        │ updated_at           │
   │        │       │            └──────────┬───────────┘
   │        │       │                       │ 1:N
   │        │       │                       │
   │        │       │            ┌──────────▼───────────┐
   │        │       │            │       PRODUCTS        │
   │        │       │            ├──────────────────────┤
   │  1:N   │  1:1  │M:N        │ id (PK)              │
   │        │       │(user_     │ category_id (FK)     │
   │        │       │ downloads)│ name                 │
   │        │       │            │ slug (UNIQUE)        │
   │        │       │            │ description          │
   │        │       │            │ short_description    │
   │        │       │            │ price                │
   │        │       │            │ sale_price           │
   │        │       │            │ image                │
   │        │       │            │ gallery (JSON)       │
   │        │       │            │ stock                │
   │        │       │            │ is_featured          │
   │        │       │            │ is_new_release       │
   │        │       │            │ is_active            │
   │        │       │            │ platform             │
   │        │       │            │ developer            │
   │        │       │            │ publisher            │
   │        │       │            │ release_year         │
   │        │       │            │ rating               │
   │        │       │            │ downloads            │
   │        │       │            │ created_at           │
   │        │       │            │ updated_at           │
   │        │       │            └──┬──────────┬────────┘
   │        │       │               │          │ 1:N
   │        │       │               │          │
   │        │       │               │  ┌───────▼──────────┐
   │        │       │               │  │  PRODUCT_FILES    │
   │        │       │               │  ├──────────────────┤
   │        │       │               │  │ id (PK)          │
   │        │       │               │  │ product_id (FK)  │
   │        │       │               │  │ filename         │
   │        │       │               │  │ original_name    │
   │        │       │               │  │ file_path        │
   │        │       │               │  │ file_size        │
   │        │       │               │  │ mime_type        │
   │        │       │               │  │ downloads        │
   │        │       │               │  │ description      │
   │        │       │               │  │ version          │
   │        │       │               │  │ is_active        │
   │        │       │               │  │ created_at       │
   │        │       │               │  │ updated_at       │
   │        │       │               │  └──────────────────┘
   │        │       │               │
   │        │       │         N:1   │
   ▼        ▼       │               ▼
┌────────┐ ┌────────┴─┐      ┌──────────────────┐
│ ORDERS │ │  CARTS    │      │  USER_DOWNLOADS   │
├────────┤ ├──────────┤      │   (tabla pivot)   │
│id (PK) │ │ id (PK)  │      ├──────────────────┤
│user_id │ │ user_id  │      │ id (PK)          │
│order_  │ │session_id│      │ user_id (FK)     │
│ number │ │created_at│      │ product_id (FK)  │
│ status │ │updated_at│      │ downloaded_at    │
│subtotal│ └────┬─────┘      │ ip_address       │
│ tax    │      │ 1:N        │ created_at       │
│discount│      │            │ updated_at       │
│ total  │      ▼            └──────────────────┘
│payment │ ┌──────────┐
│_method │ │CART_ITEMS │
│payment │ ├──────────┤
│_status │ │ id (PK)  │
│billing │ │cart_id FK│
│_address│ │product_id│
│created │ │ quantity │
│updated │ │ price    │
└───┬────┘ │created_at│
    │ 1:N  │updated_at│
    │      └──────────┘
    ▼
┌───────────┐
│ORDER_ITEMS│
├───────────┤
│ id (PK)   │
│order_id FK│
│product_id │
│prod_name  │
│ quantity  │
│ price     │
│ total     │
│created_at │
│updated_at │
└───────────┘
```

### Relaciones entre Entidades

| Entidad Origen | Relación | Entidad Destino | Tipo | Tabla Pivot |
|---|---|---|---|---|
| User | hasOne | Cart | 1:1 | — |
| User | hasMany | Order | 1:N | — |
| User | belongsToMany | Product | M:N | `user_downloads` |
| Category | hasMany | Product | 1:N | — |
| Product | belongsTo | Category | N:1 | — |
| Product | hasMany | ProductFile | 1:N | — |
| Product | hasMany | CartItem | 1:N | — |
| Product | hasMany | OrderItem | 1:N | — |
| Product | belongsToMany | User | M:N | `user_downloads` |
| ProductFile | belongsTo | Product | N:1 | — |
| Cart | belongsTo | User | N:1 | — |
| Cart | hasMany | CartItem | 1:N | — |
| CartItem | belongsTo | Cart | N:1 | — |
| CartItem | belongsTo | Product | N:1 | — |
| Order | belongsTo | User | N:1 | — |
| Order | hasMany | OrderItem | 1:N | — |
| OrderItem | belongsTo | Order | N:1 | — |
| OrderItem | belongsTo | Product | N:1 | — |

---

## 7. Estructura de la Base de Datos

### Tabla: users

| Campo | Tipo | Descripción |
|---|---|---|
| id | BIGINT PK | Identificador único |
| name | VARCHAR(255) | Nombre del usuario |
| email | VARCHAR(255) UNIQUE | Correo electrónico |
| email_verified_at | TIMESTAMP | Fecha de verificación |
| password | VARCHAR(255) | Contraseña (hashed) |
| is_admin | BOOLEAN | Flag administrador (default: false) |
| level | INT | Nivel del usuario (default: 1) |
| experience | INT | Experiencia acumulada (default: 0) |
| status | ENUM('active','suspended','banned') | Estado de la cuenta (default: active) |
| suspended_until | TIMESTAMP | Fecha fin de suspensión |
| ban_reason | VARCHAR(255) | Motivo del baneo |
| avatar | VARCHAR(255) | Ruta del avatar |
| two_factor_secret | TEXT | Secreto 2FA |
| two_factor_recovery_codes | TEXT | Códigos de recuperación 2FA |
| two_factor_confirmed_at | TIMESTAMP | Confirmación 2FA |
| remember_token | VARCHAR(100) | Token de sesión persistente |

### Tabla: categories

| Campo | Tipo | Descripción |
|---|---|---|
| id | BIGINT PK | Identificador único |
| name | VARCHAR(100) | Nombre de la categoría |
| slug | VARCHAR(100) UNIQUE | URL amigable |
| description | TEXT | Descripción |
| icon | VARCHAR(50) | Nombre del icono Material Symbols |
| color | VARCHAR(20) | Color hexadecimal |
| is_active | BOOLEAN | Estado activo/inactivo |
| sort_order | INT | Orden de visualización |

### Tabla: products

| Campo | Tipo | Descripción |
|---|---|---|
| id | BIGINT PK | Identificador único |
| category_id | BIGINT FK → categories | Categoría del producto |
| name | VARCHAR(255) | Nombre del producto |
| slug | VARCHAR(255) UNIQUE | URL amigable |
| description | TEXT | Descripción completa |
| short_description | TEXT | Descripción corta |
| price | DECIMAL(10,2) | Precio regular (default: 0) |
| sale_price | DECIMAL(10,2) | Precio en oferta (nullable) |
| image | VARCHAR(255) | Ruta de imagen principal |
| gallery | JSON | Imágenes adicionales |
| stock | INT | Cantidad en stock |
| is_featured | BOOLEAN | Producto destacado |
| is_new_release | BOOLEAN | Nuevo lanzamiento |
| is_active | BOOLEAN | Estado activo |
| platform | VARCHAR(50) | Plataforma (NES, SNES, Genesis, etc.) |
| developer | VARCHAR(100) | Desarrollador |
| publisher | VARCHAR(100) | Publicador |
| release_year | YEAR | Año de lanzamiento |
| rating | DECIMAL(2,1) | Puntuación (0.0–5.0) |
| downloads | INT | Número total de descargas (default: 0) |

### Tabla: product_files

| Campo | Tipo | Descripción |
|---|---|---|
| id | BIGINT PK | Identificador único |
| product_id | BIGINT FK → products | Producto asociado (CASCADE delete) |
| filename | VARCHAR(255) | Nombre del archivo en disco |
| original_name | VARCHAR(255) | Nombre original del archivo subido |
| file_path | VARCHAR(255) | Ruta relativa en disco `games` |
| file_size | BIGINT | Tamaño en bytes |
| mime_type | VARCHAR(255) | Tipo MIME del archivo |
| downloads | INT | Contador de descargas de este fichero (default: 0) |
| description | TEXT | Descripción del archivo (nullable) |
| version | VARCHAR(255) | Versión del archivo (nullable) |
| is_active | BOOLEAN | Si el archivo está disponible para descarga (default: true) |

### Tabla: user_downloads (pivot)

| Campo | Tipo | Descripción |
|---|---|---|
| id | BIGINT PK | Identificador único |
| user_id | BIGINT FK → users | Usuario que descargó (CASCADE delete) |
| product_id | BIGINT FK → products | Producto descargado (CASCADE delete) |
| downloaded_at | TIMESTAMP | Fecha y hora de la descarga |
| ip_address | VARCHAR(45) | IP del usuario (nullable) |

### Tabla: carts

| Campo | Tipo | Descripción |
|---|---|---|
| id | BIGINT PK | Identificador único |
| user_id | BIGINT FK → users | Usuario (nullable, para guests) |
| session_id | VARCHAR(255) | ID de sesión para invitados |

### Tabla: cart_items

| Campo | Tipo | Descripción |
|---|---|---|
| id | BIGINT PK | Identificador único |
| cart_id | BIGINT FK → carts | Carrito |
| product_id | BIGINT FK → products | Producto |
| quantity | INT | Cantidad |
| price | DECIMAL(10,2) | Precio al momento de añadir |

### Tabla: orders

| Campo | Tipo | Descripción |
|---|---|---|
| id | BIGINT PK | Identificador único |
| user_id | BIGINT FK → users | Usuario |
| order_number | VARCHAR(50) | Número de pedido (ej: ORD-XXXXXX) |
| status | ENUM | pending, processing, completed, cancelled |
| subtotal | DECIMAL(10,2) | Subtotal sin impuestos |
| tax | DECIMAL(10,2) | IVA (21%) |
| discount | DECIMAL(10,2) | Descuento aplicado |
| total | DECIMAL(10,2) | Total final |
| payment_method | VARCHAR(50) | credit_card, paypal, bank_transfer, free |
| payment_status | VARCHAR(50) | pending, paid, refunded |
| billing_address | JSON | Dirección de facturación serializada |

### Tabla: order_items

| Campo | Tipo | Descripción |
|---|---|---|
| id | BIGINT PK | Identificador único |
| order_id | BIGINT FK → orders | Pedido |
| product_id | BIGINT FK → products | Producto |
| product_name | VARCHAR(255) | Nombre del producto (snapshot) |
| quantity | INT | Cantidad |
| price | DECIMAL(10,2) | Precio unitario |
| total | DECIMAL(10,2) | Total de la línea |

---

## 8. Relaciones Eloquent (ORM)

### Modelo User

```php
// hasOne: Un usuario tiene un carrito
public function cart(): HasOne

// hasMany: Un usuario tiene muchos pedidos
public function orders(): HasMany

// belongsToMany: Un usuario puede descargar muchos productos (tabla pivot user_downloads)
public function downloads(): BelongsToMany

// Métodos auxiliares
public function isAdmin(): bool
public function isBanned(): bool
public function isSuspended(): bool
public function canAccess(): bool
public function ban(?string $reason): void
public function suspend(DateTime $until, ?string $reason): void
public function activate(): void
public function calculateLevelFromDownloads(): int  // Level = floor(downloads / 5) + 1
```

### Modelo Product

```php
// belongsTo: Un producto pertenece a una categoría
public function category(): BelongsTo

// hasMany: Un producto tiene muchos archivos descargables
public function files(): HasMany
public function activeFiles(): HasMany  // Solo archivos con is_active = true

// hasMany: Un producto puede estar en muchos cart_items / order_items
public function cartItems(): HasMany
public function orderItems(): HasMany

// belongsToMany: Un producto puede ser descargado por muchos usuarios
public function downloadedBy(): BelongsToMany

// Scopes
public function scopeActive($query)       // where is_active = true
public function scopeFeatured($query)      // where is_featured = true
public function scopeNewReleases($query)   // where is_new_release = true
public function scopeSearch($query, $term) // búsqueda por nombre, descripción, developer, publisher
public function scopeHasFiles($query)      // whereHas files activos

// Accessors
public function getCurrentPriceAttribute(): float  // sale_price ?? price
public function getIsFreeAttribute(): bool          // current_price == 0
public function getIsOnSaleAttribute(): bool        // sale_price < price
public function getImageUrlAttribute(): ?string
```

### Modelo ProductFile

```php
// belongsTo: Un archivo pertenece a un producto
public function product(): BelongsTo

public function incrementDownloads(): void
public function getDownloadUrl(): string
public function getFormattedFileSize(): string
public function deleteFile(): bool  // Elimina de Storage::disk('games')
```

### Modelo Category

```php
// hasMany: Una categoría tiene muchos productos
public function products(): HasMany
```

### Modelo Cart

```php
// belongsTo: Un carrito pertenece a un usuario
public function user(): BelongsTo

// hasMany: Un carrito tiene muchos items
public function items(): HasMany
```

### Modelo Order

```php
// belongsTo: Un pedido pertenece a un usuario
public function user(): BelongsTo

// hasMany: Un pedido tiene muchos items
public function items(): HasMany

public function markAsCompleted(): void  // Cambia status y payment_status
```

---

## 9. Rutas de la Aplicación

### Rutas Públicas (sin autenticación)

| Método | Ruta | Controlador | Descripción |
|---|---|---|---|
| GET | `/` | CatalogController@index | Página principal (Home) |
| GET | `/library` | CatalogController@catalog | Catálogo con filtros y búsqueda |
| GET | `/catalog` | CatalogController@catalog | Alias de /library |
| GET | `/discover` | CatalogController@discover | Página de descubrimiento |
| GET | `/product/{slug}` | CatalogController@show | Detalle de producto |
| GET | `/ping` | (closure) | Endpoint de latencia |

### Rutas del Carrito (sesión para guests)

| Método | Ruta | Controlador | Descripción |
|---|---|---|---|
| GET | `/cart` | CartController@index | Ver carrito |
| POST | `/cart/add/{product}` | CartController@add | Añadir producto |
| PATCH | `/cart/update/{product}` | CartController@update | Actualizar cantidad |
| DELETE | `/cart/remove/{product}` | CartController@remove | Eliminar producto |
| DELETE | `/cart/clear` | CartController@clear | Vaciar carrito |
| GET | `/cart/count` | CartController@count | Obtener nº items |

### Rutas Protegidas (auth + verified)

| Método | Ruta | Controlador | Descripción |
|---|---|---|---|
| GET | `/profile` | ProfileController@index | Perfil de usuario |
| GET | `/download/game/{productFile}` | GameDownloadController@download | Descargar archivo |
| GET | `/api/games/{productFile}/info` | GameDownloadController@info | Info del archivo |
| GET | `/downloads/queue` | DownloadController@index | Cola de descargas |
| POST | `/downloads/initialize` | DownloadController@initialize | Inicializar descargas |
| GET | `/checkout` | CheckoutController@index | Checkout |
| POST | `/checkout` | CheckoutController@process | Procesar compra |
| GET | `/payment/{order}` | CheckoutController@payment | Pago simulado |
| POST | `/payment/{order}/confirm` | CheckoutController@confirmPayment | Confirmar pago |
| GET | `/orders` | OrderController@index | Historial de pedidos |
| GET | `/orders/{order}` | OrderController@show | Detalle de pedido |

### Rutas de Autenticación (Fortify)

| Método | Ruta | Descripción |
|---|---|---|
| GET/POST | `/login` | Inicio de sesión |
| GET/POST | `/register` | Registro de usuario |
| POST | `/logout` | Cierre de sesión |
| GET/POST | `/forgot-password` | Recuperar contraseña |
| GET/POST | `/reset-password` | Restablecer contraseña |
| GET/POST | `/two-factor-challenge` | Verificación 2FA |
| GET | `/email/verify` | Verificación de email |

### Rutas de Administración (auth + verified + admin)

| Método | Ruta | Controlador | Descripción |
|---|---|---|---|
| GET | `/admin` | DashboardController@index | Dashboard |
| GET | `/admin/statistics` | StatisticsController@index | Estadísticas avanzadas |
| RESOURCE | `/admin/products` | ProductController | CRUD Productos |
| GET | `/admin/products/{product}/files` | GameFileController@index | Listar archivos |
| GET | `/admin/products/{product}/files/create` | GameFileController@create | Subir archivo |
| POST | `/admin/products/{product}/files` | GameFileController@store | Guardar archivo |
| GET | `/admin/products/{product}/files/{file}/edit` | GameFileController@edit | Editar archivo |
| PATCH | `/admin/products/{product}/files/{file}` | GameFileController@update | Actualizar archivo |
| DELETE | `/admin/products/{product}/files/{file}` | GameFileController@destroy | Eliminar archivo |
| PATCH | `/admin/products/{product}/files/{file}/toggle` | GameFileController@toggle | Activar/desactivar |
| RESOURCE | `/admin/categories` | CategoryController | CRUD Categorías |
| GET | `/admin/users` | UserController@index | Listar usuarios |
| GET | `/admin/users/{user}` | UserController@show | Detalle usuario |
| PATCH | `/admin/users/{user}/level` | UserController@updateLevel | Cambiar nivel |
| PATCH | `/admin/users/{user}/toggle-admin` | UserController@toggleAdmin | Promover/revocar admin |
| POST | `/admin/users/{user}/ban` | UserController@ban | Banear usuario |
| POST | `/admin/users/{user}/suspend` | UserController@suspend | Suspender usuario |
| POST | `/admin/users/{user}/activate` | UserController@activate | Activar usuario |
| DELETE | `/admin/users/{user}` | UserController@destroy | Eliminar usuario |

---

## 10. Estructura del Proyecto

```
app/
├── Http/
│   ├── Controllers/
│   │   ├── Admin/
│   │   │   ├── CategoryController.php     # CRUD categorías
│   │   │   ├── DashboardController.php    # Dashboard con estadísticas
│   │   │   ├── GameFileController.php     # Gestión de archivos ZIP
│   │   │   ├── ProductController.php      # CRUD productos
│   │   │   ├── StatisticsController.php   # Estadísticas avanzadas
│   │   │   └── UserController.php         # Gestión de usuarios
│   │   ├── Settings/
│   │   │   ├── PasswordController.php
│   │   │   ├── ProfileController.php
│   │   │   └── TwoFactorAuthenticationController.php
│   │   ├── CartController.php             # Carrito de compras
│   │   ├── CatalogController.php          # Catálogo y búsqueda
│   │   ├── CheckoutController.php         # Checkout + pago simulado
│   │   ├── DownloadController.php         # Cola de descargas
│   │   ├── GameDownloadController.php     # Descarga de archivos
│   │   ├── OrderController.php            # Historial de pedidos
│   │   └── ProfileController.php          # Perfil de usuario
│   └── Middleware/
│       ├── EnsureUserIsAdmin.php          # Middleware admin
│       └── ShareCartData.php              # Comparte datos de carrito
├── Models/
│   ├── Cart.php
│   ├── CartItem.php
│   ├── Category.php
│   ├── Order.php
│   ├── OrderItem.php
│   ├── Product.php
│   ├── ProductFile.php
│   └── User.php

database/
├── factories/
│   ├── CategoryFactory.php
│   ├── ProductFactory.php
│   └── UserFactory.php
├── migrations/
│   ├── 0001_01_01_000000_create_users_table.php
│   ├── 0001_01_01_000001_create_cache_table.php
│   ├── 0001_01_01_000002_create_jobs_table.php
│   ├── 2025_01_23_000001_create_categories_table.php
│   ├── 2025_01_23_000002_create_products_table.php
│   ├── 2025_01_23_000003_create_carts_table.php
│   ├── 2025_01_23_000004_create_cart_items_table.php
│   ├── 2025_01_23_000005_create_orders_table.php
│   ├── 2025_01_23_000006_create_order_items_table.php
│   ├── 2025_02_09_000000_create_product_files_table.php
│   ├── 2025_08_26_100418_add_two_factor_columns_to_users_table.php
│   ├── 2026_01_29_000001_add_admin_and_status_fields_to_users_table.php
│   └── 2026_01_29_000002_create_user_downloads_table.php
└── seeders/
    ├── AdminUserSeeder.php
    ├── CategorySeeder.php
    ├── DatabaseSeeder.php
    ├── ProductSeeder.php
    └── UserDownloadsSeeder.php

resources/js/
├── components/store/         # Componentes reutilizables de la tienda
├── layouts/
│   ├── admin/
│   │   └── admin-layout.tsx  # Layout del panel admin
│   └── store/
│       └── store-layout.tsx  # Layout de la tienda (header + sidebar + búsqueda)
└── pages/
    ├── admin/
    │   ├── categories/       # create, edit, index
    │   ├── products/
    │   │   ├── files/        # create, edit, index (gestión de ZIPs)
    │   │   ├── create.tsx
    │   │   ├── edit.tsx
    │   │   └── index.tsx
    │   ├── users/            # index, show
    │   ├── dashboard.tsx
    │   └── statistics.tsx
    ├── auth/
    │   ├── login.tsx
    │   ├── register.tsx
    │   ├── forgot-password.tsx
    │   ├── reset-password.tsx
    │   ├── confirm-password.tsx
    │   ├── verify-email.tsx
    │   └── two-factor-challenge.tsx
    ├── settings/
    │   ├── appearance.tsx
    │   ├── password.tsx
    │   ├── profile.tsx
    │   └── two-factor.tsx
    └── store/
        ├── cart.tsx
        ├── catalog.tsx
        ├── checkout.tsx
        ├── discover.tsx
        ├── download-queue.tsx
        ├── home.tsx
        ├── order-detail.tsx
        ├── orders.tsx
        ├── payment.tsx
        ├── product.tsx
        └── profile.tsx
```

---

## 11. Sistema de Niveles de Usuario

El nivel de cada usuario se calcula dinámicamente en base al número de descargas realizadas:

```
Nivel = floor(descargas / 5) + 1

0–4 descargas  → Nivel 1
5–9 descargas  → Nivel 2
10–14 descargas → Nivel 3
15–19 descargas → Nivel 4
...
```

El nivel se persiste en la columna `users.level` y se actualiza automáticamente después de cada descarga en el `GameDownloadController`. El perfil del usuario muestra el nivel actual y una barra de progreso hacia el siguiente nivel.

---

## 12. Instrucciones de Instalación

### Requisitos

- PHP 8.2+
- Composer 2.x
- Node.js 18+
- npm 9+
- SQLite / MySQL 8.0+ / PostgreSQL 15+

### Pasos

1. **Clonar e instalar dependencias**

```bash
git clone <repositorio>
cd avgames
composer install
npm install
```

2. **Configurar entorno**

```bash
cp .env.example .env
php artisan key:generate
```

3. **Configurar base de datos en `.env`**

```env
# SQLite (por defecto)
DB_CONNECTION=sqlite

# MySQL
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=avgames
DB_USERNAME=root
DB_PASSWORD=
```

4. **Ejecutar migraciones y seeders**

```bash
php artisan migrate:fresh --seed
```

5. **Crear enlace simbólico para storage**

```bash
php artisan storage:link
```

6. **Compilar assets**

```bash
npm run build
# o para desarrollo con hot-reload:
npm run dev
```

7. **Iniciar servidor**

```bash
php artisan serve
```

### Credenciales de prueba

| Rol | Email | Contraseña |
|---|---|---|
| **Admin** | admin@avgames.com | password |
| **Usuario** | test@example.com | password |

---

## 13. Rúbrica de Evaluación

| Criterio | Nivel | Estado |
|---|---|---|
| **Documentación E-R y Casos de Uso** | Diagrama E-R completo (8 tablas + pivot), 19 casos de uso detallados con actores, precondiciones y flujos | ✅ |
| **Arquitectura y Migraciones** | 13 migraciones, seeders y factories, filtrado y búsqueda avanzada | ✅ |
| **Operaciones CRUD** | Completas para productos, categorías, archivos y usuarios | ✅ |
| **Sesiones de Carrito** | Funciona para usuarios autenticados y guests (por sesión) | ✅ |
| **Gestión de Imágenes/Archivos** | Storage con disco `public` (imágenes) y disco `games` (ZIPs) | ✅ |
| **Relaciones Eloquent** | hasMany, belongsTo, hasOne, belongsToMany con tabla pivot | ✅ |
| **Autenticación y Autorización** | Fortify (login, registro, 2FA), middleware admin, sistema de roles | ✅ |
| **Panel de Administración** | Dashboard, estadísticas, gestión de usuarios, archivos | ✅ |
| **Sistema de Descargas** | Control de acceso, registro en historial, estadísticas, niveles | ✅ |
| **Proceso de Pago** | Checkout diferenciado (free/paid), pago simulado con 3 métodos | ✅ |

---

## Autor

Proyecto desarrollado como ejercicio de e-commerce con **Laravel 11** y **React + TypeScript** (Inertia.js).
