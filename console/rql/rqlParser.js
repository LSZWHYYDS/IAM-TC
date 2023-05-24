// Generated from /storage/wayne/git/rql2querydsl/rql2querydsl-util/src/grammer/rql.g4 by ANTLR 4.7
// jshint ignore: start
var antlr4 = require('../antlr4/index');
var rqlListener = require('./rqlListener').rqlListener;
var rqlVisitor = require('./rqlVisitor').rqlVisitor;

var grammarFileName = "rql.g4";

var serializedATN = ["\u0003\u608b\ua72a\u8133\ub9ed\u417c\u3be7\u7786\u5964",
    "\u0003q%\u0004\u0002\t\u0002\u0003\u0002\u0003\u0002\u0003\u0002\u0003",
    "\u0002\u0003\u0002\u0003\u0002\u0003\u0002\u0003\u0002\u0003\u0002\u0003",
    "\u0002\u0003\u0002\u0003\u0002\u0003\u0002\u0003\u0002\u0003\u0002\u0003",
    "\u0002\u0003\u0002\u0003\u0002\u0003\u0002\u0005\u0002\u0018\n\u0002",
    "\u0003\u0002\u0003\u0002\u0003\u0002\u0003\u0002\u0003\u0002\u0003\u0002",
    "\u0007\u0002 \n\u0002\f\u0002\u000e\u0002#\u000b\u0002\u0003\u0002\u0002",
    "\u0003\u0002\u0003\u0002\u0002\u0004\u0003\u0002\u0006\u000b\u0004\u0002",
    "\u0006\u0007\f\u000e\u0002)\u0002\u0017\u0003\u0002\u0002\u0002\u0004",
    "\u0005\b\u0002\u0001\u0002\u0005\u0006\u0007\u0003\u0002\u0002\u0006",
    "\u0007\u0007G\u0002\u0002\u0007\b\u0005\u0002\u0002\u0002\b\t\u0007",
    "H\u0002\u0002\t\u0018\u0003\u0002\u0002\u0002\n\u000b\u0007l\u0002\u0002",
    "\u000b\f\t\u0002\u0002\u0002\f\u0018\u0007A\u0002\u0002\r\u000e\u0007",
    "l\u0002\u0002\u000e\u000f\t\u0003\u0002\u0002\u000f\u0018\u0007E\u0002",
    "\u0002\u0010\u0011\u0007l\u0002\u0002\u0011\u0012\u0007\u0006\u0002",
    "\u0002\u0012\u0018\u0007C\u0002\u0002\u0013\u0014\u0007G\u0002\u0002",
    "\u0014\u0015\u0005\u0002\u0002\u0002\u0015\u0016\u0007H\u0002\u0002",
    "\u0016\u0018\u0003\u0002\u0002\u0002\u0017\u0004\u0003\u0002\u0002\u0002",
    "\u0017\n\u0003\u0002\u0002\u0002\u0017\r\u0003\u0002\u0002\u0002\u0017",
    "\u0010\u0003\u0002\u0002\u0002\u0017\u0013\u0003\u0002\u0002\u0002\u0018",
    "!\u0003\u0002\u0002\u0002\u0019\u001a\f\t\u0002\u0002\u001a\u001b\u0007",
    "\u0004\u0002\u0002\u001b \u0005\u0002\u0002\n\u001c\u001d\f\b\u0002",
    "\u0002\u001d\u001e\u0007\u0005\u0002\u0002\u001e \u0005\u0002\u0002",
    "\t\u001f\u0019\u0003\u0002\u0002\u0002\u001f\u001c\u0003\u0002\u0002",
    "\u0002 #\u0003\u0002\u0002\u0002!\u001f\u0003\u0002\u0002\u0002!\"\u0003",
    "\u0002\u0002\u0002\"\u0003\u0003\u0002\u0002\u0002#!\u0003\u0002\u0002",
    "\u0002\u0005\u0017\u001f!"].join("");


