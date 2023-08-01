const Player = (name, mark, cpu = false) => {
  const getName = () => name;
  const getMark = () => mark;
  const isCPU = () => cpu;
  return { getName, getMark, isCPU };
}

const gameBoard = () => {
  let rows = 3;
  let columns = 3;
  const board = [];
  const gameEnd = null;

  for (let i = 0; i < rows; i++) {
    board.push([]);
    for (let j = 0; j < columns; j++) {
      board[i].push('');
    }
  }
  printBoard();

  function getBoard() { return board; };
  function printBoard() { console.dir(getBoard()) }
  function addPlayerMark(mark, indexRow, indexColumn) {
    board[indexRow][indexColumn] = mark;
  }

  return { getBoard, addPlayerMark, printBoard };
}

function gameController(allowCPU = false, playerMarks = ['X', 'O']) {
  const board = gameBoard();
  const currentPlayers = [];

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
  const gameCounter = (() => {
    let count = 0;
    let round = 1;

    const increment = () => {
      return count++;
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
    return { increment, getCount, displayRound, displayCount, getRound };
  })();
  function switchTurn() {
    if (activePlayerTurn == currentPlayers[0]) {
      activePlayerTurn = currentPlayers[1]
    } else {
      activePlayerTurn = currentPlayers[0];
    }
  }
  function checkForWinner(playerObj) {
    let rowLength = board.getBoard()[0].length;
    const straightRow = [playerObj.getMark(), playerObj.getMark(), playerObj.getMark()];

    const straightColumn = [playerObj.getMark(), playerObj.getMark(), playerObj.getMark()];
    //check for all rows
    for (let i = 0; i < rowLength; i++) {
      if (board.getBoard()[i].toString() == straightRow) {
        return true;
      }
    }
    //check for all columns
    if (board.getBoard()[0][0] == playerObj.getMark() && board.getBoard()[1][0] == playerObj.getMark() && board.getBoard()[2][0] == playerObj.getMark() || board.getBoard()[0][1] == playerObj.getMark() && board.getBoard()[1][1] == playerObj.getMark() && board.getBoard()[2][1] == playerObj.getMark() || board.getBoard()[0][2] == playerObj.getMark() && board.getBoard()[1][2] == playerObj.getMark() && board.getBoard()[2][2] == playerObj.getMark()) {
      return true;
    }

    //check for all diagnols
    if (board.getBoard()[0][0] == playerObj.getMark() && board.getBoard()[1][1] == playerObj.getMark() && board.getBoard()[2][2] == playerObj.getMark() || board.getBoard()[0][2] == playerObj.getMark() && board.getBoard()[1][1] == playerObj.getMark() && board.getBoard()[2][0] == playerObj.getMark()) {
      return true;
    }
  }
  function gameOver(player, winnerFound) {
    return (winnerFound) ? console.log(`${player.getName()} wins!`) : console.log('Game is over, it\'s a tie');
  }
  function playRound(indexRow, indexColumn) {
    if (board.getBoard()[indexRow][indexColumn]) {
      console.log('Cannot place your mark here');
      return;
    }
    gameCounter.displayRound();


    board.addPlayerMark(activePlayerTurn.getMark(), indexRow, indexColumn);
    gameCounter.increment();
    console.log(`game count -> ${gameCounter.getCount()}`);

    board.printBoard();
    if (gameCounter.getRound() >= 3) {
      let foundWinner;
      foundWinner = checkForWinner(activePlayerTurn);
      if (foundWinner) {
        gameOver(activePlayerTurn, foundWinner);
        return;
      }
      if (gameCounter.getCount() == 9) {
        gameOver(activePlayerTurn, foundWinner);
        return;
      }
    }
    switchTurn();
    displayPlayerTurn();

  }
  function displayPlayerTurn() {
    console.log(`${activePlayerTurn.getName()}'s turn`);
  }

  return { board, currentPlayers, printCurrentPlayers, playRound, switchTurn, displayPlayerTurn, gameCounter };
}

const game = gameController();