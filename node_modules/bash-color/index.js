var bash_codes = exports.bash_codes = {
	"BLACK" : {
		"text" : "\033[0;30m",
		"underline": "\033[4;30m",
		"background": "\033[40m",
		"bold":"\033[1;30m",
		"hi_text":"\033[0;90m",
		"hi_bold" : "\033[1;90m",
		"hi_background" : "\033[0;100m"
	},
	"RED" : {
		"text" : "\033[0;31m",
		"bold":"\033[1;31m",
		"underline": "\033[4;31m",
		"background": "\033[41m",
		"hi_text":"\033[0;91m",
		"hi_bold" : "\033[1;91m",
		"hi_background" : "\033[0;101m"
	},
	"GREEN" : {
		"text" : "\033[0;32m",
		"bold":"\033[1;32m",
		"underline": "\033[4;32m",
		"background": "\033[42m",
		"hi_text":"\033[0;92m",
		"hi_bold" : "\033[1;92m",
		"hi_background" : "\033[0;102m"
	},
	"YELLOW" : {
		"text" : "\033[0;33m",
		"bold":"\033[1;33m",
		"underline": "\033[4;33m",
		"background": "\033[43m",
		"hi_text":"\033[0;93m",
		"hi_bold" : "\033[1;93m",
		"hi_background" : "\033[0;103m"
	},
	"BLUE" : {
		"text" : "\033[0;34m",
		"bold":"\033[1;34m",
		"underline": "\033[4;34m",
		"background": "\033[44m",
		"hi_text":"\033[0;94m",
		"hi_bold" : "\033[1;94m",
		"hi_background" : "\033[0;104m"
	},
	"PURPLE" : {
		"text" : "\033[0;35m",
		"bold":"\033[1;35m",
		"underline": "\033[4;35m",
		"background": "\033[45m",
		"hi_text":"\033[0;95m",
		"hi_bold" : "\033[1;95m",
		"hi_background" : "\033[0;105m"
	},
	"CYAN" : {
		"text" : "\033[0;36m",
		"bold":"\033[1;36m",
		"underline": "\033[4;36m",
		"background": "\033[46m",
		"hi_text":"\033[0;96m",
		"hi_bold" : "\033[1;96m",
		"hi_background" : "\033[0;106m"
	},
	"WHITE" : {
		"text" : "\033[0;37m",
		"bold":"\033[1;37m",
		"underline": "\033[4;37m",
		"background": "\033[47m",
		"hi_text":"\033[0;97m",
		"hi_bold" : "\033[1;97m",
		"hi_background" : "\033[0;107m"
	}
};

exports.colors = {
	BLACK: "BLACK",
	RED: "RED",
	GREEN: "GREEN",
	YELLOW: "YELLOW",
	BLUE: "BLUE",
	PURPLE: "PURPLE",
	CYAN: "CYAN",
	WHITE: "WHITE"
};

var styles = exports.styles = {
	bold: "bold",
	underline: "underline",
	background: "background",
	hi_text: "hi_text",
	hi_bold: "hi_bold",
	hi_background: "hi_background"
};

var REMOVE_COLOR = exports.REMOVE_COLOR = "\033[0m";


// various logical inconsistencies in the code below - renderColor and wrap seem like they should be combined, but I'm letting wrap basically stand on its own
// in case anyone wants access to explicitly handle background or underline stuff. I feel like those are a bit more special-casey, and generally speakign
// users are going to want to quickly turn a word or phrase into a single color without worrying about background or underline. So the .colorName methods
// are just syntactic sugar.
exports.wrap = function(str, color, style) {
	var c = bash_codes[color.toUpperCase()];
	var s = styles[style] || "text";
	
	return render(c[s], str);
};

exports.black = function(str, hi) {
	return renderColor(str, bash_codes.BLACK, hi);
};

exports.red = function(str, hi) {
	return renderColor(str, bash_codes.RED, hi);
};

exports.green = function(str, hi) {
	return renderColor(str, bash_codes.GREEN, hi);
};

exports.yellow = function(str, hi) {
	return renderColor(str, bash_codes.YELLOW, hi);
};

exports.blue = function(str, hi) {
	return renderColor(str, bash_codes.BLUE, hi);
};

exports.purple = function(str, hi) {
	return renderColor(str, bash_codes.PURPLE, hi);
};

exports.cyan = function(str, hi) {
	return renderColor(str, bash_codes.CYAN, hi);
};

exports.white = function(str, hi) {
	return renderColor(str, bash_codes.WHITE, hi);
};


function renderColor(str, color, hi) {
	return render(hi ? color.hi_text : color.text, str);
}

function render(code, str) {
	return code + str + REMOVE_COLOR;
}