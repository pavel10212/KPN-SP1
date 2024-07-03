import { redirect } from "next/navigation";
import { auth } from "@/auth.js";
import Card from "../../components/dashboard/card/card";
import { cards } from "@/lib/data";
import BookingToday from "../../components/dashboard/bookingToday/bookingToday";
import TodayTask from "../../components/dashboard/todayTask/todayTask";
import { tasksToday } from "@/lib/data";
import { pullFromDatabaseForDash } from "@/lib/actions";

export default async function Dashboard() {
  const session = await auth();
  const bookingsToday = await pullFromDatabaseForDash();
  console.log(bookingsToday)
  console.log(session);

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
        <BookingToday bookings={bookingsToday} />
        <TodayTask tasks={tasksToday} />
      </div>
    </div>
  );
}
