export default function NotFound({ message }: { message?: string }) {
  return (
    <div className="min-h-screen flex flex-col bg-black items-center justify-center text-center">
      <h1 className="text-4xl font-bold mb-2 text-gray-50">404</h1>
      <p className="text-lg text-gray-100">{message || "Sorry, this page doesn’t exist."}</p>
    </div>
  );
}
