import { LuBookmark } from "react-icons/lu";

export default function QuizTopicsCovered({ topics }: { topics: string[] }) {
  return (
    <div>
      <div className="mb-5 flex items-center gap-2">
        <LuBookmark className="text-primary" />
        <h3 className="font-semibold">Topik Pembahasan</h3>
      </div>

      <div className="flex flex-wrap gap-3">
        {topics.map(topic => (
          <span
            className="p-3 py-2.5 bg-primary-50 rounded-lg text-primary border border-primary-200 text-sm font-medium h-fit"
            key={topic}>
            {topic}
          </span>
        ))}
      </div>
    </div>
  );
}
