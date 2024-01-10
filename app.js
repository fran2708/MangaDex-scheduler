const cron = require('node-cron')
const express = require('express')
const axios = require('axios')
const dotenv = require('dotenv')
dotenv.config()
const commands = require('./support/commands.js')

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

cron.schedule('*/5 * * * * *', () => {
    // commands.getAllFollowedChapters(access_token)
    commands.getReadingMangaList(access_token)
})

cron.schedule('* */15 * * * *', () => {
    access_token = commands.refreshAccessToken(refresh_token, credentials.client_id, credentials.client_secret)
})


app.listen(process.env.PORT, function() {
    console.log('Scheduler started on port ' + process.env.PORT)
    authentication(credentials)

    // getAllCFollowedChapters(access_token)
})