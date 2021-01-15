const governorName = 'Greg Gianforte'

class Governor {
    constructor({annotations, articles}) {
        this.data = {
            updateDate: annotations.updateDate,
            text: annotations.governor,
            articles: this.getArticles(articles)
        }
    }

    getArticles = (articles) => {
        const articlesAboutGovernor = articles.filter(article => article.data.governorTags.includes(governorName)).map(d => d.export())
        // if (articlesAboutGovernor.length > 0) console.log(governorName, articlesAboutGovernor.length)
        return articlesAboutGovernor
    }
    

    export = () => ({...this.data})

}

module.exports = Governor