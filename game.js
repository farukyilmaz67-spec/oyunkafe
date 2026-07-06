let games = [];

async function loadGame() {

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (!id) {
        document.body.innerHTML = "<h1>Oyun ID bulunamadı.</h1>";
        return;
    }

    const response = await fetch("games.json");
    games = await response.json();

    const game = games.find(g => g.id === id);

    if (!game) {
        document.body.innerHTML = "<h1>Oyun bulunamadı.</h1>";
        return;
    }

    document.title = game.title + " | OyunKafe";

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