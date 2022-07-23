// -----------------VARS--------------------

// START SCREEN
const startScreen = document.querySelector('.start-screen');
const iconPickerBtns = [...document.querySelectorAll('.icon-picker-btn')];
const iconSVGPaths = [...document.querySelectorAll('.icon-svg-path')];
const newGameBtns = [...document.querySelectorAll('.new-game-btn')];
const newGameVsCpuBtn = document.querySelector('.new-game-vs-cpu-btn');
const newGameVsPlayerBtn = document.querySelector('.new-game-vs-player-btn');


// GAMEBOARD 
const restartBtn = document.querySelector('.restart-btn');
const squares = [...document.querySelectorAll('.square')];
const squareSVGs = [...document.querySelectorAll('.square-svg')];
const gameBoard = document.querySelector('.game-board');
const gameOverModal = document.querySelector('.game-over-modal');
const quitBtn = document.querySelector('.quit-btn');
const scoreBoardXIcon = document.querySelector('.scoreboard-x-icon');
const scoreBoardOIcon = document.querySelector('.scoreboard-o-icon');
const activeIndicatorSVGs = [...document.querySelectorAll('.indicator-svg')];
const xScoreText = document.querySelector('.x-score');
const oScoreText = document.querySelector('.o-score');
const tieScore = document.querySelector('.tie-score');

// RESET MODAL
const resetGameModal = document.querySelector('.reset-game-modal');
const cancelResetBtn = document.querySelector('.reset-btn-cancel');
const confirmResetBtn = document.querySelector('.reset-btn-confirm');

// GAME OVER MODAL 
const darkOverlay = document.querySelector('.dark-overlay');
const gameOverSVGs = [...document.querySelectorAll('.game-over-winner-msg-svg')];
const nextRoundBtn = document.querySelector('.next-round-btn');
const endOfRoundMsg = document.querySelector('.end-of-round-msg');
const gameOverMsg = document.querySelector('.game-over-msg');

// SCORES
const scoreCard = {
    'row-1': [],
    'row-2': [],
    'row-3': [],
    'col-1': [],
    'col-2': [],
    'col-3': [],
    'across-1': [],
    'across-2': []
}

const totalScores = {
    x: 0,
    o: 0,
    tie: 0
}

// RE-ASSIGNED 
let activePlayer = 'x';
let playerOneIcon, playerTwoIcon;
let vsCPU = false;


// -----------------FUNCTIONS--------------------

const identicalArrayElements = function(array) {
    let previousEl = array[0];
    for(el of array) {
        if(el !== previousEl) {
            return false;
        }
        previousEl = el;
    }
    return true;
} 

const colorWinningRow = function() {
    for (const [row, array] of Object.entries(scoreCard)) {
        if(identicalArrayElements(array) && array.length === 3) {
            squares.forEach(square => {
                if(row in square.dataset) {
                    square.style.background = '#31C3BD';
                    // const svgs = [...square.children];
                    // svgs.forEach(svg => {
                    //     if(!svg.classList.contains('hidden')) {
                    //         svg.path.style.fill = 'black';
                    //     }
                    // });
                }
            });
        }
      }
}

const configScoreboardText = function() {
    const player2 = vsCPU ? '(CPU)' : '(P2)'
    // SET SCOREBOARD ICONS
    if(playerOneIcon === 'x') {
        scoreBoardXIcon.textContent += " (P1)";
        scoreBoardOIcon.textContent += ` ${player2}`;
    } else {
        scoreBoardXIcon.textContent += ` ${player2}`;
        scoreBoardOIcon.textContent += " (P1)";
    }
}

const resetScoreBoardText = () => {
    scoreBoardXIcon.textContent = "X"
    scoreBoardOIcon.textContent = "O"
}

const updateScoreCard = function(squareData) {
    for(const property in squareData) {
        for(const position in scoreCard) {
            if(position === property) {
                scoreCard[position] = [...scoreCard[position], activePlayer]
            }
        }
    }
}

const updateTotalScores = function(winner) {
    if(winner === 'x') {
        totalScores.x += 1;
    } else if(winner === 'o') {
        totalScores.o += 1;
    } else if(winner === 'tie') {
        totalScores.tie += 1;
    }
}

const resetActiveIndicator = () => {
    activeIndicatorSVGs[0].classList.remove('hidden');
    activeIndicatorSVGs[1].classList.add('hidden');
}   

const resetBoard = () => {
    squareSVGs.forEach(svg => {
        svg.classList.add('hidden');
    });
    squares.forEach(square => {
        square.removeAttribute('disabled');
    });
}

const resetScoreCard = () => {
    for(const position in scoreCard) {
        scoreCard[position] = [];
    }
}

const resetTotalScores = () => {
    for(player in totalScores) {
        totalScores[player] = 0;
    }
}

const updateScoreBoard = function() {
    xScoreText.textContent = totalScores.x;
    oScoreText.textContent = totalScores.o;
    tieScore.textContent = totalScores.tie;
}

