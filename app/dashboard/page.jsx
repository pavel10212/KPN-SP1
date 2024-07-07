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
    },
    {
      id: 2,
      title: "Total Check-ins Today",
      number: bookingsStartingToday.length,
    },
    {
      id: 3,
      title: "Total Check-outs Today",
      number: bookingsEndingToday.length,
    },
  ];

  if (
    teamMember.role === "admin" ||
    teamMember.role === "Maid" ||
    teamMember.role === "Co-Host"
  ) {
    return (
      <>
        <div className="flex gap-5 mt-5">
          <div className="flex-3 flex flex-col g-5 w-full">
            <div className="flex gap-5 mb-10 w-[40%]">
              {cards.map((card) => (
                <Card key={card.id} item={card} />
              ))}
            </div>
          </div>
        </div>
        <div>
          <BookingToday bookings={check_ins} checkInOrOut="Check Ins Today" />
          <BookingToday bookings={check_outs} checkInOrOut="Check Outs Today" />
        </div>
      </>
    );
  } else if (
    teamMember.role === "Driver" ||
    teamMember.role === "Maintenance"
  ) {
    return (
      <div className="mt-5">
        <DriverMaintenanceTasks user={teamMember} userTasks={userTasks} />
      </div>
    );
  }

  return <div>Access Denied</div>;
}
