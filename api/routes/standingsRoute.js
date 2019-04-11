'use strict';
module.exports = function(app) {
  var standings = require('../controllers/standingsController');


  // standings Routes
  app.route('/as')
    .get(standings.allsvenskan_standings)
  app.route('/as/topscorers')
    .get(standings.allsvenskan_topscorers)
  app.route('/el')
    .get(standings.elitettan_standings)
  app.route('/das')
    .get(standings.damallsvenskan_standings)  
  app.route('/se')
    .get(standings.superettan_standings)
};