const checkForTie = function() {
    for(const square of squares) {
        if(!square.hasAttribute('disabled')) {
            return false;
        }
    }
    return true;
}

const winningPlayer = function() {
    let count = 0;
    const scoreCardValues = Object.values(scoreCard);
    for(const scoreArray of scoreCardValues) {
        for(const score of scoreArray) {
            if(score === activePlayer) {
                count++;
            }
            if(count === 3) {
                squares.forEach(square => square.setAttribute('disabled', 'disabled'));

                // RETURNING WINNER
                return activePlayer;
            }
        }
        count = 0;
    }
    return false;
}

const checkForWinner = function() {
    const player = winningPlayer();
    if(player) {
        return player;
    }
    if(checkForTie()) {
        return 'tie';
    }
    return false;
}

const openResetGameModal = function() {
    darkOverlay.classList.remove('hidden');
    resetGameModal.classList.remove('hidden');
}

const closeResetGameModal = () => {
    resetGameModal.classList.add('hidden');
    darkOverlay.classList.add('hidden');
}

const closeGameOverModal = () => {
    darkOverlay.classList.add('hidden');
    gameOverModal.classList.add('hidden');
    gameOverSVGs.forEach(svg => svg.classList.add('hidden'));
    endOfRoundMsg.textContent = 'TAKES THE ROUND';
}

const backToStartScreen = () => {
    startScreen.classList.remove('hidden');
    gameBoard.classList.add('hidden');
}

const configPlayerMsg = function(winner) {
    let msg = '';
    if(winner === playerOneIcon && vsCPU) {
        msg = 'YOU WON';
    } else if (winner === 'tie' && vsCPU) {
        msg = '';
    } else if (winner !== playerOneIcon && vsCPU) {
        msg = 'OH NO, YOU LOST...';
    } else if(winner === playerOneIcon) {
        msg = 'PLAYER 1 WINS!';
    } else if(winner === playerTwoIcon) {
        msg = 'PLAYER 2 WINS!';
    } else {
        msg = '';
    }
    gameOverMsg.textContent = msg;
}

const displayGameOverMsg = function(winner) {
    darkOverlay.classList.remove('hidden');
    gameOverModal.classList.remove('hidden');
    if(winner === 'x') {
        gameOverSVGs[1].classList.remove('hidden');
    } else if(winner === 'tie') {
        gameOverSVGs[0].classList.add('hidden');
        gameOverSVGs[1].classList.add('hidden');
        endOfRoundMsg.textContent = 'ROUND TIED';
    } else {
        gameOverSVGs[0].classList.remove('hidden');
    }
    configPlayerMsg(winner);
}

const resetIconPicker = () => {
    iconPickerBtns.forEach(btn => {
        if(btn.classList.contains('x-icon-picker-btn')) {
            btn.classList.remove('selected-icon-btn');
            btn.classList.add('unselected-icon-btn');
        } else {
            btn.classList.remove('unselected-icon-btn');
            btn.classList.add('selected-icon-btn'); 
        }
    });
    iconSVGPaths.forEach(path => {
        if(path.classList.contains('x-icon-picker-svg')) {
            path.classList.remove('selected-icon');
            path.classList.add('unselected-icon');
        } else {
            path.classList.remove('unselected-icon');
            path.classList.add('selected-icon'); 
        }
    });
}

const startGame = () => {
    startScreen.classList.add('hidden');
    gameBoard.classList.remove('hidden');
}

// THE ICONS MAY BE USED WHEN THE GAME IS OVER TO FIGURE OUT IF PLAYER 1 OR PLAYER 2 HAS WON
const setPlayerIcons = () => {
    playerOneIcon = (iconPickerBtns[0].classList.contains('selected-icon-btn')) ? 'x' : 'o';
    playerTwoIcon = (playerOneIcon === 'x') ? 'o' : 'x';
}

const toggleActiveIcon = function() {
    activeIndicatorSVGs.forEach(svg => svg.classList.toggle('hidden'));
}

const togglePlayer = () => {
    activePlayer = (activePlayer === 'o') ? 'x' : 'o';
} 

const roundEndOrToggle = function() {
    const winner = checkForWinner();
    if(winner) {
        colorWinningRow();
        setTimeout(() => {
            displayGameOverMsg(winner);
            updateTotalScores(winner);
        }, 500);
        
    } else {
        togglePlayer();
        toggleActiveIcon();
    }
}


const playerMove = function(event) {
    const squareData = event.currentTarget.dataset;
    updateScoreCard(squareData);
    roundEndOrToggle();
    if(vsCPU) {
        cpuGo();
    }
}

