var axios = require('axios');

const API_URL = 'https://devfresh.bit-live.ru/base/adm/hs/serviceportalprivateapi'

class Requests {
    
    setCredentials = (username, password) => {
        this.username = username;
        this.password = password;
    }

    login = async () => {

        console.log('Entered login: ' + this.username)
        

        let result, status;
    
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
        

        let result, status;
    
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
            status = result.status
        } catch(e) {
            console.log('EXPC: ' + e)
        }
    
        return result.data

    }  
    
    clientdbinfo = async (id) => {

        console.log('Entered clientdbinfo: ' + this.username)
        

        let result, status;
    
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
            status = result.status
        } catch(e) {
            console.log('EXPC: ' + e)
        }
    
        return result.data

    }    

    getaccess = async (id) => {

        console.log('Entered getaccess: ' + this.username)
        

        let result, status;
    
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
            status = result.status
        } catch(e) {
            console.log('EXPC: ' + e)
        }
    
        return result.data.status === "ok"

    }

}

export async function login(username, password) {

    console.log('Entred login')

    let result, status;

    try {
        result = await axios.get(
            API_URL + '/authenticate',
            {
                auth: {
                    username: username,
                    password: password
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

    return status === 200

}


export default Requests