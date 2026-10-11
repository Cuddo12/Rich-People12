import {
  initialSiteSettings,
  initialCategories,
  initialCollections,
  initialProducts,
  initialCoupons,
  initialOffers,
  initialOrders,
} from '../server/seedData';
import {
  Product,
  Order,
  SiteSettings,
  CategoryItem,
  CollectionItem,
  Coupon,
  Offer,
  Review,
  ProductSize,
} from '../types/ecommerce';

const STORAGE_KEY = 'richpeople_client_store_v1';

interface ClientStore {
  settings: SiteSettings;
  categories: CategoryItem[];
  collections: CollectionItem[];
  products: Product[];
  coupons: Coupon[];
  offers: Offer[];
  orders: Order[];
  reviews: Review[];
  admin: {
    username: string;
    passwordHash: string;
  };
}

function getStoredData(): ClientStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Could not read client store:', e);
  }

  // Safe fallback to seed data
  const initial: ClientStore = {
    settings: initialSiteSettings,
    categories: initialCategories,
    collections: initialCollections,
    products: initialProducts,
    coupons: initialCoupons,
    offers: initialOffers,
    orders: initialOrders,
    reviews: [],
    admin: {
      username: '1234',
      passwordHash: '224455',
    },
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
  } catch (e) {
    // ignore
  }

  return initial;
}

function saveStoredData(data: ClientStore) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('Could not save client store:', e);
  }
}

/**
 * Handle API calls client-side when deployed to static hosts like GitHub Pages
 */
