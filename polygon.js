var pos1, pos2, iniX, iniY;
var dragLine = false;
var positions = [];

function line(x1,y1)
{
    this.x1 = x1;
    this.y1 = y1;
    this.break = false;
}

function createPoligon()
{
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,canvas.width,canvas.height);
    var devicePixelRatio = window.devicePixelRatio || 1;
    var backingStoreRatio = ctx.webkitBackingStorePixelRatio ||
                            ctx.mozBackingStorePixelRatio ||
                            ctx.msBackingStorePixelRatio ||
                            ctx.oBackingStorePixelRatio ||
                            ctx.backingStorePixelRatio || 1;

    var ratio = devicePixelRatio / backingStoreRatio;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.scale(ratio, ratio);

    positions = [];
    var cxt = document.getElementById('canvas').getContext('2d');
    var numberOfSides = document.getElementById('input').value;
    var size = 50;
    var Xcenter = canvas.width/2;
    var Ycenter = canvas.height/2;
 
    cxt.beginPath();
    cxt.moveTo (Xcenter +  size * Math.cos(0), Ycenter +  size *  Math.sin(0));

    positions.push(new line(Xcenter +  size * Math.cos(0), Ycenter +  size *  Math.sin(0)));

    for (var i = 1; i < numberOfSides;i += 1) {
        positions.push(new line(Xcenter + size * Math.cos(i * 2 * Math.PI / numberOfSides), Ycenter + size * Math.sin(i * 2 * Math.PI / numberOfSides)));
        let radius = 2;
        cxt.arc(positions[i].x1,positions[i].y1, radius, 0, 2 * Math.PI);
        cxt.lineTo(Xcenter + size * Math.cos(i * 2 * Math.PI / numberOfSides), Ycenter + size * Math.sin(i * 2 * Math.PI / numberOfSides));
    }
    
    cxt.strokeStyle = "#FFC0CB";
    cxt.lineWidth = 4;
    cxt.stroke();
}


function atualizarPosicaoMouse(event) {
    mouseX = event.clientX;
    mouseY = event.clientY;
}

// Define a largura da linha e a distância de tolerância para o mouse estar em cima da linha
const lineWidth = 2;
const tolerance = 1;

// Função para calcular a distância entre um ponto e uma linha
function distanceToLine(x, y, x1, y1, x2, y2) {
    const A = x - x1;
    const B = y - y1;
    const C = x2 - x1;
    const D = y2 - y1;

    const dot = A * C + B * D;
    const len_sq = C * C + D * D;
    const param = dot / len_sq;
    
    let xx, yy;
    
    if (param < 0) {
        xx = x1;
        yy = y1;
    } else if (param > 1) {
        xx = x2;
        yy = y2;
    } else {
        xx = x1 + param * C;
        yy = y1 + param * D;
    }
    
    const dx = x - xx;
    const dy = y - yy;
    
    return Math.sqrt(dx * dx + dy * dy);
}

// Função para verificar se o mouse está em cima da linha
function isMouseOverLine(mouseX, mouseY,startX,startY,endX,endY) {
    const dist = distanceToLine(mouseX, mouseY, startX, startY, endX, endY);
    return dist < (lineWidth / 2 + tolerance);
}

var canvas = document.getElementById("canvas");
const element = document.querySelector('canvas');

// Adiciona o event listener para o botão direito do mouse
canvas.addEventListener('contextmenu', function(event) 
{
    event.preventDefault();
    
    switch(event.button)
    {
        case 2 :
            for(let i =0; i < positions.length; i++)
            {
                let j = i+1;
                if(j == positions.length)
                {
                    j = 0;
                }
                if(isMouseOverLine(mouseX,mouseY,positions[i].x1,positions[i].y1,positions[j].x1,positions[j].y1))
                {
                    positionsSpace(i,mouseX,mouseY);
                    break;
                }
                
            }
        }
    });
    
    var isDragging = false;
    var pos;
