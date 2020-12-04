const {
    getJson,
} = require('./utils.js')

// Data models
const Vote = require('./models/Vote.js')

const DATA_2019_PATH = './process/inputs/mtleg-2019.json'
const raw = getJson(DATA_2019_PATH)

const vote = raw.votes[0]

const v = new Vote({vote})
console.log(v.export())
