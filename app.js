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

// 2. ИНИЦИАЛИЗА КАРТЫ С СЕРДЕЧКАМИ И АВТОПРОИГРЫВАНИЕМ
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

    // Кастомный маркер-сердечко
    const heartIcon = L.divIcon({
        className: 'custom-heart-marker',
        html: '💖',
        iconSize: [30, 30],
        iconAnchor: [15, 15]
    });

    // Функция автоопределения медиа
    function addPoint(coords, title, text, mediaPath) {
        const isVideo = /\.(mp4|webm|mov)$/i.test(mediaPath);
        let mediaHtml = '';

        if (isVideo) {
            mediaHtml = `<video src="${mediaPath}" autoplay loop muted playsinline preload="auto"></video>`;
        } else {
            mediaHtml = `<img src="${mediaPath}" alt="${title}">`;
        }

        L.marker(coords, { icon: heartIcon }).addTo(map).bindPopup(`
            <div class="map-popup">
                <div class="media-wrapper">
                    ${mediaHtml}
                </div>
                <h4>${title}</h4>
                <p>${text}</p>
            </div>
        `);
    }

    addPoint(CITY_1, "Кирхайм 🇩🇪", "Я скучаю тут, скоро вернусь! 🤍", "photo/1.jpg");
    addPoint([50.403162, 30.612843], "Парк Ривера ✨", "Наши самые теплые прогулки в самую холодную пору!", "photo/video.mp4");
    addPoint([50.418518, 30.637513], "Твое озеро любиме ☕", "А у меня ты самая любимая.", "photo/23.jpg");
    addPoint([50.416868, 30.647025], "Твой дом родная", "Мы вместе, сосемся и не отпускам друг дуга", "photo/video2.mp4");
    addPoint([50.502876, 30.517206], "Оболонька наша 🌲", "Красивое место, без красивой женщины не красивое", "photo/videoobo.MP4");

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

// 3. МУЗЫКАЛЬНЫЙ ПЛЕЕР С ПЛЕЙЛИСТОМ
const playlist = [
    {
        title: "Наш любимый трек",
        artist: "Для моей заи 🤍",
        src: "musik.mp3",
        cover: "💖"
    },
    {
        title: "Романтический вечер",
        artist: "Наши воспоминания ✨",
        src: "musik2.mp3",
        cover: "🎶"
    },
    {
        title: "Особый момент",
        artist: "Только для нас 💕",
        src: "musik3.mp3",
        cover: "🎧"
    }
];

