# RETRO STORE - E-Commerce de Videojuegos Retro

## Documentación del Proyecto

### Descripción General

RETRO STORE es un e-commerce de videojuegos retro con estética synthwave/80s. El proyecto está desarrollado con:

- **Backend**: Laravel 11 (PHP 8.2+)
- **Frontend**: React + TypeScript con Inertia.js
- **Base de Datos**: MySQL/PostgreSQL
- **Estilos**: Tailwind CSS con tema synthwave personalizado

---

## Diagrama Entidad-Relación (E-R)

```
┌─────────────────┐       ┌─────────────────┐
│     USERS       │       │   CATEGORIES    │
├─────────────────┤       ├─────────────────┤
│ id (PK)         │       │ id (PK)         │
│ name            │       │ name            │
│ email           │       │ slug            │
│ password        │       │ description     │
│ created_at      │       │ icon            │
│ updated_at      │       │ color           │
└────────┬────────┘       │ is_active       │
         │                │ sort_order      │
         │                └────────┬────────┘
         │                         │
    ┌────┴────┐                    │ 1:N
    │         │                    │
    ▼         ▼                    ▼
┌─────────┐ ┌─────────┐    ┌─────────────────┐
│  CARTS  │ │ ORDERS  │    │    PRODUCTS     │
├─────────┤ ├─────────┤    ├─────────────────┤
│ id (PK) │ │ id (PK) │    │ id (PK)         │
│ user_id │ │ user_id │◄───│ category_id(FK) │
│session_id│ │order_num│    │ name            │
│created_at│ │ status  │    │ slug            │
└────┬────┘ │ subtotal │    │ description     │
     │      │ tax      │    │ price           │
     │      │ total    │    │ sale_price      │
     │      │ payment  │    │ image           │
     │ 1:N  │ billing  │    │ stock           │
     │      └────┬─────┘    │ is_featured     │
     │           │          │ is_new_release  │
     ▼           ▼          │ platform        │
┌──────────┐ ┌──────────┐   │ developer       │
│CART_ITEMS│ │ORDER_ITEMS│  │ rating          │
├──────────┤ ├──────────┤   │ downloads       │
│ id (PK)  │ │ id (PK)  │   └────────┬────────┘
│cart_id FK│ │order_id  │            │
│product_id│ │product_id│◄───────────┘
│ quantity │ │prod_name │         N:1
│ price    │ │ quantity │
└──────────┘ │ price    │
             │ total    │
             └──────────┘
```

### Relaciones entre Entidades

| Entidad Origen | Relación  | Entidad Destino | Tipo |
| -------------- | --------- | --------------- | ---- |
| User           | hasOne    | Cart            | 1:1  |
| User           | hasMany   | Order           | 1:N  |
| Category       | hasMany   | Product         | 1:N  |
| Product        | belongsTo | Category        | N:1  |
| Cart           | belongsTo | User            | N:1  |
| Cart           | hasMany   | CartItem        | 1:N  |
| CartItem       | belongsTo | Cart            | N:1  |
| CartItem       | belongsTo | Product         | N:1  |
| Order          | belongsTo | User            | N:1  |
| Order          | hasMany   | OrderItem       | 1:N  |
| OrderItem      | belongsTo | Order           | N:1  |
| OrderItem      | belongsTo | Product         | N:1  |

---

## Casos de Uso

### Diagrama de Casos de Uso

