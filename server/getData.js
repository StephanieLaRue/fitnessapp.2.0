module.exports = {
    verifyAuth: () => {
        const query = new URLSearchParams(location.search)
        let token = query.get('key')
        let user = query.get('userName')

        if(token) {
            localStorage.setItem('key', JSON.stringify(data.token))  
            localStorage.setItem('userName', JSON.stringify(data.user))  
        }
        else {
            token = JSON.parse(localStorage.getItem('key')) 
            user = JSON.parse(localStorage.getItem('userName'))      
        }

        if(token) {
            const headers = new Headers({
            'x-access-token': token,
            'Content-Type': 'application/json'
            })

            const reqOpts = {
            method: 'post',
            headers: headers,
            body: JSON.stringify({user: user})
            }

            console.log(reqOpts);
            
            
            fetch('/authVerify', reqOpts)
            .then(res => res.text())
            .then(result => {

            })
            .catch(error => console.error('Error GETTING Data:', error))

        }
    }
}