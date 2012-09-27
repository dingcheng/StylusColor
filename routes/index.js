
/*
 * GET home page.
 */
var fs = require('fs');

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
	for(var key in req.files.stylus){
		console.log(key);
		var styl = req.files.stylus[key];
		if (!styl.filename.match(/.styl/)) {continue};
		fcon = fs.readFileSync(styl.path,'utf8');
		var lines = fcon.split('\n');
		var prevline = lines[0];
		for(var linenum in lines){
			line = lines[linenum];
			if (indentlevel(line)>curlevel) {
				stack.push(prevline);
			}
			else if(indentlevel(line)<curlevel){
				for (var i = 0; i < curlevel-indentlevel(line); i++) {
					stack.pop();
				}
				curstyle='';
			}
			curlevel=indentlevel(line);
			if (line.match(/color/)) {
				var selector = stack.join('>');
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
				colors[selector].style+=line.replace(/^\s\s*/, '').split('//')[0]+';';
				curstyle=colors[selector].style;
				if (curstyle in colorset) {colors[selector].repeat=true};
				colorset[curstyle]=1;
			}
			prevline = line;
		}
	}
	res.render('result',{title:'My style colors',colors:colors});
}