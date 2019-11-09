"use strict";Object.defineProperty(exports, "__esModule", {value: true});







var _index = require('../tokenizer/index');
var _keywords = require('../tokenizer/keywords');
var _types = require('../tokenizer/types');
var _base = require('../traverser/base');















var _expression = require('../traverser/expression');
var _lval = require('../traverser/lval');











var _statement = require('../traverser/statement');











var _util = require('../traverser/util');
var _jsx = require('./jsx');

function tsIsIdentifier() {
  // TODO: actually a bit more complex in TypeScript, but shouldn't matter.
  // See https://github.com/Microsoft/TypeScript/issues/15008
  return _index.match.call(void 0, _types.TokenType.name);
}

function tsNextTokenCanFollowModifier() {
  // Note: TypeScript's implementation is much more complicated because
  // more things are considered modifiers there.
  // This implementation only handles modifiers not handled by babylon itself. And "static".
  // TODO: Would be nice to avoid lookahead. Want a hasLineBreakUpNext() method...
  const snapshot = _base.state.snapshot();

  _index.next.call(void 0, );
  const canFollowModifier =
    !_util.hasPrecedingLineBreak.call(void 0, ) &&
    !_index.match.call(void 0, _types.TokenType.parenL) &&
    !_index.match.call(void 0, _types.TokenType.parenR) &&
    !_index.match.call(void 0, _types.TokenType.colon) &&
    !_index.match.call(void 0, _types.TokenType.eq) &&
    !_index.match.call(void 0, _types.TokenType.question) &&
    !_index.match.call(void 0, _types.TokenType.bang);

  if (canFollowModifier) {
    return true;
  } else {
    _base.state.restoreFromSnapshot(snapshot);
    return false;
  }
}

/** Parses a modifier matching one the given modifier names. */
 function tsParseModifier(
  allowedModifiers,
) {
  if (!_index.match.call(void 0, _types.TokenType.name)) {
    return null;
  }

  const modifier = _base.state.contextualKeyword;
  if (allowedModifiers.indexOf(modifier) !== -1 && tsNextTokenCanFollowModifier()) {
    switch (modifier) {
      case _keywords.ContextualKeyword._readonly:
        _base.state.tokens[_base.state.tokens.length - 1].type = _types.TokenType._readonly;
        break;
      case _keywords.ContextualKeyword._abstract:
        _base.state.tokens[_base.state.tokens.length - 1].type = _types.TokenType._abstract;
        break;
      case _keywords.ContextualKeyword._static:
        _base.state.tokens[_base.state.tokens.length - 1].type = _types.TokenType._static;
        break;
      case _keywords.ContextualKeyword._public:
        _base.state.tokens[_base.state.tokens.length - 1].type = _types.TokenType._public;
        break;
      case _keywords.ContextualKeyword._private:
        _base.state.tokens[_base.state.tokens.length - 1].type = _types.TokenType._private;
        break;
      case _keywords.ContextualKeyword._protected:
        _base.state.tokens[_base.state.tokens.length - 1].type = _types.TokenType._protected;
        break;
      default:
        break;
    }
    return modifier;
  }
  return null;
} exports.tsParseModifier = tsParseModifier;

function tsParseEntityName() {
  _expression.parseIdentifier.call(void 0, );
  while (_index.eat.call(void 0, _types.TokenType.dot)) {
    _expression.parseIdentifier.call(void 0, );
  }
}

function tsParseTypeReference() {
  tsParseEntityName();
  if (!_util.hasPrecedingLineBreak.call(void 0, ) && _index.match.call(void 0, _types.TokenType.lessThan)) {
    tsParseTypeArguments();
  }
}

function tsParseThisTypePredicate() {
  _index.next.call(void 0, );
  tsParseTypeAnnotation();
}

function tsParseThisTypeNode() {
  _index.next.call(void 0, );
}

function tsParseTypeQuery() {
  _util.expect.call(void 0, _types.TokenType._typeof);
  if (_index.match.call(void 0, _types.TokenType._import)) {
    tsParseImportType();
  } else {
    tsParseEntityName();
  }
}

function tsParseImportType() {
  _util.expect.call(void 0, _types.TokenType._import);
  _util.expect.call(void 0, _types.TokenType.parenL);
  _util.expect.call(void 0, _types.TokenType.string);
  _util.expect.call(void 0, _types.TokenType.parenR);
  if (_index.eat.call(void 0, _types.TokenType.dot)) {
    tsParseEntityName();
  }
  if (_index.match.call(void 0, _types.TokenType.lessThan)) {
    tsParseTypeArguments();
  }
}

function tsParseTypeParameter() {
  _expression.parseIdentifier.call(void 0, );
  if (_index.eat.call(void 0, _types.TokenType._extends)) {
    tsParseType();
  }
  if (_index.eat.call(void 0, _types.TokenType.eq)) {
    tsParseType();
  }
}

 function tsTryParseTypeParameters() {
  if (_index.match.call(void 0, _types.TokenType.lessThan)) {
    tsParseTypeParameters();
  }
} exports.tsTryParseTypeParameters = tsTryParseTypeParameters;

function tsParseTypeParameters() {
  const oldIsType = _index.pushTypeContext.call(void 0, 0);
  if (_index.match.call(void 0, _types.TokenType.lessThan) || _index.match.call(void 0, _types.TokenType.typeParameterStart)) {
    _index.next.call(void 0, );
  } else {
    _util.unexpected.call(void 0, );
  }

  while (!_index.eat.call(void 0, _types.TokenType.greaterThan) && !_base.state.error) {
    tsParseTypeParameter();
    _index.eat.call(void 0, _types.TokenType.comma);
  }
  _index.popTypeContext.call(void 0, oldIsType);
}

// Note: In TypeScript implementation we must provide `yieldContext` and `awaitContext`,
// but here it's always false, because this is only used for types.
function tsFillSignature(returnToken) {
  // Arrow fns *must* have return token (`=>`). Normal functions can omit it.
  const returnTokenRequired = returnToken === _types.TokenType.arrow;
  tsTryParseTypeParameters();
  _util.expect.call(void 0, _types.TokenType.parenL);
  // Create a scope even though we're doing type parsing so we don't accidentally
  // treat params as top-level bindings.
  _base.state.scopeDepth++;
  tsParseBindingListForSignature(false /* isBlockScope */);
  _base.state.scopeDepth--;
  if (returnTokenRequired) {
    tsParseTypeOrTypePredicateAnnotation(returnToken);
  } else if (_index.match.call(void 0, returnToken)) {
    tsParseTypeOrTypePredicateAnnotation(returnToken);
  }
}

