import Link from "next/link";
import prisma from "@/app/api/prismaClient";
import { DataGrid } from "@mui/x-data-grid";

const Users = async () => {
  const allUsers = await prisma.User.findMany();

  const columns = [
    { field: "name", headerName: "Name", width: 150 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "createdAt", headerName: "Created at", width: 200 },
    { field: "role", headerName: "Role", width: 150 },
  ];

  return (
    <div className="bg-slate-500 p-5 rounded-xl mt-5">
      <div className="flex items-center justify-between">
        <Link href="/dashboard/users/add">
          <button className="p-3 bg-slate-500 text-white border-0 rounded-sm cursor-pointer">
            Add New
          </button>
        </Link>
      </div>
      <DataGrid columns={columns} rows={allUsers} />
    </div>
  );
};

export default Users;
