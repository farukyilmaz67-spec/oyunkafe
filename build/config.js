const path = require("path");

const ROOT = path.join(__dirname, "..");

module.exports = {

    // Site bilgileri
    siteName: "OyunKafe",
    siteUrl: "https://www.oyunkafe.com",

    // Ana klasör
    root: ROOT,

    // Ana dosyalar
    gamesFile: path.join(ROOT, "games.json"),
    sitemapFile: path.join(ROOT, "sitemap.xml"),
    robotsFile: path.join(ROOT, "robots.txt"),
    manifestFile: path.join(ROOT, "manifest.json"),

    // Klasörler
    buildFolder: path.join(ROOT, "build"),
    reportsFolder: path.join(ROOT, "reports"),
    imagesFolder: path.join(ROOT, "images"),
    gamesFolder: path.join(ROOT, "games"),

    // Oluşturulacak rapor
    reportFile: path.join(ROOT, "reports", "report.html")

};
