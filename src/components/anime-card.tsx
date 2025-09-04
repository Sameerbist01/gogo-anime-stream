import { Card, CardContent } from "@/components/ui/card";
import { AnimeItem } from "@/lib/api";
import { Play } from "lucide-react";
import { Link } from "react-router-dom";

interface AnimeCardProps {
  anime: AnimeItem;
}

export function AnimeCard({ anime }: AnimeCardProps) {
  return (
    <Link to={`/anime/${anime.id}`}>
      <Card className="group overflow-hidden bg-anime-surface hover:bg-anime-surface-elevated transition-all duration-300 transform hover:scale-105 shadow-card hover:shadow-elevated border-border/50">
        <CardContent className="p-0 relative">
          <div className="aspect-[3/4] relative overflow-hidden">
            <img
              src={anime.image}
              alt={anime.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <div className="bg-primary/20 backdrop-blur-sm rounded-full p-3">
                <Play className="w-6 h-6 text-primary-foreground" fill="currentColor" />
              </div>
            </div>
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-anime-text-primary text-sm line-clamp-2 leading-tight">
              {anime.title}
            </h3>
            {anime.releaseDate && (
              <p className="text-xs text-anime-text-muted mt-1">
                {anime.releaseDate}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}