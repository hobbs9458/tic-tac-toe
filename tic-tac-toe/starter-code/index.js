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
const middleSquare = document.querySelector('.middle-square');

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

// SET DIFFICULTY MODAL
const setDifficultyModal = document.querySelector('.set-difficulty-modal');
const difficultyBtns = [...document.querySelectorAll('.set-difficulty-btn')];
const easyModeBtn = document.querySelector('.set-difficulty-btn-easy');
const hardModeBtn = document.querySelector('.set-difficulty-btn-hard');


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

// RE-ASSIGNED / "STATE VARS"
let activePlayer = 'x';
let playerOneIcon, playerTwoIcon;
let vsCPU = false;
let difficultyLevel;
let isMobile = window.matchMedia("(pointer:coarse)").matches;


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

const colorWinningRow = function(winnerIcon) {
    for (const [scoreCardPosition, scoreCardArray] of Object.entries(scoreCard)) {
        if(identicalArrayElements(scoreCardArray) && scoreCardArray.length === 3) {
            squares.forEach(square => {
                if(scoreCardPosition in square.dataset) {
                    square.style.background = (activePlayer === 'x') ? '#31C3BD' : '#F2B137';
                    const iconSvgs = [...square.children];
                    iconSvgs.forEach(icon => {
                        if(icon.classList.contains(`square-svg-${winnerIcon}-winner`)) {
                            icon.classList.remove('hidden');
                        } else {
                            icon.classList.add('hidden');
                        }
                    });
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
        square.style.background = '#1F3641';
        square.classList.remove('user-claimed');
        square.classList.remove('cpu-claimed');
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
    for(const scoreCardArray of Object.values(scoreCard)) {
        if(identicalArrayElements(scoreCardArray) && scoreCardArray.length === 3) {
            squares.forEach(square => square.setAttribute('disabled', 'disabled'));
            return activePlayer;
        }
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
        colorWinningRow(winner);
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
        // ADD CLASS TO SHOW WHICH PLAYER HAS CLAIMED THE POSITION;
        // THIS IS RELEVANT TO CPU'S MOVE IF IT GOES 3RD
        event.currentTarget.classList.add(`user-claimed`)
        cpuGo();
    }
}

const setDifficulty = function() {
    // OPEN MODAL AND LET USER SELECT STATE
    darkOverlay.classList.remove('hidden');
    setDifficultyModal.classList.remove('hidden');
}

// CPU STRATEGIES
const targetRandomCorner = function(availableSquares) {
    const cornerSquares = availableSquares.filter(square => {
        const squareData = {...square.dataset};
        return ('corner' in squareData);
    });
    return cornerSquares[Math.floor(Math.random() * cornerSquares.length)]
}

const userInCorner = function() {
    const userPosition = squares.filter(square => square.classList.contains('user-claimed'));
    return ('corner' in {...userPosition[0].dataset})
}

const cpuGoesSecondDefense = function(userPosition, availableSquares) {
    if(userPosition === 'corner') {
        return middleSquare;
    } else {
        return targetRandomCorner(availableSquares);
    }
}

const checkForWinOpportunity = function() {
    for (const [scoreCardPosition, scoreCardArray] of Object.entries(scoreCard)) {
        if(scoreCardArray[0] === activePlayer && 
            identicalArrayElements(scoreCardArray) && 
            scoreCardArray.length === 2) {
                return scoreCardPosition;
        }
    }
}

const checkForDefense = function() {
    for (const [scoreCardPosition, scoreCardArray] of Object.entries(scoreCard)) {
        if(scoreCardArray[0] !== activePlayer && 
            identicalArrayElements(scoreCardArray) && 
            scoreCardArray.length === 2) {
                return scoreCardPosition;
        }
    }
}

const findTargetPosition = function(availableSquares, targetSquare) {
    for(const square of availableSquares) {
        if(targetSquare in {...square.dataset}) {
            return square;
        }
    }
}

const targetOppositeCorner = function(availableSquares) {
    const availableCorners = availableSquares.filter(square => {
        const squareData = {...square.dataset};
        return ('corner' in squareData) && (!square.classList.contains('cpu-claimed'));
    });
    const cpuCorner = squares.filter(square => {
        return square.classList.contains('cpu-claimed');
    });
    if('corner-1' in {...cpuCorner[0].dataset}) {
        return availableCorners.filter(corner => ('corner-4' in {...corner.dataset}))[0] ?? false;
    } 
    if('corner-4' in {...cpuCorner[0].dataset}) {
        return availableCorners.filter(corner => ('corner-1' in {...corner.dataset}))[0] ?? false;
    } 
    if('corner-2' in {...cpuCorner[0].dataset}) {
        return availableCorners.filter(corner => ('corner-3' in {...corner.dataset}))[0] ?? false;
    } 
    if('corner-3' in {...cpuCorner[0].dataset}) {
        return availableCorners.filter(corner => ('corner-2' in {...corner.dataset}))[0] ?? false;
    } 
}

const targetAdjacentCorner = function(availableSquares) {
    if(targetOppositeCorner(availableSquares)) {
        const oppositeCorner = targetOppositeCorner(availableSquares);
        oppositeCorner.classList.add('danger');
        const corners = availableSquares.filter(square => 'corner' in {...square.dataset});
        const adjacentCorners = corners.filter(corner => !(corner.classList.contains('danger')));
        oppositeCorner.classList.remove('danger');
        return adjacentCorners[Math.floor(Math.random() * adjacentCorners.length)];
    }
    return false;
}

const placeCPUIconOnTarget = function(targetSquare) {
    if(targetSquare) {
        const svgs = [...targetSquare.children];
        svgs.forEach(svg => {
            if(svg.classList.contains(`square-svg-${activePlayer}`)) {
                svg.classList.remove('hidden');
            }
        });
        targetSquare.setAttribute('disabled', 'disabled');
        updateScoreCard(targetSquare.dataset);
        targetSquare.classList.add('cpu-claimed');
        roundEndOrToggle();
    } 
}

const findStrategicTarget = function(availableSquares) {
    let targetSquare;
    if(checkForWinOpportunity()) {
        targetSquare = findTargetPosition(availableSquares, checkForWinOpportunity());
    } else if(checkForDefense()) {
        targetSquare = findTargetPosition(availableSquares, checkForDefense());
    } else if(availableSquares.length === 9) { // IF CPU GOES FIRST IT WILL SELECT A RANDOM CORNER
        targetSquare = targetRandomCorner(availableSquares);
    } else if(availableSquares.length === 8) {// IF CPU GOES SECOND; TARGET MIDDLE IF USER SELECTS CORNER
        if(userInCorner()) {
            targetSquare = middleSquare;
        } else {
            targetSquare = targetRandomCorner(availableSquares);
        }
    } else if(availableSquares.length === 7) { // IF USER IN MIDDLE CPU TARGETS OPPOSITE CORNER, ELSE TARGET RANDOM CORNER
        const oppositeCorner = targetOppositeCorner(availableSquares);
        if(middleSquare.classList.contains('user-claimed') && oppositeCorner) {
            targetSquare = oppositeCorner;
        } else {
            if(oppositeCorner){
                targetSquare = targetAdjacentCorner(availableSquares); 
            } else {
                targetSquare = targetRandomCorner(availableSquares);
            }
        }
    } else if(availableSquares.length === 6 && (middleSquare.classList.contains('cpu-claimed'))) {
        const nonCornerSquares = availableSquares.filter(square => !('corner' in {...square.dataset}));
        targetSquare = nonCornerSquares[Math.floor(Math.random() * nonCornerSquares.length)];
    } else {
        if(targetRandomCorner(availableSquares)) {
            targetSquare = targetRandomCorner(availableSquares);
        } else {
            targetSquare = availableSquares[Math.floor(Math.random() * availableSquares.length)];
        }
    }
    return targetSquare;
}

const cpuGo = function() {
    let targetSquare;
    // DISABLE POINTER EVENTS SO USER CANNOT INTERFERE
    squares.forEach(square => square.style.pointerEvents = 'none');
    // FIND AVAILABLE SQUARES AND TARGET ONE
    const availableSquares = squares.filter(square => !square.hasAttribute('disabled'));
    if(difficultyLevel === 'easy') {
        targetSquare = availableSquares[Math.floor(Math.random() * availableSquares.length)];
    } else if(difficultyLevel === 'hard') {
        targetSquare = findStrategicTarget(availableSquares);
    }
    // targetSquare = findStrategicTarget(availableSquares);
    setTimeout(() => {
        placeCPUIconOnTarget(targetSquare);
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
    setDifficulty();
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

// HOVER STATES ONLY APPLY TO NON MOBILE DEVICES
if(!isMobile) {
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
}

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

// SET DIFFICULTY MODAL LISTENERS
easyModeBtn.addEventListener('click', event => {
    difficultyLevel = 'easy';
});
hardModeBtn.addEventListener('click', event => {
    difficultyLevel = 'hard';
});
difficultyBtns.forEach(btn => {
    btn.addEventListener('click', event => {
        setDifficultyModal.classList.add('hidden');
        darkOverlay.classList.add('hidden');
        if(playerOneIcon === 'o') {
            cpuGo();
        }
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

    




