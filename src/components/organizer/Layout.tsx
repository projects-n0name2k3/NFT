import Sidebar from "@/components/organizer/Sidebar";
import { Calendar, LayoutDashboard, User } from "lucide-react";

import { Outlet } from "react-router";

const navList = [
  {
    name: "Dashboard",
    href: "dashboard",
    icon: <LayoutDashboard />,
  },
  {
    name: "Events",
    href: "events",
    icon: <Calendar />,
  },
  {
    name: "Profile",
    href: "profile",
    icon: <User />,
  },
];

const Layout = () => {
  return (
    <div className="flex">
      <Sidebar navList={navList} />
      <main className="w-full h-screen max-h-screen overflow-y-auto pt-12  px-4 flex flex-col gap-4 bg-[#f1f1f1] dark:bg-[#040520]">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
