"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

const MenuLink = ({ item }) => {
  const pathname = usePathname();

  return (
    <Link
      href={item.path}
      className={`${"p-5 flex text-[#202224] items-center gap-2.5 mt-4 mx-1 rounded-xl hover:bg-[#4880FF] hover:text-white"} ${
        pathname === item.path && "bg-[#4880FF] text-white"
      }`}
    >
      {item.icon}
      {item.title}
    </Link>
  );
};

export default MenuLink;
