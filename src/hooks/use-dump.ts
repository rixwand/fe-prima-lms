import { useEffect } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function useDump(data: any, msg?: string) {
  useEffect(() => {
    console.log("use dump: ", data, `\n${msg}`);
  }, [data]);
}
