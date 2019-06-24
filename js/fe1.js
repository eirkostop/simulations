window.addEventListener('resize', initialize);
window.addEventListener('load', initialize);
// Canvas related scripts
let c = document.getElementById('experiment');
let ctx = c.getContext("2d");
let pointerX, pointerY, scale = 1;
let distanceX, distanceY, pointerX0, pointerY0;
let xr = 18,
    yr = 20;

function initialize() {
    makeResponsive(ctx, 1000, 1000);
    document.querySelector('#exerciseImage').width = c.width;
    document.body.style.fontSize = scale + "em";
    c.addEventListener('mousedown', mouseDown, false);
    window.addEventListener('mouseup', mouseUp, false);
    c.addEventListener('touchstart', touchStart, false);
    c.addEventListener('touchmove', touchMove, false);
    drawEverything();
}

function makeResponsive(ctx, initialCanvasWidth, initialCanvasHeight) {
    let canvasRatio = initialCanvasWidth / initialCanvasHeight;
    if (window.innerWidth > window.innerHeight * canvasRatio) {
        document.querySelector('main').setAttribute("style", "flex-direction:row;");
        document.querySelectorAll('main>div').forEach(function (item) {
            item.setAttribute("style", "max-width: 50%; max-height:100%;");
        });
    } else {
        document.querySelector('main').setAttribute("style", "flex-direction:column;");
        document.querySelectorAll('main>div').forEach(function (item) {
            item.setAttribute("style", "max-width: 100%; max-height:50%;");
        });
    }

    let divWidth = document.getElementById('experimentDIV').clientWidth;
    let divHeight = document.getElementById('experimentDIV').clientHeight;

    if (divWidth > canvasRatio * divHeight) {
        ctx.canvas.height = divHeight;
        ctx.canvas.width = canvasRatio * c.height;
        scale = 2 * ctx.canvas.height / initialCanvasHeight;
        ctx.scale(scale, scale);

    } else {
        ctx.canvas.width = divWidth;
        ctx.canvas.height = ctx.canvas.width / canvasRatio;
        scale = 2 * ctx.canvas.width / initialCanvasWidth;
        ctx.scale(scale, scale);
    }
}


function drawRect(rectX, rectY, rectWidth, rectHeight, cornerRadius, ctx) {
    ctx.beginPath();
    ctx.moveTo(rectX, rectY + cornerRadius);
    ctx.arcTo(rectX, rectY, rectX + cornerRadius, rectY, cornerRadius);
    ctx.lineTo(rectX + rectWidth - cornerRadius, rectY);
    ctx.arcTo(rectX + rectWidth, rectY, rectX + rectWidth, rectY + cornerRadius, cornerRadius);
    ctx.lineTo(rectX + rectWidth, rectY + rectHeight - cornerRadius);
    ctx.arcTo(rectX + rectWidth, rectY + rectHeight, rectX + rectWidth - cornerRadius, rectY + rectHeight, cornerRadius);
    ctx.lineTo(rectX + cornerRadius, rectY + rectHeight);
    ctx.arcTo(rectX, rectY + rectHeight, rectX, rectY + rectHeight - cornerRadius, cornerRadius);
    ctx.lineTo(rectX, rectY + cornerRadius);
    ctx.closePath();
    var grd = ctx.createLinearGradient(rectX, rectY, rectX + rectWidth, rectY + rectHeight);
    grd.addColorStop(0, "#f4f4f4");
    grd.addColorStop(1, "#fff");
    ctx.fillStyle = grd;
    ctx.fill();
    ctx.strokeStyle = "#59A8A4";
    ctx.lineWidth = 0.1;
    ctx.stroke();
}
// function showCoords(e) {
//     mx = (e.pageX - c.offsetLeft) / scale;
//     my = (e.pageY - c.offsetTop) / scale;
//     var coords = "X coords: " + mx + ", Y coords: " + my + ", c.width: " + c.width +
//         ", window.innerWidth" + window.innerWidth + ", scale" + scale;
//     console.log(coords);
// }
// c.addEventListener('mousemove', showCoords, false);

function drawEverything() {
    ctx.save();
    drawGlass();
    ctx.restore();
    drawDesk();
    drawRuler();
    ctx.rect(376, 8, 31, 25);
    ctx.moveTo(376, 32);
    ctx.lineTo(17, 120);
    ctx.moveTo(407, 33);
    ctx.lineTo(481, 121);
    ctx.stroke();
}

function touchStart(event) {
    pointerX = (event.targetTouches[0].pageX - c.offsetLeft) / scale;
    pointerY = (event.targetTouches[0].pageY - c.offsetTop) / scale;
    event.preventDefault();
    pointerX0 = pointerX;
    pointerY0 = pointerY;
    c.addEventListener('touchmove', touchMove, false);
}

function touchMove(event) {
    event.preventDefault();
    pointerX = (event.targetTouches[0].pageX - c.offsetLeft) / scale;
    pointerY = (event.targetTouches[0].pageY - c.offsetTop) / scale;
    distanceX = pointerX - pointerX0;
    distanceY = pointerY - pointerY0;
    if (pointerX0 < xr + 460 && pointerX0 > xr && pointerY0 > yr && pointerY0 < yr + 20) {
        xr = xr + distanceX;
        yr = yr + distanceY;
    }
    if (pointerY0 > 15 * yr && pointerY0 < 15 * (yr + 20)) {
        xr = xr + distanceX / 15;
        yr = yr + distanceY / 15;
    }
    pointerX0 = pointerX;
    pointerY0 = pointerY;
    drawEverything();
}

