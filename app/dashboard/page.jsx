import {auth} from "@/auth.js";
import Card from "../../components/dashboard/card/card";
import BookingToday from "../../components/dashboard/bookingToday/bookingToday";
import {pullCustomBookings, pullFromDatabase} from "@/lib/actions";
import prisma from "../api/prismaClient";
import {findUserById} from "@/lib/utils";

export default async function Dashboard() {
    const session = await auth();

    const teamMember = await findUserById(session.user.id);
    const teamId = teamMember.teamId;

    if (["Driver", "Maintenance"].includes(teamMember.role)) {
        return (
            <div className="flex flex-col items-center justify-center">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                    Welcome, {teamMember.role}!
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                    Please proceed to your tasks.
                </p>
                <a
                    href="/dashboard/task"
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
                >
                    Go to Tasks
                </a>
            </div>
        );
    }

    const teamCount = await prisma.user.findMany({where: {teamId}});

    const [check_ins, check_outs] = await Promise.all([
        pullFromDatabase(teamId, "firstNight"),
        pullFromDatabase(teamId, "lastNight"),
        pullCustomBookings(teamMember.role),
    ]);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const filterBookingsByDate = (bookings, dateField) =>
        bookings.filter(
            (booking) =>
                new Date(booking[dateField]).setHours(0, 0, 0, 0) === today.getTime()
        );

    const bookingsStartingToday = filterBookingsByDate(check_ins, "firstNight");
    const bookingsEndingToday = filterBookingsByDate(check_outs, "lastNight");

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

    if (["admin", "Maid", "Co-Host"].includes(teamMember.role)) {
        return (
            <div className="min-h-screen p-3 pb-2 sm:p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 max-w-4xl">
                    {cards.map((card) => (
                        <Card key={card.id} item={card}/>
                    ))}
                </div>
                <div className="space-y-6">
                    <BookingToday
                        bookings={check_ins}
                        isMaid={teamMember.role === "Maid"}
                        checkInOrOut="Upcoming Check-Ins"
                        excludeField="lastNight"
                    />
                    <BookingToday
                        bookings={check_outs}
                        isMaid={teamMember.role === "Maid"}
                        checkInOrOut="Upcoming Check-outs"
                        excludeField="firstNight"
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center text-2xl font-bold text-red-600">
            Access Denied
        </div>
    );
}
