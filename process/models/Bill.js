const Action = require('./Action.js')

const {
    billKey
} = require('../functions.js')

class Bill {
    /* Translates bill data from openstates format (w/ added data modifications) to schema used for app */
    constructor({bill, annotations, articles, votes}) {
        // console.log(bill)
        this.data = {
            key: billKey(bill.identifier),
            identifier: bill.identifier,
            title: bill.title,
            session: bill.legislative_session,

            status: this.getStatus(bill),
            sponsor: this.getSponsor(bill),
            requestor: this.getRequestor(bill),
            type: this.getType(bill), // bill, resolution etc.

            transmittalDeadline: this.getTransmittalDeadline(bill),
            secondHouseReturnIfAmendedDeadline: this.getSecondHouseReturnIfAmendedDeadline(bill),
            fiscalNoteExpected: this.getFiscalNoteExpected(bill),
            voteMajorityRequired: this.getVoteMajorityRequired(bill),

            subjects: this.getSubjects(bill),

            lawsUrl: this.getLawsUrl(bill),
            textUrl: this.getTextUrl(bill),
            fiscalNoteUrl: this.getFiscalNoteUrl(bill),
            legalNoteUrl: this.getLegalNoteUrl(bill),

            annotation: this.getAnnotations(bill, annotations),
            isMajorBill: this.getMajorStatus(bill, annotations),
            articles: this.getArticles(bill, articles), // Media coverage

            actions: this.getActions(bill, votes),
        }
        // console.log(this.data)
        
    }

    getStatus = (bill) => bill.extras.bill_status

    getSponsor = (bill) => bill.sponsorships[0].name

    getRequestor = (bill) => bill.extras.requester

    getType = (bill) => bill.classification[0]

    getTransmittalDeadline = (bill) => bill.extras['transmittal_date:']

    getSecondHouseReturnIfAmendedDeadline = (bill) => bill.extras['return_(with_2nd_house_amendments)_date:']

    getFiscalNoteExpected = (bill) => bill.extras['fiscal_note_probable:']

    getVoteMajorityRequired = (bill) => {
        const subjects = bill.extras.extra_subjects
        const voteThresholds = Array.from(new Set(subjects.map(d => d.vote_requirement)))
        const controllingThreshold = this.determineVoteThreshold(voteThresholds)
        return controllingThreshold
    }

    getSubjects = (bill) => bill.subject // TODO -- add cleaning here

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

    getLegalNoteUrl = (bill) => null // TODO - need to find an example of a bill w/ legal notes attached

    getAnnotations = (bill, annotations) => {
        const match = annotations.bills.find(d => d.key === bill.identifier)
        // if (match) console.log('Bill annotation found for', bill.identifier)
        return (match && match.annotation) || []
    }
    getMajorStatus = (bill, annotations) => {
        const match = annotations.bills.find(d => d.key === bill.identifier)
        return (match && match.isMajorBill) || 'no'
    }

    getActions = (bill, votes) => {
        // const billVotes = votes.filter(vote => vote.identifier === bill.identifier)
        const actions = bill.actions.map(action => new Action({action, votes}).export())
            .sort((a,b) => new Date(b.date) - new Date(a.date))
        return actions
    }

    getArticles = (bill) => [] // TODO - media link aggregation

    determineVoteThreshold = (thresholds) => {
        // Takes array of vote thresholds attached to bill and returns the one that's controlling
        // Return only threshold if there's only one, otherwise remove simple and hope there's only one to return
        const knownThresholds = ['Simple', '2/3 of Entire Legislature', '2/3 of Each House', '3/4 of Each House']
        thresholds.forEach(key => {
            if (!knownThresholds.includes(key)) console.log('Unclassified vote threshold', key)
        })
        if (thresholds.length == 1) {
            return thresholds[0] // majority of cases
        } else {
            const withoutSimple = thresholds.filter(d => d != 'Simple')
            if (withoutSimple.length > 1) {
                console.log('thresholds:', thresholds)
                throw `Unhandled vote threshold case`
            } else {
                return withoutSimple[0]
            }
        }
    }

    export = () => ({...this.data})
}

module.exports = Bill