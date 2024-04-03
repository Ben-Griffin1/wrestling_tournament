const readlineSync = require('readline-sync');
const chalk = require('chalk');

const moveTypes = {
    signature: 'Signature Move',
    finisher: 'Finishing Move'
};


/**
 * Simulates a turn in the wrestling match.
 *
 * @param {Object} attacker - The attacker wrestler object.
 * @param {Object} opponent - The opponent wrestler object.
 * @returns {boolean} - True if the turn was successful, false otherwise.
 */
function takeTurn(attacker, opponent) {
    let moveIndex = Math.floor(Math.random() * 3);
    let move = attacker.moves[moveIndex]; // Get move

    if (move.type == moveTypes.finisher) { // Finishing move used
        if (opponent.health > 45) {
            const randomChance = Math.random(); // Generate a random number between 0 and 1
            if (randomChance <= 0.5) { // Move fails, does no damage
                console.log(` - ${chalk.bold(attacker.name)}'s finishing move (${chalk.magentaBright(move.name)}) failed!`);
                console.log(` - ${chalk.bold(opponent.name)}: ${chalk.cyanBright(opponent.health)} hp remaining`);
                return true;
            }
            else { // Move works
                opponent.health -= move.damage; 
                console.log(` - Attacker ${chalk.bold(attacker.name)} used ${chalk.magentaBright(move.name)} on ${chalk.bold(opponent.name)}, dealing ${move.damage} damage!`);
                if (opponent.health <= 0) {
                    opponent.health = 0;
                    console.log(` - ${chalk.bold(opponent.name)}: ${chalk.cyanBright(opponent.health)} hp remaining`);
                    console.log(`\n${chalk.bold(opponent.name)} was taken out!`);
                    return false;
                } else {
                    console.log(` - ${chalk.bold(opponent.name)}: ${chalk.cyanBright(opponent.health)} hp remaining`);
                    return true;
                }
            }
        } else {
            opponent.health -= move.damage; 
            if (opponent.health <= 0) {
                opponent.health = 0;
                console.log(` - ${chalk.bold(opponent.name)}: ${chalk.cyanBright(opponent.health)} hp remaining`);
                console.log(`\n${chalk.bold(opponent.name)} was taken out!`);
            }
        }
      
    }
    else if (opponent.health - move.damage > 0) { // Normal move, opponent survives
        console.log(` - Attacker ${(attacker.name)} used ${chalk.greenBright(move.name)} on ${chalk.bold(opponent.name)}, dealing ${move.damage} damage!`)
        opponent.health -= move.damage;
        console.log(` - ${chalk.bold(opponent.name)}: ${chalk.cyanBright(opponent.health)} hp remaining`)
        return true;
    } else { // Normal move, opponent is taken out
        opponent.health = 0;
        console.log(` - Attacker ${chalk.bold(attacker.name)} used ${chalk.greenBright(move.name)} on ${chalk.bold(opponent.name)}, dealing ${move.damage} damage!`)
        console.log(` - ${chalk.bold(opponent.name)}: ${chalk.cyanBright(opponent.health)} hp remaining`)
        console.log(`\n${chalk.bold(opponent.name)} was taken out!`)
        return false;
    }
}


/**
 * Prints the statistics of two wrestlers to be displayed before matches.
 *
 * @param {Object} wrestlerOne - The first wrestler object.
 * @param {Object} wrestlerTwo - The second wrestler object.
 */    
