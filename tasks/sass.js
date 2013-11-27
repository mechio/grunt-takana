'use strict';
var sass = require('node-sass');
var async = require('async');
var ws = require('websocket').client;
var path = require('path');
var shell = require('shelljs');

module.exports = function (grunt) {
	var takana = {
		createOrUpdateProject: function(options, callback) {
			var message = {
				event: 'project/createOrUpdate',
				data: {
					name: ( options.name || this.projectName() ),
					path: ( options.path || this.projectPath() ),
					includePaths: options.includePaths || [] 
				}
			}
			this.notify(message, function(sent) {
				if (sent) {
					grunt.log.ok('\'' + message.data.name + '\' linked with Takana! :)\n');

					grunt.log.writeln('\n******** Integration instructions ********')
					grunt.log.oklns('To live-edit CSS and SCSS on your webpage');
					grunt.log.ok('1. Add this JavaScript code just before </body> on all webpages you would like to live-edit');
					grunt.log.writeln('	<script src=\'http://localhost:48626/takana.js\' data-project=\'' + takana.projectName() + '\'></script>');
					grunt.log.oklns('2. Refresh your browser');
					grunt.log.oklns('3. Edit CSS or SCSS in Sublime Text');
					grunt.log.oklns('4. See your styles applied in real-time. And watch the money roll in ;)');
				}
				callback();
			});
		},

		refresh: function(options, callback) {
			var message = {
				event: 'project/refresh',
				data: {
					name: ( options.name || this.projectName() )
				}
			}

			this.notify(message, function(sent) {
				if (sent) {
					grunt.log.writeln('>> refreshed');
				}

				callback();
			});
		},

		notify: function(message, callback) {
			this.connect(function(connection) {
				if (connection) {
					connection.send(JSON.stringify(message));
					callback(true);
				} else {
					callback(false);	
				}
			});
		},

		connect: function(callback) {
			var client = new ws();
			client.on('connect', function(connection) {
				callback(connection);
			});
			client.on('connectFailed', function() {
				grunt.log.errorlns('could not connect to Takana, is it installed and running? visit http://usetakana.com to get the app');
				callback(null);
			});
			client.connect('ws://localhost:48626/control');
		},

		projectName: function() {
			return path.basename(this.projectPath());
		},

		projectPath: function() {
			return process.cwd();
		}
	}

	grunt.registerTask('takana:refresh', 'Refresh webpages for this project', function() {
		takana.refresh({}, this.async());
	});

	grunt.registerTask('takana:link', 'Links the current directory to Takana.', function() {
		var done = this.async();
		takana.createOrUpdateProject({}, this.async());
	});
};