function tsParseBindingListForSignature(isBlockScope) {
  _lval.parseBindingList.call(void 0, _types.TokenType.parenR, isBlockScope);
}

function tsParseTypeMemberSemicolon() {
  if (!_index.eat.call(void 0, _types.TokenType.comma)) {
    _util.semicolon.call(void 0, );
  }
}

var SignatureMemberKind; (function (SignatureMemberKind) {
  const TSCallSignatureDeclaration = 0; SignatureMemberKind[SignatureMemberKind["TSCallSignatureDeclaration"] = TSCallSignatureDeclaration] = "TSCallSignatureDeclaration";
  const TSConstructSignatureDeclaration = TSCallSignatureDeclaration + 1; SignatureMemberKind[SignatureMemberKind["TSConstructSignatureDeclaration"] = TSConstructSignatureDeclaration] = "TSConstructSignatureDeclaration";
})(SignatureMemberKind || (SignatureMemberKind = {}));

function tsParseSignatureMember(kind) {
  if (kind === SignatureMemberKind.TSConstructSignatureDeclaration) {
    _util.expect.call(void 0, _types.TokenType._new);
  }
  tsFillSignature(_types.TokenType.colon);
  tsParseTypeMemberSemicolon();
}

function tsIsUnambiguouslyIndexSignature() {
  const snapshot = _base.state.snapshot();
  _index.next.call(void 0, ); // Skip '{'
  const isIndexSignature = _index.eat.call(void 0, _types.TokenType.name) && _index.match.call(void 0, _types.TokenType.colon);
  _base.state.restoreFromSnapshot(snapshot);
  return isIndexSignature;
}

function tsTryParseIndexSignature() {
  if (!(_index.match.call(void 0, _types.TokenType.bracketL) && tsIsUnambiguouslyIndexSignature())) {
    return false;
  }

  const oldIsType = _index.pushTypeContext.call(void 0, 0);

  _util.expect.call(void 0, _types.TokenType.bracketL);
  _expression.parseIdentifier.call(void 0, );
  tsParseTypeAnnotation();
  _util.expect.call(void 0, _types.TokenType.bracketR);

  tsTryParseTypeAnnotation();
  tsParseTypeMemberSemicolon();

  _index.popTypeContext.call(void 0, oldIsType);
  return true;
}

function tsParsePropertyOrMethodSignature(isReadonly) {
  _expression.parsePropertyName.call(void 0, -1 /* Types don't need context IDs. */);
  _index.eat.call(void 0, _types.TokenType.question);

  if (!isReadonly && (_index.match.call(void 0, _types.TokenType.parenL) || _index.match.call(void 0, _types.TokenType.lessThan))) {
    tsFillSignature(_types.TokenType.colon);
    tsParseTypeMemberSemicolon();
  } else {
    tsTryParseTypeAnnotation();
    tsParseTypeMemberSemicolon();
  }
}

function tsParseTypeMember() {
  if (_index.match.call(void 0, _types.TokenType.parenL) || _index.match.call(void 0, _types.TokenType.lessThan)) {
    tsParseSignatureMember(SignatureMemberKind.TSCallSignatureDeclaration);
    return;
  }
  if (_index.match.call(void 0, _types.TokenType._new) && tsIsStartOfConstructSignature()) {
    tsParseSignatureMember(SignatureMemberKind.TSConstructSignatureDeclaration);
    return;
  }
  const readonly = !!tsParseModifier([_keywords.ContextualKeyword._readonly]);

  const found = tsTryParseIndexSignature();
  if (found) {
    return;
  }
  tsParsePropertyOrMethodSignature(readonly);
}

function tsIsStartOfConstructSignature() {
  const lookahead = _index.lookaheadType.call(void 0, );
  return lookahead === _types.TokenType.parenL || lookahead === _types.TokenType.lessThan;
}

function tsParseTypeLiteral() {
  tsParseObjectTypeMembers();
}

function tsParseObjectTypeMembers() {
  _util.expect.call(void 0, _types.TokenType.braceL);
  while (!_index.eat.call(void 0, _types.TokenType.braceR) && !_base.state.error) {
    tsParseTypeMember();
  }
}

function tsLookaheadIsStartOfMappedType() {
  const snapshot = _base.state.snapshot();
  const isStartOfMappedType = tsIsStartOfMappedType();
  _base.state.restoreFromSnapshot(snapshot);
  return isStartOfMappedType;
}

function tsIsStartOfMappedType() {
  _index.next.call(void 0, );
  if (_index.eat.call(void 0, _types.TokenType.plus) || _index.eat.call(void 0, _types.TokenType.minus)) {
    return _util.isContextual.call(void 0, _keywords.ContextualKeyword._readonly);
  }
  if (_util.isContextual.call(void 0, _keywords.ContextualKeyword._readonly)) {
    _index.next.call(void 0, );
  }
  if (!_index.match.call(void 0, _types.TokenType.bracketL)) {
    return false;
  }
  _index.next.call(void 0, );
  if (!tsIsIdentifier()) {
    return false;
  }
  _index.next.call(void 0, );
  return _index.match.call(void 0, _types.TokenType._in);
}

function tsParseMappedTypeParameter() {
  _expression.parseIdentifier.call(void 0, );
  _util.expect.call(void 0, _types.TokenType._in);
  tsParseType();
}

function tsParseMappedType() {
  _util.expect.call(void 0, _types.TokenType.braceL);
  if (_index.match.call(void 0, _types.TokenType.plus) || _index.match.call(void 0, _types.TokenType.minus)) {
    _index.next.call(void 0, );
    _util.expectContextual.call(void 0, _keywords.ContextualKeyword._readonly);
  } else {
    _util.eatContextual.call(void 0, _keywords.ContextualKeyword._readonly);
  }
  _util.expect.call(void 0, _types.TokenType.bracketL);
  tsParseMappedTypeParameter();
  _util.expect.call(void 0, _types.TokenType.bracketR);
  if (_index.match.call(void 0, _types.TokenType.plus) || _index.match.call(void 0, _types.TokenType.minus)) {
    _index.next.call(void 0, );
    _util.expect.call(void 0, _types.TokenType.question);
  } else {
    _index.eat.call(void 0, _types.TokenType.question);
  }
  tsTryParseType();
  _util.semicolon.call(void 0, );
  _util.expect.call(void 0, _types.TokenType.braceR);
}

function tsParseTupleType() {
  _util.expect.call(void 0, _types.TokenType.bracketL);
  while (!_index.eat.call(void 0, _types.TokenType.bracketR) && !_base.state.error) {
    tsParseTupleElementType();
    _index.eat.call(void 0, _types.TokenType.comma);
  }
}

