const Diff = require('diff');

function normalizeLines(str) {
  const strWithNewLine = str.endsWith('\n') ? str : str + '\n';

  return strWithNewLine.split('\n').map(line => line.replace(/\s+$/, '')).join('\n');
}

module.exports = {
  diff: function(ogString, newString) {
    const normalizedOgString = normalizeLines(ogString);
    const normalizedNewString = normalizeLines(newString);

    const diff = Diff.diffLines(normalizedOgString, normalizedNewString);
    const diffLines = [];
    const diffFile = [];
    let lineNumberNewFile = 1;

    diff.forEach((part) => {
      const lines = part.value.split('\n');
  
      lines.forEach((line, index) => {
        if (index === lines.length - 1 && line === '') {
          return;
        }

        if (part.added) {
          diffFile.push(`+ ${line}`)
          diffLines.push(lineNumberNewFile);
          lineNumberNewFile++;
        } else if (part.removed) {
          diffFile.push(`- ${line}`)
          diffLines.push(lineNumberNewFile);

          lineNumberNewFile++;
        } else {
          diffFile.push(`  ${line}`)
          lineNumberNewFile++;
        }
      });
    });

    return {diffLines, diffFile}
  }
}
