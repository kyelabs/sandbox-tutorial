import fs from 'node:fs';
import path from 'node:path';
import { marked } from 'marked';
import { parse as parseCSV } from 'csv-parse/sync';

const CONTENT_DIR = path.join(__dirname, 'content');

const startsWithNum = dir => /^\d{2}-/.test(dir);
const isCSV = file => /\.csv$/.test(file);
const isKye = file => /\.kye$/.test(file);

function readDir(...filepaths) {
  const filepath = path.join(CONTENT_DIR, ...filepaths);
  return fs.readdirSync(filepath);
}

function readFile(...filepaths) {
  const filepath = path.join(CONTENT_DIR, ...filepaths);
  return fs.readFileSync(filepath, 'utf-8');
}

function getContent() {
  let index = 0;
  return readDir().filter(startsWithNum).flatMap(chapter => {
    const chapter_meta = JSON.parse(readFile(chapter, 'meta.json'));
    return readDir(chapter).filter(startsWithNum).map(exercise => {
        const exercise_meta = JSON.parse(readFile(chapter, exercise, 'meta.json'));
        const files = readDir(chapter, exercise);
        return {
          index: index++,
          chapter: {
            slug: chapter,
            title: chapter_meta.title
          },
          slug: exercise,
          title: exercise_meta.title,
          html: marked.parse(readFile(chapter, exercise, 'README.md')),
          data: files.filter(isCSV).map(file => ({
            name: file.replace(/\.csv$/, ''),
            records: parseCSV(readFile(chapter, exercise, file), { columns: true })
          })),
          models: files.filter(isKye).map(file => ({
            file: file,
            code: readFile(chapter, exercise, file)
          })),
        }
    })
  });
};

export default function kyeTutorialContentPlugin() {
  return {
    name: 'kye-tutorial-content',
    resolveId(id) {
      if (id === 'content') {
        return id;
      }
      return null;
    },
    load(id) {
      if (id === 'content') {
        const content = getContent();
        return `export default ${JSON.stringify(content)}`;
      }
      return null
    }
  };
}