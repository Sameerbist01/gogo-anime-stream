// GogoAnime API client
const API_BASE_URL = 'https://api.apurvsikka.workers.dev';

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
    const data = await this.fetchData<any>(`/recent/${page}`);
    return data.results || [];
  }

  static async getPopularAnime(page: number = 1): Promise<AnimeItem[]> {
    const data = await this.fetchData<any>(`/gogoPopular/${page}`);
    return data.results || [];
  }

  static async searchAnime(query: string): Promise<AnimeItem[]> {
    if (!query.trim()) return [];
    const data = await this.fetchData<any>(`/search/${encodeURIComponent(query)}`);
    return data.results || [];
  }

  static async getAnimeDetails(id: string): Promise<AnimeDetails> {
    const data = await this.fetchData<AnimeDetails>(`/anime/${id}`);
    return data;
  }

  static async getEpisodeStreams(episodeId: string): Promise<StreamingUrls> {
    const data = await this.fetchData<StreamingUrls>(`/episode/${episodeId}`);
    return data;
  }

  static async getHomeData() {
    const data = await this.fetchData<any>('/home');
    return {
      trending: data.trending || [],
      popular: data.popular || []
    };
  }
}