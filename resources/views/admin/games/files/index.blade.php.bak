@extends('layouts.admin')

@section('title', "Archivos - {$product->name}")

@section('content')
<div class="container-fluid">
    <div class="row mb-4">
        <div class="col-md-8">
            <h1>Archivos del Juego: <strong>{{ $product->name }}</strong></h1>
            <p class="text-muted">Gestiona los archivos descargables para este producto</p>
        </div>
        <div class="col-md-4 text-end">
            <a href="{{ route('admin.games.files.create', $product) }}" class="btn btn-primary btn-lg">
                <i class="bi bi-cloud-upload"></i> Subir Archivo
            </a>
        </div>
    </div>

    @if ($errors->any())
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
            <strong>Error!</strong>
            <ul class="mb-0">
                @foreach ($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    @endif

    @if (session('success'))
        <div class="alert alert-success alert-dismissible fade show" role="alert">
            {{ session('success') }}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    @endif

    @if (session('error'))
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
            {{ session('error') }}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    @endif

    @if ($files->count() > 0)
        <div class="table-responsive">
            <table class="table table-hover">
                <thead class="table-light">
                    <tr>
                        <th>Archivo</th>
                        <th>Tamaño</th>
                        <th>Versión</th>
                        <th>Descargas</th>
                        <th>Estado</th>
                        <th>Subido</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($files as $file)
                        <tr>
                            <td>
                                <i class="bi bi-file-earmark-zip"></i>
                                <strong>{{ $file->original_name }}</strong>
                                @if ($file->description)
                                    <br><small class="text-muted">{{ substr($file->description, 0, 50) }}...</small>
                                @endif
                            </td>
                            <td>{{ $file->getFormattedFileSize() }}</td>
                            <td>
                                @if ($file->version)
                                    <span class="badge bg-info">v{{ $file->version }}</span>
                                @else
                                    <span class="text-muted">-</span>
                                @endif
                            </td>
                            <td>
                                <span class="badge bg-success">{{ $file->downloads }}</span>
                            </td>
                            <td>
                                @if ($file->is_active)
                                    <span class="badge bg-success">Activo</span>
                                @else
                                    <span class="badge bg-danger">Inactivo</span>
                                @endif
                            </td>
                            <td>
                                <small class="text-muted">{{ $file->created_at->format('d/m/Y H:i') }}</small>
                            </td>
                            <td>
                                <div class="btn-group" role="group">
                                    <a href="{{ route('admin.games.files.edit', [$product, $file]) }}" 
                                       class="btn btn-sm btn-warning" title="Editar">
                                        <i class="bi bi-pencil"></i>
                                    </a>
                                    
                                    <form action="{{ route('admin.games.files.toggle', [$product, $file]) }}" 
                                          method="POST" style="display: inline;">
                                        @csrf
                                        @method('PATCH')
                                        <button type="submit" 
                                                class="btn btn-sm {{ $file->is_active ? 'btn-outline-danger' : 'btn-outline-success' }}" 
                                                title="{{ $file->is_active ? 'Desactivar' : 'Activar' }}">
                                            <i class="bi {{ $file->is_active ? 'bi-toggle-on' : 'bi-toggle-off' }}"></i>
                                        </button>
                                    </form>

                                    <button class="btn btn-sm btn-danger" 
                                            data-bs-toggle="modal" 
                                            data-bs-target="#deleteModal{{ $file->id }}"
                                            title="Eliminar">
                                        <i class="bi bi-trash"></i>
                                    </button>
                                </div>

                                <!-- Delete Modal -->
                                <div class="modal fade" id="deleteModal{{ $file->id }}" tabindex="-1">
                                    <div class="modal-dialog">
                                        <div class="modal-content">
                                            <div class="modal-header">
                                                <h5 class="modal-title">Confirmar eliminación</h5>
                                                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                                            </div>
                                            <div class="modal-body">
                                                <p>¿Está seguro de que desea eliminar el archivo <strong>{{ $file->original_name }}</strong>?</p>
                                                <p class="text-danger"><small>Esta acción no se puede deshacer.</small></p>
                                            </div>
                                            <div class="modal-footer">
                                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                                                <form action="{{ route('admin.games.files.destroy', [$product, $file]) }}" method="POST" style="display: inline;">
                                                    @csrf
                                                    @method('DELETE')
                                                    <button type="submit" class="btn btn-danger">Eliminar</button>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>

        <!-- Pagination -->
        <nav aria-label="Page navigation">
            {{ $files->links() }}
        </nav>
    @else
        <div class="alert alert-info">
            <i class="bi bi-info-circle"></i>
            <strong>Sin archivos</strong> - Este producto aún no tiene archivos descargables.
            <a href="{{ route('admin.games.files.create', $product) }}" class="alert-link">Subir el primer archivo</a>
        </div>
    @endif

    <div class="mt-4">
        <a href="{{ route('admin.products.index') }}" class="btn btn-secondary">
            <i class="bi bi-arrow-left"></i> Volver a Productos
        </a>
    </div>
</div>
@endsection
