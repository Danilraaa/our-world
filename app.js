// Инициализация Telegram WebApp SDK
const tg = window.Telegram?.WebApp;
if (tg) {
    tg.expand();
    tg.ready();
}

// 1. НАСТРОЙКА ТАЙМЕРА ДАТЫ (10 ноября 2025 года)
const startDate = new Date(2025, 10, 10, 0, 0, 0);

function updateTimer() {
    const now = new Date();
    const diff = now - startDate;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    const daysEl = document.getElementById("days");
    const hoursEl = document.getElementById("hours");
    const minutesEl = document.getElementById("minutes");
    const secondsEl = document.getElementById("seconds");

    if (daysEl) daysEl.innerText = days;
    if (hoursEl) hoursEl.innerText = hours;
    if (minutesEl) minutesEl.innerText = minutes;
    if (secondsEl) secondsEl.innerText = seconds;
}

setInterval(updateTimer, 1000);
updateTimer();

// 2. ИНТЕРАКТИВНАЯ КАРТА
document.addEventListener("DOMContentLoaded", function () {
    const CITY_1 = [48.6482, 9.4512];  // Кирхайм
    const CITY_2 = [50.4501, 30.5234]; // Киев

    const mapContainer = document.getElementById('map');
    if (!mapContainer) return;

    const map = L.map('map', { zoomControl: true }).setView(CITY_2, 11);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    }).addTo(map);

    // Функция создания маркеров
    function addMemoryMarker(coords, title, text, imgSrc) {
        const marker = L.marker(coords).addTo(map);
        marker.bindPopup(`
            <div class="map-popup">
                <img src="${imgSrc}" alt="${title}">
                <h4>${title}</h4>
                <p>${text}</p>
            </div>
        `);
    }

    // Добавляем точки
    addMemoryMarker(CITY_1, "Кирхайм 🇩🇪", "Я скучаю и жду тебя здесь! 🤍", "photo/1.jpg");
    addMemoryMarker([50.4501, 30.5234], "Крещатик ✨", "Наши самые теплые прогулки в центре!", "photo/2.jpg");
    addMemoryMarker([50.4590, 30.5255], "Подол ☕", "Уютные вечера и вкусный кофе.", "photo/3.jpg");
    addMemoryMarker([50.5015, 30.5230], "Набережная 🌊", "Закаты, размышления и ты рядом.", "photo/4.jpg");
    addMemoryMarker([50.3782, 30.4777], "ВДНХ 🌲", "Парк, где время останавливается.", "photo/5.jpg");

    // Пунктирная линия связи
    L.polyline([CITY_1, CITY_2], { color: '#f43f5e', weight: 3, dashArray: '6, 12' }).addTo(map);

    // Принудительный перерасчет размера карты для отрисовки в Telegram
    setTimeout(() => {
        map.invalidateSize();
    }, 300);
});

// 3. УПРАВЛЕНИЕ МУЗЫКОЙ
const music = document.getElementById('bg-music');
const musicBtn = document.getElementById('music-btn');

if (musicBtn && music) {
    music.volume = 0.3;
    musicBtn.addEventListener('click', function () {
        if (music.paused) {
            music.play().then(() => {
                musicBtn.innerText = '⏸ Пауза';
            }).catch((err) => {
                console.log("Воспроизведение загружается:", err);
            });
        } else {
            music.pause();
            musicBtn.innerText = '🎵 Включить музыку';
        }
    });
}