function tsParseTupleElementType() {
  // parses `...TsType[]`
  if (_index.eat.call(void 0, _types.TokenType.ellipsis)) {
    tsParseType();
    return;
  }
  // parses `TsType?`
  tsParseType();
  _index.eat.call(void 0, _types.TokenType.question);
}

function tsParseParenthesizedType() {
  _util.expect.call(void 0, _types.TokenType.parenL);
  tsParseType();
  _util.expect.call(void 0, _types.TokenType.parenR);
}

var FunctionType; (function (FunctionType) {
  const TSFunctionType = 0; FunctionType[FunctionType["TSFunctionType"] = TSFunctionType] = "TSFunctionType";
  const TSConstructorType = TSFunctionType + 1; FunctionType[FunctionType["TSConstructorType"] = TSConstructorType] = "TSConstructorType";
})(FunctionType || (FunctionType = {}));

function tsParseFunctionOrConstructorType(type) {
  if (type === FunctionType.TSConstructorType) {
    _util.expect.call(void 0, _types.TokenType._new);
  }
  tsFillSignature(_types.TokenType.arrow);
}

function tsParseNonArrayType() {
  switch (_base.state.type) {
    case _types.TokenType.name:
      tsParseTypeReference();
      return;
    case _types.TokenType._void:
    case _types.TokenType._null:
      _index.next.call(void 0, );
      return;
    case _types.TokenType.string:
    case _types.TokenType.num:
    case _types.TokenType._true:
    case _types.TokenType._false:
      _expression.parseLiteral.call(void 0, );
      return;
    case _types.TokenType.minus:
      _index.next.call(void 0, );
      _expression.parseLiteral.call(void 0, );
      return;
    case _types.TokenType._this: {
      tsParseThisTypeNode();
      if (_util.isContextual.call(void 0, _keywords.ContextualKeyword._is) && !_util.hasPrecedingLineBreak.call(void 0, )) {
        tsParseThisTypePredicate();
      }
      return;
    }
    case _types.TokenType._typeof:
      tsParseTypeQuery();
      return;
    case _types.TokenType._import:
      tsParseImportType();
      return;
    case _types.TokenType.braceL:
      if (tsLookaheadIsStartOfMappedType()) {
        tsParseMappedType();
      } else {
        tsParseTypeLiteral();
      }
      return;
    case _types.TokenType.bracketL:
      tsParseTupleType();
      return;
    case _types.TokenType.parenL:
      tsParseParenthesizedType();
      return;
    case _types.TokenType.backQuote:
      _expression.parseTemplate.call(void 0, );
      return;
    default:
      if (_base.state.type & _types.TokenType.IS_KEYWORD) {
        _index.next.call(void 0, );
        _base.state.tokens[_base.state.tokens.length - 1].type = _types.TokenType.name;
        return;
      }
      break;
  }

  _util.unexpected.call(void 0, );
}

function tsParseArrayTypeOrHigher() {
  tsParseNonArrayType();
  while (!_util.hasPrecedingLineBreak.call(void 0, ) && _index.eat.call(void 0, _types.TokenType.bracketL)) {
    if (!_index.eat.call(void 0, _types.TokenType.bracketR)) {
      // If we hit ] immediately, this is an array type, otherwise it's an indexed access type.
      tsParseType();
      _util.expect.call(void 0, _types.TokenType.bracketR);
    }
  }
}

function tsParseInferType() {
  _util.expectContextual.call(void 0, _keywords.ContextualKeyword._infer);
  _expression.parseIdentifier.call(void 0, );
}

function tsParseTypeOperatorOrHigher() {
  if (
    _util.isContextual.call(void 0, _keywords.ContextualKeyword._keyof) ||
    _util.isContextual.call(void 0, _keywords.ContextualKeyword._unique) ||
    _util.isContextual.call(void 0, _keywords.ContextualKeyword._readonly)
  ) {
    _index.next.call(void 0, );
    tsParseTypeOperatorOrHigher();
  } else if (_util.isContextual.call(void 0, _keywords.ContextualKeyword._infer)) {
    tsParseInferType();
  } else {
    tsParseArrayTypeOrHigher();
  }
}

function tsParseIntersectionTypeOrHigher() {
  _index.eat.call(void 0, _types.TokenType.bitwiseAND);
  tsParseTypeOperatorOrHigher();
  if (_index.match.call(void 0, _types.TokenType.bitwiseAND)) {
    while (_index.eat.call(void 0, _types.TokenType.bitwiseAND)) {
      tsParseTypeOperatorOrHigher();
    }
  }
}

function tsParseUnionTypeOrHigher() {
  _index.eat.call(void 0, _types.TokenType.bitwiseOR);
  tsParseIntersectionTypeOrHigher();
  if (_index.match.call(void 0, _types.TokenType.bitwiseOR)) {
    while (_index.eat.call(void 0, _types.TokenType.bitwiseOR)) {
      tsParseIntersectionTypeOrHigher();
    }
  }
}

function tsIsStartOfFunctionType() {
  if (_index.match.call(void 0, _types.TokenType.lessThan)) {
    return true;
  }
  return _index.match.call(void 0, _types.TokenType.parenL) && tsLookaheadIsUnambiguouslyStartOfFunctionType();
}

function tsSkipParameterStart() {
  if (_index.match.call(void 0, _types.TokenType.name) || _index.match.call(void 0, _types.TokenType._this)) {
    _index.next.call(void 0, );
    return true;
  }
  // If this is a possible array/object destructure, walk to the matching bracket/brace.
  // The next token after will tell us definitively whether this is a function param.
  if (_index.match.call(void 0, _types.TokenType.braceL) || _index.match.call(void 0, _types.TokenType.bracketL)) {
    let depth = 1;
    _index.next.call(void 0, );
    while (depth > 0 && !_base.state.error) {
      if (_index.match.call(void 0, _types.TokenType.braceL) || _index.match.call(void 0, _types.TokenType.bracketL)) {
        depth++;
      } else if (_index.match.call(void 0, _types.TokenType.braceR) || _index.match.call(void 0, _types.TokenType.bracketR)) {
        depth--;
      }
      _index.next.call(void 0, );
    }
    return true;
  }
  return false;
}

function tsLookaheadIsUnambiguouslyStartOfFunctionType() {
  const snapshot = _base.state.snapshot();
  const isUnambiguouslyStartOfFunctionType = tsIsUnambiguouslyStartOfFunctionType();
  _base.state.restoreFromSnapshot(snapshot);
  return isUnambiguouslyStartOfFunctionType;
}

