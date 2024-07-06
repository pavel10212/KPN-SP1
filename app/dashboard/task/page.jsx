import prisma from "@/app/api/prismaClient";
import TodayTask from "@/components/todayTask/todayTask";
import { auth } from "@/auth";
import CustomTask from "@/components/customTaskList/customTask";

const Task = async () => {
  const user = await auth();
  const userTeam = await prisma.user.findFirst({
    where: {
      email: user.user.email,
    },
  });
  const userTeamId = userTeam.teamId;
  const customTasks = await prisma.customTask.findMany({
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
    },
  });

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
  return (
    <div>
      <TodayTask tasks={tasks} />
      <CustomTask tasks={customTasks} />
    </div>
  );
};

export default Task;
