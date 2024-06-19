"use client";

import { usePathname } from "next/navigation";
import { MdNotifications } from "react-icons/md";
const Navbar = () => {
  const pathname = usePathname();
  return (
    <div className="p-5 rounded-s-lg bg-slate flex items-center justify-between">
      <div className="text-[#202224] font-bold capitalize ">{pathname.split("/").pop()}</div>
      <div className="flex items-center gap-5">
        <div className="flex pr-1">
          <MdNotifications size={20} />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
