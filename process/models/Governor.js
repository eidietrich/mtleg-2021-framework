class Governor {
    constructor({annotations}) {
        this.data = {
            updateDate: annotations.updateDate,
            text: annotations.governor
        }
    }
    export = () => ({...this.data})

}

module.exports = Governor