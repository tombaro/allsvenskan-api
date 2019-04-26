'use strict';


var Xray = require('x-ray');
var x = Xray();


exports.allsvenskan_standings = function(req, res) {
/* Scrape the table. */
	x('http://www.svt.se/svttext/web/pages/343.html',  '.root',
	{
		rows: ['span']
	})(function(err, obj){
        if (err) {
            res.send(err);
        } else {      
            var items = [];
            for (var i = 4; i < obj.rows.length -3; i++) {
                var current = obj.rows[i];
                //At this point 'current' looks like this "PPTTTTTTTTTTTTTTTRR_WW_DD_LL__GS_GC__PP"
                var tmp = {
                    position: current.substring(0,2).trim(),
                    team: current.substring(2,17).trim(),
                    round: current.substring(17,19).trim(),
                    win: current.substring(20,22).trim(),
                    draw: current.substring(23,25).trim(),
                    loss: current.substring(26,28).trim(),
                    gm: current.substring(30,32).trim(),
                    im: current.substring(33,35).trim(),
                    points: current.substring(37,39).trim()
                };
                tmp.ms = (tmp.gm - tmp.im);
                items.push(tmp);
            };
            // Write to json
            const to_string = '{ "result": { "round": "latest", "item":' + JSON.stringify(items) + '}}';
            res.json(to_string);
        }
	});
};

exports.allsvenskan_topscorers = function(req, res) {
/* Scrape top scorers. */
    x('http://www.svt.se/svttext/web/pages/351.html', '.root',
    {
        // Top scorers are divided into class C, W and C. Split them up and merge.
        rowsC: ['.C'],
        rowsW: ['.W']
    })(function(err, obj){
        if (err) {
            res.send(err);
        } else {      
            var items = [];
            // First get position and goals.
            for (var i = 0; i < 12; i++) {
                var current_pos = obj.rowsC[i];
                i++;
                var current_goals = obj.rowsC[i];
                var tmp = {
                    position: current_pos.substring(0,2).trim(),
                    goals: current_goals.substring(0,2).trim()
                };
                items.push(tmp);
            }
            // Then get names and team.
            var names = [];
            for (var i = 2; i < 8; i++) {
                var current = obj.rowsW[i];
                var tmp = {
                    name: current.substring(0,19).trim(),
                    team: current.substring(19,32).trim(),
                };
                names.push(tmp);
            }
            // Merge all together.
            for (let i = 0; i < items.length; i++) {
                items[i].name = names[i].name;
                items[i].team = names[i].team;
            }

            // Write to json
            const to_string = '{ "result": { "round": "latest", "item":' + JSON.stringify(items) + '}}';
            res.json(to_string);
        }
	});
};


