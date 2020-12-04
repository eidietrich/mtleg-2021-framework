// script for merging app data into single JSON fed to gatsby-node

const {
    getJson,
    writeJson,
} = require('./utils.js')

const Bill = require('./models/Bill.js')
const Lawmaker = require('./models/Lawmaker.js')

const billKey = identifier => identifier.substring(0,2).toLowerCase() + '-' + identifier.substring(3,)
const lawmakerKey = name => name.replace(/\s/g, '-')

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

// PROCESS
// TODO - class this out

const votes = raw.votes // TODO - work this in

const bills = {
    updateDate: raw.updateDate,
    bills: raw.bills.map(bill => {
        const b = new Bill({ bill, annotations, articles: [], })
        return b.export()
    })
}

const lawmakers = {
    updateDate: raw.updateDate,
    lawmakers: raw.lawmakers.map(lawmaker => {
        const l = new Lawmaker({lawmaker, annotations, articles: [], votes, bills})
        return l.export()
    })
}

// const lawmakers = { updateDate: raw.updateDate }
// lawmakers.lawmakers = raw.lawmakers.map(lawmaker => {

//     // merge in lawmaker annotations
//     const match = annotations.lawmakers.find(d => d.key === lawmaker.name)
//     if (match) console.log('Lawmaker annotation found for', lawmaker.name)
//     const annotation = (match && match.annotation) || []
    
//     let title = ''
//     let fullTitle = ''
//     if (lawmaker.chamber === 'senate') {
//         title = 'Sen.'
//         fullTitle = 'Senator'
//     } else if (lawmaker.chamber === 'house') {
//         title = 'Rep.'
//         fullTitle = 'Representative'
//     }

//     return {
//         key: lawmakerKey(lawmaker.name),
//         name: lawmaker.name,
//         lastName: lawmaker.last_name,
//         district: lawmaker.district,
//         residence: lawmaker.city,
//         title,
//         fullTitle,
//         party: lawmaker.party,
//         chamber: lawmaker.chamber,
//         districtNum: lawmaker.district_num,

//         recordSummary: {}, // TODO
//         bills: [], // TODO
//         votes: [], // TODO
//         articles: [], // TODO
//         annotation: annotation, 
//     }
// })

const house = {
    updateDate: annotations.updateDate,
    text: annotations.house
}
const senate = {
    updateDate: annotations.updateDate,
    text: annotations.senate
}
const governor = {
    updateDate: annotations.updateDate,
    text: annotations.governor
}

writeJson(LAWMAKERS_OUTPUT_PATH, lawmakers)
writeJson(BILLS_OUTPUT_PATH, bills)
writeJson(HOUSE_OUTPUT_PATH, house)
writeJson(SENATE_OUTPUT_PATH, senate)
writeJson(GOVERNOR_OUTPUT_PATH, governor)

// console.log(lawmakers[0])

// console.log(raw.bills[0])