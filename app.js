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

// 2. ИНТЕРАКТИВНАЯ КАРТА ВОСПОМИНАНИЙ
const CITY_1 = [48.6482, 9.4512];  // Кирхайм
const CITY_2 = [50.4501, 30.5234]; // Киев

const map = L.map('map', { zoomControl: false }).setView([(CITY_1[0] + CITY_2[0]) / 2, (CITY_1[1] + CITY_2[1]) / 2], 5);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);

// Точка 1: Кирхайм
const popup1 = `
    <div class="map-popup">
        <img src="photo/1.jpg" alt="Кирхайм">
        <h4>Кирхайм 🇩🇪</h4>
        <p>Здесь я скучаю и жду нашей встречи!</p>
    </div>
`;
L.marker(CITY_1).addTo(map).bindPopup(popup1);

// Точка 2: Киев
const popup2 = `
    <div class="map-popup">
        <img src="photo/2.jpg" alt="Киев">
        <h4>Киев 🇺🇦</h4>
        <p>Город, где живет мое счастье 🤍</p>
    </div>
`;
L.marker(CITY_2).addTo(map).bindPopup(popup2);

// Линия связи
const latlngs = [CITY_1, CITY_2];
const polyline = L.polyline(latlngs, { color: '#f43f5e', weight: 4, dashArray: '6, 12' }).addTo(map);
map.fitBounds(polyline.getBounds(), { padding: [30, 30] });


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