```
                    ┌─────────────────────────────────────────────┐
                    │              RETRO STORE                     │
                    │                                              │
    ┌───────┐       │   ┌─────────────────────────────────┐       │
    │       │       │   │     Ver Catálogo de Productos    │       │
    │ Guest │───────┼──►│                                  │       │
    │       │       │   └─────────────────────────────────┘       │
    └───────┘       │                                              │
        │           │   ┌─────────────────────────────────┐       │
        │           │   │     Buscar Productos             │       │
        └───────────┼──►│                                  │       │
                    │   └─────────────────────────────────┘       │
                    │                                              │
                    │   ┌─────────────────────────────────┐       │
                    │   │     Filtrar por Categoría        │       │
    ┌───────┐       │   │                                  │       │
    │       │───────┼──►└─────────────────────────────────┘       │
    │ User  │       │                                              │
    │       │       │   ┌─────────────────────────────────┐       │
    └───────┘       │   │     Ver Detalle de Producto      │       │
        │           │   │                                  │       │
        │───────────┼──►└─────────────────────────────────┘       │
        │           │                                              │
        │           │   ┌─────────────────────────────────┐       │
        │           │   │     Añadir al Carrito            │       │
        │───────────┼──►│                                  │       │
        │           │   └─────────────────────────────────┘       │
        │           │                                              │
        │           │   ┌─────────────────────────────────┐       │
        │           │   │     Gestionar Carrito            │       │
        │───────────┼──►│  (actualizar cantidad, eliminar) │       │
        │           │   └─────────────────────────────────┘       │
        │           │                                              │
        │           │   ┌─────────────────────────────────┐       │
        │           │   │     Realizar Checkout            │       │
        │───────────┼──►│                                  │       │
        │           │   └─────────────────────────────────┘       │
        │           │                                              │
        │           │   ┌─────────────────────────────────┐       │
        │           │   │     Ver Historial de Pedidos     │       │
        └───────────┼──►│                                  │       │
                    │   └─────────────────────────────────┘       │
                    │                                              │
    ┌───────┐       │   ┌─────────────────────────────────┐       │
    │       │       │   │     Gestionar Productos (CRUD)   │       │
    │ Admin │───────┼──►│                                  │       │
    │       │       │   └─────────────────────────────────┘       │
    └───────┘       │                                              │
        │           │   ┌─────────────────────────────────┐       │
        │           │   │     Gestionar Categorías (CRUD)  │       │
        └───────────┼──►│                                  │       │
                    │   └─────────────────────────────────┘       │
                    │                                              │
                    └─────────────────────────────────────────────┘
```

### Descripción de Casos de Uso

#### CU-01: Ver Catálogo de Productos

| Campo               | Descripción                                                                                                      |
| ------------------- | ---------------------------------------------------------------------------------------------------------------- |
| **Actor**           | Guest / Usuario                                                                                                  |
| **Descripción**     | El usuario puede ver todos los productos disponibles                                                             |
| **Precondición**    | Ninguna                                                                                                          |
| **Flujo Principal** | 1. Usuario accede a /library<br>2. Sistema muestra productos paginados<br>3. Usuario puede navegar entre páginas |
| **Postcondición**   | Se muestran los productos activos                                                                                |

#### CU-02: Filtrar por Categoría

| Campo               | Descripción                                                                                                          |
| ------------------- | -------------------------------------------------------------------------------------------------------------------- |
| **Actor**           | Guest / Usuario                                                                                                      |
| **Descripción**     | El usuario puede filtrar productos por categoría                                                                     |
| **Precondición**    | Existen productos y categorías                                                                                       |
| **Flujo Principal** | 1. Usuario selecciona una categoría<br>2. Sistema filtra productos<br>3. Se muestran solo productos de esa categoría |
| **Postcondición**   | Lista filtrada de productos                                                                                          |

#### CU-03: Añadir al Carrito

| Campo               | Descripción                                                                                                                                 |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| **Actor**           | Guest / Usuario                                                                                                                             |
| **Descripción**     | El usuario puede añadir productos al carrito                                                                                                |
| **Precondición**    | Producto existe y está activo                                                                                                               |
| **Flujo Principal** | 1. Usuario hace clic en "Add to Cart"<br>2. Sistema añade producto al carrito (sesión o usuario)<br>3. Se actualiza el contador del carrito |
| **Postcondición**   | Producto añadido al carrito                                                                                                                 |

#### CU-04: Gestionar Carrito

