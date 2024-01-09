const cron = require('node-cron')
const express = require('express')
const dotenv = require('dotenv')
dotenv.config()

const app = express()

authentication = /*async*/ (user, password, id, secret) =>  {
       const creds = {
        grant_type: "password",
        username: 'user',
        password: 'password',
        client_id: 'id',
        client_secret: 'secret'
    }
    app.post('https://auth.mangadex.org/realms/mangadex/protocol/openid-connect/token', (req, res) => {
        req = creds
        
    })
    .

    // const resp = await app({
    //     method: 'POST',
    //     url: `https://auth.mangadex.org/realms/mangadex/protocol/openid-connect/token`,
    //     data: creds
    // })

    // const { access_token, refresh_token } = res.data;
    // console.log(access_token, refresh_token)
}



app.listen(process.env.PORT, function() {
    console.log('Scheduler started on port ' + process.env.PORT)
    authentication(process.env.USERNAME, process.env.PASSWORD, process.env.CLIENT_ID, process.env.CLIENT_SECRET)
})