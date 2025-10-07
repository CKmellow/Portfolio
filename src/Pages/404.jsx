import React from "react";
import { Home, ArrowLeftCircle } from "lucide-react";

export default function NotFoundPage() {
  const goHome = () => (window.location.href = "/");
  const goBack = () => window.history.back();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 via-white to-indigo-50 text-gray-800 px-6">
      {/* Big 404 */}
      <h1 className="text-[8rem] font-extrabold text-indigo-600 leading-none drop-shadow-sm">
        404
      </h1>
      <h2 className="text-2xl sm:text-3xl font-semibold mt-4">
        Page Not Found
      </h2>
      <p className="text-gray-600 mt-2 max-w-md text-center">
        The page you’re looking for doesn’t exist or might have been moved.
      </p>

      {/* Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4">
        <button
          onClick={goBack}
          className="flex items-center gap-2 px-6 py-3 bg-gray-700 text-white rounded-xl shadow-md hover:bg-gray-800 transition duration-200"
        >
          <ArrowLeftCircle size={20} />
          Go Back
        </button>
        <button
          onClick={goHome}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl shadow-md hover:bg-indigo-700 transition duration-200"
        >
          <Home size={20} />
          Home
        </button>
      </div>

      {/* Decorative Illustration */}
      <div className="mt-12">
        <div className="w-32 h-32 rounded-full bg-indigo-100 flex items-center justify-center text-5xl">
          🚀
        </div>
      </div>
    </div>
  );
}
