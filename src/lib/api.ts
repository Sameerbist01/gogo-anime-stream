// Jikan API client - Reliable MyAnimeList API with comprehensive anime data
const API_BASE_URL = 'https://api.jikan.moe/v4';

export interface AnimeItem {
  id: string;
  title: string;
  image: string;
  url?: string;
  releaseDate?: string;
  status?: string;
}

export interface AnimeDetails {
  id: string;
  title: string;
  image: string;
  description: string;
  status: string;
  releaseDate: string;
  genres: string[];
  otherNames: string[];
  episodes: Episode[];
}

export interface Episode {
  id: string;
  number: string;
  title?: string;
  url: string;
}

export interface StreamingUrls {
  sources: Array<{
    url: string;
    quality: string;
    isM3U8: boolean;
  }>;
  download?: Array<{
    url: string;
    quality: string;
  }>;
}

export class AnimeAPI {
  private static async fetchData<T>(endpoint: string): Promise<T> {
    try {
      console.log('Making API request to:', `${API_BASE_URL}${endpoint}`);
      const response = await fetch(`${API_BASE_URL}${endpoint}`);
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      console.log('API response received:', data);
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  static async getRecentAnime(page: number = 1): Promise<AnimeItem[]> {
    try {
      const data = await this.fetchData<any>(`/seasons/now?page=${page}`);
      return (data.data || []).map(this.transformJikanAnime);
    } catch (error) {
      console.error('Failed to fetch recent anime, returning demo data:', error);
      return this.getDemoAnimeData();
    }
  }

  static async getPopularAnime(page: number = 1): Promise<AnimeItem[]> {
    try {
      const data = await this.fetchData<any>(`/top/anime?page=${page}&limit=25`);
      return (data.data || []).map(this.transformJikanAnime);
    } catch (error) {
      console.error('Failed to fetch popular anime, returning demo data:', error);
      return this.getDemoAnimeData();
    }
  }

  static async searchAnime(query: string): Promise<AnimeItem[]> {
    if (!query.trim()) return [];
    try {
      const data = await this.fetchData<any>(`/anime?q=${encodeURIComponent(query)}&limit=25`);
      return (data.data || []).map(this.transformJikanAnime);
    } catch (error) {
      console.error('Failed to search anime, returning demo data:', error);
      return this.getDemoAnimeData().filter(anime => 
        anime.title.toLowerCase().includes(query.toLowerCase())
      );
    }
  }

  static async getAnimeDetails(id: string): Promise<AnimeDetails> {
    const data = await this.fetchData<any>(`/anime/${id}/full`);
    return this.transformJikanAnimeDetails(data.data);
  }

  static async getEpisodeStreams(episodeId: string): Promise<StreamingUrls> {
    // For demo purposes, return mock streaming data
    // In a real application, you would integrate with a streaming API
    return {
      sources: [
        {
          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          quality: '720p',
          isM3U8: false
        },
        {
          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
          quality: '480p',
          isM3U8: false
        }
      ],
      download: [
        {
          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          quality: '720p'
        }
      ]
    };
  }

  static async getHomeData() {
    try {
      const [recent, popular] = await Promise.all([
        this.getRecentAnime(1),
        this.getPopularAnime(1)
      ]);
      return {
        trending: popular, // Use popular as trending
        popular: popular,
        recent: recent
      };
    } catch (error) {
      console.error('Failed to load home data:', error);
      return {
        trending: [],
        popular: [],
        recent: []
      };
    }
  }

  // Transform Jikan API response to our AnimeItem format
  private static transformJikanAnime(jikanAnime: any): AnimeItem {
    return {
      id: jikanAnime.mal_id.toString(),
      title: jikanAnime.title || jikanAnime.title_english || 'Unknown Title',
      image: jikanAnime.images?.jpg?.large_image_url || jikanAnime.images?.jpg?.image_url || '/placeholder.svg',
      url: jikanAnime.url,
      releaseDate: jikanAnime.aired?.string || jikanAnime.year?.toString() || 'Unknown',
      status: jikanAnime.status || 'Unknown'
    };
  }

  // Transform Jikan API response to our AnimeDetails format
  private static transformJikanAnimeDetails(jikanAnime: any): AnimeDetails {
    return {
      id: jikanAnime.mal_id.toString(),
      title: jikanAnime.title || jikanAnime.title_english || 'Unknown Title',
      image: jikanAnime.images?.jpg?.large_image_url || jikanAnime.images?.jpg?.image_url || '/placeholder.svg',
      description: jikanAnime.synopsis || 'No description available.',
      status: jikanAnime.status || 'Unknown',
      releaseDate: jikanAnime.aired?.string || jikanAnime.year?.toString() || 'Unknown',
      genres: (jikanAnime.genres || []).map((genre: any) => genre.name),
      otherNames: [
        jikanAnime.title_english,
        jikanAnime.title_japanese,
        ...(jikanAnime.title_synonyms || [])
      ].filter(Boolean),
      episodes: this.generateDemoEpisodes(jikanAnime.episodes || 12)
    };
  }

  // Generate demo episodes for the anime
  private static generateDemoEpisodes(episodeCount: number): Episode[] {
    const episodes: Episode[] = [];
    const maxEpisodes = Math.min(episodeCount || 12, 50); // Limit to 50 episodes for demo
    
    for (let i = 1; i <= maxEpisodes; i++) {
      episodes.push({
        id: `episode-${i}`,
        number: i.toString(),
        title: `Episode ${i}`,
        url: `#episode-${i}`
      });
    }
    
    return episodes;
  }

  // Demo anime data as fallback
  private static getDemoAnimeData(): AnimeItem[] {
    return [
      {
        id: '16498',
        title: 'Attack on Titan',
        image: 'https://cdn.myanimelist.net/images/anime/10/47347l.jpg',
        releaseDate: '2013',
        status: 'Finished Airing'
      },
      {
        id: '1535',
        title: 'Death Note',
        image: 'https://cdn.myanimelist.net/images/anime/9/9453l.jpg',
        releaseDate: '2006',
        status: 'Finished Airing'
      },
      {
        id: '21',
        title: 'One Piece',
        image: 'https://cdn.myanimelist.net/images/anime/6/73245l.jpg',
        releaseDate: '1999',
        status: 'Currently Airing'
      },
      {
        id: '20',
        title: 'Naruto',
        image: 'https://cdn.myanimelist.net/images/anime/13/17405l.jpg',
        releaseDate: '2002',
        status: 'Finished Airing'
      },
      {
        id: '11061',
        title: 'Hunter x Hunter (2011)',
        image: 'https://cdn.myanimelist.net/images/anime/11/33657l.jpg',
        releaseDate: '2011',
        status: 'Finished Airing'
      },
      {
        id: '1',
        title: 'Cowboy Bebop',
        image: 'https://cdn.myanimelist.net/images/anime/4/19644l.jpg',
        releaseDate: '1998',
        status: 'Finished Airing'
      }
    ];
  }
}