import { Fragment } from "react";
import PageHead from "../PageHead";

type ErrorCode = string | number;

const isObject = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null;

const getValue = (value: unknown, key: string) => (isObject(value) ? value[key] : undefined);

const getString = (value: unknown) => (typeof value === "string" && value.trim().length > 0 ? value : undefined);

const getCode = (value: unknown): ErrorCode | undefined =>
  typeof value === "number" || typeof value === "string" ? value : undefined;

const getStatusCode = (...values: unknown[]): number | undefined => {
  for (const value of values) {
    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }

    if (typeof value === "string") {
      const normalized = value.trim();
      if (/^\d+$/.test(normalized)) {
        return Number(normalized);
      }
    }
  }

  return undefined;
};

const getErrorDetails = (error: unknown) => {
  const response = getValue(error, "response");
  const responseData = getValue(response, "data");
  const statusCode = getStatusCode(
    getValue(response, "statusCode"),
    getValue(response, "status"),
    getValue(responseData, "statusCode"),
    getValue(responseData, "status"),
  );

  if (statusCode === 400) {
    return { message: "Error bad request", code: statusCode };
  }

  const message =
    getString(getValue(response, "message")) ??
    getString(getValue(responseData, "message")) ??
    getString(getValue(responseData, "error")) ??
    getString(getValue(error, "message"));

  const code = statusCode ?? getCode(getValue(error, "code"));

  return { message, code };
};

export default function NotFound({ message, code, error }: { message?: string; code?: ErrorCode; error?: unknown }) {
  const { message: errorMessage, code: errorCode } = getErrorDetails(error);
  const displayMessage = message ?? errorMessage ?? "Sorry, this page doesn't exist.";
  const displayCode = code ?? errorCode ?? 404;

  return (
    <Fragment>
      <PageHead title="Error" />
      <div className="min-h-screen flex flex-col bg-black items-center justify-center text-center">
        <h1 className="text-4xl font-bold mb-2 text-gray-50">{displayCode}</h1>
        <p className="text-lg text-gray-100">{displayMessage}</p>
      </div>
    </Fragment>
  );
}
