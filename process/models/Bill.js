class Bill {
    constructor({bill, annotations, articles}) {
        this.updateDate = bill.updateDate
        this.identifier = bill.identifier
        this.title = bill.title
        this.session = bill.legislative_session

        this.status = this.getStatus(bill)
        this.sponsor = this.getSponsor(bill)
        this.lawsUrl = this.getLawsUrl(bill)
        this.textUrl = this.getTextUrl(bill)
        this.fiscalNoteUrl = this.getFiscalNoteUrl(bill)
        this.legalNoteUrl = this.getLegalNoteUrl(bill)

        this.annotation = this.getAnnotations(bill, annotations)
        this.isMajorBill = this.getMajorStatus(bill, annotations)
        this.actions = this.getActions(bill)
        this.articles = this.getArticles(bill, articles)
    }

    billKey = () => this.identifier.substring(0,2).toLowerCase() + '-' + this.identifier.substring(3,)

    getStatus = (bill) => 'TK' // TODO

    getSponsor = (bill) => bill.sponsorships[0].name

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

    getLegalNoteUrl = (bill) => null // TODO

    getAnnotations = (bill, annotations) => {
        const match = annotations.bills.find(d => d.key === bill.identifier)
        if (match) console.log('Bill annotation found for', bill.identifier)
        return (match && match.annotation) || []
    }
    getMajorStatus = (bill, annotations) => {
        const match = annotations.bills.find(d => d.key === bill.identifier)
        return (match && match.isMajorBill) || 'no'
    }

    getActions = (bill) => {
        return bill.actions.map(d => {
            return {
                date: d.date,
                description: d.description,
                chamber: null, // TODO
                committee: null, // TODO
                vote: null, // TODO
                isMajor: true, // TODO - change
            }
        }).sort((a,b) => new Date(b.date) - new Date(a.date))
    }

    getArticles = (bill) => [] // TODO

    export() {
        return {
            key: this.billKey(),
            updateDate: this.updateDate,
            identifier: this.identifier,
            title: this.title,
            session: this.session,
            
            status: this.status,
            sponsor: this.sponsor,
            lawsUrl: this.lawsUrl,
            textUrl: this.textUrl,
            fiscalNoteUrl: this.fiscalNoteUrl,
            legalNoteUrl: this.legalNoteUrl,

            annotation: this.annotation,
            isMajorBill: this.isMajorBill,
            actions: this.actions,
            articles: this.articles,
        }
    }
}

module.exports = Bill