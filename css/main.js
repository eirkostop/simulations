addEventListener('load', initialize);
addEventListener('resize', initialize);

function initialize() {
    let c = document.getElementById("myCanvas");
    let ctx = c.getContext("2d");
makeResponsive();
function makeResponsive(){

        let CanvasRatio=1;

        let divWidth = document.getElementById("experimentDIV").offsetWidth;
        let divHeight = document.getElementById("experimentDIV").offsetHeight;
        
        if (window.innerWidth > window.innerHeight*CanvasRatio) {
            document.querySelector('main').style.flexDirection = "row";
            divWidth = document.querySelector('main').clientWidth / 2;

        } else {
            document.querySelector('main').style.flexDirection = "column";
            divHeight = document.querySelector('main').clientHeight / 2;
        }
        if (divWidth > divHeight) {

            ctx.canvas.height = divHeight;
            ctx.canvas.width = divHeight*CanvasRatio;
            ctx.canvas.style.width = null;
            ctx.canvas.style.height = "100%";
        } else {

            ctx.canvas.width = divWidth;
            ctx.canvas.height = divWidth/CanvasRatio;
            ctx.canvas.style.height = null;
            ctx.canvas.style.width = "100%";
        }
    }
}