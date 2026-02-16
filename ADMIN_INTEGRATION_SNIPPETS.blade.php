<!-- 
EJEMPLO: Cómo agregar acceso a "Gestionar Archivos" en el Admin

Este snippet muestra cómo agregar un botón o enlace en tu panel de admin
para acceder a la gestión de archivos de un producto.
-->

<!-- OPCIÓN 1: En la página de listado de productos (si usas tabla) -->
<td>
    <div class="btn-group" role="group">
        <!-- Otros botones... -->
        
        <!-- Nuevo botón para archivos -->
        <a href="{{ route('admin.games.files.index', $product) }}" 
           class="btn btn-sm btn-info" 
           title="Gestionar archivos">
            <i class="bi bi-cloud-upload"></i> Archivos
        </a>
    </div>
</td>


<!-- OPCIÓN 2: En la página de detalle del producto -->
<div class="product-actions">
    <a href="{{ route('admin.products.edit', $product) }}" class="btn btn-warning">
        <i class="bi bi-pencil"></i> Editar
    </a>
    
    <!-- Nuevo botón -->
    <a href="{{ route('admin.games.files.index', $product) }}" class="btn btn-info">
        <i class="bi bi-cloud-upload"></i> Gestionar Archivos ({{ $product->files()->count() }})
    </a>
    
    <button type="button" class="btn btn-danger" onclick="deleteProduct({{ $product->id }})">
        <i class="bi bi-trash"></i> Eliminar
    </button>
</div>


<!-- OPCIÓN 3: En una sección de detalles -->
<div class="card">
    <div class="card-header">
        <h5>Archivos Descargables</h5>
    </div>
    <div class="card-body">
        <p class="card-text">
            Total: <strong>{{ $product->files()->count() }}</strong> archivos | 
            Descargas: <strong>{{ $product->files()->sum('downloads') }}</strong>
        </p>
        <a href="{{ route('admin.games.files.index', $product) }}" class="btn btn-primary">
            <i class="bi bi-cloud-upload"></i> Administrar Archivos
        </a>
    </div>
</div>


<!-- OPCIÓN 4: En un menú desplegable -->
<div class="dropdown">
    <button class="btn btn-secondary dropdown-toggle" type="button" id="actionsDropdown" data-bs-toggle="dropdown">
        Acciones
    </button>
    <ul class="dropdown-menu" aria-labelledby="actionsDropdown">
        <li>
            <a class="dropdown-item" href="{{ route('admin.products.edit', $product) }}">
                <i class="bi bi-pencil"></i> Editar Producto
            </a>
        </li>
        <li>
            <hr class="dropdown-divider">
        </li>
        <li>
            <a class="dropdown-item" href="{{ route('admin.games.files.index', $product) }}">
                <i class="bi bi-cloud-upload"></i> Gestionar Archivos
            </a>
        </li>
        <li>
            <a class="dropdown-item" href="{{ route('admin.games.files.create', $product) }}">
                <i class="bi bi-plus-circle"></i> Subir Nuevo Archivo
            </a>
        </li>
    </ul>
</div>


<!-- OPCIÓN 5: Badge en listado (más simple) -->
<td>
    <a href="{{ route('admin.games.files.index', $product) }}" class="badge bg-primary">
        {{ $product->files()->count() }} archivo(s)
    </a>
</td>


<!-- 
RUTAS DISPONIBLES PARA USAR:

Admin (todos requieren middleware 'admin'):
- route('admin.games.files.index', $product)       → Lista de archivos
- route('admin.games.files.create', $product)      → Formulario de subida
- route('admin.games.files.edit', [$product, $file]) → Editar archivo
- route('admin.games.files.destroy', [$product, $file]) → Eliminar
- route('admin.games.files.toggle', [$product, $file]) → Activar/desactivar

Públicas (con verificación de permisos):
- route('download.game', $file)                    → Descargar archivo
- route('games.info', $file)                       → Info en JSON
-->
