// Инициализация Telegram WebApp SDK
const tg = window.Telegram?.WebApp;
if (tg) {
    tg.expand();
    tg.ready();
}

// 1. ТАЙМЕР ДАТЫ (10 ноября 2025 года)
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

// 2. ИНТЕРАКТИВНАЯ КАРТА С ТОЧКАМИ В КИЕВЕ
const CITY_1 = [48.6482, 9.4512];  // Кирхайм
const CITY_2 = [50.4501, 30.5234]; // Киев

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

// Точка 1: Майдан / Крещатик (Центр)
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


// 3. УПРАВЛЕНИЕ МУЗЫКОЙ
const music = document.getElementById('bg-music');
const musicBtn = document.getElementById('music-btn');

if (musicBtn && music) {
    music.volume = 0.3; // Комфортная громкость
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

// 4. МИНИ-ИГРА "ПОЙМАЙ СЕРДЕЧКИ"
const container = document.getElementById('game-container');
const basket = document.getElementById('basket');
const scoreEl = document.getElementById('score');
const timerEl = document.getElementById('game-timer');
const overlay = document.getElementById('game-overlay');
const startBtn = document.getElementById('start-game-btn');
const modal = document.getElementById('win-modal');
const closeModalBtn = document.getElementById('close-modal-btn');

let score = 0;
let timeLeft = 15;
let gameInterval, spawnInterval;
let isPlaying = false;

// Перемещение корзинки (пальцем или мышкой)
function moveBasket(e) {
    if (!isPlaying) return;
    const rect = container.getBoundingClientRect();
    let x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left - (basket.offsetWidth / 2);
    x = Math.max(0, Math.min(x, container.clientWidth - basket.offsetWidth));
    basket.style.left = x + 'px';
}

container.addEventListener('mousemove', moveBasket);
container.addEventListener('touchmove', moveBasket);

function startGame() {
    score = 0;
    timeLeft = 15;
    isPlaying = true;
    scoreEl.innerText = score;
    timerEl.innerText = timeLeft;
    overlay.style.display = 'none';

    // Спавн сердечек
    spawnInterval = setInterval(createHeart, 600);

    // Обратный отсчет
    gameInterval = setInterval(() => {
        timeLeft--;
        timerEl.innerText = timeLeft;
        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

function createHeart() {
    if (!isPlaying) return;
    const heart = document.createElement('div');
    heart.classList.add('falling-heart');
    heart.innerText = ['💖', '💗', '❤️', '💕'][Math.floor(Math.random() * 4)];
    heart.style.left = Math.random() * (container.clientWidth - 30) + 'px';
    container.appendChild(heart);

    let top = 0;
    const fallInterval = setInterval(() => {
        if (!isPlaying) {
            clearInterval(fallInterval);
            heart.remove();
            return;
        }
        top += 4;
        heart.style.top = top + 'px';

        // Проверка столкновения с корзинкой
        const bRect = basket.getBoundingClientRect();
        const hRect = heart.getBoundingClientRect();

        if (
            hRect.bottom >= bRect.top &&
            hRect.top <= bRect.bottom &&
            hRect.right >= bRect.left &&
            hRect.left <= bRect.right
        ) {
            score++;
            scoreEl.innerText = score;
            clearInterval(fallInterval);
            heart.remove();

            if (score >= 10) {
                endGame(true);
            }
        }

        if (top > container.clientHeight) {
            clearInterval(fallInterval);
            heart.remove();
        }
    }, 20);
}

function endGame(win = false) {
    isPlaying = false;
    clearInterval(gameInterval);
    clearInterval(spawnInterval);
    document.querySelectorAll('.falling-heart').forEach(h => h.remove());

    if (win) {
        modal.style.display = 'flex';
        overlay.style.display = 'none';
    } else {
        alert('Время вышло! Попробуй еще раз 💕');
        overlay.style.display = 'flex';
        startBtn.innerText = '🔄 Попробовать снова';
    }
}

startBtn.addEventListener('click', startGame);
closeModalBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    overlay.style.display = 'flex';
    startBtn.innerText = '▶ Играть снова';
});
