var canvas = document.getElementById('game');
var scoreText = document.getElementById("score");
var context = canvas.getContext('2d');

var grid = 16;
var count = 0;

var snake = {
  x: 160,
  y: 160,

  // скорость движения змеи. каждый кадр перемещает сетку на одну длину в направлении x или y
  dx: grid,
  dy: 0,

  // следите за всеми сетками, которые занимает тело змеи
  cells: [],

  // длина змеи. увеличивается, когда ешь яблоко
  maxCells: 4
};
var apple = {
  x: 320,
  y: 320
};

// получите случайные целые числа в определенном диапазоне
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// игровой цикл
function loop() {
  requestAnimationFrame(loop);
  scoreText.textContent = "Очки: " + (snake.cells.length-4);
  
  if (++count < 10) {
    return;
  }

  count = 0;
  context.clearRect(0, 0, canvas.width, canvas.height);

  // перемещайте змею с учетом ее скорости
  snake.x += snake.dx;
  snake.y += snake.dy;

  // расположите змейку по горизонтали на краю экрана
  if (snake.x < 0) {
    snake.x = canvas.width - grid;
  }
  else if (snake.x >= canvas.width) {
    snake.x = 0;
  }

  // расположите змейку по вертикали на краю экрана
  if (snake.y < 0) {
    snake.y = canvas.height - grid;
  }
  else if (snake.y >= canvas.height) {
    snake.y = 0;
  }

  // следите за тем, где была змея. в начале массива всегда находится голова
  snake.cells.unshift({x: snake.x, y: snake.y});

  // удаляем ячейки по мере удаления от них
  if (snake.cells.length > snake.maxCells) {
    snake.cells.pop();
  }

  // нарисуй яблоко
  context.fillStyle = 'red';
  context.fillRect(apple.x, apple.y, grid-1, grid-1);
  
  // рисуйте змейку по одной клетке за раз
  context.fillStyle = 'green';
  snake.cells.forEach(function(cell, index) {
 
    // рисунок на 1 пиксель меньше сетки создает эффект сетки в теле змеи, чтобы вы могли видеть, какой она длины
    context.fillRect(cell.x, cell.y, grid-1, grid-1);

    // змея съела яблоко
    if (cell.x === apple.x && cell.y === apple.y) {
      snake.maxCells++;

      // размер холста составляет 400х400, что соответствует сетке 25х25
      apple.x = getRandomInt(0, 25) * grid;
      apple.y = getRandomInt(0, 25) * grid;
    }

    // проверьте соответствие со всеми ячейками после этой (измененная пузырьковая сортировка)
    for (var i = index + 1; i < snake.cells.length; i++) {
   
      // змея занимает столько же места, сколько и часть тела. перезагрузить игру
      if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
        snake.x = 160;
        snake.y = 160;
        snake.cells = [];
        snake.maxCells = 4;
        snake.dx = grid;
        snake.dy = 0;

        apple.x = getRandomInt(0, 25) * grid;
        apple.y = getRandomInt(0, 25) * grid;
      }
    }
  });
}

// прослушивайте события на клавиатуре, чтобы двигать змейку
document.addEventListener('keydown', function(e) {
  // не позволяйте змее возвращаться назад, проверяя, что она
  // уже не движется по той же оси (нажатие влево во время движения
  // влево ничего не даст, а нажатие вправо во время движения влево
  // не должно привести к столкновению с собственным телом).

  // left key
  if (e.which === 37 && snake.dx === 0) {
    snake.dx = -grid;
    snake.dy = 0;
  }
  // up key
  else if (e.which === 38 && snake.dy === 0) {
    snake.dy = -grid;
    snake.dx = 0;
  }
  // right key
  else if (e.which === 39 && snake.dx === 0) {
    snake.dx = grid;
    snake.dy = 0;
  }
  // down key
  else if (e.which === 40 && snake.dy === 0) {
    snake.dy = grid;
    snake.dx = 0;
  }
});

// start game
requestAnimationFrame(loop);