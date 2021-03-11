
const {
    getJson,
    collectJsons,
    writeJson,
    timeStamp,
} = require('./utils.js')

// Data models
const Vote = require('./models/Vote.js')
const Bill = require('./models/Bill.js')

const Article = require('./models/MTFPArticle.js')

// INPUTS
// 2019 LAWS Data
const BILLS_GLOB = './scrapers/openstates/_data/mt/bill_*.json'
const VOTES_GLOB = './scrapers/openstates/_data/mt/vote_event_*.json'

// App text passed through copy editing, bill/lawmaker annotations, flags for key bills
const TEXT_PATH = './process/inputs/app-text.json'

const ARTICLES_PATH = './scrapers/mtfp-articles/articles.json'

// READ DATA
// const raw = getJson(DATA_2019_PATH)
const rawBills = collectJsons(BILLS_GLOB)
const rawVotes = collectJsons(VOTES_GLOB)

const annotations = getJson(TEXT_PATH)
const rawArticles = getJson(ARTICLES_PATH) // TODO Add

const articles = rawArticles
    .filter(d => d.status === 'publish')
    .map(article => new Article({ article }))
const votes = rawVotes.map(vote => new Vote({ vote }))

const keyBillIds = annotations.bills.filter(d => d.isMajorBill === 'True').map(d => d.key)
const bills = rawBills.slice(100, 101).map(bill => new Bill({
    bill,
    votes,
    annotations,
    articles,
    keyBillIds,
})
)

const bill = bills[0].data
bill.actions = []
console.log(bill)