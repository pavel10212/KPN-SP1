import { redirect } from "next/navigation";
import { auth } from "@/auth.js";
import Card from "../../components/dashboard/card/card";
import BookingToday from "../../components/dashboard/bookingToday/bookingToday";
import TodayTask from "../../components/dashboard/todayTask/todayTask";
import { tasksToday } from "@/lib/data";
import { pullFromDatabaseForDash } from "@/lib/actions";
import prisma from "../api/prismaClient";

export default async function Dashboard() {
  const session = await auth();
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
  const bookings = await pullFromDatabaseForDash();
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set time to 00:00:00.000 to match the format of firstNight
  const todayISO = today.toISOString();
  const bookingsStartingToday = bookings.filter(
    (booking) => booking.firstNight === todayISO
  );
  console.log(bookingsStartingToday);
  const bookingsEndingToday = bookings.filter(
    (booking) => booking.lastNight === todayISO
  );

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

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex gap-5 mt-5">
      <div className="flex-3 flex flex-col g-5 w-full">
        <div className="flex gap-5 mb-10 w-[40%]">
          {cards.map((card) => (
            <Card key={card.id} item={card} />
          ))}
        </div>
        <BookingToday bookings={bookings} />
        <TodayTask tasks={tasksToday} />
      </div>
    </div>
  );
}
