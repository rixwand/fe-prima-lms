import TextField from "@/components/commons/TextField";
import { toSlug } from "@/libs/utils/string";
import { Button, Chip } from "@heroui/react";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { IoClose } from "react-icons/io5";
import { LuUndo2 } from "react-icons/lu";
export default function TagsForm({ tags: defaultTags }: { tags: Tag[] }) {
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<Omit<Tag, "tagId">[]>(defaultTags.map(({ tagId: _id, ...tag }) => tag));
  const {
    formState: { errors, dirtyFields },
    watch,
    setValue,
  } = useFormContext<EditCourseForm>();

  const reset = () => {
    setTags(defaultTags.map(({ tagId, ...tag }) => tag));
    setValue("tags", undefined, { shouldDirty: true });
    setTagInput("");
  };

  const [tagsObj, c, d] = watch(["tags", "tags.createOrConnect", "tags.disconnectSlugs"]);
  useEffect(() => {
    if (!tagsObj) return;
    if (d && d.length == 0) {
      Reflect.deleteProperty(tagsObj, "disconnectSlugs");
    }
    if (c && c.length == 0) {
      Reflect.deleteProperty(tagsObj, "createOrConnect");
    }
    if (Reflect.ownKeys(tagsObj).length == 0) {
      setValue("tags", undefined, { shouldDirty: true });
    }
  }, [tagsObj, setValue, c, d]);

  const addTag = () => {
    const t = tagInput.trim();
    if (!t) return;
    if (tags.filter(tag => tag.tagSlug === toSlug(t)).length > 0) return setTagInput("");
    if (tagsObj?.disconnectSlugs && tagsObj.disconnectSlugs.includes(toSlug(t))) {
      setValue(
        "tags.disconnectSlugs",
        tagsObj.disconnectSlugs.filter(s => s !== toSlug(t)),
        { shouldDirty: true }
      );
    }
    setTags(tags => [...tags, { tagName: t, tagSlug: toSlug(t) }]);
    if (defaultTags.filter(dt => dt.tagName === t).length === 0) {
      setValue("tags.createOrConnect", [...(tagsObj?.createOrConnect ? tagsObj.createOrConnect : []), t], {
        shouldDirty: true,
      });
    }
    setTagInput("");
  };

  const removeTag = ({ title, slug }: { title: string; slug: string }) => {
    if (tagsObj?.createOrConnect && tagsObj.createOrConnect.includes(title)) {
      setValue(
        "tags.createOrConnect",
        tagsObj.createOrConnect.filter(t => t !== title),
        { shouldDirty: true }
      );
    } else {
      setValue("tags.disconnectSlugs", [...(tagsObj?.disconnectSlugs ? tagsObj.disconnectSlugs : []), slug], {
        shouldDirty: true,
      });
    }

    setTags(tags => tags.filter(t => t.tagSlug !== slug));
  };

  return (
    <div className="space-y-6 rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
      <div className="flex flex-col gap-3">
        <TextField
          error={errors.tags?.message}
          classNames={{ wrapper: "flex flex-col" }}
          id="tags"
          label="Tags"
          value={tagInput}
          onChange={e => setTagInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addTag())}
          placeholder="add tag and press enter"
        />
        <span className="flex flex-wrap gap-3">
          {tags.map(({ tagName, tagSlug }) => (
            <Chip
              className="mb-1"
              variant="bordered"
              color="primary"
              key={tagSlug}
              endContent={<IoClose />}
              onClose={() => removeTag({ slug: tagSlug, title: tagName })}>
              {tagName}
            </Chip>
          ))}
        </span>
      </div>
      {Object.hasOwn(dirtyFields, "tags") && (
        <Button color="danger" onPress={reset} className="h-9" variant="flat" radius="sm">
          <LuUndo2 /> Reset
        </Button>
      )}
    </div>
  );
}
