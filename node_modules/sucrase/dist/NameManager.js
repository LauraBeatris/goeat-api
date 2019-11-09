"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }Object.defineProperty(exports, "__esModule", {value: true});var _types = require('./parser/tokenizer/types');


 class NameManager {
    __init() {this.usedNames = new Set()}

  constructor( tokens) {;this.tokens = tokens;NameManager.prototype.__init.call(this);}

  preprocessNames() {
    for (let i = 0; i < this.tokens.tokens.length; i++) {
      if (this.tokens.matches1AtIndex(i, _types.TokenType.name)) {
        this.usedNames.add(this.tokens.identifierNameAtIndex(i));
      }
    }
  }

  claimFreeName(name) {
    const newName = this.findFreeName(name);
    this.usedNames.add(newName);
    return newName;
  }

  findFreeName(name) {
    if (!this.usedNames.has(name)) {
      return name;
    }
    let suffixNum = 2;
    while (this.usedNames.has(name + suffixNum)) {
      suffixNum++;
    }
    return name + suffixNum;
  }
} exports.default = NameManager;
