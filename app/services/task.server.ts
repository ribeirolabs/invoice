import { Task } from "@prisma/client";
import prisma from "./prisma.server";

export async function getPendingTasks(userId: string): Promise<Task[]> {
  const tasks = await prisma.task.findMany({
    where: {
      userId,
    },
  });

  return tasks;
}
