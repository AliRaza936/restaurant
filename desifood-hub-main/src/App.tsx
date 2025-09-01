import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Favorites from "./pages/Favorites";
import OrderHistory from "./pages/OrderHistory";
import Profile from "./pages/Profile";

import NotFound from "./pages/NotFound";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/Products";
import AdminOrders from "./pages/admin/Orders";
import AdminCategories from "./pages/admin/Categories";

import AdminAnalytics from "./pages/admin/Analytics";
import { Navbar } from "./components/Navbar";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/order-history" element={<OrderHistory />} />
          <Route path="/profile" element={<Profile />} />
          {/* <Route path="/admin" element={<Admin />} /> */}
          
          {/* Admin Routes with role protection */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute requiredRole={['admin', 'user']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/products"
            element={
              <ProtectedRoute requiredRole={['admin', 'user']}>
                <AdminProducts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <ProtectedRoute requiredRole={['admin', 'user']}>
                <AdminOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/categories"
            element={
              <ProtectedRoute requiredRole={['admin', 'user']}>
                <AdminCategories />
              </ProtectedRoute>
            }
          />
         
          <Route
            path="/admin/analytics"
            element={
              <ProtectedRoute requiredRole={['admin', 'user']}>
                <AdminAnalytics />
              </ProtectedRoute>
            }
          />
          
          {/* Additional Routes for Footer Links */}
          <Route path="/menu" element={<Home />} />
          <Route path="/deals" element={<Home />} />
          <Route path="/about" element={<Home />} />
          <Route path="/contact" element={<Home />} />
          <Route path="/faq" element={<Home />} />
          <Route path="/support" element={<Home />} />
          <Route path="/privacy" element={<Home />} />
          <Route path="/terms" element={<Home />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
