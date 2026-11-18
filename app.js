var hearts = Number(localStorage.getItem('larisa_hearts')) || 15;
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
  if (vase.children.length >= 14) {
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

// 5 РАЗНЫХ ПРАЗДНИЧНЫХ МЕЛОДИЙ-ПОЗДРАВЛЕНИЙ
var audioCtx = null;
var bgTimer = null;
var trackIdx = 0;
var step = 0;

var tracks = [
  {
    name: "🎵 Люблю я маму (Праздничная)",
    lyrics: "«Люблю я маму больше всех на свете, ты моё солнышко и главный свет!»",
    tempo: 340,
    notes: [523.25, 659.25, 783.99, 1046.50, 987.77, 880.00, 783.99, 659.25, 698.46, 880.00, 1046.50, 987.77, 783.99, 659.25, 587.33, 523.25]
  },
  {
    name: "🎶 Мамино сердце (Нежная)",
    lyrics: "«Спасибо за тепло твоих рук, за бессонные ночи и бесконечную доброту...»",
    tempo: 430,
    notes: [440.00, 523.25, 659.25, 587.33, 523.25, 493.88, 523.25, 659.25, 783.99, 698.46, 659.25, 587.33, 523.25]
  },
  {
    name: "🌸 Весенний букет (Радостная)",
    lyrics: "«Пусть каждый день цветёт весна, а в доме звучит твой счастливый смех!»",
    tempo: 290,
    notes: [587.33, 739.99, 880.00, 1174.66, 1108.73, 987.77, 880.00, 739.99, 783.99, 987.77, 1174.66, 1108.73, 880.00, 739.99, 659.25, 587.33]
  },
  {
    name: "💖 Спасибо за всё, родная",
    lyrics: "«Ты всегда рядом, всегда поймёшь и поддержишь. С Днём матери, Лариса!»",
    tempo: 390,
    notes: [659.25, 783.99, 987.77, 880.00, 783.99, 659.25, 587.33, 659.25, 783.99, 659.25, 523.25, 587.33, 659.25, 523.25]
  },
  {
    name: "✨ Самой лучшей маме на Земле",
    lyrics: "«Пусть исполняются все мечты, а здоровье будет самым крепким!»",
    tempo: 320,
    notes: [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50, 880.00, 783.99, 659.25, 783.99, 880.00, 783.99, 659.25, 587.33, 523.25]
  }
];

function playTone(freq) {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  var osc = audioCtx.createOscillator();
  var gain = audioCtx.createGain();
  osc.type = trackIdx % 2 === 0 ? 'triangle' : 'sine';
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
  gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.16, audioCtx.currentTime + 0.04);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.58);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + 0.62);
}

function updatePlayerUI(isPlaying) {
  var btn = document.getElementById('bgBtn');
  var st = document.getElementById('bgStatus');
  var lyr = document.getElementById('songLyrics');
  var tr = tracks[trackIdx];
  if (btn) btn.innerText = isPlaying ? '⏸ Пауза' : '▶ Играть';
  if (st) st.innerText = tr.name;
  if (lyr) lyr.innerText = tr.lyrics;
}

function toggleBgMusic() {
  if (bgTimer) {
    clearInterval(bgTimer);
    bgTimer = null;
    updatePlayerUI(false);
  } else {
    var tr = tracks[trackIdx];
    playTone(tr.notes[step++ % tr.notes.length]);
    bgTimer = setInterval(function() {
      playTone(tr.notes[step++ % tr.notes.length]);
    }, tr.tempo);
    updatePlayerUI(true);
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
    updatePlayerUI(false);
  }
}

function selectTrack(idx) {
  trackIdx = idx;
  step = 0;
  if (bgTimer) {
    clearInterval(bgTimer);
    bgTimer = null;
  }
  toggleBgMusic();
}

window.addEventListener('DOMContentLoaded', function() {
  updateHearts(0);
  updatePlayerUI(false);
});