canvas.addEventListener('mousedown', function(event) {
    // Obtém as coordenadas do mouse em relação ao canvas
    var rect = canvas.getBoundingClientRect();
    var mouseX = event.clientX - rect.left;
    var mouseY = event.clientY - rect.top;
    
    // Verifica se o clique ocorreu no ponto desejado
    var radius = 20;
    for(let i = 0; i < positions.length; i++)
    {
        var pointX = positions[i].x1; // coordenada X do ponto desejado
        var pointY = positions[i].y1; // coordenada Y do ponto desejado
        var distance = Math.sqrt((mouseX - pointX) ** 2 + (mouseY - pointY) ** 2);
        if (distance <= radius) {
            isDragging = true;
            pos = i;
            break;
        }
        
    }
});
    
// Função para atualizar as coordenadas do ponto durante o arrasto
function updatePoint(event) 
{
    if (isDragging) 
    {
        positions[pos].x1 = mouseX;
        positions[pos].y1 = mouseY;
    }
}
    
function endDrag() 
{
    isDragging = false;
}


    
function positionsSpace(j,x,y)
{
    positions.splice(j+1,0,new line(x,y,));
    positions[j+1].break = false;
}

function redraw()
{
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    var devicePixelRatio = window.devicePixelRatio || 1;
    var backingStoreRatio = ctx.webkitBackingStorePixelRatio ||
    ctx.mozBackingStorePixelRatio ||
    ctx.msBackingStorePixelRatio ||
    ctx.oBackingStorePixelRatio ||
    ctx.backingStorePixelRatio || 1;
    
    var ratio = devicePixelRatio / backingStoreRatio;
    
    canvas.width = canvas.clientWidth * ratio;
    canvas.height = canvas.clientHeight * ratio;
    ctx.scale(ratio, ratio);
    ctx.clearRect(0,0,canvas.width,canvas.height);
    
    ctx.fillStyle='red';
    ctx.beginPath();
    for(let i = 0; i < positions.length; i++)
    {
        let j = i+1;
        if(j == positions.length)
        {
            j = 0;
        }
        if(positions[i].break == true && positions[j].break == true)
        {
            ctx.fillStyle = 'red';
            ctx.fillRect(positions[i].x1,positions[i].y1, 10, 10);
        }
        else
        {
            ctx.lineTo(positions[i].x1,positions[i].y1);
            let radius = 4;
            ctx.arc(positions[i].x1,positions[i].y1, radius, 0, 2 * Math.PI);
        }
    }
    ctx.closePath();
    ctx.strokeStyle = "#FFC0CB";
    ctx.lineWidth = 4;
    ctx.stroke();
}


function checkLineClick()
{
    for(let i =0; i < positions.length; i++)
    {
        let j = i+1;
        if(j == positions.length)
        {
            j = 0;
        }
        if(isMouseOverLine(mouseX,mouseY,positions[i].x1,positions[i].y1,positions[j].x1,positions[j].y1))
        {
            iniX = parseInt(mouseX);
            iniY = parseInt(mouseY);
            pos1 = i;
            pos2 = j;
            dragLine = true;
            break;
        }
    
    }
}

function updateLine(e) {
    if (dragLine) {
        let mouseX= parseInt(e.clientX);
        let mouseY = parseInt(e.clientY);
        
        let dx = mouseX - iniX;
        let dy = mouseY - iniY;
        
        positions[pos1].x1 += dx;
        positions[pos1].y1 += dy;
        positions[pos2].x1 += dx;
        positions[pos2].y1 += dy;
        iniX = mouseX;
        iniY = mouseY;
    }
}
function endDragLine()
{
    dragLine = false;
}

canvas.addEventListener('mousedown', checkLineClick);
canvas.addEventListener('mousemove', updateLine);
canvas.addEventListener('mouseup', endDragLine);
canvas.addEventListener('mouseup', endDrag);
document.addEventListener("mousemove", atualizarPosicaoMouse);
setInterval(updatePoint,1);
var animate = window.setInterval(redraw,1);