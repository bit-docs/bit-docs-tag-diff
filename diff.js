var path = require("path");
var fs = require("fs");
var diffChecker = require("./src/diffchecker.js");

var typeConverters = {
  stache: 'html',
  mustache: 'html',
  component: 'html'
};
var convertType = function(type) {
  return typeConverters[type] || type;
};

var createGroupedLines = function(sequentialLines) {
  var groupedLines = sequentialLines[0] + '-' + sequentialLines[sequentialLines.length-1]
  return groupedLines
}

var checkSequence = function(diffLines) {
  //check to chunk lines together
  var singleLines = [];
  //temp array to hold sequences
  var sequentialLines = [];
  var prevLine = null;
  for (var index = 0; index < diffLines.length; index++) {
    var line = diffLines[index];
    
    if (prevLine ) {
      if (prevLine + 1 === line) {
        sequentialLines.push(line);
      }
      else {
        //break sequencing
        if (sequentialLines.length > 1) {
          //updating singles array
          var startingSeqIndex = singleLines.indexOf(sequentialLines[0]);
          singleLines.splice(startingSeqIndex, sequentialLines.length, createGroupedLines(sequentialLines) )

        }
        sequentialLines = [];
        sequentialLines.push(line);
      }
      // last line is part of sequence
      if(index + 1 === diffLines.length) {
        if (prevLine + 1 === line) {
          sequentialLines.push(line);
          if (sequentialLines.length > 1) {
            var startingSeqIndex = singleLines.indexOf(sequentialLines[0]);
            singleLines.splice(startingSeqIndex,  sequentialLines.length, createGroupedLines(sequentialLines) )
            sequentialLines = [];
          }
        }
        else {
          singleLines.push(line);
        }
      }
      else {
        singleLines.push(line);
      }
      prevLine = line;
    }
    else {
      singleLines.push(line);
      sequentialLines.push(line);
      prevLine = line;
    } 
  }
  return singleLines;
} 

/**
 * @parent bit-docs-tag-sourceref/tags
 * @module {bit-docs-process-tags/types/tag} bit-docs-tag-sourceref/tags/sourceref @sourceref
 * 
 * @description Creates a diff from two files to get the changed lines and wraps them with markdown for code block.
 * 
 * @signature `@diff PATH1 PATH2 only`
 * 
 * Wraps file contents with triple \` so it shows up as a code block.
 * 
 * @param {String} PATH1 The path to original file to be checked against.
 * @param {String} PATH2 The path to new version of original file.
 * @param {String} only Option flag to only show changed lines
 * 
 */
module.exports = {
  add: function(line, curData) {
    var onlyFlag = line.indexOf('only') > -1 ? 'only': '';
    var files = line.replace(/@diff|only/g, "").trim().split(" ");
    //break if more then two throw new error
    if (files.length > 2) {
      return false;
    }
    if (this.src.path) {
      var pathedFiles = []
      for (var fileI = 0; fileI < files.length; fileI++) {
        let fileName = files[fileI];
        pathedFiles.push(path.join(path.dirname(this.src.path), fileName));
      }
      files = pathedFiles;
    }
    var file1 = fs.readFileSync(files[0]).toString();
    var file2 = fs.readFileSync(files[1]).toString();
    var {diffLines, diffFile} = diffChecker.diff(file1, file2);

    var validCurData = (curData && curData.length !== 2);
    var fileType = convertType(path.extname(files[1]).substring(1));
    var useCurData = useCurData ? validCurData && (typeof curData.description === "string") && !curData.body : false;;
    var markdown = '\n```' + fileType + '\n' + diffFile.join('\n') + '\n```';

    if(diffLines.length) {
      var lines = checkSequence(diffLines);
      markdown += '\n <div line-highlight="' + lines.toString() + ',' + onlyFlag + '"></div>' + '\n';
    };
    if (useCurData) {
      curData.description += markdown;
    } else {
      this.body += markdown;
    }
  }
};
