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

    document.getElementById("days").innerText = days;
    document.getElementById("hours").innerText = hours;
    document.getElementById("minutes").innerText = minutes;
    document.getElementById("seconds").innerText = seconds;
}

setInterval(updateTimer, 1000);
updateTimer();

// 2. ИНИЦИАЛИЗА КАРТЫ (OpenStreetMap)
const CITY_1 = [48.6482, 9.4512];  // Кирхайм
const CITY_2 = [50.4501, 30.5234]; // Киев

const map = L.map('map', { zoomControl: false }).setView([(CITY_1[0] + CITY_2[0]) / 2, (CITY_1[1] + CITY_2[1]) / 2], 5);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);

L.marker(CITY_1).addTo(map).bindPopup("Ты 🤍");
L.marker(CITY_2).addTo(map).bindPopup("Я ✨");

const latlngs = [CITY_1, CITY_2];
const polyline = L.polyline(latlngs, { color: '#f43f5e', weight: 4, dashArray: '6, 12' }).addTo(map);
map.fitBounds(polyline.getBounds(), { padding: [30, 30] });

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
                console.log("Воспроизведение музыкального файла пока недоступно или загружается:", err);
            });
        } else {
            music.pause();
            musicBtn.innerText = '🎵 Включить музыку';
        }
    });
}
