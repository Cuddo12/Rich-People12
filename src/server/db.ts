import fs from 'fs';
import path from 'path';
import {
  Product,
  CategoryItem,
  CollectionItem,
  Coupon,
  Offer,
  Order,
  SiteSettings,
  AdminUser,
  Review,
  ContactMessage,
  InventoryLog,
  CustomerUser,
  OrderStatus,
  PaymentStatus,
} from '../types/ecommerce';
import {
  initialAdmin,
  initialSiteSettings,
  initialCategories,
  initialCollections,
  initialProducts,
  initialCoupons,
  initialOffers,
  initialOrders,
} from './seedData';

interface DatabaseSchema {
  admin: AdminUser & { passwordHash: string };
  settings: SiteSettings;
  categories: CategoryItem[];
  collections: CollectionItem[];
  products: Product[];
  coupons: Coupon[];
  offers: Offer[];
  orders: Order[];
  reviews: Review[];
  contactMessages: ContactMessage[];
  inventoryLogs: InventoryLog[];
  customers: (CustomerUser & { passwordHash: string })[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.resolve(DATA_DIR, 'database.json');

class DatabaseService {
  private db: DatabaseSchema;

  constructor() {
    this.db = this.loadDatabase();
  }

  private ensureDirectory() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  private loadDatabase(): DatabaseSchema {
    this.ensureDirectory();
    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        return {
          admin: parsed.admin || initialAdmin,
          settings: parsed.settings || initialSiteSettings,
          categories: parsed.categories || initialCategories,
          collections: parsed.collections || initialCollections,
          products: parsed.products || initialProducts,
          coupons: parsed.coupons || initialCoupons,
          offers: parsed.offers || initialOffers,
          orders: parsed.orders || initialOrders,
          reviews: parsed.reviews || [],
          contactMessages: parsed.contactMessages || [],
          inventoryLogs: parsed.inventoryLogs || [],
          customers: parsed.customers || [],
        };
      } catch (err) {
        console.error('Failed to parse database file, reinitializing from seeds', err);
      }
    }

    const initial: DatabaseSchema = {
      admin: initialAdmin,
      settings: initialSiteSettings,
      categories: initialCategories,
      collections: initialCollections,
      products: initialProducts,
      coupons: initialCoupons,
      offers: initialOffers,
      orders: initialOrders,
      reviews: [
        {
          id: 'rev_1',
          productId: 'prod_shirt_01',
          customerName: 'Siam Rahman',
          rating: 5,
          title: 'Unbelievable fabric quality',
          comment: 'The collar structure and the Egyptian cotton feel is comparable to international luxury brands. Truly proud of this Bangladeshi craftsmanship.',
          status: 'approved',
          createdAt: '2026-02-15T12:00:00Z',
        },
        {
          id: 'rev_2',
          productId: 'prod_panjabi_01',
          customerName: 'Fahim Faisal',
          rating: 5,
          title: 'Perfect drape for Eid and ceremonies',
          comment: 'The jet black color does not fade and the fabric has a subtle silk shimmer that looks phenomenal under lights.',
          status: 'approved',
          createdAt: '2026-02-20T10:00:00Z',
        },
      ],
      contactMessages: [
        {
          id: 'msg_1',
          name: 'Nabil Hasan',
          email: 'nabil@example.com',
          phone: '01719998877',
          subject: 'Custom Sizing Inquiry for Panjabi',
          message: 'Can I request a custom length for the Royal Heritage Panjabi? My height is 6ft 2in.',
          isRead: false,
          createdAt: '2026-03-05T11:20:00Z',
        },
      ],
      inventoryLogs: [
        {
          id: 'log_01',
          productId: 'prod_shirt_01',
          productName: 'Premium Black Full Sleeve Shirt',
          type: 'sale',
          quantityChange: -1,
          previousStock: 43,
          newStock: 42,
          reason: 'Order #RICH-2026-00001 placed',
          timestamp: '2026-03-01T14:20:00Z',
        },
      ],
      customers: [
        {
          id: 'cust_01',
          name: 'Tanvir Ahmed',
          phone: '01711223344',
          email: 'tanvir.ahmed@gmail.com',
          passwordHash: 'Pass1234',
          savedAddress: {
            customerName: 'Tanvir Ahmed',
            phone: '01711223344',
            email: 'tanvir.ahmed@gmail.com',
            division: 'Dhaka',
            district: 'Dhaka',
            area: 'Banani',
            fullAddress: 'Flat 4A, Road 11, Block D, Banani',
            postCode: '1213',
          },
          createdAt: '2026-02-01T10:00:00Z',
        },
      ],
    };

    this.save(initial);
    return initial;
  }