function tsIsUnambiguouslyStartOfFunctionType() {
  _index.next.call(void 0, );
  if (_index.match.call(void 0, _types.TokenType.parenR) || _index.match.call(void 0, _types.TokenType.ellipsis)) {
    // ( )
    // ( ...
    return true;
  }
  if (tsSkipParameterStart()) {
    if (_index.match.call(void 0, _types.TokenType.colon) || _index.match.call(void 0, _types.TokenType.comma) || _index.match.call(void 0, _types.TokenType.question) || _index.match.call(void 0, _types.TokenType.eq)) {
      // ( xxx :
      // ( xxx ,
      // ( xxx ?
      // ( xxx =
      return true;
    }
    if (_index.match.call(void 0, _types.TokenType.parenR)) {
      _index.next.call(void 0, );
      if (_index.match.call(void 0, _types.TokenType.arrow)) {
        // ( xxx ) =>
        return true;
      }
    }
  }
  return false;
}

function tsParseTypeOrTypePredicateAnnotation(returnToken) {
  const oldIsType = _index.pushTypeContext.call(void 0, 0);
  _util.expect.call(void 0, returnToken);
  tsParseTypePredicatePrefix();
  // Regardless of whether we found an "is" token, there's now just a regular type in front of
  // us.
  tsParseType();
  _index.popTypeContext.call(void 0, oldIsType);
}

function tsTryParseTypeOrTypePredicateAnnotation() {
  if (_index.match.call(void 0, _types.TokenType.colon)) {
    tsParseTypeOrTypePredicateAnnotation(_types.TokenType.colon);
  }
}

 function tsTryParseTypeAnnotation() {
  if (_index.match.call(void 0, _types.TokenType.colon)) {
    tsParseTypeAnnotation();
  }
} exports.tsTryParseTypeAnnotation = tsTryParseTypeAnnotation;

function tsTryParseType() {
  if (_index.eat.call(void 0, _types.TokenType.colon)) {
    tsParseType();
  }
}

function tsParseTypePredicatePrefix() {
  const snapshot = _base.state.snapshot();
  _expression.parseIdentifier.call(void 0, );
  if (_util.isContextual.call(void 0, _keywords.ContextualKeyword._is) && !_util.hasPrecedingLineBreak.call(void 0, )) {
    _index.next.call(void 0, );
  } else {
    _base.state.restoreFromSnapshot(snapshot);
  }
}

 function tsParseTypeAnnotation() {
  const oldIsType = _index.pushTypeContext.call(void 0, 0);
  _util.expect.call(void 0, _types.TokenType.colon);
  tsParseType();
  _index.popTypeContext.call(void 0, oldIsType);
} exports.tsParseTypeAnnotation = tsParseTypeAnnotation;

 function tsParseType() {
  tsParseNonConditionalType();
  if (_util.hasPrecedingLineBreak.call(void 0, ) || !_index.eat.call(void 0, _types.TokenType._extends)) {
    return;
  }
  // extends type
  tsParseNonConditionalType();
  _util.expect.call(void 0, _types.TokenType.question);
  // true type
  tsParseType();
  _util.expect.call(void 0, _types.TokenType.colon);
  // false type
  tsParseType();
} exports.tsParseType = tsParseType;

 function tsParseNonConditionalType() {
  if (tsIsStartOfFunctionType()) {
    tsParseFunctionOrConstructorType(FunctionType.TSFunctionType);
    return;
  }
  if (_index.match.call(void 0, _types.TokenType._new)) {
    // As in `new () => Date`
    tsParseFunctionOrConstructorType(FunctionType.TSConstructorType);
    return;
  }
  tsParseUnionTypeOrHigher();
} exports.tsParseNonConditionalType = tsParseNonConditionalType;

 function tsParseTypeAssertion() {
  const oldIsType = _index.pushTypeContext.call(void 0, 1);
  tsParseType();
  _util.expect.call(void 0, _types.TokenType.greaterThan);
  _index.popTypeContext.call(void 0, oldIsType);
  _expression.parseMaybeUnary.call(void 0, );
} exports.tsParseTypeAssertion = tsParseTypeAssertion;

 function tsTryParseJSXTypeArgument() {
  if (_index.eat.call(void 0, _types.TokenType.jsxTagStart)) {
    _base.state.tokens[_base.state.tokens.length - 1].type = _types.TokenType.typeParameterStart;
    const oldIsType = _index.pushTypeContext.call(void 0, 1);
    while (!_index.match.call(void 0, _types.TokenType.greaterThan) && !_base.state.error) {
      tsParseType();
      _index.eat.call(void 0, _types.TokenType.comma);
    }
    // Process >, but the one after needs to be parsed JSX-style.
    _jsx.nextJSXTagToken.call(void 0, );
    _index.popTypeContext.call(void 0, oldIsType);
  }
} exports.tsTryParseJSXTypeArgument = tsTryParseJSXTypeArgument;

function tsParseHeritageClause() {
  while (!_index.match.call(void 0, _types.TokenType.braceL) && !_base.state.error) {
    tsParseExpressionWithTypeArguments();
    _index.eat.call(void 0, _types.TokenType.comma);
  }
}

function tsParseExpressionWithTypeArguments() {
  // Note: TS uses parseLeftHandSideExpressionOrHigher,
  // then has grammar errors later if it's not an EntityName.
  tsParseEntityName();
  if (_index.match.call(void 0, _types.TokenType.lessThan)) {
    tsParseTypeArguments();
  }
}

function tsParseInterfaceDeclaration() {
  _lval.parseBindingIdentifier.call(void 0, false);
  tsTryParseTypeParameters();
  if (_index.eat.call(void 0, _types.TokenType._extends)) {
    tsParseHeritageClause();
  }
  tsParseObjectTypeMembers();
}

function tsParseTypeAliasDeclaration() {
  _lval.parseBindingIdentifier.call(void 0, false);
  tsTryParseTypeParameters();
  _util.expect.call(void 0, _types.TokenType.eq);
  tsParseType();
  _util.semicolon.call(void 0, );
}

function tsParseEnumMember() {
  // Computed property names are grammar errors in an enum, so accept just string literal or identifier.
  if (_index.match.call(void 0, _types.TokenType.string)) {
    _expression.parseLiteral.call(void 0, );
  } else {
    _expression.parseIdentifier.call(void 0, );
  }
  if (_index.eat.call(void 0, _types.TokenType.eq)) {
    const eqIndex = _base.state.tokens.length - 1;
    _expression.parseMaybeAssign.call(void 0, );
    _base.state.tokens[eqIndex].rhsEndIndex = _base.state.tokens.length;
  }
}

