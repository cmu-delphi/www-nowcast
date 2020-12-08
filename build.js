const { process, minimize, compile, replace } = require('./devops/buildTools');

const strings = require('./values/strings.json');
const colors = require('./values/colors.json');
const entries = [...strings, ...colors];

Promise.all([
    process('**/*.coffee', [compile(), minimize()]),
    process('**/*.js', [minimize()]),
    process('**/*.+(html|css)', [replace(entries)]),
    process('+(plots|images)/**/*')
]).then((r) => console.log(r.flat()));