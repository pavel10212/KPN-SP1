import Link from "next/link";
import prisma from "@/app/api/prismaClient";
import { DataGrid } from "@mui/x-data-grid";
import { auth } from "@/auth";

const Users = async () => {
  const session = await auth();
  const user = await prisma.user.findFirst({
    where: {
      email: session.user.email,
    },
  });
  const allUsers = await prisma.User.findMany({
    where: {
      teamId: user.teamId,
    },
  });

  const columns = [
    { field: "name", headerName: "Name", width: 150 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "createdAt", headerName: "Created at", width: 200 },
    { field: "role", headerName: "Role", width: 150 },
  ];

  return (
    <div>
      <div className="bg-white p-5 rounded-xl mt-5">
        <h2 className="mb-5 font-bold text-[#202224]">Your Teammates</h2>
        <div className="flex items-center justify-between"></div>
        <DataGrid columns={columns} rows={allUsers} />
      </div>
      <div className="flex justify-end">
        <Link href="/dashboard/users/add">
          <button className="p-3 bg-slate-500 text-white border-0 rounded-sm cursor-pointer ">
            Add New
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Users;
