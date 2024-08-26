import fs from 'node:fs';
import path from 'node:path';
import { marked } from 'marked';
import { parse as csvParse } from 'csv-parse/sync';

const CONTENT_DIR = 'src/content';

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

function parseCSV(content) {
  const data = csvParse(content, { columns: true });
  const columns = Object.keys(data[0]);
  return {
    columns,
    rows: data.map(row => columns.map(col => row[col]))
  };
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
          content: marked.parse(readFile(chapter, exercise, 'README.md')),
          tables: files.filter(isCSV).map(file => ({
            name: file.replace(/\.csv$/, ''),
            ...parseCSV(readFile(chapter, exercise, file))
          })),
          models: files.filter(isKye).map(file => ({
            file: file,
            code: readFile(chapter, exercise, file)
          })),
        }
    })
  });
};


import * as pug from 'pug';

export default function () {
  return {
    name: 'content-loader',
    buildStart() {
      this.addWatchFile('src/index.pug')
      this.addWatchFile(CONTENT_DIR)
      getContent().forEach(content => {
        const html = pug.renderFile(path.join('src','index.pug'), content)
        this.emitFile({
          type: 'asset',
          fileName: path.join(content.chapter.slug, content.slug + '.html'),
          source: html
        })
      })
    }
  }
}