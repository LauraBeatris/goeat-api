"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }Object.defineProperty(exports, "__esModule", {value: true});var _types = require('../parser/tokenizer/types');

var _isIdentifier = require('../util/isIdentifier'); var _isIdentifier2 = _interopRequireDefault(_isIdentifier);

var _Transformer = require('./Transformer'); var _Transformer2 = _interopRequireDefault(_Transformer);

 class TypeScriptTransformer extends _Transformer2.default {
  constructor(
     rootTransformer,
     tokens,
     isImportsTransformEnabled,
  ) {
    super();this.rootTransformer = rootTransformer;this.tokens = tokens;this.isImportsTransformEnabled = isImportsTransformEnabled;;
  }

  process() {
    if (
      this.rootTransformer.processPossibleArrowParamEnd() ||
      this.rootTransformer.processPossibleAsyncArrowWithTypeParams() ||
      this.rootTransformer.processPossibleTypeRange()
    ) {
      return true;
    }
    if (
      this.tokens.matches1(_types.TokenType._public) ||
      this.tokens.matches1(_types.TokenType._protected) ||
      this.tokens.matches1(_types.TokenType._private) ||
      this.tokens.matches1(_types.TokenType._abstract) ||
      this.tokens.matches1(_types.TokenType._readonly) ||
      this.tokens.matches1(_types.TokenType.nonNullAssertion)
    ) {
      this.tokens.removeInitialToken();
      return true;
    }
    if (this.tokens.matches1(_types.TokenType._enum) || this.tokens.matches2(_types.TokenType._const, _types.TokenType._enum)) {
      this.processEnum();
      return true;
    }
    if (
      this.tokens.matches2(_types.TokenType._export, _types.TokenType._enum) ||
      this.tokens.matches3(_types.TokenType._export, _types.TokenType._const, _types.TokenType._enum)
    ) {
      this.processEnum(true);
      return true;
    }
    return false;
  }

  processEnum(isExport = false) {
    // We might have "export const enum", so just remove all relevant tokens.
    this.tokens.removeInitialToken();
    while (this.tokens.matches1(_types.TokenType._const) || this.tokens.matches1(_types.TokenType._enum)) {
      this.tokens.removeToken();
    }
    const enumName = this.tokens.identifierName();
    this.tokens.removeToken();
    if (isExport && !this.isImportsTransformEnabled) {
      this.tokens.appendCode("export ");
    }
    this.tokens.appendCode(`var ${enumName}; (function (${enumName})`);
    this.tokens.copyExpectedToken(_types.TokenType.braceL);
    this.processEnumBody(enumName);
    this.tokens.copyExpectedToken(_types.TokenType.braceR);
    if (isExport && this.isImportsTransformEnabled) {
      this.tokens.appendCode(`)(${enumName} || (exports.${enumName} = ${enumName} = {}));`);
    } else {
      this.tokens.appendCode(`)(${enumName} || (${enumName} = {}));`);
    }
  }

  /**
   * Rather than try to compute the actual enum values at compile time, we just create variables for
   * each one and let everything evaluate at runtime. There's some additional complexity due to
   * handling string literal names, including ones that happen to be valid identifiers.
   */
  processEnumBody(enumName) {
    let isPreviousValidIdentifier = false;
    let lastValueReference = null;
    while (true) {
      if (this.tokens.matches1(_types.TokenType.braceR)) {
        break;
      }
      const nameToken = this.tokens.currentToken();
      let name;
      let nameStringCode;
      if (nameToken.type === _types.TokenType.name) {
        name = this.tokens.identifierNameForToken(nameToken);
        nameStringCode = `"${name}"`;
      } else if (nameToken.type === _types.TokenType.string) {
        name = this.tokens.stringValueForToken(nameToken);
        nameStringCode = this.tokens.code.slice(nameToken.start, nameToken.end);
      } else {
        throw new Error("Expected name or string at beginning of enum element.");
      }
      const isValidIdentifier = _isIdentifier2.default.call(void 0, name);
      this.tokens.removeInitialToken();

      let valueIsString;
      let valueCode;

      if (this.tokens.matches1(_types.TokenType.eq)) {
        const rhsEndIndex = this.tokens.currentToken().rhsEndIndex;
        if (rhsEndIndex == null) {
          throw new Error("Expected rhsEndIndex on enum assign.");
        }
        this.tokens.removeToken();
        if (
          this.tokens.matches2(_types.TokenType.string, _types.TokenType.comma) ||
          this.tokens.matches2(_types.TokenType.string, _types.TokenType.braceR)
        ) {
          valueIsString = true;
        }
        const startToken = this.tokens.currentToken();
        while (this.tokens.currentIndex() < rhsEndIndex) {
          this.tokens.removeToken();
        }
        valueCode = this.tokens.code.slice(
          startToken.start,
          this.tokens.tokenAtRelativeIndex(-1).end,
        );
      } else {
        valueIsString = false;
        if (lastValueReference != null) {
          if (isPreviousValidIdentifier) {
            valueCode = `${lastValueReference} + 1`;
          } else {
            valueCode = `(${lastValueReference}) + 1`;
          }
        } else {
          valueCode = "0";
        }
      }
      if (this.tokens.matches1(_types.TokenType.comma)) {
        this.tokens.removeToken();
      }

      let valueReference;
      if (isValidIdentifier) {
        this.tokens.appendCode(`const ${name} = ${valueCode}; `);
        valueReference = name;
      } else {
        valueReference = valueCode;
      }

      if (valueIsString) {
        this.tokens.appendCode(`${enumName}[${nameStringCode}] = ${valueReference};`);
      } else {
        this.tokens.appendCode(
          `${enumName}[${enumName}[${nameStringCode}] = ${valueReference}] = ${nameStringCode};`,
        );
      }
      lastValueReference = valueReference;
      isPreviousValidIdentifier = isValidIdentifier;
    }
  }
} exports.default = TypeScriptTransformer;
