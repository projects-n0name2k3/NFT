import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { TriangleAlert } from "lucide-react";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center md:min-h-[calc(100vh-250px)] p-4  dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 text-center bg-white rounded-lg shadow-lg dark:bg-gray-800">
        <TriangleAlert className="w-16 h-16 mx-auto text-yellow-500" />
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
          404
        </h1>
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
          Page Not Found
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button asChild className="w-full mt-6">
          <Link to="/">Return to Home</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
