import useOrder from "@/hooks/transaction/useOrder";
import { convertLocal } from "@/libs/utils/currency";
import { Button, Chip, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/react";
import { LuFileClock, LuFileText } from "react-icons/lu";

function formatDate(value: unknown) {
  if (!value || typeof value !== "string") return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("id-ID");
}

function statusColor(status: unknown): "success" | "danger" | "warning" | "default" {
  if (typeof status !== "string") return "default";
  const normalized = status.toUpperCase();
  if (normalized === "PAID" || normalized === "SUCCESS") return "success";
  if (normalized === "PENDING") return "warning";
  if (normalized === "FAILED" || normalized === "CANCELLED") return "danger";
  return "default";
}

export default function Orders() {
  const {
    orders: { data, meta },
  } = useOrder({ immediatlyFetch: true }, { page: 1, limit: 20 });
  const rows = (data || []).map((order, index) => ({ ...order, __key: String(order.id ?? index) }));

  return (
    <section>
      <header className="mb-6 flex items-center gap-3">
        <div className="inline-grid place-items-center rounded p-3 bg-white ring-1 ring-slate-300">
          <span className="text-2xl font-semibold text-slate-600">
            <LuFileClock />
          </span>
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold">Orders</h1>
          <p className="text-sm text-slate-500">
            Manage order history and processing.
            {meta?.total ? ` Total records: ${meta.total}` : ""}
          </p>
        </div>
      </header>

      <Table aria-label="Order list">
        <TableHeader>
          <TableColumn>Customer</TableColumn>
          <TableColumn>Email</TableColumn>
          <TableColumn>Course</TableColumn>
          <TableColumn align="center">Amount</TableColumn>
          <TableColumn align="center">Status</TableColumn>
          <TableColumn align="center">Date & Time</TableColumn>
          <TableColumn width={50} align="center">
            {" "}
          </TableColumn>
        </TableHeader>
        <TableBody
          items={rows}
          emptyContent={"No orders found"}
          loadingContent={<Spinner label="Loading orders..." />}
          loadingState={!data ? "loading" : "idle"}>
          {order => (
            <TableRow key={order.__key}>
              <TableCell>{order.user?.fullName ?? "-"}</TableCell>
              <TableCell>{order.user?.email ?? "-"}</TableCell>
              <TableCell>{order.course?.metaApproved?.payload?.title ?? "-"}</TableCell>
              <TableCell>{convertLocal(order.amount)}</TableCell>
              <TableCell>
                <Chip variant="flat" size="sm" color={statusColor(order.status)}>
                  {order.status ?? "-"}
                </Chip>
              </TableCell>
              <TableCell>
                {new Date(order.createdAt).toLocaleDateString("id-ID", {
                  timeZoneName: "short",
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })}
              </TableCell>
              <TableCell>
                <Button
                  disableRipple
                  isIconOnly
                  className="reset-button px-2 py-1 data-[hover=true]:bg-transparent data-[hover=true]:underline"
                  variant="light"
                  color="primary">
                  <p className="mr-1.5">Detail</p> <LuFileText />
                </Button>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </section>
  );
}
