const {
    getJson,
} = require('./utils.js')

// Data models
const Bill = require('./models/Bill.js')

const DATA_2019_PATH = './process/inputs/mtleg-2019.json'
const ANNOTATION_PATH = './process/inputs/temp-app-text.json'


const raw = getJson(DATA_2019_PATH)
const annotations = getJson(ANNOTATION_PATH)

const bill = raw.bills[45]
const votes = raw.votes
const articles = []

const b = new Bill({bill, votes, annotations, articles})
// console.log(v.export())
