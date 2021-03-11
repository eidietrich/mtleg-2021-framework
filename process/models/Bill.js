const Action = require('./Action.js')

const { BILL_STATUSES, FINANCE_COMMITTEES } = require('../config.js')

const {
    billKey,
    lawmakerFromLawsName,
    hasProgressFlag,
    actionsWithFlag,
    firstActionWithFlag,
    lastActionWithFlag
} = require('../functions.js')

class Bill {
    /* Translates bill data from openstates format (w/ added data modifications) to schema used for app */
    constructor({ bill, annotations, articles, votes, keyBillIds, legalNotes }) {
        // console.log(bill)

        this.type = this.getType(bill)
        this.actions = this.getActions(bill, votes)

        const committees = this.getCommittees(bill, this.actions)
        const billArticles = this.getArticles(bill, articles) // Media coverage

        this.data = {
            key: billKey(bill.identifier),
            identifier: bill.identifier,
            chamber: this.getChamber(bill.identifier),
            title: bill.title,
            session: bill.legislative_session,


            // old
            status: this.getStatus(bill),
            progress: this.getProgress(bill, this.actions),
            // new 
            progression: this.getProgression(bill, committees, this.actions),
            committees,

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
            majorBillCategory: this.getMajorBillCategory(bill, annotations),
            articles: billArticles,
            numArticles: billArticles.length,

            actions: this.actions,
        }
        // console.log(this.data)

    }

    getChamber = identifer => {
        const letter = identifer[0]
        return {
            'H': 'house',
            'S': 'senate',
            // 'J': 'joint',
        }[letter]
    }

    getCommittees = (bill, actions) => {
        const actionsWithFlag = (actions, flag) => actions.filter(d => d[flag])
        // committees the bill has passed through
        const referrals = actionsWithFlag(actions, 'sentToCommittee')
        const committees = referrals
            .filter(referral => {
                // remove referrals where next non-floor action is a rereferral
                const nonFloorActions = actions.filter(d => !d.committee.includes('Floor'))
                const referralIndex = nonFloorActions.indexOf(referral)
                const nextNonFloorAction = nonFloorActions[referralIndex + 1]
                if (nextNonFloorAction && nextNonFloorAction.description === 'Rereferred to Committee') return false
                else return true
            })
            // alternative (less elegant?) approach
            // .filter(committee => {
            //     // drop committees where the initial referral is followed by a rereferral w/out a hearing in between
            //     const firstCommitteeActions = actions.find(d => d.committee === committee)
            //     const firstActionIndex = actions.indexOf(firstCommitteeActions)

            //     const reReferral = actions.find(d => d.description === 'Rereferred to Committee')
            //     if (!reReferral) return true // bill hasn't been rereferred
            //     const reReferralIndex = actions.indexOf(reReferral)
            //     if (reReferralIndex <= firstActionIndex) return true
            //     const actionsBetweenReferrals = actions.slice(firstActionIndex, reReferralIndex)
            //     if (actionsBetweenReferrals.map(d => d.description).includes('Hearing')) return true
            //     else return false
            // })
            .map((referral, i) => {
                return {
                    committee: referral.committee,
                    chamber: (bill.chamber === referral.chamber) ? 'first' : 'second',
                    isRereferral: (referral.description === 'Rereferred to Committee'),
                    isAppropsRereferral: (referral.description === 'Rereferred to Committee' && FINANCE_COMMITTEES.includes(referral.committee)),
                    referralDate: referral.date,
                }
            })
        return committees
    }