function printFighterStats(wrestlerOne, wrestlerTwo) {
    console.log(`${chalk.underline('FIGHTER STATS:')} \n  ${chalk.redBright('+ RED CORNER:')} ${chalk.bold(wrestlerOne.name)} \n  + MOVES: \n    - ${chalk.greenBright(wrestlerOne.moves[0].name)} \n    - ${chalk.greenBright(wrestlerOne.moves[1].name)}\n    - ${chalk.magentaBright(wrestlerOne.moves[2].name)}\n  + ${'HEALTH: ' + chalk.cyanBright(wrestlerOne.health)}\n`);
    console.log(`  ${chalk.blueBright('+ BLUE CORNER:')} ${chalk.bold(wrestlerTwo.name)} \n  + MOVES: \n    - ${chalk.greenBright(wrestlerTwo.moves[0].name)} \n    - ${chalk.greenBright(wrestlerTwo.moves[1].name)}\n    - ${chalk.magentaBright(wrestlerTwo.moves[2].name)}\n  + ${'HEALTH: ' + chalk.cyanBright(wrestlerTwo.health)}\n`);
}

/**
 * Simulates a single match between two wrestlers.
 *
 * @param {Object} wrestlerOne - The first wrestler object.
 * @param {Object} wrestlerTwo - The second wrestler object.
 * @returns {Object} - The winning wrestler object.
 */
function playMatch(wrestlerOne, wrestlerTwo) {
    
    if (wrestlerOne && wrestlerTwo) {

        // Store health for resetting after the match
        let wrestlerOneHealth = wrestlerOne.health;
        let wrestlerTwoHealth = wrestlerTwo.health;

        let roundCount = 1;
        console.log(`${chalk.bold(wrestlerOne.name)} VS. ${chalk.bold(wrestlerTwo.name)}`);
        printFighterStats(wrestlerOne, wrestlerTwo);

        while (wrestlerOne.health > 0 && wrestlerTwo.health > 0) {
            console.log(chalk.yellowBright(`ROUND ${roundCount}...`));
            readlineSync.question(); // Pauses for a new key press

            // Wrestler One's turn
            console.log(`${chalk.bold(wrestlerOne.name + "'s")} turn`);
            const turnResultOne = takeTurn(wrestlerOne, wrestlerTwo);

            // Check if Wrestler One wins after their turn
            if (!turnResultOne) {
                console.log(`${chalk.bold(wrestlerOne.name)} wins the match in round ${roundCount}!\n`);
                // Reset wrestler health
                wrestlerOne.health = wrestlerOneHealth; 
                wrestlerTwo.health = wrestlerTwoHealth;
                return wrestlerOne;
            }

            // Wrestler Two's turn
            console.log(`${chalk.bold(wrestlerTwo.name + "'s")} Turn`);
            const turnResultTwo = takeTurn(wrestlerTwo, wrestlerOne);
            readlineSync.question(); 
            
            // Check if Wrestler Two wins after their turn
            if (!turnResultTwo) {
                console.log(`${chalk.bold(wrestlerTwo.name)} wins the match in round ${roundCount}!`);
                // Reset wrestler health
                wrestlerOne.health = wrestlerOneHealth;
                wrestlerTwo.health = wrestlerTwoHealth;
                return wrestlerTwo;
            }
            roundCount++;
        }
    } else {
        if (wrestlerOne) {
            console.log(`${chalk.bold(wrestlerOne.name)} advances, his opponent didn't show up.`);
            return wrestlerOne;
        } else {
            console.log(`${chalk.bold(wrestlerTwo.name)} advances, his opponent didn't show up.`);
            return wrestlerTwo;
        }
    }
}

/**
 * Simulates a wrestling tournament.
 *
 * @param {Array} wrestlersArr - An array of wrestler objects participating in the tournament.
 */
