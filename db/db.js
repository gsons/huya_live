const fs = require('fs');


exports.add = function (fileName, data) {
    if (fs.existsSync(fileName)) var fileData = fs.readFileSync(fileName,'utf-8');
    var tmpdata=fileData?fileData:'[]';
    var database = JSON.parse(String(tmpdata))
    database.push(data);
    fs.writeFileSync(fileName, JSON.stringify(database));
}

exports.fetch = function (fileName, callback) {
    var data;
    if (fs.existsSync(fileName)) {
         data = fs.readFileSync(fileName,'utf-8'); data = JSON.parse(String(data)) || []
         }
    else {
        data = [];
    }
    return JSON.stringify(data);
}