// script for merging app data into single JSON fed to gatsby-node

const {
    getJson,
    writeJson,
} = require('./utils.js')

// Data models
const Bill = require('./models/Bill.js')
const Lawmaker = require('./models/Lawmaker.js')
const House = require('./models/House.js')
const Senate = require('./models/Senate.js')
const Governor = require('./models/Governor.js')

// INPUTS
const DATA_2019_PATH = './process/inputs/mtleg-2019.json'
const ANNOTATION_PATH = './process/inputs/temp-app-text.json'

// OUTPUTS
const LAWMAKERS_OUTPUT_PATH = './app/src/data/lawmakers.json'
const BILLS_OUTPUT_PATH = './app/src/data/bills.json'
const HOUSE_OUTPUT_PATH = './app/src/data/house.json'
const SENATE_OUTPUT_PATH = './app/src/data/senate.json'
const GOVERNOR_OUTPUT_PATH = './app/src/data/governor.json'

// READ DATA
const raw = getJson(DATA_2019_PATH)
const annotations = getJson(ANNOTATION_PATH)
const articles = [] // TODO Add

// PROCESS
const bills = {
    updateDate: raw.updateDate,
    bills: raw.bills.map(bill => new Bill({
        bill,
        votes: raw.votes,
        annotations,
        articles, 
    }).export())
}
const lawmakers = {
    updateDate: raw.updateDate,
    lawmakers: raw.lawmakers.map(lawmaker => new Lawmaker({
        lawmaker,
        bills: raw.bills, // Use processed bills instead?
        votes: raw.votes,
        annotations,
        articles,
    }).export())
}
const house = new House({annotations}).export()
const senate = new Senate({annotations}).export()
const governor = new Governor({annotations}).export()

console.log(lawmakers.lawmakers.find(d => d.name === 'Dan Bartel'))

writeJson(LAWMAKERS_OUTPUT_PATH, lawmakers)
writeJson(BILLS_OUTPUT_PATH, bills)
writeJson(HOUSE_OUTPUT_PATH, house)
writeJson(SENATE_OUTPUT_PATH, senate)
writeJson(GOVERNOR_OUTPUT_PATH, governor)