var atn = new antlr4.atn.ATNDeserializer().deserialize(serializedATN);

var decisionsToDFA = atn.decisionToState.map( function(ds, index) { return new antlr4.dfa.DFA(ds, index); });

var sharedContextCache = new antlr4.PredictionContextCache();

var literalNames = [ null, "'not'", "'and'", "'or'", "'eq'", "'ne'", "'gt'", 
                     "'ge'", "'lt'", "'le'", "'has'", "'sw'", "'ew'", "'abstract'", 
                     "'assert'", "'boolean'", "'break'", "'byte'", "'case'", 
                     "'catch'", "'char'", "'class'", "'const'", "'continue'", 
                     "'default'", "'do'", "'double'", "'else'", "'enum'", 
                     "'extends'", "'final'", "'finally'", "'float'", "'for'", 
                     "'if'", "'goto'", "'implements'", "'import'", "'instanceof'", 
                     "'int'", "'interface'", "'long'", "'native'", "'new'", 
                     "'package'", "'private'", "'protected'", "'public'", 
                     "'return'", "'short'", "'static'", "'strictfp'", "'super'", 
                     "'switch'", "'synchronized'", "'this'", "'throw'", 
                     "'throws'", "'transient'", "'try'", "'void'", "'volatile'", 
                     "'while'", null, null, null, null, null, "'null'", 
                     "'('", "')'", "'{'", "'}'", "'['", "']'", "';'", "','", 
                     "'.'", "'='", "'!'", "'~'", "'?'", "':'", "'=='", "'!='", 
                     "'++'", "'--'", "'+'", "'-'", "'*'", "'/'", "'&'", 
                     "'|'", "'^'", "'%'", "'+='", "'-='", "'*='", "'/='", 
                     "'&='", "'|='", "'^='", "'%='", "'<<='", "'>>='", "'>>>='", 
                     null, "'@'", "'...'" ];

var symbolicNames = [ null, "NOT", "AND", "OR", "EQ", "NE", "GT", "GE", 
                      "LT", "LE", "HAS", "SW", "EW", "ABSTRACT", "ASSERT", 
                      "BOOLEAN", "BREAK", "BYTE", "CASE", "CATCH", "CHAR", 
                      "CLASS", "CONST", "CONTINUE", "DEFAULT", "DO", "DOUBLE", 
                      "ELSE", "ENUM", "EXTENDS", "FINAL", "FINALLY", "FLOAT", 
                      "FOR", "IF", "GOTO", "IMPLEMENTS", "IMPORT", "INSTANCEOF", 
                      "INT", "INTERFACE", "LONG", "NATIVE", "NEW", "PACKAGE", 
                      "PRIVATE", "PROTECTED", "PUBLIC", "RETURN", "SHORT", 
                      "STATIC", "STRICTFP", "SUPER", "SWITCH", "SYNCHRONIZED", 
                      "THIS", "THROW", "THROWS", "TRANSIENT", "TRY", "VOID", 
                      "VOLATILE", "WHILE", "IntegerLiteral", "FloatingPointLiteral", 
                      "BooleanLiteral", "CharacterLiteral", "StringLiteral", 
                      "NullLiteral", "LPAREN", "RPAREN", "LBRACE", "RBRACE", 
                      "LBRACK", "RBRACK", "SEMI", "COMMA", "DOT", "ASSIGN", 
                      "BANG", "TILDE", "QUESTION", "COLON", "EQUAL", "NOTEQUAL", 
                      "INC", "DEC", "ADD", "SUB", "MUL", "DIV", "BITAND", 
                      "BITOR", "CARET", "MOD", "ADD_ASSIGN", "SUB_ASSIGN", 
                      "MUL_ASSIGN", "DIV_ASSIGN", "AND_ASSIGN", "OR_ASSIGN", 
                      "XOR_ASSIGN", "MOD_ASSIGN", "LSHIFT_ASSIGN", "RSHIFT_ASSIGN", 
                      "URSHIFT_ASSIGN", "AttrName", "AT", "ELLIPSIS", "WS", 
                      "COMMENT", "LINE_COMMENT" ];

