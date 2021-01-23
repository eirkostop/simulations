'use strict';
const initialThermometerLevel = 10,
   initialTemperature = -13,
   initialLiquidLevel = 0,
   initialIceSize = 50,
   initialBubblesOpacity = 0
let t, timer, temperature = initialTemperature,
   startTime = 0,
   pauseTime = 0;


const button = document.querySelector('#play-pause-button');
const calibrateInput = document.querySelector('#calibrateInput');
const greenLinearGradient = (c, x0, y0, x, y) => {
   let my_gradient = c.createLinearGradient(x0, y0, x, y);
   my_gradient.addColorStop(0, "#008982");
   my_gradient.addColorStop(0.3, "#D2E8D7");
   my_gradient.addColorStop(1, "#008982");
   return my_gradient;
}
const grayLinearGradient = (c, x0, y0, x, y) => {

   let my_gradient = c.createLinearGradient(x0, y0, x, y);
   my_gradient.addColorStop(0, "#a9a9a9");
   my_gradient.addColorStop(0.3, "#fff");
   my_gradient.addColorStop(1, "#a9a9a9");
   return my_gradient;
}

const orangeLinearGradient = (c, x0, y0, x, y) => {

   let my_gradient = c.createLinearGradient(x0, y0, x, y);
   my_gradient.addColorStop(0, "#F60024");
   my_gradient.addColorStop(1, "#F1B416");
   return my_gradient;
}
const iceLinearRadient = (c, x0, y0, x, y) => {

   let my_gradient = c.createLinearGradient(x0, y0, x, y);
   my_gradient.addColorStop(0, "rgba(187, 227, 244,1)");
   my_gradient.addColorStop(1, "rgba(255,255,255,0.5");
   return my_gradient;
}

const redLinearGradient = (c, x0, y0, x, y) => {

   let my_gradient = c.createLinearGradient(x0, y0, x, y);
   my_gradient.addColorStop(0, "red");
   my_gradient.addColorStop(0.3, "#FF2626");
   my_gradient.addColorStop(1, "red");
   return my_gradient;
}

const blueLinearGradient = (c, x0, y0, x, y) => {

   let my_gradient = c.createLinearGradient(x0, y0, x, y);
   my_gradient.addColorStop(0, "#BBE3F4");
   my_gradient.addColorStop(0.3, "#e7f5fb");
   my_gradient.addColorStop(1, "#BBE3F4");
   return my_gradient;
}


CanvasRenderingContext2D.prototype.roundedRectangle = function (x, y, width, height, rounded) {
   const halfRadians = (2 * Math.PI) / 2
   const quarterRadians = (2 * Math.PI) / 4

   // top left arc
   this.arc(rounded + x, rounded + y, rounded, -quarterRadians, halfRadians, true)

   // line from top left to bottom left
   this.lineTo(x, y + height - rounded)

   // bottom left arc  
   this.arc(rounded + x, height - rounded + y, rounded, halfRadians, quarterRadians, true)

   // line from bottom left to bottom right
   this.lineTo(x + width - rounded, y + height)

   // bottom right arc
   this.arc(x + width - rounded, y + height - rounded, rounded, quarterRadians, 0, true)

   // line from bottom right to top right
   this.lineTo(x + width, y + rounded)

   // top right arc
   this.arc(x + width - rounded, y + rounded, rounded, 0, -quarterRadians, true)

   // line from top right to top left
   this.lineTo(x + rounded, y)
}

/* Screen */
class MeasurementScreen {
   constructor(x, y, w, h, text) {
      this.x = x;
      this.y = y;
      this.w = w;
      this.h = h;
      this.text = text;
   }
   draw(c) {
      c.save();
      c.beginPath();
      c.roundedRectangle(this.x, this.y, this.w, this.h, this.y / 5);
      c.fillStyle = grayLinearGradient(c, this.x - 20, this.y, this.x + 50 + this.w, this.y + this.h);
      c.fill();
      c.strokeStyle = 'gray';
      c.stroke();

      c.beginPath();
      c.font = "17px BPtypewrite";
      c.fillStyle = "#333";
      c.fillText(this.text, this.x + 10, this.y + 30);
      c.restore();

   }
}

