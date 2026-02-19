import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import AdminLayout from '@/layouts/admin/admin-layout';

interface Product {
    id: number;
    name: string;
    slug: string;
}

interface ProductFile {
    id: number;
    original_name: string;
    version: string | null;
    description: string | null;
    is_active: boolean;
}

interface EditFileProps {
    product: Product;
    file: ProductFile;
}

export default function EditGameFile({ product, file }: EditFileProps) {
    const { data, setData, patch, processing, errors } = useForm({
        version: file.version || '',
        description: file.description || '',
        is_active: file.is_active,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(`/admin/products/${product.id}/files/${file.id}`);
    };

    return (
        <AdminLayout title={`EDIT FILE: ${file.original_name}`}>
            <Head title={`Edit File - ${file.original_name}`} />

            <div className="max-w-3xl mx-auto space-y-8">
                {/* Header */}
                <div>
                    <h1 className="font-bold text-2xl text-white">EDIT FILE DETAILS</h1>
                    <p className="text-gray-400 text-sm mt-1">
                        Editing <span className="text-[#05ffa1] font-mono">{file.original_name}</span> for <span className="text-[#7f13ec] font-bold">{product.name}</span>
                    </p>
                </div>

                <div className="p-8 rounded-xl bg-[#160b22]/80 border border-white/5 shadow-2xl">
                    <form onSubmit={submit} className="space-y-6">
                        {/* Active Status */}
                        <div className="flex items-center gap-3 p-4 rounded-lg bg-white/5 border border-white/10">
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={data.is_active}
                                    onChange={(e) => setData('is_active', e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#7f13ec] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#05ffa1]"></div>
                            </label>
                            <div>
                                <span className="block text-sm font-bold text-white">ACTIVE STATUS</span>
                                <span className="text-xs text-gray-400">
                                    {data.is_active ? 'File is available for download' : 'File is hidden from users'}
                                </span>
                            </div>
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
                                className="bg-[#7f13ec] hover:bg-[#bc13fe] text-white font-pixel text-[12px] px-8 py-4 rounded-lg transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(127,19,236,0.5)] disabled:opacity-50"
                            >
                                <span className="material-symbols-outlined">save</span>
                                {processing ? 'SAVING...' : 'SAVE CHANGES'}
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
        </AdminLayout>
    );
}