  private save(data: DatabaseSchema = this.db) {
    try {
      this.ensureDirectory();
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error saving database to file:', err);
    }
  }

  // --- Admin Auth ---
  getAdmin() {
    return {
      id: this.db.admin.id,
      username: this.db.admin.username,
      email: this.db.admin.email,
      role: this.db.admin.role,
      createdAt: this.db.admin.createdAt,
    };
  }

  verifyAdminCredentials(username: string, passwordAttempt: string): boolean {
    const adminUser = this.db.admin.username.trim().toLowerCase();
    const inputUser = username.trim().toLowerCase();
    if (adminUser !== inputUser) return false;
    return this.db.admin.passwordHash === passwordAttempt;
  }

  updateAdminPassword(currentPass: string, newPass: string): boolean {
    if (this.db.admin.passwordHash !== currentPass) {
      return false;
    }
    this.db.admin.passwordHash = newPass;
    this.save();
    return true;
  }

  updateAdminProfile(data: { username?: string; email?: string }) {
    if (data.username) this.db.admin.username = data.username;
    if (data.email) this.db.admin.email = data.email;
    this.save();
    return this.getAdmin();
  }

  // --- Site Settings ---
  getSettings(): SiteSettings {
    return this.db.settings;
  }

  updateSettings(partial: Partial<SiteSettings>): SiteSettings {
    this.db.settings = { ...this.db.settings, ...partial };
    this.save();
    return this.db.settings;
  }

  // --- Categories ---
  getCategories(): CategoryItem[] {
    return this.db.categories.sort((a, b) => a.order - b.order);
  }

  getCategory(idOrSlug: string): CategoryItem | undefined {
    return this.db.categories.find((c) => c.id === idOrSlug || c.slug === idOrSlug);
  }

  createCategory(category: Omit<CategoryItem, 'id'>): CategoryItem {
    const newCat: CategoryItem = {
      ...category,
      id: `cat_${Date.now()}`,
    };
    this.db.categories.push(newCat);
    this.save();
    return newCat;
  }

  updateCategory(id: string, updates: Partial<CategoryItem>): CategoryItem | null {
    const idx = this.db.categories.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    this.db.categories[idx] = { ...this.db.categories[idx], ...updates };
    this.save();
    return this.db.categories[idx];
  }

