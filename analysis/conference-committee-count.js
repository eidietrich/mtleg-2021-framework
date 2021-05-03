// script for merging app data into single JSON fed to gatsby-node

const {
    getJson,
    collectJsons,
    writeJson,
} = require('../process/utils.js')

const {
    COMMITTEES
} = require('../process/config.js')

const {
    checkArticleMatches
} = require('../process/tests.js')

// Data models
const Vote = require('../process/models/Vote.js')
const Bill = require('../process/models/Bill.js')
const Lawmaker = require('../process/models/Lawmaker.js')
const Committee = require('../process/models/Committee.js')
const House = require('../process/models/House.js')
const Senate = require('../process/models/Senate.js')
const Governor = require('../process/models/Governor.js')
const Overview = require('../process/models/Overview.js')

const Article = require('../process/models/MTFPArticle.js')

const Analysis = require('../process/models/Analysis.js')
const { firebase } = require('googleapis/build/src/apis/firebase')

// INPUTS

const years = ['', '-2019', '-2017', '-2015', '-2013', '-2011', '-2005'] // null is 2021
// const years = ['','-2019', '-2013', '-2005'] // null is 2021

const getBills = year => collectJsons(`./scrapers/openstates/_data/mt${year}/bill_*.json`)

// 2021 LAWS Data
// const BILLS_GLOB = './scrapers/openstates/_data/mt-2005/bill_*.json'
// const VOTES_GLOB = './scrapers/openstates/_data/mt-2005/vote_event_*.json'
// const LEG_ROSTER_PATH_2019 = './scrapers/lawmakers/2019.json'
// 2021 lawmaker data
// const DISTRICT_INFO_PATH = './scrapers/lawmakers/process/districts.json'
// const LAWMAKER_INFO_PATH = './scrapers/lawmakers/process/lawmakers.json'

const rawBills = years.reduce((acc, year) => acc.concat(getBills(year)), [])
console.log(rawBills.length)

// READ DATA
// const rawBills = collectJsons(BILLS_GLOB)
// const rawVotes = collectJsons(VOTES_GLOB)
// const rawLawmakers = getJson(LAWMAKER_INFO_PATH)
// const rawDistricts = getJson(DISTRICT_INFO_PATH)


const annotations = { bills: [] }
const rawArticles = []
const legalNotes = []
const articles = []
const votes = []
const keyBillIds = []

const bills = rawBills.map(bill => new Bill({
    bill,
    votes,
    annotations,
    articles,
    legalNotes,
    keyBillIds,
})
)

const lawmakers = []
// const lawmakers =  rawLawmakers.map(lawmaker => new Lawmaker({
//         lawmaker,
//         districts: rawDistricts,
//         bills,
//         votes,
//         annotations,
//         articles,
//     })
// )

// const committees = COMMITTEES
//     .filter(d => !d.suppress)
//     .filter(committee => !committee.name.includes('Joint Appropriations Subcommittee'))
// .map(committee => new Committee({
//     committee,
//     bills,
//     lawmakers
// }))

// const summaryData = new Overview({
//     bills,
//     votes,
//     annotations
// }).export()

const analysis = new Analysis({
    // bills: bills.filter(d => !d.type.includes('resolution'))
    bills,
})

const conferences = analysis.conferences
const sessions = Array.from(new Set(conferences.map(d => d.session)))

sessions.forEach(year => {
    const inYear = conferences.filter(d => d.session === year)
    const normal = inYear.filter(d => d.type === 'normal')
    const free = inYear.filter(d => d.type === 'free')
    console.log(`\n## ${year}`)
    console.log('Normal', normal.length)
    console.log('Free', free.length)
    console.log('Total', normal.length + free.length)
})

normal2021 = conferences.filter(d => d.session === '2021').filter(d => d.type === 'normal')
console.log('normal', normal2021.map(d => d.identifier))

free2021 = conferences.filter(d => d.session === '2021').filter(d => d.type === 'free')
console.log('free', free2021.map(d => d.identifier))

// console.log(conferences)

// Log stuff
// console.log('House Jud 2021 hearings', analysis.hearings.filter(d => d.session === '2021').filter(d => d.committee === 'House Judiciary').length)

// analysis outputs
// writeJson('./analysis/bill-progression.json', analysis.billProgression)
// writeJson('./analysis/bill-hearings-multi-year-all.json', analysis.hearings)
// writeJson('./analysis/floor-debates-multi-year-all.json', analysis.floorDebates)

