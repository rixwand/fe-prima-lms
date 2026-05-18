import type { CalendarDate as HeroUICalendarDate } from "@heroui/react";
import { JSONContent as JsonContent } from "@tiptap/core";
import type { Decimal as decimal } from "decimal.js";
import type { NotificationType as notif } from "../config/notification";

declare global {
  type CalendarDate = HeroUICalendarDate;
  type Layout = "list" | "grid";
  type JSONContent = JsonContent;
  type MetaData = {
    total: number;
    page: number;
    limit: number;
    totalPage: number;
  };
  type Decimal = decimal;
  type NotificationType = notif;
}
