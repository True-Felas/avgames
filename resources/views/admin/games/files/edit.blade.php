@extends('layouts.admin')

@section('title', "Editar Archivo - {$product->name}")

@section('content')
<div class="container-fluid">
    <div class="row mb-4">
        <div class="col-md-8">
            <h1>Editar Archivo</h1>
            <p class="text-muted">Producto: <strong>{{ $product->name }}</strong></p>
        </div>
    </div>

    @if ($errors->any())
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
            <strong>Errores encontrados:</strong>
            <ul class="mb-0">
                @foreach ($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    @endif

    <div class="row">
        <div class="col-lg-8">
            <div class="card">
                <div class="card-body">
                    <!-- File Info -->
                    <div class="alert alert-info">
                        <div class="row">
                            <div class="col-md-6">
                                <strong>Archivo:</strong><br>
                                {{ $file->original_name }}
                            </div>
                            <div class="col-md-6">
                                <strong>Tamaño:</strong><br>
                                {{ $file->getFormattedFileSize() }}
                            </div>
                        </div>
                        <hr class="my-2">
                        <div class="row">
                            <div class="col-md-6">
                                <strong>Descargas:</strong><br>
                                {{ $file->downloads }}
                            </div>
                            <div class="col-md-6">
                                <strong>Subido:</strong><br>
                                {{ $file->created_at->format('d/m/Y H:i') }}
                            </div>
                        </div>
                    </div>

                    <form action="{{ route('admin.games.files.update', [$product, $file]) }}" method="POST">
                        @csrf
                        @method('PATCH')

                        <!-- Version -->
                        <div class="mb-4">
                            <label for="version" class="form-label">
                                <i class="bi bi-tag"></i> Versión
                            </label>
                            <input type="text" 
                                   class="form-control @error('version') is-invalid @enderror" 
                                   id="version" 
                                   name="version"
                                   placeholder="ej: 1.0.0"
                                   value="{{ old('version', $file->version) }}">
                            <small class="form-text text-muted">Número o identificador de versión</small>
                            @error('version')
                                <div class="invalid-feedback d-block">{{ $message }}</div>
                            @enderror
                        </div>

                        <!-- Description -->
                        <div class="mb-4">
                            <label for="description" class="form-label">
                                <i class="bi bi-chat-left-text"></i> Descripción
                            </label>
                            <textarea class="form-control @error('description') is-invalid @enderror" 
                                      id="description" 
                                      name="description"
                                      rows="5"
                                      placeholder="Notas, cambios, instrucciones de instalación, etc.">{{ old('description', $file->description) }}</textarea>
                            <small class="form-text text-muted">
                                Máximo 1000 caracteres. <span id="charCount">{{ strlen(old('description', $file->description)) }}</span>/1000
                            </small>
                            @error('description')
                                <div class="invalid-feedback d-block">{{ $message }}</div>
                            @enderror
                        </div>

                        <!-- Active Status -->
                        <div class="mb-4">
                            <div class="form-check form-switch">
                                <input class="form-check-input" 
                                       type="checkbox" 
                                       id="is_active" 
                                       name="is_active" 
                                       value="1"
                                       @if(old('is_active', $file->is_active)) checked @endif>
                                <label class="form-check-label" for="is_active">
                                    <strong>Archivo Activo</strong>
                                    <br>
                                    <small class="text-muted">Si está desactivado, los usuarios no podrán descargarlo</small>
                                </label>
                            </div>
                        </div>

                        <!-- Submit -->
                        <div class="d-flex gap-2">
                            <button type="submit" class="btn btn-primary btn-lg">
                                <i class="bi bi-check-circle"></i> Guardar Cambios
                            </button>
                            <a href="{{ route('admin.games.files.index', $product) }}" class="btn btn-secondary btn-lg">
                                <i class="bi bi-arrow-left"></i> Volver
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <!-- Info Sidebar -->
        <div class="col-lg-4">
            <div class="card bg-light">
                <div class="card-body">
                    <h5 class="card-title">
                        <i class="bi bi-info-circle"></i> Información del Archivo
                    </h5>
                    <dl class="row small">
                        <dt class="col-sm-6">Nombre original:</dt>
                        <dd class="col-sm-6">
                            <code class="small">{{ $file->original_name }}</code>
                        </dd>
                        
                        <dt class="col-sm-6">Nombre en servidor:</dt>
                        <dd class="col-sm-6">
                            <code class="small">{{ $file->filename }}</code>
                        </dd>
                        
                        <dt class="col-sm-6">Tamaño:</dt>
                        <dd class="col-sm-6">{{ $file->getFormattedFileSize() }}</dd>
                        
                        <dt class="col-sm-6">Tipo MIME:</dt>
                        <dd class="col-sm-6">
                            <code class="small">{{ $file->mime_type }}</code>
                        </dd>
                        
                        <dt class="col-sm-6">Descargas:</dt>
                        <dd class="col-sm-6">{{ $file->downloads }}</dd>
                        
                        <dt class="col-sm-6">Creado:</dt>
                        <dd class="col-sm-6">{{ $file->created_at->format('d/m/Y H:i') }}</dd>
                        
                        <dt class="col-sm-6">Actualizado:</dt>
                        <dd class="col-sm-6">{{ $file->updated_at->format('d/m/Y H:i') }}</dd>
                    </dl>
                </div>
            </div>

            <div class="card mt-3 border-danger">
                <div class="card-body">
                    <h5 class="card-title text-danger">
                        <i class="bi bi-exclamation-triangle"></i> Peligro
                    </h5>
                    <p class="small mb-0">
                        Para eliminar este archivo, ve a la lista de archivos del producto.
                    </p>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
// Character counter
document.getElementById('description').addEventListener('input', function() {
    document.getElementById('charCount').textContent = this.value.length;
});
</script>
@endsection
