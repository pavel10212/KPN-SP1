import { pullAllBookings } from "@/lib/actions";
import AllBookings from "@/components/allBookings/allBookings";
import { auth } from "@/auth";
import prisma from "@/app/api/prismaClient";
import { Hotel, TrendingUp } from "@mui/icons-material";

const Bookings = async () => {
  const session = await auth();
  const user = await prisma.user.findFirst({
    where: {
      email: session.user.email,
    },
  });

  if (user.role === "Driver" || user.role === "Maintenance") {
    return (
      <div className="min-h-screen p-6">
        <div className="bg-white rounded-xl shadow-lg text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600">
            You are not authorized to view this page.
          </p>
        </div>
      </div>
    );
  }

  const teamId = user.teamId;
  const bookings = await pullAllBookings(teamId);

  // Calculate some basic stats
  const totalBookings = bookings.length;
  const upcomingBookings = bookings.filter(
    (b) => new Date(b.firstNight) > new Date()
  ).length;

  return (
    <div className="p-6 px-5">
      <div className="mx-auto">
        <header className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Bookings</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 rounded-lg p-4 flex items-center">
              <Hotel className="text-blue-500 mr-4" style={{ fontSize: 40 }} />
              <div>
                <p className="text-sm text-gray-500">Total Bookings</p>
                <p className="text-2xl font-semibold">{totalBookings}</p>
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 flex items-center">
              <TrendingUp
                className="text-green-500 mr-4"
                style={{ fontSize: 40 }}
              />
              <div>
                <p className="text-sm text-gray-500">Upcoming Bookings</p>
                <p className="text-2xl font-semibold">{upcomingBookings}</p>
              </div>
            </div>
          </div>
        </header>

        <AllBookings bookings={bookings} />
      </div>
    </div>
  );
};

export default Bookings;
