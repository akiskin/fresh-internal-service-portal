var axios = require('axios');

const API_URL = 'https://devfresh.bit-live.ru/base/adm/hs/serviceportalprivateapi'
//const API_URL = 'https://online.accounting-software.ae/base/privateapi/hs/serviceportalprivateapi'

class Requests {
    constructor(app) {
        this.app = app
    } 
    
    setCredentials = (username, password) => {
        this.username = username;
        this.password = password;
    }

    get = async (resource, params = {}) => {
        let result
    
        try {
            result = await axios.get(
                API_URL + resource,
                {
                    auth: {
                        username: this.username,
                        password: this.password
                    },
                    validateStatus: function (status) {
                        return status >= 200;
                    },
                    params: params
                }
            )
        } catch(e) {
            console.log('EXPC: ' + e)
            result = false
        }

        return result
    }

    login = async () => {
        let result = await this.get('/authenticate')
        return result ? result.status === 200 : false
    }

    clientlookup = async (pattern) => {
        let result = await this.get('/clientlookup', {pattern: pattern})
        return result ? result.data : false
    }  
    
    clientdbinfo = async (id) => {
        let result = await this.get('/clientdbinfo', {id: id})
        return result ? result.data : false
    }    

    getaccess = async (id) => {
        let result = await this.get('/getaccess', {id: id})
        return result ? result.data.status === "ok" : false
    }

    getaccesswrapper = async(id, callback, reject) => {
        console.log('Entered getaccesswrapper: ' + this.username)
        let result = await this.getaccess(id)
        result ? setTimeout(callback, 20000) : reject()
    }


    gethistory = async () => {
        let result = await this.get('/accesshistory')
        return result ? result.data : false
        //return {payload: [{link: "some url", clientName: "some name"}]}
    }

    gethistorywrapper = async () => {
        console.log('Entered gethistorywrapper: ' + this.username)

        let data = await this.gethistory()
        if (data) {
            this.app.setState({historyData: Array.isArray(data['payload']) ? data['payload'] : []})
        }
    }


    accessExpiryDateString = (date) => {
        console.log('Got date: ' + date)
        if (date === '') {
            return 'Non-expiring'
        } else {
            return 'Access till: ' + (new Date(date)).toLocaleDateString('en-GB', {hour: '2-digit', minute: '2-digit'})
        }
    }

}

export default Requests