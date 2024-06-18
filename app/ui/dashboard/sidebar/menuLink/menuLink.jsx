"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

const MenuLink = ({ item }) => {
  const pathname = usePathname();

  return (
    <Link
      href={item.path}
      className={`${"p-5 flex items-center gap-2.5 mx-1 rounded-full hover:bg-slate-700"} ${
        pathname === item.path && "bg-slate-700"
      }`}
    >
      {item.icon}
      {item.title}
    </Link>
  );
};

export default MenuLink;