function mouseDown(event) {

    pointerX = (event.pageX - c.offsetLeft) / scale;
    pointerY = (event.pageY - c.offsetTop) / scale;
    event.preventDefault();
    pointerX0 = pointerX;
    pointerY0 = pointerY;
    c.addEventListener('mousemove', moveRuler, false);
}

function moveRuler(event) {
    pointerX = (event.pageX - c.offsetLeft) / scale;
    pointerY = (event.pageY - c.offsetTop) / scale;
    event.preventDefault();
    distanceX = pointerX - pointerX0;
    distanceY = pointerY - pointerY0;
    if (pointerX0 < xr + 460 && pointerX0 > xr && pointerY0 > yr && pointerY0 < yr + 20) {
        xr = xr + distanceX;
        yr = yr + distanceY;
    }
    if (pointerY0 > 15 * yr && pointerY0 < 15 * (yr + 20)) {
        xr = xr + distanceX / 15;
        yr = yr + distanceY / 15;
    }
    pointerX0 = pointerX;
    pointerY0 = pointerY;
    ctx.clearRect(0, 0, 500, 500);
    drawEverything();
}

function mouseUp(event) {
    event.preventDefault();
    c.removeEventListener('mousemove', moveRuler, false);
}

function drawDesk() {
    drawRect(38, 10, 360, 102, 5, ctx);
    ctx.fillStyle = "#CF912E";
    ctx.fill();
    drawRect(40, 10, 358, 100, 5, ctx);
    ctx.fillStyle = "#D2E8D7";
    ctx.fill();
}

function drawRuler() {
    drawRect(xr, yr, 460, 20, 5, ctx);
    drawMajorGridlines(xr, yr);
}
//Draw gridlines
function drawMajorGridlines(xr, yr) {
    ctx.beginPath();
    ctx.lineWidth = 0.2;
    ctx.strokeStyle = "#333";
    for (j = 0; j < 31; j++) {
        ctx.moveTo(xr + 5 + 15 * j, yr);
        ctx.lineTo(xr + 5 + 15 * j, yr + 5);
    }
    ctx.stroke();
    ctx.beginPath();
    ctx.font = "6px BPtypewrite";
    ctx.fillStyle = "#333";
    for (j = 0; j < 15; j++) {
        ctx.fillText(j * 10, xr + 3 + 30 * j, yr + 10);
    }
}

function drawGridlines(xr, yr) {
    ctx.beginPath();
    ctx.fillStyle = "#333";
    ctx.lineWidth = 0.05;
    ctx.strokeStyle = "#333";
    for (j = 0; j < 151; j++) {
        ctx.moveTo(xr + 5 + 3 * j, yr);
        ctx.lineTo(xr + 5 + 3 * j, yr + 3);
    }
    ctx.stroke();
}

function drawMinorGridlines(xr, yr) {
    ctx.beginPath();
    ctx.fillStyle = "#333";
    ctx.lineWidth = 0.01;
    ctx.strokeStyle = "#333";
    for (j = 0; j < 1501; j++) {
        ctx.moveTo(xr + 5 + 0.3 * j, yr);
        ctx.lineTo(xr + 5 + 0.3 * j, yr + 1);
    }
    ctx.stroke();
}

function drawGlass() {
    ctx.beginPath();
    ctx.scale(15, 15);
    ctx.rect(376 - 375, 8, 31, 25);
    ctx.lineWidth = 0.05;
    ctx.stroke();
    ctx.clip();
    drawRect(-335, 10, 358, 100, 5, ctx);
    ctx.fillStyle = "#D2E8D7";
    ctx.fill();
    drawRect(xr - 375, yr, 460, 20, 5, ctx);
    drawMajorGridlines(xr - 375, yr);
    drawGridlines(xr - 375, yr);
    drawMinorGridlines(xr - 375, yr);
    ctx.scale(1 / 15, 1 / 15);
    ctx.restore();
}

// --------------------------------------------------------------------------------------------------------------------------
//Exercise related scripts

let xmeasurements = [];

function writeMeasurement() {
    let measurement = Number(document.getElementById("measurement").value).toFixed(1);
    if (xmeasurements.length < 11 && measurement < 1000000000 && measurement > 0) {
        xmeasurements.push(measurement);
        document.getElementById(xmeasurements.length).innerHTML = xmeasurements[xmeasurements.length - 1];
        document.getElementById("sum").innerHTML = "";
        document.getElementById("average").innerHTML = "";
    }
}

function clearMeasurement() {
    if (xmeasurements.length < 11 && xmeasurements.length > 0) {
        document.getElementById(xmeasurements.length).innerHTML = "";
        xmeasurements.pop();
        document.getElementById("sum").innerHTML = "";
        document.getElementById("average").innerHTML = "";
    }
}

function reset() {
    for (i = 0; i < xmeasurements.length; i++) {
        document.getElementById(i + 1).innerHTML = "";
    }
    document.getElementById("sum").innerHTML = "";
    document.getElementById("average").innerHTML = "";
    xmeasurements = [];
}

function calculate() {
    let xsum = 0,
        n = 0;
    for (i = 0; i < xmeasurements.length; i++) {
        xsum += Number(xmeasurements[i]);
        n++
    }
    document.getElementById("sum").innerHTML = xsum.toFixed(1);
    document.getElementById("average").innerHTML = (xsum / n).toFixed(2);
}