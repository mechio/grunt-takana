# grunt-takana

> Live edit SCSS and CSS stylesheets

Grunt plugin for Takana. If you're not using grunt, head over to [mechio/takana](https://github.com/mechio/takana) and follow the CLI instructions there.

# Getting started

#### 1. Install the plugin
```
npm install grunt-takana
```

#### 2. Add this snippet to your Gruntfile
```
grunt.loadNpmTasks('grunt-takana');
```

#### 3. Run takana from the root of your project folder

```
grunt takana
```

#### 4. Add the JavaScript snippit to any page you want to live update

```
<script type="text/javascript" src="http://localhost:48626/takana.js"></script>
```

Now just open the web page that you pasted the snippit into. Then open one of its stylesheets in Sublime and start live-editing!

# Options

#### includePaths

Type: `Array`   
Default: `[]`

Import paths to include, the same option grunt-sass uses.

#### path

Type: `String`  
Default: `current working directory`

Root project folder containing the stylesheets.