    // NEW 
    getProgression = (bill, committees, actions) => {
        /*
        This is tricky logic. There are two sources of bill status/progression information available to us.
        
        1) A bill status line presented in the official LAWS system. This is limited b/c it defaults to a "Probably dead" label when a bill dies in process, which doesn't have any information on how far the bull made in the legislative progress before dying

        2) A list actions taken on the bill. This function interprets that list to deduce how far a bill has gotten.  It relies on flags set via ACTIONS in config.js

        */
        const statusFromLAWSLabel = BILL_STATUSES.find(d => d.key === bill.extras.bill_status)
        if (!statusFromLAWSLabel) {
            throw 'Missing bill status match for', bill.extras.bill_status
        }

        const stepStatus = (hasArrived, hasPassed, hasFailed = false) => {
            let status
            if (!hasArrived) status = 'future'
            if (hasArrived && hasPassed) status = 'passed'
            if (hasArrived && !hasPassed && hasFailed) status = 'failed'
            if (hasArrived && !hasPassed && !hasFailed) status = 'pending'
            if (status === undefined) console.log('Status logic error')
            return status
        }

        const chamberOfOrigin = this.getChamber(bill.identifier) // 'house' or 'senate'
        const type = this.type // Different bill types have different procedural paths

        if (!['bill', 'resolution', 'joint resolution', 'referendum proposal'].includes(type)) {
            console.log('Unhandled bill type', type)
            // Should this throw a full-fledged error?
        }

        let steps = []
        let status = {}
        let dates = {}

        const draftRequestAction = firstActionWithFlag(actions, 'draftRequest')
        const draftReadyAction = firstActionWithFlag(actions, 'draftReady')
        const introductionAction = firstActionWithFlag(actions, 'introduction')

        dates.draftRequest = (draftRequestAction && draftRequestAction.date) || null
        dates.draftDelivery = (draftReadyAction && draftReadyAction.date) || null
        dates.introduction = (introductionAction && introductionAction.date) || null

        // initial chamber - relevant for all bill types
        if (['bill', 'resolution', 'joint resolution', 'referendum proposal'].includes(type)) {
            const firstChamber = chamberOfOrigin.replace('house', 'House').replace('senate', 'Senate')
            const firstChamberActions = actions.filter(d => d.chamber === firstChamber)
            const firstChamberCommittees = committees.filter(d => d.chamber === 'first')

            // Code gets messy from here --> Essentially two tracks of logic (one to parse statuses and one to parse action dates)
            // This spaghetti needs to be untangled

            // Initial committee logic
            const initialCommitee = committees[0] || null
            const initialCommitteeName = (initialCommitee && initialCommitee.committee) || null
            const firstCommitteeActions = firstChamberActions.filter(d => d.committee === initialCommitteeName)

            const initialHearing = firstActionWithFlag(firstChamberActions, 'hearing')
            const initialHearingDate = (initialHearing && initialHearing.date) || null


            const firstCommitteeVote = lastActionWithFlag(firstCommitteeActions, 'committeeVote')
            // lastAction instead of firstAction here to work around tabled/untabled bills
            const firstCommitteeVoteDate = (firstCommitteeVote && firstCommitteeVote.date) || null

            const secondReadingAction = firstActionWithFlag(firstChamberActions, 'secondReading')
            const secondReadingActionDate = (secondReadingAction && secondReadingAction.date) || null
            const thirdReadingAction = firstActionWithFlag(firstChamberActions, 'thirdReading')
            const thirdReadingActionDate = (thirdReadingAction && thirdReadingAction.date) || null

            dates.initialHearing = initialHearingDate
            dates.firstCommitteeVote = firstCommitteeVoteDate
            dates.firstChamberSecondReading = secondReadingActionDate
            dates.firstChamberThirdReading = thirdReadingActionDate

            status.firstCommitteeName = initialCommitteeName
            status.firstCommitteeAction = (firstCommitteeVote && firstCommitteeVote.description) || null
            status.firstChamberSecondReading = (secondReadingAction && secondReadingAction.description) || null
            status.firstChamberThirdReading = (thirdReadingAction && thirdReadingAction.description) || null

            // console.log(bill.identifier, status)

            // TODO - bills w/ fiscal impact are routinely rereferred to approps committees
            // const financeCommittee = firstChamberCommittees.find(d => ['House Appropriations','Senate Finance and Claims'].includes(d))

            const isIntroduced = hasProgressFlag(actions, 'introduction')
            const isReferred = hasProgressFlag(firstChamberActions, 'sentToCommittee')
            const passedInitialCommittee = hasProgressFlag(firstChamberActions, 'firstCommitteePassage')
                || hasProgressFlag(firstChamberActions, 'blastMotionPassage')
            // blast motions are a floor vote that pulls a bill out of committee
            const failedInitialCommittee = hasProgressFlag(firstChamberActions, 'firstCommitteeFailed') // DOES NOT capture tabled bills
            const passedInitialFloorVote = hasProgressFlag(firstChamberActions, 'firstChamberInitialPassage')
            const passedFirstChamber = hasProgressFlag(firstChamberActions, 'firstChamberPassage')
            const failedFirstChamber = hasProgressFlag(firstChamberActions, 'firstChamberFailed')

            const firstChamberStatus = stepStatus(isIntroduced, passedFirstChamber, failedFirstChamber)

            //substeps
            const introductionStatus = stepStatus(isIntroduced, isReferred)

            // committees need their own logic to account for tabling
            let initialCommitteeStatus
            if (!isReferred) initialCommitteeStatus = 'future'
            if (isReferred && passedInitialCommittee) initialCommitteeStatus = 'passed'
            if (isReferred && !passedInitialCommittee && !failedInitialCommittee) initialCommitteeStatus = 'pending'
            // ADD logic for bills that have been tabled and not untabled in their initial committee
            if (isReferred && !passedInitialCommittee && failedInitialCommittee) initialCommitteeStatus = 'failed'
            if (initialCommitteeStatus === undefined) console.log('Initial committee status logic error')

            const secondReadingStatus = stepStatus(passedInitialCommittee, passedInitialFloorVote, failedFirstChamber)

            // TODO - add logic in here for bills passed to appropriation committees following second reading vote

            const thirdReadingStatus = stepStatus(passedInitialFloorVote, passedFirstChamber, failedFirstChamber)

            const subSteps = [
                {
                    label: 'Introduced',
                    show: true,
                    status: introductionStatus
                },
                {
                    label: 'First committee hearing',
                    committee: initialCommitee,
                    show: true,
                    status: 'TK'
                },
                {
                    label: 'First committee',
                    committee: initialCommitee,
                    show: true,
                    status: initialCommitteeStatus
                },
                {
                    label: 'Second reading',
                    show: true,
                    status: secondReadingStatus
                },
                // TODO - figure out how to work in appropriations committee referrals
                {
                    label: 'Final reading',
                    show: true,
                    status: thirdReadingStatus
                },
            ]

            steps.push({
                step: firstChamber,
                label: 'First chamber',
                show: true,
                status: firstChamberStatus,
                subSteps,
            })
        }

        // second chamber - all types except simple (single-chamber) resolutions
        if (['bill', 'joint resolution', 'referendum proposal'].includes(type)) {
            const secondChamber = chamberOfOrigin.replace('house', 'Senate').replace('senate', 'House')
            const secondChamberActions = actions.filter(d => d.chamber === secondChamber)

            const toSecondChamber = hasProgressFlag(secondChamberActions, 'introduction')
            const passedSecondChamber = hasProgressFlag(secondChamberActions, 'secondChamberPassage')
            const failedSecondChamber = hasProgressFlag(secondChamberActions, 'secondChamberFailure')

            const secondChamberStatus = stepStatus(toSecondChamber, passedSecondChamber, failedSecondChamber)

            // TODO - add subStep logic here after verifying concept works
            const subSteps = []
            steps.push({
                step: secondChamber,
                label: 'Second chamber',
                show: true,
                status: secondChamberStatus,
                subSteps,
            })
        }

        // reconciliation - measures passed by second chamber with amendments to first chamber bill text
        if (['bill', 'joint resolution', 'referendum proposal'].includes(type)) {
            const secondChamber = chamberOfOrigin.replace('house', 'Senate').replace('senate', 'House')
            const secondChamberActions = actions.filter(d => d.chamber === secondChamber)

            const passedSecondChamber = hasProgressFlag(secondChamberActions, 'secondChamberPassage')
            const amendedInSecondChamber = hasProgressFlag(secondChamberActions, 'secondChamberAmendments')

            // This is inelegant - fix
            const toGovernor = hasProgressFlag(actions, 'sentToGovernor')
            const becameLaw = hasProgressFlag(actions, 'ultimatelyPassed')

            if (passedSecondChamber && amendedInSecondChamber && !toGovernor) {
                // TODO - flesh this logic out
                // TODO - add subStep logic here after verifying concept works
                let reconciliationStatus = 'pending'
                if (toGovernor || becameLaw) reconciliationStatus = 'complete'

                const subSteps = []
                steps.push({
                    step: 'Reconciliation',
                    label: null,
                    chamber: null,
                    show: true,
                    status: reconciliationStatus, // placeholder
                    subSteps,
                })
            }
        }

        // governor - for strict 'bill' bills only 
        if (type === 'bill') {

            const toGovernor = hasProgressFlag(actions, 'sentToGovernor')
            const signedByGovernor = hasProgressFlag(actions, 'signedByGovernor')
            const vetoedByGovernor = hasProgressFlag(actions, 'vetoedByGovernor')
            const becameLaw = hasProgressFlag(actions, 'ultimatelyPassed')
            const letPassWithoutSignature = becameLaw && (!signedByGovernor && !vetoedByGovernor)

            let governorStatus
            if (!toGovernor) governorStatus = 'future'
            if (toGovernor && !signedByGovernor && !vetoedByGovernor && !letPassWithoutSignature) governorStatus = 'pending'
            if (toGovernor && signedByGovernor) governorStatus = 'signed'
            if (toGovernor && vetoedByGovernor) governorStatus = 'vetoed'
            if (toGovernor && letPassWithoutSignature) governorStatus = 'let pass'

            const subSteps = []
            steps.push({
                step: 'Gov.',
                label: null,
                show: true,
                status: governorStatus,
                subSteps,
            })

        }



        const output = {
            type,
            statusFromLAWSLabel,
            steps,
            status,
            dates,
        }
        return output
    }

