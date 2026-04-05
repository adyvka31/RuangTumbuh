const prisma = require("../config/db");

const createNewCourse = async (data) => {
  const user = await prisma.user.findUnique({ where: { id: data.tutorId } });
  if (!user) {
    const error = new Error("Tutor tidak ditemukan!");
    error.statusCode = 404;
    throw error;
  }

  return await prisma.course.create({
    data: {
      name: data.name,
      tutor: user.name,
      tutorId: data.tutorId,
      kategori: data.kategori,
      durasi: String(data.durasi),
      deskripsi: data.deskripsi,
      modules: data.modules,
    },
  });
};

const getCoursesList = async ({
  tutorId,
  page = 1,
  limit = 6,
  search,
  category,
}) => {
  const pageNumber = parseInt(page);
  const limitNumber = parseInt(limit);
  const skip = (pageNumber - 1) * limitNumber;

  let where = {};
  if (tutorId) where.tutorId = tutorId;
  if (search) where.name = { contains: search, mode: "insensitive" };
  if (category && category !== "Semua") where.kategori = category;

  const [courses, totalItems] = await Promise.all([
    prisma.course.findMany({
      where,
      skip,
      take: limitNumber,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        tutor: true,
        tutorId: true,
        kategori: true,
        durasi: true,
        deskripsi: true,
        createdAt: true,
      },
    }),
    prisma.course.count({ where }),
  ]);

  return {
    courses,
    totalItems,
    totalPages: Math.ceil(totalItems / limitNumber),
    currentPage: pageNumber,
    limit: limitNumber,
  };
};

const getCourseDetail = async (id) => {
  const course = await prisma.course.findUnique({
    where: { id: parseInt(id) },
  });
  if (!course) {
    const error = new Error("Kursus tidak ditemukan!");
    error.statusCode = 404;
    throw error;
  }
  return course;
};

const updateCourseData = async (id, data) => {
  return await prisma.course.update({
    where: { id: parseInt(id) },
    data: {
      name: data.name,
      kategori: data.kategori,
      durasi: String(data.durasi),
      deskripsi: data.deskripsi,
      modules: data.modules || [],
    },
  });
};

const removeCourse = async (id) => {
  return await prisma.course.delete({ where: { id: parseInt(id) } });
};

module.exports = {
  createNewCourse,
  getCoursesList,
  getCourseDetail,
  updateCourseData,
  removeCourse,
};
