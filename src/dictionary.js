class Dictionary {
    constructor(lang) {
        this.language = lang
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

export default Dictionary