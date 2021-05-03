const {
    LAWMAKER_REPLACEMENTS
} = require('../config.js')

const {
    filterToFloorVotes,
    lawmakerLastName,
    billKey,
} = require('../functions.js')

class Lawmaker {
    constructor({ lawmaker, annotations, articles, votes, bills, districts }) {
        this.sponsoredBills = this.getSponsoredBills(lawmaker, bills),
            this.votes = this.getVotes(lawmaker, votes),

            // console.log(lawmaker.name, this.votes.length)

            lawmaker.chamber = this.getChamber(lawmaker.district)


        this.data = {
            key: this.lawmakerKey(lawmaker),
            name: lawmaker.name,
            lastName: lawmakerLastName(lawmaker.name),
            district: this.getDistrictInfo(lawmaker, districts),
            districtNum: this.getDistrictNum(lawmaker.district),
            locale: this.getLocales(lawmaker, districts),
            title: this.getTitle(lawmaker),
            fullTitle: this.getFullTitle(lawmaker),
            chamber: lawmaker.chamber,
            party: lawmaker.party,
            phone: lawmaker.phone,
            email: lawmaker.email,

            committees: lawmaker.committees_19, // Actually 2021 committees - label needs updating
            leadershipRoles: [], // TODO (annotate Speaker of the House etc.)

            legislativeHistory: this.getHistory(lawmaker.sessions),

            articles: this.getArticles(lawmaker, articles),
            annotation: this.getAnnotation(lawmaker, annotations),

            imageSlug: this.getImageSlug(lawmaker),

            votingSummary: this.getVotingSummary(lawmaker, this.votes),
            // voteTabulation: this.getVoteTabulation(lawmaker, filterToFloorVotes(this.votes)), // BIG DATA
            votes: [], // TODO,
            sponsoredBills: this.sponsoredBills,
            // votes: this.votes.map(vote => vote.data)
        }
        // console.log(lawmaker.name, this.sponsoredBills.length)
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

    getDistrictNum = key => +key.replace('HD ', '').replace('SD ', '')

    getDistrictInfo = (lawmaker, districts) => {
        const district = districts.find(d => d.key === lawmaker.district)
        const replacement = LAWMAKER_REPLACEMENTS.find(d => d.district === district.key)
        if (replacement) district.replacementNote = replacement.note
        return district
    }
    getLocales = (lawmaker, districts) => {
        const district = districts.find(d => d.key === lawmaker.district)
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

    getSponsoredBills = (lawmaker, bills) => {
        const sponsoredBills = bills.filter(bill => bill.data.sponsor.name === lawmaker.name)
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

    getArticles = (lawmaker, articles) => {
        const articlesAboutLawmaker = articles.filter(article => article.data.lawmakerTags.includes(lawmaker.name)).map(d => d.export())
        // if (articlesAboutLawmaker.length > 0) console.log(lawmaker.name, articlesAboutLawmaker.length)
        return articlesAboutLawmaker
    }

    getAnnotation = (lawmaker, annotations) => {
        const match = annotations.lawmakers.find(d => d.key === lawmaker.name)
        // if (match) console.log('Lawmaker annotation found for', lawmaker.name)
        const annotation = (match && match.annotation) || []
        return annotation
    }

    lawmakerKey = (lawmaker) => lawmaker.name.replace(/\s/g, '-')

    export = () => ({ ...this.data })

}

module.exports = Lawmaker