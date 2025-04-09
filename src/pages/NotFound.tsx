
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    document.title = "404 - Page Not Found";
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-light-gray p-4">
      <div className="w-full max-w-md text-center">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple/30 to-teal/30 flex items-center justify-center">
          <span className="text-5xl">🔍</span>
        </div>
        
        <h1 className="text-4xl font-bold mb-2">Page Not Found</h1>
        <p className="text-gray-600 mb-8">
          Oops! Looks like you've ventured beyond the TapVerse.
        </p>
        
        <Button 
          onClick={() => navigate("/")}
          className="bg-purple hover:bg-purple/90"
        >
          <Home className="mr-2 h-4 w-4" /> Return Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
