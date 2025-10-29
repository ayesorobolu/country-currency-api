import { refreshCountries } from '../services/countryService.js';

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
    res.json({ ok: true, route: 'GET /countries', query: req.query });
}

export const getImage = async (req, res) => {
    res.json({ ok: true, route: 'GET /countries/image' });
}

export const getCountry = async (req, res) => {
    res.json({ ok: true, route: 'GET /countries/:name', params: req.params });
}

export const deleteCountry = async (req, res) => {
    res.json({ ok: true, route: 'DELETE /countries/:name', params: req.params });
}

export const getStatus = async (req, res) => {
    res.json({ total_countries: 0, last_refreshed_at: null });
}