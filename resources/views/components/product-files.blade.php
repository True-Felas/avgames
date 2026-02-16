<div class="product-files {{ $class }}">
    @if ($files->count() > 0)
        <div class="files-container">
            @if ($showStats)
                <div class="files-stats">
                    <div class="stat">
                        <strong>{{ $files->count() }}</strong>
                        <span>{{ $files->count() == 1 ? 'Archivo' : 'Archivos' }}</span>
                    </div>
                    <div class="stat">
                        <strong>{{ number_format($files->sum('downloads')) }}</strong>
                        <span>{{ $files->sum('downloads') == 1 ? 'Descarga' : 'Descargas' }}</span>
                    </div>
                </div>
            @endif

            <div class="files-list">
                @foreach ($files as $file)
                    <div class="file-item">
                        <div class="file-info">
                            <div class="file-header">
                                <i class="bi bi-file-earmark-zip"></i>
                                <h4>{{ $file->original_name }}</h4>
                                @if ($file->version)
                                    <span class="version-badge">v{{ $file->version }}</span>
                                @endif
                            </div>

                            @if ($file->description)
                                <p class="file-description">{{ $file->description }}</p>
                            @endif

                            <div class="file-meta">
                                <span class="meta-item">
                                    <i class="bi bi-hdd"></i> {{ $file->getFormattedFileSize() }}
                                </span>
                                <span class="meta-item">
                                    <i class="bi bi-download"></i> {{ number_format($file->downloads) }}
                                </span>
                                <span class="meta-item">
                                    <i class="bi bi-calendar"></i> {{ $file->created_at->format('d/m/Y') }}
                                </span>
                            </div>
                        </div>

                        <div class="file-actions">
                            <a href="{{ $file->getDownloadUrl() }}" 
                               class="btn btn-download" 
                               download="{{ $file->original_name }}"
                               title="Descargar {{ $file->original_name }}">
                                <i class="bi bi-cloud-download"></i>
                                Descargar
                            </a>
                        </div>
                    </div>
                @endforeach
            </div>
        </div>

        <style>
            .product-files {
                margin: 2rem 0;
            }

            .files-stats {
                display: flex;
                gap: 2rem;
                margin-bottom: 1.5rem;
                padding: 1rem;
                background: rgba(0, 0, 0, 0.02);
                border-radius: 8px;
            }

            .files-stats .stat {
                display: flex;
                flex-direction: column;
                align-items: center;
            }

            .files-stats .stat strong {
                font-size: 1.5rem;
                color: #007bff;
            }

            .files-stats .stat span {
                font-size: 0.875rem;
                color: #6c757d;
            }

            .files-list {
                display: flex;
                flex-direction: column;
                gap: 1rem;
            }

            .file-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 1.25rem;
                border: 1px solid #dee2e6;
                border-radius: 8px;
                background: #fff;
                transition: all 0.3s ease;
            }

            .file-item:hover {
                border-color: #007bff;
                box-shadow: 0 2px 8px rgba(0, 123, 255, 0.1);
            }

            .file-info {
                flex: 1;
            }

            .file-header {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                margin-bottom: 0.5rem;
            }

            .file-header i {
                font-size: 1.5rem;
                color: #6c757d;
            }

            .file-header h4 {
                margin: 0;
                font-size: 1rem;
                font-weight: 600;
            }

            .version-badge {
                display: inline-block;
                padding: 0.25rem 0.75rem;
                background: #e7f3ff;
                color: #0c63e4;
                border-radius: 4px;
                font-size: 0.75rem;
                font-weight: 600;
            }

            .file-description {
                margin: 0.5rem 0 0.75rem 0;
                color: #495057;
                font-size: 0.9375rem;
            }

            .file-meta {
                display: flex;
                gap: 1.5rem;
                flex-wrap: wrap;
            }

            .meta-item {
                display: flex;
                align-items: center;
                gap: 0.375rem;
                color: #6c757d;
                font-size: 0.875rem;
            }

            .meta-item i {
                color: #007bff;
            }

            .file-actions {
                padding-left: 1rem;
                flex-shrink: 0;
            }

            .btn-download {
                display: inline-flex;
                align-items: center;
                gap: 0.5rem;
                padding: 0.625rem 1.25rem;
                background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
                color: white;
                border: none;
                border-radius: 6px;
                font-size: 0.9375rem;
                font-weight: 600;
                text-decoration: none;
                transition: all 0.3s ease;
                cursor: pointer;
            }

            .btn-download:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
                color: white;
            }

            .btn-download:active {
                transform: translateY(0);
            }

            @media (max-width: 768px) {
                .file-item {
                    flex-direction: column;
                    align-items: flex-start;
                }

                .file-actions {
                    padding-left: 0;
                    padding-top: 1rem;
                    width: 100%;
                }

                .btn-download {
                    width: 100%;
                    justify-content: center;
                }

                .files-stats {
                    flex-direction: column;
                    gap: 1rem;
                }
            }
        </style>
    @else
        <div class="alert alert-info">
            <i class="bi bi-info-circle"></i>
            <strong>Sin archivos disponibles</strong>
            <p class="mb-0">Este juego no tiene archivos disponibles para descargar en este momento.</p>
        </div>
    @endif
</div>
