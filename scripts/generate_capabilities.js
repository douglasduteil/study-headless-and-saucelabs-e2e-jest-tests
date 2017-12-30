//

const fs = require('fs');
const os = require('os');
const assert = require('assert');

const generateCapabilities = require('saucelabs-multicapabilities-generator');

(async function(range, options) {
  assert(range.length, 'Should give a browserlist like range');
  const output = options.o || options.output;
  assert(output, 'Should give an output dir');
  const force = options.f || options.force;

  console.log(`
  Generating capabilities for:
  ${range}
  in ${output}
  `);

  if (fs.existsSync(output) && !force) {
    return;
  }
  const capabilities = await generateCapabilities(range);

  fs.writeFileSync(output, JSON.stringify(capabilities, null, 2));
})(
  '> 0.39%, last 2 Chrome versions, last 2 Firefox versions, Firefox ESR',
  process.argv.slice(2).reduce((memo, option, index, argv) => {
    let data;

    const next = argv[index + 1];
    const isBooleanOption = !next || next.charAt(0) === '-';
    const nextValue = isBooleanOption ? true : next;

    if ((data = /^-([^ ]{1})$/.exec(option))) {
      //
      // -f bar.
      //
      Object.assign(memo, { [data[1]]: nextValue });
    } else if ((data = /^--([^ ]+)$/.exec(option))) {
      //
      // --foo bar.
      //
      Object.assign(memo, { [data[1]]: nextValue });
    }

    return memo;
  }, {})
);
