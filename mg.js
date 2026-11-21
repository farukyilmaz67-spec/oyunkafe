/* OyunKafe çerez tercihi ve reklam kişiselleştirme ayarı
   - Tercih tarayıcıda (localStorage) "oyunkafe_consent_v1" anahtarıyla saklanır.
   - Değerler: "all" (tümünü kabul), "necessary" (yalnızca gerekli).
   - Kullanıcı "tümünü kabul et" demedikçe Google reklamları kişiselleştirilmemiş (non-personalized) istenir.
   NOT: AB/EEA, Birleşik Krallık ve İsviçre ziyaretçileri için Google onaylı CMP gerekir
   (AdSense > Gizlilik ve mesajlaşma bölümünden etkinleştirilebilir). */
(function () {
  var KEY = "oyunkafe_consent_v1";

  function read() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function write(v) {
    try { localStorage.setItem(KEY, v); } catch (e) {}
  }

  // Reklam scripti yüklenmeden önce kişiselleştirme tercihini ayarla
  function applyAdPref(v) {
    window.adsbygoogle = window.adsbygoogle || [];
    window.adsbygoogle.requestNonPersonalizedAds = (v === "all") ? 0 : 1;
  }
  applyAdPref(read());

  // Bu dosyanın bulunduğu klasörü bul (alt klasörlerdeki sayfalar için bağlantı yolu)
  var base = "";
  var scripts = document.getElementsByTagName("script");
  for (var i = 0; i < scripts.length; i++) {
    var s = scripts[i].getAttribute("src") || "";
    if (/(^|\/)mg\.js(\?.*)?$/.test(s)) { base = s.replace(/mg\.js(\?.*)?$/, ""); break; }
  }

  function closeBanner() {
    var el = document.getElementById("mgConsent");
    if (el && el.parentNode) el.parentNode.removeChild(el);
  }

  function choose(v) {
    write(v);
    applyAdPref(v);
    closeBanner();
  }

  function openBanner() {
    if (document.getElementById("mgConsent")) return;
    var box = document.createElement("div");
    box.id = "mgConsent";
    box.className = "mg-consent";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-label", "Çerez tercihleri");
    box.innerHTML =
      '<div class="mg-consent-text">' +
      '<strong>Çerez tercihleriniz</strong>' +
      '<p>OyunKafe, sitenin çalışması için gerekli çerezleri kullanır. Reklam ortaklarımız (Google AdSense) ' +
      'çerezlerle reklamları kişiselleştirebilir. “Yalnızca gerekli” seçeneğinde kişiselleştirilmemiş reklamlar istenir. ' +
      'Ayrıntılar için <a href="' + base + 'cerez-politikasi.html">Çerez Politikası</a> ve ' +
      '<a href="' + base + 'gizlilik-politikasi.html">Gizlilik Politikası</a> sayfalarına bakın. ' +
      'Tercihinizi sayfa altındaki “Çerez Tercihleri” bağlantısından istediğiniz zaman değiştirebilirsiniz.</p>' +
      '</div>' +
      '<div class="mg-consent-actions">' +
      '<button type="button" class="mg-btn" data-mg="necessary">Yalnızca gerekli</button>' +
      '<button type="button" class="mg-btn" data-mg="all">Tümünü kabul et</button>' +
      '</div>';
    box.addEventListener("click", function (e) {
      var t = e.target;
      if (t && t.getAttribute && t.getAttribute("data-mg")) choose(t.getAttribute("data-mg"));
    });
    document.body.appendChild(box);
  }

  window.mgOpenConsent = openBanner;

  document.addEventListener("DOMContentLoaded", function () {
    if (!read()) openBanner();
    var links = document.querySelectorAll("[data-mg-open]");
    for (var j = 0; j < links.length; j++) {
      links[j].addEventListener("click", function (e) { e.preventDefault(); openBanner(); });
    }
  });
})();

/* Mobil/tablet açılır menü */
(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var btn = document.getElementById("navToggle");
    var nav = document.getElementById("mainNav");
    var hdr = document.querySelector(".header");
    if (!btn || !nav || !hdr) return;
    function setOpen(open) {
      if (open) hdr.classList.add("nav-open"); else hdr.classList.remove("nav-open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      btn.setAttribute("aria-label", open ? "Menüyü kapat" : "Menüyü aç");
      btn.textContent = open ? "✕" : "☰";
    }
    btn.addEventListener("click", function () { setOpen(!hdr.classList.contains("nav-open")); });
    nav.addEventListener("click", function (e) {
      var t = e.target;
      while (t && t !== nav) { if (t.tagName === "A") { setOpen(false); return; } t = t.parentNode; }
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setOpen(false); });
    window.addEventListener("resize", function () { if (window.innerWidth > 900) setOpen(false); });
  });
})();
