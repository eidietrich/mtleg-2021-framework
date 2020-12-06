class Action {
    constructor({action, votes}) {
        // This mess is necessary b/c we're using a hack to pull additional action info
        // through the openstates scraper w/out modifing the action schema
        const descriptionItems = action.description.split('|') 
        
        const voteUrl = descriptionItems[2] || null

        let watchListenUrls = []
        if (descriptionItems.length > 3) {
            const hearingUrls = descriptionItems.slice(3)
            watchListenUrls = hearingUrls.filter(s => !s.includes('laws.leg.mt.gov')) // Excludes committee hearing page link
        }

        this.data = {
            date: action.date,
            description: descriptionItems[0],
            committee: descriptionItems[1] || null, 
            chamber: this.determineChamber(action.organization_id),
            classification: action.classification[0] || null,
            vote: votes.find(d => d.voteUrl === voteUrl) || null,
            voteUrl,
            watchListenUrls,
            isMajor: true, //TODO - build function to classify things based on action description
        } 
    }

    determineChamber = (organization_id) => {
        // Converts openstates organization_id field to useful 'chamber' designation
        const chambers = {
            '~{"classification": "legislature"}': 'Staff',
            '~{"classification": "lower"}': 'House',
            '~{"classification": "upper"}': 'Senate',
        }
        return chambers[organization_id]
    }

    export = () => ({...this.data})

}

module.exports = Action