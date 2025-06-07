import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/hooks/useAuth";
import useAuthStore from "@/store/auth-store";
import useUserStore from "@/store/user-store";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { ChevronRight, LogOutIcon, Menu, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useDisconnect } from "wagmi";

interface HeaderProps {
  address?: string;
}

const Header = ({ address }: HeaderProps) => {
  const { openConnectModal } = useConnectModal();
  const { isAuthenticated } = useAuthStore();
  const { user } = useUserStore();
  const { logout } = useAuth();
  const navItems = [
    { label: "Events", href: "/events" },
    { label: "Marketplace", href: "/marketplace" },
    { label: "Contact", href: "/contact" },
  ];
  const { disconnect } = useDisconnect();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // if user scrolldown, background color of header will change to white
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    // Initialize scroll state
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`w-full py-3 md:py-4 px-4 md:px-8 container fixed transition-all duration-300 z-50 ${
        scrolled
          ? "bg-white translate-y-0"
          : "bg-white/30 backdrop-blur-md translate-y-0"
      }`}
    >
      <div className="flex items-center justify-between w-full">
        {/* Logo */}
        <h2 className="font-bold text-xl flex items-center ">
          <img
            src="/logo.png"
            alt="OpenChain Logo"
            className="h-8 w-auto inline-block mr-2"
          />
          <a href="/">OpenChain</a>
        </h2>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {/* Nav Links */}
          <div className={`flex items-center gap-8 font-semibold `}>
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="hover:text-gray-600 transition-colors"
              >
                {item.label}
              </Link>
            ))}
            {user?.role === "organizer" && address ? (
              <Button variant={"outline"}>
                <Link to={"/organizer/dashboard"}>Dashboard</Link>
              </Button>
            ) : (
              <Button variant={"outline"}>
                <Link to={"/signup"}>Become an organizer</Link>
              </Button>
            )}
          </div>

          {/* Authentication */}
          {isAuthenticated && address ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="outline-none">
                <Avatar>
                  <AvatarImage
                    src={user?.thumbnailUrl || "https://github.com/shadcn.png"}
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link
                  to={
                    user?.role === "organizer"
                      ? "/organizer/profile"
                      : "/profile"
                  }
                >
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    disconnect();
                    logout();
                  }}
                >
                  <LogOutIcon /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="outline"
              onClick={() => {
                if (address) {
                  disconnect();
                  if (openConnectModal) openConnectModal();
                } else {
                  if (openConnectModal) openConnectModal();
                }
              }}
              className="flex items-center gap-3 px-3 py-2"
            >
              <Wallet size={18} /> Login
            </Button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu size={32} />
            </Button>
          </SheetTrigger>
          <SheetContent className="w-full">
            <div className="flex flex-col h-full items-center">
              {/* Mobile menu content */}
              <div className="flex flex-col gap-6 mt-8 w-full">
                {/* Nav links */}
                <div className={`flex flex-col  w-full `}>
                  {navItems.map((item) => (
                    <Link
                      key={item.label}
                      to={item.href}
                      className=" flex items-center justify-between font-semibold hover:text-gray-600 hover:bg-gray-300 px-2 py-3 rounded transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                      <ChevronRight size={20} />
                    </Link>
                  ))}
                </div>

                {/* Auth button */}
                <div className="">
                  {address ? (
                    <>
                      <Link
                        to={"/profile"}
                        className="flex items-center  justify-between hover:bg-gray-300 px-2 py-3 rounded cursor-pointer"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <div className="flex items-center gap-4">
                          <Avatar>
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>{user?.name}</AvatarFallback>
                          </Avatar>
                          <a
                            className=" flex items-center justify-between font-semibold hover:text-gray-600 transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {user?.name}
                          </a>
                        </div>
                        <ChevronRight size={20} />
                      </Link>
                      <Button
                        className="w-full flex items-center justify-between mt-4"
                        onClick={() => {
                          disconnect();
                          logout();
                        }}
                      >
                        Logout
                        <LogOutIcon />
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={() => {
                        if (openConnectModal) {
                          openConnectModal();
                        }
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-center gap-2"
                    >
                      <Wallet size={18} /> Login
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Header;
