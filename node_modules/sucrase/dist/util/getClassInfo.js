"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }Object.defineProperty(exports, "__esModule", {value: true});

var _keywords = require('../parser/tokenizer/keywords');
var _types = require('../parser/tokenizer/types');







































/**
 * Get information about the class fields for this class, given a token processor pointing to the
 * open-brace at the start of the class.
 */
 function getClassInfo(
  rootTransformer,
  tokens,
  nameManager,
) {
  const snapshot = tokens.snapshot();

  const headerInfo = processClassHeader(tokens);

  let constructorInitializerStatements = [];
  const instanceInitializerNames = [];
  const staticInitializerNames = [];
  let constructorInsertPos = null;
  const fields = [];
  const rangesToRemove = [];

  const classContextId = tokens.currentToken().contextId;
  if (classContextId == null) {
    throw new Error("Expected non-null class context ID on class open-brace.");
  }

  tokens.nextToken();
  while (!tokens.matchesContextIdAndLabel(_types.TokenType.braceR, classContextId)) {
    if (tokens.matchesContextual(_keywords.ContextualKeyword._constructor) && !tokens.currentToken().isType) {
      ({constructorInitializerStatements, constructorInsertPos} = processConstructor(tokens));
    } else if (tokens.matches1(_types.TokenType.semi)) {
      rangesToRemove.push({start: tokens.currentIndex(), end: tokens.currentIndex() + 1});
      tokens.nextToken();
    } else if (tokens.currentToken().isType) {
      tokens.nextToken();
    } else {
      // Either a method or a field. Skip to the identifier part.
      const statementStartIndex = tokens.currentIndex();
      let isStatic = false;
      while (isAccessModifier(tokens.currentToken())) {
        if (tokens.matches1(_types.TokenType._static)) {
          isStatic = true;
        }
        tokens.nextToken();
      }
      if (
        tokens.matchesContextual(_keywords.ContextualKeyword._constructor) &&
        !tokens.currentToken().isType
      ) {
        ({constructorInitializerStatements, constructorInsertPos} = processConstructor(tokens));
        continue;
      }
      const nameStartIndex = tokens.currentIndex();
      skipFieldName(tokens);
      if (tokens.matches1(_types.TokenType.lessThan) || tokens.matches1(_types.TokenType.parenL)) {
        // This is a method, so just skip to the next method/field. To do that, we seek forward to
        // the next start of a class name (either an open bracket or an identifier, or the closing
        // curly brace), then seek backward to include any access modifiers.
        while (tokens.currentToken().contextId !== classContextId) {
          tokens.nextToken();
        }
        while (isAccessModifier(tokens.tokenAtRelativeIndex(-1))) {
          tokens.previousToken();
        }
        continue;
      }
      // There might be a type annotation that we need to skip.
      while (tokens.currentToken().isType) {
        tokens.nextToken();
      }
      if (tokens.matches1(_types.TokenType.eq)) {
        const equalsIndex = tokens.currentIndex();
        // This is an initializer, so we need to wrap in an initializer method.
        const valueEnd = tokens.currentToken().rhsEndIndex;
        if (valueEnd == null) {
          throw new Error("Expected rhsEndIndex on class field assignment.");
        }
        tokens.nextToken();
        while (tokens.currentIndex() < valueEnd) {
          rootTransformer.processToken();
        }
        let initializerName;
        if (isStatic) {
          initializerName = nameManager.claimFreeName("__initStatic");
          staticInitializerNames.push(initializerName);
        } else {
          initializerName = nameManager.claimFreeName("__init");
          instanceInitializerNames.push(initializerName);
        }
        // Fields start at the name, so `static x = 1;` has a field range of `x = 1;`.
        fields.push({
          initializerName,
          equalsIndex,
          start: nameStartIndex,
          end: tokens.currentIndex(),
        });
      } else {
        // This is just a declaration, so doesn't need to produce any code in the output.
        rangesToRemove.push({start: statementStartIndex, end: tokens.currentIndex()});
      }
    }
  }

  tokens.restoreToSnapshot(snapshot);
  return {
    headerInfo,
    constructorInitializerStatements,
    instanceInitializerNames,
    staticInitializerNames,
    constructorInsertPos,
    fields,
    rangesToRemove,
  };
} exports.default = getClassInfo;

