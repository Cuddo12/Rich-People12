import React, { useState, useEffect } from 'react';
import { ToastProvider } from './context/ToastContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { AdminAuthProvider, useAdminAuth } from './context/AdminAuthContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { CartDrawer } from './components/cart/CartDrawer';

// Customer Pages
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailsPage } from './pages/ProductDetailsPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { WishlistPage } from './pages/WishlistPage';
import { PolicyPages } from './pages/PolicyPages';

// Admin Pages
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminLayout, AdminTab } from './pages/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminOrders } from './pages/admin/AdminOrders';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminInventory } from './pages/admin/AdminInventory';
import { AdminCategories } from './pages/admin/AdminCategories';
import { AdminCouponsOffers } from './pages/admin/AdminCouponsOffers';
import { AdminReviews } from './pages/admin/AdminReviews';
import { AdminMessages } from './pages/admin/AdminMessages';
import { AdminSettings } from './pages/admin/AdminSettings';
import { AdminReports } from './pages/admin/AdminReports';
import { AdminProfile } from './pages/admin/AdminProfile';

function AppContent() {
  const [currentRoute, setCurrentRoute] = useState<string>('/');
  const [routeParams, setRouteParams] = useState<any>({});
  const [adminTab, setAdminTab] = useState<AdminTab>('dashboard');
  const [siteSettings, setSiteSettings] = useState<any>(null);

  const { isAuthenticated, isLoading: authLoading } = useAdminAuth();

  // Load site settings once
  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => setSiteSettings(data))
      .catch((err) => console.error(err));
  }, []);

  // Simple, robust client router
  const navigate = (route: string, params: any = {}) => {
    setCurrentRoute(route);
    setRouteParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isAdminRoute = currentRoute.startsWith('/admin');

  // Handle Admin view rendering
  if (isAdminRoute) {
    if (authLoading) {
      return (
        <div className="min-h-screen bg-[#09090b] flex items-center justify-center text-xs uppercase tracking-widest text-zinc-400 font-mono">
          Verifying Security Credentials...
        </div>
      );
    }

    if (!isAuthenticated) {
      return <AdminLogin navigate={navigate} />;
    }

    return (
      <AdminLayout
        currentTab={adminTab}
        onSelectTab={(tab) => setAdminTab(tab)}
        navigate={navigate}
      >
        {adminTab === 'dashboard' && <AdminDashboard onSelectTab={setAdminTab} />}
        {adminTab === 'orders' && <AdminOrders />}
        {adminTab === 'products' && <AdminProducts />}
        {adminTab === 'inventory' && <AdminInventory />}
        {adminTab === 'categories' && <AdminCategories />}
        {adminTab === 'coupons' && <AdminCouponsOffers />}
        {adminTab === 'reviews' && <AdminReviews />}
        {adminTab === 'messages' && <AdminMessages />}
        {adminTab === 'settings' && <AdminSettings />}
        {adminTab === 'reports' && <AdminReports />}
        {adminTab === 'profile' && <AdminProfile />}
      </AdminLayout>
    );
  }

  // Render Customer Storefront
  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] flex flex-col justify-between selection:bg-[#7f1d1d] selection:text-white">
      <Navbar
        currentRoute={currentRoute}
        navigate={navigate}
        announcementText={siteSettings?.announcementBar?.text}
        isAnnouncementEnabled={siteSettings?.announcementBar?.enabled}
      />

      <main className="flex-1">
        {currentRoute === '/' && <HomePage navigate={navigate} />}

        {currentRoute === '/shop' && (
          <ShopPage
            navigate={navigate}
            initialCategory={routeParams.category}
            initialSearch={routeParams.search}
            initialSale={routeParams.isSale}
          />
        )}

        {currentRoute === '/shirts' && (
          <ShopPage navigate={navigate} initialCategory="Shirts" />
        )}

        {currentRoute === '/panjabi' && (
          <ShopPage navigate={navigate} initialCategory="Panjabi" />
        )}

        {currentRoute === '/collections' && (
          <ShopPage navigate={navigate} />
        )}

        {currentRoute.startsWith('/product/') && (
          <ProductDetailsPage
            slugOrId={currentRoute.replace('/product/', '')}
            navigate={navigate}
          />
        )}

        {currentRoute === '/cart' && <CartPage navigate={navigate} />}

        {currentRoute === '/checkout' && <CheckoutPage navigate={navigate} />}

        {currentRoute.startsWith('/order-success/') && (
          <OrderSuccessPage
            orderId={currentRoute.replace('/order-success/', '')}
            navigate={navigate}
            passedOrder={routeParams.order}
          />
        )}

        {currentRoute === '/track' && (
          <OrderTrackingPage
            initialOrderId={routeParams.orderId}
            initialPhone={routeParams.phone}
          />
        )}

        {currentRoute === '/about' && <AboutPage navigate={navigate} />}

        {currentRoute === '/contact' && <ContactPage />}

        {currentRoute === '/wishlist' && <WishlistPage navigate={navigate} />}

        {currentRoute === '/shipping-policy' && (
          <PolicyPages type="shipping" navigate={navigate} />
        )}

        {currentRoute === '/returns' && (
          <PolicyPages type="returns" navigate={navigate} />
        )}

        {currentRoute === '/faq' && (
          <PolicyPages type="faq" navigate={navigate} />
        )}

        {currentRoute === '/privacy-policy' && (
          <PolicyPages type="privacy" navigate={navigate} />
        )}

        {currentRoute === '/terms' && (
          <PolicyPages type="terms" navigate={navigate} />
        )}
      </main>

      <Footer
        navigate={navigate}
        brandName={siteSettings?.brandName}
        phone={siteSettings?.phone}
        email={siteSettings?.email}
        address={siteSettings?.address}
      />

      <CartDrawer navigate={navigate} />
    </div>
  );
}

export function App() {
  return (
    <ToastProvider>
      <AdminAuthProvider>
        <CartProvider>
          <WishlistProvider>
            <AppContent />
          </WishlistProvider>
        </CartProvider>
      </AdminAuthProvider>
    </ToastProvider>
  );
}

export default App;
