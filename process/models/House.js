class House {
    constructor({annotations}) {
        this.data = {
            updateDate: annotations.updateDate,
            text: annotations.house
        }
    }
    export = () => ({...this.data})

}

module.exports = House