import { createRoot } from "react-dom/client";
import "./index.css";
import "@rainbow-me/rainbowkit/styles.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router";
import { WagmiProvider } from "wagmi";
import { config } from "@/utils/wagmi.ts";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { Toaster } from "@/components/ui/sonner";
import { DarkModeProvider } from "@/contexts/DarkModeContext.tsx";
const queyClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <WagmiProvider config={config}>
    <QueryClientProvider client={queyClient}>
      <BrowserRouter>
        <RainbowKitProvider>
          <DarkModeProvider>
            <App />
            <Toaster />
          </DarkModeProvider>
        </RainbowKitProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </WagmiProvider>
);
