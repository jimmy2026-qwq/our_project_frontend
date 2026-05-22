import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const srcDir = path.join(root, 'src');
const expectedIndexCss = '@import "tailwindcss";';
const allowedCssFile = path.join(srcDir, 'index.css');
const allowedCssImportFile = path.join(srcDir, 'main.tsx');
const allowedCssImport = './index.css';
const sourceExtensions = new Set(['.js', '.jsx', '.ts', '.tsx']);

const failures = [];

function toRelative(filePath) {
  return path.relative(root, filePath).split(path.sep).join('/');
}

function walkFiles(directory) {
  return readdirSync(directory).flatMap((entry) => {
    const entryPath = path.join(directory, entry);
    const stats = statSync(entryPath);

    if (stats.isDirectory()) {
      return walkFiles(entryPath);
    }

    return [entryPath];
  });
}

function report(message) {
  failures.push(message);
}

const srcFiles = walkFiles(srcDir);
const cssFiles = srcFiles.filter((filePath) => path.extname(filePath) === '.css');

for (const cssFile of cssFiles) {
  if (cssFile !== allowedCssFile) {
    report(`Unexpected CSS file: ${toRelative(cssFile)}`);
  }
}

const indexCssContent = readFileSync(allowedCssFile, 'utf8').trim();
if (indexCssContent !== expectedIndexCss) {
  report(
    `src/index.css must contain exactly: ${expectedIndexCss}`,
  );
}

const cssImportPattern =
  /\bimport\s+(?:[^'"]+\s+from\s+)?['"]([^'"]+\.css)['"]/g;

for (const sourceFile of srcFiles) {
  if (!sourceExtensions.has(path.extname(sourceFile))) {
    continue;
  }

  const content = readFileSync(sourceFile, 'utf8');
  let match = cssImportPattern.exec(content);

  while (match) {
    const importPath = match[1];
    const isAllowedImport =
      sourceFile === allowedCssImportFile && importPath === allowedCssImport;

    if (!isAllowedImport) {
      report(
        `Unexpected CSS import in ${toRelative(sourceFile)}: ${importPath}`,
      );
    }

    match = cssImportPattern.exec(content);
  }
}

if (failures.length > 0) {
  console.error('Tailwind CSS enforcement failed:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log('Tailwind CSS enforcement passed.');
