const config = require("./config");
const utils = require("./utils");

function run(games) {

    const staticPages = [
        { path: "hakkimizda.html", priority: "0.5" },
        { path: "iletisim.html", priority: "0.5" },
        { path: "gizlilik-politikasi.html", priority: "0.4" },
        { path: "cerez-politikasi.html", priority: "0.4" },
        { path: "kullanim-sartlari.html", priority: "0.4" },
        { path: "telif.html", priority: "0.4" }
    ].map(page => `
  <url>
    <loc>${config.siteUrl}/${page.path}</loc>
    <changefreq>monthly</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join("");

    const urls = games.map(game => {

        return `
  <url>
    <loc>${config.siteUrl}/oyun.html?id=${game.id}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;

    }).join("");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>

<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

  <url>
    <loc>${config.siteUrl}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>${staticPages}${urls}

</urlset>`;

    utils.writeFile(config.sitemapFile, xml);

    console.log(utils.green("✓ sitemap.xml oluşturuldu"));

}

module.exports = {
    run
};
