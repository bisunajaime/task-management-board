import axios from "axios"
import { UNSPLASH_API_KEY } from "./secrets";


export const getRandomImage = async () => {
    const url = "https://api.unsplash.com/photos/random?query=design";
    const HEADERS = {
        'Authorization': `Client-ID ${UNSPLASH_API_KEY}`
    };
    const response = await axios.get(url, { headers: HEADERS });
    const { urls } = response.data;
    const { small } = urls;
    return small;
}