import pool from '../DB/pool.js';

export const getStatus = async (req, res) => {
    try {
        const [[countRow]] = await pool.query('SELECT COUNT(*) AS total FROM countries');
        const [[metaRow]] = await pool.query(
          "SELECT v AS last_refreshed_at FROM app_meta WHERE k='last_refreshed_at' LIMIT 1"
        );
        return res.json({
          total_countries: Number(countRow?.total || 0),
          last_refreshed_at: metaRow?.last_refreshed_at || null
        });
      } catch (e) {
        console.error(e);
        return res.status(500).json({ error: 'Internal server error' });
      }
}