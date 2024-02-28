const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

const rectangles = [
    { x: 100, y: 100, width: 60, height: 40, dx: 1, dy: 1, text: "A" },
    { x: 200, y: 50, width: 60, height: 40, dx: 1, dy: -1, text: "B" },
    { x: 150, y: 200, width: 60, height: 40, dx: -1, dy: 1, text: "C" }
];

function drawRectangle(rect) {
    ctx.beginPath();
    ctx.rect(rect.x, rect.y, rect.width, rect.height);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();

    ctx.fillStyle = "white";
    ctx.font = "16px Arial";
    ctx.fillText(rect.text, rect.x + rect.width / 4, rect.y + rect.height / 1.5);
}

function drawLine(rect1, rect2) {
    ctx.beginPath();
    ctx.moveTo(rect1.x + rect1.width / 2, rect1.y + rect1.height / 2);
    ctx.lineTo(rect2.x + rect2.width / 2, rect2.y + rect2.height / 2);
    ctx.strokeStyle = "black";
    ctx.stroke();
    ctx.closePath();
}

function updatePosition(rect) {
    rect.x += rect.dx;
    rect.y += rect.dy;

    if(rect.x + rect.width > canvas.width || rect.x < 0) {
        rect.dx *= -1;
    }

    if(rect.y + rect.height > canvas.height || rect.y < 0) {
        rect.dy *= -1;
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    rectangles.forEach(drawRectangle);
    drawLine(rectangles[0], rectangles[1]);
    drawLine(rectangles[1], rectangles[2]);
    drawLine(rectangles[2], rectangles[0]);
    rectangles.forEach(updatePosition);
    requestAnimationFrame(draw);
}

draw();
