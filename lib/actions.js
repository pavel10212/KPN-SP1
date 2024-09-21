import prisma from "@/app/api/prismaClient.js";

export async function pullFromDatabase(teamId, sort) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayISO = today.toISOString();
    const bookings = await prisma.booking.groupBy({
        by: ["guestFirstName", "guestName", "roomId", "status"],
        _min: {
            firstNight: true,
        },
        _max: {
            lastNight: true,
        },
        orderBy: {
            [sort === "firstNight" ? "_min" : "_max"]: {
                [sort]: "asc",
            },
        },
        where: {
            AND: [
                {
                    [sort]: {
                        gte: todayISO,
                    },
                },
                {
                    teamId: teamId,
                },
            ],
        },
        take: 5,
    });
    const transformedBookings = bookings.map((booking) => ({
        guestFirstName: `${booking.guestFirstName} ${booking.guestName}`,
        roomId: booking.roomId,
        firstNight: booking._min.firstNight,
        lastNight: booking._max.lastNight,
        status: booking.status,
    }));

    return transformedBookings;
}

export async function pullAllBookings(teamId) {
    const bookings = await prisma.booking.findMany({
        where: {
            teamId: teamId,
        },
    });
    return bookings;
}

export async function pullCustomBookings(role) {
    const tasks = await prisma.customTask.findMany({
        where: {
            role: role,
        },
    });
    return tasks;
}

export async function refreshBookings(teamId) {
    try {
        const response = await fetch("/api/refreshBookings", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({teamId}),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error refreshing bookings:", error);
        throw error;
    }
}

export async function createBookings(bookingsData, teamId) {
    const createdBookings = await Promise.all(
        bookingsData.map(async (booking) => {
            if (booking.status === "1" || booking.status === "2") {
                try {
                    return await prisma.booking.create({
                        data: {
                            bookId: booking.bookId,
                            roomId: booking.roomId,
                            firstNight: new Date(booking.firstNight),
                            lastNight: new Date(booking.lastNight),
                            numAdult: booking.numAdult,
                            numChild: booking.numChild,
                            guestFirstName: booking.guestFirstName,
                            guestName: booking.guestName,
                            guestEmail: booking.guestEmail,
                            guestPhone: booking.guestPhone,
                            teamId: teamId,
                        },
                    });
                } catch (error) {
                    console.error("Error creating booking:", error);
                    return {error: error.message, booking};
                }
            }
            return null;
        })
    );

    const successfulBookings = createdBookings.filter(booking => booking && !booking.error);
    const failedBookings = createdBookings.filter(booking => booking && booking.error);

    console.log("Created bookings:", successfulBookings);
    if (failedBookings.length > 0) {
        console.error("Failed bookings:", failedBookings);
    }

    return {successfulBookings, failedBookings};
}


