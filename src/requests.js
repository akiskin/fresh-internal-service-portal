var axios = require('axios');

const API_URL = 'https://devfresh.bit-live.ru/base/adm/hs/serviceportalprivateapi'

class Requests {
    
    setCredentials = (username, password) => {
        this.username = username;
        this.password = password;
    }

    login = async () => {

        console.log('Entred login')

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

    
    console.log('Login status: ' + status)
    return status === 200

}


export default Requests