import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import AdminLayout from '@/layouts/admin/admin-layout';

interface Product {
    id: number;
    name: string;
    slug: string;
}

interface CreateFileProps {
    product: Product;
}

export default function CreateGameFile({ product }: CreateFileProps) {
    const { data, setData, post, processing, errors, progress } = useForm({
        file: null as File | null,
        version: '',
        description: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(`/admin/products/${product.id}/files`, {
            forceFormData: true,
        });
    };

    return (
        <AdminLayout title={`UPLOAD FILE: ${product.name.toUpperCase()}`}>
            <Head title={`Upload File - ${product.name}`} />

            <div className="max-w-5xl mx-auto space-y-8">
                {/* Header */}
                <div>
                    <h1 className="font-bold text-2xl text-white">UPLOAD GAME FILE</h1>
                    <p className="text-gray-400 text-sm mt-1">
                        Add a new downloadable file for <span className="text-[#7f13ec] font-bold">{product.name}</span>
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Form */}
                    <div className="lg:col-span-2">
                        <div className="p-8 rounded-xl bg-[#160b22]/80 border border-white/5 shadow-2xl">
                            <form onSubmit={submit} className="space-y-6">
                                {/* File Input */}
                                <div className="space-y-2">
                                    <label htmlFor="file" className="block text-sm font-bold text-gray-400">
                                        GAME ARCHIVE (ZIP) <span className="text-[#ff2a6d]">*</span>
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-0 bg-gradient-to-r from-[#7f13ec] to-[#ff2a6d] rounded-lg opacity-20 group-hover:opacity-30 transition-opacity pointer-events-none"></div>
                                        <input
                                            type="file"
                                            id="file"
                                            onChange={(e) => setData('file', e.target.files ? e.target.files[0] : null)}
                                            className="block w-full text-sm text-gray-400 file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#7f13ec] file:text-white hover:file:bg-[#bc13fe] cursor-pointer border border-white/10 rounded-lg bg-[#0a050f] focus:outline-none focus:ring-2 focus:ring-[#7f13ec]"
                                            accept=".zip"
                                        />
                                    </div>
                                    {errors.file && (
                                        <p className="text-sm text-[#ff2a6d] mt-1 flex items-center gap-1">
                                            <span className="material-symbols-outlined text-sm">warning</span>
                                            {errors.file}
                                        </p>
                                    )}
                                    {progress && (
                                        <div className="mt-4">
                                            <div className="flex justify-between text-xs text-gray-400 mb-1">
                                                <span>UPLOADING...</span>
                                                <span>{progress.percentage}%</span>
                                            </div>
                                            <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                                                <div
                                                    className="bg-gradient-to-r from-[#7f13ec] to-[#ff2a6d] h-full transition-all duration-300 relative"
                                                    style={{ width: `${progress.percentage}%` }}
                                                >
                                                    <div className="absolute inset-0 bg-white/20 animate-[shimmer_1s_infinite]"></div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Version */}
                                <div className="space-y-2">
                                    <label htmlFor="version" className="block text-sm font-bold text-gray-400">
                                        VERSION
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-500">tag</span>
                                        <input
                                            type="text"
                                            id="version"
                                            value={data.version}
                                            onChange={(e) => setData('version', e.target.value)}
                                            className="w-full bg-[#0a050f] border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#7f13ec] focus:border-transparent transition-all placeholder-gray-600"
                                            placeholder="e.g. 1.0.0"
                                        />
                                    </div>
                                    {errors.version && <p className="text-sm text-[#ff2a6d] mt-1">{errors.version}</p>}
                                </div>

                                {/* Description */}
                                <div className="space-y-2">
                                    <label htmlFor="description" className="block text-sm font-bold text-gray-400">
                                        DESCRIPTION / CHANGELOG
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-3 material-symbols-outlined text-gray-500">description</span>
                                        <textarea
                                            id="description"
                                            rows={4}
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            className="w-full bg-[#0a050f] border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#7f13ec] focus:border-transparent transition-all placeholder-gray-600"
                                            placeholder="Release notes, installation instructions..."
                                        />
                                    </div>
                                    {errors.description && <p className="text-sm text-[#ff2a6d] mt-1">{errors.description}</p>}
                                </div>

                                <div className="pt-4 flex items-center gap-4">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-[#7f13ec] hover:bg-[#bc13fe] text-white font-pixel text-[12px] px-8 py-4 rounded-lg transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(127,19,236,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <span className="material-symbols-outlined">cloud_upload</span>
                                        {processing ? 'UPLOADING...' : 'UPLOAD FILE'}
                                    </button>
                                    <Link
                                        href={`/admin/products/${product.id}/files`}
                                        className="text-gray-400 hover:text-white font-bold text-sm transition-colors"
                                    >
                                        CANCEL
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Sidebar Info */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="p-6 rounded-xl bg-[#160b22]/60 border border-white/5">
                            <div className="flex items-center gap-3 mb-4 text-[#00b0ff]">
                                <span className="material-symbols-outlined">info</span>
                                <h3 className="font-bold text-sm">FILE INFORMATION</h3>
                            </div>
                            <ul className="space-y-3 text-sm text-gray-400">
                                <li className="flex items-start gap-2">
                                    <span className="material-symbols-outlined text-xs mt-1 text-gray-600">check</span>
                                    <span>Allowed formats: <strong className="text-white">ZIP</strong></span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="material-symbols-outlined text-xs mt-1 text-gray-600">check</span>
                                    <span>Max size: <strong className="text-white">10 GB</strong></span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="material-symbols-outlined text-xs mt-1 text-gray-600">check</span>
                                    <span>Use descriptive version numbers (e.g. 1.0.2-beta)</span>
                                </li>
                            </ul>
                        </div>

                        <div className="p-6 rounded-xl bg-[#160b22]/60 border border-white/5">
                            <div className="flex items-center gap-3 mb-4 text-[#05ffa1]">
                                <span className="material-symbols-outlined">shield</span>
                                <h3 className="font-bold text-sm">SECURITY</h3>
                            </div>
                            <p className="text-sm text-gray-400">
                                Files are stored securely and served only to authorized users. Downloads are tracked automatically.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