export async function handleStaticApi(url: string, init?: RequestInit): Promise<Response | null> {
  const urlObj = new URL(url, window.location.origin);
  const pathname = urlObj.pathname;
  const method = (init?.method || 'GET').toUpperCase();

  // If not an /api route, do not intercept
  if (!pathname.includes('/api/')) return null;

  const apiPath = pathname.substring(pathname.indexOf('/api/'));
  const store = getStoredData();

  // Helper JSON Response generator
  const jsonResponse = (data: any, status = 200) => {
    return new Response(JSON.stringify(data), {
      status,
      headers: { 'Content-Type': 'application/json' },
    });
  };

  // Helper to parse body
  let body: any = {};
  if (init?.body && typeof init.body === 'string') {
    try {
      body = JSON.parse(init.body);
    } catch {
      body = {};
    }
  }

  // 1. Settings
  if (apiPath === '/api/settings') {
    if (method === 'GET') {
      return jsonResponse(store.settings);
    }
    if (method === 'POST') {
      store.settings = { ...store.settings, ...body };
      saveStoredData(store);
      return jsonResponse({ success: true, settings: store.settings });
    }
  }

  // 2. Categories
  if (apiPath === '/api/categories') {
    if (method === 'GET') {
      return jsonResponse(store.categories);
    }
    if (method === 'POST') {
      const newCat: CategoryItem = {
        id: `cat_${Date.now()}`,
        name: body.name || 'New Category',
        slug: body.slug || `cat-${Date.now()}`,
        description: body.description || '',
        image: body.image || store.products[0]?.featuredImage || '',
        order: store.categories.length,
        isActive: true,
      };
      store.categories.push(newCat);
      saveStoredData(store);
      return jsonResponse(newCat, 201);
    }
  }

  // 3. Collections
  if (apiPath === '/api/collections') {
    if (method === 'GET') {
      return jsonResponse(store.collections);
    }
    if (method === 'POST') {
      const newCol: CollectionItem = {
        id: `col_${Date.now()}`,
        name: body.name || 'New Collection',
        slug: body.slug || `col-${Date.now()}`,
        description: body.description || '',
        image: body.image || '',
        banner: body.banner || '',
        isActive: true,
      };
      store.collections.push(newCol);
      saveStoredData(store);
      return jsonResponse(newCol, 201);
    }
  }

  // 4. Products list & query
  if (apiPath === '/api/products' && method === 'GET') {
    const params = urlObj.searchParams;
    let filtered = [...store.products];

    const category = params.get('category');
    if (category && category !== 'All') {
      filtered = filtered.filter(
        (p) => p.category.toLowerCase() === category.toLowerCase()
      );
    }

    const search = params.get('search');
    if (search) {
      const term = search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term) ||
          p.fabric.toLowerCase().includes(term) ||
          p.sku.toLowerCase().includes(term)
      );
    }

    const minPrice = params.get('minPrice');
    if (minPrice) {
      filtered = filtered.filter((p) => p.price >= Number(minPrice));
    }

    const maxPrice = params.get('maxPrice');
    if (maxPrice) {
      filtered = filtered.filter((p) => p.price <= Number(maxPrice));
    }

    const size = params.get('size');
    if (size) {
      filtered = filtered.filter((p) => p.sizes.includes(size as ProductSize));
    }

    const inStockOnly = params.get('inStockOnly');
    if (inStockOnly === 'true') {
      filtered = filtered.filter((p) => p.stockQuantity > 0);
    }

    const isSale = params.get('isSale');
    if (isSale === 'true') {
      filtered = filtered.filter((p) => p.isSale);
    }

    const isFeatured = params.get('isFeatured');
    if (isFeatured === 'true') {
      filtered = filtered.filter((p) => p.isFeatured);
    }

    const isNewArrival = params.get('isNewArrival');
    if (isNewArrival === 'true') {
      filtered = filtered.filter((p) => p.isNewArrival);
    }

    // Sort
    const sort = params.get('sort');
    if (sort === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sort === 'newest') {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    const limit = params.get('limit') ? Number(params.get('limit')) : 50;
    const page = params.get('page') ? Number(params.get('page')) : 1;
    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + limit);

    return jsonResponse({
      products: paginated,
      total: filtered.length,
      page,
      totalPages: Math.ceil(filtered.length / limit),
    });
  }

  // 5. Single Product
  if (apiPath.startsWith('/api/products/')) {
    const idOrSlug = apiPath.replace('/api/products/', '');
    const product = store.products.find(
      (p) => p.id === idOrSlug || p.slug === idOrSlug
    );
    if (method === 'GET') {
      if (!product) return jsonResponse({ error: 'Product not found' }, 404);
      const related = store.products
        .filter((p) => p.category === product.category && p.id !== product.id)
        .slice(0, 4);
      return jsonResponse({ product, related });
    }
  }

  // 6. Orders
  if (apiPath === '/api/orders') {
    if (method === 'GET') {
      return jsonResponse({ orders: store.orders, total: store.orders.length });
    }
    if (method === 'POST') {
      const orderId = `RICH-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
      const sub = Number(body.subtotal) || 0;
      const ship = Number(body.shippingCharge) || 0;
      const disc = Number(body.discountAmount || body.couponDiscount) || 0;
      const grand = Math.max(0, sub - disc + ship);
      const adv = Number(body.advancePaid) || 200;
      const cod = Math.max(0, grand - adv);

      const newOrder: Order = {
        id: orderId,
        customerName: body.customerName,
        customerPhone: body.customerPhone,
        customerEmail: body.customerEmail || '',
        shippingAddress: body.shippingAddress,
        deliveryMethod: body.deliveryMethod || 'Inside Dhaka',
        items: body.items || [],
        subtotal: sub,
        shippingCharge: ship,
        discountAmount: disc,
        couponCode: body.couponCode,
        grandTotal: grand,
        advancePaid: adv,
        remainingCOD: cod,
        paymentMethod: body.paymentMethod || 'bKash',
        transactionId: body.transactionId || '',
        senderPhone: body.senderPhone || '',
        paymentScreenshot: body.paymentProofScreenshot || body.paymentScreenshot,
        orderStatus: 'PAYMENT_UNDER_REVIEW',
        paymentStatus: 'PENDING_VERIFICATION',
        statusHistory: [
          {
            status: 'PAYMENT_UNDER_REVIEW',
            timestamp: new Date().toISOString(),
            note: 'Order submitted with advance payment details.',
          },
        ],
        adminNotes: ['Order submitted via storefront.'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      store.orders.unshift(newOrder);
      saveStoredData(store);
      return jsonResponse(newOrder, 201);
    }
  }

  // 7. Track Order
  if (apiPath === '/api/orders/track') {
    const phone = (body.phone || urlObj.searchParams.get('phone') || '').trim();
    const orderId = (body.orderId || urlObj.searchParams.get('orderId') || '').trim();
    const trxId = (body.transactionId || urlObj.searchParams.get('transactionId') || '').trim();

    const found = store.orders.find((o) => {
      const matchPhone = phone ? o.customerPhone.includes(phone) || o.senderPhone.includes(phone) : true;
      const matchId = orderId ? o.id.toLowerCase() === orderId.toLowerCase() : true;
      const matchTrx = trxId ? o.transactionId.toLowerCase() === trxId.toLowerCase() : true;
      return (orderId ? matchId : true) && (phone ? matchPhone : true) && (trxId ? matchTrx : true);
    });

    if (found) {
      return jsonResponse(found);
    }
    return jsonResponse({ error: 'No order found matching this Order ID and Phone Number combination.' }, 404);
  }

  // 8. Coupons
  if (apiPath === '/api/coupons') {
    if (method === 'GET') {
      return jsonResponse(store.coupons);
    }
  }

  if (apiPath === '/api/coupons/validate' && method === 'POST') {
    const { code, cartTotal, subtotal } = body;
    const total = Number(cartTotal || subtotal) || 0;
    const coupon = store.coupons.find(
      (c) => c.code.toUpperCase() === (code || '').toUpperCase() && c.isActive
    );
    if (!coupon) {
      return jsonResponse({ valid: false, message: 'Invalid or expired coupon code' }, 400);
    }
    if (total < coupon.minOrderAmount) {
      return jsonResponse({
        valid: false,
        message: `Minimum order amount of ৳${coupon.minOrderAmount} required for this coupon.`,
      }, 400);
    }
    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = Math.round((total * coupon.discountAmount) / 100);
      if (coupon.maxDiscountAmount && discount > coupon.maxDiscountAmount) {
        discount = coupon.maxDiscountAmount;
      }
    } else {
      discount = coupon.discountAmount;
    }
    return jsonResponse({ valid: true, discount, coupon });
  }

  // 9. Offers
  if (apiPath === '/api/offers' && method === 'GET') {
    return jsonResponse(store.offers);
  }

  // 10. Reviews
  if (apiPath === '/api/reviews') {
    if (method === 'GET') {
      return jsonResponse(store.reviews);
    }
    if (method === 'POST') {
      const newRev: Review = {
        id: `rev_${Date.now()}`,
        productId: body.productId || '',
        customerName: body.customerName || 'Gentleman',
        rating: body.rating || 5,
        title: body.title || '',
        comment: body.comment || '',
        status: 'approved',
        createdAt: new Date().toISOString(),
      };
      store.reviews.unshift(newRev);
      saveStoredData(store);
      return jsonResponse(newRev, 201);
    }
  }

  // 11. Auth Login
  if (apiPath === '/api/auth/admin/login' && method === 'POST') {
    const { username, password } = body;
    const isDefaultMatch =
      (username === '1234' || username === 'Miljar') &&
      (password === '224455' || password === 'Miljar12');
    const isStoredMatch =
      username === store.admin.username && password === store.admin.passwordHash;

    if (isDefaultMatch || isStoredMatch) {
      const token = `static_token_${Date.now()}_${btoa(username)}`;
      const adminData = {
        id: 'admin_master',
        username: username,
        email: 'admin@richpeople.fashion',
        role: 'super_admin' as const,
        createdAt: '2026-01-01T00:00:00Z',
      };
      return jsonResponse({
        success: true,
        token,
        admin: adminData,
        message: `Welcome back, ${username}`,
      });
    }
    return jsonResponse({ success: false, error: 'Invalid admin credentials' }, 401);
  }

  // 12. Auth Me
  if (apiPath === '/api/auth/admin/me' && method === 'GET') {
    return jsonResponse({
      success: true,
      admin: {
        id: 'admin_master',
        username: store.admin.username,
        email: 'admin@richpeople.fashion',
        role: 'super_admin',
        createdAt: '2026-01-01T00:00:00Z',
      },
    });
  }

  // 13. Admin Dashboard stats
  if (apiPath === '/api/admin/dashboard' && method === 'GET') {
    const totalRev = store.orders.reduce((acc, o) => acc + o.grandTotal, 0);
    return jsonResponse({
      totalRevenue: totalRev,
      totalOrders: store.orders.length,
      pendingOrders: store.orders.filter((o) => o.orderStatus === 'PAYMENT_UNDER_REVIEW' || o.orderStatus === 'PENDING_PAYMENT').length,
      verifiedPayments: store.orders.filter((o) => o.paymentStatus === 'PAID').length,
      totalProducts: store.products.length,
      recentOrders: store.orders.slice(0, 5),
    });
  }

  // 14. Contact
  if (apiPath === '/api/contact') {
    if (method === 'POST') {
      return jsonResponse({ success: true, message: 'Message received. We will contact you shortly.' });
    }
    if (method === 'GET') {
      return jsonResponse([]);
    }
  }

  // Default empty ok for other queries
  return jsonResponse({ success: true });
}

/**
 * Safe fetch wrapper that handles static hosting (e.g. GitHub Pages) fallback
 */
export async function apiFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const urlString = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;

  if (urlString.includes('/api/')) {
    try {
      const response = await window.fetch(input, init);
      const contentType = response.headers.get('content-type') || '';
      if (response.ok && contentType.includes('application/json')) {
        return response;
      }
      if (response.status === 404 || contentType.includes('text/html') || response.status >= 500) {
        const fallback = await handleStaticApi(urlString, init);
        if (fallback) return fallback;
      }
      return response;
    } catch (networkErr) {
      const fallback = await handleStaticApi(urlString, init);
      if (fallback) return fallback;
      throw networkErr;
    }
  }

  return window.fetch(input, init);
}

/**
 * Installs transparent client-side fallback into window.fetch when supported
 */
export function initStaticApiFallback() {
  if (typeof window === 'undefined') return;

  try {
    // Check if window.fetch can be modified safely
    const desc = Object.getOwnPropertyDescriptor(window, 'fetch');
    if (desc && !desc.writable && !desc.set && !desc.configurable) {
      return;
    }

    const originalFetch = window.fetch.bind(window);

    const patchedFetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
      const urlString = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;

      if (urlString.includes('/api/')) {
        try {
          const response = await originalFetch(input, init);
          const contentType = response.headers.get('content-type') || '';
          if (response.ok && contentType.includes('application/json')) {
            return response;
          }
          if (response.status === 404 || contentType.includes('text/html') || response.status >= 500) {
            const fallback = await handleStaticApi(urlString, init);
            if (fallback) return fallback;
          }
          return response;
        } catch (networkErr) {
          const fallback = await handleStaticApi(urlString, init);
          if (fallback) return fallback;
          throw networkErr;
        }
      }

      return originalFetch(input, init);
    };

    try {
      window.fetch = patchedFetch;
    } catch {
      try {
        Object.defineProperty(window, 'fetch', {
          value: patchedFetch,
          writable: true,
          configurable: true,
        });
      } catch {
        // Window.fetch has only a getter in this environment
      }
    }
  } catch {
    // Fallback gracefully without throwing
  }
}
