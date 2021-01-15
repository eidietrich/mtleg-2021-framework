const fs = require('fs')
const fetch = require('node-fetch')

const TAG = "2021-legislature"
const QUERY_LIMIT = 100
const OUT_PATH = './scrapers/mtfp-articles/articles.json'

async function getStories(cursor) {
    const stories = fetch('https://montanafreepress.org/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query: `
            {
            posts(after: "${cursor}",first: ${QUERY_LIMIT}, where: {tag: "${TAG}"}) {
                pageInfo {
                    hasPreviousPage
                    hasNextPage
                    startCursor
                    endCursor
                }
                nodes {
                    title
                    date
                    link
                    status
                    tags {
                        nodes {
                        name
                        }
                    }
                    featuredImage {
                        node {
                        link
                        }
                    }
                    categories {
                        nodes {
                        name
                        }
                    }
                }
            }
        }
        `,
        }),
    })
        .then(res => res.json())
        .then(res => res.data)
        .catch(err => console.log(err))

    return stories
}

function writeFile(data, path) {
    const json = JSON.stringify(data, null, 2)
    fs.writeFile(path, json, 'utf8', () => console.log(`Written to ${path}`));
}

async function main() {
    let stories = []
    let hasNextPage = true
    let cursor = ""
    while (hasNextPage) {
        const query = await getStories(cursor)
        stories = stories.concat(query.posts.nodes)
        cursor = query.posts.pageInfo.endCursor
        hasNextPage = query.posts.pageInfo.hasNextPage
    }
    console.log(`Found ${stories.length} MTFP stories tagged ${TAG}`)
    writeFile(stories, OUT_PATH)
}
main()