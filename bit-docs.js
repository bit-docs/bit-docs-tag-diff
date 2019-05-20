var diff = require("./diff");

module.exports=  function(bitDocs) {
    bitDocs.register("tags",{
        diff: diff
    });
};
