const {
    getJson
} = require('./utils.js')
const lawmakers = getJson('./scrapers/lawmakers/process/lawmakers.json')

const {
    NAME_CLEANING,
    LAST_NAMES,
} = require('./config')

module.exports.lawmakerFromLawsName = (laws_name) => {
    const lookupName = NAME_CLEANING[laws_name] || laws_name
    const lawmaker = lawmakers.find(d => d.name === lookupName)
    if (!lawmaker) {
        // console.log(`Missing match name: ${lookupName}`)
        throw `Can't match voter name: ${lookupName}`
    }
    return lawmaker
}

module.exports.lawmakerLastName = (name) => {
    // Assumes cleaned version of name
    if (!(name in LAST_NAMES)) console.log('Missing last name match for', name)
    return LAST_NAMES[name]
}

module.exports.getCanonicalLawmakerNames = () => Array.from(new Set(Object.values(NAME_CLEANING)))

module.exports.filterToFloorVotes = (votes) => {
    // console.log('vote length', votes.map(d => d.votes.length))
    // Hacky way to filter vote list to floor votes
    // See if there's a way to add a setting data point to Vote scraper
    // using 99 instead of 100 below because of missing Steve Gunderson bug
    return votes.filter(d => (d.votes.length >= 99) || (d.votes.length === 50))
}

module.exports.billKey = (identifier) => identifier.substring(0, 2).toLowerCase() + '-' + identifier.substring(3,)