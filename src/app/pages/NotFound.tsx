import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/button";

export function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] px-6">
      <div className="max-w-md rounded-3xl bg-white p-10 text-center shadow-sm">
        <p className="text-sm font-black uppercase tracking-[0.25em] text-[#145A41]">
          404
        </p>
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-gray-900">
          Page not found
        </h1>
        <p className="mt-3 text-sm font-medium text-gray-500">
          Check the URL or head back to the main app.
        </p>
        <Link to="/" className="mt-6 inline-flex">
          <Button className="rounded-xl bg-[#145A41] text-white hover:bg-[#0B3D2E]">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
