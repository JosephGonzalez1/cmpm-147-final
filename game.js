let width = 31
let height = 31
let maze = []
let player = { x:0, y:0, hp:10 }
let revealed = []
let currentFloor = 1
let totalFloors = 5

let tileSize = 20
let viewTiles = 15
let visionRadius = 3

const canvas = document.getElementById("game")
const ctx = canvas.getContext("2d")

function generateMaze(){
    maze=[]
    revealed=[]

    for(let y=0;y<height;y++){
        let row=[]
        let revRow=[]
        for(let x=0;x<width;x++){
            if(Math.random()<0.28) row.push("#")
            else row.push(".")
            revRow.push(false)
        }
        maze.push(row)
        revealed.push(revRow)
    }

    let roomCount=5
    for(let r=0;r<roomCount;r++){
        let rw=Math.floor(Math.random()*3)+3
        let rh=Math.floor(Math.random()*3)+3
        let rx=Math.floor(Math.random()*(width-rw-1))+1
        let ry=Math.floor(Math.random()*(height-rh-1))+1

        for(let y=ry;y<ry+rh;y++){
            for(let x=rx;x<rx+rw;x++){
                maze[y][x]="."
            }
        }
    }

    let x=0
    let y=0
    while(x<width-1 || y<height-1){
        maze[y][x]="."
        if(Math.random()<0.5 && x<width-1) x++
        else if(y<height-1) y++
    }

    maze[0][0]="S"
    player.x=0
    player.y=0

    revealAOE(player.x, player.y)

    // Random exit spawn
    let emptyTiles=[]
    for(let y=0;y<height;y++){
        for(let x=0;x<width;x++){
            if(maze[y][x]===".") emptyTiles.push({x,y})
        }
    }
    let exitTile = emptyTiles[Math.floor(Math.random()*emptyTiles.length)]
    maze[exitTile.y][exitTile.x] = "X"
}

function revealAOE(px,py){
    for(let dy=-visionRadius; dy<=visionRadius; dy++){
        for(let dx=-visionRadius; dx<=visionRadius; dx++){
            let nx = px+dx
            let ny = py+dy
            if(nx>=0 && nx<width && ny>=0 && ny<height){
                revealed[ny][nx]=true
            }
        }
    }
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

            if(mx<0 || mx>=width || my<0 || my>=height){
                ctx.fillStyle="#000"
                ctx.fillRect(screenX, screenY, tileSize, tileSize)
                continue
            }

            if(!revealed[my][mx]){
                ctx.fillStyle="#000"
                ctx.fillRect(screenX, screenY, tileSize, tileSize)
                continue
            }

            if(player.x===mx && player.y===my){
                ctx.fillStyle="green"
            }else if(maze[my][mx]==="#"){
                ctx.fillStyle="#444"
            }else if(maze[my][mx]==="S"){
                ctx.fillStyle="blue"
            }else if(maze[my][mx]==="X"){
                ctx.fillStyle="red"
            }else{
                ctx.fillStyle="#888"
            }

            ctx.fillRect(screenX, screenY, tileSize, tileSize)
        }
    }
    
    ctx.fillStyle="white"
    ctx.font="16px monospace"
    ctx.fillText(`Floor: ${currentFloor}/${totalFloors}  HP: ${player.hp}`,10,20)
}

function move(dx,dy){
    let nx = player.x + dx
    let ny = player.y + dy
    if(nx>=0 && nx<width && ny>=0 && ny<height && maze[ny][nx]!=="#"){
        player.x=nx
        player.y=ny
        revealAOE(player.x, player.y)
    }
    if(maze[player.y][player.x]==="X"){
        if(currentFloor<totalFloors){
            currentFloor++
            generateMaze()
        } else {
            setTimeout(()=>{alert("You escaped all floors!"); startGame()},100)
        }
    }
    draw()
}

document.addEventListener("keydown", e=>{
    if(e.key==="w"||e.key==="ArrowUp") move(0,-1)
    if(e.key==="s"||e.key==="ArrowDown") move(0,1)
    if(e.key==="a"||e.key==="ArrowLeft") move(-1,0)
    if(e.key==="d"||e.key==="ArrowRight") move(1,0)
})

function startGame(){
    currentFloor=1
    player.hp=10
    generateMaze()
    draw()
}

startGame()