/*Vessel*/
class Vessel {
   constructor(x, y, w, h) {
      this.x = x;
      this.y = y;
      this.w = w;
      this.h = h;
      this.liquidLevel = initialLiquidLevel;

      this.iceSize = initialIceSize;
      this.bubbleNumber = 30;
      this.bubbles = [];
      for (let i = 0; i < this.bubbleNumber; i++) this.bubbles.push({
         x: x - w / 2 + Math.random() * w,
         y: this.y - Math.random() * h,
         r: Math.random() * 10,
         o: initialBubblesOpacity
      });
   }
   drawGlass(c) {
      c.save();
      c.beginPath();
      c.moveTo(this.x - this.w / 2, this.y - this.h);
      c.lineTo(this.x - this.w / 2, this.y);
      c.lineTo(this.x + this.w / 2, this.y);
      c.lineTo(this.x + this.w / 2, this.y - this.h);

      c.lineJoin = 'round';
      c.strokeStyle = 'gray';
      c.stroke();

      c.beginPath();
      c.moveTo(this.x + this.w / 2, this.y - this.h);
      c.lineTo(this.x - this.w / 2, this.y - this.h);
      c.setLineDash([4, 4]);
      c.stroke();
      c.restore();
   }
   drawLiquid(c) {
      c.save();
      c.beginPath();
      c.moveTo(this.x - this.w / 2, this.y - this.liquidLevel);
      c.lineTo(this.x - this.w / 2, this.y);
      c.lineTo(this.x + this.w / 2, this.y);
      c.lineTo(this.x + this.w / 2, this.y - this.liquidLevel);

      c.fillStyle = blueLinearGradient(c, this.x - this.w / 2, this.y, this.x + this.w / 2, this.y);
      c.fill();
      c.restore();
   }

   drawIce(c) {
      c.save();
      let iceSize = this.iceSize;

      for (let i = 0; i < 4; i++) {
         for (let j = 0; j < 4; j++) {
            if (iceSize <= 0) break;

            c.beginPath();

            c.roundedRectangle(this.x - 3 * this.w / 8 - iceSize / 2 + i * this.w / 4,
               (this.liquidLevel < this.iceSize * 4 ? // make icecubes float
                  this.y - (j + 1) * iceSize :
                  this.y - this.liquidLevel + (3 - j) * iceSize),
               iceSize, iceSize, iceSize / 3);
            c.closePath();

            c.fillStyle = ((i + j) % 2 == 0) ?
               iceLinearRadient(c, this.x + (i - 2) * iceSize, this.y - iceSize, this.x + (i - 1) * iceSize, this.y - iceSize) :
               iceLinearRadient(c, this.x - -2 * iceSize, this.y - j * iceSize, this.x - 2 * iceSize, this.y - (j + 1) * iceSize);
            c.fill();
            c.strokeStyle = '#BBE3F4';
            c.stroke();

         }

      }
      c.restore();
   }

   drawBubbles(c) {

      c.save();
      c.strokeStyle = 'white';
      c.lineWidth = 3;

      this.bubbles.forEach(bubble => {

         c.beginPath();
         c.arc(bubble.x, bubble.y, bubble.r, 0, 2 * Math.PI);
         c.globalAlpha = bubble.o;
         c.stroke();
      });

      c.restore();
   }
   draw(c) {

      this.drawLiquid(c);
      this.drawIce(c);
      this.drawBubbles(c);
      this.drawGlass(c);

   }
}

/* TextBox  */
class TextBox {
   constructor(x, y) {
      this.x = x;
      this.y = y;
   }

   checkTemperature() {
      if (temperature < 0) {
         this.text1 = 'Στερεό';
         this.text2 = '';
         this.text3 = '';
      } else if (temperature == 0) {
         this.text2 = '+';
         this.text3 = 'Υγρό';
      } else if (temperature > 0 && temperature < 100) {
         this.text1 = 'Υγρό';
         this.text2 = '';
         this.text3 = '';
      } else if (temperature == 100) {
         this.text1 = 'Υγρό';
         this.text2 = '+';
         this.text3 = 'Αέριο';
      } else if (temperature > 100) {
         this.text1 = 'Αέριο';
         this.text2 = '';
         this.text3 = '';
      }
   }

