
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CareerRoadmap from "./pages/CareerRoadmap";
import ExamPrep from "./pages/ExamPrep";
import Events from "./pages/Events";
import LinkedInGenerator from "./pages/LinkedInGenerator";
import NightOwl from "./pages/NightOwl";
import Community from "./pages/Community";
import ProctoredMode from "./pages/ProctoredMode";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/career" element={<CareerRoadmap />} />
          <Route path="/exam" element={<ExamPrep />} />
          <Route path="/events" element={<Events />} />
          <Route path="/linkedin" element={<LinkedInGenerator />} />
          <Route path="/night-owl" element={<NightOwl />} />
          <Route path="/community" element={<Community />} />
          <Route path="/proctored" element={<ProctoredMode />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
