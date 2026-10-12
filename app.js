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

// 2. ИНТЕРАКТИВНАЯ КАРТА С ТОЧКАМИ В КИЕВЕ И КИРХАЙМЕ
const CITY_1 = [48.6482, 9.4512];  // Кирхайм
const CITY_2 = [50.4501, 30.5234]; // Киев (Центр)

const map = L.map('map', { zoomControl: true }).setView(CITY_2, 11);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);

// Кастомная иконка-сердечко для меток
const heartIcon = L.divIcon({
    className: 'custom-heart-marker',
    html: '💖',
    iconSize: [30, 30],
    iconAnchor: [15, 15]
});

// Метка Кирхайма
L.marker(CITY_1, { icon: heartIcon }).addTo(map).bindPopup(`
    <div class="map-popup">
        <img src="photo/1.jpg" alt="Кирхайм">
        <h4>Кирхайм 🇩🇪</h4>
        <p>Я скучаю и жду тебя здесь! 🤍</p>
    </div>
`);

// Точка 1: Майдан / Крещатик
L.marker([50.4501, 30.5234], { icon: heartIcon }).addTo(map).bindPopup(`
    <div class="map-popup">
        <img src="photo/2.jpg" alt="Центр">
        <h4>Крещатик ✨</h4>
        <p>Наши самые теплые прогулки в центре!</p>
    </div>
`);

// Точка 2: Подол / Почтовая Площадь
L.marker([50.4590, 30.5255], { icon: heartIcon }).addTo(map).bindPopup(`
    <div class="map-popup">
        <img src="photo/3.jpg" alt="Подол">
        <h4>Подол ☕</h4>
        <p>Уютные вечера и вкусный кофе.</p>
    </div>
`);

// Точка 3: Оболонская Набережная
L.marker([50.5015, 30.5230], { icon: heartIcon }).addTo(map).bindPopup(`
    <div class="map-popup">
        <img src="photo/4.jpg" alt="Оболонь">
        <h4>Набережная 🌊</h4>
        <p>Закаты, размышления и ты рядом.</p>
    </div>
`);

// Точка 4: ВДНХ
L.marker([50.3782, 30.4777], { icon: heartIcon }).addTo(map).bindPopup(`
    <div class="map-popup">
        <img src="photo/5.jpg" alt="ВДНХ">
        <h4>ВДНХ 🌲</h4>
        <p>Парк, где время останавливается.</p>
    </div>
`);

// Линия связи Кирхайм - Киев
const latlngs = [CITY_1, CITY_2];
L.polyline(latlngs, { color: '#f43f5e', weight: 3, dashArray: '6, 12' }).addTo(map);

// 3. УПРАВЛЕНИЕ МУЗЫКОЙ (файл musik.mp3)
const music = document.getElementById('bg-music');
const musicBtn = document.getElementById('music-btn');

if (musicBtn && music) {
    music.volume = 0.3; // Комфортная фоновая громкость (30%)
    musicBtn.addEventListener('click', function () {
        if (music.paused) {
            music.play().then(() => {
                musicBtn.innerText = '⏸ Пауза';
            }).catch((err) => {
                console.log("Ошибка воспроизведения:", err);
            });
        } else {
            music.pause();
            musicBtn.innerText = '🎵 Включить музыку';
        }
    });
}
