import {auth} from "@/auth";
import prisma from "@/app/api/prismaClient";
import {pullAllBookings} from "@/lib/actions";
import BookingsClient from "@/components/BookingsClient/BookingsClient";

export default async function BookingsPage() {
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

    const initialBookings = await pullAllBookings(user.teamId);

    return <BookingsClient initialBookings={initialBookings} user={user}/>;
}