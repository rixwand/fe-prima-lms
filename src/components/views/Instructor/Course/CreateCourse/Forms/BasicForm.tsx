import { useState } from "react";
import { LuImage, LuUpload } from "react-icons/lu";
import Field from "./Field";

export default function BasicsForm({
  value,
  onChange,
}: {
  value: NewCourseBasics;
  onChange: (v: NewCourseBasics) => void;
}) {
  const [tagInput, setTagInput] = useState("");

  const set = (k: keyof NewCourseBasics, v: any) => onChange({ ...value, [k]: v });

  const addTag = () => {
    const t = tagInput.trim();
    if (!t) return;
    if (value.tags.includes(t)) return setTagInput("");
    onChange({ ...value, tags: [...value.tags, t] });
    setTagInput("");
  };

  const removeTag = (t: string) => onChange({ ...value, tags: value.tags.filter(x => x !== t) });

  const onThumbPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    set("thumbnail", url);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label="Title" hint="At least 5 characters" required>
          <input
            value={value.title}
            onChange={e => set("title", e.target.value)}
            placeholder="e.g., Build a Full-Stack LMS with Next.js"
            className="w-full h-11 px-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          />
        </Field>
        <Field label="Subtitle">
          <input
            value={value.subtitle}
            onChange={e => set("subtitle", e.target.value)}
            placeholder="A concise one-liner that sells the value"
            className="w-full h-11 px-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label="Category">
          <select
            value={value.category}
            onChange={e => set("category", e.target.value)}
            className="w-full h-11 px-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30">
            <option>Development</option>
            <option>Design</option>
            <option>Business</option>
            <option>Photography</option>
            <option>Music</option>
          </select>
        </Field>
        <div className="grid grid-cols-2 gap-5">
          <Field label="Level">
            <select
              value={value.level}
              onChange={e => set("level", e.target.value as any)}
              className="w-full h-11 px-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30">
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </Field>
          <Field label="Language">
            <select
              value={value.language}
              onChange={e => set("language", e.target.value)}
              className="w-full h-11 px-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30">
              <option>English</option>
              <option>Bahasa Indonesia</option>
              <option>Español</option>
              <option>Français</option>
              <option>Deutsch</option>
            </select>
          </Field>
        </div>
      </div>

      <Field label="Description" hint="At least 20 characters" required>
        <textarea
          value={value.description}
          onChange={e => set("description", e.target.value)}
          rows={6}
          placeholder="Describe what students will learn, requirements, and outcomes."
          className="w-full resize-y p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
        />
      </Field>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label="Thumbnail">
          <div className="rounded-xl border border-dashed border-slate-300 p-4 flex items-center gap-4">
            <div className="w-28 aspect-video rounded-lg overflow-hidden bg-slate-100 grid place-items-center">
              {value.thumbnail ? (
                <img src={value.thumbnail} alt="thumb" className="w-full h-full object-cover" />
              ) : (
                <LuImage className="w-6 h-6 text-slate-400" />
              )}
            </div>
            <div className="space-y-2">
              <label className="inline-flex items-center gap-2 px-3 h-10 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <LuUpload className="w-4 h-4" />
                <span>Upload</span>
                <input type="file" accept="image/*" className="hidden" onChange={onThumbPick} />
              </label>
              <p className="text-xs text-slate-500">JPG/PNG, 1280×720 recommended</p>
            </div>
          </div>
        </Field>

        <Field label="Tags">
          <div className="flex flex-wrap items-center gap-2">
            {value.tags.map(t => (
              <span
                key={t}
                className="inline-flex items-center gap-2 px-2.5 h-9 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                #{t}
                <button onClick={() => removeTag(t)} className="text-slate-500 hover:text-slate-700">
                  ×
                </button>
              </span>
            ))}
            <input
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addTag())}
              placeholder="Add tag and press Enter"
              className="flex-1 min-w-[160px] h-9 px-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
          </div>
        </Field>
      </div>
    </div>
  );
}
