let games = [];

async function loadGame() {

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (!id) {

    document.body.innerHTML = `

    <div class="container" style="padding:80px 20px;text-align:center;">

        <h1>🎮 Oyun Bulunamadı</h1>

        <p>Aradığınız oyun mevcut değil veya bağlantı hatalı.</p>

        <br>

        <a href="index.html" class="btn">

            Ana Sayfaya Dön

        </a>

    </div>

    `;

    return;

}

    const response = await fetch("games.json");
    games = await response.json();

    const game = games.find(g => g.id === id);

    if (!game) {

    document.body.innerHTML = `

    <div class="container" style="padding:80px 20px;text-align:center;">

        <h1>❌ Oyun Bulunamadı</h1>

        <p>Bu oyun kaldırılmış olabilir.</p>

        <br>

        <a href="index.html" class="btn">

            Ana Sayfaya Dön

        </a>

    </div>

    `;

    return;

}

    document.title = game.title + " | OyunKafe";

document.getElementById("pageDescription").setAttribute(
"content",
game.description
);

document.getElementById("canonicalLink").href =
window.location.href;

document.getElementById("ogTitle").setAttribute(
"content",
game.title + " | OyunKafe"
);

document.getElementById("ogDescription").setAttribute(
"content",
game.description
);

document.getElementById("ogUrl").setAttribute(
"content",
window.location.href
);

document.getElementById("breadcrumbGame").textContent =
game.title;

    document.getElementById("gameTitle").textContent = game.title;
    document.getElementById("gameCategory").textContent = game.category;
    document.getElementById("gameDescription").textContent = game.description;

    document.getElementById("gameFrame").src = game.embed;

    renderRelated(game);
}

function renderRelated(game) {

    const area = document.getElementById("relatedGames");

    area.innerHTML = "";

    games
        .filter(g => g.category === game.category && g.id !== game.id)
        .slice(0, 4)
        .forEach(item => {

            area.innerHTML += `
            <article class="card">

                <img src="${item.thumb}" alt="${item.title}">

                <div class="card-content">

                    <span class="tag">${item.category}</span>

                    <h3>${item.title}</h3>

                    <button class="btn"
                    onclick="location.href='oyun.html?id=${item.id}'">

                        🎮 Hemen Oyna

                    </button>

                </div>

            </article>
            `;

        });

}

window.addEventListener("DOMContentLoaded", loadGame);