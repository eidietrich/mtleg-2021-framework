const {
    getCanonicalLawmakerNames,
} = require('../functions.js')

// TODO - think through whether this is the right approach
const lawmakerTagNames = getCanonicalLawmakerNames()

const govTagTest = tag => tag.match(/(Greg Gianforte|Steve Bullock)/)
const billTagTest = tag => tag.match(/(House|Senate|Joint) (Bill|Resolution) [0-9]{1,4}/)
const lawmakerTagTest = tag => lawmakerTagNames.includes(tag)

const cleanBillTags = tag => tag.replace('House ', 'H').replace('Senate ', 'S').replace('Joint', 'J')
    .replace('Bill', 'B').replace('Resolution', 'R')

class Article {
    constructor({ article }) {
        this.tags = article.tags.nodes.map(d => d.name)
        this.data = {
            title: article.title,
            subtitle: this.parseExcerpt(article.excerpt),
            date: new Date(article.date),
            link: article.link,
            // status: article.status,
            tags: this.tags,
            author: article.author.node.name,
            // categories: article.categories.nodes.map(d => d.name),
            imageUrl: article.featuredImage && article.featuredImage.node.link,
        }
        this.parseTags()
        // console.log(this.data)
    }

    parseTags = () => {
        const billTags = this.tags.filter(billTagTest).map(cleanBillTags)

        const lawmakerTags = this.tags.filter(lawmakerTagTest)
        const governorTags = this.tags.filter(govTagTest)

        this.data.billTags = billTags
        this.data.lawmakerTags = lawmakerTags
        this.data.governorTags = governorTags
    }

    parseExcerpt = (excerptText) => {
        // assumes excerpt == subtitle
        // TODO - write code that strips junk from excerpt
        return ''
    }

    export = () => ({ ...this.data })


}

module.exports = Article