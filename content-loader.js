import fs, { read } from 'node:fs';
import path from 'node:path';
import { marked } from 'marked';
import { parse as csvParse } from 'csv-parse/sync';
import * as cheerio from 'cheerio';

const CONTENT_DIR = 'content';

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

function readMarkdown(...filepaths) {
  return cheerio.load(marked.parse(readFile(...filepaths)));
}

function readCSV(...filepaths) {
  const data = csvParse(readFile(...filepaths), { columns: true });
  const columns = Object.keys(data[0]);
  return {
    columns,
    rows: data.map(row => columns.map(col => row[col]))
  };
}

function getContent() {
  let index = 0;
  let prev = null;
  return readDir().filter(startsWithNum).flatMap(chapter => {
    const $chapter = readMarkdown(chapter, 'README.md');
    const chapter_title = $chapter('h1').text();
    return readDir(chapter).filter(startsWithNum).map(exercise => {
        const $ = readMarkdown(chapter, exercise, 'README.md');
        const files = readDir(chapter, exercise);

        let filepath = path.join(chapter, exercise + '.html');
        if (prev === null) {
          filepath = 'index.html';
        } else if (prev.chapter.slug !== chapter) {
          filepath = path.join(chapter, 'index.html');
        }
        
        const out = {
          index: index++,
          chapter: {
            slug: chapter,
            title: chapter_title
          },
          path: filepath,
          slug: exercise,
          title: $('h1').text(),
          content: $.html(),
          tables: files.filter(isCSV).map(file => ({
            name: file.replace(/\.csv$/, ''),
            ...readCSV(chapter, exercise, file)
          })),
          models: files.filter(isKye).map(file => ({
            file: file,
            code: readFile(chapter, exercise, file)
          })),
          links: {
            prev: prev?.path,
            next: null,
          }
        }
        if (prev)
          prev.links.next = out.path;
        prev = out;
        return out;
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
          fileName: content.path,
          source: html
        })
      })
    }
  }
}