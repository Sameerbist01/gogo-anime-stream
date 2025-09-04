import { useState, useEffect } from "react";
import { AnimeAPI, AnimeItem } from "@/lib/api";
import { AnimeCard } from "@/components/anime-card";
import { SearchBar } from "@/components/search-bar";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, Star, Clock } from "lucide-react";
import heroImage from "@/assets/hero-anime.jpg";

const Index = () => {
  const [recentAnime, setRecentAnime] = useState<AnimeItem[]>([]);
  const [popularAnime, setPopularAnime] = useState<AnimeItem[]>([]);
  const [searchResults, setSearchResults] = useState<AnimeItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      const [recent, popular] = await Promise.all([
        AnimeAPI.getRecentAnime(1),
        AnimeAPI.getPopularAnime(1)
      ]);
      setRecentAnime(recent);
      setPopularAnime(popular);
    } catch (error) {
      console.error('Failed to load initial data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setIsSearching(true);
      const results = await AnimeAPI.searchAnime(query);
      setSearchResults(results);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const loadMore = async (type: 'recent' | 'popular') => {
    try {
      const nextPage = currentPage + 1;
      const results = type === 'recent' 
        ? await AnimeAPI.getRecentAnime(nextPage)
        : await AnimeAPI.getPopularAnime(nextPage);
      
      if (type === 'recent') {
        setRecentAnime(prev => [...prev, ...results]);
      } else {
        setPopularAnime(prev => [...prev, ...results]);
      }
      setCurrentPage(nextPage);
    } catch (error) {
      console.error('Failed to load more:', error);
    }
  };

  const renderAnimeGrid = (anime: AnimeItem[], showLoadMore = false, type?: 'recent' | 'popular') => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {anime.map((item) => (
          <AnimeCard key={`${item.id}-${item.title}`} anime={item} />
        ))}
      </div>
      {showLoadMore && type && (
        <div className="flex justify-center">
          <Button 
            variant="outline" 
            onClick={() => loadMore(type)}
            className="bg-anime-surface hover:bg-anime-surface-elevated border-border/50"
          >
            Load More
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-border/50">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-background/80" />
        <div className="relative container mx-auto px-4 py-20">
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              AnimeStream
            </h1>
            <p className="text-xl text-anime-text-secondary max-w-2xl mx-auto">
              Watch your favorite anime series with high-quality streaming. Discover new shows and enjoy seamless viewing experience.
            </p>
            <div className="max-w-md mx-auto">
              <SearchBar 
                onSearch={handleSearch}
                placeholder="Search for anime..."
              />
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        {/* Search Results */}
        {searchQuery && (
          <div className="mb-12">
            <div className="flex items-center space-x-2 mb-6">
              <h2 className="text-2xl font-bold text-anime-text-primary">
                Search Results for "{searchQuery}"
              </h2>
              {isSearching && <LoadingSpinner size="sm" />}
            </div>
            {searchResults.length > 0 ? (
              renderAnimeGrid(searchResults)
            ) : !isSearching && searchQuery ? (
              <div className="text-center py-12">
                <p className="text-anime-text-muted">No anime found for "{searchQuery}"</p>
              </div>
            ) : null}
          </div>
        )}

        {/* Main Content */}
        {!searchQuery && (
          <Tabs defaultValue="recent" className="space-y-8">
            <TabsList className="bg-anime-surface border border-border/50">
              <TabsTrigger value="recent" className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>Recent Episodes</span>
              </TabsTrigger>
              <TabsTrigger value="popular" className="flex items-center space-x-2">
                <Star className="w-4 h-4" />
                <span>Popular Anime</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="recent">
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <LoadingSpinner size="lg" />
                </div>
              ) : (
                <div>
                  <div className="flex items-center space-x-2 mb-6">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    <h2 className="text-2xl font-bold text-anime-text-primary">
                      Recently Updated
                    </h2>
                  </div>
                  {renderAnimeGrid(recentAnime, true, 'recent')}
                </div>
              )}
            </TabsContent>

            <TabsContent value="popular">
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <LoadingSpinner size="lg" />
                </div>
              ) : (
                <div>
                  <div className="flex items-center space-x-2 mb-6">
                    <Star className="w-5 h-5 text-primary" />
                    <h2 className="text-2xl font-bold text-anime-text-primary">
                      Most Popular
                    </h2>
                  </div>
                  {renderAnimeGrid(popularAnime, true, 'popular')}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  );
};

export default Index;
