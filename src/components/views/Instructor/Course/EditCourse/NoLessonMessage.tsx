import { Button } from "@heroui/react";
import { useRouter } from "next/router";

export default function NoLessonMessage({
  courseId,
  desc,
  title,
}: {
  courseId?: number;
  title?: string;
  desc?: string;
}) {
  const router = useRouter();
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-700">{title || "This course has no lessons yet."}</h2>
        <p className="mt-2 text-gray-600">{desc || "Create a new lesson to get started."}</p>
        {courseId && (
          <Button
            variant="shadow"
            color="primary"
            onPress={() => router.push(`/instructor/dashboard/edit-course/${courseId}?tabs=curriculum`)}
            className="mt-4">
            Go to Curriculum editor
          </Button>
        )}
      </div>
    </div>
  );
}