var ruleNames =  [ "expr" ];

function rqlParser (input) {
	antlr4.Parser.call(this, input);
    this._interp = new antlr4.atn.ParserATNSimulator(this, atn, decisionsToDFA, sharedContextCache);
    this.ruleNames = ruleNames;
    this.literalNames = literalNames;
    this.symbolicNames = symbolicNames;
    return this;
}

rqlParser.prototype = Object.create(antlr4.Parser.prototype);
rqlParser.prototype.constructor = rqlParser;

Object.defineProperty(rqlParser.prototype, "atn", {
	get : function() {
		return atn;
	}
});

rqlParser.EOF = antlr4.Token.EOF;
rqlParser.NOT = 1;
rqlParser.AND = 2;
rqlParser.OR = 3;
rqlParser.EQ = 4;
rqlParser.NE = 5;
rqlParser.GT = 6;
rqlParser.GE = 7;
rqlParser.LT = 8;
rqlParser.LE = 9;
rqlParser.HAS = 10;
rqlParser.SW = 11;
rqlParser.EW = 12;
rqlParser.ABSTRACT = 13;
rqlParser.ASSERT = 14;
rqlParser.BOOLEAN = 15;
rqlParser.BREAK = 16;
rqlParser.BYTE = 17;
rqlParser.CASE = 18;
rqlParser.CATCH = 19;
rqlParser.CHAR = 20;
rqlParser.CLASS = 21;
rqlParser.CONST = 22;
rqlParser.CONTINUE = 23;
rqlParser.DEFAULT = 24;
rqlParser.DO = 25;
rqlParser.DOUBLE = 26;
rqlParser.ELSE = 27;
rqlParser.ENUM = 28;
rqlParser.EXTENDS = 29;
rqlParser.FINAL = 30;
rqlParser.FINALLY = 31;
rqlParser.FLOAT = 32;
rqlParser.FOR = 33;
rqlParser.IF = 34;
rqlParser.GOTO = 35;
rqlParser.IMPLEMENTS = 36;
rqlParser.IMPORT = 37;
rqlParser.INSTANCEOF = 38;
rqlParser.INT = 39;
rqlParser.INTERFACE = 40;
rqlParser.LONG = 41;
rqlParser.NATIVE = 42;
rqlParser.NEW = 43;
rqlParser.PACKAGE = 44;
rqlParser.PRIVATE = 45;
rqlParser.PROTECTED = 46;
rqlParser.PUBLIC = 47;
rqlParser.RETURN = 48;
rqlParser.SHORT = 49;
rqlParser.STATIC = 50;
rqlParser.STRICTFP = 51;
rqlParser.SUPER = 52;
rqlParser.SWITCH = 53;
rqlParser.SYNCHRONIZED = 54;
rqlParser.THIS = 55;
rqlParser.THROW = 56;
rqlParser.THROWS = 57;
rqlParser.TRANSIENT = 58;
rqlParser.TRY = 59;
rqlParser.VOID = 60;
rqlParser.VOLATILE = 61;
rqlParser.WHILE = 62;
rqlParser.IntegerLiteral = 63;
rqlParser.FloatingPointLiteral = 64;
rqlParser.BooleanLiteral = 65;
rqlParser.CharacterLiteral = 66;
rqlParser.StringLiteral = 67;
rqlParser.NullLiteral = 68;
rqlParser.LPAREN = 69;
rqlParser.RPAREN = 70;
rqlParser.LBRACE = 71;
rqlParser.RBRACE = 72;
rqlParser.LBRACK = 73;
rqlParser.RBRACK = 74;
rqlParser.SEMI = 75;
rqlParser.COMMA = 76;
rqlParser.DOT = 77;
rqlParser.ASSIGN = 78;
rqlParser.BANG = 79;
rqlParser.TILDE = 80;
rqlParser.QUESTION = 81;
rqlParser.COLON = 82;
rqlParser.EQUAL = 83;
rqlParser.NOTEQUAL = 84;
rqlParser.INC = 85;
rqlParser.DEC = 86;
rqlParser.ADD = 87;
rqlParser.SUB = 88;
rqlParser.MUL = 89;
rqlParser.DIV = 90;
rqlParser.BITAND = 91;
rqlParser.BITOR = 92;
rqlParser.CARET = 93;
rqlParser.MOD = 94;
rqlParser.ADD_ASSIGN = 95;
rqlParser.SUB_ASSIGN = 96;
rqlParser.MUL_ASSIGN = 97;
rqlParser.DIV_ASSIGN = 98;
rqlParser.AND_ASSIGN = 99;
rqlParser.OR_ASSIGN = 100;
rqlParser.XOR_ASSIGN = 101;
rqlParser.MOD_ASSIGN = 102;
rqlParser.LSHIFT_ASSIGN = 103;
rqlParser.RSHIFT_ASSIGN = 104;
rqlParser.URSHIFT_ASSIGN = 105;
rqlParser.AttrName = 106;
rqlParser.AT = 107;
rqlParser.ELLIPSIS = 108;
rqlParser.WS = 109;
rqlParser.COMMENT = 110;
rqlParser.LINE_COMMENT = 111;

