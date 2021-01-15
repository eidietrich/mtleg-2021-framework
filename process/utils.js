const fs = require('fs')
const glob = require('glob')
const moment = require('moment')

const getJson = (path) => JSON.parse(fs.readFileSync(path))
module.exports.getJson = getJson

module.exports.collectJsons = (glob_path) => {
    const files = glob.sync(glob_path)
    return files.map(getJson)
}

module.exports.writeJson = (path, data) => {
    fs.writeFile (path, JSON.stringify(data), function(err) {
        if (err) throw err;
        console.log('Written to', path);
        }
    );
}