  deleteCategory(id: string): boolean {
    const initialLen = this.db.categories.length;
    this.db.categories = this.db.categories.filter((c) => c.id !== id);
    if (this.db.categories.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  // --- Collections ---
  getCollections(): CollectionItem[] {
    return this.db.collections;
  }

  createCollection(col: Omit<CollectionItem, 'id'>): CollectionItem {
    const newCol: CollectionItem = {
      ...col,
      id: `col_${Date.now()}`,
    };
    this.db.collections.push(newCol);
    this.save();
    return newCol;
  }

  updateCollection(id: string, updates: Partial<CollectionItem>): CollectionItem | null {
    const idx = this.db.collections.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    this.db.collections[idx] = { ...this.db.collections[idx], ...updates };
    this.save();
    return this.db.collections[idx];
  }

  deleteCollection(id: string): boolean {
    const initialLen = this.db.collections.length;
    this.db.collections = this.db.collections.filter((c) => c.id !== id);
    if (this.db.collections.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  // --- Products ---
  getProducts(params?: {
    category?: string;
    collection?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    size?: string;
    color?: string;
    inStockOnly?: boolean;
    sort?: string;
    status?: string;
    isFeatured?: boolean;
    isSale?: boolean;
    isNewArrival?: boolean;
    isBestSeller?: boolean;
    page?: number;
    limit?: number;
  }): { products: Product[]; total: number; page: number; totalPages: number } {
    let result = [...this.db.products];

    // Filter by status (unless admin requests all)
    if (params?.status) {
      result = result.filter((p) => p.status === params.status);
    } else {
      result = result.filter((p) => p.status === 'published');
    }

    // Category filter
    if (params?.category && params.category !== 'All') {
      const catLower = params.category.toLowerCase();
      if (catLower.includes('rich people') || catLower.includes('exclusive')) {
        result = result.filter(
          (p) =>
            p.category.toLowerCase().includes('exclusive') ||
            p.category.toLowerCase().includes('rich') ||
            p.tags.some((t) => ['exclusive', 'luxury', 'best seller', 'eid'].includes(t.toLowerCase())) ||
            p.price >= 2400
        );
      } else {
        result = result.filter(
          (p) =>
            p.category.toLowerCase() === catLower ||
            p.category.toLowerCase().includes(catLower)
        );
      }
    }

    // Collection filter
    if (params?.collection) {
      const colLower = params.collection.toLowerCase();
      result = result.filter((p) => p.collection.toLowerCase().includes(colLower));
    }

    // Flags
    if (params?.isFeatured) result = result.filter((p) => p.isFeatured);
    if (params?.isSale) result = result.filter((p) => p.isSale || (p.compareAtPrice && p.compareAtPrice > p.price));
    if (params?.isNewArrival) result = result.filter((p) => p.isNewArrival);
    if (params?.isBestSeller) result = result.filter((p) => p.isBestSeller);

    // Stock
    if (params?.inStockOnly) {
      result = result.filter((p) => p.stockQuantity > 0);
    }

    // Price
    if (params?.minPrice !== undefined) {
      result = result.filter((p) => p.price >= params.minPrice!);
    }
    if (params?.maxPrice !== undefined) {
      result = result.filter((p) => p.price <= params.maxPrice!);
    }

    // Size
    if (params?.size) {
      result = result.filter((p) => p.sizes.includes(params.size as any));
    }

    // Search query
    if (params?.search && params.search.trim()) {
      const q = params.search.trim().toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.fabric.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Sorting
    const sort = params?.sort || 'featured';
    switch (sort) {
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'price_asc':
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'best_selling':
      case 'best-selling':
        result.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
        break;
      case 'rating':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'featured':
      default:
        result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
        break;
    }

    const total = result.length;
    const page = Math.max(1, params?.page || 1);
    const limit = params?.limit || 50;
    const startIndex = (page - 1) * limit;
    const paginated = result.slice(startIndex, startIndex + limit);

    return {
      products: paginated,
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  getProductById(id: string): Product | undefined {
    return this.db.products.find((p) => p.id === id);
  }

  getProductBySlug(slug: string): Product | undefined {
    return this.db.products.find((p) => p.slug === slug);
  }

  createProduct(data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Product {
    const slug =
      data.slug ||
      data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

    const newProd: Product = {
      ...data,
      id: `prod_${Date.now()}`,
      slug,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.db.products.unshift(newProd);

    // Log initial inventory
    this.addInventoryLog({
      productId: newProd.id,
      productName: newProd.name,
      type: 'restock',
      quantityChange: newProd.stockQuantity,
      previousStock: 0,
      newStock: newProd.stockQuantity,
      reason: 'Product created with initial stock',
    });

    this.save();
    return newProd;
  }

  updateProduct(id: string, updates: Partial<Product>): Product | null {
    const idx = this.db.products.findIndex((p) => p.id === id);
    if (idx === -1) return null;

    const oldProduct = this.db.products[idx];

    // Check if stock changed directly
    if (updates.stockQuantity !== undefined && updates.stockQuantity !== oldProduct.stockQuantity) {
      const diff = updates.stockQuantity - oldProduct.stockQuantity;
      this.addInventoryLog({
        productId: oldProduct.id,
        productName: oldProduct.name,
        type: 'manual_adjustment',
        quantityChange: diff,
        previousStock: oldProduct.stockQuantity,
        newStock: updates.stockQuantity,
        reason: 'Manual stock update from admin',
      });
    }

    const updated: Product = {
      ...oldProduct,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.db.products[idx] = updated;
    this.save();
    return updated;
  }

  deleteProduct(id: string): boolean {
    const initialLen = this.db.products.length;
    this.db.products = this.db.products.filter((p) => p.id !== id);
    if (this.db.products.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  duplicateProduct(id: string): Product | null {
    const prod = this.getProductById(id);
    if (!prod) return null;

    const copy: Product = {
      ...prod,
      id: `prod_${Date.now()}`,
      name: `${prod.name} (Copy)`,
      slug: `${prod.slug}-copy-${Math.floor(Math.random() * 1000)}`,
      sku: `${prod.sku}-CPY`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.db.products.unshift(copy);
    this.save();
    return copy;
  }

  // --- Coupons ---
  getCoupons(): Coupon[] {
    return this.db.coupons;
  }

  createCoupon(coupon: Omit<Coupon, 'id' | 'usedCount'>): Coupon {
    const newCoupon: Coupon = {
      ...coupon,
      id: `cpn_${Date.now()}`,
      code: coupon.code.toUpperCase().trim(),
      usedCount: 0,
    };
    this.db.coupons.push(newCoupon);
    this.save();
    return newCoupon;
  }

  updateCoupon(id: string, updates: Partial<Coupon>): Coupon | null {
    const idx = this.db.coupons.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    this.db.coupons[idx] = { ...this.db.coupons[idx], ...updates };
    this.save();
    return this.db.coupons[idx];
  }

  deleteCoupon(id: string): boolean {
    const initialLen = this.db.coupons.length;
    this.db.coupons = this.db.coupons.filter((c) => c.id !== id);
    if (this.db.coupons.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  validateCoupon(code: string, subtotal: number): { valid: boolean; discount: number; message: string; coupon?: Coupon } {
    const coupon = this.db.coupons.find((c) => c.code.toUpperCase() === code.toUpperCase().trim());
    if (!coupon) {
      return { valid: false, discount: 0, message: 'Invalid coupon code.' };
    }
    if (!coupon.isActive) {
      return { valid: false, discount: 0, message: 'This coupon is no longer active.' };
    }

    const today = new Date().toISOString().split('T')[0];
    if (coupon.startDate && today < coupon.startDate) {
      return { valid: false, discount: 0, message: 'This coupon has not started yet.' };
    }
    if (coupon.endDate && today > coupon.endDate) {
      return { valid: false, discount: 0, message: 'This coupon has expired.' };
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return { valid: false, discount: 0, message: 'This coupon has reached its usage limit.' };
    }

    if (subtotal < coupon.minOrderAmount) {
      return {
        valid: false,
        discount: 0,
        message: `Minimum order amount of ৳${coupon.minOrderAmount} required for this coupon.`,
      };
    }

    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = Math.round((subtotal * coupon.discountAmount) / 100);
      if (coupon.maxDiscountAmount && discount > coupon.maxDiscountAmount) {
        discount = coupon.maxDiscountAmount;
      }
    } else {
      discount = coupon.discountAmount;
    }

    return {
      valid: true,
      discount: Math.min(discount, subtotal),
      message: `Coupon applied: ৳${discount} saved!`,
      coupon,
    };
  }

  // --- Offers ---
  getOffers(): Offer[] {
    return this.db.offers;
  }

  createOffer(offer: Omit<Offer, 'id'>): Offer {
    const newOffer: Offer = {
      ...offer,
      id: `off_${Date.now()}`,
    };
    this.db.offers.push(newOffer);
    this.save();
    return newOffer;
  }

  updateOffer(id: string, updates: Partial<Offer>): Offer | null {
    const idx = this.db.offers.findIndex((o) => o.id === id);
    if (idx === -1) return null;
    this.db.offers[idx] = { ...this.db.offers[idx], ...updates };
    this.save();
    return this.db.offers[idx];
  }

  deleteOffer(id: string): boolean {
    const initialLen = this.db.offers.length;
    this.db.offers = this.db.offers.filter((o) => o.id !== id);
    if (this.db.offers.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  // --- Orders ---
  getOrders(params?: {
    status?: string;
    paymentStatus?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): { orders: Order[]; total: number; page: number; totalPages: number } {
    let result = [...this.db.orders];

    if (params?.status && params.status !== 'ALL') {
      result = result.filter((o) => o.orderStatus === params.status);
    }

    if (params?.paymentStatus && params.paymentStatus !== 'ALL') {
      result = result.filter((o) => o.paymentStatus === params.paymentStatus);
    }

    if (params?.search && params.search.trim()) {
      const q = params.search.trim().toLowerCase();
      result = result.filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.customerPhone.includes(q) ||
          o.transactionId.toLowerCase().includes(q)
      );
    }

    // Sort by latest order
    result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const total = result.length;
    const page = Math.max(1, params?.page || 1);
    const limit = params?.limit || 20;
    const startIndex = (page - 1) * limit;

    return {
      orders: result.slice(startIndex, startIndex + limit),
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  getOrderById(id: string): Order | undefined {
    return this.db.orders.find((o) => o.id.toUpperCase() === id.toUpperCase().trim());
  }

  trackOrder(orderId: string, phone: string): Order | undefined {
    const cleanId = orderId.toUpperCase().trim();
    const cleanPhone = phone.trim().replace(/[^0-9]/g, '');
    return this.db.orders.find(
      (o) =>
        o.id.toUpperCase() === cleanId &&
        o.customerPhone.replace(/[^0-9]/g, '').endsWith(cleanPhone.slice(-10))
    );
  }

  createOrder(orderData: {
    customerId?: string;
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    shippingAddress: any;
    deliveryMethod: 'Inside Dhaka' | 'Outside Dhaka';
    items: { productId: string; size: any; color: string; quantity: number }[];
    couponCode?: string;
    paymentMethod: 'bKash' | 'Nagad';
    transactionId: string;
    senderPhone: string;
    paymentScreenshot?: string;
  }): { success: boolean; order?: Order; error?: string } {
    // 1. Verify items & calculate true server subtotal
    const verifiedItems: any[] = [];
    let subtotal = 0;

    for (const item of orderData.items) {
      const product = this.getProductById(item.productId);
      if (!product) {
        return { success: false, error: `Product not found: ${item.productId}` };
      }
      if (product.stockQuantity < item.quantity) {
        return {
          success: false,
          error: `Insufficient stock for "${product.name}". Only ${product.stockQuantity} left.`,
        };
      }
      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;
      verifiedItems.push({
        productId: product.id,
        name: product.name,
        slug: product.slug,
        image: product.featuredImage || product.images[0],
        size: item.size,
        color: item.color,
        price: product.price,
        quantity: item.quantity,
        total: itemTotal,
      });
    }

    // 2. Shipping calculation
    const isFreeShipping = subtotal >= this.db.settings.freeShippingThreshold;
    const shippingCharge = isFreeShipping
      ? 0
      : orderData.deliveryMethod === 'Inside Dhaka'
      ? this.db.settings.shippingChargeInsideDhaka
      : this.db.settings.shippingChargeOutsideDhaka;

    // 3. Coupon discount
    let discountAmount = 0;
    if (orderData.couponCode) {
      const couponCheck = this.validateCoupon(orderData.couponCode, subtotal);
      if (couponCheck.valid) {
        discountAmount = couponCheck.discount;
        // increment coupon usage
        const cpn = this.db.coupons.find((c) => c.code.toUpperCase() === orderData.couponCode!.toUpperCase());
        if (cpn) cpn.usedCount += 1;
      }
    }

    // 4. Totals and Advance calculation
    const grandTotal = Math.max(0, subtotal - discountAmount + shippingCharge);
    const advancePaid = this.db.settings.advancePaymentAmount || 200;
    const remainingCOD = Math.max(0, grandTotal - advancePaid);

    // 5. Generate Order ID
    const nextSeq = this.db.orders.length + 1;
    const orderId = `RICH-2026-${String(nextSeq).padStart(5, '0')}`;

    const newOrder: Order = {
      id: orderId,
      customerId: orderData.customerId,
      customerName: orderData.customerName,
      customerPhone: orderData.customerPhone,
      customerEmail: orderData.customerEmail,
      shippingAddress: orderData.shippingAddress,
      deliveryMethod: orderData.deliveryMethod,
      items: verifiedItems,
      subtotal,
      shippingCharge,
      discountAmount,
      couponCode: orderData.couponCode,
      grandTotal,
      advancePaid,
      remainingCOD,
      paymentMethod: orderData.paymentMethod,
      transactionId: orderData.transactionId.trim(),
      senderPhone: orderData.senderPhone.trim(),
      paymentScreenshot: orderData.paymentScreenshot,
      paymentStatus: 'PENDING_VERIFICATION',
      orderStatus: 'PAYMENT_UNDER_REVIEW',
      statusHistory: [
        {
          status: 'PAYMENT_UNDER_REVIEW',
          timestamp: new Date().toISOString(),
          note: `Order submitted with ${orderData.paymentMethod} advance ৳${advancePaid}. TrxID: ${orderData.transactionId}`,
        },
      ],
      adminNotes: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.db.orders.unshift(newOrder);

    // Decrement stock tentatively or upon placement
    for (const item of verifiedItems) {
      const p = this.getProductById(item.productId);
      if (p) {
        const oldStock = p.stockQuantity;
        p.stockQuantity = Math.max(0, p.stockQuantity - item.quantity);
        this.addInventoryLog({
          productId: p.id,
          productName: p.name,
          type: 'sale',
          quantityChange: -item.quantity,
          previousStock: oldStock,
          newStock: p.stockQuantity,
          reason: `Reserved for Order #${orderId}`,
        });
      }
    }

    this.save();
    return { success: true, order: newOrder };
  }

  updateOrderStatus(orderId: string, newStatus: OrderStatus, note?: string): Order | null {
    const order = this.getOrderById(orderId);
    if (!order) return null;

    const previousStatus = order.orderStatus;
    order.orderStatus = newStatus;
    order.updatedAt = new Date().toISOString();

    order.statusHistory.push({
      status: newStatus,
      timestamp: new Date().toISOString(),
      note: note || `Order status updated to ${newStatus}`,
    });

    // If cancelled, restore inventory
    if (newStatus === 'CANCELLED' && previousStatus !== 'CANCELLED') {
      for (const item of order.items) {
        const prod = this.getProductById(item.productId);
        if (prod) {
          const oldStock = prod.stockQuantity;
          prod.stockQuantity += item.quantity;
          this.addInventoryLog({
            productId: prod.id,
            productName: prod.name,
            type: 'cancellation_restock',
            quantityChange: item.quantity,
            previousStock: oldStock,
            newStock: prod.stockQuantity,
            reason: `Restocked after Order #${orderId} was cancelled`,
          });
        }
      }
    }

    this.save();
    return order;
  }

  updateOrderPayment(
    orderId: string,
    action: 'APPROVE' | 'REJECT' | 'REQUEST_NEW_TRX',
    adminNote?: string
  ): Order | null {
    const order = this.getOrderById(orderId);
    if (!order) return null;

    if (action === 'APPROVE') {
      order.paymentStatus = 'PAID';
      order.orderStatus = 'CONFIRMED';
      order.statusHistory.push({
        status: 'CONFIRMED',
        timestamp: new Date().toISOString(),
        note: adminNote || `Payment verified and approved via ${order.paymentMethod}`,
      });
    } else if (action === 'REJECT') {
      order.paymentStatus = 'REJECTED';
      order.statusHistory.push({
        status: order.orderStatus,
        timestamp: new Date().toISOString(),
        note: adminNote || 'Payment was rejected. Transaction ID could not be verified.',
      });
    } else if (action === 'REQUEST_NEW_TRX') {
      order.paymentStatus = 'PENDING_VERIFICATION';
      order.statusHistory.push({
        status: order.orderStatus,
        timestamp: new Date().toISOString(),
        note: adminNote || 'Admin requested a valid or corrected Transaction ID.',
      });
    }

    if (adminNote) {
      order.adminNotes = order.adminNotes || [];
      order.adminNotes.push(adminNote);
    }

    order.updatedAt = new Date().toISOString();
    this.save();
    return order;
  }

  updateCustomerTransaction(
    orderId: string,
    phone: string,
    trxData: { transactionId: string; senderPhone: string; paymentMethod: 'bKash' | 'Nagad'; screenshot?: string }
  ): { success: boolean; order?: Order; error?: string } {
    const order = this.trackOrder(orderId, phone);
    if (!order) return { success: false, error: 'Order not found' };

    order.transactionId = trxData.transactionId.trim();
    order.senderPhone = trxData.senderPhone.trim();
    order.paymentMethod = trxData.paymentMethod;
    if (trxData.screenshot) order.paymentScreenshot = trxData.screenshot;

    order.paymentStatus = 'PENDING_VERIFICATION';
    order.orderStatus = 'PAYMENT_UNDER_REVIEW';

    order.statusHistory.push({
      status: 'PAYMENT_UNDER_REVIEW',
      timestamp: new Date().toISOString(),
      note: `Customer updated transaction details: ${trxData.paymentMethod} TrxID: ${trxData.transactionId}`,
    });

    order.updatedAt = new Date().toISOString();
    this.save();
    return { success: true, order };
  }

  addOrderAdminNote(orderId: string, note: string): Order | null {
    const order = this.getOrderById(orderId);
    if (!order) return null;
    order.adminNotes = order.adminNotes || [];
    order.adminNotes.push(note);
    this.save();
    return order;
  }

  // --- Reviews ---
  getReviews(productId?: string): Review[] {
    if (productId) {
      return this.db.reviews.filter((r) => r.productId === productId && r.status === 'approved');
    }
    return this.db.reviews;
  }

  createReview(review: Omit<Review, 'id' | 'status' | 'createdAt'>): Review {
    const newRev: Review = {
      ...review,
      id: `rev_${Date.now()}`,
      status: 'pending', // awaits admin moderation
      createdAt: new Date().toISOString(),
    };
    this.db.reviews.unshift(newRev);
    this.save();
    return newRev;
  }

  updateReviewStatus(id: string, status: 'approved' | 'rejected'): Review | null {
    const rev = this.db.reviews.find((r) => r.id === id);
    if (!rev) return null;
    rev.status = status;
    this.save();
    return rev;
  }

  deleteReview(id: string): boolean {
    const initialLen = this.db.reviews.length;
    this.db.reviews = this.db.reviews.filter((r) => r.id !== id);
    if (this.db.reviews.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  // --- Contact Messages ---
  getContactMessages(): ContactMessage[] {
    return this.db.contactMessages;
  }

  createContactMessage(msg: Omit<ContactMessage, 'id' | 'isRead' | 'createdAt'>): ContactMessage {
    const newMsg: ContactMessage = {
      ...msg,
      id: `msg_${Date.now()}`,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    this.db.contactMessages.unshift(newMsg);
    this.save();
    return newMsg;
  }

  markContactMessageRead(id: string): boolean {
    const msg = this.db.contactMessages.find((m) => m.id === id);
    if (!msg) return false;
    msg.isRead = true;
    this.save();
    return true;
  }

  // --- Inventory Logs ---
  getInventoryLogs(): InventoryLog[] {
    return this.db.inventoryLogs.slice(0, 100);
  }

  private addInventoryLog(log: Omit<InventoryLog, 'id' | 'timestamp'>) {
    const newLog: InventoryLog = {
      ...log,
      id: `inv_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
    };
    this.db.inventoryLogs.unshift(newLog);
    if (this.db.inventoryLogs.length > 300) {
      this.db.inventoryLogs = this.db.inventoryLogs.slice(0, 300);
    }
  }

  // --- Customers ---
  getCustomerOrders(phoneOrEmail: string): Order[] {
    const clean = phoneOrEmail.trim().toLowerCase();
    return this.db.orders.filter(
      (o) =>
        o.customerEmail.toLowerCase() === clean ||
        o.customerPhone.replace(/[^0-9]/g, '').endsWith(clean.replace(/[^0-9]/g, '').slice(-10))
    );
  }

  getCustomersList(): CustomerUser[] {
    // Distinct customers synthesized from registered customers and orders
    const map = new Map<string, CustomerUser>();
    for (const c of this.db.customers) {
      map.set(c.phone, {
        id: c.id,
        name: c.name,
        phone: c.phone,
        email: c.email,
        savedAddress: c.savedAddress,
        createdAt: c.createdAt,
      });
    }

    for (const o of this.db.orders) {
      if (!map.has(o.customerPhone)) {
        map.set(o.customerPhone, {
          id: `cust_${o.customerPhone}`,
          name: o.customerName,
          phone: o.customerPhone,
          email: o.customerEmail,
          savedAddress: o.shippingAddress,
          createdAt: o.createdAt,
        });
      }
    }

    return Array.from(map.values());
  }

  // --- Dashboard & Reports ---
  getDashboardStats() {
    const orders = this.db.orders;
    const totalSales = orders
      .filter((o) => o.paymentStatus === 'PAID' || o.orderStatus === 'DELIVERED')
      .reduce((sum, o) => sum + o.grandTotal, 0);

    const todayStr = new Date().toISOString().split('T')[0];
    const todaySales = orders
      .filter(
        (o) =>
          o.createdAt.startsWith(todayStr) &&
          (o.paymentStatus === 'PAID' || o.orderStatus === 'CONFIRMED' || o.orderStatus === 'DELIVERED')
      )
      .reduce((sum, o) => sum + o.grandTotal, 0);

    const pendingOrders = orders.filter((o) => o.orderStatus === 'PAYMENT_UNDER_REVIEW' || o.orderStatus === 'PENDING_PAYMENT').length;
    const pendingPayments = orders.filter((o) => o.paymentStatus === 'PENDING_VERIFICATION').length;
    const lowStockProducts = this.db.products.filter((p) => p.stockQuantity <= p.lowStockThreshold);

    // Sales by Category
    const categorySales: Record<string, number> = {};
    for (const o of orders) {
      for (const item of o.items) {
        const prod = this.getProductById(item.productId);
        const cat = prod?.category || 'Uncategorized';
        categorySales[cat] = (categorySales[cat] || 0) + item.total;
      }
    }

    // Top Products
    const productSalesMap = new Map<string, { id: string; name: string; count: number; revenue: number; image: string }>();
    for (const o of orders) {
      for (const item of o.items) {
        const existing = productSalesMap.get(item.productId) || {
          id: item.productId,
          name: item.name,
          count: 0,
          revenue: 0,
          image: item.image,
        };
        existing.count += item.quantity;
        existing.revenue += item.total;
        productSalesMap.set(item.productId, existing);
      }
    }

    const topProducts = Array.from(productSalesMap.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    return {
      totalSales,
      todaySales,
      totalOrders: orders.length,
      pendingOrders,
      pendingPayments,
      totalProducts: this.db.products.length,
      lowStockCount: lowStockProducts.length,
      totalCustomers: this.getCustomersList().length,
      categorySales,
      topProducts,
      recentOrders: orders.slice(0, 6),
      lowStockProducts: lowStockProducts.slice(0, 6),
    };
  }

  generateOrdersCSV(): string {
    const headers = [
      'Order ID',
      'Customer Name',
      'Phone',
      'Email',
      'Items',
      'Subtotal',
      'Shipping Charge',
      'Discount',
      'Grand Total',
      'Advance Paid',
      'Remaining COD',
      'Payment Method',
      'Transaction ID',
      'Payment Status',
      'Order Status',
      'Date',
    ];

    const rows = this.db.orders.map((o) => [
      o.id,
      `"${o.customerName}"`,
      o.customerPhone,
      o.customerEmail,
      `"${o.items.map((i) => `${i.name} (x${i.quantity})`).join(', ')}"`,
      o.subtotal,
      o.shippingCharge,
      o.discountAmount,
      o.grandTotal,
      o.advancePaid,
      o.remainingCOD,
      o.paymentMethod,
      o.transactionId,
      o.paymentStatus,
      o.orderStatus,
      o.createdAt,
    ]);

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  }
}

export const db = new DatabaseService();
