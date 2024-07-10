import Image from "next/image";
import {
  MdDashboard,
  MdSupervisedUserCircle,
  MdShoppingBag,
  MdAttachMoney,
  MdOutlineSettings,
  MdHelpCenter,
  MdLogout,
  MdChat,
} from "react-icons/md";
import MenuLink from "./menuLink/menuLink";
import prisma from "@/app/api/prismaClient";
import { signOut, auth } from "@/auth.js";
import { redirect } from "next/navigation";

const Sidebar = async () => {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const user = await prisma.user.findFirst({
    where: { email: session.user.email },
  });

  if (!user) {
    console.error("User not found in the database");
    redirect("/login");
  }

  const menuItems = [
    {
      title: "Menu",
      list: [
        {
          title: "Dashboard",
          path: "/dashboard",
          icon: <MdDashboard className="text-2xl" />,
        },
        {
          title: "Users",
          path: "/dashboard/users",
          icon: <MdSupervisedUserCircle className="text-2xl" />,
        },
        {
          title: "Chat",
          path: "/dashboard/chat",
          icon: <MdChat className="text-2xl" />,
        },
        {
          title: "Tasks",
          path: "/dashboard/task",
          icon: <MdShoppingBag className="text-2xl" />,
        },
        // Conditionally include the Bookings menu item
        ...(user.role !== "Driver" && user.role !== "Maintenance"
          ? [
              {
                title: "Bookings",
                path: "/dashboard/bookings",
                icon: <MdAttachMoney className="text-2xl" />,
              },
            ]
          : []),
      ],
    },
    {
      title: "User",
      list: [
        {
          title: "Settings",
          path: "/dashboard/settings",
          icon: <MdOutlineSettings className="text-2xl" />,
        },
        {
          title: "Help",
          path: "/dashboard/help",
          icon: <MdHelpCenter className="text-2xl" />,
        },
      ],
    },
  ];

  return (
    <div className="w-80 h-screen bg-white shadow-lg flex flex-col">
      <div className="p-8 flex flex-col items-center border-b border-gray-200">
        <Image
          className="rounded-full object-cover w-24 h-24 mb-4 border-2 border-indigo-500"
          src="/noavatar.png"
          alt=""
          width="96"
          height="96"
        />
        <span className="font-semibold text-gray-800 text-xl">{user.name}</span>
        <span className="text-sm text-indigo-600 font-medium mt-1">
          {user.role}
        </span>
      </div>
      <nav className="flex-grow overflow-y-auto py-6">
        {menuItems.map((cat) => (
          <div key={cat.title} className="mb-8">
            <span className="text-sm font-bold text-gray-400 uppercase px-8 mb-2 block">
              {cat.title}
            </span>
            <ul className="list-none">
              {cat.list.map((item) => (
                <MenuLink item={item} key={item.title} />
              ))}
            </ul>
          </div>
        ))}
      </nav>
      <div className="mt-auto border-t border-gray-200">
        <form
          action={async () => {
            "use server";
            await signOut({ callbackUrl: "/login" });
          }}
          className="p-6"
        >
          <button className="w-full py-3 px-4 bg-red-500 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-red-600 transition duration-300 text-lg">
            <MdLogout className="text-2xl" />
            Logout
          </button>
        </form>
      </div>
    </div>
  );
};

export default Sidebar;
