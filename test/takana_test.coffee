"use strict"
grunt = require("grunt")
exports.takana =
  compile: (test) ->
    test.expect 1
    actual = grunt.file.read("test/tmp/test.css")
    expected = grunt.file.read("test/expected/test.css")
    test.equal actual, expected, "should compile SCSS to CSS"
    test.done()

  import: (test) ->
    test.expect 1
    actual = grunt.file.read("test/tmp/test3.css")
    expected = grunt.file.read("test/expected/test.css")
    test.equal actual, expected, "should compile SCSS to CSS with options"
    test.done()