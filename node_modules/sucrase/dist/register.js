"use strict"; function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } }Object.defineProperty(exports, "__esModule", {value: true});// @ts-ignore: no types available.
var _pirates = require('pirates'); var pirates = _interopRequireWildcard(_pirates);

var _index = require('./index');

 function addHook(extension, options) {
  pirates.addHook(
    (code, filePath) => {
      const {code: transformedCode, sourceMap} = _index.transform.call(void 0, code, {
        ...options,
        sourceMapOptions: {compiledFilename: filePath},
        filePath,
      });
      const mapBase64 = Buffer.from(JSON.stringify(sourceMap)).toString("base64");
      const suffix = `//# sourceMappingURL=data:application/json;charset=utf-8;base64,${mapBase64}`;
      return `${transformedCode}\n${suffix}`;
    },
    {exts: [extension]},
  );
} exports.addHook = addHook;

 function registerJS() {
  addHook(".js", {transforms: ["imports", "flow", "jsx"]});
} exports.registerJS = registerJS;

 function registerJSX() {
  addHook(".jsx", {transforms: ["imports", "flow", "jsx"]});
} exports.registerJSX = registerJSX;

 function registerTS() {
  addHook(".ts", {transforms: ["imports", "typescript"]});
} exports.registerTS = registerTS;

 function registerTSX() {
  addHook(".tsx", {transforms: ["imports", "typescript", "jsx"]});
} exports.registerTSX = registerTSX;

 function registerTSLegacyModuleInterop() {
  addHook(".ts", {
    transforms: ["imports", "typescript"],
    enableLegacyTypeScriptModuleInterop: true,
  });
} exports.registerTSLegacyModuleInterop = registerTSLegacyModuleInterop;

 function registerTSXLegacyModuleInterop() {
  addHook(".tsx", {
    transforms: ["imports", "typescript", "jsx"],
    enableLegacyTypeScriptModuleInterop: true,
  });
} exports.registerTSXLegacyModuleInterop = registerTSXLegacyModuleInterop;

 function registerAll() {
  registerJS();
  registerJSX();
  registerTS();
  registerTSX();
} exports.registerAll = registerAll;
