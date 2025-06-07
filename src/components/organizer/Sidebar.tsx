import { Button } from "@/components/ui/button";
import { useDarkMode } from "@/contexts/DarkModeContext";
import { useAuth } from "@/hooks/useAuth";
import { LogOut, Moon, Sun } from "lucide-react";
import { ReactNode } from "react";
import { NavLink } from "react-router";
import { useDisconnect } from "wagmi";

interface navListProps {
  name: string;
  href: string;
  icon: ReactNode;
}

interface SidebarProps {
  navList: navListProps[];
}

const Sidebar = ({ navList }: SidebarProps) => {
  const { logout } = useAuth();
  const { disconnect } = useDisconnect();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  return (
    <aside className="h-screen bg-white dark:bg-slate-900 pt-12 px-2 flex flex-col transition-all duration-300 w-[70px] lg:w-[300px]">
      <h2 className="text-xl font-bold p-4 flex items-center gap-2 dark:text-white">
        <img
          src="/logo.png"
          alt="OpenChain Logo"
          className="h-8 w-auto inline-block mr-2 dark:filter dark:invert"
        />
        <span className="hidden lg:inline">OpenChain</span>
      </h2>
      <nav className="flex-grow">
        <ul>
          {navList.map((navItem) => (
            <NavLink
              to={`/organizer/${navItem.href}`}
              key={navItem.href}
              className={({ isActive }) =>
                `p-4 flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-200 hover:opacity-60 rounded ${
                  isActive &&
                  "bg-black dark:bg-slate-700 font-semibold text-white"
                }`
              }
            >
              <div className="flex items-center justify-center lg:justify-start w-full">
                {navItem.icon}
                <span className="hidden lg:inline ml-2">{navItem.name}</span>
              </div>
            </NavLink>
          ))}
        </ul>
      </nav>
      <div className="mb-4">
        <Button
          className="w-full flex justify-between items-center mb-2"
          onClick={toggleDarkMode}
        >
          <span className="hidden lg:inline">
            {isDarkMode ? "Light" : "Dark"} Mode
          </span>
          {isDarkMode ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>
        <Button
          className="w-full flex justify-center"
          onClick={() => {
            disconnect();
            logout();
          }}
        >
          <span className="hidden lg:inline">Logout</span>
          <LogOut />
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
