import Image from "next/image";
import {
  MdDashboard,
  MdSupervisedUserCircle,
  MdShoppingBag,
  MdAttachMoney,
  MdOutlineSettings,
  MdHelpCenter,
  MdLogout,
} from "react-icons/md";
import MenuLink from "./menuLink/menuLink";

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
        title: "Tasks",
        path: "/dashboard/tasks",
        icon: <MdShoppingBag />,
      },
      {
        title: "Bookings",
        path: "/dashboard/bookings",
        icon: <MdAttachMoney />,
      },
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

const Sidebar = async () => {
  return (
    <div class="sticky top-40">
      <div class="flex items-center gap-20 mb-20">
        <Image
          class="rounded-full object-cover"
          src="/noavatar.png"
          alt=""
          width="50"
          height="50"
        />
        <div class="flex flex-col">
          <span class="font-medium">Noe Kieffer</span>
          <span class="text-xs grey">Administrator</span>
        </div>
      </div>
      <ul class="list-none">
        {menuItems.map((cat) => (
          <li key={cat.title}>
            <span class="grey font-bold text-xs mx-2">{cat.title}</span>
            {cat.list.map((item) => (
              <MenuLink item={item} key={item.title} />
            ))}
          </li>
        ))}
      </ul>
      <button class="p-10 mx-1 flex items-center gap-10 cursor-pointer rounded-md bg-none border-0 w-full white hover:grey ">
        <MdLogout />
        Logout
      </button>
    </div>
  );
};

export default Sidebar;