| Campo               | Descripción                                                                                           |
| ------------------- | ----------------------------------------------------------------------------------------------------- |
| **Actor**           | Guest / Usuario                                                                                       |
| **Descripción**     | El usuario puede modificar cantidades o eliminar productos                                            |
| **Precondición**    | Carrito tiene productos                                                                               |
| **Flujo Principal** | 1. Usuario accede a /cart<br>2. Modifica cantidad o elimina productos<br>3. Sistema actualiza totales |
| **Postcondición**   | Carrito actualizado                                                                                   |

#### CU-05: Realizar Checkout

| Campo               | Descripción                                                                                                                                                      |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Actor**           | Usuario autenticado                                                                                                                                              |
| **Descripción**     | El usuario completa una compra                                                                                                                                   |
| **Precondición**    | Usuario autenticado, carrito con productos                                                                                                                       |
| **Flujo Principal** | 1. Usuario accede a /checkout<br>2. Completa datos de facturación<br>3. Selecciona método de pago<br>4. Confirma pedido<br>5. Sistema crea orden y vacía carrito |
| **Postcondición**   | Orden creada, carrito vacío                                                                                                                                      |

#### CU-06: Gestionar Productos (Admin)

| Campo               | Descripción                                 |
| ------------------- | ------------------------------------------- |
| **Actor**           | Administrador                               |
| **Descripción**     | CRUD completo de productos                  |
| **Precondición**    | Usuario con permisos de admin               |
| **Flujo Principal** | Crear, Leer, Actualizar, Eliminar productos |
| **Postcondición**   | Producto creado/actualizado/eliminado       |

---

## Estructura de la Base de Datos

### Tabla: categories

| Campo       | Tipo         | Descripción               |
| ----------- | ------------ | ------------------------- |
| id          | BIGINT PK    | Identificador único       |
| name        | VARCHAR(100) | Nombre de la categoría    |
| slug        | VARCHAR(100) | URL amigable              |
| description | TEXT         | Descripción               |
| icon        | VARCHAR(50)  | Nombre del icono Material |
| color       | VARCHAR(20)  | Color hexadecimal         |
| is_active   | BOOLEAN      | Estado activo/inactivo    |
| sort_order  | INT          | Orden de visualización    |

### Tabla: products

| Campo             | Tipo          | Descripción                  |
| ----------------- | ------------- | ---------------------------- |
| id                | BIGINT PK     | Identificador único          |
| category_id       | BIGINT FK     | Categoría del producto       |
| name              | VARCHAR(255)  | Nombre del producto          |
| slug              | VARCHAR(255)  | URL amigable                 |
| description       | TEXT          | Descripción completa         |
| short_description | TEXT          | Descripción corta            |
| price             | DECIMAL(10,2) | Precio regular               |
| sale_price        | DECIMAL(10,2) | Precio en oferta             |
| image             | VARCHAR(255)  | Ruta de imagen               |
| gallery           | JSON          | Imágenes adicionales         |
| stock             | INT           | Cantidad en stock            |
| is_featured       | BOOLEAN       | Producto destacado           |
| is_new_release    | BOOLEAN       | Nuevo lanzamiento            |
| is_active         | BOOLEAN       | Estado activo                |
| platform          | VARCHAR(50)   | Plataforma (NES, SNES, etc.) |
| developer         | VARCHAR(100)  | Desarrollador                |
| publisher         | VARCHAR(100)  | Publicador                   |
| release_year      | YEAR          | Año de lanzamiento           |
| rating            | DECIMAL(2,1)  | Puntuación (0.0-5.0)         |
| downloads         | INT           | Número de descargas          |

### Tabla: carts

| Campo      | Tipo         | Descripción         |
| ---------- | ------------ | ------------------- |
| id         | BIGINT PK    | Identificador único |
| user_id    | BIGINT FK    | Usuario (nullable)  |
| session_id | VARCHAR(255) | Sesión para guests  |

### Tabla: cart_items

| Campo      | Tipo          | Descripción         |
| ---------- | ------------- | ------------------- |
| id         | BIGINT PK     | Identificador único |
| cart_id    | BIGINT FK     | Carrito             |
| product_id | BIGINT FK     | Producto            |
| quantity   | INT           | Cantidad            |
| price      | DECIMAL(10,2) | Precio al añadir    |

