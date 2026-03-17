import axios from 'axios';

interface UnsplashPhotoUrls {
  raw: string;
  full: string;
  regular: string;
  small: string;
  thumb: string;
}

interface UnsplashPhoto {
  urls: UnsplashPhotoUrls;
}

export const getRandomImage = async (): Promise<string> => {
  const apiKey = process.env.REACT_APP_UNSPLASH_API_KEY;
  if (!apiKey) {
    return `https://picsum.photos/seed/${Date.now()}/800/400`;
  }
  const url = 'https://api.unsplash.com/photos/random?query=design';
  const headers = { Authorization: `Client-ID ${apiKey}` };
  const response = await axios.get<UnsplashPhoto>(url, { headers });
  return response.data.urls.small;
};
