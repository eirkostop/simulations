// get canvas related references
var c = document.getElementById("spring");
var ctx = c.getContext("2d");
var BB = c.getBoundingClientRect();
var offsetX = BB.left;
var offsetY = BB.top;

var t = 0;
var timer1, timer2;
var p = document.getElementById('plot')
var pctx = p.getContext("2d");
var scale = 1;
var points = [{
    x: 54,
    y: 297
}];
points.push({
    x: 54 + 1 * 880 / 21,
    y: 297 - (259 / 13) * 1.5
});
points.push({
    x: 54 + 2 * 880 / 21,
    y: 297 - (259 / 13) * 3
});
points.push({
    x: 54 + 3 * 880 / 21,
    y: 297 - (259 / 13) * 4.5
});
points.push({
    x: 54 + 4 * 880 / 21,
    y: 297 - (259 / 13) * 6
});
points.push({
    x: 54 + 5 * 880 / 21,
    y: 297 - (259 / 13) * 7.5
});
points.push({
    x: 54 + 6 * 880 / 21,
    y: 297 - (259 / 13) * 9
});
points.push({
    x: 54 + 8 * 880 / 21,
    y: 297 - (259 / 13) * 12
});

var img1 = new Image();
img1.src = "fe3-2.png";
var img2 = new Image();
img2.src = "fe3-3.png";
pctx.drawImage(img2, 0, 0, 496, 340);


function initialize() {
    window.addEventListener('resize', resizeCanvas, false);
    resizeCanvas();
}

function resizeCanvas() {

    if (document.documentElement.clientWidth <= 1000) {
        scale = (document.documentElement.clientWidth - 4) / 996;
        p.width = 996 * scale;
        p.height = 680 * scale;
        pctx.scale(2 * scale, 2 * scale);
        c.width = 996 * scale;
        c.height = 1100 * scale;
        ctx.scale(2 * scale, 2 * scale)
    }
    if (document.documentElement.clientWidth > 1000) {

        p.width = 996;
        p.height = 680;
        c.width = 996;
        c.height = 1100;
        ctx.scale(2, 2);
        pctx.scale(2, 2);
    }
    writeMeasurements();
    // listen for mouse events
    c.ontouchstart = myTouchStart;
    c.ontouchmove = myTouchMove;
    c.ontouchend = myUp;
    c.onmousedown = myDown;
    c.onmouseup = myUp;
    window.onmouseup = myUp;
    c.onmousemove = myMove;
    draw();
    writeMeasurements();
    drawPlotLine();

}

function writeMeasurements() {
    pctx.clearRect(0, 0, 496, 340);
    pctx.drawImage(img2, 0, 0, 496, 340);
    pctx.setLineDash([]);
    drawGridlines();
    for (i = 0; i < points.length - 1; i++) {
        pctx.beginPath();
        pctx.strokeStyle = "#008982";
        pctx.lineWidth = "1.5";
        pctx.moveTo(points[i].x - 5, points[i].y - 5);
        pctx.lineTo(points[i].x + 5, points[i].y + 5);
        pctx.moveTo(points[i].x - 5, points[i].y + 5);
        pctx.lineTo(points[i].x + 5, points[i].y - 5);
        pctx.stroke();
    }
}

var length;

function calculateMass() {
    document.getElementById("mass").innerHTML = "";
    var elem = document.getElementById("length");
    if (elem.checkValidity() && elem.value.length != 0) {
        length = elem.value;
        mass = 5 / 1.5 * length;
        writeMeasurements();
        drawPlotLine();

        drawLine(54, 297 - (259 / 13) * length, 54 + mass / 5 * 880 / 21, 297);
        pctx.beginPath();
        pctx.fillStyle = "red";
        pctx.arc(54 + mass / 5 * 880 / 21, 297 - (259 / 13) * length, 5, 0, 2 * Math.PI);
        pctx.fill();
    } else {
        alert("Συμπλήρωσε πρώτα την επιμήκυνση του ελατηρίου")
    }
}

var x, y;

