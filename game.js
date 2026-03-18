let width = 31
let height = 31
let maze = []
let player = { x:0, y:0, hp:10 }
let revealed = []
let currentFloor = 1
let totalFloors = 5

let enemies = []
let enemyCount = 5
let loot = []
let lootCount = 3

let tileSize = 20
let viewTiles = 15
let visionRadius = 3

const canvas = document.getElementById("game")
const ctx = canvas.getContext("2d")

function generateMaze(){
    maze=[]
    revealed=[]
    enemies=[]
    loot=[]

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

    let emptyTiles=[]
    for(let y=0;y<height;y++){
        for(let x=0;x<width;x++){
            if(maze[y][x]===".") emptyTiles.push({x,y})
        }
    }

    // Place exit
    let exitTile = emptyTiles.splice(Math.floor(Math.random()*emptyTiles.length),1)[0]
    maze[exitTile.y][exitTile.x] = "X"

    // Room-based enemy spawn
    let roomTiles = []
    for(let y=1;y<height-1;y++){
        for(let x=1;x<width-1;x++){
            if(maze[y][x]==="." && !(x===0 && y===0) &&
               maze[y-1][x]==="." && maze[y+1][x]==="." &&
               maze[y][x-1]==="." && maze[y][x+1]==="."){
                roomTiles.push({x,y})
            }
        }
    }
    for(let i=0;i<enemyCount;i++){
        if(roomTiles.length===0) break
        let idx = Math.floor(Math.random()*roomTiles.length)
        let spawnTile = roomTiles.splice(idx,1)[0]
        enemies.push({x:spawnTile.x, y:spawnTile.y, hp:3})
    }

    // Place loot
    for(let i=0;i<lootCount;i++){
        if(emptyTiles.length===0) break
        let lootTile = emptyTiles.splice(Math.floor(Math.random()*emptyTiles.length),1)[0]
        loot.push({x:lootTile.x, y:lootTile.y, type:"potion", value:5})
    }
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

            let enemyHere = enemies.find(e=>e.x===mx && e.y===my)
            let lootHere = loot.find(l=>l.x===mx && l.y===my)

            if(player.x===mx && player.y===my){
                ctx.fillStyle="green"
            }else if(enemyHere){
                ctx.fillStyle="orange"
            }else if(lootHere){
                ctx.fillStyle="yellow"
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

        // Pick up loot
        let lootIndex = loot.findIndex(l=>l.x===player.x && l.y===player.y)
        if(lootIndex>=0){
            let item = loot.splice(lootIndex,1)[0]
            if(item.type==="potion") player.hp += item.value
        }

        // Player attacks enemy by moving into them
        let enemyIndex = enemies.findIndex(e=>e.x===player.x && e.y===player.y)
        if(enemyIndex>=0){
            player.hp -=1
            enemies[enemyIndex].hp -=1
            if(enemies[enemyIndex].hp<=0) enemies.splice(enemyIndex,1)
        }

        moveEnemies()
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

function moveEnemies(){
    for(let e of enemies){
        let dx = [0,1,0,-1][Math.floor(Math.random()*4)]
        let dy = [1,0,-1,0][Math.floor(Math.random()*4)]
        let nx = e.x + dx
        let ny = e.y + dy
        if(nx>=0 && nx<width && ny>=0 && ny<height && maze[ny][nx]==="." && !(nx===player.x && ny===player.y)){
            e.x=nx
            e.y=ny
        }
        if(e.x===player.x && e.y===player.y){
            player.hp -=1
        }
    }
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
