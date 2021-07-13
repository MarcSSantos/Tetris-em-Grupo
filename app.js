document.addEventListener('domContentLoadaded', () => {
    const grid = document.querySelector('.grid')
    let squares = Array.from(document.querySelectorAll('.grid div'))
    const width = 10
    const ScoreDisplay = document.querySelector('#score')
    const StartBin = document.querySelector('#start-button')

    const lTetromino = [
        [1, width + 1, width + 2 + 1, 2],
        [width, width + 1, width + 2, width + 2 + 2],
        [1, width, width + 2 + 1, width + 2]
        [width, width + 2, width + 2 + 1, width + 2 + 2]
    ]

    const tTetromino = [
        [1, width, width + 1, width + 2],
        [1, width + 1, width + 2, width * 2 + 1],
        [width, width + 1, width + 2, width * 2 + 1],
        [1, width, width + 1, width * 2 + 1]
    ]

    const oTetromino = [
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1]
    ]

    const iTetromino = [
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3],
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3]
    ]

    const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]


    let currentPosition = 4
    let current = theTetrominoes[0][0]
});