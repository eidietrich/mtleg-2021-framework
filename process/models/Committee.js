const {
    committeeKey,
    hasProgressFlag,
    firstActionWithFlag
} = require("../functions")

const {
    startOfToday
} = require('../config')

class Committee {
    constructor({committee, bills, lawmakers}) {
        const name = committee.name
        const commiteeBills = this.getBillsThroughCommittee(name, bills)
        this.data = {
            name,
            key: committeeKey(name),
            chamber: this.chamberFromName(name),
            members: this.getLawmakersOnCommittee(name, lawmakers),
            bills: commiteeBills,
            upcomingHearings: commiteeBills.filter(b => b.hearingSet).map(b => b.hearingSet),
            overview: this.calculateSummaryStats(commiteeBills),
        }
        // console.log(name, this.data.overview)
    }
    chamberFromName(name) {
        if (name.includes('Joint')) return 'joint'
        if (name.includes('House')) return 'house'
        if (name.includes('Senate')) return 'senate'
    }

    getBillsThroughCommittee(committee, bills){

        const billsThroughThisCommittee = bills
            .filter(bill => bill.data.committees.map(d => d.committee).includes(committee))
            // exclude withdrawn bills
            .filter(bill => !hasProgressFlag(bill.actions, 'withdrawn'))
            .map(bill => {
                const referral = bill.data.committees.find(d => d.committee === committee)
                const committeeActions = bill.actions.filter(d => d.committee === committee)
                const lastAction = committeeActions.slice(-1)[0]

                const hearing = firstActionWithFlag(committeeActions, 'hearing')
                const hasBeenHeard = hearing && (new Date(hearing.date) < startOfToday)
                const hasUpcomingHearing = hearing && (new Date(hearing.date) >= startOfToday)
                
                let committeeStatus = 'pending'
                if (hasUpcomingHearing) committeeStatus = 'hearing-set'
                if (hasBeenHeard) committeeStatus = 'heard'
                if (lastAction.committeePassed) committeeStatus = 'passed'
                if (lastAction.committeeTabled || lastAction.committeeFailed) committeeStatus = 'stalled'
                
                return {
                    // filter to categories needed by Bill Table
                    key: bill.data.key ,
                    identifier: bill.data.identifier ,
                    title: bill.data.title ,
                    status: bill.data.status ,
                    label: bill.data.label,
                    majorBillCategory: bill.data.majorBillCategory,
                    textUrl: bill.data.textUrl,
                    fiscalNoteUrl: bill.data.fiscalNoteUrl,
                    label: bill.data.label,
                    majorBillCategory: bill.data.majorBillCategory,
                    textUrl: bill.data.textUrl,
                    fiscalNoteUrl: bill.data.fiscalNoteUrl,
                    legalNoteUrl: bill.data.legalNoteUrl,
                    numArticles: bill.data.numArticles,
                    sponsor: bill.data.sponsor, // sponsor.party in here

                    // And other information
                    referral,
                    // committeeActions, // involves a lot of data, possibly unnecessarily
                    lastAction,
                    hasBeenHeard,
                    committeeStatus,
                    hearingSet: hasUpcomingHearing ? hearing : null,
                }
            })


        // TODO - add more explicit committee status for each bill?: unheard, heard, passed, failed, tabled --> action dates for each
        // taking committeeActions.slice(-1)[0] may cover this?
        return billsThroughThisCommittee
    }

    getLawmakersOnCommittee(name, lawmakers){
        const clean = name => 
            name
                .replace('Joint Judicial Branch, Law Enforcement and Justice', 'House Joint Approps Subcom on Judicial Branch, Law Enforcement, and Justice')
                .replace('Telecommunications','Technology')
                .replace(/\,/g,'')
                // b/c the Legislature isn't consistent with certain committee names

        const key = clean(name)
        const lawmakersOnCommittee = lawmakers.filter(l => l.data.committees.map(c => clean(c.committee)).includes(key))
        
        if (lawmakersOnCommittee.length === 0) {
            console.log('No lawmaker matches for committee', name)
            // console.log(lawmakers.map(d => d.data.committees))
        }

        return lawmakersOnCommittee.map(l => ({
            key: l.data.key,
            name: l.data.name,
            role: l.data.committees.find(d => clean(d.committee) === key).role,
            district: l.data.district.key,
            locale: l.data.district.locale,
            title: l.data.title,
            party: l.data.party,
        }))
    }
    calculateSummaryStats(committeeBills){
        const billsHeard = committeeBills.filter(d => d.hasBeenHeard)
        const billsPassed = committeeBills.filter(d => d.committeeStatus === 'passed')

        const gopBills = committeeBills.filter(d => d.sponsor.party === 'R')
        const gopBillsPassed = gopBills.filter(d => d.committeeStatus === 'passed')

        const demBills = committeeBills.filter(d => d.sponsor.party === 'D')
        const demBillsPassed = demBills.filter(d => d.committeeStatus === 'passed')

        return {
            billsReferred: committeeBills.length,
            demBillsReferred: demBills.length,
            gopBillsReferred: gopBills.length,

            billsHeard: billsHeard.length,

            billsPassed: billsPassed.length,
            gopBillsPassed: gopBillsPassed.length,
            demBillsPassed: demBillsPassed.length,

            fractionBillsPassed: (committeeBills.length) > 0 ? billsPassed.length / committeeBills.length : 0,
            fractionGopBillsPassed: (gopBills.length) > 0 ? gopBillsPassed.length / gopBills.length : 0,
            fractionDemBillsPassed: (demBills.length) > 0 ? demBillsPassed.length / demBills.length : 0,
        }
    }

    export = () => ({...this.data})

}

module.exports = Committee