rqlParser.RULE_expr = 0;

function ExprContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = rqlParser.RULE_expr;
    return this;
}

ExprContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
ExprContext.prototype.constructor = ExprContext;


 
ExprContext.prototype.copyFrom = function(ctx) {
    antlr4.ParserRuleContext.prototype.copyFrom.call(this, ctx);
};

function StrContext(parser, ctx) {
	ExprContext.call(this, parser);
    this.op = null; // Token;
    ExprContext.prototype.copyFrom.call(this, ctx);
    return this;
}

StrContext.prototype = Object.create(ExprContext.prototype);
StrContext.prototype.constructor = StrContext;

rqlParser.StrContext = StrContext;

StrContext.prototype.AttrName = function() {
    return this.getToken(rqlParser.AttrName, 0);
};

StrContext.prototype.StringLiteral = function() {
    return this.getToken(rqlParser.StringLiteral, 0);
};

StrContext.prototype.EQ = function() {
    return this.getToken(rqlParser.EQ, 0);
};

StrContext.prototype.NE = function() {
    return this.getToken(rqlParser.NE, 0);
};

StrContext.prototype.HAS = function() {
    return this.getToken(rqlParser.HAS, 0);
};

StrContext.prototype.SW = function() {
    return this.getToken(rqlParser.SW, 0);
};

StrContext.prototype.EW = function() {
    return this.getToken(rqlParser.EW, 0);
};
StrContext.prototype.enterRule = function(listener) {
    if(listener instanceof rqlListener ) {
        listener.enterStr(this);
	}
};

StrContext.prototype.exitRule = function(listener) {
    if(listener instanceof rqlListener ) {
        listener.exitStr(this);
	}
};

StrContext.prototype.accept = function(visitor) {
    if ( visitor instanceof rqlVisitor ) {
        return visitor.visitStr(this);
    } else {
        return visitor.visitChildren(this);
    }
};


function NotContext(parser, ctx) {
	ExprContext.call(this, parser);
    ExprContext.prototype.copyFrom.call(this, ctx);
    return this;
}

NotContext.prototype = Object.create(ExprContext.prototype);
NotContext.prototype.constructor = NotContext;

rqlParser.NotContext = NotContext;

NotContext.prototype.NOT = function() {
    return this.getToken(rqlParser.NOT, 0);
};

NotContext.prototype.expr = function() {
    return this.getTypedRuleContext(ExprContext,0);
};
NotContext.prototype.enterRule = function(listener) {
    if(listener instanceof rqlListener ) {
        listener.enterNot(this);
	}
};

NotContext.prototype.exitRule = function(listener) {
    if(listener instanceof rqlListener ) {
        listener.exitNot(this);
	}
};

