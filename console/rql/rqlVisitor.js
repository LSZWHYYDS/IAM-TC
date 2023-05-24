// Generated from /storage/wayne/git/rql2querydsl/rql2querydsl-util/src/grammer/rql.g4 by ANTLR 4.7
// jshint ignore: start
var antlr4 = require('../antlr4/index');
import util from "../common/util";

// This class defines a complete generic visitor for a parse tree produced by rqlParser.

function rqlVisitor(tree) {
  antlr4.tree.ParseTreeVisitor.call(this);
  this.not = false;
  this.tree = tree;
  this.id = 1;
	return this;
}

rqlVisitor.prototype = Object.create(antlr4.tree.ParseTreeVisitor.prototype);
rqlVisitor.prototype.constructor = rqlVisitor;

// Visit a parse tree produced by rqlParser#str.
rqlVisitor.prototype.visitStr = function(ctx) {
  const expr = {not: this.not, attr: ctx.AttrName().getText(), op: ctx.op.text, literal: ctx.StringLiteral().getText()};
  this.not = false;
  const node = this.tree.parse({id:this.id++, expr: expr});
  return node;
};

// Visit a parse tree produced by rqlParser#not.
rqlVisitor.prototype.visitNot = function(ctx) {
  this.not = true;
  return this.visit(ctx.expr());
};


// Visit a parse tree produced by rqlParser#parens.
rqlVisitor.prototype.visitParens = function(ctx) {
  return this.visit(ctx.expr());
};


// Visit a parse tree produced by rqlParser#or.
rqlVisitor.prototype.visitOr = function(ctx) {
  const operator = "or";
  const node = this.tree.parse({id:this.id++, operator: operator});
  node.addChild(this.visit(ctx.expr(0)));
  node.addChild(this.visit(ctx.expr(1)));
  return node;
};


// Visit a parse tree produced by rqlParser#bool.
rqlVisitor.prototype.visitBool = function(ctx) {
  const expr = {not: this.not, attr: ctx.AttrName().getText(), op: ctx.op.text, literal: ctx.BooleanLiteral().getText()};
  this.not = false;
  const node = this.tree.parse({id:this.id++, expr: expr});
  return node;
};


// Visit a parse tree produced by rqlParser#and.
rqlVisitor.prototype.visitAnd = function(ctx) {
  const operator = "and";
  const node = this.tree.parse({id:this.id++, operator: operator});
  node.addChild(this.visit(ctx.expr(0)));
  node.addChild(this.visit(ctx.expr(1)));
  return node;
};


// Visit a parse tree produced by rqlParser#int.
rqlVisitor.prototype.visitInt = function(ctx) {
  const expr = {not: this.not, attr: ctx.AttrName().getText(), op: ctx.op.text, literal: ctx.IntegerLiteral().getText()};
  this.not = false;
  const node = this.tree.parse({id:this.id++, expr: expr});
  return node;
};

exports.rqlVisitor = rqlVisitor;