function tsParseEnumDeclaration() {
  _lval.parseBindingIdentifier.call(void 0, false);
  _util.expect.call(void 0, _types.TokenType.braceL);
  while (!_index.eat.call(void 0, _types.TokenType.braceR) && !_base.state.error) {
    tsParseEnumMember();
    _index.eat.call(void 0, _types.TokenType.comma);
  }
}

function tsParseModuleBlock() {
  _util.expect.call(void 0, _types.TokenType.braceL);
  _statement.parseBlockBody.call(void 0, /* end */ _types.TokenType.braceR);
}

function tsParseModuleOrNamespaceDeclaration() {
  _lval.parseBindingIdentifier.call(void 0, false);
  if (_index.eat.call(void 0, _types.TokenType.dot)) {
    tsParseModuleOrNamespaceDeclaration();
  } else {
    tsParseModuleBlock();
  }
}

function tsParseAmbientExternalModuleDeclaration() {
  if (_util.isContextual.call(void 0, _keywords.ContextualKeyword._global)) {
    _expression.parseIdentifier.call(void 0, );
  } else if (_index.match.call(void 0, _types.TokenType.string)) {
    _expression.parseExprAtom.call(void 0, );
  } else {
    _util.unexpected.call(void 0, );
  }

  if (_index.match.call(void 0, _types.TokenType.braceL)) {
    tsParseModuleBlock();
  } else {
    _util.semicolon.call(void 0, );
  }
}

 function tsParseImportEqualsDeclaration() {
  _lval.parseImportedIdentifier.call(void 0, );
  _util.expect.call(void 0, _types.TokenType.eq);
  tsParseModuleReference();
  _util.semicolon.call(void 0, );
} exports.tsParseImportEqualsDeclaration = tsParseImportEqualsDeclaration;

function tsIsExternalModuleReference() {
  return _util.isContextual.call(void 0, _keywords.ContextualKeyword._require) && _index.lookaheadType.call(void 0, ) === _types.TokenType.parenL;
}

function tsParseModuleReference() {
  if (tsIsExternalModuleReference()) {
    tsParseExternalModuleReference();
  } else {
    tsParseEntityName();
  }
}

function tsParseExternalModuleReference() {
  _util.expectContextual.call(void 0, _keywords.ContextualKeyword._require);
  _util.expect.call(void 0, _types.TokenType.parenL);
  if (!_index.match.call(void 0, _types.TokenType.string)) {
    _util.unexpected.call(void 0, );
  }
  _expression.parseLiteral.call(void 0, );
  _util.expect.call(void 0, _types.TokenType.parenR);
}

// Utilities

// Returns true if a statement matched.
function tsTryParseDeclare() {
  if (_util.isLineTerminator.call(void 0, )) {
    return false;
  }
  switch (_base.state.type) {
    case _types.TokenType._function: {
      const oldIsType = _index.pushTypeContext.call(void 0, 1);
      _index.next.call(void 0, );
      // We don't need to precisely get the function start here, since it's only used to mark
      // the function as a type if it's bodiless, and it's already a type here.
      const functionStart = _base.state.start;
      _statement.parseFunction.call(void 0, functionStart, /* isStatement */ true);
      _index.popTypeContext.call(void 0, oldIsType);
      return true;
    }
    case _types.TokenType._class: {
      const oldIsType = _index.pushTypeContext.call(void 0, 1);
      _statement.parseClass.call(void 0, /* isStatement */ true, /* optionalId */ false);
      _index.popTypeContext.call(void 0, oldIsType);
      return true;
    }
    case _types.TokenType._const: {
      if (_index.match.call(void 0, _types.TokenType._const) && _util.isLookaheadContextual.call(void 0, _keywords.ContextualKeyword._enum)) {
        const oldIsType = _index.pushTypeContext.call(void 0, 1);
        // `const enum = 0;` not allowed because "enum" is a strict mode reserved word.
        _util.expect.call(void 0, _types.TokenType._const);
        _util.expectContextual.call(void 0, _keywords.ContextualKeyword._enum);
        _base.state.tokens[_base.state.tokens.length - 1].type = _types.TokenType._enum;
        tsParseEnumDeclaration();
        _index.popTypeContext.call(void 0, oldIsType);
        return true;
      }
    }
    // falls through
    case _types.TokenType._var:
    case _types.TokenType._let: {
      const oldIsType = _index.pushTypeContext.call(void 0, 1);
      _statement.parseVarStatement.call(void 0, _base.state.type);
      _index.popTypeContext.call(void 0, oldIsType);
      return true;
    }
    case _types.TokenType.name: {
      const oldIsType = _index.pushTypeContext.call(void 0, 1);
      const contextualKeyword = _base.state.contextualKeyword;
      let matched = false;
      if (contextualKeyword === _keywords.ContextualKeyword._global) {
        tsParseAmbientExternalModuleDeclaration();
        matched = true;
      } else {
        matched = tsParseDeclaration(contextualKeyword, /* isBeforeToken */ true);
      }
      _index.popTypeContext.call(void 0, oldIsType);
      return matched;
    }
    default:
      return false;
  }
}

// Note: this won't be called unless the keyword is allowed in `shouldParseExportDeclaration`.
// Returns true if it matched a declaration.
function tsTryParseExportDeclaration() {
  return tsParseDeclaration(_base.state.contextualKeyword, /* isBeforeToken */ true);
}

// Returns true if it matched a statement.
function tsParseExpressionStatement(contextualKeyword) {
  switch (contextualKeyword) {
    case _keywords.ContextualKeyword._declare: {
      const declareTokenIndex = _base.state.tokens.length - 1;
      const matched = tsTryParseDeclare();
      if (matched) {
        _base.state.tokens[declareTokenIndex].type = _types.TokenType._declare;
        return true;
      }
      break;
    }
    case _keywords.ContextualKeyword._global:
      // `global { }` (with no `declare`) may appear inside an ambient module declaration.
      // Would like to use tsParseAmbientExternalModuleDeclaration here, but already ran past "global".
      if (_index.match.call(void 0, _types.TokenType.braceL)) {
        tsParseModuleBlock();
        return true;
      }
      break;

    default:
      return tsParseDeclaration(contextualKeyword, /* isBeforeToken */ false);
  }
  return false;
}

