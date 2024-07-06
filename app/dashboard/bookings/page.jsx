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
  const teamId = user.teamId;
  const bookings = await pullAllBookings(teamId);
  return (
    <div>
      <AllBookings bookings={bookings} />
    </div>
  );
};

export default Bookings;
