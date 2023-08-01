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
      if (count > 0 && count % 2 == 0) {
        console.log(`Round: ${++round}`);
      } else {
        console.log(`Round: ${round}`);
      }

    }
    return { increment, getCount, displayCount, getRound };
  })();
  function switchTurn() {
    if (activePlayerTurn == currentPlayers[0]) {
      activePlayerTurn = currentPlayers[1]
    } else {
      activePlayerTurn = currentPlayers[0];
    }
    console.log(`new active player is: ${activePlayerTurn.getName()}`);
  }
  function playRound(indexRow, indexColumn) {
    if (board.getBoard()[indexRow][indexColumn]) {
      console.log('Cannot place your mark here');
      return;
    }
    gameCounter.displayCount();


    board.addPlayerMark(activePlayerTurn.getMark(), indexRow, indexColumn);
    board.printBoard();
    if (gameCounter.getRound() == 3) {
      console.log('Checking for winners');
    }
    switchTurn();
    displayPlayerTurn();
    gameCounter.increment();

  }
  function displayPlayerTurn() {
    console.log(`${activePlayerTurn.getName()}'s turn`);
  }

  return { board, currentPlayers, printCurrentPlayers, playRound, switchTurn, displayPlayerTurn, gameCounter };
}

const game = gameController();