import { PaymentStatus, StatusChip } from "@/components/commons/Chip/StatusChip";
import useMyInvoice from "@/hooks/transaction/useMyInvoice";
import useDump from "@/hooks/use-dump";
import { convertLocal } from "@/libs/utils/currency";
import { Button, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/react";
import { LuFileText } from "react-icons/lu";

export default function Transaction() {
  const { invoices, isLoading } = useMyInvoice();
  useDump(invoices, "invoices");
  return (
    <section>
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
            Date
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
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
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
