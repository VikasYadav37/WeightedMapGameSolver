const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const rows = 20, cols = 20, cellSize = 30;
const grid = [];
const terrainCost = [1, 3, 5]; // grass, forest, mountain
const colors = ["#7cfc00", "#228b22", "#a9a9a9"];
let start = [0, 0], end = [19, 19];

function generateGrid() {
  grid.length = 0;
  for (let y = 0; y < rows; y++) {
    const row = [];
    for (let x = 0; x < cols; x++) {
      const costType = Math.floor(Math.random() * 3);
      row.push({ x, y, cost: terrainCost[costType], color: colors[costType] });
    }
    grid.push(row);
  }
  grid[start[1]][start[0]].color = "blue";
  grid[end[1]][end[0]].color = "red";
}

function drawGrid() {
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const cell = grid[y][x];
      ctx.fillStyle = cell.color;
      ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
      ctx.strokeStyle = "#000";
      ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
    }
  }
}

function getNeighbors(x, y) {
  const deltas = [[1,0], [-1,0], [0,1], [0,-1]];
  return deltas.map(([dx, dy]) => [x+dx, y+dy])
               .filter(([nx, ny]) => nx >= 0 && ny >= 0 && nx < cols && ny < rows);
}

function startDijkstra() {
  const dist = Array.from({ length: rows }, () => Array(cols).fill(Infinity));
  const prev = Array.from({ length: rows }, () => Array(cols).fill(null));
  dist[start[1]][start[0]] = 0;
  const pq = [[0, start[0], start[1]]];

  while (pq.length > 0) {
    pq.sort((a, b) => a[0] - b[0]);
    const [d, x, y] = pq.shift();

    if (x === end[0] && y === end[1]) break;

    for (const [nx, ny] of getNeighbors(x, y)) {
      const cost = grid[ny][nx].cost;
      if (dist[ny][nx] > d + cost) {
        dist[ny][nx] = d + cost;
        prev[ny][nx] = [x, y];
        pq.push([dist[ny][nx], nx, ny]);
      }
    }
  }

  let [cx, cy] = end;
  while (prev[cy][cx]) {
    const [px, py] = prev[cy][cx];
    if (!(px === start[0] && py === start[1])) grid[py][px].color = "yellow";
    cx = px; cy = py;
  }
  drawGrid();
}

function resetMap() {
  generateGrid();
  drawGrid();
}

generateGrid();
drawGrid();