NotContext.prototype.accept = function(visitor) {
    if ( visitor instanceof rqlVisitor ) {
        return visitor.visitNot(this);
    } else {
        return visitor.visitChildren(this);
    }
};


function ParensContext(parser, ctx) {
	ExprContext.call(this, parser);
    ExprContext.prototype.copyFrom.call(this, ctx);
    return this;
}

ParensContext.prototype = Object.create(ExprContext.prototype);
ParensContext.prototype.constructor = ParensContext;

rqlParser.ParensContext = ParensContext;

ParensContext.prototype.expr = function() {
    return this.getTypedRuleContext(ExprContext,0);
};
ParensContext.prototype.enterRule = function(listener) {
    if(listener instanceof rqlListener ) {
        listener.enterParens(this);
	}
};

ParensContext.prototype.exitRule = function(listener) {
    if(listener instanceof rqlListener ) {
        listener.exitParens(this);
	}
};

ParensContext.prototype.accept = function(visitor) {
    if ( visitor instanceof rqlVisitor ) {
        return visitor.visitParens(this);
    } else {
        return visitor.visitChildren(this);
    }
};


function OrContext(parser, ctx) {
	ExprContext.call(this, parser);
    ExprContext.prototype.copyFrom.call(this, ctx);
    return this;
}

OrContext.prototype = Object.create(ExprContext.prototype);
OrContext.prototype.constructor = OrContext;

rqlParser.OrContext = OrContext;

OrContext.prototype.expr = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(ExprContext);
    } else {
        return this.getTypedRuleContext(ExprContext,i);
    }
};

OrContext.prototype.OR = function() {
    return this.getToken(rqlParser.OR, 0);
};
OrContext.prototype.enterRule = function(listener) {
    if(listener instanceof rqlListener ) {
        listener.enterOr(this);
	}
};

OrContext.prototype.exitRule = function(listener) {
    if(listener instanceof rqlListener ) {
        listener.exitOr(this);
	}
};

OrContext.prototype.accept = function(visitor) {
    if ( visitor instanceof rqlVisitor ) {
        return visitor.visitOr(this);
    } else {
        return visitor.visitChildren(this);
    }
};


function BoolContext(parser, ctx) {
	ExprContext.call(this, parser);
    this.op = null; // Token;
    ExprContext.prototype.copyFrom.call(this, ctx);
    return this;
}

BoolContext.prototype = Object.create(ExprContext.prototype);
BoolContext.prototype.constructor = BoolContext;

rqlParser.BoolContext = BoolContext;

BoolContext.prototype.AttrName = function() {
    return this.getToken(rqlParser.AttrName, 0);
};

BoolContext.prototype.BooleanLiteral = function() {
    return this.getToken(rqlParser.BooleanLiteral, 0);
};

BoolContext.prototype.EQ = function() {
    return this.getToken(rqlParser.EQ, 0);
};
BoolContext.prototype.enterRule = function(listener) {
    if(listener instanceof rqlListener ) {
        listener.enterBool(this);
	}
};

BoolContext.prototype.exitRule = function(listener) {
    if(listener instanceof rqlListener ) {
        listener.exitBool(this);
	}
};

BoolContext.prototype.accept = function(visitor) {
    if ( visitor instanceof rqlVisitor ) {
        return visitor.visitBool(this);
    } else {
        return visitor.visitChildren(this);
    }
};


function AndContext(parser, ctx) {
	ExprContext.call(this, parser);
    ExprContext.prototype.copyFrom.call(this, ctx);
    return this;
}

AndContext.prototype = Object.create(ExprContext.prototype);
AndContext.prototype.constructor = AndContext;

rqlParser.AndContext = AndContext;

AndContext.prototype.expr = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(ExprContext);
    } else {
        return this.getTypedRuleContext(ExprContext,i);
    }
};

