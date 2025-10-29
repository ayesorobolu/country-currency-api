import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import pool from '../DB/pool.js';

export const generateSummaryImage = async () => {
        // 1) Query totals, top 5, last refresh
        const [[countRow]] = await pool.query('SELECT COUNT(*) AS total FROM countries');
        const [topRows] = await pool.query(
          'SELECT name, estimated_gdp FROM countries WHERE estimated_gdp IS NOT NULL ORDER BY estimated_gdp DESC LIMIT 5'
        );
        const [[metaRow]] = await pool.query(
          "SELECT v AS last_refreshed_at FROM app_meta WHERE k='last_refreshed_at' LIMIT 1"
        );
      
        const total = Number(countRow?.total || 0);
        const lastRefreshed = metaRow?.last_refreshed_at || 'N/A';
      
        // 2) SVG layout for the three required items
        const width = 900;
        const height = 500;
      
        const topLines = topRows.map((r, i) => {
          const v = Number(r.estimated_gdp).toLocaleString();
          const y = 190 + i * 28;
          return `<text x="30" y="${y}" font-size="16" fill="#e2e8f0">${i + 1}. ${r.name} — ${v}</text>`;
        }).join('');
      
        const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#0f172a"/>
        <text x="30" y="50" font-size="28" font-weight="700" fill="#e2e8f0">Countries Summary</text>
        <text x="30" y="90" font-size="16" fill="#e2e8f0">Total countries: ${total}</text>
        <text x="30" y="120" font-size="16" fill="#e2e8f0">Last refresh: ${lastRefreshed}</text>
        <text x="30" y="160" font-size="16" fill="#e2e8f0">Top 5 by Estimated GDP</text>
        ${topLines}
      </svg>`.trim();
      
        // 3) Save to cache/summary.png
        const outDir = path.join(process.cwd(), 'cache');
        if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
      
        const outPath = path.join(outDir, 'summary.png');
        await sharp(Buffer.from(svg)).png().toFile(outPath);
      
        return outPath;
}