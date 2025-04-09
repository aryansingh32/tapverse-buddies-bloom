
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { GameProvider } from "./contexts/GameContext";
import { Navigation } from "./components/Navigation";

import Index from "./pages/Index";
import Shop from "./pages/Shop";
import Profile from "./pages/Profile";
import Quests from "./pages/Quests";
import Story from "./pages/Story";
import NotFound from "./pages/NotFound";
import Arcade from "./pages/Arcade";
import Buddy from "./pages/Buddy";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <GameProvider>
        <BrowserRouter>
          <Navigation />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/arcade" element={<Arcade />} />
            <Route path="/buddy" element={<Buddy />} />
            <Route path="/quests" element={<Quests />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/story" element={<Story />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </GameProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
