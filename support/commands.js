const axios = require('axios')
const dotenv = require('dotenv')
dotenv.config()
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
const defaultUrl = 'https://api.mangadex.org'

/**
 * @function authentication
 * Logs in with the data specified on the .env file and returns both the access and refresh tokens
 * It's an async function
 * @returns {array} Returns an array with both tokens, 0 is the access and 1 is the refresh
 */
authentication = async () =>  {
    try {
        const creds = {
            grant_type: "password",
            username: process.env.USER,
            password: process.env.PASSWORD,
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET
        }
        const resp = await axios({
            method: 'POST',
            url: `https://auth.mangadex.org/realms/mangadex/protocol/openid-connect/token`,
            data: creds
        })
        let tokens = []
        tokens[0] = resp.data.access_token
        tokens[1] = resp.data.refresh_token
        console.log('Login successful')
        return tokens
    }
    catch (err) {
        console.error('Login failed:', err.message)
    }
}

/**
 * @function refreshAccessToken
 * Refreshes the access token
 * @params {string} refresh_token The refresh token, stored on tokens[1]
 * @function
 */
refreshAccessToken = async (refresh_token) => {
    const creds = {
        grant_type: 'refresh_token',
        refresh_token: refresh_token,
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET
    }

    await axios.post('https://auth.mangadex.org/realms/mangadex/protocol/openid-connect/token/auth/refresh', {
        params: {
            data: creds
        }
    })
    .then(function (response) {
        return response.data.access_token
    })
    .catch(err => {
        console.error('Refreshing token failed: ' + err.message)
    })
}

/**
 * @function getReadingMangaList
 * this function returns a list of mangaIDs that the user is currently reading
 * @param {string} sessionToken the access token of the user, stored on tokens[0]
 * @returns {object} a list of mangaIDs that the user is currently reading
 */
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
    await axios.get(defaultUrl + '/user/follows/manga/feed', {
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

getReadMarkers = async (sessionToken, mangaID) => {
    try {
        const resp = await axios.get(defaultUrl + `/manga/${mangaID}/read`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionToken}`
            }
        })
        console.log(resp.data)
    }
    catch (error) {
        console.error('Failed to get markers:', error.message)
    }

}


module.exports = { authentication, refreshAccessToken, getReadingMangaList, getAllFollowedChapters, getReadMarkers }