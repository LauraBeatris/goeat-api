// @ts-ignore: no types available.
import * as pirates from "pirates";

import { transform} from "./index";

export function addHook(extension, options) {
  pirates.addHook(
    (code, filePath) => {
      const {code: transformedCode, sourceMap} = transform(code, {
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
}

export function registerJS() {
  addHook(".js", {transforms: ["imports", "flow", "jsx"]});
}

export function registerJSX() {
  addHook(".jsx", {transforms: ["imports", "flow", "jsx"]});
}

export function registerTS() {
  addHook(".ts", {transforms: ["imports", "typescript"]});
}

export function registerTSX() {
  addHook(".tsx", {transforms: ["imports", "typescript", "jsx"]});
}

export function registerTSLegacyModuleInterop() {
  addHook(".ts", {
    transforms: ["imports", "typescript"],
    enableLegacyTypeScriptModuleInterop: true,
  });
}

export function registerTSXLegacyModuleInterop() {
  addHook(".tsx", {
    transforms: ["imports", "typescript", "jsx"],
    enableLegacyTypeScriptModuleInterop: true,
  });
}

export function registerAll() {
  registerJS();
  registerJSX();
  registerTS();
  registerTSX();
}
