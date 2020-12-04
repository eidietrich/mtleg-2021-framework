const Vote = require('./Vote')

class Bill {
    constructor({bill, annotations, articles, votes}) {
        this.data = {
            key: this.billKey(bill),
            identifier: bill.identifier,
            title: bill.title,
            session: bill.legislative_session,

            status: this.getStatus(bill),
            sponsor: this.getSponsor(bill),
            lawsUrl: this.getLawsUrl(bill),
            textUrl: this.getTextUrl(bill),
            fiscalNoteUrl: this.getFiscalNoteUrl(bill),
            legalNoteUrl: this.getLegalNoteUrl(bill),

            annotation: this.getAnnotations(bill, annotations),
            isMajorBill: this.getMajorStatus(bill, annotations),
            actions: this.getActions(bill, votes),
            articles: this.getArticles(bill, articles),
        }
        
    }

    billKey = (bill) => bill.identifier.substring(0,2).toLowerCase() + '-' + bill.identifier.substring(3,)

    getStatus = (bill) => 'TK' // TODO

    getSponsor = (bill) => bill.sponsorships[0].name

    getLawsUrl = (bill) => bill.sources[0].url

    getTextUrl = (bill) => {
        // Hacky - verify this works on bills with multiple versions
        return bill.versions[0].links[0].url
    }

    getFiscalNoteUrl = (bill) => {
        // Hacky - verify this works on bills w/ multiple fiscal notes
        const fiscalNote = bill.documents.find(d => d.note === 'Fiscal Note(s)')
        return fiscalNote && fiscalNote.links[0].url
    }

    getLegalNoteUrl = (bill) => null // TODO

    getAnnotations = (bill, annotations) => {
        const match = annotations.bills.find(d => d.key === bill.identifier)
        if (match) console.log('Bill annotation found for', bill.identifier)
        return (match && match.annotation) || []
    }
    getMajorStatus = (bill, annotations) => {
        const match = annotations.bills.find(d => d.key === bill.identifier)
        return (match && match.isMajorBill) || 'no'
    }

    getActions = (bill, votes) => {
        const billVotes = votes
            .filter(vote => vote.bill_identifier === bill.identifier)
            .map(vote => new Vote({vote}).export())

        const actions = bill.actions.map(action => {
            // TODO: Add more definitive identification point to scraper code
            // This will fail on repeated votes with the same action description on same day
            const actionVote = billVotes
                .filter(vote => vote.date === action.date)
                .find(vote => vote.action === action.description)
            return {
                date: action.date,
                description: action.description,
                chamber: null, // TODO -- will need to tweak scraper
                committee: null, // TODO -- will need to tweak scraper
                vote: actionVote || null,
                isMajor: true, // TODO - will need to reference action list
            }
        }).sort((a,b) => new Date(b.date) - new Date(a.date))

        // console.log(actions)
        return actions
    }

    getArticles = (bill) => [] // TODO

    export = () => ({...this.data})
}

module.exports = Bill