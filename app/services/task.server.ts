import { Task, TaskSubject } from "@prisma/client";
import prisma from "./prisma.server";

export async function getPendingTasks(userId: string): Promise<Task[]> {
  const tasks = await prisma.task.findMany({
    where: {
      userId,
    },
  });

  return tasks;
}

export async function populateInitialTasks(userId: string): Promise<void> {
  await prisma.task.create({
    data: {
      userId,
      subject: TaskSubject.MissingCompanies,
    },
  });
}
