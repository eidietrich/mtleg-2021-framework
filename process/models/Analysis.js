// Model for app-independent analysis

class Analysis {
    constructor({ bills }) {
        this.updateTime = new Date(),
        this.billProgression = bills.map(bill => this.getBillProgress(bill))

        // console.log(this.billProgression.find(d => d.identifier === 'SB 65'))
    }

    getBillProgress(bill) {
        // bill: Bill model
        // This reshapes hierarchical bill data formatted for front-end app to flat form suitable for analysis

        const data = bill.data
        const progression = bill.data.progression

        return {
            session: data.session,
            identifier: data.identifier,
            title: data.title,
            sponsor: data.sponsor.name,
            sponsorParty: data.sponsor.party,

            draftRequestDate: progression.dates.draftRequest,
            draftDeliveryDate: progression.dates.draftDelivery,
            introductionDate: progression.dates.introduction,

            firstCommitteeName: progression.status.firstCommitteeName,
            firstCommitteeHearingDate: progression.dates.initialHearing,
            firstCommitteeActionDate: progression.dates.firstCommitteeVote,
            firstCommitteeActionOutcome: progression.status.firstCommitteeAction,
            firstChamberSecondReadingDate: progression.dates.firstChamberSecondReading,
            firstChamberSecondReadingOutcome: progression.status.firstChamberSecondReading,
            firstChamberThirdReadingDate: progression.dates.firstChamberThirdReading,
            firstChamberThirdReadingOutcome: progression.status.firstChamberThirdReading,
            
            firstChamberOutcome: progression.steps.find(d => d.label === 'First chamber').status,
        }
    }
}

module.exports = Analysis