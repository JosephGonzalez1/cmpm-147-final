let width=15
let height=15
let maze=[]
let player={x:0,y:0}

function generateMaze(){

maze=[]

for(let y=0;y<height;y++){

let row=[]

for(let x=0;x<width;x++){

if(Math.random()<0.28){
row.push("#")
}else{
row.push(".")
}

}

maze.push(row)

}

let x=0
let y=0

while(x<width-1||y<height-1){

maze[y][x]="."

if(Math.random()<0.5&&x<width-1){
x++
}else if(y<height-1){
y++
}

}

maze[0][0]="S"
maze[height-1][width-1]="X"

player.x=0
player.y=0

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

if(maze[player.y][player.x]==="X"){

alert("You escaped the labyrinth")
startGame()

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
