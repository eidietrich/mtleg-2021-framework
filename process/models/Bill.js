const Action = require('./Action.js')

const { BILL_STATUSES } = require('../config.js')

const {
    billKey,
    lawmakerFromLawsName
} = require('../functions.js')

class Bill {
    /* Translates bill data from openstates format (w/ added data modifications) to schema used for app */
    constructor({bill, annotations, articles, votes, keyBillIds, legalNotes}) {
        // console.log(bill)

        this.type = this.getType(bill)
        this.actions = this.getActions(bill, votes)

        this.data = {
            key: billKey(bill.identifier),
            identifier: bill.identifier,
            chamber: this.getChamber(bill.identifier),
            title: bill.title,
            session: bill.legislative_session,
            
            

            status: this.getStatus(bill),
            progress: this.getProgress(bill, this.actions),

            sponsor: this.getSponsor(bill),
            requestor: this.getRequestor(bill),
            type: this.type, // bill, resolution etc.

            transmittalDeadline: this.getTransmittalDeadline(bill),
            secondHouseReturnIfAmendedDeadline: this.getSecondHouseReturnIfAmendedDeadline(bill),
            fiscalNoteExpected: this.getFiscalNoteExpected(bill),
            voteMajorityRequired: this.getVoteMajorityRequired(bill),

            subjects: this.getSubjects(bill),

            lawsUrl: this.getLawsUrl(bill),
            textUrl: this.getTextUrl(bill),
            fiscalNoteUrl: this.getFiscalNoteUrl(bill),
            legalNoteUrl: this.getLegalNoteUrl(bill, legalNotes),

            annotation: this.getAnnotations(bill, annotations),
            label: this.getLabel(bill, annotations),
            isMajorBill: this.getMajorStatus(bill, keyBillIds),
            articles: this.getArticles(bill, articles), // Media coverage

            actions: this.actions,
        }
        // console.log(this.data)
        
    }

    getChamber = identifer => {
        const letter = identifer[0]
        return {
            'H': 'house',
            'S': 'senate',
            'J': 'joint',
        }[letter]
    }

    getStatus = (bill) => {
        // Status as pulled from LAWS status line
        const match = BILL_STATUSES.find(d => d.key === bill.extras.bill_status)
        if (!match) {
            throw 'Missing bill status match for', bill.extras.bill_status
        }
        return match
    }