function drawLine(x1, y1, x2, y2) {
    var x = x1,
        y = y1;
    animateLine(x1, y1);

    function animateLine(x1, y1) {
        if (x < x2) {
            x += 1;

            pctx.beginPath();
            pctx.setLineDash([5, 3]);
            pctx.strokeStyle = "#008982";
            pctx.moveTo(x1, y1);
            pctx.lineTo(x, y);
            pctx.stroke();
            timer1 = window.setTimeout(function () {
                animateLine(x1, y1)
            }, 1);
        } else if (y < y2) {
            y += 1;
            pctx.beginPath();
            pctx.strokeStyle = "#008982";
            pctx.moveTo(x2, y1);
            pctx.lineTo(x2, y);
            pctx.stroke();
            timer1 = window.setTimeout(function () {
                animateLine(x1, y1)
            }, 1);
        } else {
            window.clearTimeout(timer1);
            var decimals;
            if ((5 * length) % 1.5 == 0) {
                decimlas = 0
            } else {
                decimals = 2
            };
            document.getElementById("mass").innerHTML = mass.toFixed(decimals);
        }
    }
}

function drawGridlines() {
    pctx.beginPath();
    pctx.lineWidth = "1.5"
    pctx.strokeStyle = "#333";
    pctx.fillStyle = "#333";
    pctx.font = "12px Georgia";
    pctx.moveTo(54, 297);
    pctx.lineTo(493, 297);
    pctx.moveTo(54, 37);
    pctx.lineTo(54, 297);
    for (i = 0; i < 22; i += 2) {
        pctx.moveTo(54 + (440 / 21) * i, 297);
        pctx.lineTo(54 + (440 / 21) * i, 291);
    }
    for (i = 0; i < 14; i++) {
        pctx.moveTo(54, 297 - (259 / 13) * i);
        pctx.lineTo(60, 297 - (259 / 13) * i);
    }
    pctx.stroke();
    for (i = 0; i < 22; i += 2) {
        pctx.fillText(2.5 * i, 50 + (440 / 21) * i, 316)
    }
    for (i = 0; i < 13; i++) {
        pctx.fillText(i, 34, 300 - (259 / 13) * i);
    }
}

function drawPlotLine() {
    points.sort(function (a, b) {
        return parseFloat(a.x) - parseFloat(b.x);
    });
    pctx.beginPath();
    pctx.lineWidth = "3";
    pctx.strokeStyle = "#404040";
    // move to the first point
    pctx.moveTo(points[0].x, points[0].y);
    for (i = 1; i < points.length - 2; i++) {
        var xc = (points[i].x + points[i + 1].x) / 2;
        var yc = (points[i].y + points[i + 1].y) / 2;
        pctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
    }
    // curve through the last two points
    pctx.quadraticCurveTo(points[i].x, points[i].y, points[i + 1].x, points[i + 1].y);
    pctx.stroke();
}


//SRPRING CANVAS

//spring related varibles
var DL = 0,
    L0 = 60 + weightL,
    weightL = 0,
    L = 60;
L0 = 60;
var weightsOnSpring = 0;
height = 0;
//ruler related variables
var rulerX = 370,
    rulerY = 85;
isDragged = false;
var newWeightL = weightL = 40 + 40 * Math.floor(Math.random() * 8);
// drag related variables
var dragok = false;
var startX;
var startY;

// an array of objects that define different weights
var weights = [{
    x: 130,
    y: 220,
    height: 60,
    isDragging: false,
    isOnSpring: false
}];
var s = weights[0]

// call to draw the scene
initialize();


// clear the canvas
function clear() {
    ctx.clearRect(0, 0, 1000, 1000);
}

// redraw the scene
function draw() {
    clear();
    Spring(250, 10, 60 + DL, 32);
    Ceiling();
    // redraw each shape in the weights[] array
    Weight(s.x, s.y, s.height);
    Ruler(rulerX, rulerY);
}

// handle touchstart events
function myTouchStart(e) {
    window.clearTimeout(timer2);
    t = 0;
    // tell the browser we're handling this touch event
    e.preventDefault();
    // get the current mouse position
    var mx = parseInt((e.targetTouches[0].pageX - c.offsetLeft) / scale);
    var my = parseInt((e.targetTouches[0].pageY - c.offsetTop) / scale);

    // test each shape to see if touch is inside
    dragok = false;


    // test if touch is inside this rect
    if (mx > s.x - 15 && mx < s.x + 15 && my > s.y && my < s.y + s.height) {
        // if yes, set that rects isDragging=true
        dragok = true;
        s.isDragging = true;
    }

    if (mx > rulerX && mx < rulerX + 50 && my > rulerY && my < rulerY + 420) {
        dragok = true;
        isDragged = true
    }

    // save the current touch position
    startX = mx;
    startY = my;

}

