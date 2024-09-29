import prisma from "@/app/api/prismaClient";
import TaskAdmin from "@/components/tasksAdmin/tasksAdmin";
import {auth} from "@/auth";
import CustomTask from "@/components/customTaskAdmin/customTask";
import MainTasks from "@/components/mainTasksReadOnlyComponent/mainTasksReadOnlyComponent";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {MdAdd} from "react-icons/md";
import {findUserByEmail} from "@/lib/utils";

const Task = async () => {
    const session = await auth();
    const user = await findUserByEmail(session.user.email);
    const userTeamId = user.teamId;

    const tasks = await prisma.booking.findMany({
        where: {
            teamId: userTeamId,
        },
        select: {
            id: true,
            roomId: true,
            guestFirstName: true,
            guestName: true,
            firstNight: true,
            lastNight: true,
            cleanStatus: true,
            customNotes: true,
            status: true,
        },
    });

    let customTasks;
    if (user.role === "admin" || user.role === "Co-Host") {
        customTasks = await prisma.customTask.findMany({
            select: {
                id: true,
                taskTitle: true,
                guestFirstName: true,
                guestName: true,
                guestPhone: true,
                location: true,
                taskDescription: true,
                date: true,
                status: true,
                role: true,
            },
        });
    } else {
        customTasks = await prisma.customTask.findMany({
            where: {
                role: user.role,
            },
            select: {
                id: true,
                taskTitle: true,
                guestFirstName: true,
                guestName: true,
                guestPhone: true,
                location: true,
                taskDescription: true,
                date: true,
                status: true,
                role: true,
            },
        });
    }

    const renderContent = () => {
        if (user.role === "admin" || user.role === "Co-Host") {
            return (
                <>
                    <div className="bg-white rounded-xl shadow-md mb-6 overflow-hidden">
                        <div className="px-4 pt-4">
                            <h2 className="text-2xl font-semibold text-gray-800">
                                Main Tasks
                            </h2>
                        </div>
                        <TaskAdmin tasks={tasks}/>
                    </div>
                    <div className="bg-white rounded-xl shadow-md mb-6 overflow-hidden">
                        <div className="flex justify-between items-center px-4 pt-4">
                            <h2 className="text-2xl font-semibold text-gray-800">
                                Custom Tasks
                            </h2>
                            <Link href="/dashboard/task/addTask">
                                <Button
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-1 sm:py-2 px-2 sm:px-4 text-xs sm:text-base rounded-lg flex items-center transition duration-300">
                                    <MdAdd className="mr-1 sm:mr-2"/>
                                    <span className="hidden sm:inline">Add Custom Task</span>
                                    <span className="sm:hidden">Add Task</span>
                                </Button>
                            </Link>
                        </div>
                        <CustomTask tasks={customTasks} readOnly={false} isAdmin={true}/>
                    </div>
                </>
            );
        } else if (user.role === "Maid") {
            return (
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="px-4 pt-4">
                        <h2 className="text-2xl font-semibold text-gray-800">
                            Main Tasks
                        </h2>
                    </div>
                    <MainTasks tasks={tasks}/>
                </div>
            )

        } else if (user.role === "Driver" || user.role === "Maintenance") {
            return (
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="px-4 pt-4">
                        <h2 className="text-2xl font-semibold text-gray-800">
                            Custom Tasks
                        </h2>
                    </div>
                    <CustomTask tasks={customTasks} readOnly={false} isAdmin={false}/>
                </div>
            );
        } else {
            return (
                <div className="bg-white rounded-xl shadow-md p-6">
                    <p className="text-red-600 font-semibold text-lg">Access Denied</p>
                </div>
            );
        }
    };

    return (
        <div className="min-h-screen">
            <div className="mx-auto px-0 sm:px-6">{renderContent()}</div>
        </div>
    );
};

export default Task;
