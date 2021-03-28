module.exports.checkArticleMatches = (bills, articles) => {
    // console.log('b', bills.find(d => d.data.articles.length > 1).data.articles)

    // TODO - figure out how to verify matches to bills are happening effectively

    const allLawmakerTagsRaw = articles.map(d => d.data.lawmakerTags).flat()
    const lawmakerCounts = Array.from(new Set(allLawmakerTagsRaw)).map(tag => {
        return {
            tag,
            rawCount: allLawmakerTagsRaw.filter(d => d === tag).length,
        }
    }).sort((a, b) => b.rawCount - a.rawCount)
    console.log('## Lawmakers in coverage')
    console.table(lawmakerCounts)

    const allBillTagsRaw = articles.map(d => d.data.billTags).flat()
    const billCounts = Array.from(new Set(allBillTagsRaw)).map(tag => {
        return {
            tag,
            rawCount: allBillTagsRaw.filter(d => d === tag).length,
        }
    }).sort((a, b) => b.rawCount - a.rawCount)
    console.log('## Bills in coverage')
    console.table(billCounts)

    // // log stories 
    // articles.forEach(article => {
    //     console.log({
    //         title: article.data.title,
    //         url: article.data.link,
    //         tags: article.data.tags,
    //         bills: article.data.billTags,
    //         lawmakers: article.data.lawmakerTags,
    //         governors: article.data.governorTags
    //     })
    // })

}