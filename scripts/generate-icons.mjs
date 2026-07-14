import { readdirSync, writeFileSync } from 'fs';
import { basename, dirname, extname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ASSETS_DIR = join(__dirname, '..', 'src', 'shared', 'assets');

const toCamelCase = (name) =>
  name
    .split(/[-_]/)
    .map((part, index) =>
      index === 0
        ? part.charAt(0).toLowerCase() + part.slice(1)
        : part.charAt(0).toUpperCase() + part.slice(1),
    )
    .join('');

const svgFiles = readdirSync(ASSETS_DIR)
  .filter((file) => extname(file) === '.svg')
  .sort();

const exportLines = svgFiles.map((file) => {
  const exportName = toCamelCase(basename(file, '.svg'));
  return `export { default as ${exportName} } from './${file}';`;
});

const content = `// 이 파일은 \`pnpm icons\`로 자동 생성됩니다. 직접 수정하지 마세요.\n${exportLines.join('\n')}\n`;

writeFileSync(join(ASSETS_DIR, 'index.ts'), content);

console.log(`아이콘 ${svgFiles.length}개를 shared/assets/index.ts에 등록했습니다.`);