const cpuGo = function() {
    // DISABLE POINTER EVENTS SO USER CANNOT INTERFERE
    squares.forEach(square => square.style.pointerEvents = 'none');

    // FILTER AVAILABLE SQUARES AND CHOOSE ONE RANDOMLY
    const availableSquares = squares.filter(square => !square.hasAttribute('disabled'));
    const chosenSquare = availableSquares[Math.floor(Math.random() * availableSquares.length)];
    setTimeout(() => {
        if(chosenSquare) {
        const svgs = [...chosenSquare.children];
        svgs.forEach(svg => {
            if(svg.classList.contains(`square-svg-${activePlayer}`)) {
                svg.classList.remove('hidden');
            }
        });
        chosenSquare.setAttribute('disabled', 'disabled');
        updateScoreCard(chosenSquare.dataset);
        roundEndOrToggle();
    }
    // RE-ENABLE POINTER EVENTS FOR USER
    squares.forEach(square => square.style.pointerEvents = 'auto');
    }, 500);
}

// -----------------EVENT LISTENERS--------------------

// CONFIG BACKGROUND COLOR OF SELECTED/UNSELECTED ICONS  
iconPickerBtns.forEach(btn => {
    btn.addEventListener('click', (event) => {
        if(!event.currentTarget.classList.contains('selected-icon-btn')) {
            iconPickerBtns.forEach(btn => {
                btn.classList.toggle('selected-icon-btn');
                btn.classList.toggle('unselected-icon-btn');
            });
            iconSVGPaths.forEach(path => {
                path.classList.toggle('selected-icon');
                path.classList.toggle('unselected-icon');
            });
        }
    });
});

newGameVsCpuBtn.addEventListener('click', event => {
    vsCPU = true;
    setPlayerIcons();
    if(playerOneIcon === 'o') {
        cpuGo();
    }
});

newGameVsPlayerBtn.addEventListener('click', event => {
    vsCPU = false;
    setPlayerIcons();
});

newGameBtns.forEach(btn => {
    btn.addEventListener('click', event => {
        activePlayer = 'x';
        // HIDE/UNHIDE START SCREEN/GAMEBOARD
        startGame();
        resetScoreBoardText();
        configScoreboardText();
    });
});


// ADD ACTIVE BACKGROUND COLOR TO GAMEBOARD RESTART BTN ON HOVER
restartBtn.addEventListener('mouseover', event => {
    event.currentTarget.style.background = '#DBE8ED';
});
restartBtn.addEventListener('mouseout', event => {
    event.currentTarget.style.background = '#A8BFC9';
});

// ACTIVE STATES FOR GAMEBOARD SQUARES
squares.forEach(square => {
    square.addEventListener('mouseover', event => {
        const target = event.currentTarget;
        const svgs = [...target.children];
        svgs.forEach(svg => {
            if(svg.classList.contains(`svg-outline-active-${activePlayer}`)) {
                svg.classList.remove('hidden');
            }
        });
    });
    square.addEventListener('mouseout', event => {
        const target = event.currentTarget;
        const svgs = [...target.children];
        svgs.forEach(svg => {
            if(svg.classList.contains(`svg-outline-active-${activePlayer}`)) {
                svg.classList.add('hidden');
            }
        });
    });
});


// PLACING ICONS ON GAMEBOARD SQUARES
squares.forEach(square => {
    square.addEventListener('click', event => {
        const target = event.currentTarget;
        const icons = [...target.children];
        if(activePlayer === 'o') {
            icons[0].classList.remove('hidden');
        } else {
            icons[1].classList.remove('hidden');
        }
        // HIDE SVG OUTLINES
        icons[2].classList.add('hidden'); 
        icons[3].classList.add('hidden'); 
        // DISABLE BTN
        target.setAttribute('disabled', 'disabled');
    });
});

quitBtn.addEventListener('click', event => {
    closeGameOverModal();
    backToStartScreen();
    resetBoard();
    resetScoreCard();
    resetTotalScores();
    updateScoreBoard();
    resetIconPicker();
    resetActiveIndicator();
});

restartBtn.addEventListener('click', openResetGameModal);

squares.forEach(square => {
    square.addEventListener('click', playerMove);
});

nextRoundBtn.addEventListener('click', event => {
    closeGameOverModal();
    resetActiveIndicator();
    resetBoard();
    resetScoreCard();
    updateScoreBoard();
    configPlayerMsg();
    activePlayer = 'x';
    if(vsCPU && playerOneIcon === 'o') {
        cpuGo();
    }
});

cancelResetBtn.addEventListener('click', closeResetGameModal);

confirmResetBtn.addEventListener('click', event => {
    backToStartScreen();
    closeResetGameModal();
    // THESE 3 FUNCTION MIGHT MAKE THEIR OWN fullBoardReset function
    resetActiveIndicator();
    resetBoard();
    resetScoreCard();
    resetTotalScores();
    updateScoreBoard();
    resetScoreBoardText();
    resetIconPicker();
});

// const testSVG = document.querySelector('.svg-test-square');
// testSVG.firstElementChild.style.fill = 'black';

// testSVG.classList