### Tabla: orders

| Campo           | Tipo          | Descripción                               |
| --------------- | ------------- | ----------------------------------------- |
| id              | BIGINT PK     | Identificador único                       |
| user_id         | BIGINT FK     | Usuario                                   |
| order_number    | VARCHAR(50)   | Número de pedido                          |
| status          | ENUM          | pending, processing, completed, cancelled |
| subtotal        | DECIMAL(10,2) | Subtotal                                  |
| tax             | DECIMAL(10,2) | Impuestos (IVA 21%)                       |
| discount        | DECIMAL(10,2) | Descuento aplicado                        |
| total           | DECIMAL(10,2) | Total final                               |
| payment_method  | VARCHAR(50)   | Método de pago                            |
| payment_status  | VARCHAR(50)   | Estado del pago                           |
| billing_address | JSON          | Dirección de facturación                  |

### Tabla: order_items

| Campo        | Tipo          | Descripción         |
| ------------ | ------------- | ------------------- |
| id           | BIGINT PK     | Identificador único |
| order_id     | BIGINT FK     | Pedido              |
| product_id   | BIGINT FK     | Producto            |
| product_name | VARCHAR(255)  | Nombre (snapshot)   |
| quantity     | INT           | Cantidad            |
| price        | DECIMAL(10,2) | Precio unitario     |
| total        | DECIMAL(10,2) | Total línea         |

---

## Relaciones Eloquent (ORM)

### Modelo Category

```php
// hasMany: Una categoría tiene muchos productos
public function products(): HasMany
{
    return $this->hasMany(Product::class);
}
```

### Modelo Product

```php
// belongsTo: Un producto pertenece a una categoría
public function category(): BelongsTo
{
    return $this->belongsTo(Category::class);
}

// hasMany: Un producto puede estar en muchos cart_items
public function cartItems(): HasMany
{
    return $this->hasMany(CartItem::class);
}
```

### Modelo User

```php
// hasOne: Un usuario tiene un carrito
public function cart(): HasOne
{
    return $this->hasOne(Cart::class);
}

// hasMany: Un usuario tiene muchos pedidos
public function orders(): HasMany
{
    return $this->hasMany(Order::class);
}
```

### Modelo Cart

```php
// belongsTo: Un carrito pertenece a un usuario
public function user(): BelongsTo
{
    return $this->belongsTo(User::class);
}

// hasMany: Un carrito tiene muchos items
public function items(): HasMany
{
    return $this->hasMany(CartItem::class);
}
```

### Modelo Order

```php
// belongsTo: Un pedido pertenece a un usuario
public function user(): BelongsTo
{
    return $this->belongsTo(User::class);
}

// hasMany: Un pedido tiene muchos items
public function items(): HasMany
{
    return $this->hasMany(OrderItem::class);
}
```

---

## Rutas de la Aplicación

### Rutas Públicas

| Método | Ruta            | Controlador                | Descripción              |
| ------ | --------------- | -------------------------- | ------------------------ |
| GET    | /               | CatalogController@index    | Página principal         |
| GET    | /library        | CatalogController@catalog  | Catálogo con filtros     |
| GET    | /discover       | CatalogController@discover | Página de descubrimiento |
| GET    | /product/{slug} | CatalogController@show     | Detalle de producto      |

### Rutas del Carrito

| Método | Ruta                   | Controlador           | Descripción         |
| ------ | ---------------------- | --------------------- | ------------------- |
| GET    | /cart                  | CartController@index  | Ver carrito         |
| POST   | /cart/add/{product}    | CartController@add    | Añadir producto     |
| PATCH  | /cart/update/{product} | CartController@update | Actualizar cantidad |
| DELETE | /cart/remove/{product} | CartController@remove | Eliminar producto   |
| DELETE | /cart/clear            | CartController@clear  | Vaciar carrito      |

### Rutas Protegidas (Auth)

