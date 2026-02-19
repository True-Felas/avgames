# Arquitectura y Justificación Tecnológica del Proyecto AVGames

## 1. Introducción

El presente documento describe y justifica las decisiones arquitectónicas tomadas durante el desarrollo de **AVGames**, una plataforma e-commerce de videojuegos retro. Se detalla el patrón de diseño empleado, las tecnologías seleccionadas y cómo interactúan entre sí para conformar una aplicación web moderna, mantenible y escalable.

---

## 2. Patrón de Diseño: MVC (Modelo - Vista - Controlador)

La aplicación sigue el patrón **MVC**, que estructura el código en tres capas claramente diferenciadas:

- **Modelo (Model)**: Representa la lógica de datos y las reglas de negocio. En nuestro proyecto, los modelos Eloquent (`User`, `Product`, `Category`, `Order`, `Cart`, `ProductFile`, etc.) encapsulan las consultas a la base de datos, las relaciones entre entidades y los métodos de negocio como el cálculo de niveles de usuario o la verificación de permisos de descarga.

- **Vista (View)**: Es la capa de presentación, lo que el usuario final ve e interactúa en el navegador. En nuestro caso, las vistas son componentes React escritos en TypeScript (archivos `.tsx`) ubicados en `resources/js/pages/`. Cada página de la aplicación (catálogo, carrito, checkout, perfil, panel admin, etc.) es un componente React independiente.

- **Controlador (Controller)**: Actúa como intermediario entre el modelo y la vista. Recibe las peticiones HTTP del usuario, interactúa con los modelos para obtener o modificar datos, y devuelve la respuesta apropiada. Los controladores están organizados en `app/Http/Controllers/` y separados por área funcional (tienda, administración, configuración).

Esta separación nos permite modificar la interfaz de usuario sin alterar la lógica de negocio, y viceversa.

---

## 3. Stack Tecnológico

### 3.1. Backend — Laravel 11 (PHP 8.2+)

El uso de **Laravel** viene dado por los requisitos del proyecto, ya que la asignatura establece el desarrollo de una aplicación e-commerce con este framework. No obstante, a lo largo del desarrollo hemos aprovechado las herramientas que Laravel ofrece y que han facilitado considerablemente el trabajo:

- **ORM Eloquent**: Nos permite trabajar con la base de datos mediante objetos PHP en lugar de escribir SQL a mano. Cada tabla tiene un modelo asociado con relaciones definidas (`hasMany`, `belongsTo`, `belongsToMany`), lo que simplifica las consultas y mantiene el código legible.
- **Sistema de migraciones**: Cada cambio en la estructura de la base de datos queda registrado como un archivo de migración versionado, lo que facilita la colaboración en equipo y garantiza que todos los miembros trabajen con la misma estructura.
- **Middleware**: Permite aplicar filtros a las rutas de forma declarativa. Utilizamos middleware para verificar la autenticación (`auth`), la verificación de email (`verified`) y el rol de administrador (`admin`).
- **Validación integrada**: Laravel valida los datos de los formularios directamente en el controlador, devolviendo errores claros al frontend sin necesidad de lógica adicional.

### 3.2. Frontend — React 18 + TypeScript

Para la capa de presentación utilizamos **React** con **TypeScript** por las siguientes ventajas:

- **Componentes reutilizables**: La interfaz se construye a partir de componentes independientes (tarjetas de producto, formularios, layouts) que se pueden combinar y reutilizar en diferentes páginas.
- **TypeScript**: Añade tipado estático a JavaScript, lo que nos ayuda a detectar errores durante el desarrollo en lugar de en tiempo de ejecución. Cada componente tiene sus tipos definidos para las props que recibe.
- **Experiencia de usuario fluida**: React permite actualizar solo las partes de la página que cambian, sin necesidad de recargar toda la ventana del navegador.

### 3.3. Capa de conexión — Inertia.js

Inertia.js no era una tecnología que conociéramos previamente. Durante la fase inicial del proyecto, al investigar cómo conectar un frontend React con un backend Laravel, encontramos que la alternativa convencional — construir una API REST completa — añadía una complejidad considerable para el alcance de nuestro proyecto. Investigando las opciones disponibles dentro del ecosistema Laravel, descubrimos **Inertia.js** y, tras estudiar su documentación y ejemplos, consideramos que encajaba perfectamente con nuestras necesidades. Inertia actúa como puente entre Laravel y React, eliminando la necesidad de construir una API REST separada.

#### ¿Cómo funciona?

En una arquitectura tradicional con backend y frontend separados, el flujo sería:

1. El usuario navega a una página.
2. El frontend (React) hace una petición HTTP a un endpoint de la API (`GET /api/products`).
3. El backend (Laravel) procesa la petición y devuelve una respuesta JSON.
4. El frontend recibe el JSON y renderiza la interfaz.

Esto implica mantener dos conjuntos de rutas (las del frontend y las de la API), gestionar tokens de autenticación entre ambos, y duplicar lógica de validación.

Con Inertia.js, el flujo se simplifica:

1. El usuario navega a una página.
2. Laravel ejecuta el controlador correspondiente.
3. El controlador utiliza `Inertia::render()` para indicar qué componente React debe renderizarse y qué datos debe recibir.
4. Inertia se encarga de pasar esos datos al componente React como props.

#### Ejemplo concreto de nuestro proyecto

En el controlador del catálogo:

