class Lawmaker {
    constructor({lawmaker, annotations, articles, votes, bills}) {
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
            votingSummary: this.getVotingSummary(lawmaker, votes),
            bills: this.getSponsoredBills(lawmaker, bills, votes),
            votes: this.getVotes(lawmaker, annotations, votes),
            articles: this.getArticles(),
            annotation: this.getAnnotation(lawmaker, annotations),
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

    getVotingSummary = (lawmaker, votes) => {
        // TODO
        return {}
    }

    getSponsoredBills = (lawmaker, bills, votes) => {
        // TODO
        return []
    }

    getVotes = (lawmaker, annotations, votes) => {
        // TODO
        return []
    }

    getArticles = (lawmaker, articles) => {
        return []
    }

    getAnnotation = (lawmaker, annotations) => {
        const match = annotations.lawmakers.find(d => d.key === lawmaker.name)
        if (match) console.log('Lawmaker annotation found for', lawmaker.name)
        const annotation = (match && match.annotation) || []
        return annotation
    }

    lawmakerKey = (lawmaker) => lawmaker.name.replace(/\s/g, '-')

    export = () => ({...this.data})

}

module.exports = Lawmaker