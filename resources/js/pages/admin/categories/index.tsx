
import { Head, Link, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin/admin-layout';

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  color: string;
  products_count: number;
}

interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

interface PaginatedCategories {
  data: Category[];
  links: PaginationLink[];
  current_page: number;
  last_page: number;
  total: number;
}

interface CategoriesIndexProps {
  categories: PaginatedCategories;
}

export default function CategoriesIndex({ categories }: CategoriesIndexProps) {
  return (
    <AdminLayout title="CATEGORY MANAGEMENT">
      <Head title="Manage Categories" />

      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <h1 className="font-bold text-2xl text-white">Categories</h1>
          <Link
            href="/admin/categories/create"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#7f13ec] to-[#ff2a6d] rounded-lg font-bold text-sm text-white hover:shadow-[0_0_20px_rgba(127,19,236,0.5)] transition-all group"
          >
            <span className="material-symbols-outlined group-hover:rotate-90 transition-transform">add</span>
            ADD NEW CATEGORY
          </Link>
        </div>

        <div className="rounded-xl bg-[#160b22]/80 border border-white/5 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left p-4 font-pixel text-[8px] text-gray-500">NAME</th>
                <th className="text-left p-4 font-pixel text-[8px] text-gray-500">DESCRIPTION</th>
                <th className="text-left p-4 font-pixel text-[8px] text-gray-500">ICON</th>
                <th className="text-left p-4 font-pixel text-[8px] text-gray-500">COLOR</th>
                <th className="text-left p-4 font-pixel text-[8px] text-gray-500">PRODUCTS</th>
                <th className="text-right p-4 font-pixel text-[8px] text-gray-500">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {categories.data.map((category) => (
                <tr key={category.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4 font-bold text-white">{category.name}</td>
                  <td className="p-4 text-gray-400 text-sm">{category.description || '-'}</td>
                  <td className="p-4">
                    <span className="material-symbols-outlined text-2xl" style={{ color: category.color }}>
                      {category.icon && category.icon.trim() !== '' ? category.icon : 'category'}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="inline-block w-6 h-6 rounded-full border border-white/10" style={{ backgroundColor: category.color }}></span>
                  </td>
                  <td className="p-4 text-white font-mono">{category.products_count}</td>
                  <td className="p-4 text-right">
                    <Link
                      href={`/admin/categories/${category.id}/edit`}
                      className="p-2 rounded-lg bg-[#7f13ec]/10 hover:bg-[#7f13ec]/20 text-[#7f13ec] transition-all"
                      title="Edit"
                    >
                      <span className="material-symbols-outlined text-lg">edit</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {categories.data.length === 0 && (
            <div className="p-12 text-center">
              <span className="material-symbols-outlined text-6xl text-gray-600 mb-4">category</span>
              <p className="font-pixel text-[10px] text-gray-500">NO CATEGORIES FOUND</p>
            </div>
          )}
        </div>

        {/* Paginación */}
        {categories.last_page > 1 && (
          <div className="flex items-center justify-center gap-2">
            {categories.links.map((link, index) => (
              <button
                key={index}
                onClick={() => link.url && router.get(link.url, {}, { preserveState: true })}
                disabled={!link.url}
                dangerouslySetInnerHTML={{ __html: link.label }}
                className={`px-4 py-2 rounded-lg text-sm transition-all ${
                  link.active
                    ? 'bg-[#7f13ec] text-white'
                    : link.url
                    ? 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                    : 'bg-transparent text-gray-600 cursor-not-allowed'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
