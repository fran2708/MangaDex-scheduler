const cron = require('node-cron')
const axios = require('axios')
const dotenv = require('dotenv')
dotenv.config()
require('./support/commands.js')

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

let tokens = []

cron.schedule('*/5 * * * * *', async () => {
    await getReadingMangaList(tokens[0])
    await getReadMarkers(tokens[0], mangaID)
})

cron.schedule('* */15 * * * *', () => {
    tokens[0] = refreshAccessToken(tokens[1])
})

start = async () => {
    tokens = await authentication()
}
start()