    // OLD
    getStatus = (bill) => {
        // Status as pulled from LAWS status line
        const match = BILL_STATUSES.find(d => d.key === bill.extras.bill_status)
        if (!match) {
            throw 'Missing bill status match for', bill.extras.bill_status
        }
        return match
    }

    // OLD
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
            else if (vetoedByGovernor) progress.governorStatus = 'vetoed'
            else if (toGovernor && ultimatelyPassed && (!signedByGovernor && !vetoedByGovernor)) progress.governorStatus = 'became law unsigned'
            else progress.governorStatus = 'pending'

        }

        if (!['bill', 'resolution', 'joint resolution', 'referendum proposal'].includes(this.type)) {
            console.log('Unhandled bill type', this.type)
        }

        return progress

    }

    getSponsor = (bill) => {
        const sponsor = lawmakerFromLawsName(bill.sponsorships[0].name)
        if (!sponsor) {
            console.log('No sponsor found', bill.identifier)
            return {}
        }
        return {
            name: sponsor.name,
            district: sponsor.district,
            party: sponsor.party,
            // city: sponsor.city, // This may be uncleaned city name
        }
    }

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

    getMajorBillCategory = (bill, annotations) => {
        const match = annotations.bills.find(d => d.key === bill.identifier)
        // TODO - aggregate w/ get annotations
        return (match && match.category) || null
    }

    getMajorStatus = (bill, keyBillIds) => {
        return keyBillIds.includes(bill.identifier) ? 'yes' : 'no'
    }

    getActions = (bill, votes) => {
        const actions = bill.actions.map(action => new Action({ action, votes }).export())
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

    export = () => ({ ...this.data })
}

module.exports = Bill