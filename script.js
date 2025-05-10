const teams = [
  "Argentina","Austria","Belgium","Brazil","Croatia","Czech","Denmark",
  "England","Finland","France","Germany","Ireland","Italy","Netherlands",
  "Poland","Portugal","Scotland","Serbia","Spain","Sweden","Switzerland",
  "Turkey","Ukraine","Uruguay"
];
const attackerSelect = document.getElementById('attacker');
const keeperSelect = document.getElementById('keeper');

teams.forEach(t => {
  const o1 = document.createElement('option');
  o1.value = t; o1.textContent = t;
  const o2 = o1.cloneNode(true);
  attackerSelect.append(o1);
  keeperSelect.append(o2);
});

const canvas = document.getElementById('goalCanvas');
const ctx = canvas.getContext('2d');
function drawGoal() { ctx.fillStyle = '#0a0'; ctx.fillRect(0,0,canvas.width,canvas.height); }
drawGoal();

let alpha = Array(9).fill(1), beta = Array(9).fill(1);
const multipliers = [3,2,3,2,1,2,3,2,3];
let lastZone = null;
const epsilon = 0.1; // exploration rate

async function makePrediction() {
  let zoneIndex = Math.random() < epsilon
    ? Math.floor(Math.random() * 9)
    : recommendZone();
  lastZone = zoneIndex;
  const zoneNames = [
    'top-left','top-center','top-right',
    'middle-left','middle-center','middle-right',
    'bottom-left','bottom-center','bottom-right'
  ];
  const suggestion = zoneNames[zoneIndex];
  document.getElementById('suggestion').textContent = `Aim for: ${suggestion}`;
  highlightZone(suggestion);
}

function recommendZone() {
  let best = -Infinity, idx = 0;
  alpha.forEach((a,i) => {
    const p = a / (a + beta[i]);
    const ev = p * multipliers[i] - (1 - p);
    if (ev > best) { best = ev; idx = i; }
  });
  return idx;
}

function reportShot(success) {
  if (lastZone === null) return;
  success ? alpha[lastZone]++ : beta[lastZone]++;
}

function swapTeams() {
  [attackerSelect.value, keeperSelect.value] =
    [keeperSelect.value, attackerSelect.value];
}

document.getElementById('predictBtn').addEventListener('click', makePrediction);
document.getElementById('goalBtn').addEventListener('click', () => {
  reportShot(true); swapTeams(); makePrediction();
});
document.getElementById('missBtn').addEventListener('click', () => {
  reportShot(false); swapTeams(); makePrediction();
});

function highlightZone(zone) {
  drawGoal();
  ctx.fillStyle = 'rgba(255,255,0,0.5)';
  const w = canvas.width/3, h = canvas.height/3;
  const map = {
    'top-left':[0,0],'top-center':[w,0],'top-right':[2*w,0],
    'middle-left':[0,h],'middle-center':[w,h],'middle-right':[2*w,h],
    'bottom-left':[0,2*h],'bottom-center':[w,2*h],'bottom-right':[2*w,2*h]
  };
  const [x,y] = map[zone] || [0,0];
  ctx.fillRect(x,y,w,h);
                                   }
