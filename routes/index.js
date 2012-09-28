
/*
 * GET home page.
 */
var fs = require('fs');
var variables = {};

function extrvar(str){
	if (str.match(/=/)){
		var toks = str.split('=');
		if (toks.length<2) {return false};
		variables[toks[0]]=toks[1];
		return true;
	}
	return false;
}

function indentlevel(line){
	return line.split(/[^ \t\r\n]/)[0].length;
}

exports.index = function(req, res){
	res.render('index', { title: 'Express' });
};

exports.getfiles=function(req,res){
	res.render('getfiles',{title: 'Upload your stylus files'});
};

exports.proc=function(req,res){
	var colors={};
	var fcon='';
	var stack=[];
	var prevlevel=0,curlevel=0,prevline='';
	var colorset={},curstyle;
	// For each file in the uploads
	for(var key in req.files.stylus){
		//Extract file meta info
		if (!req.files.stylus[key]) {break};
		var styl = req.files.stylus[key];
		if (!styl.filename.match(/.styl/)) {continue};//accept only .styl
		fcon = fs.readFileSync(styl.path,'utf8');//read file
		var lines = fcon.split('\n');
		//var prevline = lines[0].replace(/[\s]/g,'').split('//')[0];
		// For each line in the file
		for(var linenum in lines){
			line = lines[linenum];
			var level = indentlevel(line);
			line = line.replace(/[\s]/g,'').split('//')[0];
			// Detect variable definition, if yes, continue
			if (extrvar(line))
				continue;
			// If it goes into deeper level, push previous line as parent
			if (level>curlevel)
				stack.push(prevline);
			else if(level<curlevel){
				// If exiting out of level(s), pop parents out
				for (var i = 0; i < curlevel-level; i++)
					stack.pop();
				curstyle='';
			}
			curlevel=level;
			// If 'color' is matched in the string, extract this line
			if (line.match(/color/)) {
				var selector = stack.join('>');
				var toks = line.split(':');
				if (toks[1] in variables)
					line = toks[0]+': '+variables[toks[1]];
				else
					line = toks.join(': ');
				if (!(selector in colors)){
					colors[selector]={};
					colors[selector].place=[];
					colors[selector].style='';
					colors[selector].c='';
				}
				colors[selector].place.push({file:styl.filename,line:linenum})
				if (line.match(/background/)) {
					colors[selector].c+='B';
				}
				else
					colors[selector].c+='F';
				colors[selector].style+=line+';';
				curstyle=colors[selector].style;
				if (curstyle in colorset) {colors[selector].repeat=true};
				colorset[curstyle]=1;
			}
			prevline = line;
		}
	}
	res.render('result',{title:'My style colors',colors:colors});
}