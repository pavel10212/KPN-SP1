"use client";

import { auth } from "@/auth"
import Card from "../../components/dashboard/card/card"
import { cards } from "@/lib/data"
import BookingToday from "../../components/dashboard/bookingToday/bookingToday"
import { bookingsToday } from "@/lib/data"
import TodayTask from "../../components/dashboard/todayTask/todayTask"
import { tasksToday } from "@/lib/data"

export default async function Dashboard() {
  const session = await auth()
  console.log(session)
  if (!session) {
    return <p>Access Denied</p>
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
  )
}