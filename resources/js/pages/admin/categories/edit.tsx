import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin/admin-layout';

interface CategoryEditProps {
  category: {
    id: number;
    name: string;
    description: string | null;
    icon: string | null;
    color: string;
    is_active: boolean;
    sort_order: number;
  };
}

export default function CategoryEdit({ category }: CategoryEditProps) {
  const { data, setData, put, processing, errors } = useForm({
    name: category.name || '',
    description: category.description || '',
    icon: category.icon || '',
    color: category.color || '#7f13ec',
    is_active: category.is_active ?? true,
    sort_order: category.sort_order ?? 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(`/admin/categories/${category.id}`);
  };

  return (
    <AdminLayout title="EDIT CATEGORY">
      <Head title="Edit Category" />
      <div className="max-w-xl mx-auto mt-10 bg-[#160b22]/80 border border-white/5 rounded-xl p-8">
        <h1 className="text-2xl font-bold text-white mb-6">Edit Category</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Name *</label>
            <input
              type="text"
              value={data.name}
              onChange={e => setData('name', e.target.value)}
              className="w-full bg-[#0a050f] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#7f13ec] focus:ring-1 focus:ring-[#7f13ec] outline-none"
              required
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Description</label>
            <textarea
              value={data.description}
              onChange={e => setData('description', e.target.value)}
              className="w-full bg-[#0a050f] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#7f13ec] focus:ring-1 focus:ring-[#7f13ec] outline-none resize-none"
              rows={3}
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Icon</label>
            <input
              type="text"
              value={data.icon}
              onChange={e => setData('icon', e.target.value)}
              className="w-full bg-[#0a050f] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#7f13ec] focus:ring-1 focus:ring-[#7f13ec] outline-none mb-2"
              placeholder="e.g. category, explore, sports_esports"
            />
            <div className="flex flex-wrap gap-2 mb-2">
              {['category','explore','book','dashboard','sports_esports','local_cafe','star','home','school','music_note','movie','palette','pets','shopping_cart','emoji_events','build','favorite','directions_car','flight','restaurant'].map(iconName => (
                <button
                  type="button"
                  key={iconName}
                  className={`material-symbols-outlined text-2xl rounded p-1 border ${data.icon === iconName ? 'bg-[#7f13ec] text-white border-[#7f13ec]' : 'bg-[#0a050f] text-gray-400 border-white/10'} hover:bg-[#7f13ec]/30 transition`}
                  onClick={() => setData('icon', iconName)}
                  title={iconName}
                >
                  {iconName}
                </button>
              ))}
            </div>
            {errors.icon && <p className="text-red-500 text-xs mt-1">{errors.icon}</p>}
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Color</label>
            <input
              type="color"
              value={data.color}
              onChange={e => setData('color', e.target.value)}
              className="w-16 h-10 p-0 border-none bg-transparent"
            />
            {errors.color && <p className="text-red-500 text-xs mt-1">{errors.color}</p>}
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={data.is_active}
                onChange={e => setData('is_active', e.target.checked)}
                className="form-checkbox text-[#7f13ec]"
              />
              <span className="text-sm text-gray-400">Active</span>
            </label>
            <label className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Order</span>
              <input
                type="number"
                value={data.sort_order}
                onChange={e => setData('sort_order', Number(e.target.value))}
                className="w-20 bg-[#0a050f] border border-white/10 rounded-lg px-2 py-1 text-white focus:border-[#7f13ec] focus:ring-1 focus:ring-[#7f13ec] outline-none"
                min={0}
              />
            </label>
          </div>
          <div className="flex justify-end gap-4">
            <Link href="/admin/categories" className="px-6 py-2 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-all">Cancel</Link>
            <button
              type="submit"
              disabled={processing}
              className="px-6 py-2 rounded-lg bg-[#7f13ec] text-white font-bold hover:shadow-[0_0_20px_rgba(127,19,236,0.5)] transition-all disabled:opacity-50"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
