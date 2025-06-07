/* eslint-disable react-hooks/exhaustive-deps */
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import InfoScreen from "@/components/organizer/eventCreation/InfoScreen";
import PromotionScreen from "@/components/organizer/eventCreation/PromotionScreen";
import RuleCreationScreen from "@/components/organizer/eventCreation/RuleCreationScreen";
import TicketCreationScreen from "@/components/organizer/eventCreation/TicketCreationScreen";
import EventScreenLayout from "@/components/organizer/EventScreenLayout";
import Layout from "@/components/organizer/Layout";
import Inventory from "@/components/profile/Inventory";
import ResalingTicket from "@/components/profile/ResalingTicket";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/hooks/useAuth";
import Contact from "@/pages/Contact";
import Event from "@/pages/Event";
import EventDetail from "@/pages/EventDetail";
import Home from "@/pages/Home";
import Marketplace from "@/pages/Marketplace";
import NotFound from "@/pages/NotFound";
import Dashboard from "@/pages/organizer/Dashboard";
import EventScreen from "@/pages/organizer/EventScreen";
import OProfile from "@/pages/organizer/OProfile";
import OrganizerEventDetail from "@/pages/organizer/OrganizerEventDetail";
import Profile from "@/pages/Profile";
import ResaleScreen from "@/pages/ResaleScreen";
import ResaleEventDetail from "@/pages/ResaleTicketDetail";
import SignIn from "@/pages/SignIn";
import SignUp from "@/pages/SignUp";
import GoogleMapsAutocomplete from "@/pages/Test";
import UnauthorizePage from "@/pages/UnauthorizePage";
import useAuthStore from "@/store/auth-store";

import { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router";
import { useAccount } from "wagmi";

const App = () => {
  const { address } = useAccount();
  const location = useLocation();
  const { setWalletAddress, isAuthenticated } = useAuthStore();
  const { authenticate } = useAuth();
  const [isHome, setIsHome] = useState(false);
  // Check if the route is for the organizer
  const isOrganizerRoute = location.pathname.includes("/organizer");

  useEffect(() => {
    setWalletAddress(address || null);
    if (address) {
      authenticate(address);
    }
  }, [address]);

  useEffect(() => {
    if (location.pathname === "/") {
      document.body.style.backgroundColor = "#050035";
      setIsHome(true);
    } else {
      document.body.style.backgroundColor = "white";
      setIsHome(false);
    }
  }, [location.pathname]);

  return (
    <div className={`${!isOrganizerRoute && "container mx-auto"}`}>
      {!isOrganizerRoute && <Header address={address} />}
      <main className={`${!isOrganizerRoute && "pt-20"} md:pt-0 `}>
        <Routes>
          {/* Auth Routes */}
          <Route path="/signup" element={<SignUp />}></Route>
          <Route path="/signin" element={<SignIn />} />

          {/* Organizer Routes */}
          <Route
            path="/organizer"
            element={
              <ProtectedRoute
                isAuthenticated={isAuthenticated}
                isOranizer={true}
              >
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="profile" element={<OProfile />} />
            <Route path="events" element={<EventScreenLayout />}>
              <Route index element={<EventScreen />} />
              <Route path="new/info" element={<InfoScreen />} />
              <Route path="new/promotions" element={<PromotionScreen />} />
              <Route path="new/tickets" element={<TicketCreationScreen />} />
              <Route path="new/rules" element={<RuleCreationScreen />} />
              <Route path=":eventId" element={<OrganizerEventDetail />} />
            </Route>
          </Route>

          {/* Common Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Event />} />
          <Route path="/event/:eventId" element={<EventDetail />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/marketplace/:eventId" element={<ResaleEventDetail />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Profile />
              </ProtectedRoute>
            }
          >
            <Route index element={<Inventory />} />
            <Route path="resaling" element={<ResalingTicket />} />
          </Route>
          <Route
            path="/resale/:ticketId"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <ResaleScreen />
              </ProtectedRoute>
            }
          />
          <Route path="/contact" element={<Contact />} />
          <Route path="/test" element={<GoogleMapsAutocomplete />} />
          {/* 404 Page */}
          <Route path="*" element={<NotFound />} />
          {/* 403 page */}
          <Route path="/forbidden" element={<UnauthorizePage />} />
        </Routes>
      </main>
      {!isOrganizerRoute && <Footer isHome={isHome} />}
    </div>
  );
};

export default App;
