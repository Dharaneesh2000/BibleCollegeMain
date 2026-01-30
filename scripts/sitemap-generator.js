
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOMAIN = 'https://godswillbiblecollege.com';

const staticRoutes = [
    '/',
    '/about',
    '/academics',
    '/academics/bachelor-of-theology',
    '/news', // Events list page
    '/contact',
    // Add other static routes here
];

const generateSitemap = () => {
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticRoutes
            .map(route => {
                return `  <url>
    <loc>${DOMAIN}${route}</loc>
    <changefreq>weekly</changefreq>
    <priority>${route === '/' ? '1.0' : '0.8'}</priority>
  </url>`;
            })
            .join('\n')}
</urlset>`;

    const publicDir = path.resolve(__dirname, '../public');
    const sitemapPath = path.join(publicDir, 'sitemap.xml');

    // Ensure public directory exists
    if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
    }

    fs.writeFileSync(sitemapPath, sitemap);
    console.log(`✅ Sitemap structure generated at ${sitemapPath}`);
    console.log(`⚠️ Note: Dynamic event routes are not included in this static generation. Check implementation_plan.md for future improvements.`);
};

generateSitemap();
