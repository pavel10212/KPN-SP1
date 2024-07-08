import prisma from "@/app/api/prismaClient";
import TaskAdmin from "@/components/tasksAdmin/tasksAdmin";
import { auth } from "@/auth";
import CustomTaskAdmin from "@/components/customTaskAdmin/customTaskAdmin";
import MainTasksReadOnly from "@/components/mainTasksReadOnlyComponent/mainTasksReadOnlyComponent";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
    // Fetch all custom tasks for admin
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
    // Fetch only role-specific tasks for other users
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

  if (user.role === "admin") {
    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Tasks</h1>
          <Link href="/dashboard/task/addTask/page.jsx">
            <Button>Add Custom Task</Button>
          </Link>
        </div>
        <TaskAdmin tasks={tasks} />
        <CustomTaskAdmin tasks={customTasks} isAdmin={true} />
      </div>
    );
  } else if (user.role === "Maid" || user.role === "Co-Host") {
    return (
      <div>
        <MainTasksReadOnly tasks={tasks} canEditStatus={true} />
      </div>
    );
  } else if (user.role === "Driver" || user.role === "Maintenance") {
    return (
      <div>
        <CustomTaskAdmin tasks={customTasks} readOnly={true} />
      </div>
    );
  } else {
    return <div>Access Denied</div>;
  }
};

export default Task;
