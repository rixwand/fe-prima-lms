import { Button } from "@heroui/react";
import { useRouter } from "next/router";

export default function NoLessonMessage({ courseId }: { courseId?: number }) {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-500">This course has no lessons yet.</h2>
        <p className="mt-2 text-gray-400">Create a new lesson to get started.</p>
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