   draw(c) {
      this.checkTemperature();

      c.beginPath();
      c.font = "20px BPtypewrite";
      c.fillStyle = "#333";
      //c.fillText('Κατάσταση:', this.x-10, this.y-50);
      c.fillText(this.text1, this.x, this.y);
      c.fillText(this.text2, this.x, this.y + 25);
      c.fillText(this.text3, this.x, this.y + 50);

   }
}



/* Thermometer*/
class Thermometer {
   constructor(x, y) {

      this.x = x;
      this.y = y;
      this.tube = 250;
      this.level = initialThermometerLevel;
      this.dragOk = false; //It can be dragged with mouse
      this.dragging = false; //Currently being dragged
      this.calibrated = true;
      this.cracked = false;
   }

   drawGlass(c) {
      c.save()
      c.beginPath()
      c.arc(this.x, this.y + 10, 10, Math.PI, 0);
      c.lineTo(this.x + 10, this.y + this.tube);
      c.arc(this.x, this.y + this.tube + 20, 10 * Math.sqrt(5), -Math.PI / 3, Math.PI * 4 / 3, false);
      c.closePath();
      c.strokeStyle = 'gray';
      c.stroke();
      c.restore();
   }

   drawAlcohol(c) {
      c.save();
      c.beginPath();
      c.moveTo(this.x - 10, this.y + this.tube - this.level);
      c.lineTo(this.x + 10, this.y + this.tube - this.level);
      c.lineTo(this.x + 10, this.y + this.tube);
      c.arc(this.x, this.y + this.tube + 20, 10 * Math.sqrt(5), -Math.PI / 3, Math.PI * 4 / 3, false);
      c.closePath();
      c.fillStyle = redLinearGradient(c, this.x - 20, this.y, this.x + 20, this.y);
      c.fill();
      c.restore();
   }

   drawCrack(c) {
      c.save();
      c.beginPath();
      c.moveTo(this.x - 12, this.y + this.tube * 0.9);
      c.lineTo(this.x, this.y + this.tube * 0.8);
      c.lineTo(this.x, this.y + this.tube * 0.9);
      c.lineTo(this.x + 12, this.y + this.tube * 0.8);
      c.lineWidth = 4;
      c.lineCap = 'round';
      c.strokeStyle = 'white';
      c.stroke();
      c.restore();
   }

   //Draw gridlines
   drawGridlines(ctx) {

      let step = (this.tube - 30) / 12;
      ctx.beginPath();
      for (let j = 0; j < 13; j++) {
         ctx.moveTo(this.x + 10, this.y + 15 + step * j);
         ctx.lineTo(this.x, this.y + 15 + step * j);
      }

      ctx.strokeStyle = "gray";
      ctx.stroke();
      ctx.beginPath();
      ctx.font = "10px BPtypewrite";
      ctx.fillStyle = "#333";
      for (let j = 0; j < 13; j++) {
         ctx.fillText((11 - j) * 10, this.x + 20, this.y + 17 + step * j);
      }
   }


   move(e, canvas) {
      let BB = canvas.getBoundingClientRect();
      let mx = e.clientX - BB.left;
      let my = e.clientY - BB.top;


   }

   draw(c) {

      this.drawAlcohol(c);
      this.drawGlass(c);
      if (this.calibrated) this.drawGridlines(c);
      if (this.cracked) this.drawCrack(c);

   }
}

/*heat source*/
class HeatSource {
   constructor(x, y, w, h) {
      this.x = x;
      this.y = y;
      this.w = w;
      this.h = h;
      this.w1 = w / 6;
      this.h1 = h / 6;
      this.Flame = new Flame(this.x, this.y - 5 - this.h - this.h1, 75);
      this.heating = false;
   }
   drawBody(c) {

      c.save();
      c.beginPath();
      c.moveTo(this.x - this.w / 2, this.y - this.h);
      c.lineTo(this.x - this.w / 2, this.y);
      c.lineTo(this.x + this.w / 2, this.y);
      c.lineTo(this.x + this.w / 2, this.y - this.h);
      c.closePath()
      c.fillStyle = greenLinearGradient(c, this.x - this.w / 2, this.y, this.x + this.w / 2, this.y);
      c.fill();


      c.beginPath();
      c.moveTo(this.x - this.w1 / 2, this.y - this.h - this.h1);
      c.lineTo(this.x - this.w1 / 2, this.y - this.h);
      c.lineTo(this.x + this.w1 / 2, this.y - this.h);
      c.lineTo(this.x + this.w1 / 2, this.y - this.h - this.h1);
      c.closePath()
      c.fillStyle = grayLinearGradient(c, this.x - this.w1 / 2, this.y, this.x + this.w1 / 2, this.y);
      c.fill();

      c.restore();
   }


