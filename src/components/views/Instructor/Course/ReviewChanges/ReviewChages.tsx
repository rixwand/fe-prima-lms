/* eslint-disable @typescript-eslint/no-explicit-any */
import { confirmDialog } from "@/components/commons/Dialog/confirmDialog";
import NotFound from "@/components/commons/NotFound";
import useCourse from "@/hooks/course/useCourse";
import cn from "@/libs/utils/cn";
import { getYouTubeEmbedUrl } from "@/libs/utils/string";
import { Button, Code, Image, Skeleton } from "@heroui/react";
import { Fragment, ReactNode } from "react";
import { LuGlobe, LuTrash2 } from "react-icons/lu";
export default function ReviewChanges({ courseId }: { courseId: number }) {
  const { course, queryPending, queryError, applyDraft } = useCourse(courseId);
  if (!course && !queryPending) return <NotFound error={queryError} />;
  if (queryPending)
    return (
      <section>
        <div className="space-y-6 rounded-2xl border border-slate-200 bg-white shadow-sm p-5 @container">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="space-y-1">
                <Skeleton className="rounded-md h-7 w-32" />
                <div className="grid @3xl:grid-cols-2 grid-cols-1 gap-2">
                  <Skeleton className={cn("rounded-xl w-full", i == 2 ? "h-36" : i >= 3 ? "h-52" : "h-10")} />
                  <Skeleton className={cn("rounded-xl w-full", i == 2 ? "h-36" : i >= 3 ? "h-52" : "h-10")} />
                </div>
              </div>
            ))}
          <div className="w-full flex">
            <div className="space-x-2 flex">
              <Skeleton className="rounded-md h-7 w-24" />
              <Skeleton className="rounded-md h-7 w-24" />
            </div>
          </div>
        </div>
      </section>
    );
  const { metaApproved, metaDraft } = course!;
  const onSaveChanges = () =>
    confirmDialog({ title: "Publish Changes", desc: "The Changes will be publish", onConfirmed: () => applyDraft() });
  return (
    <section>
      <div className="space-y-6 rounded-2xl border border-slate-200 bg-white shadow-sm p-5 @container">
        {FIELDS.map(({ key, label, render }) => (
          <div key={key} className="space-y-1">
            <h3 className="font-medium">{label}</h3>
            <div className="grid @3xl:grid-cols-2 grid-cols-1 gap-2">
              {renderDiff(key, metaApproved[key], metaDraft[key], render)}
            </div>
          </div>
        ))}
        <div className="w-full flex" hidden={!course?.canApplyTierB}>
          <div className="space-x-2 flex">
            <Button
              size="md"
              radius="sm"
              variant="flat"
              color="danger"
              className="font-medium flex gap-x-2 reset-button py-2">
              <LuTrash2 /> Discard Changes
            </Button>
            <Button
              onPress={onSaveChanges}
              size="md"
              radius="sm"
              variant="flat"
              color="success"
              className="font-medium flex gap-x-2 reset-button py-2">
              <LuGlobe /> Publish Changes
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

const Wrapper = ({
  children,
  color,
  prefix,
}: {
  children: ReactNode;
  color?: "success" | "default" | "primary" | "secondary" | "warning" | "danger";
  prefix?: string;
}) => {
  return (
    <Code
      color={color}
      radius="md"
      className={cn(
        "px-3 py-2 whitespace-pre-wrap break-words overflow-hidden",
        !color && "bg-white border border-slate-200",
      )}>
      {prefix && prefix + " "}
      {children}
    </Code>
  );
};

type FieldKey = "title" | "shortDescription" | "descriptionJson" | "coverImage" | "previewVideo";

const FIELDS: {
  key: FieldKey;
  label: string;
  render?: (value: any) => ReactNode;
}[] = [
  { key: "title", label: "Title" },
  { key: "shortDescription", label: "Subtitle" },
  {
    key: "descriptionJson",
    label: "Description",
    render: value =>
      typeof value == "object" ? (
        <pre className="text-xs whitespace-pre-wrap break-words">{JSON.stringify(value, null, 2)}</pre>
      ) : (
        value
      ),
  },
  {
    key: "coverImage",
    label: "Cover Image",
    render: value =>
      value ? (
        <Image src={value} alt="cover" radius="md" className="aspect-video w-full max-w-sm object-cover -mt-5" />
      ) : (
        "—"
      ),
  },

  {
    key: "previewVideo",
    label: "Preview Video",
    render: value =>
      value ? (
        <div className="aspect-video w-full max-w-sm overflow-hidden rounded-md border">
          <iframe
            src={getYouTubeEmbedUrl(value as string) || ""}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        "—"
      ),
  },
];

const jsonEqual = (a: any, b: any) => JSON.stringify(a) === JSON.stringify(b);

function renderDiff(key: FieldKey, approved: any, draft: any, render?: (value: any) => ReactNode) {
  const same = key === "descriptionJson" ? jsonEqual(approved, draft) : approved === draft;

  if (same) {
    return <Wrapper>{render ? render(approved) : approved}</Wrapper>;
  }

  return (
    <Fragment>
      <Wrapper prefix="-" color="danger">
        {render ? render(approved) : approved}
      </Wrapper>
      <Wrapper prefix="+" color="success">
        {render ? render(draft) : draft}
      </Wrapper>
    </Fragment>
  );
}
