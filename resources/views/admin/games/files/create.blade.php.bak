@extends('layouts.admin')

@section('title', "Subir Archivo - {$product->name}")

@section('content')
    <div class="container-fluid">
        <div class="row mb-4">
            <div class="col-md-8">
                <h1>Subir Archivo de Juego</h1>
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
                        <form action="{{ route('admin.games.files.store', $product) }}" method="POST"
                            enctype="multipart/form-data" id="uploadForm">
                            @csrf

                            <!-- File Upload -->
                            <div class="mb-4">
                                <label for="file" class="form-label">
                                    <i class="bi bi-cloud-upload"></i> Archivo de Juego
                                    <span class="text-danger">*</span>
                                </label>
                                <div class="input-group">
                                    <input type="file" class="form-control @error('file') is-invalid @enderror" id="file"
                                        name="file" required accept=".zip" onchange="updateFileInfo()">
                                    <span class="input-group-text">
                                        <span id="fileSize">Tamaño: -</span>
                                    </span>
                                </div>
                                <small class="form-text text-muted d-block mt-2">
                                    Máximo: 10 GB. Puede ser cualquier tipo de archivo (ZIP, EXE, ISO, etc.)
                                </small>
                                @error('file')
                                    <div class="invalid-feedback d-block">{{ $message }}</div>
                                @enderror
                            </div>

                            <!-- Version -->
                            <div class="mb-4">
                                <label for="version" class="form-label">
                                    <i class="bi bi-tag"></i> Versión
                                </label>
                                <input type="text" class="form-control @error('version') is-invalid @enderror" id="version"
                                    name="version" placeholder="ej: 1.0.0" value="{{ old('version') }}">
                                <small class="form-text text-muted">Opcional. Número o identificador de versión</small>
                                @error('version')
                                    <div class="invalid-feedback d-block">{{ $message }}</div>
                                @enderror
                            </div>

                            <!-- Description -->
                            <div class="mb-4">
                                <label for="description" class="form-label">
                                    <i class="bi bi-chat-left-text"></i> Descripción
                                </label>
                                <textarea class="form-control @error('description') is-invalid @enderror" id="description"
                                    name="description" rows="4"
                                    placeholder="Añade información sobre el archivo (cambios, notas de compatibilidad, etc.)">{{ old('description') }}</textarea>
                                <small class="form-text text-muted">
                                    Máximo 1000 caracteres. <span id="charCount">0</span>/1000
                                </small>
                                @error('description')
                                    <div class="invalid-feedback d-block">{{ $message }}</div>
                                @enderror
                            </div>

                            <!-- Submit -->
                            <div class="d-flex gap-2">
                                <button type="submit" class="btn btn-primary btn-lg" id="submitBtn">
                                    <i class="bi bi-cloud-upload"></i> Subir Archivo
                                </button>
                                <a href="{{ route('admin.games.files.index', $product) }}" class="btn btn-secondary btn-lg">
                                    <i class="bi bi-arrow-left"></i> Cancelar
                                </a>
                            </div>

                            <div id="progressContainer" class="mt-4" style="display: none;">
                                <div class="progress" style="height: 25px;">
                                    <div class="progress-bar progress-bar-striped progress-bar-animated" id="progressBar"
                                        role="progressbar" style="width: 0%">
                                        <span id="progressText">0%</span>
                                    </div>
                                </div>
                                <p class="mt-2 text-muted" id="progressInfo">Subiendo archivo...</p>
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
                            <i class="bi bi-info-circle"></i> Información
                        </h5>
                        <div class="mb-3">
                            <strong>Tipos de archivo soportados:</strong>
                            <ul class="small mb-0">
                                <li>ZIP / RAR / 7Z</li>
                                <li>EXE / MSI</li>
                                <li>ISO / IMG</li>
                                <li>APK / IPA</li>
                                <li>Y más...</li>
                            </ul>
                        </div>
                        <hr>
                        <div class="mb-3">
                            <strong>Límite de tamaño:</strong>
                            <p class="small">Máximo 10 GB por archivo</p>
                        </div>
                        <hr>
                        <div class="mb-0">
                            <strong>Recomendaciones:</strong>
                            <ul class="small mb-0">
                                <li>Comprime los archivos en ZIP si es posible</li>
                                <li>Usa nombres descriptivos</li>
                                <li>Incluye instrucciones en la descripción</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div class="card mt-3">
                    <div class="card-body">
                        <h5 class="card-title">
                            <i class="bi bi-shield-check"></i> Seguridad
                        </h5>
                        <p class="small mb-0">
                            Los archivos se almacenan en el servidor de forma segura.
                            Solo los usuarios autorizados pueden descargarlos.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        function updateFileInfo() {
            const fileInput = document.getElementById('file');
            const file = fileInput.files[0];

            if (file) {
                const size = formatFileSize(file.size);
                document.getElementById('fileSize').textContent = `Tamaño: ${size}`;
            }
        }

        function formatFileSize(bytes) {
            if (bytes === 0) return '0 Bytes';

            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));

            return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
        }

        // Character counter
        document.getElementById('description').addEventListener('input', function () {
            document.getElementById('charCount').textContent = this.value.length;
        });

        // Form submission with progress bar
        document.getElementById('uploadForm').addEventListener('submit', function () {
            document.getElementById('progressContainer').style.display = 'block';
            document.getElementById('submitBtn').disabled = true;
        });
    </script>
@endsection