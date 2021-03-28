const {
    LAWMAKER_REPLACEMENTS
} = require('../config.js')

const {
    filterToFloorVotes,
    lawmakerLastName,
    billKey,
} = require('../functions.js')

class Lawmaker {
    constructor({ lawmaker, district, annotation, articles, votes, sponsoredBills }) {
        const updatedDistrict = this.updateDistrictReplacementNote(district)

        this.sponsoredBills = this.getSponsoredBills(sponsoredBills)
        this.votes = votes

        // console.log(lawmaker.name, this.votes.length)

        lawmaker.chamber = this.getChamber(district.key)

        this.data = {
            key: this.lawmakerKey(lawmaker),
            name: lawmaker.name,
            lastName: lawmakerLastName(lawmaker.name),
            district: updatedDistrict,
            districtNum: this.getDistrictNum(updatedDistrict),
            locale: this.getLocale(updatedDistrict),
            title: this.getTitle(lawmaker),
            fullTitle: this.getFullTitle(lawmaker),
            chamber: lawmaker.chamber,
            party: lawmaker.party,
            phone: lawmaker.phone,
            email: lawmaker.email,

            committees: lawmaker.committees_19, // Actually 2021 committees - label needs updating
            leadershipRoles: [], // TODO (annotate Speaker of the House etc.)

            legislativeHistory: this.getHistory(lawmaker.sessions),

            articles: articles,
            annotation: annotation,

            imageSlug: this.getImageSlug(lawmaker),

            votingSummary: this.getVotingSummary(lawmaker, this.votes),
            // voteTabulation: this.getVoteTabulation(lawmaker, filterToFloorVotes(this.votes)), // BIG DATA
            votes: [], // TODO,
            sponsoredBills: this.sponsoredBills, // Is there any reason this is stored here too? 
            // votes: this.votes.map(vote => vote.data)
        }
    }

    getChamber = (districtKey) => {
        if (districtKey.includes('SD')) return 'senate'
        if (districtKey.includes('HD')) return 'house'
    }

    getTitle = (lawmaker) => {
        if (lawmaker.chamber === 'senate') return 'Sen.'
        if (lawmaker.chamber === 'house') return 'Rep.'
    }

    getFullTitle = (lawmaker) => {
        if (lawmaker.chamber === 'senate') return 'Senator'
        if (lawmaker.chamber === 'house') return 'Representative'
    }

    getDistrictNum = district => district.key.replace('HD ', '').replace('SD ', '')

    getLocale = (district) => {
        return {
            short: district.locale,
            long: district.locale_description
        }
    }

    getHistory = sessions => {
        const houseSessions = sessions.filter(d => d.chamber === 'house')
        const senateSessions = sessions.filter(d => d.chamber === 'senate')

        return {
            houseSessions,
            numHouseSessions: houseSessions.length,
            senateSessions,
            numSenateSessions: senateSessions.length,
        }
    }

    getImageSlug = (lawmaker) => lawmaker.image_path.replace('images/', '')

    getSponsoredBills = (sponsoredBills) => {
        // TODO - decide whether to export *ALL* bill data and filter into app via GraphQL
        return sponsoredBills.map(bill => {
            const {
                key,
                identifier,
                title,
                status,
                label,
                textUrl,
                fiscalNoteUrl,
                legalNoteUrl,
                numArticles,
                sponsor
            } = bill.data
            return {
                key,
                identifier,
                title,
                status, // object
                label,
                textUrl,
                fiscalNoteUrl,
                legalNoteUrl,
                numArticles,
                sponsor, // object
            }
        })
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
        const numVotesNotPresent = voteTabulation.filter(d => !['yes', 'no'].includes(d.lawmakerVote)).length
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
            fractionVotesNotPresent: (numVotesNotPresent / numVotesRecorded) || 0,
            votesWithMajority,
            fractionVotesWithMajority: (votesWithMajority / numVotesCast) || 0,
            votesWithGopMajority,
            fractionVotesWithGopMajority: (votesWithGopMajority / numVotesCast) || 0,
            votesWithDemMajority,
            fractionVotesWithDemMajority: (votesWithDemMajority / numVotesCast) || 0,
        }
        return votingSummary
    }

    lawmakerKey = (lawmaker) => lawmaker.name.replace(/\s/g, '-')

    updateDistrictReplacementNote = (district) => {
        const replacement = LAWMAKER_REPLACEMENTS.find(d => d.district === district.key)
        if (replacement) {
            const districtCopy = { ...district }
            districtCopy.replacementNote = replacement.note
            return districtCopy
        } else return district
    }

    export = () => ({ ...this.data })
}

module.exports = Lawmaker