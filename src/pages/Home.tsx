import HeroSection from "@/components/home/HeroSection";
import ExploreSection from "@/components/home/ExploreSection";
import FeatureSection from "@/components/home/FeatureSection";
import FanSection from "@/components/home/FanSection";
import { ArrowRightLeft, Shield, Ticket } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const Home = () => {
  // Animation variants
  const featureCards = [
    {
      icon: <Ticket />,
      title: "Cannot be counterfeited.",
      description:
        "Each NFT ticket has a unique digital signature on the blockchain, completely eliminating the possibility of forgery or duplication. Fans are always assured of the authenticity of the ticket, and organizers significantly reduce the cost of handling fraud.",
    },
    {
      icon: <Shield />,
      title: "Secure and transparent.",
      description:
        "NFT tickets are stored on the blockchain, providing a secure and transparent record of ownership. Fans can easily transfer tickets to friends or resell them on the secondary market, and organizers can track ticket ownership and prevent scalping.",
    },
    {
      icon: <ArrowRightLeft />,
      title: "Unlock new revenue streams.",
      description:
        "NFT tickets can be programmed with smart contracts, enabling organizers to earn royalties on ticket resales. Organizers can also create limited-edition tickets, offer exclusive perks to ticket holders, and engage fans in new and exciting ways.",
    },
  ];
  return (
    <main className="flex flex-col gap-4 min-h-screen px-4 pt-20 md:pt-0 ">
      {/* Hero section */}
      <HeroSection
        title=" NFTs — New, Fairer Ticketing."
        description="Enter a new era of event tickets with NFT technology. Safer, more
          transparent, and a groundbreaking experience for fans and organizers."
      />

      {/* Features section */}
      <ExploreSection
        title="Explore events on our marketplace"
        label="View All Events"
        href="/events"
      />

      <Separator />

      {/* Feature section */}
      <FeatureSection
        title="Revolutionise your ticketing with NFTs - Sell on Your Company Today!"
        description=" Empower event organizers and artists with an advanced NFT ticketing
          platform. Fight fraud, generate new revenue, and build stronger fan
          communities."
        cards={featureCards}
      />
      <Separator />

      {/* Connect with your fan */}
      <FanSection />
    </main>
  );
};

export default Home;
