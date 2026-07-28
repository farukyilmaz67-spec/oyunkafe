const timer = require("./timer");
const logger = require("./logger");
const sitemap = require("./sitemap");
const config = require("./config");
const utils = require("./utils");
const validator = require("./validator");
const report = require("./report");

console.clear();
timer.start();

logger.title("OYUNKAFE BUILD SYSTEM v2");

logger.info("Site : " + config.siteName);
logger.info("URL  : " + config.siteUrl);

logger.line();

if (!utils.exists(config.gamesFile)) {

    console.log(utils.red("games.json bulunamadı!"));

    process.exit();

}

utils.makeFolder(config.reportsFolder);

logger.success("Yapı kontrolü başarılı.");

console.log("");

const result = validator.run();

console.log("");

console.log("Toplam oyun :", result.games.length);

console.log("");

console.log(utils.green("Hata : " + result.errors.length));

console.log(utils.yellow("Uyarı : " + result.warnings.length));

console.log("");

if (result.errors.length > 0) {

    console.log(utils.red("HATALAR"));

    result.errors.forEach(error => {

        console.log(" - " + error);

    });

}

if (result.warnings.length > 0) {

    console.log("");

    console.log(utils.yellow("UYARILAR"));

    result.warnings.forEach(warning => {

        console.log(" - " + warning);

    });

}
console.log("");

console.log("========== İSTATİSTİK ==========");

console.log("Toplam oyun      :", result.stats.total);

console.log("Resim bulunan    :", result.stats.imagesOk);

console.log("Resim eksik      :", result.stats.imagesMissing);

console.log("SEO bulunan      :", result.stats.seoOk);

console.log("SEO eksik        :", result.stats.seoMissing);

logger.line();
report.run(result);

sitemap.run(result.games);
const duration = timer.stop();

logger.line();
logger.info("Build Süresi : " + duration + " ms");
logger.success("BUILD SUCCESS");