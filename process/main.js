// script for merging app data into single JSON fed to gatsby-node

const {
    getJson,
    collectJsons,
    writeJson,
} = require('./utils.js')

const {
    COMMITTEES
} = require('./config.js')

const {
    checkArticleMatches
} = require('./tests.js')

// Data models
const Vote = require('./models/Vote.js')
const Bill = require('./models/Bill.js')
const Lawmaker = require('./models/Lawmaker.js')
const Committee = require('./models/Committee.js')
const House = require('./models/House.js')
const Senate = require('./models/Senate.js')
const Governor = require('./models/Governor.js')
const Overview = require('./models/Overview.js')

const Article = require('./models/MTFPArticle.js')

const Analysis = require('./models/Analysis.js')

// INPUTS
// 2021 LAWS Data
const BILLS_GLOB = './scrapers/openstates/_data/mt/bill_*.json'
const VOTES_GLOB = './scrapers/openstates/_data/mt/vote_event_*.json'
// const LEG_ROSTER_PATH_2019 = './scrapers/lawmakers/2019.json'
// 2021 lawmaker data
const DISTRICT_INFO_PATH = './scrapers/lawmakers/process/districts.json'
const LAWMAKER_INFO_PATH = './scrapers/lawmakers/process/lawmakers.json'

// App text passed through copy editing, bill/lawmaker annotations, flags for key bills
const TEXT_PATH = './process/inputs/app-text.json'
const LEGAL_NOTE_PATH = './scrapers/legal-notes/legal-notes.json'
const ARTICLES_PATH = './scrapers/mtfp-articles/articles.json'

// OUTPUTS
const LAWMAKERS_OUTPUT_PATH = './app/src/data/lawmakers.json'
const BILLS_OUTPUT_PATH = './app/src/data/bills.json'
const COMMITTEE_OUTPUT_PATH = './app/src/data/committees.json'
const HOUSE_OUTPUT_PATH = './app/src/data/house.json'
const SENATE_OUTPUT_PATH = './app/src/data/senate.json'
const GOVERNOR_OUTPUT_PATH = './app/src/data/governor.json'
const SUMMARY_OUTPUT_PATH = './app/src/data/summary.json'

// READ DATA
// const raw = getJson(DATA_2019_PATH)
const rawBills = collectJsons(BILLS_GLOB)
const rawVotes = collectJsons(VOTES_GLOB)
// const rawLawmakers = getJson(LEG_ROSTER_PATH) // TODO - expand this to legislative website scrape
const rawLawmakers = getJson(LAWMAKER_INFO_PATH)
const rawDistricts = getJson(DISTRICT_INFO_PATH)

const annotations = getJson(TEXT_PATH)
const rawArticles = getJson(ARTICLES_PATH) // TODO Add

const legalNotes = getJson(LEGAL_NOTE_PATH)

const articles = rawArticles
    .filter(d => d.status === 'publish')
    .map(article => new Article({article}))
const votes = rawVotes.map(vote => new Vote({vote}))

const keyBillIds = annotations.bills.filter(d => d.isMajorBill === 'True').map(d => d.key)
const bills = rawBills.map(bill => new Bill({
        bill,
        votes,
        annotations,
        articles, 
        legalNotes,
        keyBillIds,
    })
)

const lawmakers =  rawLawmakers.map(lawmaker => new Lawmaker({
        lawmaker,
        districts: rawDistricts,
        bills,
        votes,
        annotations,
        articles,
    })
)

const committees = COMMITTEES
.filter(committee => !committee.name.includes('Joint Appropriations Subcommittee'))
.map(committee => new Committee({
    committee,
    bills,
    lawmakers
}))

const summaryData = new Overview({
    bills,
    votes,
    annotations
}).export()

const analysis = new Analysis({
    bills
})

// Tests
// TODO - create better framework for this
// checkArticleMatches(bills, articles)

// Export these as arrays so they play nicely w/ Gatsby graphql engine
const billsData = bills.map(bill => bill.export())
const lawmakersData = lawmakers.map(lawmaker => lawmaker.export())
const committeeData = committees.map(committee => committee.export())

// Export these as dicts for direct import to relevant pages

const houseData = new House({annotations}).export()
const senateData = new Senate({annotations}).export()
const governorData = new Governor({annotations, articles}).export()

// Log output
writeJson('./process/logs/lawmaker.json', lawmakersData[45])
writeJson('./process/logs/bill.json', billsData.find(d => d.identifier === 'SB 65'))

// analysis outputs
writeJson('./analysis/bill-progression.json', analysis.billProgression)

// Data output
writeJson(LAWMAKERS_OUTPUT_PATH, lawmakersData)
writeJson(BILLS_OUTPUT_PATH, billsData)
writeJson(COMMITTEE_OUTPUT_PATH, committeeData)

writeJson(HOUSE_OUTPUT_PATH, houseData)
writeJson(SENATE_OUTPUT_PATH, senateData)
writeJson(GOVERNOR_OUTPUT_PATH, governorData)
writeJson(SUMMARY_OUTPUT_PATH, summaryData)

// analysis outputs -- old
// writeJson('./analysis/districts.json', lawmakersData.map(d => d.district))

// // How mean of each action type have been recorded?
// const actions = bills.map(d => d.data.actions).flat()
// const actionTitles = Array.from(new Set(actions.map(d => d.description)))
// const actionTitleCounts = actionTitles.map(d => {
//     return {
//         title: d,
//         number: actions.filter(a => a.description === d).length
//     }
// }).sort((a,b) => b.number - a.number)
// actionTitleCounts.forEach(d => console.log(d.title, d.number))