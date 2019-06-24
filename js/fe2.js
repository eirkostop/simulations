addEventListener('load', initialize);
addEventListener('resize', initialize);

let c = document.getElementById('pendulum')
let ctx = c.getContext("2d");
let x, y, t = 0,
    tt = 0;
let tmeasurements = [];
let ttmeasurements = [];
let theta, xx = 250,
    yy = 210;
let start, pauseTime = 0;
let PendulumIsHidden=false;

function initialize() {
    makeResponsive(ctx, 1000, 1000);
    document.querySelector('#exerciseImage').width = c.width;
    document.body.style.fontSize = scale + "em";
    drawEverything();
    showAngle();
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

    if (divWidth > canvasRatio * (divHeight)) {
        ctx.canvas.height = divHeight;
        ctx.canvas.width = canvasRatio * ctx.canvas.height;
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
    let grd = ctx.createLinearGradient(rectX, rectY, rectX + rectWidth, rectY + rectHeight);
    grd.addColorStop(0, "#f4f4f4");
    grd.addColorStop(1, "#fff");
    ctx.fillStyle = grd;
    ctx.fill();
    ctx.strokeStyle = "#59A8A4";
    ctx.lineWidth = 0.1;
    ctx.stroke();
}

function drawPendulum(){ 
    if(!PendulumIsHidden){
    let theta0 = document.getElementById("mySlider").value;
    xx = 250 + 300 * Math.sin(theta0 * Math.PI / 180 * Math.cos(4 * tt));
    yy = 10 + 300 * Math.cos(theta0 * Math.PI / 180 * Math.cos(4 * tt));
    ctx.beginPath();
    ctx.moveTo(250, 10);
    ctx.lineTo(xx, yy);
    ctx.strokeStyle = "grey";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(xx, yy, 10, 0, 2 * Math.PI);
    let theGradient = ctx.createRadialGradient(
        xx - 1, yy - 2, 1, xx, yy, 5);
    theGradient.addColorStop(0, "#5BB3AF");
    theGradient.addColorStop(1, "#008982");
    ctx.fillStyle = theGradient;
    ctx.fill();
    let grd = ctx.createLinearGradient(0, 0, 496, 0);
    grd.addColorStop(0, "white");
    grd.addColorStop(0.5, "#5BB3AF");
    grd.addColorStop(1, "white");
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, 500, 10);
}
}

function hideDIV(myDIV,myDIV2) {
    this.toggle = !this.toggle;
    var target = document.getElementById(myDIV);
    if (this.toggle) {
      newWidth = target.style.width;
      target.style.width = 0 + "px";
      document.getElementById(myDIV2).style.display = "none";
      document.getElementById('hide-button').classList.remove("fa-eye-slash");
      document.getElementById('hide-button').classList.add("fa-eye");
      document.getElementById('hide-button').title = "Δείξε το εκκρεμές";
    } else {
      target.style.width = newWidth;
  
      setTimeout(function() {
        document.getElementById(myDIV2).style.display = "inline-block"
      }, 1000)
      document.getElementById('hide-button').classList.remove("fa-eye");
      document.getElementById('hide-button').classList.add("fa-eye-slash");
      document.getElementById('hide-button').title = "Κρύψε το εκκρεμές";
    }
  }
function hidePendulum(){
    let hb=document.getElementById('hide-button')
    this.toggle = !this.toggle;
    if(hb.classList.contains("fa-eye")){
        hb.classList.remove("fa-eye");
        hb.classList.add('fa-eye-slash');
        
        PendulumIsHidden=true;
        hb.title = "Δείξε το εκκρεμές";
        
      
        drawEverything();
    }
    else{
            hb.classList.remove("fa-eye-slash");
            hb.classList.add('fa-eye');
            hb.title = "Κρύψε το εκκρεμές";
        PendulumIsHidden=false;
            drawEverything();
    }


}

function drawEverything() {
    ctx.clearRect(0, 0, 500,500);
    drawPendulum();
    ctx.scale(1 / 2, 1 / 2);
    drawClock(150, 150);
    drawDigital(850, 150);
    ctx.scale(2, 2);
}

function drawClock(x0, y0) {
    x = x0 + 90 * Math.cos(2 * Math.PI / 60 * t - Math.PI / 2);
    y = y0 + 90 * Math.sin(2 * Math.PI / 60 * t - Math.PI / 2);
    //Draw clock
    ctx.beginPath();
    ctx.arc(x0, y0, 100, 0, 2 * Math.PI);
    ctx.lineWidth = 2;
    ctx.fillStyle = "#EDFAFF";
    ctx.fill();
    //Draw tickmarks
    for (let j = 0; j < 60; j++) {
        ctx.beginPath();
        ctx.moveTo(x0 + 100 * Math.cos(2 * Math.PI / 60 * j), y0 + 100 * Math.sin(2 * Math.PI / 60 * j));
        ctx.lineTo(x0 + 95 * Math.cos(2 * Math.PI / 60 * j), y0 + 95 * Math.sin(2 * Math.PI / 60 * j));
        ctx.lineWidth = 2;
        ctx.strokeStyle = "rgb(91, 179, 175)";
        ctx.stroke();
    }
    for (let i = 0; i < 13; i++) {
        ctx.beginPath();
        ctx.moveTo(x0 + 100 * Math.cos(2 * Math.PI / 12 * i), y0 + 100 * Math.sin(2 * Math.PI / 12 * i));
        ctx.lineTo(x0 + 80 * Math.cos(2 * Math.PI / 12 * i), y0 + 80 * Math.sin(2 * Math.PI / 12 * i));
        ctx.lineWidth = 2;
        ctx.strokeStyle = "rgb(91, 179, 175)";
        ctx.stroke();
    }
    //Draw indexes
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x, y);
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#333";
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x, y, 2, 0, 2 * Math.PI);
    ctx.arc(x0, y0, 2, 0, 2 * Math.PI);
    ctx.fillStyle = "#333";
    ctx.fill();
}

