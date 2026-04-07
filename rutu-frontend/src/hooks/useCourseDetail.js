import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import api from "@/utils/api";
import { getCourseExtras } from "@/constants/courseData";

export const useCourseDetail = () => {
  const { id } = useParams();

  const {
    data: courseData,
    isLoading: loading,
    isError,
  } = useQuery({
    queryKey: ["courseDetail", id],
    queryFn: async () => {
      const data = await api.get(`/courses/${id}`);
      const extras = getCourseExtras(data.kategori);

      return {
        id: data.id,
        title: data.name,
        category: data.kategori,
        instructor: data.tutor,
        instructorRole: "Expert Mentor",
        rating: 5.0,
        reviews: 0,
        timePrice: data.durasi + " Menit",
        color: extras.color,
        description: data.deskripsi,
        thumbnail: extras.image,
        details: {
          duration: data.durasi + " Menit",
          modules: data.modules?.length || 0,
          level: "Semua Level",
          certificate: true,
        },
        syllabus:
          data.modules?.length > 0
            ? data.modules.map((m, idx) => ({
                id: idx + 1,
                title: m.title,
                duration: m.duration + " Menit",
                isFree: idx === 0,
              }))
            : [],
      };
    },
    enabled: !!id,
  });

  return {
    id,
    courseData,
    loading,
    isError,
  };
};
