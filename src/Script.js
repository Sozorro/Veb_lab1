'use strict';

const form = document.getElementById("coord-inp");
const canvas = document.getElementById('graph');
const ctx = canvas.getContext('2d');

const SIZE_AREA = 400;
const R_PX = 150;

const startX = 20;
const endX = SIZE_AREA - startX;
const endY = 20;
const startY = SIZE_AREA - endY;
const centerY = (startY + endY) / 2;
const centerX = (startX + endX) / 2;

const FONT_SIZE = 14;
const GRAPH_STYLE = {
    font: `bold ${FONT_SIZE}px sans-serif`,
    fontSize: FONT_SIZE,
    color: 'black',
    lineWidth: 2
};

function drawFigure(cx, cy, r) {
    ctx.save();
    ctx.fillStyle = 'rgba(51, 153, 255, 0.8)';

    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + r, cy);
    ctx.lineTo(cx, cy + r);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx, cy + r);
    ctx.lineTo(cx - r, cy + r);
    ctx.lineTo(cx - r, cy);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r / 2, Math.PI, Math.PI * 3 / 2);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}

function drawAxes(sx, cx, ex, sy, cy, ey) {
    ctx.save();
    ctx.fillStyle = GRAPH_STYLE.color;
    ctx.strokeStyle = GRAPH_STYLE.color;
    ctx.font = GRAPH_STYLE.font;
    ctx.lineWidth = GRAPH_STYLE.lineWidth;
    const shiftForText = GRAPH_STYLE.fontSize / 2;

    ctx.beginPath();
    ctx.moveTo(sx, cy);
    ctx.lineTo(ex, cy);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(cx, sy);
    ctx.lineTo(cx, ey);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(ex, cy + shiftForText);
    ctx.lineTo(ex, cy - shiftForText);
    ctx.lineTo(ex + shiftForText, cy);
    ctx.closePath();
    ctx.fill();

    ctx.fillText('X', ex + shiftForText, cy + shiftForText);

    ctx.beginPath();
    ctx.moveTo(cx + shiftForText, ey);
    ctx.lineTo(cx - shiftForText, ey);
    ctx.lineTo(cx, ey - shiftForText);
    ctx.closePath();
    ctx.fill();

    ctx.fillText('Y', cx + shiftForText, ey - shiftForText);
    ctx.restore();
}

function drawXMark(text, x, y) {
    ctx.save();
    ctx.fillStyle = GRAPH_STYLE.color;
    ctx.strokeStyle = GRAPH_STYLE.color;
    ctx.font = GRAPH_STYLE.font;
    const shiftForText = GRAPH_STYLE.fontSize / 2;

    ctx.beginPath();
    ctx.moveTo(x, y - shiftForText);
    ctx.lineTo(x, y + shiftForText);
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText(text, x, y - shiftForText);
    ctx.restore();
}

function drawYMark(text, x, y) {
    ctx.save();
    ctx.fillStyle = GRAPH_STYLE.color;
    ctx.strokeStyle = GRAPH_STYLE.color;
    ctx.font = GRAPH_STYLE.font;
    const shiftForText = GRAPH_STYLE.fontSize / 2;

    ctx.beginPath();
    ctx.moveTo(x - shiftForText, y);
    ctx.lineTo(x + shiftForText, y);
    ctx.stroke();

    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x + shiftForText, y);
    ctx.restore();
}

function drawArea(){
    drawFigure(centerX, centerY, R_PX);
    drawAxes(startX, centerX, endX, startY, centerY, endY);

    drawXMark('R', centerX + R_PX, centerY);
    drawXMark('R/2', centerX + R_PX / 2, centerY);
    drawXMark('-R/2', centerX - R_PX / 2, centerY);
    drawXMark('-R', centerX - R_PX, centerY);

    drawYMark('-R', centerX, centerY + R_PX);
    drawYMark('-R/2', centerX, centerY + R_PX / 2);
    drawYMark('R/2', centerX, centerY - R_PX / 2);
    drawYMark('R', centerX, centerY - R_PX);
}

function redraw(){
    ctx.clearRect(0, 0, SIZE_AREA, SIZE_AREA);
    drawArea();
}

redraw();

const boxR = form.querySelectorAll('input[name="r"]');

function checkR(){
    const validR = [...boxR].some(box => box.checked);
    boxR[0].setCustomValidity(validR ? "" : "Выберите хотя бы одно значение R");
}

boxR.forEach(box => box.addEventListener("change", checkR));
form.addEventListener("reset", () => setTimeout(checkR));
checkR();

function parseY(text) {
    const str = text.trim().replace(',', '.');
    if(str === "") {
        return null;
    }
    const num = Number(str);
    if(!Number.isFinite(num) || -3 > num || num > 5) {
        return null;
    }
    return num;
}

function isHit(x, y, r){
    const EPS = 1e-9;
    if (x <= 0 && y >= 0) {
        return x * x + y * y <= (r / 2) * (r / 2) + EPS;
    }
    if (x <= 0 && y <= 0) {
        return x >= -r - EPS && y >= -r - EPS;
    }
    if (x >= 0 && y <= 0) {
        return y >= x - r - EPS;
    }
    return false;
}

const STORAGE_KEY = 'lab1-results';
const tableBody = document.getElementById('result-body');

function loadResults() {
    try {
        const data = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
        return Array.isArray(data) ? data : [];
    } catch (err) {
        return [];
    }
}

function saveResults() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(results));
}

function renderTable() {
    tableBody.replaceChildren();
    for (const res of results) {
        const tr = document.createElement('tr');
        const cells = [
            res.x,
            res.y,
            res.r,
            res.hit ? 'Попала' : 'Мимо',
            new Date(res.time).toLocaleString('ru-RU')
        ];
        for (const value of cells) {
            const td = document.createElement('td');
            td.textContent = value;
            tr.append(td);
        }
        tableBody.append(tr);
    }
}

let results = loadResults();

document.getElementById('clear-btn').addEventListener('click', () => {
    results = [];
    saveResults();
    renderTable();
});

renderTable();

form.elements.y.addEventListener('input', () => form.elements.y.setCustomValidity(''));
form.querySelectorAll('input[name="x"]').forEach(r => r.addEventListener('change', () => form.querySelector('input[name="x"]').setCustomValidity('')));

form.addEventListener('submit', function(event) {
    event.preventDefault();

    const inpCoordX = form.querySelector('input[name="x"]:checked');
    if (inpCoordX === null) {
        const firstX = form.querySelector('input[name="x"]');
        firstX.setCustomValidity('Выберите значение X');
        firstX.reportValidity();
        return;
    }
    const coordX = Number(inpCoordX.value);
    
    const strY = form.elements.y;
    const coordY = parseY(strY.value);
    if (coordY === null) {
        strY.setCustomValidity('Y должно быть корректным числом от -3 до 5');
        strY.reportValidity();
        return;
    }

    const boxStrR = [...form.querySelectorAll('input[name="r"]:checked')].map(box => box.value);
    const boxNumR = boxStrR.map(box => Number(box));
    for (const coordR of boxNumR) {
        results.unshift({ x: coordX, y: coordY, r: coordR, hit: isHit(coordX, coordY, coordR), time: Date.now() });
    }

    saveResults();
    renderTable();
});