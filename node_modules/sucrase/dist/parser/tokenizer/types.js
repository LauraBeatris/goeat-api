"use strict";Object.defineProperty(exports, "__esModule", {value: true});// Generated file, do not edit! Run "yarn generate" to re-generate this file.
/**
 * Enum of all token types, with bit fields to signify meaningful properties.
 */
var TokenType; (function (TokenType) {
  // Precedence 0 means not an operator; otherwise it is a positive number up to 12.
  const PRECEDENCE_MASK = 0xf; TokenType[TokenType["PRECEDENCE_MASK"] = PRECEDENCE_MASK] = "PRECEDENCE_MASK";
  const IS_KEYWORD = 1 << 4; TokenType[TokenType["IS_KEYWORD"] = IS_KEYWORD] = "IS_KEYWORD";
  const IS_ASSIGN = 1 << 5; TokenType[TokenType["IS_ASSIGN"] = IS_ASSIGN] = "IS_ASSIGN";
  const IS_RIGHT_ASSOCIATIVE = 1 << 6; TokenType[TokenType["IS_RIGHT_ASSOCIATIVE"] = IS_RIGHT_ASSOCIATIVE] = "IS_RIGHT_ASSOCIATIVE";
  const IS_PREFIX = 1 << 7; TokenType[TokenType["IS_PREFIX"] = IS_PREFIX] = "IS_PREFIX";
  const IS_POSTFIX = 1 << 8; TokenType[TokenType["IS_POSTFIX"] = IS_POSTFIX] = "IS_POSTFIX";

  const num = 0; TokenType[TokenType["num"] = num] = "num"; // num
  const bigint = 512; TokenType[TokenType["bigint"] = bigint] = "bigint"; // bigint
  const regexp = 1024; TokenType[TokenType["regexp"] = regexp] = "regexp"; // regexp
  const string = 1536; TokenType[TokenType["string"] = string] = "string"; // string
  const name = 2048; TokenType[TokenType["name"] = name] = "name"; // name
  const eof = 2560; TokenType[TokenType["eof"] = eof] = "eof"; // eof
  const bracketL = 3072; TokenType[TokenType["bracketL"] = bracketL] = "bracketL"; // [
  const bracketR = 3584; TokenType[TokenType["bracketR"] = bracketR] = "bracketR"; // ]
  const braceL = 4096; TokenType[TokenType["braceL"] = braceL] = "braceL"; // {
  const braceBarL = 4608; TokenType[TokenType["braceBarL"] = braceBarL] = "braceBarL"; // {|
  const braceR = 5120; TokenType[TokenType["braceR"] = braceR] = "braceR"; // }
  const braceBarR = 5632; TokenType[TokenType["braceBarR"] = braceBarR] = "braceBarR"; // |}
  const parenL = 6144; TokenType[TokenType["parenL"] = parenL] = "parenL"; // (
  const parenR = 6656; TokenType[TokenType["parenR"] = parenR] = "parenR"; // )
  const comma = 7168; TokenType[TokenType["comma"] = comma] = "comma"; // ,
  const semi = 7680; TokenType[TokenType["semi"] = semi] = "semi"; // ;
  const colon = 8192; TokenType[TokenType["colon"] = colon] = "colon"; // :
  const doubleColon = 8704; TokenType[TokenType["doubleColon"] = doubleColon] = "doubleColon"; // ::
  const dot = 9216; TokenType[TokenType["dot"] = dot] = "dot"; // .
  const question = 9728; TokenType[TokenType["question"] = question] = "question"; // ?
  const questionDot = 10240; TokenType[TokenType["questionDot"] = questionDot] = "questionDot"; // ?.
  const arrow = 10752; TokenType[TokenType["arrow"] = arrow] = "arrow"; // =>
  const template = 11264; TokenType[TokenType["template"] = template] = "template"; // template
  const ellipsis = 11776; TokenType[TokenType["ellipsis"] = ellipsis] = "ellipsis"; // ...
  const backQuote = 12288; TokenType[TokenType["backQuote"] = backQuote] = "backQuote"; // `
  const dollarBraceL = 12800; TokenType[TokenType["dollarBraceL"] = dollarBraceL] = "dollarBraceL"; // ${
  const at = 13312; TokenType[TokenType["at"] = at] = "at"; // @
  const hash = 13824; TokenType[TokenType["hash"] = hash] = "hash"; // #
  const eq = 14368; TokenType[TokenType["eq"] = eq] = "eq"; // = isAssign
  const assign = 14880; TokenType[TokenType["assign"] = assign] = "assign"; // _= isAssign
  const preIncDec = 15744; TokenType[TokenType["preIncDec"] = preIncDec] = "preIncDec"; // ++/-- prefix postfix
  const postIncDec = 16256; TokenType[TokenType["postIncDec"] = postIncDec] = "postIncDec"; // ++/-- prefix postfix
  const bang = 16512; TokenType[TokenType["bang"] = bang] = "bang"; // ! prefix
  const tilde = 17024; TokenType[TokenType["tilde"] = tilde] = "tilde"; // ~ prefix
  const pipeline = 17409; TokenType[TokenType["pipeline"] = pipeline] = "pipeline"; // |> prec:1
  const nullishCoalescing = 17922; TokenType[TokenType["nullishCoalescing"] = nullishCoalescing] = "nullishCoalescing"; // ?? prec:2
  const logicalOR = 18434; TokenType[TokenType["logicalOR"] = logicalOR] = "logicalOR"; // || prec:2
  const logicalAND = 18947; TokenType[TokenType["logicalAND"] = logicalAND] = "logicalAND"; // && prec:3
  const bitwiseOR = 19460; TokenType[TokenType["bitwiseOR"] = bitwiseOR] = "bitwiseOR"; // | prec:4
  const bitwiseXOR = 19973; TokenType[TokenType["bitwiseXOR"] = bitwiseXOR] = "bitwiseXOR"; // ^ prec:5
  const bitwiseAND = 20486; TokenType[TokenType["bitwiseAND"] = bitwiseAND] = "bitwiseAND"; // & prec:6
  const equality = 20999; TokenType[TokenType["equality"] = equality] = "equality"; // ==/!= prec:7
  const lessThan = 21512; TokenType[TokenType["lessThan"] = lessThan] = "lessThan"; // < prec:8
  const greaterThan = 22024; TokenType[TokenType["greaterThan"] = greaterThan] = "greaterThan"; // > prec:8
  const relationalOrEqual = 22536; TokenType[TokenType["relationalOrEqual"] = relationalOrEqual] = "relationalOrEqual"; // <=/>= prec:8
  const bitShift = 23049; TokenType[TokenType["bitShift"] = bitShift] = "bitShift"; // <</>> prec:9
  const plus = 23690; TokenType[TokenType["plus"] = plus] = "plus"; // + prec:10 prefix
  const minus = 24202; TokenType[TokenType["minus"] = minus] = "minus"; // - prec:10 prefix
  const modulo = 24587; TokenType[TokenType["modulo"] = modulo] = "modulo"; // % prec:11
  const star = 25099; TokenType[TokenType["star"] = star] = "star"; // * prec:11
  const slash = 25611; TokenType[TokenType["slash"] = slash] = "slash"; // / prec:11
  const exponent = 26188; TokenType[TokenType["exponent"] = exponent] = "exponent"; // ** prec:12 rightAssociative
  const jsxName = 26624; TokenType[TokenType["jsxName"] = jsxName] = "jsxName"; // jsxName
  const jsxText = 27136; TokenType[TokenType["jsxText"] = jsxText] = "jsxText"; // jsxText
  const jsxTagStart = 27648; TokenType[TokenType["jsxTagStart"] = jsxTagStart] = "jsxTagStart"; // jsxTagStart
  const jsxTagEnd = 28160; TokenType[TokenType["jsxTagEnd"] = jsxTagEnd] = "jsxTagEnd"; // jsxTagEnd
  const typeParameterStart = 28672; TokenType[TokenType["typeParameterStart"] = typeParameterStart] = "typeParameterStart"; // typeParameterStart
  const nonNullAssertion = 29184; TokenType[TokenType["nonNullAssertion"] = nonNullAssertion] = "nonNullAssertion"; // nonNullAssertion
  const _break = 29712; TokenType[TokenType["_break"] = _break] = "_break"; // break keyword
  const _case = 30224; TokenType[TokenType["_case"] = _case] = "_case"; // case keyword
  const _catch = 30736; TokenType[TokenType["_catch"] = _catch] = "_catch"; // catch keyword
  const _continue = 31248; TokenType[TokenType["_continue"] = _continue] = "_continue"; // continue keyword
  const _debugger = 31760; TokenType[TokenType["_debugger"] = _debugger] = "_debugger"; // debugger keyword
  const _default = 32272; TokenType[TokenType["_default"] = _default] = "_default"; // default keyword
  const _do = 32784; TokenType[TokenType["_do"] = _do] = "_do"; // do keyword
  const _else = 33296; TokenType[TokenType["_else"] = _else] = "_else"; // else keyword
  const _finally = 33808; TokenType[TokenType["_finally"] = _finally] = "_finally"; // finally keyword
  const _for = 34320; TokenType[TokenType["_for"] = _for] = "_for"; // for keyword
  const _function = 34832; TokenType[TokenType["_function"] = _function] = "_function"; // function keyword
  const _if = 35344; TokenType[TokenType["_if"] = _if] = "_if"; // if keyword
  const _return = 35856; TokenType[TokenType["_return"] = _return] = "_return"; // return keyword
  const _switch = 36368; TokenType[TokenType["_switch"] = _switch] = "_switch"; // switch keyword
  const _throw = 37008; TokenType[TokenType["_throw"] = _throw] = "_throw"; // throw keyword prefix
  const _try = 37392; TokenType[TokenType["_try"] = _try] = "_try"; // try keyword
  const _var = 37904; TokenType[TokenType["_var"] = _var] = "_var"; // var keyword
  const _let = 38416; TokenType[TokenType["_let"] = _let] = "_let"; // let keyword
  const _const = 38928; TokenType[TokenType["_const"] = _const] = "_const"; // const keyword
  const _while = 39440; TokenType[TokenType["_while"] = _while] = "_while"; // while keyword
  const _with = 39952; TokenType[TokenType["_with"] = _with] = "_with"; // with keyword
  const _new = 40464; TokenType[TokenType["_new"] = _new] = "_new"; // new keyword
  const _this = 40976; TokenType[TokenType["_this"] = _this] = "_this"; // this keyword
  const _super = 41488; TokenType[TokenType["_super"] = _super] = "_super"; // super keyword
  const _class = 42000; TokenType[TokenType["_class"] = _class] = "_class"; // class keyword
  const _extends = 42512; TokenType[TokenType["_extends"] = _extends] = "_extends"; // extends keyword
  const _export = 43024; TokenType[TokenType["_export"] = _export] = "_export"; // export keyword
  const _import = 43536; TokenType[TokenType["_import"] = _import] = "_import"; // import keyword
  const _yield = 44048; TokenType[TokenType["_yield"] = _yield] = "_yield"; // yield keyword
  const _null = 44560; TokenType[TokenType["_null"] = _null] = "_null"; // null keyword
  const _true = 45072; TokenType[TokenType["_true"] = _true] = "_true"; // true keyword
  const _false = 45584; TokenType[TokenType["_false"] = _false] = "_false"; // false keyword
  const _in = 46104; TokenType[TokenType["_in"] = _in] = "_in"; // in prec:8 keyword
  const _instanceof = 46616; TokenType[TokenType["_instanceof"] = _instanceof] = "_instanceof"; // instanceof prec:8 keyword
  const _typeof = 47248; TokenType[TokenType["_typeof"] = _typeof] = "_typeof"; // typeof keyword prefix
  const _void = 47760; TokenType[TokenType["_void"] = _void] = "_void"; // void keyword prefix
  const _delete = 48272; TokenType[TokenType["_delete"] = _delete] = "_delete"; // delete keyword prefix
  const _async = 48656; TokenType[TokenType["_async"] = _async] = "_async"; // async keyword
  const _get = 49168; TokenType[TokenType["_get"] = _get] = "_get"; // get keyword
  const _set = 49680; TokenType[TokenType["_set"] = _set] = "_set"; // set keyword
  const _declare = 50192; TokenType[TokenType["_declare"] = _declare] = "_declare"; // declare keyword
  const _readonly = 50704; TokenType[TokenType["_readonly"] = _readonly] = "_readonly"; // readonly keyword
  const _abstract = 51216; TokenType[TokenType["_abstract"] = _abstract] = "_abstract"; // abstract keyword
  const _static = 51728; TokenType[TokenType["_static"] = _static] = "_static"; // static keyword
  const _public = 52240; TokenType[TokenType["_public"] = _public] = "_public"; // public keyword
  const _private = 52752; TokenType[TokenType["_private"] = _private] = "_private"; // private keyword
  const _protected = 53264; TokenType[TokenType["_protected"] = _protected] = "_protected"; // protected keyword
  const _as = 53776; TokenType[TokenType["_as"] = _as] = "_as"; // as keyword
  const _enum = 54288; TokenType[TokenType["_enum"] = _enum] = "_enum"; // enum keyword
  const _type = 54800; TokenType[TokenType["_type"] = _type] = "_type"; // type keyword
  const _implements = 55312; TokenType[TokenType["_implements"] = _implements] = "_implements"; // implements keyword
})(TokenType || (exports.TokenType = TokenType = {}));
 function formatTokenType(tokenType) {
  switch (tokenType) {
    case TokenType.num:
      return "num";
    case TokenType.bigint:
      return "bigint";
    case TokenType.regexp:
      return "regexp";
    case TokenType.string:
      return "string";
    case TokenType.name:
      return "name";
    case TokenType.eof:
      return "eof";
    case TokenType.bracketL:
      return "[";
    case TokenType.bracketR:
      return "]";
    case TokenType.braceL:
      return "{";
    case TokenType.braceBarL:
      return "{|";
    case TokenType.braceR:
      return "}";
    case TokenType.braceBarR:
      return "|}";
    case TokenType.parenL:
      return "(";
    case TokenType.parenR:
      return ")";
    case TokenType.comma:
      return ",";
    case TokenType.semi:
      return ";";
    case TokenType.colon:
      return ":";
    case TokenType.doubleColon:
      return "::";
    case TokenType.dot:
      return ".";
    case TokenType.question:
      return "?";
    case TokenType.questionDot:
      return "?.";
    case TokenType.arrow:
      return "=>";
    case TokenType.template:
      return "template";
    case TokenType.ellipsis:
      return "...";
    case TokenType.backQuote:
      return "`";
    case TokenType.dollarBraceL:
      return "${";
    case TokenType.at:
      return "@";
    case TokenType.hash:
      return "#";
    case TokenType.eq:
      return "=";
    case TokenType.assign:
      return "_=";
    case TokenType.preIncDec:
      return "++/--";
    case TokenType.postIncDec:
      return "++/--";
    case TokenType.bang:
      return "!";
    case TokenType.tilde:
      return "~";
    case TokenType.pipeline:
      return "|>";
    case TokenType.nullishCoalescing:
      return "??";
    case TokenType.logicalOR:
      return "||";
    case TokenType.logicalAND:
      return "&&";
    case TokenType.bitwiseOR:
      return "|";
    case TokenType.bitwiseXOR:
      return "^";
    case TokenType.bitwiseAND:
      return "&";
    case TokenType.equality:
      return "==/!=";
    case TokenType.lessThan:
      return "<";
    case TokenType.greaterThan:
      return ">";
    case TokenType.relationalOrEqual:
      return "<=/>=";
    case TokenType.bitShift:
      return "<</>>";
    case TokenType.plus:
      return "+";
    case TokenType.minus:
      return "-";
    case TokenType.modulo:
      return "%";
    case TokenType.star:
      return "*";
    case TokenType.slash:
      return "/";
    case TokenType.exponent:
      return "**";
    case TokenType.jsxName:
      return "jsxName";
    case TokenType.jsxText:
      return "jsxText";
    case TokenType.jsxTagStart:
      return "jsxTagStart";
    case TokenType.jsxTagEnd:
      return "jsxTagEnd";
    case TokenType.typeParameterStart:
      return "typeParameterStart";
    case TokenType.nonNullAssertion:
      return "nonNullAssertion";
    case TokenType._break:
      return "break";
    case TokenType._case:
      return "case";
    case TokenType._catch:
      return "catch";
    case TokenType._continue:
      return "continue";
    case TokenType._debugger:
      return "debugger";
    case TokenType._default:
      return "default";
    case TokenType._do:
      return "do";
    case TokenType._else:
      return "else";
    case TokenType._finally:
      return "finally";
    case TokenType._for:
      return "for";
    case TokenType._function:
      return "function";
    case TokenType._if:
      return "if";
    case TokenType._return:
      return "return";
    case TokenType._switch:
      return "switch";
    case TokenType._throw:
      return "throw";
    case TokenType._try:
      return "try";
    case TokenType._var:
      return "var";
    case TokenType._let:
      return "let";
    case TokenType._const:
      return "const";
    case TokenType._while:
      return "while";
    case TokenType._with:
      return "with";
    case TokenType._new:
      return "new";
    case TokenType._this:
      return "this";
    case TokenType._super:
      return "super";
    case TokenType._class:
      return "class";
    case TokenType._extends:
      return "extends";
    case TokenType._export:
      return "export";
    case TokenType._import:
      return "import";
    case TokenType._yield:
      return "yield";
    case TokenType._null:
      return "null";
    case TokenType._true:
      return "true";
    case TokenType._false:
      return "false";
    case TokenType._in:
      return "in";
    case TokenType._instanceof:
      return "instanceof";
    case TokenType._typeof:
      return "typeof";
    case TokenType._void:
      return "void";
    case TokenType._delete:
      return "delete";
    case TokenType._async:
      return "async";
    case TokenType._get:
      return "get";
    case TokenType._set:
      return "set";
    case TokenType._declare:
      return "declare";
    case TokenType._readonly:
      return "readonly";
    case TokenType._abstract:
      return "abstract";
    case TokenType._static:
      return "static";
    case TokenType._public:
      return "public";
    case TokenType._private:
      return "private";
    case TokenType._protected:
      return "protected";
    case TokenType._as:
      return "as";
    case TokenType._enum:
      return "enum";
    case TokenType._type:
      return "type";
    case TokenType._implements:
      return "implements";
    default:
      return "";
  }
} exports.formatTokenType = formatTokenType;
