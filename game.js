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

    try {

        const response = await fetch("games.json");

        if (!response.ok) {
            throw new Error("games.json yüklenemedi.");
        }

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

        const recent = JSON.parse(
            localStorage.getItem("recentGames") || "[]"
        )
        .filter(gameId => gameId !== game.id);

        recent.unshift(game.id);

        localStorage.setItem(
            "recentGames",
            JSON.stringify(recent.slice(0, 4))
        );

        document.title = game.title + " | OyunKafe";

        /*
         * ==========================================
         * SEO META DESCRIPTION
         * ==========================================
         */

        const metaDescription =
            game.seo ||
            game.description ||
            `OyunKafe'de ${game.title} oyununu ücretsiz oynayın.`;

        document
            .getElementById("pageDescription")
            .setAttribute(
                "content",
                metaDescription.slice(0, 160)
            );


        /*
         * ==========================================
         * CANONICAL URL
         * ==========================================
         */

        const canonicalUrl =
            `https://www.oyunkafe.com/oyun?id=${encodeURIComponent(game.id)}`;

        document
            .getElementById("canonicalLink")
            .href = canonicalUrl;


        /*
         * ==========================================
         * OPEN GRAPH
         * ==========================================
         */

        document
            .getElementById("ogTitle")
            .setAttribute(
                "content",
                game.title + " | OyunKafe"
            );

        document
            .getElementById("ogDescription")
            .setAttribute(
                "content",
                game.description || metaDescription
            );

        document
            .getElementById("ogUrl")
            .setAttribute(
                "content",
                canonicalUrl
            );

        if (game.thumb) {

            const ogImage =
                game.thumb.startsWith("http")
                    ? game.thumb
                    : `https://www.oyunkafe.com/${game.thumb}`;

            document
                .getElementById("ogImage")
                .setAttribute(
                    "content",
                    ogImage
                );
        }


        /*
         * ==========================================
         * BREADCRUMB
         * ==========================================
         */

        document
            .getElementById("breadcrumbGame")
            .textContent = game.title;


        /*
         * ==========================================
         * ANA OYUN BİLGİLERİ
         * ==========================================
         */

        document
            .getElementById("gameTitle")
            .textContent = game.title;

        document
            .getElementById("gameCategory")
            .textContent = game.category;


        /*
         * ÖNEMLİ:
         *
         * longDescription varsa onu kullanıyoruz.
         * Böylece games.json içinde hazırladığımız
         * özgün uzun açıklamalar gerçekten sayfada
         * görünecek.
         */

        const descriptionArea =
            document.getElementById("gameDescription");

        const fullDescription =
            game.longDescription ||
            game.description ||
            "";

        if (fullDescription) {

            descriptionArea.innerHTML =
                fullDescription
                    .split(/\n\s*\n/)
                    .filter(Boolean)
                    .map(paragraph =>
                        `<p>${paragraph.trim()}</p>`
                    )
                    .join("");

        } else {

            descriptionArea.textContent =
                "Bu oyun hakkında henüz açıklama bulunmuyor.";

        }


        /*
         * ==========================================
         * OYUN FRAME
         * ==========================================
         */

        document
            .getElementById("gameFrame")
            .src = game.embed;


        /*
         * ==========================================
         * İÇERİK BÖLÜMLERİ
         * ==========================================
         */

        renderHowToPlay(game);

        renderFeatures(game);

        renderTips(game);

        renderFAQ(game);


        /*
         * ==========================================
         * STRUCTURED DATA
         * ==========================================
         */

        createBreadcrumbSchema(game);

        createGameSchema(game);


        /*
         * ==========================================
         * BENZER OYUNLAR
         * ==========================================
         */

        renderRelated(game);

    }

    catch (error) {

        console.error(
            "Oyun yüklenirken hata oluştu:",
            error
        );

        document.body.innerHTML = `

        <div class="container" style="padding:80px 20px;text-align:center;">

            <h1>⚠️ Oyun Yüklenemedi</h1>

            <p>
                Oyun bilgileri yüklenirken bir sorun oluştu.
                Lütfen sayfayı yenileyin.
            </p>

            <br>

            <a href="index.html" class="btn">
                Ana Sayfaya Dön
            </a>

        </div>

        `;

    }

}
function renderRelated(game) {

    const area =
        document.getElementById("relatedGames");

    if (!area) return;

    area.innerHTML = "";

    games
        .filter(
            g =>
                g.category === game.category &&
                g.id !== game.id
        )
        .slice(0, 4)
        .forEach(item => {

            area.innerHTML += `

            <article class="card">

                <img
                    src="${item.thumb}"
                    alt="${item.title}"
                    loading="lazy"
                >

                <div class="card-content">

                    <span class="tag">
                        ${item.category}
                    </span>

                    <h3>
                        ${item.title}
                    </h3>

                    <button
                        class="btn"
                        onclick="location.href='oyun.html?id=${item.id}'"
                    >

                        🎮 Hemen Oyna

                    </button>

                </div>

            </article>

            `;

        });

}


