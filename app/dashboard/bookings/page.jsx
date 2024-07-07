import { pullAllBookings } from "@/lib/actions";
import AllBookings from "@/components/allBookings/allBookings";
import { auth } from "@/auth";
import prisma from "@/app/api/prismaClient";

const Bookings = async () => {
  const session = await auth();
  const user = await prisma.user.findFirst({
    where: {
      email: session.user.email,
    },
  });
  if (user.role === "Driver" || user.role === "Maintenance") {
    return <div>You are not authorized to view this page</div>;
  }
  const teamId = user.teamId;
  const bookings = await pullAllBookings(teamId);
  return (
    <div>
      <AllBookings bookings={bookings} />
    </div>
  );
};

export default Bookings;
