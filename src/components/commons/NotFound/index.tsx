import { Fragment } from "react";
import PageHead from "../PageHead";

export default function NotFound({ message, code = 404 }: { message?: string; code?: number }) {
  return (
    <Fragment>
      <PageHead title="Error" />
      <div className="min-h-screen flex flex-col bg-black items-center justify-center text-center">
        <h1 className="text-4xl font-bold mb-2 text-gray-50">{code}</h1>
        <p className="text-lg text-gray-100">{message || "Sorry, this page doesn’t exist."}</p>
      </div>
    </Fragment>
  );
}
