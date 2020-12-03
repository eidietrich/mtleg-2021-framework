// script for merging app data into single JSON fed to gatsby-node

const {
    getJson,
    writeJson,
} = require('./functions.js')

const DATA_2019_PATH = './app/src/data/mtleg-2019.json'
const ANNOTATION_PATH = './app/src/data/temp-app-text.json'

const OUTPUT_PATH = './app/src/data/main.json'

const raw = getJson(DATA_2019_PATH)
const annotations = getJson(ANNOTATION_PATH)

// console.log(Object.keys(raw))
console.log(raw.bills[0])

// merge in bill annotations
raw.bills.forEach(bill => {
    const match = annotations.bills.find(d => d.key === bill.identifier)
    if (match) {
        console.log('Bill annotation found for', bill.identifier)
        bill.isMajorBill = match.isMajorBill
        bill.annotation = match.annotation
    } else {
        bill.isMajorBill = 'no'
        bill.annotation = []
    }
})

// merge in lawmaker annotations
raw.lawmakers.forEach(lawmaker => {
    const match = annotations.lawmakers.find(d => d.key === lawmaker.name)
    if (match) {
        console.log('Lawmaker annotation found for', lawmaker.name)
        lawmaker.annotation = match.annotation
    } else {
        lawmaker.annotation = []
    }
})

// writeJson(OUTPUT_PATH, raw)

