import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { AnimeAPI, StreamingUrls } from "@/lib/api";
import { Navigation } from "@/components/navigation";
import { VideoPlayer } from "@/components/video-player";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Download, AlertCircle } from "lucide-react";

export default function EpisodePage() {
  const { episodeId } = useParams<{ episodeId: string }>();
  const [searchParams] = useSearchParams();
  const title = searchParams.get('title');

  const [streamingData, setStreamingData] = useState<StreamingUrls | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (episodeId) {
      loadStreamingData(episodeId);
    }
  }, [episodeId]);

  const loadStreamingData = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await AnimeAPI.getEpisodeStreams(id);
      setStreamingData(data);
    } catch (error) {
      console.error('Failed to load streaming data:', error);
      setError('Failed to load episode streams. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-20">
          <div className="flex flex-col items-center justify-center space-y-4">
            <LoadingSpinner size="lg" />
            <p className="text-anime-text-secondary">Loading episode...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !streamingData) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-20">
          <Alert className="max-w-md mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error || 'No streaming data available for this episode.'}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  const hasValidSources = streamingData.sources && streamingData.sources.length > 0;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Episode Title */}
          {title && (
            <div>
              <h1 className="text-3xl font-bold text-anime-text-primary mb-2">
                {title}
              </h1>
              <Alert className="bg-primary/10 border-primary/30">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Demo Mode:</strong> Real anime streaming APIs have CORS restrictions and require server-side implementation. 
                  Currently showing different demo videos per episode to demonstrate the player functionality.
                </AlertDescription>
              </Alert>
            </div>
          )}

          {/* Video Player */}
          {hasValidSources ? (
            <div className="aspect-video">
              <VideoPlayer
                sources={streamingData.sources}
                title={title || 'Episode'}
                className="w-full h-full"
              />
            </div>
          ) : (
            <Card className="bg-anime-surface border-border/50">
              <CardContent className="py-12">
                <div className="text-center">
                  <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-anime-text-primary mb-2">
                    No Video Sources Available
                  </h3>
                  <p className="text-anime-text-muted">
                    This episode is not available for streaming at the moment.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Download Links */}
          {streamingData.download && streamingData.download.length > 0 && (
            <Card className="bg-anime-surface border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-anime-text-primary">
                  <Download className="w-5 h-5" />
                  Download Links
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {streamingData.download.map((link, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      asChild
                      className="bg-anime-surface-elevated hover:bg-primary/10 border-border/50 hover:border-primary/50"
                    >
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        {link.quality}
                      </a>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Video Sources Info */}
          {hasValidSources && (
            <Card className="bg-anime-surface border-border/50">
              <CardHeader>
                <CardTitle className="text-anime-text-primary">Available Quality Options</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {streamingData.sources.map((source, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-anime-surface-elevated rounded-lg">
                      <span className="font-medium text-anime-text-primary">
                        {source.quality}
                      </span>
                      <div className="flex items-center gap-2">
                        {source.isM3U8 && (
                          <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                            M3U8
                          </span>
                        )}
                        <span className="text-xs text-anime-text-muted">
                          {source.isM3U8 ? 'Adaptive' : 'Direct'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}