function playTournament(wrestlersArr) {
    const playerCount = wrestlersArr.length;

    if (playerCount === 0) {
        console.log('No wrestlers in the tournament.');
        return;
    }

    if (playerCount === 1) {
        console.log(`${wrestlersArr[0].name} wins the tournament by default.`);
        return;
    }

    if (playerCount === 2) {
        console.log("2 PLAYER WRESTING 'TOURNAMENT'");
        playMatch(wrestlersArr[0], wrestlersArr[1]);
        return;
    }

    if (playerCount === 3) {

        console.log(chalk.bold('[3 PLAYER WRESTLING TOURNAMENT]'));
        readlineSync.question();

        console.log(chalk.redBright('MATCH 1:'));
        let winner = playMatch(wrestlersArr[0], wrestlersArr[1]);
        console.log(chalk.greenBright(`${winner.name} wins Match 1!\n`));
        readlineSync.question();

        console.log(chalk.redBright('MATCH 2:'));
        winner = playMatch(winner, wrestlersArr[2]);
        console.log(chalk.greenBright(`${winner.name} wins Match 2!\n`));
        readlineSync.question();

        console.log(chalk.yellowBright(`${winner.name} WINS THE TOURNAMENT!\n`));
        readlineSync.question();
        return;
    }

    // Example of a bracket-style tournament for 4 players
    if (playerCount === 4) {
        console.log(chalk.bold('[4 PLAYER WRESTLING TOURNAMENT]'));
        readlineSync.question();

        console.log(chalk.redBright('MATCH 1: SEMIFINAL'));
        const semiFinal1Winner = playMatch(wrestlersArr[0], wrestlersArr[1]);
        readlineSync.question();
        
        console.log(chalk.redBright('MATCH 2: SEMIFINAL'));
        const semiFinal2Winner = playMatch(wrestlersArr[2], wrestlersArr[3]);
        readlineSync.question();


        if (semiFinal1Winner && semiFinal2Winner) {
            console.log(chalk.redBright('MATCH 3: FINALS'));
            const winner = playMatch(semiFinal1Winner, semiFinal2Winner);
            console.log(chalk.yellowBright(`${winner.name} WINS THE TOURNAMENT!\n`));
            readlineSync.question();
        } else if (semiFinal1Winner) {
            console.log(`${semiFinal1Winner.name} advances to the final due to a bye.`);
        } else if (semiFinal2Winner) {
            console.log(`${semiFinal2Winner.name} advances to the final due to a bye.`);
        } else {
            console.log('No winner in the semi-finals.');
        }
        return;
    }
    console.log('Tournament structure not supported for more than 4 players.');
}

//Wrestler sample data
wrestlerA = {
    name: 'Bob',
    health: 110,
    moves: [
        { name: 'Body Slam', damage: 45, type: moveTypes.signature },
        { name: 'Arm Bar', damage: 30, type: moveTypes.signature },
        { name: 'Suplex Finisher', damage: 100, type: moveTypes.finisher}
    ]
}
wrestlerB = {
    name: 'Joey',
    health: 100,
    moves: [
        { name: 'Clothesline', damage: 50, type: moveTypes.signature },
        { name: 'Guillotine Choke', damage: 25, type: moveTypes.signature },
        { name: "You're Hired!", damage: 100, type: moveTypes.finisher}
    ]
}
wrestlerC = {
    name: 'Ben',
    health: 95,
    moves: [
        { name: 'Leg Sweep', damage: 45, type: moveTypes.signature },
        { name: 'Cradle', damage: 20, type: moveTypes.signature },
        { name: 'Arm Triangle Choke Finisher', damage: 100, type: moveTypes.finisher}
    ]
}
wrestlerD = {
    name: 'Sam',
    health: 120,
    moves: [
        { name: "Fireman's Carry", damage: 45, type: moveTypes.signature },
        { name: 'Half Nelson', damage: 20, type: moveTypes.signature },
        { name: 'Clothesline Finisher', damage: 100, type: moveTypes.finisher}
    ]
}


function main() {

    console.log(chalk.bold('When output pauses, press any key to continue...\n'))

    playTournament([wrestlerA]); // Single-player tournament
    playTournament([wrestlerA, wrestlerB]); // Two-player tournament
    playTournament([wrestlerA, wrestlerB, wrestlerC]); // Three-player tournament
    playTournament([wrestlerA, wrestlerB, wrestlerC, wrestlerD]); // Four-player tournament
    playTournament([wrestlerA, wrestlerB, wrestlerC, undefined]); // Four-player tournament
    playTournament([wrestlerA, undefined, wrestlerC, undefined]); // Four-player tournament
}

main();