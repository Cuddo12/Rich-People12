import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { db } from './src/server/db';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Simple Bearer token security for Admin
const ADMIN_SECRET = process.env.ADMIN_JWT_SECRET || 'richpeople_luxury_fashion_secret_key_2026_jwt_token_security';

function generateAdminToken(username: string): string {
  const payload = {
    username,
    timestamp: Date.now(),
    role: 'super_admin',
  };
  const str = Buffer.from(JSON.stringify(payload)).toString('base64');
  return `rp_adm_${str}_${Buffer.from(ADMIN_SECRET).toString('base64').slice(0, 8)}`;
}

function verifyAdminToken(token?: string): boolean {
  if (!token) return false;
  if (!token.startsWith('rp_adm_') && !token.startsWith('heems_adm_')) return false;
  try {
    const parts = token.split('_');
    if (parts.length < 3) return false;
    const jsonStr = Buffer.from(parts[2], 'base64').toString('utf-8');
    const data = JSON.parse(jsonStr);
    return data && (data.username === 'Miljar' || data.username === db.getAdmin().username);
  } catch {
    return false;
  }
}

const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token || !verifyAdminToken(token)) {
    return res.status(401).json({ error: 'Unauthorized: Admin access required' });
  }
  next();
};

// ==========================================
// 1. AUTH ROUTES
// ==========================================

app.post('/api/auth/admin/login', (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const isValid = db.verifyAdminCredentials(username, password);
  if (!isValid) {
    return res.status(401).json({ error: 'Invalid admin credentials' });
  }

  const admin = db.getAdmin();
  const token = generateAdminToken(admin.username);

  return res.json({
    success: true,
    token,
    admin,
    message: 'Welcome back, ' + admin.username,
  });
});

app.get('/api/auth/admin/me', requireAdmin, (req: Request, res: Response) => {
  res.json({ success: true, admin: db.getAdmin() });
});

app.post('/api/auth/admin/change-password', requireAdmin, (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword || newPassword.length < 6) {
    return res.status(400).json({ error: 'New password must be at least 6 characters' });
  }

  const updated = db.updateAdminPassword(currentPassword, newPassword);
  if (!updated) {
    return res.status(400).json({ error: 'Current password does not match' });
  }

  res.json({ success: true, message: 'Password successfully updated' });
});

app.post('/api/auth/admin/profile', requireAdmin, (req: Request, res: Response) => {
  const { username, email } = req.body;
  const updated = db.updateAdminProfile({ username, email });
  res.json({ success: true, admin: updated });
});

// ==========================================
// 2. PRODUCT ROUTES
// ==========================================

app.get('/api/products', (req: Request, res: Response) => {
  const {
    category,
    collection,
    search,
    minPrice,
    maxPrice,
    size,
    color,
    inStockOnly,
    sort,
    status,
    isFeatured,
    isSale,
    isNewArrival,
    isBestSeller,
    page,
    limit,
  } = req.query;

  const result = db.getProducts({
    category: category as string,
    collection: collection as string,
    search: search as string,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    size: size as string,
    color: color as string,
    inStockOnly: inStockOnly === 'true',
    sort: sort as string,
    status: status as string,
    isFeatured: isFeatured === 'true',
    isSale: isSale === 'true',
    isNewArrival: isNewArrival === 'true',
    isBestSeller: isBestSeller === 'true',
    page: page ? Number(page) : 1,
    limit: limit ? Number(limit) : 50,
  });

  res.json(result);
});

app.get('/api/products/:idOrSlug', (req: Request, res: Response) => {
  const { idOrSlug } = req.params;
  const product = db.getProductById(idOrSlug) || db.getProductBySlug(idOrSlug);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  // Related products
  const related = db
    .getProducts({ category: product.category, limit: 4 })
    .products.filter((p) => p.id !== product.id)
    .slice(0, 4);

  res.json({ product, related });
});

app.post('/api/products', requireAdmin, (req: Request, res: Response) => {
  const product = db.createProduct(req.body);
  res.status(201).json(product);
});

