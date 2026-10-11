import React, { useState, useEffect } from 'react';
import { Filter, X, SlidersHorizontal, ArrowUpDown, Search, RotateCcw } from 'lucide-react';
import { Product, ProductSize, CategoryItem } from '../types/ecommerce';
import { ProductCard } from '../components/product/ProductCard';
import { QuickViewModal } from '../components/product/QuickViewModal';

interface ShopPageProps {
  navigate: (route: string, params?: any) => void;
  initialCategory?: string;
  initialSearch?: string;
  initialSale?: boolean;
}

export const ShopPage: React.FC<ShopPageProps> = ({
  navigate,
  initialCategory,
  initialSearch,
  initialSale,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'All');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch || '');
  const [minPrice, setMinPrice] = useState<number>(1000);
  const [maxPrice, setMaxPrice] = useState<number>(4500);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [isSaleOnly, setIsSaleOnly] = useState<boolean>(initialSale || false);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Sync category if props change
  useEffect(() => {
    if (initialCategory) setSelectedCategory(initialCategory);
    if (initialSearch !== undefined) setSearchQuery(initialSearch);
    if (initialSale !== undefined) setIsSaleOnly(initialSale);
  }, [initialCategory, initialSearch, initialSale]);

  // Load categories
  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error(err));
  }, []);

  // Fetch filtered products
  useEffect(() => {
    const fetchFilteredProducts = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (selectedCategory && selectedCategory !== 'All') {
          queryParams.set('category', selectedCategory);
        }
        if (searchQuery.trim()) {
          queryParams.set('search', searchQuery.trim());
        }
        if (selectedSize) {
          queryParams.set('size', selectedSize);
        }
        if (minPrice > 1000) {
          queryParams.set('minPrice', String(minPrice));
        }
        if (maxPrice < 4500) {
          queryParams.set('maxPrice', String(maxPrice));
        }
        if (inStockOnly) {
          queryParams.set('inStockOnly', 'true');
        }
        if (isSaleOnly) {
          queryParams.set('isSale', 'true');
        }
        if (sortBy) {
          queryParams.set('sort', sortBy);
        }

        const res = await fetch(`/api/products?${queryParams.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setProducts(data.products || []);
        }
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    };

    const timeout = setTimeout(fetchFilteredProducts, 150);
    return () => clearTimeout(timeout);
  }, [selectedCategory, selectedSize, searchQuery, minPrice, maxPrice, inStockOnly, isSaleOnly, sortBy]);

  const resetFilters = () => {
    setSelectedCategory('All');
    setSelectedSize('');
    setSearchQuery('');
    setMinPrice(1000);
    setMaxPrice(4500);
    setInStockOnly(false);
    setIsSaleOnly(false);
    setSortBy('featured');
  };

  const sizes: ProductSize[] = ['S', 'M', 'L', 'XL', 'XXL'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Page Title & Breadcrumbs */}
      <div className="border-b border-white/[0.08] pb-6 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#e11d48] font-semibold">
            Rich People Catalog
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold font-cinzel text-white mt-1">
            {selectedCategory === 'All' ? 'The Complete Wardrobe' : selectedCategory}
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Showing {products.length} luxury garments crafted in Bangladesh
          </p>
        </div>

        {/* Search bar & Sorting */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Mobile Filter Trigger */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 px-3.5 py-2 rounded bg-zinc-900 border border-white/10 text-xs font-semibold text-zinc-200"
          >
            <SlidersHorizontal className="w-4 h-4 text-amber-200" />
            <span>Filters</span>
          </button>

          {/* Sort selector */}
          <div className="flex items-center gap-2 bg-zinc-900/90 border border-white/10 rounded px-3 py-1.5 text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-white border-none focus:outline-none cursor-pointer text-xs"
            >
              <option value="featured" className="bg-zinc-900 text-white">Featured</option>
              <option value="newest" className="bg-zinc-900 text-white">Newest First</option>
              <option value="price_asc" className="bg-zinc-900 text-white">Price: Low to High</option>
              <option value="price_desc" className="bg-zinc-900 text-white">Price: High to Low</option>
              <option value="best_selling" className="bg-zinc-900 text-white">Best Selling</option>
              <option value="rating" className="bg-zinc-900 text-white">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* ================= DESKTOP SIDEBAR FILTERS ================= */}
        <aside className="hidden lg:block space-y-6 bg-[#0f0f13] p-6 rounded-xl border border-white/[0.08] h-fit sticky top-28">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="text-xs uppercase tracking-widest font-bold text-white font-cinzel flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-amber-200" />
              <span>Refine Pieces</span>
            </h3>
            <button
              onClick={resetFilters}
              className="text-[11px] text-zinc-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Real-time search inside catalog */}
          <div className="space-y-2">
            <label className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold block">
              Search by Keyword
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Shirt, Panjabi, Silk..."
                className="w-full pl-8 pr-3 py-2 text-xs rounded bg-zinc-950 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-white/30"
              />
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-2.5" />
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-2 pt-2">
            <label className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold block">
              Category
            </label>
            <div className="space-y-1 text-xs">
              <button
                onClick={() => setSelectedCategory('All')}
                className={`w-full text-left py-1.5 px-2.5 rounded transition-colors ${
                  selectedCategory === 'All'
                    ? 'bg-[#831828] text-white font-semibold'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                }`}
              >
                All Garments
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.name)}
                  className={`w-full text-left py-1.5 px-2.5 rounded transition-colors ${
                    selectedCategory === c.name
                      ? 'bg-[#831828] text-white font-semibold'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div className="space-y-2 pt-2 border-t border-white/[0.06]">
            <label className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold block">
              Size
            </label>
            <div className="flex gap-1.5 flex-wrap">
              <button
                onClick={() => setSelectedSize('')}
                className={`px-2.5 py-1 text-xs rounded border transition-colors ${
                  selectedSize === ''
                    ? 'bg-white text-zinc-950 font-bold border-white'
                    : 'border-white/10 text-zinc-400 hover:border-white/30'
                }`}
              >
                All
              </button>
              {sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s === selectedSize ? '' : s)}
                  className={`px-2.5 py-1 text-xs rounded border transition-colors ${
                    selectedSize === s
                      ? 'bg-white text-zinc-950 font-bold border-white'
                      : 'border-white/10 text-zinc-400 hover:border-white/30'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-2 pt-2 border-t border-white/[0.06]">
            <div className="flex justify-between text-[11px] text-zinc-400 uppercase tracking-wider font-semibold">
              <span>Price Range</span>
              <span className="text-white tabular-nums">৳{minPrice} - ৳{maxPrice}</span>
            </div>
            <input
              type="range"
              min="1000"
              max="4500"
              step="100"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#831828] cursor-pointer"
            />
          </div>

          {/* Toggles */}
          <div className="space-y-2.5 pt-2 border-t border-white/[0.06]">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-300">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="rounded border-zinc-700 bg-zinc-900 accent-[#831828]"
              />
              <span>In Stock Only</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-300">
              <input
                type="checkbox"
                checked={isSaleOnly}
                onChange={(e) => setIsSaleOnly(e.target.checked)}
                className="rounded border-zinc-700 bg-zinc-900 accent-[#831828]"
              />
              <span>On Privilege Sale</span>
            </label>
          </div>
        </aside>

        {/* ================= MOBILE FILTER DRAWER ================= */}
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setMobileFilterOpen(false)}
            />
            <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-[#0f0f13] border-l border-white/10 p-6 flex flex-col justify-between overflow-y-auto">
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <h3 className="text-sm uppercase tracking-widest font-bold text-white font-cinzel">
                    Filter Garments
                  </h3>
                  <button onClick={() => setMobileFilterOpen(false)} className="text-zinc-400 p-1">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Categories */}
                <div className="space-y-2">
                  <label className="text-xs uppercase text-zinc-400 font-semibold block">Category</label>
                  <div className="space-y-1 text-xs">
                    <button
                      onClick={() => {
                        setSelectedCategory('All');
                        setMobileFilterOpen(false);
                      }}
                      className={`w-full text-left py-2 px-3 rounded ${
                        selectedCategory === 'All' ? 'bg-[#831828] text-white font-bold' : 'text-zinc-300'
                      }`}
                    >
                      All Garments
                    </button>
                    {categories.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => {
                          setSelectedCategory(c.name);
                          setMobileFilterOpen(false);
                        }}
                        className={`w-full text-left py-2 px-3 rounded ${
                          selectedCategory === c.name ? 'bg-[#831828] text-white font-bold' : 'text-zinc-300'
                        }`}
                      >
                        {c.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sizes */}
                <div className="space-y-2 pt-2 border-t border-white/10">
                  <label className="text-xs uppercase text-zinc-400 font-semibold block">Size</label>
                  <div className="flex gap-2 flex-wrap">
                    {sizes.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSelectedSize(s === selectedSize ? '' : s)}
                        className={`px-3 py-1 text-xs rounded border ${
                          selectedSize === s ? 'bg-white text-zinc-950 font-bold border-white' : 'border-white/20 text-zinc-300'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price */}
                <div className="space-y-2 pt-2 border-t border-white/10 text-xs">
                  <div className="flex justify-between text-zinc-300">
                    <span>Max Price</span>
                    <span className="font-bold text-white">৳{maxPrice}</span>
                  </div>
                  <input
                    type="range"
                    min="1000"
                    max="4500"
                    step="100"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-[#831828]"
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-white/10 space-y-2">
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-full py-3 bg-[#831828] text-white text-xs uppercase tracking-widest font-bold rounded"
                >
                  Apply Filters ({products.length})
                </button>
                <button
                  onClick={() => {
                    resetFilters();
                    setMobileFilterOpen(false);
                  }}
                  className="w-full py-2 bg-zinc-900 text-zinc-400 text-xs uppercase tracking-widest rounded"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= PRODUCTS GRID ================= */}
        <main className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse bg-zinc-900/60 rounded-xl h-96 border border-white/5" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="py-20 text-center bg-[#111116] rounded-xl border border-white/[0.08] p-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center mx-auto text-zinc-500">
                <Search className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold font-cinzel text-white">No Garments Found</h3>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                No items match your selected filters. Try broadening your criteria or reset filters.
              </p>
              <button
                onClick={resetFilters}
                className="px-6 py-2.5 bg-[#831828] text-white text-xs uppercase tracking-widest font-semibold rounded hover:bg-[#991b1b] transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  navigate={navigate}
                  onQuickView={(p) => setQuickViewProduct(p)}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        navigate={navigate}
      />
    </div>
  );
};
