const Player = (name, mark, cpu = false) => {
  const getName = () => name;
  const getMark = () => mark;
  const isCPU = () => cpu;
  return { getName, getMark, isCPU };
}
const gameBoard = (() => {
  const board = [];
  const MAX_BOARD_SIZE = 9;
  const playerMarkHistory = [];


  initializeGameBoard();
  printBoard();

  function resetGameBoard() {
    for (let i = 0; i < MAX_BOARD_SIZE; i++) {
      board.pop();
      playerMarkHistory.pop();
    }
    initializeGameBoard();
    console.log('Gameboard has been reset');
  }
  function initializeGameBoard() {
    for (let i = 0; i < MAX_BOARD_SIZE; i++) {
      board.push('');
    }
  }
  function getBoard() { return board; };
  function printBoard() { console.dir(getBoard()) }
  function addPlayerMark(mark, index) {
    board[index] = mark;
    playerMarkHistory.push(index);
  };
  function getPlayerMarkHistory() {
    return playerMarkHistory;
  }
  return { getBoard, printBoard, addPlayerMark, resetGameBoard, getPlayerMarkHistory };
})();

const domController = (() => {
  //event listeners
  const roundDescription = document.querySelector('.roundDescription');
  const gridSquares = document.querySelectorAll('.square p');
  gridSquares.forEach((square) => {
    square.addEventListener('click', function () {
      game.playRound(this.attributes['data-index'].value);
    }, { once: false });
  });
  const endGameOverlay = document.querySelector('.endGameOverlay');
  const playAgainBtn = document.querySelector('#play-again-btn');
  playAgainBtn.addEventListener('click', playAgain);

  function addToGameBoard(playerMark, index) {
    const activeSquare = document.querySelector(`p[data-index="${index}"]`)
    activeSquare.textContent = playerMark;
  }
  function displayRoundDescription(messageToPlayer) {
    roundDescription.textContent = messageToPlayer;
  }

  function resetDOMGameBoard() {
    gridSquares.forEach((square) => {
      square.textContent = "";
    })
  }
  function toggleEndGameOverlay() {
    endGameOverlay.classList.toggle('hide-display');
  }
  function playAgain() {
    game.resetGame();
    roundDescription.textContent = game.getPlayerTurn();
    resetDOMGameBoard();
    toggleEndGameOverlay();
  }
  function endGame(endMessage) {
    const endGameTextBox = document.querySelector('.endGameOverlay .winnerMessage');
    endGameTextBox.textContent = endMessage;
    toggleEndGameOverlay();
  }

  return { addToGameBoard, endGame, displayRoundDescription };
})();
const game = (() => {
  const currentPlayers = [];
  const playerMarks = ['X', 'O'];
  let maxPlayers = 2;
  for (let i = 1; i <= maxPlayers; i++) {
    currentPlayers.push(Player('Player ' + i, playerMarks[i - 1]));
  }
  let activePlayerTurn;
  let winningPlayer = '';
  let endGameMessage = '';

  setActivePlayer(currentPlayers[0]);
  console.log(getPlayerTurn());
  domController.displayRoundDescription(getPlayerTurn());


  function setWinningPlayer(playerName) {
    winningPlayer = playerName;
  }
  function getWinningPlayer() {
    return winningPlayer;
  }
  function setEndGameMessage(message) {
    endGameMessage = message;
  }
  function getEndGameMessage() {
    return endGameMessage;
  }
  function getActivePlayer() {
    return activePlayerTurn;
  }
  function setActivePlayer(personObj) {
    activePlayerTurn = personObj;
  }
  function printCurrentPlayers() {
    return currentPlayers.forEach(player => {
      console.log(`${player.getName()} (${player.getMark()})`);
    })
  }
  function resetGame() {
    activePlayerTurn = currentPlayers[0];
    console.log(getPlayerTurn());
    gameCounter.reset();
    gameBoard.resetGameBoard();
    setWinningPlayer('');
    setEndGameMessage('');
    console.log('Playing Again');
    gameBoard.printBoard();
  }

  const gameCounter = (() => {
    let count = 0;
    let round = 1;

    const increment = () => {
      return count++;
    }
    const reset = () => {
      count = 0;
      round = 1;
    }
    const getCount = () => count;
    const getRound = () => round;
    function displayCount() {
      return count;
    }
    function displayRound() {
      if (count > 0 && count % 2 == 0) {
        console.log(`Round: ${++round}`);
      } else {
        console.log(`Round: ${round}`);
      }
    }
    return { increment, getCount, displayRound, displayCount, getRound, reset };
  })();

  function switchTurn() {
    if (activePlayerTurn == currentPlayers[0]) {
      activePlayerTurn = currentPlayers[1]
    } else {
      activePlayerTurn = currentPlayers[0];
    }
  }
  function checkForWinner(playerMark) {
    const winningIndexSets = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6], //column 0
      [1, 4, 7], //column 1
      [2, 5, 8], //column 2
      [0, 4, 8], //diagnal
      [2, 4, 6] //diagonal
    ];

    //Find all indexes from the gameboard array that have the selected player's mark
    const matchedPlayerArray = gameBoard.getBoard().reduce((arr, value, index) => {
      if (value == playerMark) {
        arr.push(index);
      }
      return arr;
    }, []);

    //checks to see if the matchedPlayerArray have the winning values compared to the winningIndexSet array

    for (const winningSet of winningIndexSets) {
      let [value1, value2, value3] = winningSet;
      if (matchedPlayerArray.includes(value1) && matchedPlayerArray.includes(value2) && matchedPlayerArray.includes(value3)) {
        return true;
      }
    }

  }
  function gameOver(player, winnerFound) {
    if (winnerFound) {
      setWinningPlayer(player.getName())
      setEndGameMessage(`The Winner is ${getWinningPlayer()}`);
      console.log(`The Winner is ${getWinningPlayer()}`);
      domController.endGame(getEndGameMessage());
    } else {
      setEndGameMessage(`It's a Tie!`);
      console.log(getEndGameMessage());
      domController.endGame(getEndGameMessage());
    }
  }
  function playRound(index) {
    if (gameBoard.getBoard()[index]) {
      console.log('Cannot place your mark here');
      return false;
    }
    gameCounter.displayRound();

    gameBoard.addPlayerMark(activePlayerTurn.getMark(), index);
    gameCounter.increment();
    console.log(`game count -> ${gameCounter.getCount()}`);
    domController.addToGameBoard(activePlayerTurn.getMark(), index);

    gameBoard.printBoard();
    if (gameCounter.getRound() >= 3) {
      if (checkForWinner(activePlayerTurn.getMark())) {
        gameOver(activePlayerTurn, true);
        return;
      }
      if (gameCounter.getCount() == 9) {
        gameOver(activePlayerTurn, false);
        return;
      }
    }
    switchTurn();
    console.log(getPlayerTurn());
    domController.displayRoundDescription(getPlayerTurn());

  }
  function getPlayerTurn() {
    return `(${activePlayerTurn.getMark()}) ${activePlayerTurn.getName()}'s move`;
  }

  return { getActivePlayer, currentPlayers, printCurrentPlayers, playRound, getPlayerTurn, gameCounter, resetGame, setWinningPlayer, getWinningPlayer, setEndGameMessage, getEndGameMessage };
})();