   draw(c) {
      this.drawBody(c);
      if (this.heating) this.Flame.draw(c);
   }
}

/* Flame*/
class Flame {
   constructor(x, y, level) {
      this.x = x;
      this.y = y;
      this.level = level;
   }
   drawFlame(c) {
      c.save();

      c.beginPath();
      c.moveTo(this.x, this.y - this.level);
      c.quadraticCurveTo(
         this.x - this.level / 2, this.y,
         this.x, this.y);

      c.quadraticCurveTo(
         this.x + this.level / 2, this.y,
         this.x, this.y - this.level);
      c.fillStyle = orangeLinearGradient(c, this.x, this.y - this.level, this.x, this.y);
      c.fill();


      c.restore();

   }
   draw(c) {
      this.drawFlame(c);
   }
}

/* Canvas*/

class CanvasDisplay {
   constructor() {
      this.canvas = document.querySelector('canvas');
      this.ctx = this.canvas.getContext('2d');
      this.stageConfig = {
         //width: window.innerWidth,
         //height: window.innerHeight
         width: 500,
         height: 500,
         color: '#333'

      };
      this.showTime = true;
      this.showTemperature = true;

      this.canvas.width = this.stageConfig.width;
      this.canvas.height = this.stageConfig.height;
      this.Thermometer = new Thermometer(250, 30);
      this.HeatSource = new HeatSource(250, 490, 80, 60);
      this.Vessel = new Vessel(250, 330, 200, 220);
      this.MeasurementScreens = [
         new MeasurementScreen(100, 10, 100, 50, 't=' + 0 + ' s'),
         new MeasurementScreen(300, 10, 100, 50, 'θ=' + initialTemperature + ' ℃')
      ];
      this.TextBox = new TextBox(380, 200, 'Στερεό');



      this.canvas.onmousedown = (e) => this.myMouseDown(e, this.canvas);
      this.canvas.onmousemove = (e) => this.myMouseMove(e, this.canvas);
      this.canvas.onmouseup = (e) => this.myMouseUp(e, this.canvas);
   }

   initialX;
   initialY;
   startTime = 0;
   pauseTime = 0;
   t = 0;

   mouseOverThermometer(thermometer) {
      return this.initialX > thermometer.x - 10 &&
         this.initialX < thermometer.x + 10 &&
         this.initialY > thermometer.y &&
         this.initialY < thermometer.y + thermometer.tube
   }

   myMouseDown(e, canvas) {
      let BB = canvas.getBoundingClientRect();
      this.initialX = e.clientX - BB.left;
      this.initialY = e.clientY - BB.top;

      if (this.mouseOverThermometer(this.Thermometer) && this.Thermometer.dragOk) {
         this.Thermometer.dragging = true
      }

   }

   myMouseMove(e, canvas) {
      let BB = canvas.getBoundingClientRect();

      let dx = e.clientX - BB.left - this.initialX;

      let dy = e.clientY - BB.top - this.initialY;

      if (this.Thermometer.dragging) {
         this.Thermometer.x += dx;
         this.Thermometer.y += dy;

         this.initialX += dx;
         this.initialY += dy;

         this.draw();
      }

   }

   myMouseUp(e, canvas) {
      this.Thermometer.dragging = false;

   }

