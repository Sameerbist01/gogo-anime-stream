// Consumet API client - Modern anime API with reliable data
const API_BASE_URL = 'https://api.consumet.org/anime/gogoanime';

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
      const response = await fetch(`${API_BASE_URL}${endpoint}`);
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  static async getRecentAnime(page: number = 1): Promise<AnimeItem[]> {
    const data = await this.fetchData<any>(`/recent-episodes?page=${page}`);
    return data.results || [];
  }

  static async getPopularAnime(page: number = 1): Promise<AnimeItem[]> {
    const data = await this.fetchData<any>(`/top-airing?page=${page}`);
    return data.results || [];
  }

  static async searchAnime(query: string): Promise<AnimeItem[]> {
    if (!query.trim()) return [];
    const data = await this.fetchData<any>(`/${encodeURIComponent(query)}`);
    return data.results || [];
  }

  static async getAnimeDetails(id: string): Promise<AnimeDetails> {
    const data = await this.fetchData<AnimeDetails>(`/info/${id}`);
    return data;
  }

  static async getEpisodeStreams(episodeId: string): Promise<StreamingUrls> {
    const data = await this.fetchData<StreamingUrls>(`/watch/${episodeId}`);
    return data;
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
}