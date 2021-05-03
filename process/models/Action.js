
const {
    ACTIONS,
} = require('../config.js')

class Action {
    constructor({ action, votes }) {
        // This mess is necessary b/c we're using a hack to pull additional action info
        // through the openstates scraper w/out modifing the action schema
        const descriptionItems = action.description.split('|')

        const voteUrl = descriptionItems[2] || null

        let watchListenUrls = []
        if (descriptionItems.length > 3) {
            const hearingUrls = descriptionItems.slice(3)
            watchListenUrls = hearingUrls.filter(s => !s.includes('laws.leg.mt.gov')) // Excludes committee hearing page link
        }

        const chamber = this.determineChamber(action.organization_id)
        const committee = this.determineCommittee(descriptionItems, chamber)

        // console.log(action.classification[0])

        const matchingVote = votes.find(d => d.data.voteUrl === voteUrl)

        this.data = {
            date: action.date,
            description: descriptionItems[0],
            committee: committee,
            chamber: chamber,
            classification: action.classification[0] || null,
            vote: (matchingVote && matchingVote.export()) || null,
            voteUrl,
            watchListenUrls,
            // Flags
            ...this.getActionFlags(descriptionItems[0])
        }

        if (this.data.doLog) {
            console.log(this.data)
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

    determineCommittee = (descriptionItems, chamber) => {
        const description = descriptionItems[0]
        const rawCommittee = descriptionItems[1]
        // Manual override for governor related items
        // TODO - break this out to config
        if ([
            'Vetoed by Governor',
            'Transmitted to Governor',
            'Signed by Governor',
        ].includes(description)) return 'Governor\'s Office'

        if (description === 'Chapter Number Assigned') return 'Secretary of State'

        const committee = rawCommittee.replace('(H)', 'House').replace('(S)', 'Senate')
            || chamber.replace('House', 'House Floor').replace('Senate', 'Senate Floor')
        // console.log(committee)
        return committee
    }

    getActionFlags = (description) => {
        const match = ACTIONS.find(d => d.key === description)
        if (!match) console.log('Missing cat for bill action', description)
        return { ...match }
    }

    export = () => ({ ...this.data })

}

module.exports = Action