```php
// app/Http/Controllers/CatalogController.php
public function catalog(Request $request)
{
    $products = Product::active()->paginate(12);

    return Inertia::render('store/catalog', [
        'products' => $products,
        'categories' => Category::active()->get(),
    ]);
}
```

El método `Inertia::render()` le dice a Inertia: "renderiza el componente React ubicado en `pages/store/catalog.tsx` y pásale los datos `products` y `categories`".

En el componente React:

```tsx
// resources/js/pages/store/catalog.tsx
export default function Catalog({ products, categories }) {
    return (
        <div>
            {products.data.map(product => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
}
```

El componente recibe los datos directamente como propiedades (props), sin necesidad de hacer ninguna petición HTTP adicional.

#### Ventajas de este enfoque

- **Un solo conjunto de rutas**: Las rutas definidas en `routes/web.php` sirven tanto para el backend como para el frontend.
- **Autenticación unificada**: Se utiliza el sistema de sesiones nativo de Laravel, sin necesidad de tokens JWT ni APIs de autenticación separadas.
- **Navegación tipo SPA**: Cuando el usuario navega entre páginas, Inertia intercepta la petición, la envía al servidor y actualiza solo el contenido central de la página, sin recargar el navegador completo. Esto proporciona una experiencia de usuario fluida similar a una Single Page Application.
- **Validación en un solo lugar**: Las validaciones se hacen en el controlador Laravel y los errores se pasan automáticamente al componente React, que puede mostrarlos junto a los campos correspondientes.

### 3.4. Estilos — Tailwind CSS

Utilizamos **Tailwind CSS** como framework de estilos por su filosofía de clases de utilidad, que nos permite construir interfaces personalizadas directamente en el markup sin necesidad de escribir archivos CSS separados. Hemos implementado un tema personalizado con estética synthwave/80s acorde a la temática retro de la plataforma.

### 3.5. Autenticación — Laravel Fortify

Para la gestión de usuarios implementamos **Laravel Fortify**, que proporciona las funcionalidades de autenticación sin imponer una interfaz de usuario:

- Registro e inicio de sesión
- Recuperación de contraseña
- Verificación de email
- Autenticación en dos factores (2FA) opcional

Al no incluir vistas propias, Fortify se integra perfectamente con nuestro frontend React, ya que nosotros diseñamos las pantallas de login, registro y 2FA con nuestro propio estilo.

### 3.6. Almacenamiento de Archivos

La gestión de archivos se realiza mediante el sistema de **Storage** de Laravel con dos discos diferenciados:

- **Disco `public`**: Para imágenes de productos y avatares, accesibles directamente por URL a través de un enlace simbólico.
- **Disco `games`**: Para los archivos descargables (ZIPs de juegos), almacenados en `storage/app/games/` de forma **privada**. Estos archivos NO son accesibles directamente por URL; solo se pueden descargar a través de la ruta protegida `/download/game/{id}`, que verifica que el usuario tiene permiso antes de servir el archivo.

### 3.7. Bundler — Vite

**Vite** se encarga de compilar y servir los archivos JavaScript, TypeScript y CSS durante el desarrollo. En modo desarrollo (`npm run dev`), proporciona recarga en caliente (hot module replacement), y para producción (`npm run build`), genera archivos optimizados y minificados.

---

## 4. Flujo de una petición típica

Para ilustrar cómo interactúan todas las capas, describimos el flujo completo cuando un usuario visita la página del catálogo:

1. **El usuario** hace clic en "Library" en el menú lateral.
2. **El navegador** envía una petición `GET /library` al servidor.
3. **Laravel** (a través de `routes/web.php`) dirige la petición al método `catalog()` del `CatalogController`.
4. **El middleware** `ShareCartData` inyecta automáticamente el número de items del carrito para que aparezca en el header.
5. **El controlador** consulta la base de datos a través del modelo `Product` (aplicando filtros de búsqueda, categoría y paginación) y del modelo `Category`.
6. **Inertia** toma los datos devueltos por el controlador y los envía al componente React `store/catalog.tsx`.
7. **React** renderiza la interfaz con las tarjetas de productos, filtros y paginación.
8. **El usuario** ve la página resultante sin que se haya producido una recarga completa del navegador.

---

## 5. Estructura del proyecto

La organización del código sigue las convenciones estándar de Laravel con la adición del directorio de recursos de React:

- `app/Models/` — Modelos Eloquent (8 modelos: User, Product, Category, ProductFile, Cart, CartItem, Order, OrderItem)
- `app/Http/Controllers/` — Controladores organizados por área (tienda, admin, settings)
- `app/Http/Middleware/` — Middleware personalizado (verificación admin, datos de carrito compartidos)
- `database/migrations/` — 13 migraciones que definen la estructura de la base de datos
- `database/seeders/` — Seeders para poblar la base de datos con datos de prueba
- `resources/js/pages/` — 37 páginas React organizadas por sección (store, admin, auth, settings)
- `resources/js/layouts/` — Layouts reutilizables (tienda y admin)
- `routes/web.php` — Definición centralizada de todas las rutas de la aplicación

---

## 6. Conclusión

La combinación de Laravel, React e Inertia.js nos ha permitido desarrollar una aplicación web completa con las ventajas de un framework backend robusto (ORM, migraciones, autenticación, middleware) y un frontend moderno y reactivo, sin la complejidad adicional de mantener una API REST separada. Esta arquitectura resulta especialmente adecuada para aplicaciones monolíticas que requieren una experiencia de usuario rica y fluida, como es el caso de una plataforma e-commerce.
