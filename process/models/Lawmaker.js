const {
    filterToFloorVotes,
    billKey,
} = require('../functions.js')

class Lawmaker {
    constructor({lawmaker, annotations, articles, votes, bills}) {
        this.sponsoredBills = this.getSponsoredBills(lawmaker, bills),
        this.votes = this.getVotes(lawmaker, votes),
        this.data = {
            key: this.lawmakerKey(lawmaker),
            name: lawmaker.name,
            lastName: lawmaker.last_name,
            district: lawmaker.district,
            residence: lawmaker.city,
            title: this.getTitle(lawmaker),
            fullTitle: this.getFullTitle(lawmaker),
            chamber: lawmaker.chamber,
            party: lawmaker.party,
            districtNum: lawmaker.district_num,

            articles: this.getArticles(lawmaker, articles),
            annotation: this.getAnnotation(lawmaker, annotations),

            votingSummary: this.getVotingSummary(lawmaker, this.votes),
            voteTabulation: this.getVoteTabulation(lawmaker, filterToFloorVotes(this.votes)), // BIG DATA
            bills: this.sponsoredBills,
            // votes: this.votes.map(vote => vote.data)
        }
    }

    getTitle = (lawmaker) => {
        if (lawmaker.chamber === 'senate') return 'Sen.'
        if (lawmaker.chamber === 'house') return 'Rep.'
    }

    getFullTitle = (lawmaker) => {
        if (lawmaker.chamber === 'senate') return 'Senator'
        if (lawmaker.chamber === 'house') return 'Representative'
    }

    

    getSponsoredBills = (lawmaker, bills) => {
        const sponsoredBills = bills.filter(bill => bill.data.sponsor === lawmaker.name)
        // TODO - decide whether to export *ALL* bill data and filter into app via GraphQL
        return sponsoredBills.map(bill => {
            const {key, identifier, title, status} = bill.data
            return {key, identifier, title, status}
        })
    }

    getVotes = (lawmaker, votes) => {
        const lawmakerVotes = votes.filter(vote => {
            const voters = vote.votes.map(d => d.name)
            return voters.includes(lawmaker.name)
        })
        return lawmakerVotes
    }
    getVoteTabulation = (lawmaker, lawmakerVotes) => {
        // TODO: Fine-tune this to floor votes (currently done w/ inputs), one per bill
        // Display will need an 'is this a key vote' filter
        return lawmakerVotes.map(vote => {
            return {
                billKey: billKey(vote.data.bill),
                lawmakerVote: vote.votes.find(d => d.name === lawmaker.name).option, 
                bill: vote.data.bill,
                action: vote.data.action,
                date: vote.data.date,
                keyVote: true, 
                count: vote.data.count,
                motionPassed: vote.data.motionPassed,
                gopCount: vote.data.gopCount,
                gopSupported: vote.data.gopSupported,
                demCount: vote.data.demCount,
                demSupported: vote.data.demSupported,
            }
        })
    }
    getVotingSummary = (lawmaker, lawmakerVotes) => {
        
        const floorVotes = filterToFloorVotes(lawmakerVotes)
        const voteTabulation = this.getVoteTabulation(lawmaker, floorVotes)

        const numVotesRecorded = floorVotes.length
        const numVotesNotPresent = voteTabulation.filter(d => !['yes','no'].includes(d.lawmakerVote)).length
        const numVotesCast = numVotesRecorded - numVotesNotPresent
        const votesWithMajority = voteTabulation.filter(d => 
            ((d.lawmakerVote === 'yes') && d.motionPassed)
            || ((d.lawmakerVote === 'no') && !d.motionPassed)
        ).length
        const votesWithGopMajority = voteTabulation.filter(d => 
            ((d.lawmakerVote === 'yes') && d.gopSupported)
            || ((d.lawmakerVote === 'no') && !d.gopSupported)
        ).length
        const votesWithDemMajority = voteTabulation.filter(d => 
            ((d.lawmakerVote === 'yes') && d.demSupported)
            || ((d.lawmakerVote === 'no') && !d.demSupported)
        ).length

        const votingSummary = {
            numVotesRecorded,
            numVotesCast,
            numVotesNotPresent,
            fractionVotesNotPresent: numVotesNotPresent / numVotesRecorded,
            votesWithMajority,
            fractionVotesWithMajority: votesWithMajority / numVotesCast,
            votesWithGopMajority,
            fractionVotesWithGopMajority: votesWithGopMajority / numVotesCast,
            votesWithDemMajority,
            fractionVotesWithDemMajority: votesWithDemMajority / numVotesCast,
        }
        return votingSummary
        
    }

    getArticles = (lawmaker, articles) => {
        return []
    }

    getAnnotation = (lawmaker, annotations) => {
        const match = annotations.lawmakers.find(d => d.key === lawmaker.name)
        // if (match) console.log('Lawmaker annotation found for', lawmaker.name)
        const annotation = (match && match.annotation) || []
        return annotation
    }

    lawmakerKey = (lawmaker) => lawmaker.name.replace(/\s/g, '-')

    export = () => ({...this.data})

}

module.exports = Lawmaker