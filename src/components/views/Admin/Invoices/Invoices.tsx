import { PaymentStatus, StatusChip } from "@/components/commons/Chip/StatusChip";
import useInvoice from "@/hooks/transaction/useInvoice";
import { convertLocal, formatRupiah } from "@/libs/utils/currency";
import { Button, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/react";
import { LuFileText, LuReceiptText } from "react-icons/lu";

function formatDate(value: unknown) {
  if (!value || typeof value !== "string") return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("id-ID");
}

function formatAmount(value: unknown) {
  if (typeof value !== "number") return "-";
  return formatRupiah(value);
}

export default function Invoices() {
  const { invoices, isLoading } = useInvoice({ page: 1, limit: 20 });
  return (
    <section>
      <header className="mb-6 flex items-center gap-3">
        <div className="inline-grid place-items-center rounded p-3 bg-white ring-1 ring-slate-300">
          <span className="text-2xl font-semibold text-slate-600">
            <LuReceiptText />
          </span>
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold">Invoices</h1>
          <p className="text-sm text-slate-500">Recent invoice records from the platform.</p>
        </div>
      </header>

      <Table className="table-fixed">
        <TableHeader>
          <TableColumn key="invoiceNumber">Invoice</TableColumn>
          <TableColumn className="md:w-2/5 min-w-52" key="course">
            Course
          </TableColumn>
          <TableColumn key="amount">Amount</TableColumn>
          <TableColumn key="status" align="center">
            Status
          </TableColumn>
          <TableColumn align="center" key="createdAt">
            Date & Time
          </TableColumn>
          <TableColumn key="action" align="center" width={50}>
            {" "}
          </TableColumn>
        </TableHeader>
        <TableBody
          items={invoices.data ?? []}
          loadingContent={<Spinner />}
          loadingState={invoices.isError ? "error" : isLoading ? "loading" : "idle"}>
          {item => (
            <TableRow key={item.id} className="border-slate-200 h-14 border-b last:border-0 text-slate-600">
              <TableCell className="whitespace-nowrap">{item.invoiceNumber}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  <p className="line-clamp-2 leading-snug">{item.order.course.metaApproved.payload.title}</p>
                </div>
              </TableCell>
              <TableCell className="whitespace-nowrap">{convertLocal(item.amount)}</TableCell>
              <TableCell>
                <StatusChip status={item.status as PaymentStatus} />
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {new Date(item.createdAt).toLocaleDateString("id-ID", {
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
