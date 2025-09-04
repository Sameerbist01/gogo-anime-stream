import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navigation() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            AnimeStream
          </span>
        </Link>

        <div className="flex items-center space-x-2">
          {!isHome && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.history.back()}
              className="text-anime-text-secondary hover:text-anime-text-primary"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          )}
          
          {!isHome && (
            <Link to="/">
              <Button 
                variant="ghost" 
                size="sm"
                className="text-anime-text-secondary hover:text-anime-text-primary"
              >
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}