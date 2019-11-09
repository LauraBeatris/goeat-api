"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }Object.defineProperty(exports, "__esModule", {value: true});/* eslint-disable no-console */
var _commander = require('commander'); var _commander2 = _interopRequireDefault(_commander);
var _fs = require('mz/fs');
var _path = require('path');

var _index = require('./index');








 function run() {
  _commander2.default
    .description(`Sucrase: super-fast Babel alternative.`)
    .usage("[options] <srcDir>")
    .option(
      "-d, --out-dir <out>",
      "Compile an input directory of modules into an output directory.",
    )
    .option("--out-extension <extension>", "File extension to use for all output files.", "js")
    .option("--exclude-dirs <paths>", "Names of directories that should not be traversed.")
    .option("-t, --transforms <transforms>", "Comma-separated list of transforms to run.")
    .option("-q, --quiet", "Don't print the names of converted files.")
    .option(
      "--enable-legacy-typescript-module-interop",
      "Use default TypeScript ESM/CJS interop strategy.",
    )
    .option("--enable-legacy-babel5-module-interop", "Use Babel 5 ESM/CJS interop strategy.")
    .option("--jsx-pragma <string>", "Element creation function, defaults to `React.createElement`")
    .option("--jsx-fragment-pragma <string>", "Fragment component, defaults to `React.Fragment`")
    .parse(process.argv);

  if (!_commander2.default.outDir) {
    console.error("Out directory is required");
    process.exit(1);
  }

  if (!_commander2.default.transforms) {
    console.error("Transforms option is required.");
    process.exit(1);
  }

  if (!_commander2.default.args[0]) {
    console.error("Source directory is required.");
    process.exit(1);
  }

  const outDir = _commander2.default.outDir;
  const srcDir = _commander2.default.args[0];

  const options = {
    outExtension: _commander2.default.outExtension,
    excludeDirs: _commander2.default.excludeDirs ? _commander2.default.excludeDirs.split(",") : [],
    quiet: _commander2.default.quiet,
    sucraseOptions: {
      transforms: _commander2.default.transforms.split(","),
      enableLegacyTypeScriptModuleInterop: _commander2.default.enableLegacyTypescriptModuleInterop,
      enableLegacyBabel5ModuleInterop: _commander2.default.enableLegacyBabel5ModuleInterop,
      jsxPragma: _commander2.default.jsxPragma || "React.createElement",
      jsxFragmentPragma: _commander2.default.jsxFragmentPragma || "React.Fragment",
    },
  };

  buildDirectory(srcDir, outDir, options).catch((e) => {
    process.exitCode = 1;
    console.error(e);
  });
} exports.default = run;

async function buildDirectory(
  srcDirPath,
  outDirPath,
  options,
) {
  const extension = options.sucraseOptions.transforms.includes("typescript") ? ".ts" : ".js";
  if (!(await _fs.exists.call(void 0, outDirPath))) {
    await _fs.mkdir.call(void 0, outDirPath);
  }
  for (const child of await _fs.readdir.call(void 0, srcDirPath)) {
    if (["node_modules", ".git"].includes(child) || options.excludeDirs.includes(child)) {
      continue;
    }
    const srcChildPath = _path.join.call(void 0, srcDirPath, child);
    const outChildPath = _path.join.call(void 0, outDirPath, child);
    if ((await _fs.stat.call(void 0, srcChildPath)).isDirectory()) {
      await buildDirectory(srcChildPath, outChildPath, options);
    } else if (srcChildPath.endsWith(extension)) {
      const outPath = `${outChildPath.substr(0, outChildPath.length - extension.length)}.${
        options.outExtension
      }`;
      await buildFile(srcChildPath, outPath, options);
    }
  }
}

async function buildFile(srcPath, outPath, options) {
  if (!options.quiet) {
    console.log(`${srcPath} -> ${outPath}`);
  }
  const code = (await _fs.readFile.call(void 0, srcPath)).toString();
  const transformedCode = _index.transform.call(void 0, code, {...options.sucraseOptions, filePath: srcPath}).code;
  await _fs.writeFile.call(void 0, outPath, transformedCode);
}
