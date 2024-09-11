import {auth} from "@/auth";
import prisma from "@/app/api/prismaClient";
import ClientUsers from "@/components/clientUsers/clientUsers";

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

  return <ClientUsers users={allUsers} user={user} />;
};

export default Users;
