import React, { useState, useEffect } from 'react';
import { Layers, Plus, Trash2, Edit2, X, RefreshCw } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useToast } from '../../context/ToastContext';
import { CategoryItem, CollectionItem } from '../../types/ecommerce';

export const AdminCategories: React.FC = () => {
  const { token } = useAdminAuth();
  const { success, error } = useToast();

  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [collections, setCollections] = useState<CollectionItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Category modal
  const [catModalOpen, setCatModalOpen] = useState(false);
  const [catName, setCatName] = useState('');
  const [catSlug, setCatSlug] = useState('');
  const [catDesc, setCatDesc] = useState('');
  const [catImage, setCatImage] = useState('/src/assets/images/luxury_shirt_showcase_1791384245775.jpg');

  // Collection modal
  const [colModalOpen, setColModalOpen] = useState(false);
  const [colName, setColName] = useState('');
  const [colSlug, setColSlug] = useState('');
  const [colDesc, setColDesc] = useState('');
  const [colImage, setColImage] = useState('/src/assets/images/craftsmanship_fabric_banner_1791384259700.jpg');

  const fetchData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [catRes, colRes] = await Promise.all([
        fetch('/api/categories'),
        fetch('/api/collections'),
      ]);
      if (catRes.ok) setCategories(await catRes.json());
      if (colRes.ok) setCollections(await colRes.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) return;
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: catName.trim(),
          slug: catSlug.trim() || catName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          description: catDesc,
          image: catImage,
          order: categories.length + 1,
          isActive: true,
        }),
      });
      if (res.ok) {
        success('Category created');
        setCatModalOpen(false);
        setCatName('');
        setCatDesc('');
        fetchData();
      }
    } catch {
      error('Failed to create category');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        success('Category deleted');
        fetchData();
      }
    } catch {
      error('Failed to delete');
    }
  };

  const handleAddCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!colName.trim()) return;
    try {
      const res = await fetch('/api/collections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: colName.trim(),
          slug: colSlug.trim() || colName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          description: colDesc,
          image: colImage,
          isActive: true,
        }),
      });
      if (res.ok) {
        success('Collection created');
        setColModalOpen(false);
        setColName('');
        setColDesc('');
        fetchData();
      }
    } catch {
      error('Failed to create collection');
    }
  };

  const handleDeleteCollection = async (id: string) => {
    if (!window.confirm('Delete this collection?')) return;
    try {
      const res = await fetch(`/api/collections/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        success('Collection deleted');
        fetchData();
      }
    } catch {
      error('Failed to delete');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center pb-4 border-b border-white/10">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#e11d48] font-bold">
            Taxonomy Architecture
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-cinzel text-white mt-1">
            Categories & Curated Drops
          </h1>
        </div>
        <button
          onClick={fetchData}
          className="p-2 rounded bg-zinc-900 border border-white/10 text-xs text-zinc-300 hover:text-white"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Categories Section */}
        <div className="p-6 rounded-2xl bg-[#0e0e12] border border-white/[0.08] space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-white/10">
            <h2 className="text-xs uppercase tracking-widest font-bold text-white font-cinzel">
              Product Categories ({categories.length})
            </h2>
            <button
              onClick={() => setCatModalOpen(true)}
              className="px-3 py-1.5 bg-[#831828] hover:bg-[#991b1b] text-white text-xs font-semibold rounded uppercase tracking-wider flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Category</span>
            </button>
          </div>

          <div className="space-y-3">
            {categories.map((c) => (
              <div key={c.id} className="p-3.5 rounded-xl bg-zinc-950/60 border border-white/5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <img src={c.image} alt="" className="w-10 h-10 object-cover rounded" />
                  <div>
                    <strong className="text-white block text-sm">{c.name}</strong>
                    <span className="text-[11px] text-zinc-500 font-mono">/{c.slug}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteCategory(c.id)}
                  className="p-1.5 text-zinc-500 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Collections Section */}
        <div className="p-6 rounded-2xl bg-[#0e0e12] border border-white/[0.08] space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-white/10">
            <h2 className="text-xs uppercase tracking-widest font-bold text-white font-cinzel">
              Editorial Collections ({collections.length})
            </h2>
            <button
              onClick={() => setColModalOpen(true)}
              className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold rounded uppercase tracking-wider flex items-center gap-1 border border-white/10"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Collection</span>
            </button>
          </div>

          <div className="space-y-3">
            {collections.map((col) => (
              <div key={col.id} className="p-3.5 rounded-xl bg-zinc-950/60 border border-white/5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <img src={col.image} alt="" className="w-10 h-10 object-cover rounded" />
                  <div>
                    <strong className="text-white block text-sm">{col.name}</strong>
                    <span className="text-[11px] text-zinc-500">{col.description}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteCollection(col.id)}
                  className="p-1.5 text-zinc-500 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Category Modal */}
      {catModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-[#111116] rounded-xl border border-white/10 p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-2 border-b border-white/10">
              <h3 className="text-base font-cinzel font-bold text-white">Add Category</h3>
              <button onClick={() => setCatModalOpen(false)}><X className="w-5 h-5 text-zinc-400" /></button>
            </div>
            <form onSubmit={handleAddCategory} className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-300 mb-1">Category Name *</label>
                <input
                  type="text"
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  placeholder="e.g. Cuban Collar Shirts"
                  className="w-full px-3 py-2 rounded bg-zinc-950 border border-white/15 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-zinc-300 mb-1">Description</label>
                <input
                  type="text"
                  value={catDesc}
                  onChange={(e) => setCatDesc(e.target.value)}
                  placeholder="e.g. Relaxed camp collar drape"
                  className="w-full px-3 py-2 rounded bg-zinc-950 border border-white/15 text-white"
                />
              </div>
              <div>
                <label className="block text-zinc-300 mb-1">Image URL / Asset</label>
                <input
                  type="text"
                  value={catImage}
                  onChange={(e) => setCatImage(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-zinc-950 border border-white/15 text-white font-mono"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setCatModalOpen(false)} className="px-4 py-2 bg-zinc-800 text-zinc-300 rounded">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-[#831828] text-white font-bold rounded">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Collection Modal */}
      {colModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-[#111116] rounded-xl border border-white/10 p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-2 border-b border-white/10">
              <h3 className="text-base font-cinzel font-bold text-white">Add Editorial Collection</h3>
              <button onClick={() => setColModalOpen(false)}><X className="w-5 h-5 text-zinc-400" /></button>
            </div>
            <form onSubmit={handleAddCollection} className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-300 mb-1">Collection Name *</label>
                <input
                  type="text"
                  value={colName}
                  onChange={(e) => setColName(e.target.value)}
                  placeholder="e.g. Modern Cuban Minimalist"
                  className="w-full px-3 py-2 rounded bg-zinc-950 border border-white/15 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-zinc-300 mb-1">Curator's Note</label>
                <input
                  type="text"
                  value={colDesc}
                  onChange={(e) => setColDesc(e.target.value)}
                  placeholder="e.g. Open weave textures"
                  className="w-full px-3 py-2 rounded bg-zinc-950 border border-white/15 text-white"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setColModalOpen(false)} className="px-4 py-2 bg-zinc-800 text-zinc-300 rounded">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-[#831828] text-white font-bold rounded">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
