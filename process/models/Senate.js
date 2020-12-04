class Senate {
    constructor({annotations}) {
        this.data = {
            updateDate: annotations.updateDate,
            text: annotations.senate
        }
    }
    export = () => ({...this.data})

}

module.exports = Senate