// handle touch moves
function myTouchMove(e) {
    // if we're dragging anything...
    if (dragok) {
        // tell the browser we're handling this touch event
        e.preventDefault();
        e.stopPropagation();

        // get the current touch position
        var mx = parseInt((e.targetTouches[0].pageX - c.offsetLeft) / scale);
        var my = parseInt((e.targetTouches[0].pageY - c.offsetTop) / scale);

        // calculate the distance touch has moved
        // since the last touchmove
        var dx = mx - startX;
        var dy = my - startY;

        // move each rect that isDragging 
        // by the distance the touch has moved
        // since the last touchmove

        if (s.isDragging) {
            s.x += dx;
            s.y += dy;

            if (s.x < 260 && s.x > 240) {
                s.isOnSpring = true;
                DL = s.y - 70 - height;

                height = 0;

            } else {
                s.isOnSpring = false;
            }
        }

        //Move ruler
        if (isDragged) {
            rulerX += dx;
            rulerY += dy;
        }

        // redraw the scene with the new rect positions
        draw();

        // reset the starting touch position for the next mousemove
        startX = mx;
        startY = my;
    }
}

// handle mousedown events
function myDown(e) {
    window.clearTimeout(timer2);
    t = 0;
    // tell the browser we're handling this mouse event
    e.preventDefault();
    e.stopPropagation();
    // get the current mouse position
    var mx = parseInt((e.clientX - c.offsetLeft) / scale);
    var my = parseInt((e.clientY - c.offsetTop) / scale);

    // test each shape to see if mouse is inside
    dragok = false;

    // test if the mouse is inside this rect
    if (mx > s.x - 15 && mx < s.x + 15 && my > s.y && my < s.y + s.height) {
        // if yes, set that rects isDragging=true
        dragok = true;
        s.isDragging = true;
    }

    if (mx > rulerX && mx < rulerX + 50 && my > rulerY && my < rulerY + 420) {
        dragok = true;
        isDragged = true
    }

    // save the current mouse position
    startX = mx;
    startY = my;


}

// handle mouse moves
function myMove(e) {
    // if we're dragging anything...
    if (dragok) {
        // tell the browser we're handling this mouse event
        e.preventDefault();
        e.stopPropagation();

        // get the current mouse position
        var mx = parseInt((e.clientX - c.offsetLeft) / scale);
        var my = parseInt((e.clientY - c.offsetTop) / scale);

        // calculate the distance the mouse has moved
        // since the last mousemove
        var dx = mx - startX;
        var dy = my - startY;

        // move each rect that isDragging 
        // by the distance the mouse has moved
        // since the last mousemove

        if (s.isDragging) {
            s.x += dx;
            s.y += dy;

            if (s.x < 260 && s.x > 240) {
                s.isOnSpring = true;
                DL = s.y - 70 - height;

                height = 0;

            } else {
                s.isOnSpring = false;
            }
        }

        //Move ruler
        if (isDragged) {
            rulerX += dx;
            rulerY += dy;
        }

        // redraw the scene with the new rect positions
        draw();

        // reset the starting mouse position for the next mousemove
        startX = mx;
        startY = my;
    }
}


// handle mouseup events
function myUp(e) {

    // tell the browser we're handling this mouse event
    e.preventDefault();
    e.stopPropagation();

    // clear all the dragging flags
    dragok = false;
    isDragged = false;
    s.isDragging = false;

    L = 60 + DL;
    oscillate();
}

function oscillate() {
    if (DL.toFixed(2) == weightL) {
        window.clearTimeout(timer2);
        t = 0;
    } else {
        t += 0.1;
        weightL = 0;
        if (s.isOnSpring) {
            weightL = newWeightL;
        }

        L0 = 60 + weightL;
        DL = weightL + Math.exp(-0.3 * t) * (L - L0) * Math.cos(t);
        height = 0;
        if (s.isOnSpring) {
            s.y = 70 + DL + height;
            s.x = 250;
        }
        draw();
        timer2 = window.setTimeout(oscillate, 1000 / 60);
    }
}


