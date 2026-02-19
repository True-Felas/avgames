# Arquitectura del Proyecto AVGames — Explicación

## ¿Qué tecnologías usamos?

Estamos usando **Laravel** como backend con patrón **MVC** y **React** en frontend mediante **Inertia.js**, que actúa como capa intermedia para renderizar componentes React desde controladores Laravel sin necesidad de una API REST separada.

---

## El Patrón MVC (lo básico)

MVC significa **Modelo - Vista - Controlador**. Es un patrón de diseño que separa la aplicación en tres capas:

Piensa en un restaurante:

- **El menú** (lo que ve el cliente) = **Vista (View)** → Los archivos `.tsx` de React (las pantallas que ve el usuario)
- **El camarero** (recoge pedidos y trae platos) = **Controlador (Controller)** → Los `Controller.php` de Laravel
- **La cocina** (prepara la comida, gestiona ingredientes) = **Modelo (Model)** → Los `Model.php` (User, Product, Order...)

El cliente (usuario) **nunca entra a la cocina**. Solo habla con el camarero.

---

## ¿Qué hace cada tecnología?

### Laravel (PHP) = El backend, "la cocina"

- Gestiona la base de datos (modelos)
- Procesa la lógica de negocio (controladores)
- Decide qué datos enviar al frontend
- Maneja la autenticación, permisos, etc.

### React (TypeScript) = El frontend, "el menú bonito"

- Lo que el usuario VE y toca en el navegador
- Los botones, formularios, animaciones, la estética synthwave
- Solo se preocupa de cómo se ven las cosas

---

## ¿Y qué es Inertia.js? La magia del medio

Aquí es donde se pone interesante. Normalmente, si tienes un backend (Laravel) y un frontend (React) separados, necesitas crear una **API REST** — es decir, el backend tiene que crear "endpoints" que devuelven JSON, y el frontend tiene que llamar a esos endpoints con `fetch()` o `axios`.

### SIN Inertia (forma tradicional):

1. Usuario hace clic en "Ver catálogo"
2. React hace: `fetch('/api/products')` ← llamada HTTP
3. Laravel devuelve: `{ products: [...] }` ← JSON
4. React recibe el JSON y pinta la pantalla

Es decir, necesitas dos pasos: crear la API y luego consumirla.

### CON Inertia (como funciona nuestro proyecto):

1. Usuario hace clic en "Ver catálogo"
2. Laravel ejecuta el controlador directamente
3. El controlador dice: "Renderiza la página 'catalog' y pásale estos datos"
4. React recibe los datos y pinta la pantalla

Inertia **elimina el paso intermedio** de la API. El controlador le pasa los datos directamente al componente React.

---

## Ejemplo real del proyecto

### En el backend (Laravel):

```php
// CatalogController.php
public function catalog(Request $request)
{
    $products = Product::active()->paginate(12);

    // ESTO es Inertia: "renderiza el componente React
    // store/catalog.tsx y dale estos datos"
    return Inertia::render('store/catalog', [
        'products' => $products,
        'categories' => Category::active()->get(),
    ]);
}
```

### En el frontend (React):

```tsx
// pages/store/catalog.tsx
// Recibe directamente los datos como "props"
export default function Catalog({ products, categories }) {
    return (
        <div>
            {products.map(product => (
                <ProductCard product={product} />
            ))}
        </div>
    );
}
```

---

## ¿Cuál es la ventaja de Inertia?

- **No necesitas crear una API** (`/api/products`, `/api/categories`...).
- **No necesitas hacer `fetch()`** en React para pedir datos.
- El controlador Laravel le **pasa los datos directamente** al componente React, como si fuera una vista Blade tradicional, pero en vez de HTML renderiza React.
- La navegación entre páginas **no recarga toda la página** (funciona como una SPA — Single Page Application), solo cambia el contenido central.
- Mantiene las **ventajas de Laravel** (rutas con nombre, middleware, validación, sesiones) junto con las **ventajas de React** (componentes, estado, interfaz dinámica).

---

## Resumen en una frase

**Laravel se encarga de la lógica y los datos, React se encarga de lo visual, e Inertia.js es el "puente" que los conecta sin necesitar una API REST.**

Es como si el camarero del restaurante pudiera teletransportar los platos directamente de la cocina a la mesa, sin tener que caminar.

---

## Stack tecnológico completo

- **Backend**: Laravel 11 (PHP 8.2+)
- **Frontend**: React 18 + TypeScript
- **Puente**: Inertia.js
- **Base de datos**: SQLite / MySQL / PostgreSQL
- **Estilos**: Tailwind CSS (tema synthwave personalizado)
- **Autenticación**: Laravel Fortify (login, registro, 2FA)
- **Almacenamiento**: Laravel Storage (disco "games" para ZIPs, disco "public" para imágenes)
- **Bundler**: Vite (empaqueta y sirve el JavaScript/CSS en desarrollo)
