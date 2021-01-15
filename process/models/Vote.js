const {
    lawmakerFromLawsName
} = require('../functions.js')

class Vote {
    constructor({vote}) {
        
        this.votes = this.cleanVotes(vote.votes)
        this.count = this.cleanCount(vote.counts) // reformatting
        this.gopCount = this.getGopCount(this.votes),
        this.demCount = this.getDemCount(this.votes),

        this.motion = vote.motion_text

        // TODO -- work out how to set threshold as a function of motion text
        // Need to reference bill
        const threshold = 'simple'

        this.data = {
            date: vote.start_date,
            bill: vote.bill_identifier,
            action: vote.bill_action,
            session: vote.legislative_session,

            motion: this.motion,
            thresholdRequired: threshold,

            count: this.count,
            gopCount: this.gopCount,
            demCount: this.demCount,

            motionPassed: this.didMotionPass(this.count, threshold),
            gopSupported: this.didMotionPass(this.gopCount, threshold),
            demSupported: this.didMotionPass(this.demCount, threshold),
            
            voteUrl: this.getSource(vote),

            // TODO - figure out how to remove this from export
            votes: this.votes,
        }
        
    }

    getSource = (vote) => vote.sources[0].url

    cleanCount = (rawCounts) => {
        const count = {}
        rawCounts.forEach(c => count[c.option] = c.value)
        return count
    }

    cleanVotes = (rawVotes) => {
        return rawVotes.map(v => {
            // .replace('<skip>','Reksten')
            const lawmaker = lawmakerFromLawsName(v.voter_name)
            return {
                name: lawmaker.name,
                option: v.option,
                // lastName: lawmaker.last_name,
                party: lawmaker.party,
                city: lawmaker.city,
                district: lawmaker.district,
            }
        })
    }

    getGopCount = (votes) => {
        const gopVotes = votes.filter(d => d.party === 'R')
        return {
            yes: gopVotes.filter(d => d.option === 'yes').length,
            no: gopVotes.filter(d => d.option === 'no').length,
            absent: gopVotes.filter(d => d.option === 'absent').length,
            excused: gopVotes.filter(d => d.option === 'excused').length,
            other: gopVotes.filter(d => !['yes','no','absent','excused'].includes(d.option)).length
        }
    }

    getDemCount = (votes) => {
        const gopVotes = votes.filter(d => d.party === 'D')
        return {
            yes: gopVotes.filter(d => d.option === 'yes').length,
            no: gopVotes.filter(d => d.option === 'no').length,
            absent: gopVotes.filter(d => d.option === 'absent').length,
            excused: gopVotes.filter(d => d.option === 'excused').length,
            other: gopVotes.filter(d => !['yes','no','absent','excused'].includes(d.option)).length
        }
    }

    didMotionPass = (count, threshold='Simple') => {
       // TODO --> Account for non-simple-majority votes
        if (threshold === 'simple') {
            return (count.yes > count.no)
        } else {
            throw 'Unsupported vote threshold'
        }
    }

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