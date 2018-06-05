var axios = require('axios');

//const API_URL = 'https://devfresh.bit-live.ru/base/adm/hs/serviceportalprivateapi'
const API_URL = 'https://online.accounting-software.ae/base/privateapi/hs/serviceportalprivateapi'

class Requests {
    constructor(app) {
        this.app = app
    } 
    
    setCredentials = (username, password) => {
        this.username = username;
        this.password = password;
    }

    login = async () => {
        console.log('Entered login: ' + this.username)
        
        let result, status
        try {
            result = await axios.get(
                API_URL + '/authenticate',
                {
                    auth: {
                        username: this.username,
                        password: this.password
                    },
                    validateStatus: function (status) {
                        return status >= 200;
                    }
                }
            )
            status = result.status
        } catch(e) {
            console.log('EXPC: ' + e)
        }
    
        
        console.log('Login status: ' + status)
        return status === 200
    }

    clientlookup = async (pattern) => {
        console.log('Entered clientlookup: ' + this.username)
        
        let result
        try {
            result = await axios.get(
                API_URL + '/clientlookup',
                {
                    auth: {
                        username: this.username,
                        password: this.password
                    },
                    validateStatus: function (status) {
                        return status >= 200;
                    },
                    params: {
                        pattern: pattern
                    }
                }
            )
        } catch(e) {
            console.log('EXPC: ' + e)
        }
    
        return result.data
    }  
    
    clientdbinfo = async (id) => {
        console.log('Entered clientdbinfo: ' + this.username)
        
        let result
    
        try {
            result = await axios.get(
                API_URL + '/clientdbinfo',
                {
                    auth: {
                        username: this.username,
                        password: this.password
                    },
                    validateStatus: function (status) {
                        return status >= 200;
                    },
                    params: {
                        id: id
                    }
                }
            )
        } catch(e) {
            console.log('EXPC: ' + e)
        }
    
        return result.data
    }    

    getaccess = async (id) => {
        console.log('Entered getaccess: ' + this.username)
        //MOCK
        //return true

        let result
    
        try {
            result = await axios.get(
                API_URL + '/getaccess',
                {
                    auth: {
                        username: this.username,
                        password: this.password
                    },
                    validateStatus: function (status) {
                        return status >= 200;
                    },
                    params: {
                        id: id
                    }
                }
            )
        } catch(e) {
            console.log('EXPC: ' + e)
        }
    
        return result.data.status === "ok"
    }

    getaccesswrapper = async(id, callback, reject) => {
        console.log('Entered getaccesswrapper: ' + this.username)
        let result = await this.getaccess(id)
        result ? setTimeout(callback, 20000) : reject()
    }


    gethistory = async () => {
        console.log('Entered gethistory: ' + this.username)

        let result;
    
        try {
            result = await axios.get(
                API_URL + '/accesshistory',
                {
                    auth: {
                        username: this.username,
                        password: this.password
                    },
                    validateStatus: function (status) {
                        return status >= 200;
                    }
                }
            )
        } catch(e) {
            console.log('EXPC: ' + e)
        }
    
        //MOCK
        //return {payload: [{link: "some url", clientName: "some name"}]}
        return result.data
    }

    gethistorywrapper = async () => {
        console.log('Entered gethistorywrapper: ' + this.username)

        let data = await this.gethistory()
        this.app.setState({historyData: Array.isArray(data['payload']) ? data['payload'] : []})
    }

}

export default Requests