// Инициализация Telegram WebApp API
const tg = window.Telegram?.WebApp;
if (tg) {
    tg.expand(); // Разворачиваем окно во весь экран
    tg.ready();
}

// 1. НАСТРОЙКА ДАТЫ ОТНОШЕНИЙ (Год, Месяц - 1, День, Часы, Минуты)
// Месяцы в JS считаются с 0 (10 = Ноябрь)
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

const CITY_1 = [48.6482, 9.4512]; // Координаты Вашего города
const CITY_2 = [50.4501, 30.5234]; // Координаты Города девушки

// Создание карты
const map = L.map('map', { zoomControl: false }).setView([ (CITY_1[0] + CITY_2[0])/2, (CITY_1[1] + CITY_2[1])/2 ], 5);

// Тёмные стильные тайлы OpenStreetMap
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 19
}).addTo(map);

// Маркеры городов
L.marker(CITY_1).addTo(map).bindPopup("Ты 🤍");
L.marker(CITY_2).addTo(map).bindPopup("Я ✨");

// Линия между городами
const latlngs = [CITY_1, CITY_2];
const polyline = L.polyline(latlngs, { color: '#f43f5e', weight: 3, dashArray: '5, 10' }).addTo(map);

// Авто-масштаб карты под оба города
map.fitBounds(polyline.getBounds(), { padding: [30, 30] });

// Тактильный отклик при кликах по карточкам
document.querySelectorAll('.polaroid-card').forEach(card => {
    card.addEventListener('click', () => {
        if (tg?.HapticFeedback) {
            tg.HapticFeedback.impactOccurred('light');
        }
    });
});