/*
 * ==========================================
 * SAYFA YÜKLENDİĞİNDE OYUNU BAŞLAT
 * ==========================================
 */

window.addEventListener(
    "DOMContentLoaded",
    loadGame
);


/*
 * ==========================================
 * OYUN İÇERİKLERİ
 * ==========================================
 */

function getGameContent(game) {

    const categoryTips = {

        "Araba":
            "Virajlara girmeden önce hızınızı ayarlayın; kısa ve kontrollü hareketler daha güvenlidir.",

        "Motor":
            "Dengeyi korumak için engelleri önceden okuyun ve ani hareketlerden kaçının.",

        "Parkour":
            "Bölümün ritmini ilk denemelerde gözlemleyin; her engeli aynı hızla geçmeye çalışmayın.",

        "Futbol":
            "Rakibin hamlesini izleyin ve doğru anda pas ya da şut seçeneğini deneyin.",

        "Zeka":
            "Hızlı karar vermeden önce olası hamleleri karşılaştırın; küçük adımlar daha az hata getirir.",

        "Bulmaca":
            "Kolay görünen parçaları önce yerleştirin ve çözümü aşamalara bölün.",

        "Kart":
            "Elinizdeki seçenekleri acele etmeden değerlendirin ve bir sonraki turu da düşünün."

    };


    return {

        /*
         * games.json'da özel içerik varsa
         * onu kullan.
         */

        howToPlay:
            game.howToPlay?.length
                ? game.howToPlay
                : [

                    `${game.title} açıldığında ekrandaki kısa yönlendirmeyi inceleyin.`,

                    "Kontrolleri ilk bölümde deneyerek oyunun temposuna alışın.",

                    "Hedefi tamamlayın, skorunuzu geliştirin ve isterseniz yeniden oynayın."

                ],


        features:
            game.features?.length
                ? game.features
                : [

                    "Tarayıcıdan anında oynanabilir",

                    "Mobil ve bilgisayar uyumlu",

                    `${game.category} türünde ücretsiz oyun`

                ],


        tips:
            game.tips?.length
                ? game.tips
                : [

                    categoryTips[game.category]
                        ||
                    "İlk denemeyi oyunun kurallarını ve kontrollerini anlamak için kullanın.",

                    "Kısa molalar vererek daha dikkatli ve keyifli oynayın.",

                    "Zorlandığınızda benzer oyunları deneyerek farklı bir oyun tarzı keşfedin."

                ],


        faq:
            game.faq?.length
                ? game.faq
                : [

                    {
                        q:
                            `${game.title} ücretsiz mi?`,

                        a:
                            "Evet. OyunKafe'de bu oyunu tarayıcınızdan ücretsiz oynayabilirsiniz."
                    },

                    {
                        q:
                            `${game.title} mobilde oynanır mı?`,

                        a:
                            "OyunKafe'de oyun mobil ve bilgisayar uyumluluğu için sunulmaktadır; cihaz ve oyunun kendi kontrol desteğine göre deneyim değişebilir."
                    }

                ]

    };

}


/*
 * ==========================================
 * NASIL OYNANIR
 * ==========================================
 */

function renderHowToPlay(game) {

    const area =
        document.getElementById("howToPlay");

    if (!area) return;

    const content =
        getGameContent(game);

    area.innerHTML =
        content.howToPlay

            .map(
                item =>
                    `<li>${item}</li>`
            )

            .join("");

}


/*
 * ==========================================
 * OYUN ÖZELLİKLERİ
 * ==========================================
 */

function renderFeatures(game) {

    const area =
        document.getElementById("gameFeatures");

    if (!area) return;

    const content =
        getGameContent(game);

    area.innerHTML =
        content.features

            .map(
                item =>
                    `<div class="feature-item">${item}</div>`
            )

            .join("");

}


