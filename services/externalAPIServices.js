import axios from 'axios';

const TIMEOUT = 20000;

export const fetchCountries = async () => {
    try {
        const response = await axios.get('https://restcountries.com/v2/all?fields=name,capital,region,population,flag,currencies', { timeout: TIMEOUT });
        return response.data
    } catch (error) {
        console.error("Error fetching countries:", error.message);
        throw new Error("Failed to fetch countries");
    }
   
  }

  export const fetchUsdRates = async () => {
    try {
        const response = await axios.get('https://open.er-api.com/v6/latest/USD', { timeout: TIMEOUT });
        return response.data
    } catch (error) {
        console.error("Error fetching usdRates:", error.message);
        throw new Error("Failed to fetch usdRates"); 
    }
  }