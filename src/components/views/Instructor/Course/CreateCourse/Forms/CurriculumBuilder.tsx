import { LuChevronDown, LuChevronUp, LuPlus, LuTrash2 } from "react-icons/lu";

export default function CurriculumBuilder({
  value,
  onChange,
}: {
  value: CurriculumSection[];
  onChange: (v: CurriculumSection[]) => void;
}) {
  const addSection = () => {
    const id = `s_${Math.random().toString(36).slice(2, 7)}`;
    onChange([...value, { id, title: `Section ${value.length + 1}`, lessons: [] }]);
  };

  const renameSection = (id: string, title: string) => onChange(value.map(s => (s.id === id ? { ...s, title } : s)));
  const moveSection = (id: string, dir: -1 | 1) => {
    const idx = value.findIndex(s => s.id === id);
    const to = idx + dir;
    if (to < 0 || to >= value.length) return;
    const next = [...value];
    const [spliced] = next.splice(idx, 1);
    next.splice(to, 0, spliced);
    onChange(next);
  };
  const removeSection = (id: string) => onChange(value.filter(s => s.id !== id));

  const addLesson = (sid: string) => {
    const l = { id: `l_${Math.random().toString(36).slice(2, 7)}`, title: "New Lesson", kind: "video" as const };
    onChange(value.map(s => (s.id === sid ? { ...s, lessons: [...s.lessons, l] } : s)));
  };
  const updateLesson = (sid: string, lid: string, patch: Partial<CurriculumSection["lessons"][number]>) =>
    onChange(
      value.map(s =>
        s.id === sid ? { ...s, lessons: s.lessons.map(l => (l.id === lid ? { ...l, ...patch } : l)) } : s
      )
    );
  const moveLesson = (sid: string, lid: string, dir: -1 | 1) => {
    const sec = value.find(s => s.id === sid);
    if (!sec) return;
    const idx = sec.lessons.findIndex(l => l.id === lid);
    const to = idx + dir;
    if (to < 0 || to >= sec.lessons.length) return;
    const nextLessons = [...sec.lessons];
    const [spliced] = nextLessons.splice(idx, 1);
    nextLessons.splice(to, 0, spliced);
    onChange(value.map(s => (s.id === sid ? { ...s, lessons: nextLessons } : s)));
  };
  const removeLesson = (sid: string, lid: string) =>
    onChange(value.map(s => (s.id === sid ? { ...s, lessons: s.lessons.filter(l => l.id !== lid) } : s)));

  return (
    <div className="space-y-4">
      {value.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center">
          <p className="text-slate-600 mb-4">No sections yet. Organize your lessons into sections.</p>
          <button
            onClick={addSection}
            className="inline-flex items-center gap-2 px-4 h-10 rounded-xl bg-blue-600 text-white font-medium">
            <LuPlus className="w-4 h-4" /> Add Section
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {value.map((s, i) => (
            <div key={s.id} className="rounded-xl border border-slate-200 overflow-hidden">
              <div className="flex items-center gap-2 p-4 bg-slate-50 border-b border-slate-200">
                <input
                  value={s.title}
                  onChange={e => renameSection(s.id, e.target.value)}
                  className="flex-1 bg-transparent font-medium focus:outline-none"
                />
                <div className="flex items-center gap-2">
                  <button onClick={() => moveSection(s.id, -1)} className="p-1.5 rounded-lg hover:bg-slate-200">
                    <LuChevronUp className="w-4 h-4" />
                  </button>
                  <button onClick={() => moveSection(s.id, 1)} className="p-1.5 rounded-lg hover:bg-slate-200">
                    <LuChevronDown className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removeSection(s.id)}
                    className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-600">
                    <LuTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Lessons */}
              <div className="p-4 space-y-3">
                {s.lessons.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-slate-300 p-6 text-sm text-slate-600 text-center">
                    No lessons yet.
                  </div>
                ) : (
                  s.lessons.map(l => (
                    <div
                      key={l.id}
                      className="grid grid-cols-1 md:grid-cols-12 gap-3 p-3 rounded-lg border border-slate-200">
                      <div className="md:col-span-5">
                        <input
                          value={l.title}
                          onChange={e => updateLesson(s.id, l.id, { title: e.target.value })}
                          className="w-full h-10 px-3 rounded-lg border border-slate-200"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <select
                          value={l.kind}
                          onChange={e => updateLesson(s.id, l.id, { kind: e.target.value as any })}
                          className="w-full h-10 px-3 rounded-lg border border-slate-200">
                          <option value="video">Video</option>
                          <option value="article">Article</option>
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <input
                          type="number"
                          min={0}
                          value={l.durationMin ?? 0}
                          onChange={e => updateLesson(s.id, l.id, { durationMin: Number(e.target.value) })}
                          className="w-full h-10 px-3 rounded-lg border border-slate-200"
                          placeholder="min"
                        />
                      </div>
                      <div className="md:col-span-3 flex items-center gap-2">
                        <label className="inline-flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={l.preview || false}
                            onChange={e => updateLesson(s.id, l.id, { preview: e.target.checked })}
                          />
                          Mark as preview
                        </label>
                        <div className="ml-auto flex items-center gap-1">
                          <button
                            onClick={() => moveLesson(s.id, l.id, -1)}
                            className="p-1.5 rounded-lg hover:bg-slate-100">
                            <LuChevronUp className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => moveLesson(s.id, l.id, 1)}
                            className="p-1.5 rounded-lg hover:bg-slate-100">
                            <LuChevronDown className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => removeLesson(s.id, l.id)}
                            className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-600">
                            <LuTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <div>
                  <button
                    onClick={() => addLesson(s.id)}
                    className="inline-flex items-center gap-2 px-3 h-9 rounded-lg border border-slate-200 hover:bg-slate-50 text-sm">
                    <LuPlus className="w-4 h-4" /> Add Lesson
                  </button>
                </div>
              </div>
            </div>
          ))}
          <div className="pt-2">
            <button
              onClick={addSection}
              className="inline-flex items-center gap-2 px-4 h-10 rounded-xl bg-blue-600 text-white font-medium">
              <LuPlus className="w-4 h-4" /> Add Section
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
