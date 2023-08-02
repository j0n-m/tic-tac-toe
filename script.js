const Player = (name, mark, cpu = false) => {
  const getName = () => name;
  const getMark = () => mark;
  const isCPU = () => cpu;
  return { getName, getMark, isCPU };
}

const gameBoard = (() => {
  const board = [];
  const MAX_BOARD_SIZE = 9;

  initializeGameBoard();
  printBoard();

  function resetGameBoard() {

    for (let i = 0; i < MAX_BOARD_SIZE; i++) board.pop();
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
  };
  return { getBoard, printBoard, addPlayerMark, resetGameBoard };
})();

const game = ((allowCPU = false) => {
  const currentPlayers = [];
  const playerMarks = ['X', 'O'];

  //Fills array with current players
  if (allowCPU) {
    currentPlayers.push(Player('Player 1', playerMarks[i - 1]));
    currentPlayers.push(Player('CPU', playerMarks[playerMarks.length - 1], true));
  } else {
    let maxPlayers = 2;
    for (let i = 1; i <= maxPlayers; i++) {
      currentPlayers.push(Player('Player ' + i, playerMarks[i - 1]));
    }
  }
  let activePlayerTurn = currentPlayers[0];
  displayPlayerTurn();

  function printCurrentPlayers() {
    return currentPlayers.forEach(player => {
      console.log(`${player.getName()} (${player.getMark()})`);
    })
  }
  function resetGame() {
    activePlayerTurn = currentPlayers[0];
    displayPlayerTurn();
    gameCounter.reset();
    gameBoard.resetGameBoard();
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
    return (winnerFound) ? console.log(`${player.getName()} wins!`) : console.log('Game is over, it\'s a tie');
  }
  function playRound(index) {
    if (gameBoard.getBoard()[index]) {
      console.log('Cannot place your mark here');
      return;
    }
    gameCounter.displayRound();

    gameBoard.addPlayerMark(activePlayerTurn.getMark(), index);
    gameCounter.increment();
    console.log(`game count -> ${gameCounter.getCount()}`);

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
    displayPlayerTurn();

  }
  function displayPlayerTurn() {
    console.log(`${activePlayerTurn.getName()}'s turn`);
  }

  return { currentPlayers, printCurrentPlayers, playRound, displayPlayerTurn, gameCounter, resetGame };
})();
