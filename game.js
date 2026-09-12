let games = [];
document.addEventListener("DOMContentLoaded", init);

async function init() {
    try {
        const response = await fetch("games.json", {cache:"no-store"});
        if (!response.ok) throw new Error("games.json HTTP " + response.status);
        games = await response.json();
        loadGame();
    } catch (e) {
        showError("Oyun verileri şu anda yüklenemedi. Lütfen sayfayı yenileyip tekrar deneyin.");
    }
}

function loadGame() {
    const id = new URLSearchParams(window.location.search).get("id");
    if (!id) return showError("Oyun bağlantısında oyun kimliği bulunamadı.");

    const game = games.find(g => g.id === id);
    if (!game) return showError("Aradığınız oyun bulunamadı veya kaldırılmış olabilir.");

    const staticUrl = `https://www.oyunkafe.com/oyun/${encodeURIComponent(game.id)}/`;
    document.title = `${game.title} - Ücretsiz Online Oyun | OyunKafe`;

    const meta = document.getElementById("pageDescription");
    if (meta) meta.content = game.seo || game.description || "";

    const canonical = document.getElementById("canonicalLink");
    if (canonical) canonical.href = staticUrl;

    const ogTitle = document.getElementById("ogTitle");
    if (ogTitle) ogTitle.content = `${game.title} | OyunKafe`;
    const ogDescription = document.getElementById("ogDescription");
    if (ogDescription) ogDescription.content = game.description || "";
    const ogUrl = document.getElementById("ogUrl");
    if (ogUrl) ogUrl.content = staticUrl;

    setText("gameTitle", game.title);
    setText("gameCategory", game.category || "Oyun");

    const desc = document.getElementById("gameDescription");
    if (desc) {
        const text = game.longDescription || game.description || "";
        desc.innerHTML = text.split(/(?<=[.!?])\s+(?=[A-ZÇĞİÖŞÜ])/u)
            .filter(Boolean)
            .map(p => `<p>${escapeHtml(p.trim())}</p>`)
            .join("");
    }

    const frame = document.getElementById("gameFrame");
    if (frame) frame.src = game.embed || "";

    renderList("howToPlay", game.howToPlay);
    renderFeatures(game.features);
    renderList("gameTips", game.tips);
    renderFAQ(game.faq);
    renderRelated(game);
}

function renderList(id, items) {
    const area = document.getElementById(id);
    if (!area) return;
    area.innerHTML = "";
    (Array.isArray(items) ? items : []).forEach(text => {
        const li = document.createElement("li");
        li.textContent = text;
        area.appendChild(li);
    });
}

function renderFeatures(items) {
    const area = document.getElementById("gameFeatures");
    if (!area) return;
    area.innerHTML = "";
    (Array.isArray(items) ? items : []).forEach(text => {
        const box = document.createElement("div");
        box.className = "feature-item";
        box.textContent = text;
        area.appendChild(box);
    });
}

function renderFAQ(items) {
    const area = document.getElementById("faqArea");
    if (!area) return;
    area.innerHTML = "";
    (Array.isArray(items) ? items : []).forEach(item => {
        const box = document.createElement("div");
        box.className = "faq-item";
        const q = document.createElement("h3");
        q.textContent = item.q || "Soru";
        const a = document.createElement("p");
        a.textContent = item.a || "";
        box.append(q, a);
        area.appendChild(box);
    });
}

function renderRelated(current) {
    const area = document.getElementById("relatedGames");
    if (!area) return;
    area.innerHTML = "";
    games.filter(g => g.category === current.category && g.id !== current.id)
        .slice(0,4).forEach(game => {
            const card = document.createElement("article");
            card.className = "card";
            card.innerHTML = `<img src="${escapeHtml(game.thumb || "logo.png")}" alt="${escapeHtml(game.title || "Oyun")}" loading="lazy">
              <div class="card-content"><span class="tag">${escapeHtml(game.category || "Oyun")}</span>
              <h3>${escapeHtml(game.title || "Oyun")}</h3>
              <a class="btn" href="oyun/${encodeURIComponent(game.id)}/">🎮 Hemen Oyna</a></div>`;
            area.appendChild(card);
        });
}

function setText(id,value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value || "";
}

function showError(message) {
    const page = document.querySelector(".game-page") || document.getElementById("gameSection");
    if (!page) return;
    page.style.display = "block";
    page.innerHTML = `<div class="container" style="padding:80px 20px;text-align:center">
      <div class="no-result"><h2>😔 Oyun Bulunamadı</h2><p>${escapeHtml(message)}</p>
      <br><a href="index.html" class="play-btn">🏠 Ana Sayfaya Dön</a></div></div>`;
}

function escapeHtml(value) {
    return String(value ?? "").replaceAll("&","&amp;").replaceAll("<","&lt;")
      .replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;");
}
