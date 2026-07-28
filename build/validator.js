const fs = require("fs");
const path = require("path");

const config = require("./config");
const utils = require("./utils");

function run() {

    const games = utils.readJSON(config.gamesFile);

    const result = {
        games,
        errors: [],
        warnings: [],
        stats: {
            total: games.length,
            imagesOk: 0,
            imagesMissing: 0,
            seoOk: 0,
            seoMissing: 0
        }
    };

    const ids = new Set();

    games.forEach((game, index) => {

        const no = index + 1;

        // ID kontrolü
        if (!game.id) {
            result.errors.push(`Satır ${no}: id alanı eksik`);
        } else {

            if (ids.has(game.id)) {
                result.errors.push(`Duplicate id: ${game.id}`);
            }

            ids.add(game.id);
        }

        // Title
        if (!game.title) {
            result.errors.push(`${game.id}: title eksik`);
        }

        // Description
        if (!game.description) {
            result.warnings.push(`${game.id}: description yok`);
        } else if (game.description.length < 80) {
            result.warnings.push(`${game.id}: description kısa`);
        }

        // Thumb
        if (!game.thumb) {

            result.errors.push(`${game.id}: thumb yok`);

        } else {

            const imagePath = path.join(config.root, game.thumb);

            if (fs.existsSync(imagePath)) {
                result.stats.imagesOk++;
            } else {
                result.stats.imagesMissing++;
                result.warnings.push(
                    `${game.id}: resim bulunamadı (${game.thumb})`
                );
            }

        }

        // Embed
        if (!game.embed) {
            result.errors.push(`${game.id}: embed eksik`);
        }

        // SEO
        if (!game.seo) {
            result.stats.seoMissing++;
            result.warnings.push(`${game.id}: seo açıklaması yok`);
        } else {
            result.stats.seoOk++;
        }

    });

    return result;

}

module.exports = {
    run
};