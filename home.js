// =====================================
// OYUNKAFE HOME.JS
// =====================================

let games = [];

let activeCategory = "Tümü";

let currentGame = null;


// ================================
// SAYFA YÜKLENİNCE
// ================================

document.addEventListener("DOMContentLoaded", init);

async function init(){

    await loadGames();

    renderCategories();

    renderGames();

    renderHomeLists();

    updateStats();

    initSearch();

    initCookie();

    initBackTop();

}



// ================================
// GAMES.JSON OKU
// ================================

async function loadGames(){

    try{

        const response = await fetch("games.json");

        games = await response.json();

        console.log("Oyun sayısı:", games.length);

        console.log(games);

    }

    catch(error){

        console.error("JSON HATASI:", error);

    }

}



// ================================
// ARAMA
// ================================

function initSearch(){

    const input = document.getElementById("searchInput");

    if(!input) return;

    input.addEventListener("keyup",renderGames);

}



// ================================
// KATEGORİLER
// ================================

function getCategories(){

    return [

        "Tümü",

        ...new Set(

            games.map(g=>g.category)

        )

    ];

}



function renderCategories(){

    const area = document.getElementById("categories");

    if(!area) return;

    area.innerHTML="";

    getCategories().forEach(category=>{

        area.innerHTML += `

<button

class="${category===activeCategory?'active':''}"

onclick="changeCategory('${category}')">

${category}

</button>

`;

    });

}



function changeCategory(category){

    activeCategory = category;

    renderCategories();

    renderGames();

}



// ================================
// İSTATİSTİKLER
// ================================

function updateStats(){

    const gameCount = document.getElementById("gameCount");

    const categoryCount = document.getElementById("categoryCount");

    if(gameCount)

        gameCount.textContent = games.length + "+";

    if(categoryCount)

        categoryCount.textContent =

        getCategories().length-1;

}
// ================================
// OYUNLARI GÖSTER
// ================================

function renderGames(){

    const grid =
        document.getElementById("gamesGrid");

    if(!grid) return;

    let list = [...games];

    if(activeCategory !== "Tümü"){

        list = list.filter(game =>

            game.category === activeCategory

        );

    }

    const text =
        document.getElementById("searchInput")
        ?.value
        .toLowerCase()
        .trim() || "";

    if(text){

        list = list.filter(game =>

            game.title.toLowerCase().includes(text) ||

            game.category.toLowerCase().includes(text) ||

            game.description.toLowerCase().includes(text)

        );

    }

    grid.innerHTML = "";

    if(list.length === 0){

        grid.innerHTML = `

        <div class="no-result">

            <h2>

                😔 Oyun bulunamadı

            </h2>

            <p>

                Lütfen farklı bir arama yapın.

            </p>

        </div>

        `;

        return;

    }

    list.forEach(game=>{

        grid.insertAdjacentHTML(

            "beforeend",

            createCard(game)

        );

    });

}



// ================================
// KART OLUŞTUR
// ================================

function createCard(game){

    return `
    <article class="card">

        <img
            src="${game.thumb}"
            alt="${game.title}"
            loading="lazy"
            decoding="async"
            width="400"
            height="225">

        <div class="card-content">

            <span class="tag">
                ${game.category}
            </span>

            <h3>${game.title}</h3>

            <p>${game.description}</p>

            <button
                class="btn"
                onclick="openGame('${game.id}')">

                🎮 Hemen Oyna

            </button>

        </div>

    </article>
    `;

}



// ================================
// ANA SAYFA LİSTELERİ
// ================================

function renderHomeLists(){

    // Son eklenenler
    const latestGames = [...games]
        .slice(-5)
        .reverse();

    // Önerilen oyunlar (rastgele)
    const featuredGames = [...games]
        .sort(() => Math.random() - 0.5)
        .slice(0,5);

    // Popüler oyunlar
    // Şimdilik ilk 5 oyun gösteriliyor.
    // İleride games.json dosyasına "popular:true"
    // alanı ekleyerek bunu otomatik yapacağız.
    const popularGames = games.slice(0,5);

    renderSimpleList("popularGames", popularGames);
    renderSimpleList("featuredGames", featuredGames);
    renderSimpleList("latestGames", latestGames);

}



function renderSimpleList(id,list){

    const area = document.getElementById(id);

    if(!area) return;

    area.innerHTML="";

    list.forEach(game=>{

        area.innerHTML += `

<a

onclick="openGame('${game.id}')">

🎮 ${game.title}

</a>

`;

    });

}
// ================================
// OYUNU AÇ
// ================================

function openGame(id){

    window.location.href = "oyun.html?id=" + id;

}



// ================================
// ANA SAYFA
// ================================

function goHome(){

    document.getElementById("gameFrame").src="";

    document.getElementById("gameSection").style.display="none";

    document.getElementById("gameSection")
        .classList.remove("active");

    document.getElementById("homeSection")
        .style.display="block";

    hidePages();

    document.title =
        "OyunKafe | Ücretsiz Online Oyunlar";

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

}



// ================================
// BENZER OYUNLAR
// ================================

function renderRelated(game){

    const area =
        document.getElementById("relatedGames");

    if(!area) return;

    area.innerHTML="";

    const related = games

    .filter(g=>

        g.category===game.category &&

        g.id!==game.id

    )

    .slice(0,4);

    related.forEach(item=>{

        area.insertAdjacentHTML(

            "beforeend",

            createCard(item)

        );

    });

}



// ================================
// BİLGİ SAYFALARI
// ================================

function hidePages(){

    [
    "about",
    "privacy",
    "cookies",
    "terms",
    "dmca",
    "contact"
]

    .forEach(id=>{

        const page =

        document.getElementById(id);

        if(page){

            page.style.display="none";

        }

    });

}



function showPage(id){

    document.getElementById("homeSection")
        .style.display="none";

    document.getElementById("gameSection")
        .style.display="none";

    hidePages();

    const page =
        document.getElementById(id);

    if(page){

        page.style.display="block";

    }

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

}
// ================================
// COOKIE
// ================================

function initCookie(){

    const banner =
        document.getElementById("cookieBanner");

    const btn =
        document.getElementById("acceptCookieBtn");

    if(!banner || !btn) return;

    if(localStorage.getItem("cookieAccepted")){

        banner.style.display = "none";

        return;

    }

    btn.addEventListener("click",()=>{

        localStorage.setItem(

            "cookieAccepted",

            "yes"

        );

        banner.style.display = "none";

    });

}



// ================================
// BACK TO TOP
// ================================

function initBackTop(){

    const btn =
        document.getElementById("backToTop");

    if(!btn) return;

    window.addEventListener("scroll",()=>{

        if(window.scrollY>500){

            btn.style.display="block";

        }

        else{

            btn.style.display="none";

        }

    });

    btn.addEventListener("click",()=>{

        window.scrollTo({

            top:0,

            behavior:"smooth"

        });

    });

}



// ================================
// SEO
// ================================

function updateSEO(game){

    if(!game) return;

    document.title =
        game.title + " | OyunKafe";

    const meta =
        document.querySelector(

            'meta[name="description"]'

        );

    if(meta){

        meta.setAttribute(

            "content",

            game.seo || game.description

        );

    }

}



// ================================
// RASTGELE OYUN
// ================================

function randomGame(){

    if(games.length===0) return;

    const game =

        games[

            Math.floor(

                Math.random()*games.length

            )

        ];

    openGame(game.id);

}



