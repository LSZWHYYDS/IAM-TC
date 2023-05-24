// Generated from /storage/wayne/git/rql2querydsl/rql2querydsl-util/src/grammer/rql.g4 by ANTLR 4.7
// jshint ignore: start
var antlr4 = require('../antlr4/index');

// This class defines a complete listener for a parse tree produced by rqlParser.
function rqlListener() {
	antlr4.tree.ParseTreeListener.call(this);
	return this;
}

rqlListener.prototype = Object.create(antlr4.tree.ParseTreeListener.prototype);
rqlListener.prototype.constructor = rqlListener;

// Enter a parse tree produced by rqlParser#str.
rqlListener.prototype.enterStr = function(ctx) {
};

// Exit a parse tree produced by rqlParser#str.
rqlListener.prototype.exitStr = function(ctx) {
};


// Enter a parse tree produced by rqlParser#not.
rqlListener.prototype.enterNot = function(ctx) {
};

// Exit a parse tree produced by rqlParser#not.
rqlListener.prototype.exitNot = function(ctx) {
};


// Enter a parse tree produced by rqlParser#parens.
rqlListener.prototype.enterParens = function(ctx) {
};

// Exit a parse tree produced by rqlParser#parens.
rqlListener.prototype.exitParens = function(ctx) {
};


// Enter a parse tree produced by rqlParser#or.
rqlListener.prototype.enterOr = function(ctx) {
};

// Exit a parse tree produced by rqlParser#or.
rqlListener.prototype.exitOr = function(ctx) {
};


// Enter a parse tree produced by rqlParser#bool.
rqlListener.prototype.enterBool = function(ctx) {
};

// Exit a parse tree produced by rqlParser#bool.
rqlListener.prototype.exitBool = function(ctx) {
};


// Enter a parse tree produced by rqlParser#and.
rqlListener.prototype.enterAnd = function(ctx) {
};

// Exit a parse tree produced by rqlParser#and.
rqlListener.prototype.exitAnd = function(ctx) {
};


// Enter a parse tree produced by rqlParser#int.
rqlListener.prototype.enterInt = function(ctx) {
};

// Exit a parse tree produced by rqlParser#int.
rqlListener.prototype.exitInt = function(ctx) {
};



exports.rqlListener = rqlListener;