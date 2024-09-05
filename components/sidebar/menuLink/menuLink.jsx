"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLoading } from "@/components/loading/loadingWrapper";
import { useEffect } from "react";

const MenuLink = ({ item }) => {
  const pathname = usePathname();
  const isActive = pathname === item.path;
  const { setIsLoading } = useLoading();

  useEffect(() => {
    setIsLoading(false);
  }, [pathname, setIsLoading]);

  const handleClick = (e) => {
    if (isActive) {
      e.preventDefault();
      return;
    }
    setIsLoading(true);
  };

  return (
    <Link
      href={item.path}
      className={`flex items-center py-3 px-8 text-base font-medium transition-colors duration-200 ${
        isActive
          ? "text-indigo-600 bg-indigo-50"
          : "text-gray-600 hover:text-indigo-600 hover:bg-indigo-50"
      }`}
      onClick={handleClick}
    >
      <span className="mr-4">{item.icon}</span>
      {item.title}
    </Link>
  );
};

export default MenuLink;
