const cvs = document.getElementById("tetris");
const cvsMini = document.getElementById("bloco");
const ctx = cvs.getContext("2d");
const ctxMini = cvsMini.getContext("2d");
const scoreElement = document.getElementById("score");
const Play = document.querySelector("#play-button");
const Pause = document.querySelector("#pause-button");
let timerId;

const COLUMNS = 10;
const ROWS = 20;
const BLOCO = 30;

const BACKGROUND_COLOR = "#054F77";

const TAM = 30;
const VACANT = BACKGROUND_COLOR; // Cor dos quadradinhos
//-----------------------------------------------------
// Desenho dimensional do quadrado maior
function drawSquare(x,y,color){
    ctx.fillStyle = color;
    ctx.fillRect(x*TAM,y*TAM,TAM,TAM);

    ctx.strokeStyle = BACKGROUND_COLOR;
    ctx.strokeRect(x*TAM,y*TAM,TAM,TAM);

    ctxMini.fillStyle = color;
    ctxMini.fillRect(x*3,y*3,3,3);

    ctxMini.strokeStyle = BACKGROUND_COLOR;
    ctxMini.strokeRect(x*3,y*3,3,3);
    
}

// Cria uma tabela
let board = [];
for( r = 0; r <ROWS; r++){
    board[r] = [];
    for(c = 0; c < COLUMNS; c++){
        board[r][c] = VACANT;
    }
}

// Desenha essa tabela
function drawBoard(){
    for( r = 0; r <ROWS; r++){
        for(c = 0; c < COLUMNS; c++){
            drawSquare(c,r,board[r][c]);
        }
    }
}

drawBoard();

//São as cores de cada bloco(letrinhas)
const PIECES = [
    [Zleft,"#663046"],
    [Zright,"#00FF00"],
    [T,"#0000FF"],
    [CUBE,"#FFC0CB"],
    [Lright,"#FFFF00"],
    [I,"#FF0000"],
    [Lleft,"#FFA500"]
];

// Dá um bloco aleatório para o tabuleiro
function randomPiece(){
    let r = randomN = Math.floor(Math.random() * PIECES.length)
    return new Piece( PIECES[r][0],PIECES[r][1]);
}

let p = randomPiece();

Play.addEventListener('click', () => {
        clearInterval(timerId)
    });
    
Pause.addEventListener('click', () => {
    p = randomPiece()
    timerId = setInterval(drop, 30000)
});
function Piece(tetromino,color){
    this.tetromino = tetromino;
    this.color = color;
    
    this.tetrominoN = 0;
    this.activeTetromino = this.tetromino[this.tetrominoN];

    this.x = 3;
    this.y = -2;
}

// Essa parte preenche os blocos vazios de acordo com a letra
Piece.prototype.fill = function(color){
    for( r = 0; r < this.activeTetromino.length; r++){
        for(c = 0; c < this.activeTetromino.length; c++){

            if( this.activeTetromino[r][c]){
                drawSquare(this.x + c,this.y + r, color);
            }
        }
    }
}

// Cria uma peça na tabela
Piece.prototype.draw = function(){
    let b = this.fill(this.color);
}

// Retira partes do desenho de acordo com o movimento
Piece.prototype.unDraw = function(){
    this.fill(VACANT);
}


// joga as letras para baixo
Piece.prototype.moveDown = function(){
    if(!this.collision(0,1,this.activeTetromino)){
        this.unDraw();
        this.y++;
        this.draw();
    }else{
        // quando a letra chega no 0 do eixo Y, ele é travado e logo é chamada outra letra
        this.lock();
        p = randomPiece();
    }
    
}

// move as letras para direita
Piece.prototype.moveRight = function(){
    if(!this.collision(1,0,this.activeTetromino)){
        this.unDraw();
        this.x++;
        this.draw();
    }
}

// move as letras para o lado
Piece.prototype.moveLeft = function(){
    if(!this.collision(-1,0,this.activeTetromino)){
        this.unDraw();
        this.x--;
        this.draw();
    }
}

// gira as letras
Piece.prototype.rotate = function(){
    let nextPattern = this.tetromino[(this.tetrominoN + 1)%this.tetromino.length];
    let kick = 0;
    
    if(this.collision(0,0,nextPattern)){
        if(this.x > COLUMNS/2){

            kick = -1;
        }else{

            kick = 1;
        }
    }
    
    if(!this.collision(kick,0,nextPattern)){
        this.unDraw();
        this.x += kick;
        this.tetrominoN = (this.tetrominoN + 1)%this.tetromino.length;
        this.activeTetromino = this.tetromino[this.tetrominoN];
        this.draw();
    }
}

let score = 0;
Piece.prototype.lock = function(){
    for( r = 0; r < this.activeTetromino.length; r++){
        for(c = 0; c < this.activeTetromino.length; c++){

            if( !this.activeTetromino[r][c]){
                continue;
            }
            // valida se as letras chegaram muito em cima
            if(this.y + r < 0){
                alert("Game Over");
                gameOver = true;

                break;
            }

            board[this.y+r][this.x+c] = this.color;
        }
    }
    // remove todas as linhas
    for(r = 0; r < ROWS; r++){
        let isRowFull = true;
        for( c = 0; c < COLUMNS; c++){
            isRowFull = isRowFull && (board[r][c] != VACANT);
        }
        if(isRowFull){
            for( y = r; y > 1; y--){
                for( c = 0; c < COLUMNS; c++){
                    board[y][c] = board[y-1][c];
                }
            }

            for( c = 0; c < COLUMNS; c++){
                board[0][c] = VACANT;
            }
            // pontuação
            score += 10;
        }
    }

    drawBoard();
    
    scoreElement.innerHTML = score;
}

Piece.prototype.collision = function(x,y,piece){
    for( r = 0; r < piece.length; r++){
        for(c = 0; c < piece.length; c++){
            if(!piece[r][c]){
                continue;
            }
            // coordenadas atualizadas de acordo com o momento dos blocos
            let newX = this.x + c + x;
            let newY = this.y + r + y;
            
            if(newX < 0 || newX >= COLUMNS || newY >= ROWS){
                return true;
            }

            if(newY < 0){
                continue;
            }

            if( board[newY][newX] != VACANT){
                return true;
            }
        }
    }
    return false;
}

document.addEventListener("keydown",CONTROL);

function CONTROL(event){
    if(event.keyCode == 37){
        p.moveLeft();
        dropStart = Date.now();
    }else if(event.keyCode == 38){
        p.rotate();
        dropStart = Date.now();
    }else if(event.keyCode == 39){
        p.moveRight();
        dropStart = Date.now();
    }else if(event.keyCode == 40){
        p.moveDown();
    }
}

// drop the piece every 1sec

let dropStart = Date.now();
let gameOver = false;
function drop(){
    let now = Date.now();
    let delta = now - dropStart;
    if(delta > 1000){
        p.moveDown();
        dropStart = Date.now();
    }
    if( !gameOver){
        requestAnimationFrame(drop);
    }
}

drop();
