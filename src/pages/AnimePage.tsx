import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { AnimeAPI, AnimeDetails, Episode } from "@/lib/api";
import { Navigation } from "@/components/navigation";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Calendar, Tag } from "lucide-react";

export default function AnimePage() {
  const { id } = useParams<{ id: string }>();
  const [anime, setAnime] = useState<AnimeDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadAnimeDetails(id);
    }
  }, [id]);

  const loadAnimeDetails = async (animeId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const details = await AnimeAPI.getAnimeDetails(animeId);
      setAnime(details);
    } catch (error) {
      console.error('Failed to load anime details:', error);
      setError('Failed to load anime details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex justify-center items-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  if (error || !anime) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-anime-text-primary mb-4">
            {error || 'Anime not found'}
          </h1>
          <Link to="/">
            <Button variant="outline">Return to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-overlay" />
        <div 
          className="h-96 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${anime.image})` }}
        />
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 pb-8">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <img
                src={anime.image}
                alt={anime.title}
                className="w-48 h-72 object-cover rounded-lg shadow-elevated border-2 border-border/50"
              />
              <div className="flex-1 text-white">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
                  {anime.title}
                </h1>
                <div className="flex flex-wrap gap-2 mb-4">
                  {anime.genres?.map((genre) => (
                    <Badge key={genre} variant="secondary" className="bg-primary/20 text-white border-primary/30">
                      {genre}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center gap-4 text-sm mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{anime.releaseDate}</span>
                  </div>
                  <Badge variant="outline" className="border-white/30 text-white">
                    {anime.status}
                  </Badge>
                </div>
                {anime.description && (
                  <p className="text-gray-200 max-w-3xl line-clamp-3 leading-relaxed">
                    {anime.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Episodes Section */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Episodes List */}
          <div className="lg:col-span-2">
            <Card className="bg-anime-surface border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-anime-text-primary">
                  <Play className="w-5 h-5 text-primary" />
                  Episodes ({anime.episodes?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {anime.episodes && anime.episodes.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {anime.episodes.map((episode: Episode) => (
                      <Link
                        key={episode.id}
                        to={`/watch/${episode.id}?title=${encodeURIComponent(anime.title)} - Episode ${episode.number}`}
                      >
                        <Button
                          variant="outline"
                          className="w-full justify-start bg-anime-surface-elevated hover:bg-primary/10 border-border/50 hover:border-primary/50 text-anime-text-primary"
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Episode {episode.number}
                          {episode.title && (
                            <span className="ml-2 text-anime-text-muted truncate">
                              - {episode.title}
                            </span>
                          )}
                        </Button>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-anime-text-muted">No episodes available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Anime Info Sidebar */}
          <div className="space-y-6">
            <Card className="bg-anime-surface border-border/50">
              <CardHeader>
                <CardTitle className="text-anime-text-primary">Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-anime-text-primary mb-2">Status</h4>
                  <Badge variant="secondary" className="bg-primary/20 text-primary">
                    {anime.status}
                  </Badge>
                </div>
                
                {anime.releaseDate && (
                  <div>
                    <h4 className="font-semibold text-anime-text-primary mb-2">Release Date</h4>
                    <p className="text-anime-text-secondary">{anime.releaseDate}</p>
                  </div>
                )}

                {anime.genres && anime.genres.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-anime-text-primary mb-2">Genres</h4>
                    <div className="flex flex-wrap gap-1">
                      {anime.genres.map((genre) => (
                        <Badge key={genre} variant="outline" className="text-xs">
                          {genre}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {anime.otherNames && anime.otherNames.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-anime-text-primary mb-2">Other Names</h4>
                    <div className="space-y-1">
                      {anime.otherNames.map((name, index) => (
                        <p key={index} className="text-sm text-anime-text-secondary">
                          {name}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {anime.description && (
              <Card className="bg-anime-surface border-border/50">
                <CardHeader>
                  <CardTitle className="text-anime-text-primary">Synopsis</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-anime-text-secondary leading-relaxed">
                    {anime.description}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}