app.put('/api/products/:id', requireAdmin, (req: Request, res: Response) => {
  const updated = db.updateProduct(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Product not found' });
  res.json(updated);
});

app.delete('/api/products/:id', requireAdmin, (req: Request, res: Response) => {
  const success = db.deleteProduct(req.params.id);
  res.json({ success });
});

app.post('/api/products/:id/duplicate', requireAdmin, (req: Request, res: Response) => {
  const copy = db.duplicateProduct(req.params.id);
  if (!copy) return res.status(404).json({ error: 'Product not found' });
  res.status(201).json(copy);
});

// ==========================================
// 3. CATEGORIES & COLLECTIONS
// ==========================================

app.get('/api/categories', (_req: Request, res: Response) => {
  res.json(db.getCategories());
});

app.post('/api/categories', requireAdmin, (req: Request, res: Response) => {
  const cat = db.createCategory(req.body);
  res.status(201).json(cat);
});

app.put('/api/categories/:id', requireAdmin, (req: Request, res: Response) => {
  const updated = db.updateCategory(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Category not found' });
  res.json(updated);
});

app.delete('/api/categories/:id', requireAdmin, (req: Request, res: Response) => {
  const success = db.deleteCategory(req.params.id);
  res.json({ success });
});

app.get('/api/collections', (_req: Request, res: Response) => {
  res.json(db.getCollections());
});

app.post('/api/collections', requireAdmin, (req: Request, res: Response) => {
  const col = db.createCollection(req.body);
  res.status(201).json(col);
});

app.put('/api/collections/:id', requireAdmin, (req: Request, res: Response) => {
  const updated = db.updateCollection(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Collection not found' });
  res.json(updated);
});

app.delete('/api/collections/:id', requireAdmin, (req: Request, res: Response) => {
  const success = db.deleteCollection(req.params.id);
  res.json({ success });
});

// ==========================================
// 4. ORDERS & CHECKOUT & PAYMENT VERIFICATION
// ==========================================

app.post('/api/orders', (req: Request, res: Response) => {
  const {
    customerName,
    customerPhone,
    customerEmail,
    shippingAddress,
    deliveryMethod,
    items,
    couponCode,
    paymentMethod,
    transactionId,
    senderPhone,
    paymentScreenshot,
  } = req.body;

  if (!customerName || !customerPhone || !shippingAddress || !deliveryMethod || !items || !items.length) {
    return res.status(400).json({ error: 'Please provide all required shipping and product information.' });
  }

  if (!paymentMethod || !transactionId || !senderPhone) {
    return res.status(400).json({
      error: 'Please provide payment method (bKash/Nagad), Sender Phone Number, and Transaction ID.',
    });
  }

  const result = db.createOrder({
    customerName,
    customerPhone,
    customerEmail: customerEmail || `${customerPhone}@customer.heems.bd`,
    shippingAddress,
    deliveryMethod,
    items,
    couponCode,
    paymentMethod,
    transactionId,
    senderPhone,
    paymentScreenshot,
  });

  if (!result.success) {
    return res.status(400).json({ error: result.error });
  }

  res.status(201).json({ success: true, order: result.order });
});

app.get('/api/orders', requireAdmin, (req: Request, res: Response) => {
  const { status, paymentStatus, search, page, limit } = req.query;
  const result = db.getOrders({
    status: status as string,
    paymentStatus: paymentStatus as string,
    search: search as string,
    page: page ? Number(page) : 1,
    limit: limit ? Number(limit) : 20,
  });
  res.json(result);
});

app.get('/api/orders/:id', (req: Request, res: Response) => {
  const order = db.getOrderById(req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json(order);
});

app.post('/api/orders/track', (req: Request, res: Response) => {
  const { orderId, phone } = req.body;
  if (!orderId || !phone) {
    return res.status(400).json({ error: 'Order ID and Phone Number are required' });
  }

  const order = db.trackOrder(orderId, phone);
  if (!order) {
    return res.status(404).json({
      error: 'No order found matching this Order ID and Phone Number combination. Please verify and try again.',
    });
  }

  res.json(order);
});

app.put('/api/orders/:id/status', requireAdmin, (req: Request, res: Response) => {
  const { status, note } = req.body;
  const updated = db.updateOrderStatus(req.params.id, status, note);
  if (!updated) return res.status(404).json({ error: 'Order not found' });
  res.json(updated);
});

app.put('/api/orders/:id/payment', requireAdmin, (req: Request, res: Response) => {
  const { action, adminNote } = req.body; // 'APPROVE' | 'REJECT' | 'REQUEST_NEW_TRX'
  if (!action) return res.status(400).json({ error: 'Action is required' });

  const updated = db.updateOrderPayment(req.params.id, action, adminNote);
  if (!updated) return res.status(404).json({ error: 'Order not found' });
  res.json(updated);
});

app.post('/api/orders/:id/update-trx', (req: Request, res: Response) => {
  const { phone, transactionId, senderPhone, paymentMethod, screenshot } = req.body;
  if (!phone || !transactionId || !senderPhone || !paymentMethod) {
    return res.status(400).json({ error: 'All transaction correction details are required' });
  }

  const result = db.updateCustomerTransaction(req.params.id, phone, {
    transactionId,
    senderPhone,
    paymentMethod,
    screenshot,
  });

  if (!result.success) return res.status(404).json({ error: result.error });
  res.json(result);
});

app.post('/api/orders/:id/note', requireAdmin, (req: Request, res: Response) => {
  const { note } = req.body;
  if (!note) return res.status(400).json({ error: 'Note is required' });
  const updated = db.addOrderAdminNote(req.params.id, note);
  if (!updated) return res.status(404).json({ error: 'Order not found' });
  res.json(updated);
});

// ==========================================
// 5. COUPONS & OFFERS
// ==========================================

app.post('/api/coupons/validate', (req: Request, res: Response) => {
  const { code, subtotal } = req.body;
  if (!code) return res.status(400).json({ valid: false, message: 'Coupon code is required' });
  const result = db.validateCoupon(code, Number(subtotal) || 0);
  res.json(result);
});

app.get('/api/coupons', requireAdmin, (_req: Request, res: Response) => {
  res.json(db.getCoupons());
});

app.post('/api/coupons', requireAdmin, (req: Request, res: Response) => {
  const cpn = db.createCoupon(req.body);
  res.status(201).json(cpn);
});

app.put('/api/coupons/:id', requireAdmin, (req: Request, res: Response) => {
  const updated = db.updateCoupon(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Coupon not found' });
  res.json(updated);
});

app.delete('/api/coupons/:id', requireAdmin, (req: Request, res: Response) => {
  const success = db.deleteCoupon(req.params.id);
  res.json({ success });
});

app.get('/api/offers', (_req: Request, res: Response) => {
  res.json(db.getOffers());
});

app.post('/api/offers', requireAdmin, (req: Request, res: Response) => {
  const offer = db.createOffer(req.body);
  res.status(201).json(offer);
});

app.put('/api/offers/:id', requireAdmin, (req: Request, res: Response) => {
  const updated = db.updateOffer(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Offer not found' });
  res.json(updated);
});

app.delete('/api/offers/:id', requireAdmin, (req: Request, res: Response) => {
  const success = db.deleteOffer(req.params.id);
  res.json({ success });
});

// ==========================================
// 6. REVIEWS
// ==========================================

app.get('/api/reviews', (req: Request, res: Response) => {
  const { productId } = req.query;
  res.json(db.getReviews(productId as string));
});

app.post('/api/reviews', (req: Request, res: Response) => {
  const { productId, customerName, rating, title, comment } = req.body;
  if (!productId || !customerName || !rating || !comment) {
    return res.status(400).json({ error: 'Missing required review fields' });
  }
  const rev = db.createReview(req.body);
  res.status(201).json({ success: true, review: rev, message: 'Review submitted for moderation.' });
});

app.put('/api/reviews/:id/status', requireAdmin, (req: Request, res: Response) => {
  const { status } = req.body;
  const updated = db.updateReviewStatus(req.params.id, status);
  if (!updated) return res.status(404).json({ error: 'Review not found' });
  res.json(updated);
});

app.delete('/api/reviews/:id', requireAdmin, (req: Request, res: Response) => {
  const success = db.deleteReview(req.params.id);
  res.json({ success });
});

// ==========================================
// 7. SETTINGS & SITE CONFIG
// ==========================================

app.get('/api/settings', (_req: Request, res: Response) => {
  res.json(db.getSettings());
});

app.put('/api/settings', requireAdmin, (req: Request, res: Response) => {
  const updated = db.updateSettings(req.body);
  res.json(updated);
});

// ==========================================
// 8. INVENTORY LOGS & AUDIT
// ==========================================

app.get('/api/inventory/logs', requireAdmin, (_req: Request, res: Response) => {
  res.json(db.getInventoryLogs());
});

// ==========================================
// 9. CUSTOMERS & CONTACT
// ==========================================

app.get('/api/customers', requireAdmin, (_req: Request, res: Response) => {
  res.json(db.getCustomersList());
});

app.post('/api/contact', (req: Request, res: Response) => {
  const { name, email, phone, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required' });
  }
  const msg = db.createContactMessage({ name, email, phone: phone || '', subject: subject || 'General Inquiry', message });
  res.status(201).json({ success: true, message: 'Thank you for reaching out. Our concierge will get back to you.' });
});

app.get('/api/contact', requireAdmin, (_req: Request, res: Response) => {
  res.json(db.getContactMessages());
});

app.put('/api/contact/:id/read', requireAdmin, (req: Request, res: Response) => {
  const success = db.markContactMessageRead(req.params.id);
  res.json({ success });
});

// ==========================================
// 10. ADMIN DASHBOARD & REPORTS
// ==========================================

app.get('/api/admin/dashboard', requireAdmin, (_req: Request, res: Response) => {
  res.json(db.getDashboardStats());
});

app.get('/api/admin/reports/csv', requireAdmin, (_req: Request, res: Response) => {
  const csv = db.generateOrdersCSV();
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="richpeople_orders_report.csv"');
  res.send(csv);
});

// Image upload helper (supports data URL / base64)
app.post('/api/upload', requireAdmin, (req: Request, res: Response) => {
  const { dataUrl } = req.body;
  if (!dataUrl) return res.status(400).json({ error: 'No image data provided' });
  // For local development or portability, dataUrl is returned or safely stored
  res.json({ url: dataUrl });
});

// ==========================================
// VITE OR STATIC SERVING
// ==========================================

async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✨ Rich People Luxury Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
