"use client";

import { usePathname } from "next/navigation";
import { MdNotifications } from "react-icons/md";
const Navbar = () => {
  const pathname = usePathname();
  return (
    <div class="p-5 rounded-s-lg bg-slate flex items-center justify-between">
      <div class="red font-bold capitalize">{pathname.split("/").pop()}</div>
      <div class="flex items-center gap-20">
        <div class="flex pr-1">
          <MdNotifications size={20} />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