   startMotion() {
      startTime = new Date().getTime() / 1000;
      this.animate();

   }
   stopMotion() {
      pauseTime = t;
      window.clearTimeout(timer);
   }
   resetMotion() {
      window.clearTimeout(timer);
      pauseTime = 0;
      /*reset initial values*/
      this.HeatSource.heating = false;
      this.Thermometer.level = initialThermometerLevel;
      this.Thermometer.cracked = false;
      temperature = initialTemperature;
      this.Vessel.liquidLevel = initialLiquidLevel;
      this.Vessel.iceSize = initialIceSize;
      this.Vessel.bubbles.forEach(bubble => bubble.o = initialBubblesOpacity);
      this.MeasurementScreens[0].text = 't=' + 0 + ' s';
      this.MeasurementScreens[1].text = 'θ=' + initialTemperature + ' ℃';

      this.draw()
   }

   heatThermometer() {

      temperature += 1;
      this.Thermometer.level = temperature * (this.Thermometer.tube - 30) / 120 + (this.Thermometer.tube + 150) / 12;

   }


   meltIce() {
      let dx = 0.5;
      this.Vessel.iceSize -= dx;
      this.Vessel.liquidLevel += 13 * (Math.pow(this.Vessel.iceSize + dx, 2) - Math.pow(this.Vessel.iceSize, 2)) / this.Vessel.w;
   }

   boilWater() {
      let dx = 0.5
      let maxRadius = 15;
      this.Vessel.liquidLevel -= dx;
      this.Vessel.bubbles.forEach(bubble => {
         if (bubble.y < this.Vessel.y - this.Vessel.liquidLevel) bubble.o = 0;
         else if (bubble.o == 0) bubble.o = 0.3 + 0.3 * Math.random();
         else if (bubble.r <= maxRadius) bubble.r += 1;
         else {
            bubble.x = this.Vessel.x - this.Vessel.w / 2 + Math.random() * this.Vessel.w;
            bubble.y = this.Vessel.y - Math.random() * this.Vessel.liquidLevel;
            bubble.r = 0;
            bubble.o = Math.random();
         }
      });

   }


   animate() {
      t = (new Date().getTime() / 1000 + (pauseTime - startTime)).toFixed(1);
      this.HeatSource.heating = true;

      this.MeasurementScreens[0].text = 't=' + t + ' s';
      this.MeasurementScreens[1].text = 'θ=' + temperature + ' ℃';

      if (temperature == 0 && this.Vessel.iceSize > 0) this.meltIce()
      else if (temperature == 100 && this.Vessel.liquidLevel > 0) this.boilWater();
      else if (temperature <= 112) this.heatThermometer();

      this.draw();

      if (temperature >= 112)
         this.Thermometer.cracked = true;
      if (temperature <= 112)
         timer = window.setTimeout(() => this.animate(), 1000 / 60);

   }

   draw() {
      this.ctx.clearRect(0, 0, this.stageConfig.width, this.stageConfig.height);
      this.Vessel.draw(this.ctx);
      this.Thermometer.draw(this.ctx);
      this.HeatSource.draw(this.ctx);
      if (this.showTime) this.MeasurementScreens[0].draw(this.ctx);
      if (this.showTemperature) this.MeasurementScreens[1].draw(this.ctx);
      this.TextBox.draw(this.ctx);
   }

}

let canvasDisplay = new CanvasDisplay();
canvasDisplay.draw();

let playPause = () => {

   if (button.classList.contains('fa-play')) {

      canvasDisplay.startMotion();
      button.classList.remove("fa-play");
      button.classList.add("fa-pause");
      button.title = "Παύση - Καταγραφή Μέτρησης";
   } else if (button.classList.contains('fa-pause')) {
      canvasDisplay.stopMotion();
      button.classList.remove("fa-pause");
      button.classList.add("fa-play");
      button.title = "Επανεκκίνηση Μέτρησης";
   }

}
let reset = () => {
   if (button.classList.contains('fa-pause')) {
      button.classList.remove("fa-pause");
      button.classList.add("fa-play");
      button.title = "Επανεκκίνηση Μέτρησης";
   }
   canvasDisplay.resetMotion();
}

let temperatureCheck = () => {
   canvasDisplay.Thermometer.calibrated = temperatureInput.checked;
   canvasDisplay.showTemperature = temperatureInput.checked;
   canvasDisplay.draw()
}
let timeCheck = () => {
   canvasDisplay.showTime = timeInput.checked;
   canvasDisplay.draw()
}