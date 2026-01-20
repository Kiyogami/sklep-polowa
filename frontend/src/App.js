import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";

// Store Pages
import StorePage from "@/pages/store/StorePage";
import ProductPage from "@/pages/store/ProductPage";
import CartPage from "@/pages/store/CartPage";
import CheckoutPage from "@/pages/store/CheckoutPage";
import VerificationPage from "@/pages/store/VerificationPage";
import OrderStatusPage from "@/pages/store/OrderStatusPage";
import PaymentSuccessPage from "@/pages/store/PaymentSuccessPage";
import MyOrdersPage from "@/pages/store/MyOrdersPage";
import InfoPage from "@/pages/store/InfoPage";

// Admin Pages
import AdminLayout from "@/pages/admin/AdminLayout";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminOrders from "@/pages/admin/AdminOrders";
import AdminProducts from "@/pages/admin/AdminProducts";
import AdminVerifications from "@/pages/admin/AdminVerifications";
import AdminSettings from "@/pages/admin/AdminSettings";

// Context
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { TelegramProvider } from "@/context/TelegramContext";
import { OrdersProvider } from "@/context/OrdersContext";

function App() {
  return (
    <TelegramProvider>
      <AuthProvider>
        <OrdersProvider>
          <CartProvider>
            <BrowserRouter>
              <Routes>
                {/* Store Routes */}
                <Route path="/" element={<StorePage />} />
                <Route path="/product/:id" element={<ProductPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/verification/:orderId" element={<VerificationPage />} />
                <Route path="/order/:orderId" element={<OrderStatusPage />} />
                <Route path="/payment-success/:orderId" element={<PaymentSuccessPage />} />
                <Route path="/orders" element={<MyOrdersPage />} />
                
                {/* Admin Routes */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="orders" element={<AdminOrders />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="verifications" element={<AdminVerifications />} />
                  <Route path="settings" element={<AdminSettings />} />
                </Route>
              </Routes>
              <Toaster position="top-right" richColors />
            </BrowserRouter>
          </CartProvider>
        </OrdersProvider>
      </AuthProvider>
    </TelegramProvider>
  );
}

export default App;
