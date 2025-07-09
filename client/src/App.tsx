import { Routes, Route } from "react-router";
import HomePage from "@/pages/HomePage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import OrderDetailsPage from "./pages/OrderDetailsPage";
import NavBar from "@/components/NavBar";
import OrdersPage from "@/pages/OrdersPage";
import { ThemeProvider } from "@/lib/theme-provider";
import ProductsPage from "./pages/ProductsPage";

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
    <div className="px-4 py-2">
      <div className="flex flex-col gap-y-4">
        <NavBar />
      </div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/orders/:order_key" element={<OrderDetailsPage />} />
        <Route path="/products/:sku" element={<ProductDetailsPage />} />
        <Route path="/products" element={<ProductsPage />} />
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;
