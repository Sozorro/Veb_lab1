'use strict';

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

const form = document.getElementById("coord-inp");
const rBoxes = form.querySelectorAll('input[name="r"]');

function checkR() {
    const anyChecked = [...rBoxes].some(box => box.checked);
    rBoxes[0].setCustomValidity(anyChecked ? "" : "Выберите хотя бы одно значение R");
}

rBoxes.forEach(box => box.addEventListener("change", checkR));
form.addEventListener("reset", () => setTimeout(checkR));
checkR();

