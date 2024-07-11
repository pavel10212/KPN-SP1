import { redirect } from "next/navigation";
import { auth } from "@/auth.js";
import Card from "../../components/dashboard/card/card";
import BookingToday from "../../components/dashboard/bookingToday/bookingToday";
import { pullFromDatabase, pullCustomBookings } from "@/lib/actions";
import prisma from "../api/prismaClient";
import DriverMaintenanceTasks from "@/components/driverMaintenanceTasks/driverMaintenanceTasks";

export default async function Dashboard() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  const teamMember = await prisma.user.findFirst({
    where: {
      email: session.user.email,
    },
  });
  const teamId = teamMember.teamId;
  const teamCount = await prisma.user.findMany({
    where: {
      teamId: teamId,
    },
  });

  const check_ins = await pullFromDatabase(teamId, "firstNight");
  const check_outs = await pullFromDatabase(teamId, "lastNight");
  const userTasks = await pullCustomBookings(teamMember.role);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const bookingsStartingToday = check_ins.filter((booking) => {
    const bookingStartDate = new Date(booking.firstNight);
    bookingStartDate.setHours(0, 0, 0, 0);
    return bookingStartDate.getTime() === today.getTime();
  });

  const bookingsEndingToday = check_outs.filter((booking) => {
    const bookingEndDate = new Date(booking.lastNight);
    bookingEndDate.setHours(0, 0, 0, 0);
    return bookingEndDate.getTime() === today.getTime();
  });

  const cards = [
    {
      id: 1,
      title: "Total Team Members",
      number: teamCount.length,
      icon: "👥",
    },
    {
      id: 2,
      title: "Check-ins Today",
      number: bookingsStartingToday.length,
      icon: "🛎️",
    },
    {
      id: 3,
      title: "Check-outs Today",
      number: bookingsEndingToday.length,
      icon: "🔑",
    },
  ];

  if (
    teamMember.role === "admin" ||
    teamMember.role === "Maid" ||
    teamMember.role === "Co-Host"
  ) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {cards.map((card) => (
            <Card key={card.id} item={card} />
          ))}
        </div>
        <div className="space-y-6">
          <BookingToday bookings={check_ins} checkInOrOut="Today's Check-ins" />
          <BookingToday bookings={check_outs} checkInOrOut="Today's Check-outs" />
        </div>
      </div>
    );
  } else if (
    teamMember.role === "Driver" ||
    teamMember.role === "Maintenance"
  ) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Task Dashboard
        </h1>
        <DriverMaintenanceTasks user={teamMember} userTasks={userTasks} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center text-2xl font-bold text-red-600">
      Access Denied
    </div>
  );
}