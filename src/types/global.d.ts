import type { CalendarDate as HeroUICalendarDate } from "@heroui/react";
import { JSONContent as JsonContent } from "@tiptap/core";

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
}
