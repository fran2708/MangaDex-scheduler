const cron = require('node-cron')
const express = require('express')
const axios = require('axios')
const dotenv = require('dotenv')
dotenv.config()

const app = express()
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

const credentials = {
    grant_type: "password",
    username: process.env.USER,
    password: process.env.PASSWORD,
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET
}

let access_token
let refresh_token

authentication = async (creds) =>  {
    const resp = await axios({
        method: 'POST',
        url: `https://auth.mangadex.org/realms/mangadex/protocol/openid-connect/token`,
        data: creds
    })
    
    access_token = resp.data.access_token
    refresh_token = resp.data.refresh_token
}

refreshAccessToken = async (refresh_token) => {

}

getAllCFollowedChapters = async (sessionToken) => {
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

cron.schedule('*/5 * * * * *', () => {
    getAllCFollowedChapters(access_token)
})

cron.schedule('* */15 * * * *', () => {
    refreshAccessToken(refresh_token)
})


app.listen(process.env.PORT, function() {
    console.log('Scheduler started on port ' + process.env.PORT)
    authentication(credentials)

    // getAllCFollowedChapters(access_token)
})