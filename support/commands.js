const axios = require('axios')
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

getAllFollowedChapters = async (sessionToken) => {
    axios.get('https://api.mangadex.org/user/follows/manga/feed', {
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

module.exports = { getAllFollowedChapters, refreshAccessToken }