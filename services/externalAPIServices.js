import axios from 'axios';

const TIMEOUT = 20000;

export const fetchCountries = async () => {
    try {
        const response = await axios.get(process.env.COUNTRIES_API+`?fields=name,capital,region,population,flag,currencies`, { timeout: TIMEOUT });
        return response.data
    } catch (error) {
        console.error("Error fetching countries:", error.message);
        throw new Error("Failed to fetch countries");
    }
   
  }

  export const fetchUsdRates = async () => {
    try {
        const response = await axios.get(process.env.EXCHANGE_RATE_API, { timeout: TIMEOUT });
        return response.data
    } catch (error) {
        console.error("Error fetching usdRates:", error.message);
        throw new Error("Failed to fetch usdRates"); 
    }
  }