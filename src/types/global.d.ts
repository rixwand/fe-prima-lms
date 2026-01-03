import type { CalendarDate as HeroUICalendarDate } from "@heroui/react";

declare global {
  type CalendarDate = HeroUICalendarDate;
  type Layout = "list" | "grid";
  type MetaData = {
    total: number;
    page: number;
    limit: number;
    totalPage: number;
  };
}
