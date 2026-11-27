/*
 * Adds what every page of the site has to schemas/1/index.html, which FrameTrail's scripts/publish-schemas.mjs writes without it: dev/schemas-head.html at the end of <head> (the Matomo script), dev/schemas-footer.html at the end of <footer> (the Matomo notice, Imprint · Privacy Policy). Run it after every publish; .github/workflows/update.yml does.
 *
 *     node dev/schemas-page.mjs [page]      # default schemas/1/index.html
 *
 * A page that has both already is left as it is; one with only one of them, or without </head> or </footer>, is refused (exit 1).
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/**
 * The page with the head and footer snippets added, or as it is when it has both.
 */
export function decorate(page, head, footer) {
    const has = [page.includes(head), page.includes(footer)];
    if (has[0] && has[1]) { return page; }
    if (has[0] || has[1]) { throw new Error('The page has the ' + (has[0] ? 'head' : 'footer') + ' snippet but not the ' + (has[0] ? 'footer' : 'head') + ' one'); }
    for (const tag of ['</head>', '</footer>']) {
        if (page.split(tag).length !== 2) { throw new Error('The page has ' + (page.split(tag).length - 1) + ' ' + tag + ', expected one'); }
    }
    return page.replace('</head>', head + '</head>').replace('</footer>', footer + '</footer>');
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {

    const file   = path.resolve(process.argv[2] || path.join(ROOT, 'schemas/1/index.html')),
          read   = (name) => fs.readFileSync(path.join(ROOT, 'dev', name), 'utf8');

    try {
        const page = fs.readFileSync(file, 'utf8'),
              done = decorate(page, read('schemas-head.html'), read('schemas-footer.html'));
        if (done === page) {
            console.log(path.relative(ROOT, file) + ' has the head and footer already');
        } else {
            fs.writeFileSync(file, done);
            console.log('Added the head and footer to ' + path.relative(ROOT, file));
        }
    } catch (error) {
        console.error(path.relative(ROOT, file) + ': ' + error.message);
        process.exit(1);
    }

}