| Método | Ruta            | Controlador                | Descripción       |
| ------ | --------------- | -------------------------- | ----------------- |
| GET    | /profile        | ProfileController@index    | Perfil de usuario |
| GET    | /checkout       | CheckoutController@index   | Checkout          |
| POST   | /checkout       | CheckoutController@process | Procesar compra   |
| GET    | /orders         | OrderController@index      | Lista de pedidos  |
| GET    | /orders/{order} | OrderController@show       | Detalle de pedido |

### Rutas Admin

| Método   | Ruta              | Controlador        | Descripción     |
| -------- | ----------------- | ------------------ | --------------- |
| Resource | /admin/products   | ProductController  | CRUD Productos  |
| Resource | /admin/categories | CategoryController | CRUD Categorías |

---

## Instrucciones de Instalación

### Requisitos

- PHP 8.2+
- Composer
- Node.js 18+
- MySQL 8.0+ / PostgreSQL 15+

### Pasos

1. **Clonar e instalar dependencias**

```bash
composer install
npm install
```

2. **Configurar entorno**

```bash
cp .env.example .env
php artisan key:generate
```

3. **Configurar base de datos en .env**

```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=retrostore
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
# o para desarrollo:
npm run dev
```

7. **Iniciar servidor**

```bash
php artisan serve
```

### Credenciales de prueba

- **Admin**: admin@retrostore.com / password
- **Usuario**: test@example.com / password

---

## Estructura del Proyecto

```
app/
├── Http/
│   ├── Controllers/
│   │   ├── Admin/
│   │   │   ├── CategoryController.php
│   │   │   └── ProductController.php
│   │   ├── CartController.php
│   │   ├── CatalogController.php
│   │   ├── CheckoutController.php
│   │   ├── OrderController.php
│   │   └── ProfileController.php
│   └── Middleware/
│       └── ShareCartData.php
├── Models/
│   ├── Cart.php
│   ├── CartItem.php
│   ├── Category.php
│   ├── Order.php
│   ├── OrderItem.php
│   ├── Product.php
│   └── User.php
│
database/
├── factories/
│   ├── CategoryFactory.php
│   └── ProductFactory.php
├── migrations/
│   ├── 2025_01_23_000001_create_categories_table.php
│   ├── 2025_01_23_000002_create_products_table.php
│   ├── 2025_01_23_000003_create_carts_table.php
│   ├── 2025_01_23_000004_create_cart_items_table.php
│   ├── 2025_01_23_000005_create_orders_table.php
│   └── 2025_01_23_000006_create_order_items_table.php
└── seeders/
    ├── CategorySeeder.php
    ├── DatabaseSeeder.php
    └── ProductSeeder.php
│
resources/js/
├── components/store/
│   ├── category-card.tsx
│   ├── hero-banner.tsx
│   ├── notification-box.tsx
│   ├── product-card.tsx
│   └── section-title.tsx
├── layouts/store/
│   └── store-layout.tsx
└── pages/store/
    ├── cart.tsx
    ├── catalog.tsx
    ├── checkout.tsx
    ├── discover.tsx
    ├── home.tsx
    ├── order-detail.tsx
    ├── orders.tsx
    ├── product.tsx
    └── profile.tsx
```

---

## Rúbrica de Evaluación

| Criterio                             | Nivel                                                       | Puntuación |
| ------------------------------------ | ----------------------------------------------------------- | ---------- |
| **Documentación E-R y Casos de Uso** | Profesional, normalizado y coherente                        | ✓          |
| **Arquitectura y Migraciones**       | Base de datos bien estructurada, seeds, factories, filtrado | ✓          |
| **Operaciones CRUD**                 | Completas para productos y categorías                       | ✓          |
| **Sesiones de Carrito**              | Funciona para usuarios y guests                             | ✓          |
| **Gestión de Imágenes**              | Storage configurado correctamente                           | ✓          |
| **Relaciones Eloquent**              | hasMany, belongsTo, hasOne implementadas                    | ✓          |

---

## Autor

Proyecto desarrollado como ejercicio de e-commerce con Laravel y React.
