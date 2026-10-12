// Инициализация Telegram WebApp
if (window.Telegram && window.Telegram.WebApp) {
    window.Telegram.WebApp.expand();
    window.Telegram.WebApp.ready();
}

// 1. ТАЙМЕР
const startDate = new Date(2025, 10, 10, 0, 0, 0);

function updateTimer() {
    const now = new Date();
    const diff = now - startDate;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    const d = document.getElementById("days");
    const h = document.getElementById("hours");
    const m = document.getElementById("minutes");
    const s = document.getElementById("seconds");

    if (d) d.innerText = days;
    if (h) h.innerText = hours;
    if (m) m.innerText = minutes;
    if (s) s.innerText = seconds;
}

setInterval(updateTimer, 1000);
updateTimer();

// 2. ИНИЦИАЛИЗА КАРТЫ
function initMap() {
    const CITY_1 = [48.6482, 9.4512];  // Кирхайм
    const CITY_2 = [50.4501, 30.5234]; // Киев

    const mapElement = document.getElementById('map');
    if (!mapElement) return;

    const map = L.map('map').setView(CITY_2, 11);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap'
    }).addTo(map);

    function addPoint(coords, title, text, photo) {
        L.marker(coords).addTo(map).bindPopup(`
            <div class="map-popup">
                <img src="${photo}" alt="${title}">
                <h4>${title}</h4>
                <p>${text}</p>
            </div>
        `);
    }

    addPoint(CITY_1, "Кирхайм 🇩🇪", "Я скучаю и жду тебя здесь! 🤍", "photo/1.jpg");
    addPoint([50.4501, 30.5234], "Крещатик ✨", "Наши самые теплые прогулки в центре!", "photo/2.jpg");
    addPoint([50.4590, 30.5255], "Подол ☕", "Уютные вечера и вкусный кофе.", "photo/3.jpg");
    addPoint([50.5015, 30.5230], "Набережная 🌊", "Закаты, размышления и ты рядом.", "photo/4.jpg");
    addPoint([50.3782, 30.4777], "ВДНХ 🌲", "Парк, где время останавливается.", "photo/5.jpg");

    L.polyline([CITY_1, CITY_2], { color: '#f43f5e', weight: 3, dashArray: '6, 12' }).addTo(map);

    setTimeout(() => {
        map.invalidateSize();
    }, 400);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMap);
} else {
    initMap();
}

// 3. МУЗЫКА
const music = document.getElementById('bg-music');
const musicBtn = document.getElementById('music-btn');

if (musicBtn && music) {
    music.volume = 0.3;
    musicBtn.addEventListener('click', function () {
        if (music.paused) {
            music.play().then(() => {
                musicBtn.innerText = '⏸ Пауза';
            }).catch(() => {});
        } else {
            music.pause();
            musicBtn.innerText = '🎵 Включить музыку';
        }
    });
}