// Common to tsTryParseDeclare, tsTryParseExportDeclaration, and tsParseExpressionStatement.
// Returns true if it matched a declaration.
function tsParseDeclaration(contextualKeyword, isBeforeToken) {
  switch (contextualKeyword) {
    case _keywords.ContextualKeyword._abstract:
      if (tsCheckLineTerminatorAndMatch(_types.TokenType._class, isBeforeToken)) {
        if (isBeforeToken) _index.next.call(void 0, );
        _base.state.tokens[_base.state.tokens.length - 1].type = _types.TokenType._abstract;
        _statement.parseClass.call(void 0, /* isStatement */ true, /* optionalId */ false);
        return true;
      }
      break;

    case _keywords.ContextualKeyword._enum:
      if (tsCheckLineTerminatorAndMatch(_types.TokenType.name, isBeforeToken)) {
        if (isBeforeToken) _index.next.call(void 0, );
        _base.state.tokens[_base.state.tokens.length - 1].type = _types.TokenType._enum;
        tsParseEnumDeclaration();
        return true;
      }
      break;

    case _keywords.ContextualKeyword._interface:
      if (tsCheckLineTerminatorAndMatch(_types.TokenType.name, isBeforeToken)) {
        // `next` is true in "export" and "declare" contexts, so we want to remove that token
        // as well.
        const oldIsType = _index.pushTypeContext.call(void 0, 1);
        if (isBeforeToken) _index.next.call(void 0, );
        tsParseInterfaceDeclaration();
        _index.popTypeContext.call(void 0, oldIsType);
        return true;
      }
      break;

    case _keywords.ContextualKeyword._module:
      if (isBeforeToken) _index.next.call(void 0, );
      if (_index.match.call(void 0, _types.TokenType.string)) {
        const oldIsType = _index.pushTypeContext.call(void 0, isBeforeToken ? 2 : 1);
        tsParseAmbientExternalModuleDeclaration();
        _index.popTypeContext.call(void 0, oldIsType);
        return true;
      } else if (tsCheckLineTerminatorAndMatch(_types.TokenType.name, isBeforeToken)) {
        const oldIsType = _index.pushTypeContext.call(void 0, isBeforeToken ? 2 : 1);
        if (isBeforeToken) _index.next.call(void 0, );
        tsParseModuleOrNamespaceDeclaration();
        _index.popTypeContext.call(void 0, oldIsType);
        return true;
      }
      break;

    case _keywords.ContextualKeyword._namespace:
      if (tsCheckLineTerminatorAndMatch(_types.TokenType.name, isBeforeToken)) {
        const oldIsType = _index.pushTypeContext.call(void 0, 1);
        if (isBeforeToken) _index.next.call(void 0, );
        tsParseModuleOrNamespaceDeclaration();
        _index.popTypeContext.call(void 0, oldIsType);
        return true;
      }
      break;

    case _keywords.ContextualKeyword._type:
      if (tsCheckLineTerminatorAndMatch(_types.TokenType.name, isBeforeToken)) {
        const oldIsType = _index.pushTypeContext.call(void 0, 1);
        if (isBeforeToken) _index.next.call(void 0, );
        tsParseTypeAliasDeclaration();
        _index.popTypeContext.call(void 0, oldIsType);
        return true;
      }
      break;

    default:
      break;
  }
  return false;
}

function tsCheckLineTerminatorAndMatch(tokenType, isBeforeToken) {
  return !_util.isLineTerminator.call(void 0, ) && (isBeforeToken || _index.match.call(void 0, tokenType));
}

// Returns true if there was a generic async arrow function.
function tsTryParseGenericAsyncArrowFunction() {
  const snapshot = _base.state.snapshot();

  tsParseTypeParameters();
  _statement.parseFunctionParams.call(void 0, );
  tsTryParseTypeOrTypePredicateAnnotation();
  _util.expect.call(void 0, _types.TokenType.arrow);

  if (_base.state.error) {
    _base.state.restoreFromSnapshot(snapshot);
    return false;
  }

  _expression.parseFunctionBody.call(void 0, true);
  return true;
}

function tsParseTypeArguments() {
  const oldIsType = _index.pushTypeContext.call(void 0, 0);
  _util.expect.call(void 0, _types.TokenType.lessThan);
  while (!_index.eat.call(void 0, _types.TokenType.greaterThan) && !_base.state.error) {
    tsParseType();
    _index.eat.call(void 0, _types.TokenType.comma);
  }
  _index.popTypeContext.call(void 0, oldIsType);
}

 function tsIsDeclarationStart() {
  if (_index.match.call(void 0, _types.TokenType.name)) {
    switch (_base.state.contextualKeyword) {
      case _keywords.ContextualKeyword._abstract:
      case _keywords.ContextualKeyword._declare:
      case _keywords.ContextualKeyword._enum:
      case _keywords.ContextualKeyword._interface:
      case _keywords.ContextualKeyword._module:
      case _keywords.ContextualKeyword._namespace:
      case _keywords.ContextualKeyword._type:
        return true;
      default:
        break;
    }
  }

  return false;
} exports.tsIsDeclarationStart = tsIsDeclarationStart;

