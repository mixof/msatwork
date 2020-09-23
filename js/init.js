// Easing equation, borrowed from jQuery easing plugin
// http://gsgd.co.uk/sandbox/jquery/easing/
jQuery.easing.easeOutQuart = function (x, t, b, c, d) {
	return -c * ((t=t/d-1)*t*t*t - 1) + b;
};

jQuery(function( $ ){
	$('.tabs a.tab_a').click(function(){
		$(this).parent().find('ul').slideToggle();
	});
	
	/* 
	malihu custom scrollbar function parameters: 
	1) scroll type (values: "vertical" or "horizontal")
	2) scroll easing amount (0 for no easing) 
	3) scroll easing type 
	4) extra bottom scrolling space for vertical scroll type only (minimum value: 1)
	5) scrollbar height/width adjustment (values: "auto" or "fixed")
	6) mouse-wheel support (values: "yes" or "no")
	7) scrolling via buttons support (values: "yes" or "no")
	8) buttons scrolling speed (values: 1-20, 1 being the slowest)
	$("#mcs_container1").mCustomScrollbar("vertical",400,"easeOutCirc",1.05,"auto","yes","no",5);
	$("#popup_desc_text").mCustomScrollbar("vertical",400,"easeOutCirc",1.05,"auto","yes","no",5);
	 */
});	



 
