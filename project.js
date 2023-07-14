// 1. user deposits mone.
// 2. user picks lines to bet on.
// 3. user bets money on the line.
// 4. gets a result.
// 5. check if user won.
// 6. give money for winnings.
// 7. option to replay.

const prompt = require("prompt-sync")(); //import function to get an input from user

const ROWS = 3;
const COLS = 3;

const SYMBOLS_COUNT = {
    A : 2,
    B: 4,
    C: 6,
    D: 8
}

const SYMBOL_VALUES = {
    A: 5,
    B: 4,
    C: 3,
    D: 2
}

//get deposit
const deposit = () => {
    while (true) {
        const depositAmount = prompt("Enter amount to deposit in slot machine : "); //store the string input in a variable
        const numberDepositAmount = parseFloat(depositAmount); //convert the string input into a float value if not possible then gives result NaN (not a number)
        if ( isNaN(numberDepositAmount) || numberDepositAmount <= 0 ) {
            console.log("Invalid deposit amount, try again");
        }
        else {
            return numberDepositAmount;
        }
    }
}

//get lines
const getLines = () => {
    while (true) {
        const lines = prompt("Enter the number of lines to bet on (1, 2, 3) : ");
        const numberLines = parseFloat(lines);
        if ( isNaN(numberLines) || numberLines <= 0  || numberLines > 3) {
            console.log("Invalid lines, try again");
        }
        else {
            return numberLines;
        }
    }
}

//get bet
const getBet = (balance, lines) => {
    while (true) {
        const bet = prompt("Enter the bet per line: ");
        const numberBet = parseFloat(bet);
        if ( isNaN(numberBet) || numberBet <= 0  || numberBet > balance / lines) {
            console.log("Invalid bet, try again");
        }
        else {
            return numberBet;
        }
    }
}

//spin
const spin = () => {
    const symbols = [];
    for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
        for( let i = 0; i < count; i++) {
            symbols.push(symbol);
        }
    }
    const reels = [[], [], []];
    for(let i = 0; i < COLS; i++){
        const reelSymbols = [...symbols];
        for(let j = 0; j < ROWS; j++){
            const randomIndex = Math.floor(Math.random() * reelSymbols.length);
            const selectedSymbol = reelSymbols[randomIndex];
            reels[i].push(selectedSymbol);
            reelSymbols.splice(randomIndex, 1);
        }
    }
    return reels;
}

//transpose
const transpose = (reels) => {
    const rows = [];

    for(let i = 0; i < ROWS; i++){
        rows.push([]);
        for(let j = 0; j < COLS; j++){
            rows[i].push(reels[j][i]);
        }
    }
    return rows;
}

//print rows
const printRows = (rows) => {
    for(const row of rows){
        let rowString = "";
        for(const [i, symbol] of row.entries()){
            rowString += symbol;
            if(i != row.length - 1){
                rowString += " | ";
            }
        }
        console.log(rowString);
    }
}

//get winnings
const getWinnnings = (rows,bet,lines) => {
    let winnings = 0;
    for(let row = 0; row < lines; row++){
        const symbols = rows[row];
        let allsame = true;

        for(const symbol of symbols){
            if(symbol != symbols[0]){
                allsame = false;
                break;
            }
        }
        if(allsame){
            winnings += bet * SYMBOL_VALUES[symbols[0]];
        }
    }
    return winnings;
}

//give winnings
const game = () => {
    let balance = deposit();

    while(true){
        console.log("You have a balance of $" + balance);
        const numberOfLines = getLines();
        const bet = getBet(balance, numberOfLines);
        balance -= bet* numberOfLines;
        const reels = spin();
        const rows = transpose(reels);
        printRows(rows);
        const winnings = getWinnnings(rows, bet, numberOfLines);
        balance += winnings;
        console.log("You won, $" + winnings.toString());

        if(balance <= 0){
            console.log("No balance left!");
            break;
        }
        const playAgain = prompt("Do you wish to play again (y/n)? ");

        if(playAgain != "y") break;
    }
}
game();