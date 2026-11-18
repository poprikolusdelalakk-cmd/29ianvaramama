var hearts = Number(localStorage.getItem('larisa_hearts')) || 10;
var wIndex = 0;

var wishes = [
  "Желаю тебе крепкого здоровья, вдохновения и побольше времени для отдыха и любимых дел!",
  "Пусть каждое твоё утро начинается с ароматного кофе, улыбки и солнечного настроения!",
  "Желаю, чтобы глаза всегда сияли от счастья, а на душе было легко и спокойно!",
  "Пусть в доме всегда царят гармония, смех и уют, а все тревоги обходят стороной!",
  "Спасибо за твоё золотое сердце! Пусть судьба дарит тебе только самые яркие моменты!",
  "Ты — самая лучшая мама во Вселенной! Пусть сбываются все твои мечты!"
];

var emojis = ['🌷', '🌹', '💐', '❤️', '💖', '✨', '🌸', '🦋', '🌺'];

function updateHearts(add) {
  hearts += add;
  localStorage.setItem('larisa_hearts', hearts);
  var el = document.getElementById('heartBalance');
  if (el) el.innerText = hearts;
}

function spawnParticles(count) {
  for (var i = 0; i < count; i++) {
    (function(delay) {
      setTimeout(function() {
        var p = document.createElement('div');
        p.className = 'particle';
        p.innerText = emojis[Math.floor(Math.random() * emojis.length)];
        p.style.left = (5 + Math.random() * 90) + 'vw';
        p.style.animationDuration = (2.2 + Math.random() * 1.3) + 's';
        document.body.appendChild(p);
        setTimeout(function() { p.remove(); }, 3500);
      }, delay);
    })(i * 65);
  }
}

function launchSalute() {
  updateHearts(5);
  spawnParticles(22);
}

function nextWish() {
  updateHearts(2);
  wIndex = (wIndex + 1) % wishes.length;
  var box = document.getElementById('wishBox');
  if (box) box.innerText = wishes[wIndex];
  spawnParticles(10);
}

function addFlowerToVase(flower) {
  var vase = document.getElementById('vaseFlowers');
  if (!vase) return;
  if (vase.children.length >= 15) {
    vase.innerHTML = '';
  }
  var span = document.createElement('span');
  span.className = 'vase-item';
  span.innerText = flower;
  vase.appendChild(span);
  updateHearts(1);
  spawnParticles(4);
}

function clearVase() {
  var vase = document.getElementById('vaseFlowers');
  if (vase) vase.innerHTML = '';
}

function activateCoupon(el) {
  el.classList.toggle('active');
  var p = el.querySelector('p');
  if (el.classList.contains('active')) {
    p.innerText = '✅ АКТИВИРОВАНО ДЛЯ МАМЫ';
    p.style.color = '#34d399';
    updateHearts(3);
    spawnParticles(10);
  } else {
    p.innerText = 'Нажми для активации';
    p.style.color = 'rgba(255,255,255,0.7)';
  }
}

function toggleLetter() {
  var t = document.getElementById('letterText');
  var b = document.getElementById('letterBtn');
  if (!t || !b) return;
  t.classList.toggle('open');
  if (t.classList.contains('open')) {
    b.innerText = '📕 Скрыть письмо';
    spawnParticles(8);
  } else {
    b.innerText = '💌 Открыть личное письмо для мамы';
  }
}

// Умный музыкальный синтезатор (3 мелодии)
var audioCtx = null;
var bgTimer = null;
var trackIdx = 0;
var step = 0;

var tracks = [
  {
    name: "Нежность маминых рук",
    tempo: 440,
    notes: [523.25, 659.25, 783.99, 659.25, 587.33, 698.46, 880.00, 698.46, 523.25, 659.25, 783.99, 1046.50, 987.77, 783.99, 659.25, 523.25]
  },
  {
    name: "Весенний вальс",
    tempo: 360,
    notes: [659.25, 783.99, 987.77, 880.00, 783.99, 659.25, 587.33, 659.25, 783.99, 659.25, 523.25, 587.33, 659.25, 523.25]
  },
  {
    name: "Утренние тюльпаны",
    tempo: 310,
    notes: [523.25, 587.33, 659.25, 783.99, 880.00, 783.99, 659.25, 783.99, 1046.50, 880.00, 783.99, 659.25, 587.33, 523.25]
  }
];

function playTone(freq) {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  var osc = audioCtx.createOscillator();
  var gain = audioCtx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
  gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.15, audioCtx.currentTime + 0.04);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.6);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + 0.65);
}

function toggleBgMusic() {
  var btn = document.getElementById('bgBtn');
  var st = document.getElementById('bgStatus');
  if (bgTimer) {
    clearInterval(bgTimer);
    bgTimer = null;
    if (btn) btn.innerText = '▶ Включить';
    if (st) st.innerText = 'Музыка на паузе';
  } else {
    var tr = tracks[trackIdx];
    playTone(tr.notes[step++ % tr.notes.length]);
    bgTimer = setInterval(function() {
      playTone(tr.notes[step++ % tr.notes.length]);
    }, tr.tempo);
    if (btn) btn.innerText = '⏸ Пауза';
    if (st) st.innerText = tr.name;
  }
}

function nextBgTrack() {
  trackIdx = (trackIdx + 1) % tracks.length;
  step = 0;
  if (bgTimer) {
    clearInterval(bgTimer);
    bgTimer = null;
    toggleBgMusic();
  } else {
    var st = document.getElementById('bgStatus');
    if (st) st.innerText = tracks[trackIdx].name;
  }
}

window.addEventListener('DOMContentLoaded', function() {
  updateHearts(0);
});
