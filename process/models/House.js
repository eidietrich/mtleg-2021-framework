class House {
    constructor({ annotations, committees }) {
        this.data = {
            updateDate: annotations.updateDate,
            text: annotations.house,
            committees: committees.map(c => ({
                // select fields only  to manage data size
                name: c.data.name,
                key: c.data.key,
                chamber: c.data.chamber,
                members: c.data.members,
                overview: c.data.overview,
            })),
        }
    }
    export = () => ({ ...this.data })

}

module.exports = House