AndContext.prototype.AND = function() {
    return this.getToken(rqlParser.AND, 0);
};
AndContext.prototype.enterRule = function(listener) {
    if(listener instanceof rqlListener ) {
        listener.enterAnd(this);
	}
};

AndContext.prototype.exitRule = function(listener) {
    if(listener instanceof rqlListener ) {
        listener.exitAnd(this);
	}
};

AndContext.prototype.accept = function(visitor) {
    if ( visitor instanceof rqlVisitor ) {
        return visitor.visitAnd(this);
    } else {
        return visitor.visitChildren(this);
    }
};


function IntContext(parser, ctx) {
	ExprContext.call(this, parser);
    this.op = null; // Token;
    ExprContext.prototype.copyFrom.call(this, ctx);
    return this;
}

IntContext.prototype = Object.create(ExprContext.prototype);
IntContext.prototype.constructor = IntContext;

rqlParser.IntContext = IntContext;

IntContext.prototype.AttrName = function() {
    return this.getToken(rqlParser.AttrName, 0);
};

IntContext.prototype.IntegerLiteral = function() {
    return this.getToken(rqlParser.IntegerLiteral, 0);
};

IntContext.prototype.EQ = function() {
    return this.getToken(rqlParser.EQ, 0);
};

IntContext.prototype.NE = function() {
    return this.getToken(rqlParser.NE, 0);
};

IntContext.prototype.GT = function() {
    return this.getToken(rqlParser.GT, 0);
};

IntContext.prototype.GE = function() {
    return this.getToken(rqlParser.GE, 0);
};

IntContext.prototype.LT = function() {
    return this.getToken(rqlParser.LT, 0);
};

IntContext.prototype.LE = function() {
    return this.getToken(rqlParser.LE, 0);
};
IntContext.prototype.enterRule = function(listener) {
    if(listener instanceof rqlListener ) {
        listener.enterInt(this);
	}
};

IntContext.prototype.exitRule = function(listener) {
    if(listener instanceof rqlListener ) {
        listener.exitInt(this);
	}
};

IntContext.prototype.accept = function(visitor) {
    if ( visitor instanceof rqlVisitor ) {
        return visitor.visitInt(this);
    } else {
        return visitor.visitChildren(this);
    }
};



