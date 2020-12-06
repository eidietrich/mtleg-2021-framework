// Functions for cross-reference between 
// TODO - decide if this is the right way to do this
const {
    getJson
} = require('./utils.js')
const lawmakers = getJson('./scrapers/legislative-roster/2019.json')

const NAME_CLEANING = {
    // for cleaning inconsistent names in LAWS votes records

    // 2019
    'Tempel, Russel (Russ)' : 'Tempel, Russel',
    'Tempel, Russel ': 'Tempel, Russel',
    'McClafferty, Edith (Edie)' : 'McClafferty, Edith',
    'McClafferty, Edith ': 'McClafferty, Edith',
    'Lenz, Dennis R.' : 'Lenz, Dennis',
    'Morigeau, Shane A.' : 'Morigeau, Shane',
    'Kary, Douglas (Doug)' : 'Kary, Douglas',
    'Kary, Douglas ': 'Kary, Douglas',
    'Salomon, Daniel R.' : 'Salomon, Daniel',
    'Sesso, Jon C.' : 'Sesso, Jon',
    'Welborn, Jeffrey W.' : 'Welborn, Jeffrey',
    'MacDonald, Margaret (Margie)' : 'MacDonald, Margaret',
    'MacDonald, Margaret  ': 'MacDonald, Margaret',
    'Harvey, Derek J.' : 'Harvey, Derek',
    'Krautter, Joel G.' : 'Krautter, Joel',
    'Loge, Denley M.' : 'Loge, Denley',
    'Runningwolf, Tyson T.' : 'Runningwolf, Tyson',
    'Shaw, Ray L.' : 'Shaw, Ray',
    'Small, Jason D.' : 'Small, Jason',
    'Holmlund, Kenneth L.' : 'Holmlund, Kenneth',
    'Moore, Frederick (Eric)' : 'Moore, Frederick',
    'Moore, Frederick ': 'Moore, Frederick',
    'Fitzgerald, Ross H.' : 'Fitzgerald, Ross',
    'Ellsworth, Jason W.' : 'Ellsworth, Jason',
    'Galloway, Lola' : 'Sheldon-Galloway, Lola',
    // post-session scrape
    ' Barrett, Dick': 'Barrett, Dick',
    ' Blasdel, Mark': 'Blasdel, Mark',
    ' Cohenour, Jill': 'Cohenour, Jill',
    ' Gillespie, Bruce': 'Gillespie, Bruce',
    ' Hoven, Brian': 'Hoven, Brian',
    ' McClafferty, Edith (Edie)': 'McClafferty, Edith',
    ' Phillips, Mike': 'Phillips, Mike',
    ' Pomnichowski, JP': 'Pomnichowski, JP',
    ' Richmond, Tom': 'Richmond, Tom',
    ' Tempel, Russel (Russ)': 'Tempel, Russel',
    ' Webb, Roger': 'Webb, Roger',
    'Welborn, Jeffery': 'Welborn, Jeffrey',
    'Running Wolf, Tyson': 'Runningwolf, Tyson',
  
  
    // for 2017
    'Stewart Peregoy, Sharon': 'Stewart-Peregoy, Sharon',
    'Kipp, George G.': 'Kipp, George',
    'Jones, Donald W.': 'Jones, Donald',
    'Knokey, Jon A.': 'Knokey, Jon',
  }

module.exports.lawmakerFromLawsName = (laws_name) => {
    const lookupName = NAME_CLEANING[laws_name] || laws_name
    const lawmaker = lawmakers.find(d => d.laws_vote_name === lookupName)
    if (!lawmaker) {
        console.log(lookupName)
        throw `Can't match voter name`
    }
    return lawmaker
}

module.exports.filterToFloorVotes = (votes) => {
    // Hacky way to filter vote list to floor votes
    // See if there's a way to add a setting data point to Vote scraper
    return votes.filter(d => (d.votes.length === 100) || (d.votes.length === 50))
}

module.exports.billKey = (identifier) => identifier.substring(0,2).toLowerCase() + '-' + identifier.substring(3,)