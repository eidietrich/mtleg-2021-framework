// script for merging app data into single JSON fed to gatsby-node



const {
    getJson,
    collectJsons,
    writeJson,
    timeStamp,
} = require('./utils.js')

// Data models
const Vote = require('./models/Vote.js')
const Bill = require('./models/Bill.js')
const Lawmaker = require('./models/Lawmaker.js')
const House = require('./models/House.js')
const Senate = require('./models/Senate.js')
const Governor = require('./models/Governor.js')

// INPUTS
const BILLS_GLOB = './scrapers/openstates/_data/mt/bill_*.json'
const VOTES_GLOB = './scrapers/openstates/_data/mt/vote_event_*.json'
const LEG_ROSTER_PATH = './scrapers/legislative-roster/2019.json'

// const DATA_2019_PATH = './process/inputs/mtleg-2019.json'
const ANNOTATION_PATH = './process/inputs/temp-app-text.json'

// OUTPUTS
const LAWMAKERS_OUTPUT_PATH = './app/src/data/lawmakers.json'
const BILLS_OUTPUT_PATH = './app/src/data/bills.json'
const HOUSE_OUTPUT_PATH = './app/src/data/house.json'
const SENATE_OUTPUT_PATH = './app/src/data/senate.json'
const GOVERNOR_OUTPUT_PATH = './app/src/data/governor.json'

// READ DATA
// const raw = getJson(DATA_2019_PATH)
const rawBills = collectJsons(BILLS_GLOB)
const rawVotes = collectJsons(VOTES_GLOB)
const rawLawmakers = getJson(LEG_ROSTER_PATH) // TODO - expand this to legislative website scrape
const annotations = getJson(ANNOTATION_PATH)
const articles = [] // TODO Add

// PROCESS
const updateDate = timeStamp()

const votes = rawVotes.map(vote => new Vote({vote}))

const bills = rawBills.map(bill => new Bill({
        bill,
        votes,
        annotations,
        articles, 
    })
)

const lawmakers =  rawLawmakers.map(lawmaker => new Lawmaker({
        lawmaker,
        bills,
        votes,
        annotations,
        articles,
    })
)

const billsData = {
    updateDate,
    bills: bills.map(bill => bill.export())
}
const lawmakersData = {
    updateDate,
    lawmakers: lawmakers.map(lawmaker => lawmaker.export())
}
// Votes don't need a separate file
const houseData = new House({annotations}).export()
const senateData = new Senate({annotations}).export()
const governorData = new Governor({annotations}).export()

// console.log(lawmakers.lawmakers.find(d => d.name === 'Dan Bartel'))

writeJson(LAWMAKERS_OUTPUT_PATH, lawmakersData)
writeJson(BILLS_OUTPUT_PATH, billsData)
writeJson(HOUSE_OUTPUT_PATH, houseData)
writeJson(SENATE_OUTPUT_PATH, senateData)
writeJson(GOVERNOR_OUTPUT_PATH, governorData)