function drawDigital(x0, y0) {

    //Draw clock
    ctx.beginPath();
    ctx.arc(x0, y0, 100, 0, 2 * Math.PI);
    ctx.lineWidth = 2;
    ctx.fillStyle = "#EDFAFF";
    ctx.fill();
    drawScreen(x0 - 80, y0 - 40, 160, 80);
}

function stopMotion() {
    pauseTime = tt;
    window.clearTimeout(timer);
    tmeasurements.push(t);
    ttmeasurements.push(tt.toFixed(2));
    writemeasurements();
    document.getElementById('tsum').innerHTML = "";
    document.getElementById('ttsum').innerHTML = "";
    document.getElementById('taverage').innerHTML = "";
    document.getElementById('ttaverage').innerHTML = "";
}

function writemeasurements() {
    if (tmeasurements.length < 11) {
        document.getElementById(tmeasurements.length).innerHTML = tmeasurements[tmeasurements.length - 1];
        document.getElementById(ttmeasurements.length + 10).innerHTML = ttmeasurements[ttmeasurements.length - 1];
    }
}

function restartMotion() {
    x = 50;
    y = 100;
    t = 0;
    tt = 0;

    drawEverything();
    window.clearTimeout(timer);
    pauseTime = 0;
}

//Draw screen
function drawScreen(rectX, rectY, rectWidth, rectHeight) {
    drawRect(rectX, rectY, rectWidth, rectHeight, 5, ctx);
    let grd = ctx.createLinearGradient(rectX, rectY, rectX + rectWidth, rectY + rectHeight);
    grd.addColorStop(0, "#f4f4f4");
    grd.addColorStop(1, "#fff");
    ctx.fillStyle = grd;
    ctx.fill();
    ctx.strokeStyle = "#59A8A4";
    ctx.stroke();
    //Draw Digits
    ctx.beginPath();
    ctx.font = "40px BPTypeWrite";
    ctx.fillStyle = "#333";
    ctx.fillText(tt.toFixed(2) + "s", rectX + 10, rectY + rectHeight / 2 + 20);
    ctx.fill();
}

function showAngle() {
    document.getElementById("myReadout").innerHTML = Number(mySlider.value).toFixed(0);
}

function playPause() {
    let b = document.getElementById('play-pause-button');
    let bb = document.getElementById('play-pause2');
    if (b.classList.contains('fa-play')) {
        startMotion();
        b.classList.remove("fa-play");
        b.classList.add("fa-pause");
        b.title = "Παύση - Καταγραφή Μέτρησης";
        bb.classList.remove("fa-play");
        bb.classList.add("fa-pause");
        bb.title = "Παύση - Καταγραφή Μέτρησης";
    } else if (b.classList.contains('fa-pause')) {
        stopMotion();
        b.classList.remove("fa-pause");
        b.classList.add("fa-redo");
        b.title = "Επανεκκίνηση Μέτρησης";
        bb.classList.remove("fa-pause");
        bb.classList.add("fa-redo");
        bb.title = "Επανεκκίνηση Μέτρησης";
    } else if (b.classList.contains('fa-redo')) {
        restartMotion();
        b.classList.remove("fa-redo");
        b.classList.add("fa-play");
        b.title = "Έναρξη Μέτρησης Χρόνου";
        bb.classList.remove("fa-redo");
        bb.classList.add("fa-play");
        bb.title = "Έναρξη Μέτρησης Χρόνου";
    }
}

let timer;

function calculate() {
    let tsum = 0,
        ttsum = 0;
    n = 0;
    for (i = 0; i < tmeasurements.length; i++) {
        tsum += Number(tmeasurements[i]);
        ttsum += Number(ttmeasurements[i]);
        n++
    }
    document.getElementById('tsum').innerHTML = tsum;
    document.getElementById('ttsum').innerHTML = ttsum.toFixed(2);
    if(!Number.isNaN((tsum / n))){document.getElementById('taverage').innerHTML = (tsum / n).toFixed(0)}
    if(!Number.isNaN((ttsum / n))){document.getElementById('ttaverage').innerHTML = (ttsum / n).toFixed(2)}
}

function undoMotion() {
    if (tmeasurements.length < 11 && tmeasurements.length > 0) {
        document.getElementById(tmeasurements.length).innerHTML = "";
        document.getElementById(ttmeasurements.length + 10).innerHTML = "";
        document.getElementById('tsum').innerHTML = "";
        document.getElementById('ttsum').innerHTML = "";
        document.getElementById('taverage').innerHTML = "";
        document.getElementById('ttaverage').innerHTML = "";
        tmeasurements.pop();
        ttmeasurements.pop();
    }
}

function startMotion() {
    start = new Date().getTime() / 1000;
    window.clearTimeout(timer);
    moveClock();
}

function moveClock() {
    tt = new Date().getTime() / 1000 - start + pauseTime;
    t = tt.toFixed(0);
    timer = window.setTimeout(moveClock, 1000 / 60);
    drawEverything();
}