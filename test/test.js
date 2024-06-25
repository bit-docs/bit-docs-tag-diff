var processTags = require("bit-docs-process-tags");
var diff = require("../diff");
var path = require("path");
var assert = require("assert");

describe("diff", function(){

  it("adds to adds diff lines to parent",function(){
		var docMap = {};

		processTags({
			comment: "@constructor\n@diff ./dir1/hello-world1.js ./dir2/hello-world2.js",
			scope: {},
			docMap: docMap,
			docObject: {
        src: {
          path: path.join(__dirname, "test.js")
        }
      },
			tags: {
        diff: diff,
        constructor: {
          add : function(){
            this.name = "constructed";
            this.type = "constructor";
            return ["scope", this];
          }
        }
      }
		},function(newDoc, newScope){
      // console.log(newDoc.body);
      assert.ok(newDoc.body.indexOf('<div line-highlight="2,"></div>') >= 0);
		});
  });

  it("adds to adds 'only' after lines if only flag is present",function(){
		var docMap = {};

		processTags({
			comment: "@constructor\n@diff ./dir1/hello-world1.js ./dir2/hello-world2.js only",
			scope: {},
			docMap: docMap,
			docObject: {
        src: {
          path: path.join(__dirname, "test.js")
        }
      },
			tags: {
        diff: diff,
        constructor: {
          add : function(){
            this.name = "constructed";
            this.type = "constructor";
            return ["scope", this];
          }
        }
      }
		},function(newDoc, newScope){
      // console.log('test 2', newDoc.body);
      assert.ok(newDoc.body.indexOf('<div line-highlight="2,only"></div>') >= 0);
		});
  });
  
  it("checks advanced file",function(){
		var docMap = {};

		processTags({
			comment: "@constructor\n@diff ./dir1/ngfile.service.spec.ts ./dir2/ngfile.service.spec.ts",
			scope: {},
			docMap: docMap,
			docObject: {
        src: {
          path: path.join(__dirname, "test.js")
        }
      },
			tags: {
        diff: diff,
        constructor: {
          add : function(){
            this.name = "constructed";
            this.type = "constructor";
            return ["scope", this];
          }
        }
      }
		},function(newDoc, newScope){
      // console.log('test 3', newDoc.body);
      assert.ok(newDoc.body.indexOf('<div line-highlight="3-5,80-81,93-123,"></div>') >= 0);
		});
	});

});
