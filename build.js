const { process, minimizeJs, compileCoffee, replace } = require('delphi-cmu-buildtools');

const strings = require('./values/strings.json');
const colors = require('./values/colors.json');
const entries = [...strings, ...colors];

Promise.all([
    process('**/*.coffee', [compileCoffee(), minimizeJs()]),
    process('**/*.js', [minimizeJs()]),
    process('**/*.+(html|css)', [replace(entries)]),
    process('+(plots|images)/**/*')
]).then((r) => console.log(r.flat()));