let currentTrackIndex = 0;
const audio = document.getElementById('bg-music');
const playBtn = document.getElementById('play-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const trackTitle = document.getElementById('track-title');
const trackArtist = document.getElementById('track-artist');
const trackCover = document.getElementById('track-cover');
const progressBar = document.getElementById('progress-bar');
const progressContainer = document.getElementById('progress-container');
const currentTimeEl = document.getElementById('current-time');
const durationTimeEl = document.getElementById('duration-time');

function loadTrack(index) {
    const track = playlist[index];
    if (!track) return;
    
    if (audio) {
        audio.src = track.src;
        audio.volume = 0.3;
    }
    if (trackTitle) trackTitle.innerText = track.title;
    if (trackArtist) trackArtist.innerText = track.artist;
    if (trackCover) trackCover.innerText = track.cover;
}

function playTrack() {
    if (!audio) return;
    audio.play().then(() => {
        if (playBtn) playBtn.innerText = '⏸';
    }).catch(() => {});
}

function pauseTrack() {
    if (!audio) return;
    audio.pause();
    if (playBtn) playBtn.innerText = '▶';
}

if (playBtn && audio) {
    playBtn.addEventListener('click', () => {
        if (audio.paused) {
            playTrack();
        } else {
            pauseTrack();
        }
    });
}

if (prevBtn) {
    prevBtn.addEventListener('click', () => {
        currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
        loadTrack(currentTrackIndex);
        playTrack();
    });
}

if (nextBtn) {
    nextBtn.addEventListener('click', () => {
        currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
        loadTrack(currentTrackIndex);
        playTrack();
    });
}

// Форматирование секунд в минуты (0:00)
function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

if (audio) {
    // Обновление прогресс-бара и времени
    audio.addEventListener('timeupdate', () => {
        if (audio.duration) {
            const progressPercent = (audio.currentTime / audio.duration) * 100;
            if (progressBar) progressBar.style.width = `${progressPercent}%`;
            if (currentTimeEl) currentTimeEl.innerText = formatTime(audio.currentTime);
            if (durationTimeEl) durationTimeEl.innerText = formatTime(audio.duration);
        }
    });

    // Переход на следующий трек после окончания
    audio.addEventListener('ended', () => {
        currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
        loadTrack(currentTrackIndex);
        playTrack();
    });
}

// Клик по прогресс-бару для перемотки
if (progressContainer && audio) {
    progressContainer.addEventListener('click', (e) => {
        const width = progressContainer.clientWidth;
        const clickX = e.offsetX;
        if (audio.duration) {
            audio.currentTime = (clickX / width) * audio.duration;
        }
    });
}

// Инициализация первого трека
loadTrack(currentTrackIndex);

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

function moveBasket(e) {
    if (!isPlaying || !container || !basket) return;
    const rect = container.getBoundingClientRect();
    let x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left - (basket.offsetWidth / 2);
    x = Math.max(0, Math.min(x, container.clientWidth - basket.offsetWidth));
    basket.style.left = x + 'px';
}

if (container) {
    container.addEventListener('mousemove', moveBasket);
    container.addEventListener('touchmove', moveBasket);
}

function startGame() {
    score = 0;
    timeLeft = 15;
    isPlaying = true;
    if (scoreEl) scoreEl.innerText = score;
    if (timerEl) timerEl.innerText = timeLeft;
    if (overlay) overlay.style.display = 'none';

    spawnInterval = setInterval(createHeart, 600);

    gameInterval = setInterval(() => {
        timeLeft--;
        if (timerEl) timerEl.innerText = timeLeft;
        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

function createHeart() {
    if (!isPlaying || !container) return;
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

        if (basket) {
            const bRect = basket.getBoundingClientRect();
            const hRect = heart.getBoundingClientRect();

            if (
                hRect.bottom >= bRect.top &&
                hRect.top <= bRect.bottom &&
                hRect.right >= bRect.left &&
                hRect.left <= bRect.right
            ) {
                score++;
                if (scoreEl) scoreEl.innerText = score;
                clearInterval(fallInterval);
                heart.remove();

                if (score >= 10) {
                    endGame(true);
                }
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
        if (modal) modal.style.display = 'flex';
        if (overlay) overlay.style.display = 'none';
    } else {
        alert('Время вышло! Попробуй еще раз 💕');
        if (overlay) overlay.style.display = 'flex';
        if (startBtn) startBtn.innerText = '🔄 Попробовать снова';
    }
}

if (startBtn) startBtn.addEventListener('click', startGame);
if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
        if (modal) modal.style.display = 'none';
        if (overlay) overlay.style.display = 'flex';
        if (startBtn) startBtn.innerText = '▶ Играть снова';
    });
}

// 5. УПРАВЛЕНИЕ ОКНОМ ПИСЬМА (Secret Note)
const envelopeBtn = document.getElementById('envelope-btn');
const letterModal = document.getElementById('letter-modal');
const closeLetterBtn = document.getElementById('close-letter-btn');

if (envelopeBtn && letterModal) {
    envelopeBtn.addEventListener('click', () => {
        letterModal.style.display = 'flex';
    });
}

if (closeLetterBtn && letterModal) {
    closeLetterBtn.addEventListener('click', () => {
        letterModal.style.display = 'none';
    });
}