    getProgress = (bill, actions) => {
        // Status as calculated from actions
        const hasProgressFlag = (actions, flag) => actions.map(d => d[flag]).includes(true)
        const progress = {
            passagesNeeded: 'TK - depending on type',
            toFirstChamber: false,
            firstChamberStatus: null,
            outOfInitialCommittee: false,
            toSecondChamber: false,
            secondChamberStatus: null,
            toGovernor: false,
            governorStatus: 'null',
            finalOutcome: null,
        }
        // Possible improvement here progress as array of thresholds to clear, in order

        const missedDeadline = hasProgressFlag(actions, 'missedDeadline')
        const ultimatelyFailed = hasProgressFlag(actions, 'ultimatelyFailed')
        const ultimatelyPassed = hasProgressFlag(actions, 'ultimatelyPassed')

        if (ultimatelyFailed) progress.finalOutcome = 'failed'
        if (ultimatelyPassed) progress.finalOutcome = 'passed'
        
        // Resolutions
        if (this.type === 'resolution') {
            if (hasProgressFlag(actions, 'introduction')) progress.toFirstChamber = true
        }
        if (['bill', 'joint resolution', 'referendum proposal'].includes(this.type)) {
            const firstChamberActions = (bill.identifier[0] === 'H') ? 
                actions.filter(d => d.chamber === 'House') :
                actions.filter(d => d.chamber === 'Senate')
            const secondChamberActions = (bill.identifier[0] === 'H') ? 
                actions.filter(d => d.chamber === 'Senate') :
                actions.filter(d => d.chamber === 'House')
            
            // Introduction
            if (hasProgressFlag(actions, 'introduction')) progress.toFirstChamber = true

            // Initial committee
            // TODO enhance first chamber
            
            // First chamber 
            const introduced = hasProgressFlag(actions, 'introduction')
            const passedFirstChamberCommittee = hasProgressFlag(firstChamberActions, 'firstCommitteePassage')
            const passedFirstChamber = hasProgressFlag(firstChamberActions, 'firstChamberPassage')
            const tabledInFirstChamber = hasProgressFlag(firstChamberActions, 'committeeTabled')
            const untabledInFirstChamber = hasProgressFlag(firstChamberActions, 'committeeUntabled')
            const failedFirstChamber = hasProgressFlag(firstChamberActions, 'firstChamberFailed')

            if (introduced) progress.firstChamberStatus = 'pending'
            if (passedFirstChamberCommittee) progress.outOfInitialCommittee = true
            if (tabledInFirstChamber && !untabledInFirstChamber) progress.firstChamberStatus = 'tabled'
            if (failedFirstChamber) progress.firstChamberStatus = 'failed'
            if (!passedFirstChamber && missedDeadline) progress.firstChamberStatus = 'missed deadline'
            if (!passedFirstChamber && ultimatelyFailed) progress.firstChamberStatus = 'failed'
            if (passedFirstChamber) progress.firstChamberStatus = 'passed'
            
            // Second chamber
            if (hasProgressFlag(actions, 'sentToSecondChamber')) progress.toSecondChamber = true
            if (hasProgressFlag(secondChamberActions, 'secondChamberPassage')) progress.secondChamberStatus = 'passed'
            
        }
        if (this.type === 'bill') {
            // Logic for bills that doesn't apply to joint resolutions, referendum proposals
            // Governor
            const toGovernor = hasProgressFlag(actions, 'sentToGovernor')
            const signedByGovernor = hasProgressFlag(actions, 'signedByGovernor')
            const vetoedByGovernor = hasProgressFlag(actions, 'vetoedByGovernor')
            if (toGovernor) progress.toGovernor = true
            if (signedByGovernor) progress.governorStatus = 'signed'
            if (vetoedByGovernor) progress.governorStatus = 'vetoed'
            if (toGovernor && ultimatelyPassed && (!signedByGovernor && !vetoedByGovernor)) progress.governorStatus = 'became law unsigned'
            else progress.governorStatus = 'pending'
            
        } 
        
        if (!['bill','resolution','joint resolution', 'referendum proposal'].includes(this.type)) {
            console.log('Unhandled bill type', this.type)
        }

        return progress

    }

    getSponsor = (bill) => lawmakerFromLawsName(bill.sponsorships[0].name).name

    getRequestor = (bill) => bill.extras.requester // Last name in data only

    getType = (bill) => {
        if (bill.extras['category:'] === 'REFERENDUM PROPOSALS') return 'referendum proposal'
        else return bill.classification[0]
    }


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

    getLegalNoteUrl = (bill, legalNotes) => {
        const match = legalNotes.find(d => d.bill === bill.identifier)
        if (match) return match.url
        else return null
    }

    getAnnotations = (bill, annotations) => {
        const match = annotations.bills.find(d => d.key === bill.identifier)
        // if (match) console.log('Bill annotation found for', bill.identifier)
        return (match && match.annotation) || []
    }
    getLabel = (bill, annotations) => {
        // title annotation
        // TODO - aggregate w/ get annotations
        const match = annotations.bills.find(d => d.key === bill.identifier)
        return (match && match.label) || null
    }
        

    getMajorStatus = (bill, keyBillIds) => {
        return keyBillIds.includes(bill.identifier) ? 'yes' : 'no'
    }

    getActions = (bill, votes) => {
        const actions = bill.actions.map(action => new Action({action, votes}).export())
        // sorting by date here screws with order b/c of same-day actions
        return actions
    }

    getArticles = (bill, articles) => {
        const articlesAboutBill = articles.filter(article => article.data.billTags.includes(bill.identifier)).map(d => d.export())
        // if (articlesAboutBill.length > 0) console.log(bill.identifier, articlesAboutBill.length)
        return articlesAboutBill
    }

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
            if (thresholds.includes('3/4 of Each House')) {
                return '3/4 of Each House'
            } else if (withoutSimple.length > 1) {
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