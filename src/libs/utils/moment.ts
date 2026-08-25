export function timeAgo(input: string | Date) {
  const date = new Date(input);
  const seconds = Math.round((date.getTime() - Date.now()) / 1000);

  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 60 * 60 * 24 * 365],
    ["month", 60 * 60 * 24 * 30],
    ["day", 60 * 60 * 24],
    ["hour", 60 * 60],
    ["minute", 60],
    ["second", 1],
  ];

  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  for (const [unit, value] of units) {
    if (Math.abs(seconds) >= value || unit === "second") {
      return rtf.format(Math.round(seconds / value), unit);
    }
  }
}

const tzMap: Record<string, string> = {
  "Asia/Jakarta": "WIB",
  "Asia/Makassar": "WITA",
  "Asia/Jayapura": "WIT",
};

type LocalTimeField = "day" | "month" | "year" | "hour" | "minute" | "tz";

type LocalTimeOptions =
  | {
      pick: LocalTimeField[];
      omit?: never;
    }
  | {
      omit: LocalTimeField[];
      pick?: never;
    }
  | {
      pick?: never;
      omit?: never;
    };

export function intoLocalTimeWithTz(date: Date, options: LocalTimeOptions = {}): string {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const parts = new Intl.DateTimeFormat(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);

  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find(p => p.type === type)?.value ?? "";

  const tzName = tzMap[timeZone] ?? timeZone;

  const enabled = {
    day: true,
    month: true,
    year: true,
    hour: true,
    minute: true,
    tz: true,
  };

  if ("pick" in options && options.pick) {
    Object.keys(enabled).forEach(key => {
      enabled[key as keyof typeof enabled] = false;
    });

    options.pick.forEach(key => {
      enabled[key] = true;
    });
  }

  if ("omit" in options && options.omit) {
    options.omit.forEach(key => {
      enabled[key] = false;
    });
  }

  const datePart = [enabled.day && get("day"), enabled.month && get("month"), enabled.year && get("year")]
    .filter(Boolean)
    .join(" ");

  const timePart = [enabled.hour && get("hour"), enabled.minute && get("minute")].filter(Boolean).join(":");

  return [datePart, timePart, enabled.tz && tzName].filter(Boolean).join(" ");
}
