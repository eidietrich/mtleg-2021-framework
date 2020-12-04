class Vote {
    constructor({vote}) {
        this.data = {
            date: vote.start_date,
            bill: vote.bill_identifier,
            action: vote.bill_action,
            session: vote.legislative_session,

            motion: vote.motion_text,
            motionClass: vote.motion_classification[0],

            // counts: vote.counts, // This came from prior prep script
            // gopCaucus: vote.gopCaucus,
            // demCaucus: vote.demCaucus,

            source: this.getSource(vote),

            votes: this.cleanVotes(vote.votes),
            // outcome bools
            voteSucceeds: this.getVotePassage(vote),
            gopSupport: this.getGopSupport(vote),
            demSupport: this.getDemSupport(vote),
            // Text for table displays
            voteOutcomeText: this.getVoteOutcomeText(vote),
            voteGopCaucusText: this.getVoteGopCaucusText(vote),
            voteDemCaucusText: this.getVoteDemCaucusText(vote),
            lawmakersAbsent: this.getAbsentLawmakers(vote),
        }
    }

    getSource = (vote) => vote.sources[0].url

    cleanVotes = (rawVotes) => {
        return rawVotes.map(v => ({
            voter: v.voter_name, // TODO: Transform this to name version used elsewhere
            option: v.option,
            party: '', // TODO -- this will take a data merge
            district: '', // TODO — this will take a data merge
        }))
    }

    getVotePassage = (vote) => {
        // TODO: Assumes 50% margin for passage... need to refine
        // Looks like there's an entry for this in LAWS
        const yeas = vote.counts.find(d => d.option === 'yes').value
        const nays = vote.counts.find(d => d.option === 'no').value
        return yeas > nays
    }
    getGopSupport = (vote) => vote.gopCaucus.yes > vote.gopCaucus.no
    getDemSupport = (vote) => vote.demCaucus.yes > vote.demCaucus.no

    getVoteOutcomeText = (vote) => {
        const yeas = vote.counts.find(d => d.option === 'yes').value
        const nays = vote.counts.find(d => d.option === 'no').value
        return `${yeas}-${nays}`
    }
    getVoteGopCaucusText = (vote) => `${vote.gopCaucus.yes}-${vote.gopCaucus.no}`
    getVoteDemCaucusText = (vote) => `${vote.demCaucus.yes}-${vote.demCaucus.no}`
    getAbsentLawmakers = (vote) => {
        const absentCounts = vote.counts
            .filter(d => ['excused','absent','other'].includes(d.option))
        const count = absentCounts.reduce((acc, cur) => acc + cur.value, 0)
        return count
    }

    export = () => ({...this.data})

}

module.exports = Vote