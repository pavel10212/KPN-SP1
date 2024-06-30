import Link from "next/link";
import prisma from "@/app/api/prismaClient";
const Users = async () => {
  const allUsers = await prisma.User.findMany();
  return (
    <div className="bg-slate-500 p-5 rounded-xl mt-5">
      <div className="flex items-center justify-between">
        <Link href="/dashboard/users/add">
          <button className="p-3 bg-slate-500 text-white border-0 rounded-sm cursor-pointer">
            Add New
          </button>
        </Link>
      </div>
      <table className="w-full">
        <thead>
          <tr>
            <td>Name</td>
            <td>Email</td>
            <td>Created at</td>
            <td>Role</td>
            <td>Action</td>
          </tr>
        </thead>
        <tbody>
          {allUsers.map((user) => (
            <tr key={user.id}>
              <td>
                <div className="flex items-center gap-3">{user.name}</div>
              </td>
              <td>{user.email}</td>
              <td>{user.createdAt?.toString().slice(4, 16)}</td>
              <td>
                {user.role}
                {console.log(user.role)}
              </td>

              <td>
                <div className="flex gap-3">
                  <Link href={`/dashboard/users/${user.id}`}>
                    <button
                      className={`${"p-[5px 10px] rounded-sm text-white border-0 cursor-pointer"} ${"bg-teal-700"}`}
                    >
                      View
                    </button>
                  </Link>
                  <form action="">
                    <input type="hidden" name="id" value={user.id} />
                    <button
                      className={`${"p-[5px 10px] rounded-sm text-white border-0 cursor-pointer"} ${"bg-red-700"}`}
                    >
                      Delete
                    </button>
                  </form>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
