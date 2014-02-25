'use strict';

var grunt = require('grunt');
var sh = require('execSync');

exports.takana = {
  setUp: function(done) {
    done();
  },
  options: function(test) {
    test.expect(2);

    var result = sh.exec('grunt takana');

    test.equal(result.code, 0, ' successfully completed');
    test.equal(result.stdout,  '\u001b[4mRunning "takana" task\u001b[24m\n\n\u001b[1mTakana\u001b[22m\n\u001b[32m>> \u001b[39mbackground process active\n\u001b[32m>> \u001b[39mlinked \'/Users/nc/Workspace/grunt-takana\'\n\n\u001b[1mInstall Takana (you only need to do this once per project)\u001b[22m\n1) add this JavaScript code just before the \'</body>\' tag on your webpages\n\n<script>var a=document.createElement("script");a.setAttribute("type","text/javascript");a.setAttribute("src","http://"+window.location.hostname+":48626/takana.js");a.setAttribute("data-project","grunt-takana");document.body.appendChild(a);</script>\n\n3) Refresh your browser\n4) Edit CSS or SCSS in Sublime Text\n5) See your styles applied in real-time.\n\n\u001b[32mDone, without errors.\u001b[39m\n', ' stdout');

    test.done();
  }
};
