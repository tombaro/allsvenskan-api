'use strict';

require('isomorphic-fetch');
var jsdom = require('jsdom');
var { JSDOM } = jsdom;

/**
 * Fetch and output Allsvenskan current standings.
 * @param {any} req - The request.
 * @param {any} res - The response.
 */
exports.allsvenskan_standings = function(req, res) {
    outputStandings(res, 'https://www.svenskfotboll.se/serier-cuper/tabell-och-resultat/allsvenskan-2024/115560/');
}

/**
 * Fetch and output Damallsvenskan current standings.
 * @param {any} req - The request.
 * @param {any} res - The response.
 */
exports.damallsvenskan_standings = function(req, res) {
    outputStandings(res, 'https://www.svenskfotboll.se/serier-cuper/tabell-och-resultat/obos-damallsvenskan-2024/115477/');
}

/**
 * Fetch and output Elitettan current standings.
 * @param {any} req - The request.
 * @param {any} res - The response.
 */
exports.elitettan_standings = function(req, res) {
    outputStandings(res, 'https://www.svenskfotboll.se/serier-cuper/tabell-och-resultat/elitettan-2024/115475/');
}

/**
 * Fetch and output Superettan current standings.
 * @param {any} req - The request.
 * @param {any} res - The response.
 */
exports.superettan_standings = function(req, res) {
    outputStandings(res, 'https://www.svenskfotboll.se/serier-cuper/tabell-och-resultat/superettan-2024/115526/');
}

/**
 * Fetch and output Allsvenskans top scorers.
 * @param {any} req - The request.
 * @param {any} res - The response.
 */
exports.allsvenskan_topscorers = function(req, res) {
    const options = { includeNodeLocations: true };
    (async () => {
        const response = await fetch('https://www.svenskfotboll.se/serier-cuper/spelarstatistik/allsvenskan-2022/97366/');
        if ( response.ok ) {
            const text = await response.text();
            const dom = await new JSDOM(text, options);
            const tableRows = [...dom.window.document.querySelectorAll("#player-statistics table tr")];
            var items = filterScorerResults(tableRows);
            // Write to json
            outputResultItemsToJson(res, items);
        } else {
            res.json( {Error: 'Error in response from source'} );
        }
      })()
}

/**
 * Fetch and output a table.
 * @param {any} res - The response.
 * @param {string} tableUrl - The url to the table. 
 */
function outputStandings(res, tableUrl) {
    const options = { includeNodeLocations: true };
    (async () => {
        const response = await fetch(tableUrl);
        if ( response.ok ) {
            const text = await response.text();
            const dom = await new JSDOM(text, options);
            const tableRows = [...dom.window.document.querySelectorAll("table.standings-table tr.standings-table__row")];
            var items = filterTableResults(tableRows);
            // Write to json
            outputResultItemsToJson(res, items);
        } else {
            res.json( {Error: 'Error in response from source'} );
        }
      })()
}

/**
 * Filter table data.
 * @param {array} rows - Rows of html fragments for each team.
 * @returns {array} Item rows with team data.
 */
function filterTableResults(rows){
    var items = [];
    rows.forEach(team => {
        items.push({
            'position': team.children[0].textContent,
            'team': team.children[2].textContent,
            'round': team.children[4].textContent,
            'win': team.children[5].textContent,
            'draw': team.children[6].textContent,
            'loss': team.children[7].textContent,
            'gm': team.children[8].textContent,
            'im': team.children[9].textContent,
            'ms': team.children[10].textContent,
            'points': team.children[11].textContent,
        });
    });

    return items;
}

/**
 * Write items to json.
 * @param {any} res - The response.
 * @param {array} items - The items to output.
 */
function outputResultItemsToJson(res, items) {
    const result = {
        result: {
            round: 'latest',
            item: items,
        }
    }
    res.status(200).json(result);
}

/**
 * Filter scorer data.
 * @param {array} rows - Rows of html fragments for each player.
 * @returns {array} Item rows with scorer data.
 */
function filterScorerResults(rows){
    var items = [];
    let position = 1;
    // Skip first row.
    for (let index = 1; index < rows.length; index++) {
        const element = rows[index];
        const playerFragment = JSDOM.fragment(element.innerHTML);
        const playerRows = playerFragment.querySelectorAll('.table__player-row');
        const statRows = playerFragment.querySelectorAll('.table__cell-small');

        if( playerRows > 0 ) {
            items.push({
                position: position++,
                name: playerRows[0].textContent.replace(/(\t|\n)/g, ''), // Remove tabs and stuff in cell.
                team: playerRows[1].textContent.replace(/(\t|\n)/g, ''), // Remove tabs and stuff in cell.
                goals: statRows[0].textContent,
                assists: statRows[1].textContent,
                games: statRows[2].textContent,
            });
        }
    }

    return items;
}
