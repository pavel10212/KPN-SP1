import Image from "next/image";
import {
  MdDashboard,
  MdSupervisedUserCircle,
  MdShoppingBag,
  MdAttachMoney,
  MdOutlineSettings,
  MdHelpCenter,
  MdLogout,
  MdChat ,
} from "react-icons/md";
import MenuLink from "./menuLink/menuLink";
import prisma from "@/app/api/prismaClient";
import { signOut, auth } from "@/auth.js";

const Sidebar = async () => {
  const session = await auth();
  const user = await prisma.user.findFirst({
    where: { email: session.user.email },
  });

  const menuItems = [
    {
      title: "Pages",
      list: [
        {
          title: "Dashboard",
          path: "/dashboard",
          icon: <MdDashboard />,
        },
        {
          title: "Users",
          path: "/dashboard/users",
          icon: <MdSupervisedUserCircle />,
        },
        {
          title: "Chat",
          path: "/dashboard/chat",
          icon: <MdChat  />,
        },
        {
          title: "Tasks",
          path: "/dashboard/task",
          icon: <MdShoppingBag />,
        },
        // Conditionally include the Bookings menu item
        ...(user.role !== "Driver" && user.role !== "Maintenance"
          ? [
              {
                title: "Bookings",
                path: "/dashboard/bookings",
                icon: <MdAttachMoney />,
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
          icon: <MdOutlineSettings />,
        },
        {
          title: "Help",
          path: "/dashboard/help",
          icon: <MdHelpCenter />,
        },
      ],
    },
  ];

  return (
    <div className="sticky top-10">
      <div className="flex items-center gap-5 mb-5 flex-col">
        <Image
          className="rounded-full object-cover"
          src="/noavatar.png"
          alt=""
          width="50"
          height="50"
        />
        <div className="flex flex-col items-center">
          <span className="font-medium text-[#404040]">{user.name}</span>
          <span className="text-xs grey text-[#565656]">{user.role}</span>
        </div>
      </div>
      <ul className="list-none">
        {menuItems.map((cat) => (
          <li key={cat.title} className="">
            <span className="text-[#202224] font-bold text-xs mx-2 ">
              {cat.title}
            </span>
            {cat.list.map((item) => (
              <MenuLink item={item} key={item.title} />
            ))}
          </li>
        ))}
      </ul>
      <form
        action={async () => {
          "use server";
          await signOut({ callbackUrl: "/login" }); // Redirect to login page after signout
        }}
      >
        <button className="p-5 mx-1 flex items-center gap-2.5 cursor-pointer rounded-xl mt-40 w-full hover:bg-[#4880FF] hover:text-white text-[#202224] font-bold ">
          <MdLogout className="text-[#202224]" />
          Logout
        </button>
      </form>
    </div>
  );
};

export default Sidebar;
