/*
 * Lists the frametrail: terms the published schemas use ("frametrail:<name>" in any schemas/1/**\/*.schema.json) that the namespace page does not document (no id="term-<name>" in ns/index.html). ns/ is written by hand: a term FrameTrail adds needs its row there, and in ns/context.jsonld when it needs typing.
 *
 *     node dev/check-ns.mjs           # exit 1 when terms are missing
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function schemaFiles(dir) {
    return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        const file = path.join(dir, entry.name);
        if (entry.isDirectory()) { return schemaFiles(file); }
        return entry.name.endsWith('.schema.json') ? [file] : [];
    });
}

const used = new Set(), documented = new Set();

for (const file of schemaFiles(path.join(ROOT, 'schemas/1'))) {
    for (const [, name] of fs.readFileSync(file, 'utf8').matchAll(/"frametrail:([A-Za-z0-9_-]+)"/g)) { used.add(name); }
}
for (const [, name] of fs.readFileSync(path.join(ROOT, 'ns/index.html'), 'utf8').matchAll(/id="term-([^"]+)"/g)) { documented.add(name); }

const missing = [...used].filter((name) => !documented.has(name)).sort();

if (missing.length) {
    console.log('Terms the schemas use that ns/index.html does not document: ' + missing.map((name) => 'frametrail:' + name).join(', '));
    process.exit(1);
}
console.log('ns/index.html documents all ' + used.size + ' frametrail: terms the schemas use.');
