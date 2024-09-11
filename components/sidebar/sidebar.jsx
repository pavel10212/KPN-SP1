import {
    MdAttachMoney,
    MdChat,
    MdDashboard,
    MdHelpCenter,
    MdLogout,
    MdOutlineSettings,
    MdShoppingBag,
    MdSupervisedUserCircle,
} from "react-icons/md";
import MenuLink from "./menuLink/menuLink";
import {auth, signOut} from "@/auth.js";
import {redirect} from "next/navigation";
import SidebarToggle from "/components/sidebar/sidebarToggle/sidebarToggle";
import ClientSideImage from "@/components/clientSideImage/ClientSideImage";
import {findUserByEmail} from "@/lib/utils";

const Sidebar = async ({className}) => {
    const session = await auth();

    if (!session) {
        redirect("/login");
    }

    const user = await findUserByEmail(session.user.email);

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
                    icon: <MdDashboard className="text-2xl"/>,
                },
                {
                    title: "Users",
                    path: "/dashboard/users",
                    icon: <MdSupervisedUserCircle className="text-2xl"/>,
                },
                {
                    title: "Chat",
                    path: "/dashboard/chat",
                    icon: <MdChat className="text-2xl"/>,
                },
                {
                    title: "Tasks",
                    path: "/dashboard/task",
                    icon: <MdShoppingBag className="text-2xl"/>,
                },
                ...(user.role !== "Driver" && user.role !== "Maintenance"
                    ? [
                        {
                            title: "Bookings",
                            path: "/dashboard/bookings",
                            icon: <MdAttachMoney className="text-2xl"/>,
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
                    icon: <MdOutlineSettings className="text-2xl"/>,
                },
                {
                    title: "Help",
                    path: "/dashboard/help",
                    icon: <MdHelpCenter className="text-2xl"/>,
                },
            ],
        },
    ];

    const sidebarContent = (
        <div className="flex flex-col h-full bg-white shadow-md">
            <div className="p-6 flex flex-col items-center border-b border-gray-200">
                <ClientSideImage userId={user.id} userName={user.name} />
                <span className="font-semibold text-gray-800 text-lg">{user.name}</span>
                <span className="text-sm text-indigo-600 font-medium mt-1">
          {user.role}
        </span>
            </div>
            <nav className="flex-grow overflow-y-auto py-4">
                {menuItems.map((cat) => (
                    <div key={cat.title} className="mb-6">
            <span className="text-xs font-bold text-gray-400 uppercase px-6 mb-2 block">
              {cat.title}
            </span>
                        <ul className="list-none">
                            {cat.list.map((item) => (
                                <MenuLink item={item} key={item.title}/>
                            ))}
                        </ul>
                    </div>
                ))}
            </nav>
            <div className="border-t border-gray-200 p-4">
                <form
                    action={async () => {
                        "use server";
                        await signOut({callbackUrl: "/login"});
                    }}
                >
                    <button
                        className="w-full py-2 px-4 bg-red-500 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-red-600 transition duration-300 text-sm">
                        <MdLogout className="text-xl"/>
                        Logout
                    </button>
                </form>
            </div>
        </div>
    );

    return <SidebarToggle className={className}>{sidebarContent}</SidebarToggle>;
};

export default Sidebar;
