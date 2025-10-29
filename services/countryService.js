import pool from '../DB/pool.js';
import { fetchCountries, fetchUsdRates } from './externalAPIServices.js';

const UPSERT_SQL = `
  INSERT INTO countries (
    name, name_ci, capital, region, population, currency_code, exchange_rate, estimated_gdp, flag_url, last_refreshed_at
  ) VALUES (?, LOWER(?), ?, ?, ?, ?, ?, ?, ?, NOW())
  ON DUPLICATE KEY UPDATE
    capital = VALUES(capital),
    region = VALUES(region),
    population = VALUES(population),
    currency_code = VALUES(currency_code),
    exchange_rate = VALUES(exchange_rate),
    estimated_gdp = VALUES(estimated_gdp),
    flag_url = VALUES(flag_url),
    last_refreshed_at = NOW()
`;

function randomMultiplier() {
  return Math.floor(Math.random() * 1001) + 1000; // 1000..2000
}

function buildRow(country, rateMap) {
  const name = country.name;
  const capital = country.capital || null;
  const region = country.region || null;
  const population = Number(country.population || 0);
  const flagUrl = country.flag || null;

  let currencyCode = null;
  let exchangeRate = null;
  let estimatedGdp = null;

  const currencies = Array.isArray(country.currencies) ? country.currencies : [];
  if (currencies.length === 0) {
    currencyCode = null;
    exchangeRate = null;
    estimatedGdp = 0;
  } else {
    const first = currencies[0];
    currencyCode = first?.code || null;
    if (currencyCode && rateMap[currencyCode] != null) {
      exchangeRate = Number(rateMap[currencyCode]);
      const mult = randomMultiplier();
      estimatedGdp = exchangeRate > 0 ? (population * mult) / exchangeRate : null;
    } else if (currencyCode) {
      exchangeRate = null;
      estimatedGdp = null;
    } else {
      exchangeRate = null;
      estimatedGdp = 0;
    }
  }

  return [name, name, capital, region, population, currencyCode, exchangeRate, estimatedGdp, flagUrl];
}

export async function refreshCountries() {
    // 1) Fetch upstream first; if fail → 503 and stop
    const [countries, ratesPayload] = await Promise.all([
      fetchCountries(),
      fetchUsdRates()
    ]);
  
    if (!Array.isArray(countries) || !ratesPayload?.rates) {
      const err = new Error('External data source unavailable');
      err.statusCode = 503;
      throw err;
    }
    const rateMap = ratesPayload.rates;
  
    // 2) Transaction: upsert + meta update
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
  
      for (const c of countries) {
        const params = buildRow(c, rateMap);
        await conn.execute(UPSERT_SQL, params);
      }
  
      await conn.execute(
        'INSERT INTO app_meta (k, v) VALUES (?, ?) ON DUPLICATE KEY UPDATE v = VALUES(v)',
        ['last_refreshed_at', new Date().toISOString()]
      );
  
      await conn.commit();
    } catch (e) {
      await conn.rollback();
      throw e;
    } finally {
      conn.release();
    }
  }