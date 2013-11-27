'use strict';
module.exports = function (grunt) {
	grunt.initConfig({
		takana: {
			
		},
		sass: {
			compile: {
				files: {
					'destination/style.css': 'source/test.scss'
				}
			},
			includePaths: {
				options: {
					'includePaths': ['./source/sasslibs']
				},
				files: {
					'destination/style.css': 'source/test.scss'
				}
			}
		}
	});

	grunt.loadTasks('tasks');
	grunt.loadNpmTasks('grunt-takana');
	grunt.loadNpmTasks('grunt-sass');
	grunt.registerTask('default', ['sass']);
};