rqlParser.prototype.expr = function(_p) {
	if(_p===undefined) {
	    _p = 0;
	}
    var _parentctx = this._ctx;
    var _parentState = this.state;
    var localctx = new ExprContext(this, this._ctx, _parentState);
    var _prevctx = localctx;
    var _startState = 0;
    this.enterRecursionRule(localctx, 0, rqlParser.RULE_expr, _p);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 21;
        this._errHandler.sync(this);
        var la_ = this._interp.adaptivePredict(this._input,0,this._ctx);
        switch(la_) {
        case 1:
            localctx = new NotContext(this, localctx);
            this._ctx = localctx;
            _prevctx = localctx;

            this.state = 3;
            this.match(rqlParser.NOT);
            this.state = 4;
            this.match(rqlParser.LPAREN);
            this.state = 5;
            this.expr(0);
            this.state = 6;
            this.match(rqlParser.RPAREN);
            break;

        case 2:
            localctx = new IntContext(this, localctx);
            this._ctx = localctx;
            _prevctx = localctx;
            this.state = 8;
            this.match(rqlParser.AttrName);
            this.state = 9;
            localctx.op = this._input.LT(1);
            _la = this._input.LA(1);
            if(!((((_la) & ~0x1f) == 0 && ((1 << _la) & ((1 << rqlParser.EQ) | (1 << rqlParser.NE) | (1 << rqlParser.GT) | (1 << rqlParser.GE) | (1 << rqlParser.LT) | (1 << rqlParser.LE))) !== 0))) {
                localctx.op = this._errHandler.recoverInline(this);
            }
            else {
            	this._errHandler.reportMatch(this);
                this.consume();
            }
            this.state = 10;
            this.match(rqlParser.IntegerLiteral);
            break;

        case 3:
            localctx = new StrContext(this, localctx);
            this._ctx = localctx;
            _prevctx = localctx;
            this.state = 11;
            this.match(rqlParser.AttrName);
            this.state = 12;
            localctx.op = this._input.LT(1);
            _la = this._input.LA(1);
            if(!((((_la) & ~0x1f) == 0 && ((1 << _la) & ((1 << rqlParser.EQ) | (1 << rqlParser.NE) | (1 << rqlParser.HAS) | (1 << rqlParser.SW) | (1 << rqlParser.EW))) !== 0))) {
                localctx.op = this._errHandler.recoverInline(this);
            }
            else {
            	this._errHandler.reportMatch(this);
                this.consume();
            }
            this.state = 13;
            this.match(rqlParser.StringLiteral);
            break;

        case 4:
            localctx = new BoolContext(this, localctx);
            this._ctx = localctx;
            _prevctx = localctx;
            this.state = 14;
            this.match(rqlParser.AttrName);
            this.state = 15;
            localctx.op = this.match(rqlParser.EQ);
            this.state = 16;
            this.match(rqlParser.BooleanLiteral);
            break;

        case 5:
            localctx = new ParensContext(this, localctx);
            this._ctx = localctx;
            _prevctx = localctx;
            this.state = 17;
            this.match(rqlParser.LPAREN);
            this.state = 18;
            this.expr(0);
            this.state = 19;
            this.match(rqlParser.RPAREN);
            break;

        }
        this._ctx.stop = this._input.LT(-1);
        this.state = 31;
        this._errHandler.sync(this);
        var _alt = this._interp.adaptivePredict(this._input,2,this._ctx)
        while(_alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER) {
            if(_alt===1) {
                if(this._parseListeners!==null) {
                    this.triggerExitRuleEvent();
                }
                _prevctx = localctx;
                this.state = 29;
                this._errHandler.sync(this);
                var la_ = this._interp.adaptivePredict(this._input,1,this._ctx);
                switch(la_) {
                case 1:
                    localctx = new AndContext(this, new ExprContext(this, _parentctx, _parentState));
                    this.pushNewRecursionContext(localctx, _startState, rqlParser.RULE_expr);
                    this.state = 23;
                    if (!( this.precpred(this._ctx, 7))) {
                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 7)");
                    }
                    this.state = 24;
                    this.match(rqlParser.AND);
                    this.state = 25;
                    this.expr(8);
                    break;

                case 2:
                    localctx = new OrContext(this, new ExprContext(this, _parentctx, _parentState));
                    this.pushNewRecursionContext(localctx, _startState, rqlParser.RULE_expr);
                    this.state = 26;
                    if (!( this.precpred(this._ctx, 6))) {
                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 6)");
                    }
                    this.state = 27;
                    this.match(rqlParser.OR);
                    this.state = 28;
                    this.expr(7);
                    break;

                } 
            }
            this.state = 33;
            this._errHandler.sync(this);
            _alt = this._interp.adaptivePredict(this._input,2,this._ctx);
        }

    } catch( error) {
        if(error instanceof antlr4.error.RecognitionException) {
	        localctx.exception = error;
	        this._errHandler.reportError(this, error);
	        this._errHandler.recover(this, error);
	    } else {
	    	throw error;
	    }
    } finally {
        this.unrollRecursionContexts(_parentctx)
    }
    return localctx;
};


rqlParser.prototype.sempred = function(localctx, ruleIndex, predIndex) {
	switch(ruleIndex) {
	case 0:
			return this.expr_sempred(localctx, predIndex);
    default:
        throw "No predicate with index:" + ruleIndex;
   }
};

rqlParser.prototype.expr_sempred = function(localctx, predIndex) {
	switch(predIndex) {
		case 0:
			return this.precpred(this._ctx, 7);
		case 1:
			return this.precpred(this._ctx, 6);
		default:
			throw "No predicate with index:" + predIndex;
	}
};


exports.rqlParser = rqlParser;
