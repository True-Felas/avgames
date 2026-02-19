# Sistema de Gestión de Archivos (Admin)

Este documento detalla el funcionamiento del sistema de carga de archivos para juegos descargables.

## Acceso
1. Ve al panel de **Administración**.
2. Selecciona **Juegos** (Products) en el menú lateral.
3. En la tabla de juegos, busca el icono **Cloud Upload** (nube azul) en la columna de acciones.

## Funcionalidades Implementadas
- **Lista de Archivos**: Visualización de todos los archivos asociados a un juego (versión, tamaño, estado).
- **Subida Segura**: Los archivos se guardan en el disco `games` (en `storage/app/games/products/{id}`).
- **Control de Versiones**: Campo para especificar la versión del juego.
- **Estado Activo/Inactivo**: Permite ocultar descargas sin borrarlas.

## Notas Técnicas (Arreglos Realizados)
- Se activó la autorización `manage-games` en `AppServiceProvider`.
- Se corrigió el error de "undefined method authorize" en `GameFileController`.
- Se vinculó la UI de React con las rutas de Blade tradicionales para la gestión de archivos.

---
*Documentación generada automáticamente por Antigravity.*