function processClassHeader(tokens) {
  const classToken = tokens.currentToken();
  const contextId = classToken.contextId;
  if (contextId == null) {
    throw new Error("Expected context ID on class token.");
  }
  const isExpression = classToken.isExpression;
  if (isExpression == null) {
    throw new Error("Expected isExpression on class token.");
  }
  let className = null;
  let hasSuperclass = false;
  tokens.nextToken();
  if (tokens.matches1(_types.TokenType.name)) {
    className = tokens.identifierName();
  }
  while (!tokens.matchesContextIdAndLabel(_types.TokenType.braceL, contextId)) {
    // If this has a superclass, there will always be an `extends` token. If it doesn't have a
    // superclass, only type parameters and `implements` clauses can show up here, all of which
    // consist only of type tokens. A declaration like `class A<B extends C> {` should *not* count
    // as having a superclass.
    if (tokens.matches1(_types.TokenType._extends) && !tokens.currentToken().isType) {
      hasSuperclass = true;
    }
    tokens.nextToken();
  }
  return {isExpression, className, hasSuperclass};
}

/**
 * Extract useful information out of a constructor, starting at the "constructor" name.
 */
function processConstructor(
  tokens,
) {
  const constructorInitializerStatements = [];

  tokens.nextToken();
  const constructorContextId = tokens.currentToken().contextId;
  if (constructorContextId == null) {
    throw new Error("Expected context ID on open-paren starting constructor params.");
  }
  tokens.nextToken();
  // Advance through parameters looking for access modifiers.
  while (!tokens.matchesContextIdAndLabel(_types.TokenType.parenR, constructorContextId)) {
    if (isAccessModifier(tokens.currentToken())) {
      tokens.nextToken();
      while (isAccessModifier(tokens.currentToken())) {
        tokens.nextToken();
      }
      const token = tokens.currentToken();
      if (token.type !== _types.TokenType.name) {
        throw new Error("Expected identifier after access modifiers in constructor arg.");
      }
      const name = tokens.identifierNameForToken(token);
      constructorInitializerStatements.push(`this.${name} = ${name}`);
    }
    tokens.nextToken();
  }
  // )
  tokens.nextToken();
  let constructorInsertPos = tokens.currentIndex();

  // Advance through body looking for a super call.
  let foundSuperCall = false;
  while (!tokens.matchesContextIdAndLabel(_types.TokenType.braceR, constructorContextId)) {
    if (!foundSuperCall && tokens.matches2(_types.TokenType._super, _types.TokenType.parenL)) {
      tokens.nextToken();
      const superCallContextId = tokens.currentToken().contextId;
      if (superCallContextId == null) {
        throw new Error("Expected a context ID on the super call");
      }
      while (!tokens.matchesContextIdAndLabel(_types.TokenType.parenR, superCallContextId)) {
        tokens.nextToken();
      }
      constructorInsertPos = tokens.currentIndex();
      foundSuperCall = true;
    }
    tokens.nextToken();
  }
  // }
  tokens.nextToken();

  return {constructorInitializerStatements, constructorInsertPos};
}

/**
 * Determine if this is any token that can go before the name in a method/field.
 */
function isAccessModifier(token) {
  return [
    _types.TokenType._async,
    _types.TokenType._get,
    _types.TokenType._set,
    _types.TokenType.plus,
    _types.TokenType.minus,
    _types.TokenType._readonly,
    _types.TokenType._static,
    _types.TokenType._public,
    _types.TokenType._private,
    _types.TokenType._protected,
    _types.TokenType._abstract,
  ].includes(token.type);
}

/**
 * The next token or set of tokens is either an identifier or an expression in square brackets, for
 * a method or field name.
 */
function skipFieldName(tokens) {
  if (tokens.matches1(_types.TokenType.bracketL)) {
    const startToken = tokens.currentToken();
    const classContextId = startToken.contextId;
    if (classContextId == null) {
      throw new Error("Expected class context ID on computed name open bracket.");
    }
    while (!tokens.matchesContextIdAndLabel(_types.TokenType.bracketR, classContextId)) {
      tokens.nextToken();
    }
    tokens.nextToken();
  } else {
    tokens.nextToken();
  }
}
