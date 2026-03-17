let width = 31
let height = 31
let maze = []
let player = { x:1, y:1 }

let tileSize = 30
let viewTiles = 15
let visionRadius = 4

const canvas = document.getElementById("game")
const ctx = canvas.getContext("2d")

function generateMaze(){

maze=[]

for(let y=0;y<height;y++){
    let row=[]
    for(let x=0;x<width;x++){
        row.push("#")
    }
    maze.push(row)
}

function carve(x,y){

    let dirs=[[0,-2],[0,2],[-2,0],[2,0]]
    dirs.sort(()=>Math.random()-0.5)

    for(let [dx,dy] of dirs){

        let nx=x+dx
        let ny=y+dy

        if(nx>0 && nx<width-1 && ny>0 && ny<height-1 && maze[ny][nx]==="#"){
            maze[ny][nx]="."
            maze[y+dy/2][x+dx/2]="."
            carve(nx,ny)
        }
    }
}

maze[1][1]="."
carve(1,1)

maze[1][1]="S"
maze[height-2][width-2]="X"

player.x=1
player.y=1
}

function draw(){

ctx.clearRect(0,0,canvas.width,canvas.height)

let half = Math.floor(viewTiles/2)

for(let dy=-half; dy<=half; dy++){
for(let dx=-half; dx<=half; dx++){

    let mx = player.x + dx
    let my = player.y + dy

    let screenX = (dx + half) * tileSize
    let screenY = (dy + half) * tileSize

    let dist = Math.sqrt(dx*dx + dy*dy)

    if(dist > visionRadius){
        ctx.fillStyle = "#000"
        ctx.fillRect(screenX, screenY, tileSize, tileSize)
        continue
    }

    if(mx < 0 || mx >= width || my < 0 || my >= height){
        ctx.fillStyle = "#111"
        ctx.fillRect(screenX, screenY, tileSize, tileSize)
        continue
    }

    let tile = maze[my][mx]

    if(tile === "#"){
        ctx.fillStyle = "#222"
    }
    else if(tile === "X"){
        ctx.fillStyle = "gold"
    }
    else{
        ctx.fillStyle = "#444"
    }

    ctx.fillRect(screenX, screenY, tileSize, tileSize)

}
}

let center = Math.floor(viewTiles/2) * tileSize

ctx.fillStyle = "lime"
ctx.beginPath()
ctx.arc(center + tileSize/2, center + tileSize/2, tileSize/3, 0, Math.PI*2)
ctx.fill()

}

function move(dx,dy){

let nx = player.x + dx
let ny = player.y + dy

if(nx>=0 && nx<width && ny>=0 && ny<height && maze[ny][nx] !== "#"){
    player.x = nx
    player.y = ny
}

if(maze[player.y][player.x] === "X"){
    setTimeout(()=>{
        alert("You escaped the labyrinth!")
        startGame()
    },100)
}

draw()
}

document.addEventListener("keydown",(e)=>{

if(e.key==="w"||e.key==="ArrowUp") move(0,-1)
if(e.key==="s"||e.key==="ArrowDown") move(0,1)
if(e.key==="a"||e.key==="ArrowLeft") move(-1,0)
if(e.key==="d"||e.key==="ArrowRight") move(1,0)

})

function startGame(){
generateMaze()
draw()
}

startGame()
