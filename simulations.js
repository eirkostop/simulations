var pointerX, pointerY, scale = 1;
var cornerRadius = 5;
var distanceX, distanceY, pointerX0, pointerY0;
var xr = 18,  yr = 20;

function resizeFonts() {
  if (window.innerWidth <= 1000 && window.innerWidth >= 500) {
    document.body.style.fontSize = "1.6vw";
  } else if (window.innerWidth > 1000) {
    document.body.style.fontSize = "16px";
  } else if (window.innerWidth < 500) {
    document.body.style.fontSize = "3.2vw";
  }
}

function resizeCanvas(myCanvas,initialWidth,initialHeight) {
  var c = document.getElementById(myCanvas);
  var ctx = c.getContext("2d");
  if (window.innerWidth <= 1000 && window.innerWidth >= 500) {
    scale = (window.innerWidth - 4) / 996;
    c.width = initialWidth * scale;
    c.height = initialHeight * scale;
    ctx.scale(2 * scale, 2 * scale);
  } else if (window.innerWidth > 1000) {
    c.width = initialWidth;
    c.height = initialHeight;
    ctx.scale(2, 2);
  } else if (window.innerWidth < 500) {
    scale = (window.innerWidth - 4) / 496;
    c.width = initialWidth * scale;
    c.height = initialHeight * scale;
    ctx.scale(2 * scale, 2 * scale);
  }
}

function hideDIV(myDIV) {
  this.toggle = !this.toggle;
  var target = document.getElementById(myDIV);
  if (this.toggle) {
    newWidth = target.style.width;
    target.style.width = 0 + "px";
    document.getElementById('hide-button').classList.remove("fa-eye-slash");
    document.getElementById('hide-button').classList.add("fa-eye");
    document.getElementById('hide-button').title = "Δείξε την προσομοίωση";
  } else {
    target.style.width = newWidth;
    document.getElementById('hide-button').classList.remove("fa-eye");
    document.getElementById('hide-button').classList.add("fa-eye-slash");
    document.getElementById('hide-button').title = "Κρύψε την προσομοίωση";
  }
}

function drawRect(rectX, rectY, rectWidth, rectHeight, cornerRadius, myCanvas) {
  var c = document.getElementById(myCanvas);
  var ctx = c.getContext("2d");
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
