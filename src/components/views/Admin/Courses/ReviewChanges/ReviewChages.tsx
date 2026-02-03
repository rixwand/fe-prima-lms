import FormWrapperDialog from "@/components/commons/Dialog/FormDialog";
import { confirmDialog } from "@/components/commons/Dialog/confirmDialog";
import RejectCourseForm, { NotesForm } from "@/components/commons/Forms/RejectCourseForm/RejectCourseForm";
import NoResult from "@/components/commons/NoResult";
import NotFound from "@/components/commons/NotFound";
import useCourse from "@/hooks/course/useCourse";
import usePublishCourses from "@/hooks/course/useListPublishRequest";
import cn from "@/libs/utils/cn";
import { convertLocal } from "@/libs/utils/currency";
import { formatDate } from "@/libs/utils/string";
import { Button, Chip, Skeleton, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/react";
import { useRouter } from "next/router";
import { Fragment, ReactNode, useMemo } from "react";
import { useForm } from "react-hook-form";
import { LuCircleX, LuGlobe } from "react-icons/lu";
export default function ReviewChanges({ courseId }: { courseId: number }) {
  const router = useRouter();
  const redirect = () => router.push("/admin/dashboard/course");
  const { course, queryPending } = useCourse(courseId);
  const { approveCourse, rejectCourse } = usePublishCourses({
    onApproveSuccess: redirect,
    onRejectSuccess: redirect,
  });
  const notesMethods = useForm<NotesForm>();
  if (!course && !queryPending) return <NotFound />;
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
  const {
    metaDraft,
    metaDraft: { isFree, priceAmount },
    metaApproved,
    ...approvedCourse
  } = course!;
  const approved = {
    ...metaApproved,
    ...approvedCourse,
  };
  const draft = {
    isFree,
    priceAmount,
    discounts: metaDraft.draftDiscounts,
    categories: metaDraft.draftCategories,
    tags: metaDraft.draftTags,
  };
  const onRejectChanges = () =>
    FormWrapperDialog({
      title: "Reject Course Changes",
      content: (
        <RejectCourseForm
          methods={notesMethods}
          courseTitle={course?.metaApproved.title as string}
          description="The Changes will be rejected, and published course remain unchange"
        />
      ),
      onSubmit: async () =>
        rejectCourse({ notes: notesMethods.getValues("notes"), reqId: course?.publishRequest?.id as number }),
    });

  const onSaveChanges = () =>
    confirmDialog({
      title: "Publish Changes",
      desc: "The Changes will be publish",
      onConfirmed: () => approveCourse(course?.publishRequest?.id as number),
    });
  return (
    <section>
      <div className="space-y-6 rounded-2xl border border-slate-200 bg-white shadow-sm p-5 @container">
        {course?.publishRequest?.status != "PENDING" ? (
          <NoResult title="No Changes Found" description="No current changes need to review" />
        ) : (
          <div className="space-y-2">
            <DiscountsTable approved={approved["discounts"] || []} draft={draft["discounts"] || []} />
            {draft["priceAmount"] == approved["priceAmount"] ? null : (
              <Fragment>
                <div className="grid @3xl:grid-cols-2 grid-cols-1 gap-2">
                  <div>
                    <h3 className="font-medium mb-1">Current Price Amount</h3>
                    <PriceField
                      price={approved["priceAmount"]}
                      discounts={approved["discounts"] || []}
                      color="danger"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">New Price Amount</h3>
                    <PriceField price={draft["priceAmount"]} discounts={draft["discounts"] || []} color="success" />
                  </div>
                </div>
              </Fragment>
            )}
            <TagsField approved={approved["tags"]} draft={draft["tags"]} />
            <CategoryFields approved={approved["categories"] || []} draft={draft["categories"] || []} />
          </div>
        )}
        {course?.publishRequest?.status != "PENDING" ? null : (
          <div className="w-full flex">
            <div className="space-x-2 flex">
              <Button
                onPress={onRejectChanges}
                size="md"
                radius="sm"
                variant="flat"
                color="danger"
                className="font-medium flex gap-x-2 reset-button py-2">
                <LuCircleX size={16} /> Reject
              </Button>
              <Button
                onPress={onSaveChanges}
                size="md"
                radius="sm"
                variant="flat"
                color="success"
                className="font-medium flex gap-x-2 reset-button py-2">
                <LuGlobe /> Approve
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

type Color = "success" | "default" | "primary" | "secondary" | "warning" | "danger";
const Wrapper = ({ children, color, prefix }: { children: ReactNode; color?: Color; prefix?: string }) => {
  return (
    <div
      className={cn(
        "px-3 py-2 whitespace-pre-wrap break-words overflow-hidden rounded-xl border space-x-1.5",
        color ? `border-${color}-200` : "bg-white border-slate-200",
      )}>
      {prefix && prefix + " "}
      {children}
    </div>
  );
};

type FieldKey = "priceAmount" | "tags" | "discounts" | "categories";

const FIELDS: {
  key: FieldKey;
  label: string;
}[] = [
  {
    key: "discounts",
    label: "Discounts",
  },
  { key: "priceAmount", label: "Price Amount" },
  { key: "tags", label: "Tags" },
  {
    key: "categories",
    label: "Categories",
  },
];

const TagsField = ({ approved, draft }: { approved: Tag[]; draft: Tag[] }) => {
  const { firstData, secondData, hasChange } = compareTags(approved, draft);
  if (hasChange) {
    return (
      <div>
        <div className="grid @3xl:grid-cols-2 grid-cols-1 gap-2">
          <div>
            <h3 className="font-medium mb-1">Current Tags</h3>
            <Wrapper color="danger">
              {firstData.map(t => (
                <Chip
                  startContent={t.removed ? <p className="ml-1 mb-0.5">-</p> : undefined}
                  variant="bordered"
                  color={t.removed ? "danger" : "primary"}
                  key={t.id}>
                  {t.name}
                </Chip>
              ))}
            </Wrapper>
          </div>
          <div>
            <h3 className="font-medium mb-1">New Tags</h3>
            <Wrapper color="success">
              {secondData.map(t => (
                <Chip
                  startContent={t.new ? <p className="ml-1 mb-0.5">+</p> : undefined}
                  variant="bordered"
                  color={t.new ? "success" : "primary"}
                  key={t.id}>
                  {t.name}
                </Chip>
              ))}
            </Wrapper>
          </div>
        </div>
      </div>
    );
  } else {
    return null;
    return (
      <Wrapper>
        {firstData.map(t => (
          <Chip variant="bordered" color={"primary"} key={t.id}>
            {t.name}
          </Chip>
        ))}
      </Wrapper>
    );
  }
};

const PriceField = ({ price, discounts, color }: { price: number; discounts: Discount[]; color?: Color }) => {
  const activeDiscounts = discounts.filter(d => d.isActive && d.value > 0);

  const { finalPrice, breakdown } = useMemo(() => {
    let current = price;
    const breakdown = activeDiscounts.map(d => {
      const amount = d.type === "FIXED" ? d.value : current * (d.value / 100);
      const before = current;
      current = Math.max(0, current - amount);
      return { discount: d, amount, before, after: current };
    });

    return { finalPrice: current, breakdown };
  }, [price, activeDiscounts]);

  return (
    <div
      className={cn(
        "rounded-xl border space-y-2 p-4",
        color ? `bg-${color}-50 border-${color}-200` : "border-slate-200",
      )}>
      {breakdown.length > 0 && (
        <p className="text-sm text-slate-700 flex justify-between">
          Base price
          <span className="font-semibold line-through">{convertLocal(price)}</span>
        </p>
      )}

      {breakdown.map(({ discount, amount }, i) => (
        <p key={discount.id} className="text-sm text-slate-700 flex justify-between">
          Discount {discount.label ?? i + 1}
          {discount.type === "PERCENTAGE" && ` (${discount.value}%)`}
          <span className="font-semibold">-{convertLocal(amount)}</span>
        </p>
      ))}

      <p className="text-sm text-primary-500 flex justify-between">
        Final price
        <span className="font-semibold">{convertLocal(finalPrice)}</span>
      </p>
    </div>
  );
};

const DiscountsTable = ({ approved, draft }: { approved: Discount[]; draft: Discount[] }) => {
  const { firstData, secondData, hasChange } = compareDiscounts(approved, draft);
  const Empty = () => <em className="text-inherit opacity-50 text-xs">none</em>;
  const ActiveChip = () => (
    <Chip color="success" variant="flat" size="sm">
      Active
    </Chip>
  );
  const InActiveChip = () => (
    <Chip color="danger" size="sm" variant="solid">
      Inactive
    </Chip>
  );
  if (hasChange) {
    return (
      <div>
        <div className="grid @3xl:grid-cols-2 grid-cols-1 gap-2">
          <div>
            <h3 className="font-medium mb-1">Current Discount</h3>
            <Table
              classNames={{
                wrapper: "shadow-none border border-danger-200",
              }}
              aria-label="discounts table">
              <TableHeader>
                <TableColumn key="=">=</TableColumn>
                <TableColumn key="label">Label</TableColumn>
                <TableColumn key="value">Amount</TableColumn>
                <TableColumn key={"status"}>Status</TableColumn>
                <TableColumn key={"start"}>Start At</TableColumn>
                <TableColumn key={"end"}>End At</TableColumn>
              </TableHeader>
              {firstData.length == 0 ? (
                <TableBody>
                  <TableRow>
                    <TableCell className="text-foreground-400 align-middle text-center h-10" colSpan={6}>
                      No Discount
                    </TableCell>
                  </TableRow>
                </TableBody>
              ) : (
                <TableBody>
                  {firstData.map(val => (
                    <TableRow key={val.id} className={val.removed ? "bg-danger-50 text-danger rounded-xl" : ""}>
                      <TableCell>{val.removed ? "-" : "="}</TableCell>
                      <TableCell>{val.label ?? <Empty />}</TableCell>
                      <TableCell>{val.type == "PERCENTAGE" ? val.value + "%" : convertLocal(val.value)}</TableCell>
                      <TableCell>{val.isActive ? <ActiveChip /> : <InActiveChip />}</TableCell>
                      <TableCell>{val.startAt ? formatDate(val.startAt) : <Empty />}</TableCell>
                      <TableCell>{val.endAt ? formatDate(val.endAt) : <Empty />}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              )}
            </Table>
          </div>
          <div>
            <h3 className="font-medium mb-1">New Discount</h3>
            <Table
              aria-label="discounts table"
              color="success"
              classNames={{
                wrapper: "shadow-none border border-success-200",
              }}>
              <TableHeader>
                <TableColumn width={15} key="=">
                  =
                </TableColumn>
                <TableColumn key="label">Label</TableColumn>
                <TableColumn key="value">Amount</TableColumn>
                <TableColumn key={"status"}>Status</TableColumn>
                <TableColumn key={"start"}>Start At</TableColumn>
                <TableColumn key={"end"}>End At</TableColumn>
              </TableHeader>
              {secondData.length == 0 ? (
                <TableBody>
                  <TableRow>
                    <TableCell className="text-foreground-400 align-middle text-center h-12" colSpan={6}>
                      No Discount
                    </TableCell>
                  </TableRow>
                </TableBody>
              ) : (
                <TableBody>
                  {secondData.map(val => (
                    <TableRow key={val.id} data-selected={val.new}>
                      <TableCell data-selected={val.new}>{val.new ? "+" : "="}</TableCell>
                      <TableCell data-selected={val.new}>{val.label ?? <Empty />}</TableCell>
                      <TableCell data-selected={val.new}>
                        {val.type == "PERCENTAGE" ? val.value + "%" : convertLocal(val.value)}
                      </TableCell>
                      <TableCell data-selected={val.new}>{val.isActive ? <ActiveChip /> : <InActiveChip />}</TableCell>
                      <TableCell data-selected={val.new}>{val.startAt ? formatDate(val.startAt) : <Empty />}</TableCell>
                      <TableCell data-selected={val.new}>{val.endAt ? formatDate(val.endAt) : <Empty />}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              )}
            </Table>
          </div>
        </div>
      </div>
    );
  } else {
    return null;
    return (
      <Table
        classNames={{
          wrapper: "shadow-none border border-slate-200",
        }}
        aria-label="discounts table">
        <TableHeader>
          <TableColumn key="label">Label</TableColumn>
          <TableColumn key="value">Amount</TableColumn>
          <TableColumn key={"status"}>Status</TableColumn>
          <TableColumn key={"start"}>Start At</TableColumn>
          <TableColumn key={"end"}>End At</TableColumn>
        </TableHeader>
        {firstData.length == 0 ? (
          <TableBody>
            <TableRow>
              <TableCell className="text-foreground-400 align-middle text-center h-12" colSpan={6}>
                No Discount
              </TableCell>
            </TableRow>
          </TableBody>
        ) : (
          <TableBody>
            {firstData.map(val => (
              <TableRow key={val.id}>
                <TableCell>{val.label ?? <Empty />}</TableCell>
                <TableCell>{val.type == "PERCENTAGE" ? val.value + "%" : convertLocal(val.value)}</TableCell>
                <TableCell>{val.isActive ? <ActiveChip /> : <InActiveChip />}</TableCell>
                <TableCell>{val.startAt ? formatDate(val.startAt) : <Empty />}</TableCell>
                <TableCell>{val.endAt ? formatDate(val.endAt) : <Empty />}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        )}
      </Table>
    );
  }
};

function isSameDiscount(a: Discount, b: Discount): boolean {
  return (
    a.type === b.type &&
    a.value === b.value &&
    a.startAt === b.startAt &&
    a.endAt === b.endAt &&
    a.isActive === b.isActive &&
    a.label === b.label
  );
}

function compareDiscounts(first: Discount[], second: Discount[]) {
  const firstMap = new Map(first.map(d => [d.id, d]));
  const secondMap = new Map(second.map(d => [d.id, d]));

  const firstData = first.map(d => {
    const next = secondMap.get(d.id);

    const removed = !next || !isSameDiscount(d, next); // removed OR modified

    return {
      ...d,
      removed,
    };
  });

  const secondData = second.map(d => {
    const prev = firstMap.get(d.id);

    const isNew = !prev || !isSameDiscount(prev, d); // new OR modified

    return {
      ...d,
      new: isNew,
    };
  });

  const hasChange = firstData.some(d => d.removed) || secondData.some(d => d.new);

  return {
    firstData,
    secondData,
    hasChange,
  };
}

function compareTags(first: Tag[], second: Tag[]) {
  const firstMap = new Map(first.map(t => [t.id, t]));
  const secondMap = new Map(second.map(t => [t.id, t]));

  const firstData = first.map(t => ({
    ...t,
    removed: !secondMap.has(t.id),
  }));

  const secondData = second.map(t => ({
    ...t,
    new: !firstMap.has(t.id),
  }));

  const hasChange = firstData.some(t => t.removed) || secondData.some(t => t.new);

  return {
    firstData,
    secondData,
    hasChange,
  };
}

function isSameCategoryForInstructor(a: Category, b: Category): boolean {
  return a.isPrimary === b.isPrimary;
}
function compareCategories(first: Category[], second: Category[]) {
  const firstMap = new Map(first.map(c => [c.id, c]));
  const secondMap = new Map(second.map(c => [c.id, c]));

  const firstData = first.map(c => {
    const next = secondMap.get(c.id);

    return {
      ...c,
      removed: !next || !isSameCategoryForInstructor(c, next),
    };
  });

  const secondData = second.map(c => {
    const prev = firstMap.get(c.id);

    return {
      ...c,
      new: !prev || !isSameCategoryForInstructor(prev, c),
    };
  });

  const hasChange = firstData.some(c => c.removed) || secondData.some(c => c.new);

  return {
    firstData,
    secondData,
    hasChange,
  };
}

const CategoryFields = ({ approved, draft }: { approved: Category[]; draft: Category[] }) => {
  const { firstData, secondData, hasChange } = compareCategories(approved, draft);
  if (hasChange) {
    return (
      <div className="space-y-1">
        <div className="grid @3xl:grid-cols-2 grid-cols-1 gap-2">
          <div>
            <h3 className="font-medium mb-1">Current Categories</h3>
            <Wrapper color="danger">
              {firstData.map(c => (
                <Chip
                  radius="sm"
                  variant={c.isPrimary ? "solid" : "flat"}
                  startContent={c.removed ? <p className="ml-1 mb-0.5">-</p> : undefined}
                  color={c.removed ? "danger" : "primary"}
                  key={c.id}>
                  {c.name}
                </Chip>
              ))}
            </Wrapper>
          </div>
          <div>
            <h3 className="font-medium mb-1">New Categories</h3>
            <Wrapper color="success">
              {secondData.map(c => (
                <Chip
                  startContent={c.new ? <p className={cn("ml-1 mb-0.5", c.isPrimary && "text-white")}>+</p> : undefined}
                  radius="sm"
                  variant={c.isPrimary ? "solid" : "flat"}
                  color={c.new ? "success" : "primary"}
                  classNames={{
                    content: c.isPrimary && "text-white",
                  }}
                  key={c.id}>
                  {c.name}
                </Chip>
              ))}
            </Wrapper>
          </div>
        </div>
      </div>
    );
  } else {
    return null;
    return (
      <Wrapper>
        {firstData.map(c => (
          <Chip radius="sm" variant={c.isPrimary ? "solid" : "flat"} color={"primary"} key={c.id}>
            {c.name}
          </Chip>
        ))}
      </Wrapper>
    );
  }
};
