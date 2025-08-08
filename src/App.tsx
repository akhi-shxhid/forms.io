import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import Layout from "@/components/Layout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Create from "./pages/Create";
import Preview from "./pages/Preview";
import MyForms from "./pages/MyForms";
import Auth from "./pages/Auth";
import PublicForm from "./pages/PublicForm";
import ProtectedRoute from "./components/ProtectedRoute";
import About from "./pages/About";
import Dashboard from "./pages/Dashboard";

const queryClient = new QueryClient();

const App = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/create" element={<ProtectedRoute><Create /></ProtectedRoute>} />
              <Route path="/preview" element={<Preview />} />
              <Route path="/myforms" element={<ProtectedRoute><MyForms /></ProtectedRoute>} />
              <Route path="/f/:slug" element={<PublicForm />} />
              <Route path="/about" element={<About />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </Provider>
);

export default App;
