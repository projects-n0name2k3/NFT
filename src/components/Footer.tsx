import { Link } from "react-router";
import { FaTwitter, FaDiscord, FaTelegram } from "react-icons/fa"; // Install react-icons if needed
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Footer = ({ isHome }: { isHome: boolean }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={`flex flex-col md:flex-row md:justify-between items-center gap-6 py-12 px-4 ${
        isHome ? " text-white" : " text-black"
      }`}
    >
      <div className="flex flex-col items-center justify-between gap-4">
        <h3 className="text-3xl leading-tight text-center font-bold hover:text-primary-500 transition-colors flex items-center gap-2">
          <img
            src="/logo.png"
            alt="Logo"
            className={`w-14 ${isHome && " filter invert"}`}
          />
          OpenChain
        </h3>
        <span className="text-2xl font-semibold">
          Don't miss out on seatlab updates
        </span>
        <div className="flex items-center gap-4 w-full">
          <Input
            placeholder="Fullname"
            className="bg-slate-800 border-none flex-1"
          />
          <Input
            placeholder="Your email address"
            className="bg-slate-800 border-none flex-1"
          />
        </div>
        <Button className="text-lg py-6 px-6 linear-gradient w-full">
          Submit
        </Button>
        <div className="hidden md:flex flex-col items-center">
          <p className="text-gray-400">
            54 Nguyễn Lương Bằng, phường Hoà Khánh Bắc, quận Liên Chiểu, Tp. Đà
            Nẵng
          </p>
          <p className="text-sm text-gray-400">
            © {currentYear} Your Company. All rights reserved.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-6 items-center md:flex-row md:justify-between md:w-1/3">
        <div className="flex flex-col gap-3 items-center">
          <h4 className="font-bold text-2xl mb-1">Explore</h4>
          <Link
            to={"/contact"}
            className="hover:underline transition-all hover:text-primary-500"
          >
            Contact
          </Link>
          <Link
            to={"/events"}
            className="hover:underline transition-all hover:text-primary-500"
          >
            Events
          </Link>
          <Link
            to={"/marketplace"}
            className="hover:underline transition-all hover:text-primary-500"
          >
            Marketplace
          </Link>
        </div>

        <div className="flex flex-col gap-3 items-center pb-4 md:pb-0">
          <h4 className="font-bold text-2xl mb-1">Follow</h4>
          <a
            href="#"
            className="flex items-center gap-2 hover:text-primary-500 transition-colors"
          >
            <FaTwitter /> Twitter
          </a>
          <a
            href="#"
            className="flex items-center gap-2 hover:text-primary-500 transition-colors"
          >
            <FaDiscord /> Discord
          </a>
          <a
            href="#"
            className="flex items-center gap-2 hover:text-primary-500 transition-colors"
          >
            <FaTelegram /> Telegram
          </a>
        </div>
      </div>

      <div className="flex flex-col items-center md:hidden border-t border-gray-600 pt-4 w-full">
        <p className="text-gray-400">Your address</p>
        <p className="text-sm text-gray-400">
          © {currentYear} Your Company. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
