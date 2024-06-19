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
        path: "/dashboard/task",
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
    <div className="sticky top-40">
      <div className="flex items-center gap-20 mb-20">
        <Image
          className="rounded-full object-cover"
          src="/noavatar.png"
          alt=""
          width="50"
          height="50"
        />
        <div className="flex flex-col ">
          <span className="font-medium text-[#404040]">Noe Kieffer</span>
          <span className="text-xs grey text-[#565656]">Administrator</span>
        </div>
      </div>
      <ul className="list-none">
        {menuItems.map((cat) => (
          <li key={cat.title} className="">
            <span className="text-[#202224] font-bold text-xs mx-2 ">{cat.title}</span>
            {cat.list.map((item) => (
              <MenuLink item={item} key={item.title}/>
            ))}
          </li>
        ))}
      </ul>
      <button className="p-5 mx-1 flex items-center gap-2.5 cursor-pointer rounded-xl mt-40 w-full hover:bg-[#4880FF] ">
        <MdLogout />
        Logout
      </button>
    </div>
  );
};

export default Sidebar;
