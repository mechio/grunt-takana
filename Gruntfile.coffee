"use strict"
module.exports = (grunt) ->
  grunt.initConfig
    coffee:
      compile:
        files:
          'tasks/takana.js'     : 'tasks/takana.coffee'
          'test/takana_test.js' : 'test/takana_test.coffee'

    takana:
      compile:
        files:
          "test/tmp/test.css": "test/fixtures/test.scss"

      include:
        options:
          includePaths: ["./test/fixtures/"]

        files:
          "test/tmp/test3.css": "test/fixtures/includePaths.scss"

    nodeunit:
      tasks: ["test/*_test.js"]

    clean:
      test: ["test/tmp"]

    watch:
      coffee:
        files: [
          './**/*.coffee'
        ]
        tasks: ['default']

  grunt.loadTasks "tasks"
  grunt.loadNpmTasks "grunt-contrib-clean"
  grunt.loadNpmTasks "grunt-contrib-nodeunit"
  grunt.loadNpmTasks "grunt-contrib-coffee"
  grunt.loadNpmTasks 'grunt-contrib-watch'

  grunt.registerTask "default", ["clean", "coffee", "takana", "nodeunit", "clean"]