Array.min=function(array){
	return Math.min.apply(Math,array);
}
Array.max=function(array){
	return Math.max.apply(Math,array);
}
var numcols=0;
function reposition(container,item,m,iw){
	var pa=$(container).parent(),
		cw=$(pa).width(),
		x = Math.floor((cw-m)/(iw+m)),
		idw = x*(iw+m)+m;
	if (numcols==x) {
		$(container).width(idw);
		return;
	};
	numcols=x;
	var arr=[],
		col=0,
		maxch=0,
		ch=$(pa).height();
	for (var i = 0; i < x; i++)
		arr.push(m);
	$(item).each(function(){
		col = arr.indexOf(Array.min(arr));
		$(this).animate({'top':arr[col]+m,'left': m+col*(iw+m)},200);
		arr[col] += m+$(this).outerHeight();
	});
	maxch=Array.max(arr)+m;
	if (ch!=maxch){
		$(container).height(maxch);
	}
	$(container).width(idw);
}
$(document).ready(function(){
	var con = $('#container'),
		ite = $('.item'),
		iw = ite.first().outerWidth(),
		m = 10;
	reposition(con,ite,m,iw);
	function cbrepos(){
		reposition(con,ite,m,iw);
	}
	$(window).resize(cbrepos);
})