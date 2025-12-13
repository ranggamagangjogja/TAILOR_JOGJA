import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import AdminGuard from "./components/AdminGuard";

// Customer Components
import CustomerHero from "./components/CustomerHero";
import CustomerProducts from "./components/CustomerProducts";
import CustomerGallery from "./components/CustomerGallery";
import CustomerPricing from "./components/CustomerPricing";
import CustomerProcess from "./components/CustomerProcess";
import CustomerTestimonials from "./components/CustomerTestimonials";
import CustomerFAQ from "./components/CustomerFAQ";
import CustomerCTA from "./components/CustomerCTA";
import CustomerFooter from "./components/CustomerFooter";

// Admin Pages
import AdminLogin from "./pages/AdminLogin";
// import AdminDashboard from "./pages/AdminDashboard";
import AdminHero from "./pages/AdminHero";
import AdminProducts from "./pages/AdminProducts";
import AdminProductCreate from "./pages/AdminProductCreate";
import AdminProductEdit from "./pages/AdminProductEdit";
import AdminGallery from "./pages/AdminGallery";
import AdminGalleryCreate from "./pages/AdminGalleryCreate";
import AdminGalleryEdit from "./pages/AdminGalleryEdit";
import AdminPricing from "./pages/AdminPricing";
import AdminPricingCreate from "./pages/AdminPricingCreate";
import AdminPricingEdit from "./pages/AdminPricingEdit";
import AdminTimeline from "./pages/AdminTimeline";
import AdminTimelineEdit from "./pages/AdminTimelineEdit";
import AdminTestimonials from "./pages/AdminTestimonials";
import AdminTestimonialsEdit from "./pages/AdminTestimonialsEdit";
import AdminTestimonialsCreate from "./pages/AdminTestimonialsCreate";
import AdminFaq from "./pages/AdminFaq";
import AdminFaqEdit from "./pages/AdminFaqEdit";
import AdminFAQCreate from "./pages/AdminFaqCreate";
import AdminFooter from "./pages/AdminFooter";
import AdminCTA from "./pages/AdminCta";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Routes>

          {/* CUSTOMER ROUTES */}
          <Route
            path="/"
            element={
              <>
                <Navbar />
                <CustomerHero />
                <CustomerProducts />
                <CustomerGallery />
                <CustomerPricing />
                <CustomerProcess />
                <CustomerTestimonials />
                <CustomerFAQ />
                <CustomerCTA />
                <CustomerFooter />
              </>
            }
          />

          {/* ADMIN AUTH */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* ADMIN DASHBOARD */}
          {/* <Route
            path="/admin/dashboard"
            element={
              <AdminGuard>
                <AdminDashboard />
              </AdminGuard>
            }
          /> */}

          {/* ADMIN HERO */}
          <Route
            path="/admin/hero"
            element={
              <AdminGuard>
                <AdminHero />
              </AdminGuard>
            }
          />

          {/* ADMIN PRODUCTS */}
          <Route
            path="/admin/products"
            element={
              <AdminGuard>
                <AdminProducts />
              </AdminGuard>
            }
          />
          <Route
            path="/admin/products/new"
            element={
              <AdminGuard>
                <AdminProductCreate />
              </AdminGuard>
            }
          />
          <Route
            path="/admin/products/:id"
            element={
              <AdminGuard>
                <AdminProductEdit />
              </AdminGuard>
            }
          />

          {/* ADMIN GALLERY */}
          <Route
            path="/admin/gallery"
            element={
              <AdminGuard>
                <AdminGallery />
              </AdminGuard>
            }
          />
          <Route
            path="/admin/gallery/new"
            element={
              <AdminGuard>
                <AdminGalleryCreate />
              </AdminGuard>
            }
          />
          <Route
            path="/admin/gallery/:id"
            element={
              <AdminGuard>
                <AdminGalleryEdit />
              </AdminGuard>
            }
          />

          {/* ADMIN PRICING */}
          <Route
            path="/admin/pricing"
            element={
              <AdminGuard>
                <AdminPricing />
              </AdminGuard>
            }
          />
          <Route
            path="/admin/pricing/new"
            element={
              <AdminGuard>
                <AdminPricingCreate />
              </AdminGuard>
            }
          />
          <Route
            path="/admin/pricing/:id/edit"
            element={
              <AdminGuard>
                <AdminPricingEdit />
              </AdminGuard>
            }
          />

          {/* ADMIN TIMELINE */}
          <Route
            path="/admin/timeline"
            element={
              <AdminGuard>
                <AdminTimeline />
              </AdminGuard>
            }
          />
          <Route
            path="/admin/timeline/:id/edit"
            element={
              <AdminGuard>
                <AdminTimelineEdit />
              </AdminGuard>
            }
          />

          {/* ADMIN TESTIMONIALS */}
          <Route
            path="/admin/testimoni"
            element={
              <AdminGuard>
                <AdminTestimonials />
              </AdminGuard>
            }
          />
          <Route
            path="/admin/testimoni/new"
            element={
              <AdminGuard>
                <AdminTestimonialsCreate />
              </AdminGuard>
            }
          />
          <Route
            path="/admin/testimoni/:id/edit"
            element={
              <AdminGuard>
                <AdminTestimonialsEdit />
              </AdminGuard>
            }
          />

          {/* ADMIN FAQ */}
          <Route
            path="/admin/faq"
            element={
              <AdminGuard>
                <AdminFaq/>
              </AdminGuard>
            }
          />
          <Route
            path="/admin/faq/:id/edit"
            element={
              <AdminGuard>
                <AdminFaqEdit/>
              </AdminGuard>
            }
          />
          <Route
            path="/admin/faq/new"
            element={
              <AdminGuard>
                <AdminFAQCreate/>
              </AdminGuard>
            }
          />

          {/* ADMIN CTA*/}
          <Route
            path="/admin/CTA"
            element={
              <AdminGuard>
                <AdminCTA/>
              </AdminGuard>
            }
          />

          {/* ADMIN FOOTER*/}
          <Route
            path="/admin/footer"
            element={
              <AdminGuard>
                <AdminFooter/>
              </AdminGuard>
            }
          />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