function Spring(x0, y0, length, N) {
    startLine(y0 + length);
    ctx.beginPath();
    ctx.moveTo(x0 - 15, y0);
    ctx.lineTo(x0 + 15, y0);
    ctx.moveTo(x0 - 15, y0);
    ctx.lineTo(x0 + 15, y0);
    ctx.moveTo(x0 + 15, y0 + (length - 10) / N);
    for (i = 1; i < N; i += 4) {
        ctx.lineTo(x0 - 15, y0 + (i + 2) * (length - 10) / N);
        ctx.moveTo(x0 + 15, y0 + (i + 4) * (length - 10) / N);
    }
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#D2E8D7";
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x0, y0);
    for (i = 1; i < N; i += 4) {
        ctx.lineTo(x0 + 15, y0 + i * (length - 10) / N);
        ctx.moveTo(x0 - 15, y0 + (i + 2) * (length - 10) / N);
    }
    ctx.lineTo(x0, y0 + length - 10);
    ctx.arc(x0, y0 + length - 5, 5, -Math.PI / 2, Math.PI);
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#008982";
    ctx.stroke();



}

function Ceiling() {
    var my_gradient = ctx.createLinearGradient(0, 0, 496, 0);
    my_gradient.addColorStop(0, "#fff");
    my_gradient.addColorStop(0.5, "#008982");
    my_gradient.addColorStop(1, "#fff");
    ctx.beginPath();
    ctx.fillStyle = my_gradient;
    ctx.fillRect(0, 0, 496, 10)
    ctx.fill();
}

function Weight(x0, y0, height) {
    var my_gradient = ctx.createLinearGradient(x0 - 15, y0, x0 + 15, y0);
    my_gradient.addColorStop(0, "#a9a9a9");
    my_gradient.addColorStop(0.5, "#fff");
    my_gradient.addColorStop(1, "#a9a9a9");

    ctx.beginPath();
    ctx.arc(x0, y0 + 5, 5, -Math.PI, Math.PI / 2);
    ctx.strokeStyle = "#767676";
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x0, y0 + height - 5, 5, 0, 3 * Math.PI / 2);
    ctx.strokeStyle = "#878787";
    ctx.stroke();
    ctx.beginPath();
    ctx.fillStyle = my_gradient;
    ctx.fillRect(x0 - 15, y0 + 10, 30, height - 20);
    ctx.fill();


    ctx.font = "12px Georgia";
    ctx.fillStyle = "#333"
    ctx.fillText("?", x0 - 5, y0 + height / 2);

}


function Ruler(x, y) {
    var my_gradient = ctx.createLinearGradient(x, y + 200, x + 50, y + 250);
    my_gradient.addColorStop(0, "#dadada");
    my_gradient.addColorStop(0.5, "#f3f3f3");
    my_gradient.addColorStop(1, "#dadada");
    ctx.beginPath();
    ctx.fillStyle = my_gradient;
    ctx.fillRect(x, y, 50, 420);
    ctx.fill();
    ctx.beginPath();
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 2;
    ctx.font = "12px Georgia";
    ctx.fillStyle = "#333"
    for (var i = 0; i < 16; i++) {
        ctx.moveTo(x, y + 10 + i * 80 / 3);
        ctx.lineTo(x + 15, y + 10 + i * 80 / 3);
        ctx.fillText(i, x + 20, y + 12 + i * 80 / 3);
    }
    ctx.lineWidth = 1;
    for (var i = 0; i < 31; i++) {
        ctx.moveTo(x, y + 10 + i * 40 / 3);
        ctx.lineTo(x + 10, y + 10 + i * 40 / 3);
    }
    ctx.stroke();
}

function startLine(y) {
    ctx.beginPath();
    ctx.setLineDash([5, 3]);
    ctx.strokeStyle = "#f3f3f3";
    ctx.lineWidth = 2;
    ctx.moveTo(150, y);
    ctx.lineTo(350, y);
    ctx.stroke();
    ctx.setLineDash([]);
}

function hideDIV() {
    this.toggle = !this.toggle;
    var target = document.getElementById('weightsDIV');
    if (this.toggle) {
        newWidth = target.style.width;
        target.style.width = 0 + "px";
        document.getElementById('hide-button').classList.remove("fa-eye-slash");
        document.getElementById('hide-button').classList.add("fa-eye");
        document.getElementById('hide-button').title = "Δείξε το ελατήριο";
    } else {
        target.style.width = newWidth;
        document.getElementById('hide-button').classList.remove("fa-eye");
        document.getElementById('hide-button').classList.add("fa-eye-slash");
        document.getElementById('hide-button').title = "Κρύψε το ελατήριο";
    }
}
/*function showCoords(e) {
  mx = (e.pageX-p.offsetLeft)/scale;
 my = (e.pageY-p.offsetTop)/scale;
    var coords = "X coords: " + mx + ", Y coords: " + my+" x:"+x;
    document.getElementById("demo").innerHTML = coords;}

p.addEventListener('mousemove', showCoords, false); */