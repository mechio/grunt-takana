(function() {
  "use strict";
  var grunt;

  grunt = require("grunt");

  exports.takana = {
    compile: function(test) {
      var actual, expected;
      test.expect(1);
      actual = grunt.file.read("test/tmp/test.css");
      expected = grunt.file.read("test/expected/test.css");
      test.equal(actual, expected, "should compile SCSS to CSS");
      return test.done();
    },
    "import": function(test) {
      var actual, expected;
      test.expect(1);
      actual = grunt.file.read("test/tmp/test.css");
      expected = grunt.file.read("test/expected/include_path.css");
      test.equal(actual, expected, "should compile SCSS to CSS with options");
      return test.done();
    }
  };

}).call(this);