exports.elitettan_standings = function(req, res) {
/* Scrape the table. */
	x('https://www.svt.se/svttext/web/pages/350.html', '.root', 
	{
	   //Fetching classes because Elitettan has "current games" in the start wich varies in classes depending if on-going and also varies depending on amount of matches upcoming.
		rowsG: ['.G'],
		rowsW: ['.W'],
		rowsC: ['.C']
	})(function(err, obj){
        if (err) {
            res.send(err);
        } else {    
            var items = [];
            for (var i = 0; i < 2; i++) {
                var current = obj.rowsG[i];
                //console.log(current.replace(/\n/g," ").replace(/^\s|\s&|\t/g," "));
                var tmp = {
                    position: current.substring(0,2).trim(),
                    team: current.substring(2,17).trim(),
                    round: current.substring(17,19).trim(),
                    win: current.substring(20,22).trim(),
                    draw: current.substring(23,25).trim(),
                    loss: current.substring(26,28).trim(),
                    gm: current.substring(30,32).trim(),
                    im: current.substring(33,35).trim(),
                    points: current.substring(37,39).trim()
                };
                    tmp.ms = (tmp.gm - tmp.im);
                    items.push(tmp)
            };
            for (var i = 0; i < obj.rowsW.length; i++) {
                var current = obj.rowsW[i];
                //console.log(current.replace(/\n/g," ").replace(/^\s|\s&|\t/g," "));
                var tmp = {
                    position: current.substring(0,2).trim(),
                    team: current.substring(2,17).trim(),
                    round: current.substring(17,19).trim(),
                    win: current.substring(20,22).trim(),
                    draw: current.substring(23,25).trim(),
                    loss: current.substring(26,28).trim(),
                    gm: current.substring(30,32).trim(),
                    im: current.substring(33,35).trim(),
                    points: current.substring(37,39).trim()
                };
                if(tmp.position >= 3 && tmp.position <= 11){
                    tmp.ms = (tmp.gm - tmp.im);
                    items.push(tmp)
                }
            };
            //Since class '.C' is used alot in the beginning and french standings are following, we fetching total amount of teams in the league
            //and specifying places 12-14 so it won't grab games/top from French league
            for (var i = 0; i < obj.rowsC.length; i++) {
                var current = obj.rowsC[i];
                //console.log(current.replace(/\n/g," ").replace(/^\s|\s&|\t/g," "));
                var tmp = {
                    position: current.substring(0,2).trim(),
                    team: current.substring(2,17).trim(),
                    round: current.substring(17,19).trim(),
                    win: current.substring(20,22).trim(),
                    draw: current.substring(23,25).trim(),
                    loss: current.substring(26,28).trim(),
                    gm: current.substring(30,32).trim(),
                    im: current.substring(33,35).trim(),
                    points: current.substring(37,39).trim()
                };
                if(tmp.position == 12 || tmp.position == 13 || tmp.position == 14){
                    tmp.ms = (tmp.gm - tmp.im);
                    items.push(tmp);
                    }
            };
            var str = items.slice(0,16);
            // Write to json
            const to_string = '{ "result": { "round": "latest", "item":' + JSON.stringify(items) + '}}';
            res.json(to_string);
        }
	});
};

exports.damallsvenskan_standings = function(req, res) {
/* Scrape the table. */
	x('http://www.svt.se/svttext/web/pages/349.html',  '.sub',
	{
		rows: ['span']
	})(function(err, obj){
        if (err) {
            res.send(err);
        } else {      
            var items = [];
            for (var i = 4; i < obj.rows.length -3; i++) {
                var current = obj.rows[i];
                //At this point 'current' looks like this "PPTTTTTTTTTTTTTTTRR_WW_DD_LL__GS_GC__PP"
                var tmp = {
                    position: current.substring(0,2).trim(),
                    team: current.substring(2,17).trim(),
                    round: current.substring(17,19).trim(),
                    win: current.substring(20,22).trim(),
                    draw: current.substring(23,25).trim(),
                    loss: current.substring(26,28).trim(),
                    gm: current.substring(30,32).trim(),
                    im: current.substring(33,35).trim(),
                    points: current.substring(37,39).trim()
                };
                tmp.ms = (tmp.gm - tmp.im);
                items.push(tmp);
            };
            // Write to json
            const to_string = '{ "result": { "round": "latest", "item":' + JSON.stringify(items) + '}}';
            res.json(to_string);
        }
	});
};

exports.superettan_standings = function(req, res) {
/* Scrape the table. */
	x('http://www.svt.se/svttext/web/pages/345.html',  '.sub',
	{
		rows: ['span']
	})(function(err, obj){
        if (err) {
            res.send(err);
        } else {      
            var items = [];
            for (var i = 4; i < obj.rows.length -3; i++) {
                var current = obj.rows[i];
                //At this point 'current' looks like this "PPTTTTTTTTTTTTTTTRR_WW_DD_LL__GS_GC__PP"
                var tmp = {
                    position: current.substring(0,2).trim(),
                    team: current.substring(2,17).trim(),
                    round: current.substring(17,19).trim(),
                    win: current.substring(20,22).trim(),
                    draw: current.substring(23,25).trim(),
                    loss: current.substring(26,28).trim(),
                    gm: current.substring(30,32).trim(),
                    im: current.substring(33,35).trim(),
                    points: current.substring(37,39).trim()
                };
                tmp.ms = (tmp.gm - tmp.im);
                items.push(tmp);
            };
            // Write to json
            const to_string = '{ "result": { "round": "latest", "item":' + JSON.stringify(items) + '}}';
            res.json(to_string);
        }
	});
};