/*
 * ==========================================
 * İPUÇLARI
 * ==========================================
 */

function renderTips(game) {

    const area =
        document.getElementById("gameTips");

    if (!area) return;

    const content =
        getGameContent(game);

    area.innerHTML =
        content.tips

            .map(
                item =>
                    `<li>${item}</li>`
            )

            .join("");

}
/*
 * ==========================================
 * SIK SORULAN SORULAR
 * ==========================================
 */

function renderFAQ(game) {

    const area =
        document.getElementById("faqArea");

    if (!area) return;

    const content =
        getGameContent(game);

    area.innerHTML =
        content.faq

            .map(item => `

                <div class="faq-item">

                    <button
                        class="faq-question"
                        type="button"
                        aria-expanded="false"
                    >

                        <span>
                            ${item.q}
                        </span>

                        <span>
                            +
                        </span>

                    </button>

                    <div class="faq-answer">

                        ${item.a}

                    </div>

                </div>

            `)

            .join("");


    /*
     * FAQ aç / kapat
     */

    area
        .querySelectorAll(".faq-question")
        .forEach(btn => {

            btn.addEventListener(
                "click",
                () => {

                    const item =
                        btn.parentElement;

                    const isActive =
                        item.classList.contains("active");

                    /*
                     * Aynı anda sadece bir
                     * FAQ açık kalsın.
                     */

                    area
                        .querySelectorAll(".faq-item.active")
                        .forEach(openItem => {

                            openItem.classList.remove("active");

                            const openButton =
                                openItem.querySelector(
                                    ".faq-question"
                                );

                            if (openButton) {

                                openButton
                                    .setAttribute(
                                        "aria-expanded",
                                        "false"
                                    );

                            }

                        });


                    if (!isActive) {

                        item.classList.add("active");

                        btn.setAttribute(
                            "aria-expanded",
                            "true"
                        );

                    }

                }
            );

        });

}


/*
 * ==========================================
 * BREADCRUMB SCHEMA
 * ==========================================
 */

function createBreadcrumbSchema(game) {

    const canonicalUrl =
        `https://www.oyunkafe.com/oyun?id=${encodeURIComponent(game.id)}`;


    const schema = {

        "@context":
            "https://schema.org",

        "@type":
            "BreadcrumbList",

        "itemListElement": [

            {

                "@type":
                    "ListItem",

                "position":
                    1,

                "name":
                    "Ana Sayfa",

                "item":
                    "https://www.oyunkafe.com/"

            },

            {

                "@type":
                    "ListItem",

                "position":
                    2,

                "name":
                    game.category

            },

            {

                "@type":
                    "ListItem",

                "position":
                    3,

                "name":
                    game.title,

                "item":
                    canonicalUrl

            }

        ]

    };


    const schemaElement =
        document.getElementById(
            "breadcrumbSchema"
        );

    if (schemaElement) {

        schemaElement.textContent =
            JSON.stringify(schema);

    }

}


/*
 * ==========================================
 * VIDEO GAME SCHEMA
 * ==========================================
 */

function createGameSchema(game) {

    const canonicalUrl =
        `https://www.oyunkafe.com/oyun?id=${encodeURIComponent(game.id)}`;


    const schema = {

        "@context":
            "https://schema.org",

        "@type":
            "VideoGame",

        "name":
            game.title,

        "description":
            game.longDescription ||
            game.seo ||
            game.description ||
            "",

        "genre":
            game.category,

        "applicationCategory":
            "Game",

        "operatingSystem":
            "Web Browser",

        "url":
            canonicalUrl,

        "image":
            game.thumb
                ? (
                    game.thumb.startsWith("http")
                        ? game.thumb
                        : `https://www.oyunkafe.com/${game.thumb}`
                  )
                : "https://www.oyunkafe.com/logo.png",

        "author": {

            "@type":
                "Organization",

            "name":
                "OyunKafe"

        },

        "publisher": {

            "@type":
                "Organization",

            "name":
                "OyunKafe"

        }

    };


    /*
     * Rating bilgisi gerçekten varsa
     * schema'ya ekle.
     */

    if (
        game.rating !== undefined &&
        game.rating !== null &&
        game.rating !== ""
    ) {

        schema.aggregateRating = {

            "@type":
                "AggregateRating",

            "ratingValue":
                game.rating,

            "ratingCount":
                game.ratingCount || 1

        };

    }


    const schemaElement =
        document.getElementById(
            "gameSchema"
        );

    if (schemaElement) {

        schemaElement.textContent =
            JSON.stringify(schema);

    }

}
/*
 * ==========================================
 * EK SEO YARDIMCILARI
 * ==========================================
 */

