let width = 21
let height = 21
let maze = []
let player = { x: 1, y: 1 }

let viewSize = 9 // must be odd
let vision = 3

function generateMaze() {

    maze = []

    for (let y = 0; y < height; y++) {
        let row = []
        for (let x = 0; x < width; x++) {
            row.push("#")
        }
        maze.push(row)
    }

    function carve(x, y) {

        let dirs = [
            [0, -2],
            [0, 2],
            [-2, 0],
            [2, 0]
        ]

        dirs.sort(() => Math.random() - 0.5)

        for (let [dx, dy] of dirs) {

            let nx = x + dx
            let ny = y + dy

            if (nx > 0 && nx < width - 1 && ny > 0 && ny < height - 1 && maze[ny][nx] === "#") {

                maze[ny][nx] = "."
                maze[y + dy / 2][x + dx / 2] = "."

                carve(nx, ny)
            }
        }
    }

    maze[1][1] = "."
    carve(1, 1)

    maze[1][1] = "S"
    maze[height - 2][width - 2] = "X"

    player.x = 1
    player.y = 1
}

function draw() {

    const grid = document.getElementById("grid")
    grid.innerHTML = ""

    let half = Math.floor(viewSize / 2)

    for (let dy = -half; dy <= half; dy++) {

        let row = ""

        for (let dx = -half; dx <= half; dx++) {

            let x = player.x + dx
            let y = player.y + dy

            if (x < 0 || x >= width || y < 0 || y >= height) {
                row += "⬛ "
                continue
            }

            let dist = Math.abs(dx) + Math.abs(dy)

            if (dist > vision) {
                row += "? "
                continue
            }

            if (dx === 0 && dy === 0) {
                row += "P "
            }
              
            else if (maze[y][x] === "#") {
                row += "⬛ "
            }

            else if (maze[y][x] === "X") {
                row += "🏁 "
            }

            else {
                row += "⬜ "
            }
        }

        grid.innerHTML += row + "<br>"
    }
}

function move(dx, dy) {

    let nx = player.x + dx
    let ny = player.y + dy

    if (nx >= 0 && nx < width && ny >= 0 && ny < height && maze[ny][nx] !== "#") {
        player.x = nx
        player.y = ny
    }

    if (maze[player.y][player.x] === "X") {
        setTimeout(() => {
            alert("You escaped the labyrinth!")
        }, 100)
    }

    draw()
}

document.addEventListener("keydown", function (e) {

    if (e.key === "w" || e.key === "ArrowUp") move(0, -1)
    if (e.key === "s" || e.key === "ArrowDown") move(0, 1)
    if (e.key === "a" || e.key === "ArrowLeft") move(-1, 0)
    if (e.key === "d" || e.key === "ArrowRight") move(1, 0)

})

function startGame() {
    generateMaze()
    draw()
}

startGame()
