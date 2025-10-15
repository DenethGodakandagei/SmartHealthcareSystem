import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createReport = async (data: any) => {
  return prisma.report.create({ data });
};

export const getReports = async (filter: any) => {
  return prisma.report.findMany({
    where: filter,
    orderBy: { createdAt: "desc" },
  });
};

export const getReportData = async (filter: any) => {
  // Example: aggregate patients, staff, resources
  const patients = await prisma.patient.findMany({
    where: { admissionDate: { gte: filter.start, lte: filter.end } },
  });

  const staffWorkload = await prisma.staff.findMany({
    select: { department: true, workload: true },
  });

  const resources = await prisma.resource.findMany({
    select: { resource: true, utilization: true },
  });

  return { patients, staffWorkload, resources };
};