/*
 * Sayfanın dilini ve temel erişilebilirlik
 * bilgisini güvenli şekilde ayarla.
 */

function improvePageAccessibility(game) {

    document.documentElement.lang = "tr";

    const frame =
        document.getElementById("gameFrame");

    if (frame) {

        frame.setAttribute(
            "title",
            `${game.title} - OyunKafe`
        );

    }

}


/*
 * ==========================================
 * OYUN SAYFASI İÇERİK KONTROLÜ
 * ==========================================
 */

function ensureGameContent(game) {

    /*
     * games.json'da longDescription yoksa
     * mevcut description kullanılmaya devam eder.
     */

    const description =
        game.longDescription ||
        game.description ||
        "";

    const descriptionArea =
        document.getElementById(
            "gameDescription"
        );

    if (
        descriptionArea &&
        !descriptionArea.textContent.trim() &&
        description
    ) {

        descriptionArea.textContent =
            description;

    }


    /*
     * Oyun başlığının boş kalmasını önle.
     */

    const title =
        document.getElementById(
            "gameTitle"
        );

    if (
        title &&
        !title.textContent.trim()
    ) {

        title.textContent =
            game.title || "Oyun";

    }


    /*
     * Kategori bilgisi boşsa varsayılan
     * değer göster.
     */

    const category =
        document.getElementById(
            "gameCategory"
        );

    if (
        category &&
        !category.textContent.trim()
    ) {

        category.textContent =
            game.category || "Online Oyun";

    }

}


/*
 * ==========================================
 * YARDIMCI FONKSİYONLARI LOADGAME'E BAĞLA
 * ==========================================
 *
 * Bu fonksiyonlar mevcut loadGame()
 * çalıştıktan sonra kullanılabilir.
 */

const originalLoadGame =
    loadGame;


/*
 * Mevcut loadGame fonksiyonunu bozmadan
 * içerik kontrollerini sonradan çalıştır.
 */

async function loadGameWithEnhancements() {

    await originalLoadGame();

    /*
     * URL'deki oyun ID'sini tekrar al.
     */

    const params =
        new URLSearchParams(
            window.location.search
        );

    const id =
        params.get("id");

    if (!id) return;

    const game =
        games.find(
            item => item.id === id
        );

    if (!game) return;


    improvePageAccessibility(game);

    ensureGameContent(game);

}


/*
 * DOMContentLoaded olayını yenile.
 *
 * Part 2'de tanımlanan eski listener
 * loadGame'u çalıştırmaya devam edeceği için
 * burada ikinci kez çalıştırmıyoruz.
 *
 * Bu nedenle aşağıdaki listener sadece
 * yardımcı kontrolleri çalıştırır.
 */

window.addEventListener(
    "load",
    () => {

        setTimeout(
            () => {

                const params =
                    new URLSearchParams(
                        window.location.search
                    );

                const id =
                    params.get("id");

                if (!id) return;

                const game =
                    games.find(
                        item => item.id === id
                    );

                if (!game) return;

                improvePageAccessibility(game);

                ensureGameContent(game);

            },
            100
        );

    }
);
/*
 * ==========================================
 * SON GÜVENLİK / HATA KONTROLÜ
 * ==========================================
 *
 * Bu bölüm oyun sistemini değiştirmez.
 * Sadece beklenmeyen JavaScript hatalarının
 * konsolda görülebilmesini sağlar.
 */

window.addEventListener(
    "error",
    function (event) {

        console.error(
            "OyunKafe oyun sayfasında bir hata oluştu:",
            event.error || event.message
        );

    }
);


/*
 * Promise / fetch kaynaklı beklenmeyen
 * hataları yakala.
 */

window.addEventListener(
    "unhandledrejection",
    function (event) {

        console.error(
            "OyunKafe oyun sayfasında beklenmeyen bir işlem hatası:",
            event.reason
        );

    }
);


/*
 * ==========================================
 * OYUNKAFE GAME.JS SONU
 * ==========================================
 */