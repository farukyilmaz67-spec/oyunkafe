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

renderHowToPlay(game);
renderFeatures(game);
renderTips(game);
renderFAQ(game);

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
function renderHowToPlay(game){

    const area=document.getElementById("howToPlay");

    if(!game.howToPlay || game.howToPlay.length===0){
        area.parentElement.style.display="none";
        return;
    }

    area.innerHTML=game.howToPlay
        .map(item=>`<li>${item}</li>`)
        .join("");

}

function renderFeatures(game){

    const area=document.getElementById("gameFeatures");

    if(!game.features || game.features.length===0){
        area.parentElement.style.display="none";
        return;
    }

    area.innerHTML=game.features
        .map(item=>`<div class="feature-item">${item}</div>`)
        .join("");

}

function renderTips(game){

    const area=document.getElementById("gameTips");

    if(!game.tips || game.tips.length===0){
        area.parentElement.style.display="none";
        return;
    }

    area.innerHTML=game.tips
        .map(item=>`<li>${item}</li>`)
        .join("");

}

function renderFAQ(game){

    const area=document.getElementById("faqArea");

    if(!game.faq || game.faq.length===0){
        area.parentElement.style.display="none";
        return;
    }

    area.innerHTML=game.faq.map(item=>`

        <div class="faq-item">

            <button class="faq-question">

                <span>${item.q}</span>

                <span>+</span>

            </button>

            <div class="faq-answer">

                ${item.a}

            </div>

        </div>

    `).join("");

    area.querySelectorAll(".faq-question").forEach(btn=>{

        btn.addEventListener("click",()=>{

            const item=btn.parentElement;

            item.classList.toggle("active");

        });

    });

}