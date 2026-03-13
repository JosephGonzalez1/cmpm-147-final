let width=15
let height=15
let maze=[]
let player={x:0,y:0}
let hasKey=false

function generateMaze(){

maze=[]

for(let y=0;y<height;y++){
let row=[]
for(let x=0;x<width;x++){
row.push("#")
}
maze.push(row)
}

let stack=[[0,0]]
maze[0][0]="."

while(stack.length>0){

let current=stack[stack.length-1]
let x=current[0]
let y=current[1]

let dirs=[
[x+2,y],
[x-2,y],
[x,y+2],
[x,y-2]
]

let neighbors=[]

for(let d of dirs){
let nx=d[0]
let ny=d[1]

if(nx>0&&ny>0&&nx<width-1&&ny<height-1&&maze[ny][nx]==="#"){
neighbors.push([nx,ny])
}
}

if(neighbors.length===0){
stack.pop()
}else{

let next=neighbors[Math.floor(Math.random()*neighbors.length)]

let mx=(x+next[0])/2
let my=(y+next[1])/2

maze[my][mx]="."
maze[next[1]][next[0]]="."

stack.push(next)

}

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

while(true){

let x=Math.floor(Math.random()*width)
let y=Math.floor(Math.random()*height)

if(maze[y][x]==="."){
maze[y][x]="K"
break
}

}

}

function placeLoot(){

for(let i=0;i<5;i++){

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
alert("Boss defeated and labyrinth escaped")
startGame()
}else{
alert("Boss door locked. Find the key")
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
