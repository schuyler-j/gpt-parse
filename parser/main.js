"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseAndWrite = void 0;
var fs = require("fs");
var querystring_1 = require("querystring");
// testing google cloud NLP
var folder = "output";
// default filetype txt
var filetype = "txt";
if (process.argv.length === 2) {
    filetype = "txt";
}
else {
    filetype = process.argv[2].substring(1);
}
var conversationCount = 265; // need a better way to find this
function genName() {
    var name = Math.floor(Math.random() * Math.pow(2, 16)).toString(16);
    var other = Math.floor(Math.random() * Math.pow(2, 16)).toString(16);
    var end = Math.floor(Math.random() * Math.pow(2, 16)).toString(16);
    return name + other + end;
}
function parseAndWrite(file) {
    console.log("Parsing conversations.");
    var jsontext = fs.readFileSync(file, "utf-8");
    var jsonOBJ = JSON.parse(jsontext);
    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder);
    }
    var _loop_1 = function (i) {
        console.log(i);
        try {
            console.log(jsonOBJ[i].title);
        }
        catch (err) {
            console.log("No more conversations.");
            process.exit(0);
        }
        var sf = jsonOBJ[i].title;
        var subfolder = sf
            .replace(/ /g, "_")
            .replace(/:/g, "_")
            .replace(/\?/g, "_")
            .replace(/\//g, "_")
            .replace(/\\/g, "_")
            .replace(/\"/g, "_")
            .replace(/\'/g, "_")
            .replace(/\*/g, "_")
            .replace(/\n/g, "_");
        if (!fs.existsSync(folder + "/" + subfolder)) {
            fs.mkdirSync(folder + "/" + subfolder);
        }
        Object.keys(jsonOBJ[i].mapping).forEach(function (key) {
            var mappingObj = jsonOBJ[i].mapping[key].message;
            try {
                var author = mappingObj.author;
                if (author.role !== "system") {
                    var id = mappingObj.content;
                    var messageContent = id.parts;
                    var mc = (0, querystring_1.stringify)(messageContent);
                    var decodeMC = global.decodeURI(mc);
                    // remove 0= from start of line
                    var dmc_sub = decodeMC.substring(2, decodeMC.length);
                    var name_1 = genName();
                    fs.writeFile("".concat(folder, "/").concat(subfolder, "/").concat(name_1, "_").concat(author.role, ".").concat(filetype), dmc_sub, function (err) {
                        if (err) {
                            console.log(err);
                        }
                    });
                }
            }
            catch (err) {
                console.log("Skipping, no content");
            }
        });
    };
    for (var i = 0; i < conversationCount; i++) {
        _loop_1(i);
    }
    console.log("Done");
}
exports.parseAndWrite = parseAndWrite;
function getFiles(path) {
    try {
        var files = fs.readdirSync(path);
        return files;
    }
    catch (error) {
        console.log(error);
        return [];
    }
}
exports.default = getFiles;
