const axios = require('axios')
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
const defaultUrl = 'https://api.mangadex.org'

refreshAccessToken = async (refresh_token, client_id, client_secret) => {
    const creds = {
        grant_type: 'refresh_token',
        refresh_token: refresh_token,
        client_id: client_id,
        client_secret: client_secret
    }

    axios.post('https://auth.mangadex.org/realms/mangadex/protocol/openid-connect/token/auth/refresh', {
        params: {
            data: creds
        }
    })
    .then(function (response) {
        return response.data.access_token
    })
}

getReadingMangaList = async (sessionToken) => {
    axios.get(defaultUrl + '/manga/status', {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionToken}`
        },
        params: {
            'status': 'reading'
        }
    })
    .then(function (response) {
        console.log(Object.keys(response.data.statuses))
    })
}

getAllFollowedChapters = async (sessionToken) => {
    axios.get(defaultUrl + '/user/follows/manga/feed', {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionToken}`
        },
        params: {
            translatedLanguage: ['en'],
            updatedAtSince: '2024-01-08T20:00:00',
            order: {
                updatedAt: 'desc'
            }
        }
    })
    .then(function (response) {
        const dataArray = response.data.data
        let dataItems = dataArray.map(chapter => {
            return (console.log('New chapter: ' + chapter.attributes.chapter))
        })
    })
}


module.exports = { refreshAccessToken, getReadingMangaList, getAllFollowedChapters }