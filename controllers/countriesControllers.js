
export const refreshCountry = async (req, res) => {
res.status(200).json({ ok: true, route: 'POST /countries/refresh' });
}

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