var hugs = 0;
var wIndex = 0;
var wishes = [
  "Желаю тебе крепкого здоровья, отличного настроения и побольше времени для отдыха!",
  "Пусть каждое твоё утро начинается с ароматного кофе, улыбки и солнечного настроения!",
  "Желаю, чтобы глаза всегда сияли от счастья, а на душе было легко и спокойно!",
  "Пусть в доме всегда царят гармония, смех и уют, а все тревоги обходят стороной!",
  "Спасибо за твоё золотое сердце! Пусть судьба дарит тебе только самые яркие моменты!"
];
var emojis = ['🌷', '🌹', '💐', '❤️', '💖', '✨', '🌸'];

function spawn(n) {
  for (var i = 0; i < n; i++) {
    (function(d) {
      setTimeout(function() {
        var el = document.createElement('div');
        el.className = 'particle';
        el.innerText = emojis[Math.floor(Math.random() * emojis.length)];
        el.style.left = (5 + Math.random() * 90) + 'vw';
        document.body.appendChild(el);
        setTimeout(function() { el.remove(); }, 2800);
      }, d);
    })(i * 70);
  }
}

function fireworks() {
  hugs += 5;
  document.getElementById('counter').innerText = 'Подарено объятий и цветов: ' + hugs;
  spawn(16);
}

function nextWish() {
  hugs++;
  wIndex = (wIndex + 1) % wishes.length;
  document.getElementById('wishBox').innerText = wishes[wIndex];
  document.getElementById('counter').innerText = 'Подарено объятий и цветов: ' + hugs;
  spawn(8);
}

function activateCoupon(el) {
  el.classList.toggle('active');
  var p = el.querySelector('p');
  if (el.classList.contains('active')) {
    p.innerText = '✅ АКТИВИРОВАНО';
    p.style.color = '#34d399';
    spawn(8);
  } else {
    p.innerText = 'Нажми для активации';
    p.style.color = 'rgba(255,255,255,0.7)';
  }
}

function toggleLetter() {
  var t = document.getElementById('letterText');
  var b = document.getElementById('letterBtn');
  t.classList.toggle('open');
  b.innerText = t.classList.contains('open') ? '📕 Скрыть письмо' : '💌 Открыть личное письмо для мамы';
}

var audioCtx = null;
var bgTimer = null;
var notes = [523.25, 659.25, 783.99, 659.25, 587.33, 698.46, 880.00, 698.46, 523.25, 659.25, 783.99, 1046.50, 987.77, 783.99, 659.25, 523.25];
var step = 0;

function playNote(freq) {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  var osc = audioCtx.createOscillator();
  var gain = audioCtx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
  gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.14, audioCtx.currentTime + 0.05);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.65);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + 0.7);
}

function toggleBgMusic() {
  var btn = document.getElementById('bgBtn');
  var st = document.getElementById('bgStatus');
  if (bgTimer) {
    clearInterval(bgTimer);
    bgTimer = null;
    btn.innerText = '▶ Включить фон';
    st.innerText = 'Фоновая мелодия на паузе';
  } else {
    playNote(notes[step++ % notes.length]);
    bgTimer = setInterval(function() {
      playNote(notes[step++ % notes.length]);
    }, 460);
    btn.innerText = '⏸ Пауза';
    st.innerText = 'Играет нежная мелодия...';
  }
}
