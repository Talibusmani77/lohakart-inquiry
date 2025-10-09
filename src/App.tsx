import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import InquiryCart from "./pages/InquiryCart";
import Dashboard from "./pages/Dashboard";
import PricingIndex from "./pages/PricingIndex";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminAddProduct from "./pages/admin/AdminAddProduct";
import AdminInquiries from "./pages/admin/AdminInquiries";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:slug" element={<ProductDetail />} />
                <Route path="/inquiry/cart" element={<InquiryCart />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/pricing-index" element={<PricingIndex />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/auth/login" element={<Login />} />
                <Route path="/auth/register" element={<Register />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/products" element={<AdminProducts />} />
                <Route path="/admin/products/add" element={<AdminAddProduct />} />
                <Route path="/admin/inquiries" element={<AdminInquiries />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
