var glob = require('glob');

var tasks = glob.sync('./gulp/**/task.js');

tasks.forEach(function (task) {
  require(task);
});