import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin/admin-layout';
import Swal from 'sweetalert2';

interface Product {
    id: number;
    name: string;
    slug: string;
}

interface ProductFile {
    id: number;
    original_name: string;
    filename: string;
    file_size: number;
    version: string | null;
    downloads: number;
    is_active: boolean;
    created_at: string;
    description: string | null;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedFiles {
    data: ProductFile[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
    total: number;
}

interface FilesIndexProps {
    product: Product;
    files: PaginatedFiles;
    success?: string;
    error?: string;
}

export default function GameFilesIndex({ product, files, success, error }: FilesIndexProps) {
    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const handleDelete = (file: ProductFile) => {
        Swal.fire({
            title: '¿Eliminar archivo?',
            text: `Se eliminará ${file.original_name}. Esta acción no se puede deshacer.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ff2a6d',
            cancelButtonColor: '#160b22',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            background: '#160b22',
            color: '#fff',
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/admin/products/${product.id}/files/${file.id}`);
            }
        });
    };

    const handleToggle = (file: ProductFile) => {
        router.patch(`/admin/products/${product.id}/files/${file.id}/toggle`, {}, {
            preserveScroll: true,
        });
    };

    return (
        <AdminLayout title={`FILES: ${product.name.toUpperCase()}`}>
            <Head title={`Files - ${product.name}`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <h1 className="font-bold text-2xl text-white">GAME FILES</h1>
                        <p className="text-gray-400 text-sm mt-1">
                            Manage downloadable files for <span className="text-[#7f13ec] font-bold">{product.name}</span>
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Link
                            href="/admin/products"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 rounded-lg font-bold text-sm text-gray-300 transition-all border border-white/10"
                        >
                            <span className="material-symbols-outlined">arrow_back</span>
                            BACK TO GAMES
                        </Link>
                        <Link
                            href={`/admin/products/${product.id}/files/create`}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#7f13ec] to-[#ff2a6d] rounded-lg font-bold text-sm text-white hover:shadow-[0_0_20px_rgba(127,19,236,0.5)] transition-all group"
                        >
                            <span className="material-symbols-outlined group-hover:rotate-12 transition-transform">cloud_upload</span>
                            UPLOAD NEW FILE
                        </Link>
                    </div>
                </div>

                {/* Alerts */}
                {success && (
                    <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center gap-3 text-green-400">
                        <span className="material-symbols-outlined">check_circle</span>
                        {success}
                    </div>
                )}
                {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-3 text-red-400">
                        <span className="material-symbols-outlined">error</span>
                        {error}
                    </div>
                )}

                {/* Files Table */}
                <div className="rounded-xl bg-[#160b22]/80 border border-white/5 overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/5">
                                <th className="text-left p-4 font-pixel text-[8px] text-gray-500">FILE DETAILS</th>
                                <th className="text-left p-4 font-pixel text-[8px] text-gray-500">SIZE</th>
                                <th className="text-left p-4 font-pixel text-[8px] text-gray-500">VERSION</th>
                                <th className="text-left p-4 font-pixel text-[8px] text-gray-500">DOWNLOADS</th>
                                <th className="text-left p-4 font-pixel text-[8px] text-gray-500">STATUS</th>
                                <th className="text-left p-4 font-pixel text-[8px] text-gray-500">UPLOADED</th>
                                <th className="text-right p-4 font-pixel text-[8px] text-gray-500">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {files.data.map((file) => (
                                <tr key={file.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                                    <td className="p-4">
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 rounded bg-[#7f13ec]/10 text-[#7f13ec]">
                                                <span className="material-symbols-outlined">folder_zip</span>
                                            </div>
                                            <div>
                                                <p className="font-bold text-white text-sm">{file.original_name}</p>
                                                {file.description && (
                                                    <p className="text-gray-500 text-xs mt-1 max-w-xs truncate">
                                                        {file.description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-gray-300 font-mono text-sm">{formatFileSize(file.file_size)}</td>
                                    <td className="p-4">
                                        {file.version ? (
                                            <span className="px-2 py-1 rounded bg-[#00b0ff]/10 text-[#00b0ff] text-xs font-mono border border-[#00b0ff]/20">
                                                v{file.version}
                                            </span>
                                        ) : (
                                            <span className="text-gray-600">-</span>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        <span className="px-2 py-1 rounded bg-[#05ffa1]/10 text-[#05ffa1] text-xs font-mono border border-[#05ffa1]/20">
                                            {file.downloads}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className={`flex items-center gap-2 ${file.is_active ? 'text-[#05ffa1]' : 'text-gray-500'}`}>
                                            <span className={`w-2 h-2 rounded-full ${file.is_active ? 'bg-[#05ffa1] shadow-[0_0_10px_#05ffa1]' : 'bg-gray-500'}`}></span>
                                            <span className="text-xs font-bold">{file.is_active ? 'ACTIVE' : 'INACTIVE'}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-gray-400 text-xs">
                                        {formatDate(file.created_at)}
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleToggle(file)}
                                                className={`p-2 rounded-lg transition-colors ${file.is_active
                                                        ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
                                                        : 'bg-green-500/10 text-green-500 hover:bg-green-500/20'
                                                    }`}
                                                title={file.is_active ? 'Deactivate' : 'Activate'}
                                            >
                                                <span className="material-symbols-outlined text-lg">
                                                    {file.is_active ? 'toggle_off' : 'toggle_on'}
                                                </span>
                                            </button>
                                            <Link
                                                href={`/admin/products/${product.id}/files/${file.id}/edit`}
                                                className="p-2 rounded-lg bg-[#7f13ec]/10 text-[#7f13ec] hover:bg-[#7f13ec]/20 transition-colors"
                                                title="Edit"
                                            >
                                                <span className="material-symbols-outlined text-lg">edit</span>
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(file)}
                                                className="p-2 rounded-lg bg-[#ff2a6d]/10 text-[#ff2a6d] hover:bg-[#ff2a6d]/20 transition-colors"
                                                title="Delete"
                                            >
                                                <span className="material-symbols-outlined text-lg">delete</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {files.data.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="p-12 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                                                <span className="material-symbols-outlined text-3xl text-gray-600">cloud_off</span>
                                            </div>
                                            <p className="text-gray-400 font-pixel text-xs mb-2">NO FILES FOUND</p>
                                            <p className="text-gray-600 text-sm mb-6">This game has no downloadable files yet.</p>
                                            <Link
                                                href={`/admin/products/${product.id}/files/create`}
                                                className="px-6 py-2 bg-[#7f13ec] hover:bg-[#bc13fe] text-white rounded-lg text-sm font-bold transition-colors"
                                            >
                                                UPLOAD FIRST FILE
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {files.last_page > 1 && (
                    <div className="flex items-center justify-center gap-2">
                        {files.links.map((link, index) => (
                            <button
                                key={index}
                                onClick={() => link.url && router.get(link.url, {}, { preserveState: true })}
                                disabled={!link.url}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className={`px-3 py-1 rounded text-xs transition-colors ${link.active
                                        ? 'bg-[#7f13ec] text-white'
                                        : link.url
                                            ? 'text-gray-400 hover:text-white hover:bg-white/10'
                                            : 'text-gray-600 cursor-not-allowed'
                                    }`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
