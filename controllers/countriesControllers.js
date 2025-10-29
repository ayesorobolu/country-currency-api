import { refreshCountries } from '../services/countryService.js';
import fs from 'fs';
import path from 'path';
import pool from '../DB/pool.js';

export const refreshCountry = async (req, res) => {
    try {
        await refreshCountries();
        return res.status(200).json({ ok: true });
      } catch (e) {
        if (e.statusCode === 503) {
          return res.status(503).json({
            error: 'External data source unavailable',
            details: 'Could not fetch data from REST Countries or Exchange Rates'
          });
        }
        console.error(e);
        return res.status(500).json({ error: 'Internal server error' });
      }
};

export const getCountries = async (req, res) => {
try {
    const { region, currency, sort } = req.query;

    let orderBy = 'name ASC';
    if (sort === 'gdp_desc') orderBy = 'estimated_gdp DESC';
   else if (sort === 'gdp_asc') orderBy = 'estimated_gdp ASC';
   else if (sort === 'name_desc') orderBy = 'name DESC';

   const filters = [];
const params = [];

if (region) { filters.push('region = ?'); params.push(region); }
if (currency) { filters.push('currency_code = ?'); params.push(currency); }

const where = filters.length ? `WHERE ${filters.join(' AND ')}` : '';

const sql = `
  SELECT id, name, capital, region, population, currency_code, exchange_rate, estimated_gdp, flag_url, last_refreshed_at
  FROM countries
  ${where}
  ORDER BY ${orderBy}
`;

const [rows] = await pool.query(sql, params);
return res.json(rows);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export const getImage = async (req, res) => {
    const imgPath = path.join(process.cwd(), 'cache', 'summary.png');
    if (!fs.existsSync(imgPath)) {
      return res.status(404).json({ error: 'Summary image not found' });
    }
    return res.sendFile(imgPath);
};

export const getCountry = async (req, res) => {
    try {
        const { name } = req.params;
      
        const [rows] = await pool.query(
          `SELECT id, name, capital, region, population, currency_code, exchange_rate, estimated_gdp, flag_url, last_refreshed_at
           FROM countries
           WHERE name_ci = LOWER(?)
           LIMIT 1`,
          [name]
        );
      
        if (!rows.length) {
          return res.status(404).json({ error: 'Country not found' });
        }
      
        return res.json(rows[0]);
      } catch (e) {
        console.error(e);
        return res.status(500).json({ error: 'Internal server error' });
      }
}

export const deleteCountry = async (req, res) => {
    try {
        const { name } = req.params;
      
        const [result] = await pool.query(
          'DELETE FROM countries WHERE name_ci = LOWER(?)',
          [name]
        );
      
        if (result.affectedRows === 0) {
          return res.status(404).json({ error: 'Country not found' });
        }
      
        return res.json({ deleted: true });
      } catch (e) {
        console.error(e);
        return res.status(500).json({ error: 'Internal server error' });
      }
}

export const getStatus = async (req, res) => {
    res.json({ total_countries: 0, last_refreshed_at: null });
}