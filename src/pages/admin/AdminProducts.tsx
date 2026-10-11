import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Copy,
  Archive,
  CheckCircle2,
  ExternalLink,
  X,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useToast } from '../../context/ToastContext';
import { Product, ProductSize, CategoryItem } from '../../types/ecommerce';

export const AdminProducts: React.FC = () => {
  const { token } = useAdminAuth();
  const { success, error } = useToast();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Form modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState('Shirts');
  const [collection, setCollection] = useState('Signature Monochrome');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(1850);
  const [compareAtPrice, setCompareAtPrice] = useState<number>(2250);
  const [costPrice, setCostPrice] = useState<number>(950);
  const [stockQuantity, setStockQuantity] = useState<number>(30);
  const [lowStockThreshold, setLowStockThreshold] = useState<number>(8);
  const [sizes, setSizes] = useState<ProductSize[]>(['S', 'M', 'L', 'XL', 'XXL']);
  const [colors, setColors] = useState<string>('Deep Black');
  const [fabric, setFabric] = useState('100% Giza Cotton (120/2 Count)');
  const [fit, setFit] = useState('Contemporary Slim Fit');
  const [weight, setWeight] = useState('165 GSM');
  const [imageUrl, setImageUrl] = useState('/src/assets/images/luxury_shirt_showcase_1791384245775.jpg');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(false);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isSale, setIsSale] = useState(false);
  const [status, setStatus] = useState<'published' | 'draft' | 'archived'>('published');
  const [submitting, setSubmitting] = useState(false);

  const fetchProducts = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const q = new URLSearchParams();
      if (search.trim()) q.set('search', search.trim());
      if (categoryFilter !== 'All') q.set('category', categoryFilter);
      q.set('limit', '100');

      const [pRes, cRes] = await Promise.all([
        fetch(`/api/products?${q.toString()}`),
        fetch('/api/categories'),
      ]);

      if (pRes.ok) {
        const pData = await pRes.json();
        setProducts(pData.products || []);
      }
      if (cRes.ok) {
        const cData = await cRes.json();
        setCategories(cData || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [token, categoryFilter]);

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setName('');
    setSlug('');
    setSku(`HMS-SH-${Math.floor(Math.random() * 900) + 100}`);
    setCategory('Shirts');
    setCollection('Signature Monochrome');
    setShortDescription('');
    setDescription('');
    setPrice(1950);
    setCompareAtPrice(2400);
    setCostPrice(950);
    setStockQuantity(25);
    setLowStockThreshold(6);
    setSizes(['S', 'M', 'L', 'XL', 'XXL']);
    setColors('Obsidian Black');
    setFabric('100% Supima Cotton');
    setFit('Tailored Fit');
    setWeight('165 GSM');
    setImageUrl('/src/assets/images/luxury_shirt_showcase_1791384245775.jpg');
    setIsFeatured(false);
    setIsNewArrival(true);
    setIsBestSeller(false);
    setIsSale(false);
    setStatus('published');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setSlug(p.slug);
    setSku(p.sku);
    setCategory(p.category);
    setCollection(p.collection);
    setShortDescription(p.shortDescription || '');
    setDescription(p.description || '');
    setPrice(p.price);
    setCompareAtPrice(p.compareAtPrice || 0);
    setCostPrice(p.costPrice || 0);
    setStockQuantity(p.stockQuantity);
    setLowStockThreshold(p.lowStockThreshold || 5);
    setSizes(p.sizes || ['S', 'M', 'L', 'XL']);
    setColors(p.colors ? p.colors.join(', ') : 'Black');
    setFabric(p.fabric || '');
    setFit(p.fit || '');
    setWeight(p.weight || '');
    setImageUrl(p.featuredImage || (p.images && p.images[0]) || '');
    setIsFeatured(!!p.isFeatured);
    setIsNewArrival(!!p.isNewArrival);
    setIsBestSeller(!!p.isBestSeller);
    setIsSale(!!p.isSale);
    setStatus(p.status || 'published');
    setIsModalOpen(true);
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !sku.trim() || !price) {
      error('Please complete product name, SKU, and price.');
      return;
    }

    setSubmitting(true);
    const parsedColors = colors.split(',').map((c) => c.trim()).filter(Boolean);
    const discountPercent =
      compareAtPrice && compareAtPrice > price
        ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
        : undefined;

    const payload = {
      name: name.trim(),
      slug: slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      sku: sku.trim(),
      category,
      collection,
      shortDescription,
      description,
      price: Number(price),
      compareAtPrice: compareAtPrice ? Number(compareAtPrice) : undefined,
      discount: discountPercent,
      costPrice: Number(costPrice) || 0,
      stockQuantity: Number(stockQuantity),
      lowStockThreshold: Number(lowStockThreshold),
      sizes,
      colors: parsedColors.length ? parsedColors : ['Standard'],
      fabric,
      fit,
      weight,
      featuredImage: imageUrl,
      images: [imageUrl],
      tags: [category, collection, ...parsedColors],
      status,
      isFeatured,
      isNewArrival,
      isBestSeller,
      isSale: isSale || (discountPercent ? discountPercent > 0 : false),
    };

    try {
      const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        success(editingProduct ? 'Product updated successfully' : 'Product created successfully');
        setIsModalOpen(false);
        fetchProducts();
      } else {
        error('Failed to save product');
      }
    } catch {
      error('Network error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id: string, prodName: string) => {
    if (!window.confirm(`Are you certain you want to permanently delete "${prodName}"?`)) return;
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        success('Product removed');
        fetchProducts();
      }
    } catch {
      error('Failed to delete');
    }
  };

  const handleDuplicateProduct = async (id: string) => {
    try {
      const res = await fetch(`/api/products/${id}/duplicate`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        success('Product duplicated');
        fetchProducts();
      }
    } catch {
      error('Failed to duplicate');
    }
  };

  const toggleSizeSelection = (sz: ProductSize) => {
    if (sizes.includes(sz)) {
      setSizes(sizes.filter((s) => s !== sz));
    } else {
      setSizes([...sizes, sz]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-white/10">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#e11d48] font-bold">
            Catalog Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-cinzel text-white mt-1">
            Products & Tailored Ensembles
          </h1>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 bg-[#831828] hover:bg-[#991b1b] text-white text-xs font-bold uppercase tracking-wider rounded transition-colors flex items-center gap-2 shadow-lg shadow-rose-950/40"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 rounded-xl bg-[#0e0e12] border border-white/[0.08] flex flex-wrap gap-4 items-center justify-between">
        <div className="flex-1 min-w-[240px] max-w-md relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchProducts()}
            placeholder="Search by name, SKU, or fabric..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded bg-zinc-950 border border-white/15 text-white placeholder-zinc-500 focus:outline-none"
          />
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-zinc-400">Category:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-zinc-950 border border-white/15 rounded px-3 py-1.5 text-white text-xs"
          >
            <option value="All">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Grid / Table */}
      <div className="p-6 rounded-2xl bg-[#0e0e12] border border-white/[0.08] overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-xs text-zinc-400 uppercase tracking-widest">
            Loading Catalog...
          </div>
        ) : products.length === 0 ? (
          <div className="py-16 text-center text-xs text-zinc-400">
            No products found. Click "Add New Product" to craft one.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-950/80 text-zinc-400 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3">Garment</th>
                  <th className="p-3">SKU</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Stock</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-zinc-300">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-zinc-900/40 transition-colors">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.featuredImage || p.images[0]}
                          alt=""
                          className="w-12 h-14 object-cover rounded bg-zinc-950 shrink-0 border border-white/5"
                        />
                        <div>
                          <strong className="text-white block line-clamp-1">{p.name}</strong>
                          <span className="text-[11px] text-zinc-500 font-mono">
                            Sizes: {p.sizes.join(', ')}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 font-mono text-zinc-400">{p.sku}</td>
                    <td className="p-3 text-amber-200/90 font-medium">{p.category}</td>
                    <td className="p-3 font-mono font-bold text-white">
                      ৳{p.price.toLocaleString()}
                      {p.compareAtPrice && p.compareAtPrice > p.price && (
                        <span className="text-[10px] text-zinc-500 line-through block">
                          ৳{p.compareAtPrice.toLocaleString()}
                        </span>
                      )}
                    </td>
                    <td className="p-3 font-mono">
                      <span
                        className={`font-bold ${
                          p.stockQuantity <= p.lowStockThreshold
                            ? 'text-amber-400'
                            : 'text-emerald-400'
                        }`}
                      >
                        {p.stockQuantity} pcs
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-zinc-900 border border-white/10 text-zinc-300">
                        {p.status}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-1 whitespace-nowrap">
                      <button
                        onClick={() => handleOpenEditModal(p)}
                        className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded transition-colors"
                        title="Edit Product"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDuplicateProduct(p.id)}
                        className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded transition-colors"
                        title="Duplicate Product"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p.id, p.name)}
                        className="p-1.5 bg-rose-950 hover:bg-rose-900 text-rose-300 rounded transition-colors"
                        title="Delete Product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/85 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-3xl bg-[#111116] rounded-2xl border border-white/15 p-6 sm:p-8 space-y-6 z-10 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-white/10">
              <h2 className="text-xl font-cinzel font-bold text-white">
                {editingProduct ? 'Edit Garment Blueprint' : 'Craft New Garment'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Product Title *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Royal Black Embroidered Panjabi"
                    className="w-full px-3.5 py-2.5 rounded bg-zinc-950 border border-white/15 text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">SKU Identifier *</label>
                  <input
                    type="text"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="e.g. HMS-PJ-001"
                    className="w-full px-3.5 py-2.5 rounded bg-zinc-950 border border-white/15 text-white font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded bg-zinc-950 border border-white/15 text-white"
                  >
                    <option value="Shirts">Shirts</option>
                    <option value="Panjabi">Panjabi</option>
                    <option value="Cuban Collar Shirts">Cuban Collar Shirts</option>
                    <option value="Eid Collection">Eid Collection</option>
                    <option value="Premium Shirts">Premium Shirts</option>
                    <option value="Sale">Sale</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Collection</label>
                  <input
                    type="text"
                    value={collection}
                    onChange={(e) => setCollection(e.target.value)}
                    placeholder="e.g. Royal Heritage 2026"
                    className="w-full px-3.5 py-2.5 rounded bg-zinc-950 border border-white/15 text-white"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Retail Price (BDT) *</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded bg-zinc-950 border border-white/15 text-white font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Compare-at Price (BDT)</label>
                  <input
                    type="number"
                    value={compareAtPrice}
                    onChange={(e) => setCompareAtPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded bg-zinc-950 border border-white/15 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Current Stock Quantity *</label>
                  <input
                    type="number"
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded bg-zinc-950 border border-white/15 text-white font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Low Stock Threshold</label>
                  <input
                    type="number"
                    value={lowStockThreshold}
                    onChange={(e) => setLowStockThreshold(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded bg-zinc-950 border border-white/15 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Fabric Composition</label>
                  <input
                    type="text"
                    value={fabric}
                    onChange={(e) => setFabric(e.target.value)}
                    placeholder="e.g. 100% Giza Cotton (120/2 Count)"
                    className="w-full px-3.5 py-2.5 rounded bg-zinc-950 border border-white/15 text-white"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Fit Silhouette</label>
                  <input
                    type="text"
                    value={fit}
                    onChange={(e) => setFit(e.target.value)}
                    placeholder="e.g. Contemporary Slim Fit"
                    className="w-full px-3.5 py-2.5 rounded bg-zinc-950 border border-white/15 text-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-zinc-300 font-semibold mb-1">Featured Image URL / Asset Path</label>
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded bg-zinc-950 border border-white/15 text-white font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-zinc-300 font-semibold mb-1">Available Sizes</label>
                  <div className="flex gap-2">
                    {(['S', 'M', 'L', 'XL', 'XXL'] as ProductSize[]).map((sz) => (
                      <button
                        type="button"
                        key={sz}
                        onClick={() => toggleSizeSelection(sz)}
                        className={`px-3 py-1.5 rounded border text-xs font-semibold ${
                          sizes.includes(sz)
                            ? 'bg-white text-zinc-950 border-white'
                            : 'border-white/20 text-zinc-400'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-zinc-300 font-semibold mb-1">Short Description</label>
                  <input
                    type="text"
                    value={shortDescription}
                    onChange={(e) => setShortDescription(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded bg-zinc-950 border border-white/15 text-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-zinc-300 font-semibold mb-1">Full Description</label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded bg-zinc-950 border border-white/15 text-white"
                  />
                </div>
              </div>

              {/* Badges / Visibility Toggles */}
              <div className="flex flex-wrap gap-4 pt-2 border-t border-white/10 text-xs text-zinc-300">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="accent-[#831828]"
                  />
                  <span>Featured Garment</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isNewArrival}
                    onChange={(e) => setIsNewArrival(e.target.checked)}
                    className="accent-[#831828]"
                  />
                  <span>New Arrival</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isBestSeller}
                    onChange={(e) => setIsBestSeller(e.target.checked)}
                    className="accent-[#831828]"
                  />
                  <span>Best Seller</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isSale}
                    onChange={(e) => setIsSale(e.target.checked)}
                    className="accent-[#831828]"
                  />
                  <span>Privilege Sale</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 bg-zinc-800 text-zinc-300 rounded uppercase tracking-wider font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-[#831828] hover:bg-[#991b1b] text-white font-bold uppercase tracking-wider rounded"
                >
                  {submitting ? 'Saving...' : editingProduct ? 'Save Modifications' : 'Publish Garment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