// ======================================================
// OVERRIDES
// ======================================================

 function tsParseFunctionBodyAndFinish(functionStart, funcContextId) {
  // For arrow functions, `parseArrow` handles the return type itself.
  if (_index.match.call(void 0, _types.TokenType.colon)) {
    tsParseTypeOrTypePredicateAnnotation(_types.TokenType.colon);
  }

  // The original code checked the node type to make sure this function type allows a missing
  // body, but we skip that to avoid sending around the node type. We instead just use the
  // allowExpressionBody boolean to make sure it's not an arrow function.
  if (!_index.match.call(void 0, _types.TokenType.braceL) && _util.isLineTerminator.call(void 0, )) {
    // Retroactively mark the function declaration as a type.
    let i = _base.state.tokens.length - 1;
    while (
      i >= 0 &&
      (_base.state.tokens[i].start >= functionStart ||
        _base.state.tokens[i].type === _types.TokenType._default ||
        _base.state.tokens[i].type === _types.TokenType._export)
    ) {
      _base.state.tokens[i].isType = true;
      i--;
    }
    return;
  }

  _expression.parseFunctionBody.call(void 0, false, funcContextId);
} exports.tsParseFunctionBodyAndFinish = tsParseFunctionBodyAndFinish;

 function tsParseSubscript(startPos, noCalls, stopState) {
  if (!_util.hasPrecedingLineBreak.call(void 0, ) && _index.eat.call(void 0, _types.TokenType.bang)) {
    _base.state.tokens[_base.state.tokens.length - 1].type = _types.TokenType.nonNullAssertion;
    return;
  }

  if (_index.match.call(void 0, _types.TokenType.lessThan)) {
    // There are number of things we are going to "maybe" parse, like type arguments on
    // tagged template expressions. If any of them fail, walk it back and continue.
    const snapshot = _base.state.snapshot();

    if (!noCalls && _expression.atPossibleAsync.call(void 0, )) {
      // Almost certainly this is a generic async function `async <T>() => ...
      // But it might be a call with a type argument `async<T>();`
      const asyncArrowFn = tsTryParseGenericAsyncArrowFunction();
      if (asyncArrowFn) {
        return;
      }
    }
    tsParseTypeArguments();
    if (!noCalls && _index.eat.call(void 0, _types.TokenType.parenL)) {
      _expression.parseCallExpressionArguments.call(void 0, );
    } else if (_index.match.call(void 0, _types.TokenType.backQuote)) {
      // Tagged template with a type argument.
      _expression.parseTemplate.call(void 0, );
    } else {
      _util.unexpected.call(void 0, );
    }

    if (_base.state.error) {
      _base.state.restoreFromSnapshot(snapshot);
    } else {
      return;
    }
  }
  _expression.baseParseSubscript.call(void 0, startPos, noCalls, stopState);
} exports.tsParseSubscript = tsParseSubscript;

 function tsStartParseNewArguments() {
  if (_index.match.call(void 0, _types.TokenType.lessThan)) {
    // 99% certain this is `new C<T>();`. But may be `new C < T;`, which is also legal.
    const snapshot = _base.state.snapshot();

    _base.state.type = _types.TokenType.typeParameterStart;
    tsParseTypeArguments();
    if (!_index.match.call(void 0, _types.TokenType.parenL)) {
      _util.unexpected.call(void 0, );
    }

    if (_base.state.error) {
      _base.state.restoreFromSnapshot(snapshot);
    }
  }
} exports.tsStartParseNewArguments = tsStartParseNewArguments;

 function tsTryParseExport() {
  if (_index.match.call(void 0, _types.TokenType._import)) {
    // `export import A = B;`
    _util.expect.call(void 0, _types.TokenType._import);
    tsParseImportEqualsDeclaration();
    return true;
  } else if (_index.eat.call(void 0, _types.TokenType.eq)) {
    // `export = x;`
    _expression.parseExpression.call(void 0, );
    _util.semicolon.call(void 0, );
    return true;
  } else if (_util.eatContextual.call(void 0, _keywords.ContextualKeyword._as)) {
    // `export as namespace A;`
    // See `parseNamespaceExportDeclaration` in TypeScript's own parser
    _util.expectContextual.call(void 0, _keywords.ContextualKeyword._namespace);
    _expression.parseIdentifier.call(void 0, );
    _util.semicolon.call(void 0, );
    return true;
  } else {
    return false;
  }
} exports.tsTryParseExport = tsTryParseExport;

 function tsTryParseExportDefaultExpression() {
  if (_util.isContextual.call(void 0, _keywords.ContextualKeyword._abstract) && _index.lookaheadType.call(void 0, ) === _types.TokenType._class) {
    _base.state.type = _types.TokenType._abstract;
    _index.next.call(void 0, ); // Skip "abstract"
    _statement.parseClass.call(void 0, true, true);
    return true;
  }
  if (_util.isContextual.call(void 0, _keywords.ContextualKeyword._interface)) {
    // Make sure "export default" are considered type tokens so the whole thing is removed.
    const oldIsType = _index.pushTypeContext.call(void 0, 2);
    tsParseDeclaration(_keywords.ContextualKeyword._interface, true);
    _index.popTypeContext.call(void 0, oldIsType);
    return true;
  }
  return false;
} exports.tsTryParseExportDefaultExpression = tsTryParseExportDefaultExpression;

 function tsTryParseStatementContent() {
  if (_base.state.type === _types.TokenType._const) {
    const ahead = _index.lookaheadTypeAndKeyword.call(void 0, );
    if (ahead.type === _types.TokenType.name && ahead.contextualKeyword === _keywords.ContextualKeyword._enum) {
      _util.expect.call(void 0, _types.TokenType._const);
      _util.expectContextual.call(void 0, _keywords.ContextualKeyword._enum);
      _base.state.tokens[_base.state.tokens.length - 1].type = _types.TokenType._enum;
      tsParseEnumDeclaration();
      return true;
    }
  }
  return false;
} exports.tsTryParseStatementContent = tsTryParseStatementContent;

 function tsParseAccessModifier() {
  tsParseModifier([
    _keywords.ContextualKeyword._public,
    _keywords.ContextualKeyword._protected,
    _keywords.ContextualKeyword._private,
  ]);
} exports.tsParseAccessModifier = tsParseAccessModifier;

 function tsTryParseClassMemberWithIsStatic(
  isStatic,
  classContextId,
) {
  let isAbstract = false;
  let isReadonly = false;

  const mod = tsParseModifier([_keywords.ContextualKeyword._abstract, _keywords.ContextualKeyword._readonly]);
  switch (mod) {
    case _keywords.ContextualKeyword._readonly:
      isReadonly = true;
      isAbstract = !!tsParseModifier([_keywords.ContextualKeyword._abstract]);
      break;
    case _keywords.ContextualKeyword._abstract:
      isAbstract = true;
      isReadonly = !!tsParseModifier([_keywords.ContextualKeyword._readonly]);
      break;
    default:
      break;
  }

  // We no longer check for public/private/etc, but tsTryParseIndexSignature should just return
  // false in that case for valid code.
  if (!isAbstract && !isStatic) {
    const found = tsTryParseIndexSignature();
    if (found) {
      return true;
    }
  }

  if (isReadonly) {
    // Must be a property (if not an index signature).
    _statement.parseClassPropertyName.call(void 0, classContextId);
    _statement.parsePostMemberNameModifiers.call(void 0, );
    _statement.parseClassProperty.call(void 0, );
    return true;
  }
  return false;
} exports.tsTryParseClassMemberWithIsStatic = tsTryParseClassMemberWithIsStatic;

