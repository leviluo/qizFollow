var fetchDate=(url,body)=>{

	if (body) {
		var method = 'POST'
	}else{
		var method = 'GET'
	}

	var config = {
		method: method,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        }
	}

	if (localStorage.getItem('id_token')) {
		config.headers = { 'Authorization': `${localStorage.getItem('id_token')}` }
	};

	config.body = body
	
	return fetch(url,config)
}

export default fetchDate