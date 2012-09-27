A stylus color management tool
============

Function:
============
	Extract all selectors that have color and background-color defined,
	and present each color set in a separate div.
	Meta-info like selector, from which .styl file, color definition, and etc are shown too.
Markers:
============
	[BF]: B means background-color is defined for this selector, F means foreground (font?) color is defined.
	[REPEAT]: The same color combination has already been defined in previous selector(s).

Usage:
============
	0. Install node.js and npm.
	1. Git clone https://github.com/dingcheng/StylusColor
	2. cd styluscolor
	3. npm install
	4. node app
	5. Go to http://localhost:3000
	6. Upload all your stylus files (only .styl accepted)
	7. Rock!