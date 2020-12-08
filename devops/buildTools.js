const promisify = require('util').promisify;
const glob = promisify(require('glob'));
const fs = require('fs');
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const copyFile = promisify(fs.copyFile);
const path = require('path');


function replace(entries = []) {
    return (content) => {
        let c = content;
        for (const entry of entries) {
            c = c.split(entry[0]).join(entry[1]);
        }
        return c;
    }
}

function compile(options) {
    return (content, fileName) => {
        const coffee = require('coffeescript');
        const out = coffee.compile(content, options);
        return [out, fileName.replace('.coffee', '.js')];
    };
}

function minimize(options = {}) {
    return async (content) => {
        const terser = require('terser');
        const r = await terser.minify(content, {
            compress: true,
            mangle: true,
            ...options,
        });
        return r.code;
    };
}

const checkedDir = new Set();
function ensureDir(fileName) {
    const dir = path.dirname(fileName);
    if (checkedDir.has(dir)) {
        return;
    }
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    };
    checkedDir.add(dir);
}


async function processFile(file, processors, { srcDir = './site', dstDir = './build' } = {}) {
    const inputFile = path.join(srcDir, file);
    let outputFile = path.join(dstDir, file);

    if (processors.length === 0) {
        // copy
        ensureDir(outputFile);
        await copyFile(inputFile, outputFile);
    } else {
        let content = await readFile(inputFile, { encoding: 'utf-8' });
        for await (const process of processors) {
            const out = await process(content, outputFile);
            if (Array.isArray(out)) {
                [content, outputFile] = out;
            } else {
                content = out;
            }
        }
        ensureDir(outputFile);
        await writeFile(outputFile, content, { encoding: 'utf-8' });
    }
    return outputFile;
}

async function process(pattern, processors = [], { srcDir = './site', dstDir = './build' } = {}) {
    const files = await glob(pattern, { cwd: srcDir });
    return Promise.all(files.map((file) => processFile(file, processors, { srcDir, dstDir })));
}

module.exports.process = process;
module.exports.processFile = processFile;
module.exports.minimize = minimize;
module.exports.replace = replace;
module.exports.compile = compile;