// Note: The reason we do this in `parseIdentifierStatement` and not `parseStatement`
// is that e.g. `type()` is valid JS, so we must try parsing that first.
// If it's really a type, we will parse `type` as the statement, and can correct it here
// by parsing the rest.
 function tsParseIdentifierStatement(contextualKeyword) {
  const matched = tsParseExpressionStatement(contextualKeyword);
  if (!matched) {
    _util.semicolon.call(void 0, );
  }
} exports.tsParseIdentifierStatement = tsParseIdentifierStatement;

 function tsParseExportDeclaration() {
  // "export declare" is equivalent to just "export".
  const isDeclare = _util.eatContextual.call(void 0, _keywords.ContextualKeyword._declare);
  if (isDeclare) {
    _base.state.tokens[_base.state.tokens.length - 1].type = _types.TokenType._declare;
  }

  let matchedDeclaration = false;
  if (_index.match.call(void 0, _types.TokenType.name)) {
    if (isDeclare) {
      const oldIsType = _index.pushTypeContext.call(void 0, 2);
      matchedDeclaration = tsTryParseExportDeclaration();
      _index.popTypeContext.call(void 0, oldIsType);
    } else {
      matchedDeclaration = tsTryParseExportDeclaration();
    }
  }
  if (!matchedDeclaration) {
    if (isDeclare) {
      const oldIsType = _index.pushTypeContext.call(void 0, 2);
      _statement.parseStatement.call(void 0, true);
      _index.popTypeContext.call(void 0, oldIsType);
    } else {
      _statement.parseStatement.call(void 0, true);
    }
  }
} exports.tsParseExportDeclaration = tsParseExportDeclaration;

 function tsAfterParseClassSuper(hasSuper) {
  if (hasSuper && _index.match.call(void 0, _types.TokenType.lessThan)) {
    tsParseTypeArguments();
  }
  if (_util.eatContextual.call(void 0, _keywords.ContextualKeyword._implements)) {
    _base.state.tokens[_base.state.tokens.length - 1].type = _types.TokenType._implements;
    const oldIsType = _index.pushTypeContext.call(void 0, 1);
    tsParseHeritageClause();
    _index.popTypeContext.call(void 0, oldIsType);
  }
} exports.tsAfterParseClassSuper = tsAfterParseClassSuper;

 function tsStartParseObjPropValue() {
  tsTryParseTypeParameters();
} exports.tsStartParseObjPropValue = tsStartParseObjPropValue;

 function tsStartParseFunctionParams() {
  tsTryParseTypeParameters();
} exports.tsStartParseFunctionParams = tsStartParseFunctionParams;

// `let x: number;`
 function tsAfterParseVarHead() {
  const oldIsType = _index.pushTypeContext.call(void 0, 0);
  _index.eat.call(void 0, _types.TokenType.bang);
  tsTryParseTypeAnnotation();
  _index.popTypeContext.call(void 0, oldIsType);
} exports.tsAfterParseVarHead = tsAfterParseVarHead;

// parse the return type of an async arrow function - let foo = (async (): number => {});
 function tsStartParseAsyncArrowFromCallExpression() {
  if (_index.match.call(void 0, _types.TokenType.colon)) {
    tsParseTypeAnnotation();
  }
} exports.tsStartParseAsyncArrowFromCallExpression = tsStartParseAsyncArrowFromCallExpression;

// Returns true if the expression was an arrow function.
 function tsParseMaybeAssign(noIn, isWithinParens) {
  // Note: When the JSX plugin is on, type assertions (`<T> x`) aren't valid syntax.
  if (_base.isJSXEnabled) {
    return tsParseMaybeAssignWithJSX(noIn, isWithinParens);
  } else {
    return tsParseMaybeAssignWithoutJSX(noIn, isWithinParens);
  }
} exports.tsParseMaybeAssign = tsParseMaybeAssign;

 function tsParseMaybeAssignWithJSX(noIn, isWithinParens) {
  if (!_index.match.call(void 0, _types.TokenType.lessThan)) {
    return _expression.baseParseMaybeAssign.call(void 0, noIn, isWithinParens);
  }

  // Prefer to parse JSX if possible. But may be an arrow fn.
  const snapshot = _base.state.snapshot();
  let wasArrow = _expression.baseParseMaybeAssign.call(void 0, noIn, isWithinParens);
  if (_base.state.error) {
    _base.state.restoreFromSnapshot(snapshot);
  } else {
    return wasArrow;
  }

  // Otherwise, try as type-parameterized arrow function.
  _base.state.type = _types.TokenType.typeParameterStart;
  // This is similar to TypeScript's `tryParseParenthesizedArrowFunctionExpression`.
  tsParseTypeParameters();
  wasArrow = _expression.baseParseMaybeAssign.call(void 0, noIn, isWithinParens);
  if (!wasArrow) {
    _util.unexpected.call(void 0, );
  }

  return wasArrow;
} exports.tsParseMaybeAssignWithJSX = tsParseMaybeAssignWithJSX;

 function tsParseMaybeAssignWithoutJSX(noIn, isWithinParens) {
  if (!_index.match.call(void 0, _types.TokenType.lessThan)) {
    return _expression.baseParseMaybeAssign.call(void 0, noIn, isWithinParens);
  }

  const snapshot = _base.state.snapshot();
  // This is similar to TypeScript's `tryParseParenthesizedArrowFunctionExpression`.
  tsParseTypeParameters();
  const wasArrow = _expression.baseParseMaybeAssign.call(void 0, noIn, isWithinParens);
  if (!wasArrow) {
    _util.unexpected.call(void 0, );
  }
  if (_base.state.error) {
    _base.state.restoreFromSnapshot(snapshot);
  } else {
    return wasArrow;
  }

  // Try parsing a type cast instead of an arrow function.
  // This will start with a type assertion (via parseMaybeUnary).
  // But don't directly call `tsParseTypeAssertion` because we want to handle any binary after it.
  return _expression.baseParseMaybeAssign.call(void 0, noIn, isWithinParens);
} exports.tsParseMaybeAssignWithoutJSX = tsParseMaybeAssignWithoutJSX;

 function tsParseArrow() {
  if (_index.match.call(void 0, _types.TokenType.colon)) {
    // This is different from how the TS parser does it.
    // TS uses lookahead. Babylon parses it as a parenthesized expression and converts.
    const snapshot = _base.state.snapshot();

    tsParseTypeOrTypePredicateAnnotation(_types.TokenType.colon);
    if (_util.canInsertSemicolon.call(void 0, )) _util.unexpected.call(void 0, );
    if (!_index.match.call(void 0, _types.TokenType.arrow)) _util.unexpected.call(void 0, );

    if (_base.state.error) {
      _base.state.restoreFromSnapshot(snapshot);
    }
  }
  return _index.eat.call(void 0, _types.TokenType.arrow);
} exports.tsParseArrow = tsParseArrow;

// Allow type annotations inside of a parameter list.
 function tsParseAssignableListItemTypes() {
  const oldIsType = _index.pushTypeContext.call(void 0, 0);
  _index.eat.call(void 0, _types.TokenType.question);
  tsTryParseTypeAnnotation();
  _index.popTypeContext.call(void 0, oldIsType);
} exports.tsParseAssignableListItemTypes = tsParseAssignableListItemTypes;

 function tsParseMaybeDecoratorArguments() {
  if (_index.match.call(void 0, _types.TokenType.lessThan)) {
    tsParseTypeArguments();
  }
  _statement.baseParseMaybeDecoratorArguments.call(void 0, );
} exports.tsParseMaybeDecoratorArguments = tsParseMaybeDecoratorArguments;
