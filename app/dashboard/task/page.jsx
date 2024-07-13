import prisma from "@/app/api/prismaClient";
import TaskAdmin from "@/components/tasksAdmin/tasksAdmin";
import { auth } from "@/auth";
import CustomTaskAdmin from "@/components/customTaskAdmin/customTaskAdmin";
import MainTasksReadOnly from "@/components/mainTasksReadOnlyComponent/mainTasksReadOnlyComponent";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MdAdd } from "react-icons/md";

const Task = async () => {
  const session = await auth();
  const user = await prisma.user.findFirst({
    where: {
      email: session.user.email,
    },
  });
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
      customNotes: true,
      status: true,
    },
  });

  let customTasks;
  if (user.role === "admin") {
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
    if (user.role === "admin") {
      return (
        <>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Main Tasks
            </h2>
            <TaskAdmin tasks={tasks} />
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Custom Tasks
            </h2>
            <CustomTaskAdmin tasks={customTasks} isAdmin={true} />
          </div>
        </>
      );
    } else if (user.role === "Maid" || user.role === "Co-Host") {
      return (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Tasks</h2>
          <MainTasksReadOnly tasks={tasks} canEditStatus={true} />
        </div>
      );
    } else if (user.role === "Driver" || user.role === "Maintenance") {
      return (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Tasks</h2>
          <CustomTaskAdmin tasks={customTasks} readOnly={true} />
        </div>
      );
    } else {
      return (
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-red-600 font-semibold text-lg">Access Denied</p>
        </div>
      );
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="mx-auto px-4 sm:px-6 py-8 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl ">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Tasks</h1>
          {user.role === "admin" && (
            <Link href="/dashboard/task/addTask">
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg flex items-center transition duration-300">
                <MdAdd className="mr-2" />
                Add Custom Task
              </Button>
            </Link>
          )}
        </div>
        {renderContent()}
      </div>
    </div>
  );
};

export default Task;
