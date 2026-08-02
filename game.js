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

    const recent = JSON.parse(localStorage.getItem("recentGames") || "[]")
        .filter(gameId => gameId !== game.id);
    recent.unshift(game.id);
    localStorage.setItem("recentGames", JSON.stringify(recent.slice(0, 4)));

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

createBreadcrumbSchema(game);
createGameSchema(game);

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

function getGameContent(game){

    const categoryTips = {
        "Araba": "Virajlara girmeden önce hızınızı ayarlayın; kısa ve kontrollü hareketler daha güvenlidir.",
        "Motor": "Dengeyi korumak için engelleri önceden okuyun ve ani hareketlerden kaçının.",
        "Parkour": "Bölümün ritmini ilk denemelerde gözlemleyin; her engeli aynı hızla geçmeye çalışmayın.",
        "Futbol": "Rakibin hamlesini izleyin ve doğru anda pas ya da şut seçeneğini deneyin.",
        "Zeka": "Hızlı karar vermeden önce olası hamleleri karşılaştırın; küçük adımlar daha az hata getirir.",
        "Bulmaca": "Kolay görünen parçaları önce yerleştirin ve çözümü aşamalara bölün.",
        "Kart": "Elinizdeki seçenekleri acele etmeden değerlendirin ve bir sonraki turu da düşünün."
    };

    return {
        howToPlay: game.howToPlay?.length ? game.howToPlay : [
            `${game.title} açıldığında ekrandaki kısa yönlendirmeyi inceleyin.`,
            "Kontrolleri ilk bölümde deneyerek oyunun temposuna alışın.",
            "Hedefi tamamlayın, skorunuzu geliştirin ve isterseniz yeniden oynayın."
        ],
        features: game.features?.length ? game.features : [
            "Tarayıcıdan anında oynanabilir", "Mobil ve bilgisayar uyumlu", `${game.category} türünde ücretsiz oyun`
        ],
        tips: game.tips?.length ? game.tips : [
            categoryTips[game.category] || "İlk denemeyi oyunun kurallarını ve kontrollerini anlamak için kullanın.",
            "Kısa molalar vererek daha dikkatli ve keyifli oynayın.",
            "Zorlandığınızda benzer oyunları deneyerek farklı bir oyun tarzı keşfedin."
        ],
        faq: game.faq?.length ? game.faq : [
            { q: `${game.title} ücretsiz mi?`, a: "Evet. OyunKafe'de bu oyunu tarayıcınızdan ücretsiz oynayabilirsiniz." },
            { q: `${game.title} mobilde oynanır mı?`, a: "Oyun, uyumlu mobil tarayıcılarda ve bilgisayarda çalışacak şekilde sunulur." }
        ]
    };
}

function renderHowToPlay(game){

    const area = document.getElementById("howToPlay");

    if (!area) return;

    const content = getGameContent(game);

    area.innerHTML = content.howToPlay
        .map(item => `<li>${item}</li>`)
        .join("");
}

function renderFeatures(game){

    const area=document.getElementById("gameFeatures");

    const content = getGameContent(game);

    area.innerHTML=content.features
        .map(item=>`<div class="feature-item">${item}</div>`)
        .join("");

}

function renderTips(game){

    const area=document.getElementById("gameTips");

    const content = getGameContent(game);

    area.innerHTML=content.tips
        .map(item=>`<li>${item}</li>`)
        .join("");

}

function renderFAQ(game){

    const area=document.getElementById("faqArea");

    const content = getGameContent(game);

    area.innerHTML=content.faq.map(item=>`

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
function createBreadcrumbSchema(game){

    const schema = {

        "@context":"https://schema.org",

        "@type":"BreadcrumbList",

        "itemListElement":[

            {
                "@type":"ListItem",
                "position":1,
                "name":"Ana Sayfa",
                "item":"https://www.oyunkafe.com/"
            },

            {
                "@type":"ListItem",
                "position":2,
                "name":game.category
            },

            {
                "@type":"ListItem",
                "position":3,
                "name":game.title,
                "item":window.location.href
            }

        ]

    };

    document.getElementById("breadcrumbSchema").textContent =
        JSON.stringify(schema);

}
function createGameSchema(game){

    const schema={

        "@context":"https://schema.org",

        "@type":"VideoGame",

        "name":game.title,

        "description":game.seo || game.description,

        "genre":game.category,

        "applicationCategory":"Game",

        "operatingSystem":"Web Browser",

        "url":window.location.href,

        "image":"https://www.oyunkafe.com/" + game.thumb,

        "author":{
            "@type":"Organization",
            "name":"OyunKafe"
        },

        "publisher":{
            "@type":"Organization",
            "name":"OyunKafe"
        }

    };

    if(game.rating){

        schema.aggregateRating={

            "@type":"AggregateRating",

            "ratingValue":game.rating,

            "ratingCount":game.ratingCount || 1

        };

    }

    document.getElementById("gameSchema").textContent=
        JSON.stringify(schema);

}
