let width=10
let height=10
let maze=[]
let player={x:0,y:0}
let hasKey=false

function generateMaze(){

maze=[]

for(let y=0;y<height;y++){

let row=[]

for(let x=0;x<width;x++){

if(Math.random()<0.25){
row.push("#")
}else{
row.push(".")
}

}

maze.push(row)

}

maze[0][0]="S"
maze[height-1][width-1]="B"

placeKey()
placeLoot()

player.x=0
player.y=0
hasKey=false

}

function placeKey(){

for(let i=0;i<100;i++){

let x=Math.floor(Math.random()*width)
let y=Math.floor(Math.random()*height)

if(maze[y][x]==="."){
maze[y][x]="K"
break
}

}

}

function placeLoot(){

for(let i=0;i<4;i++){

let x=Math.floor(Math.random()*width)
let y=Math.floor(Math.random()*height)

if(maze[y][x]==="."){
maze[y][x]="T"
}

}

}

function draw(){

const grid=document.getElementById("grid")
grid.innerHTML=""

for(let y=0;y<height;y++){

let row=""

for(let x=0;x<width;x++){

if(player.x===x&&player.y===y){
row+="P "
}else{
row+=maze[y][x]+" "
}

}

grid.innerHTML+=row+"<br>"

}

}

function move(dx,dy){

let nx=player.x+dx
let ny=player.y+dy

if(nx>=0&&nx<width&&ny>=0&&ny<height&&maze[ny][nx]!=="#"){

player.x=nx
player.y=ny

}

let tile=maze[player.y][player.x]

if(tile==="K"){
hasKey=true
maze[player.y][player.x]="."
}

if(tile==="T"){
maze[player.y][player.x]="."
}

if(tile==="B"){

if(hasKey){
alert("You escaped the labyrinth")
startGame()
}else{
alert("Find the key first")
}

}

draw()

}

document.addEventListener("keydown",function(e){

if(e.key==="w"||e.key==="ArrowUp")move(0,-1)
if(e.key==="s"||e.key==="ArrowDown")move(0,1)
if(e.key==="a"||e.key==="ArrowLeft")move(-1,0)
if(e.key==="d"||e.key==="ArrowRight")move(1,0)

})

function startGame(){

generateMaze()
draw()

}

startGame()
