module.exports = {
  diff: function(ogString, newString) {
    var diffLines = [];
    var ogLines = ogString.split('\n').map(line => line.trim());
    var ogLinesStripped = []
    for (var index = 0; index < ogLines.length; index++) {
      ogLinesStripped.push(ogLines[index].replace(/;/g, ""));
    }
    var newLines = newString.split('\n').map(line => line.trim());

    for (var index = 0; index < newLines.length; index++) {
      var lineNumber = index + 1;
      var newLine = newLines[index].replace(/;/g, "");
      var newLineIndx = ogLinesStripped.indexOf(newLine);
      if (newLine != '') {
        if (newLineIndx === -1) {
          diffLines.push(lineNumber);
        }
        else {
          ogLinesStripped.splice(newLineIndx, 1);
        }
      }
    }
    return diffLines
  }
}
