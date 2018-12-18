# Homework Assignment №2
***
Author: Julia Kraeva
***



#### Modify lib/config.js to 

* 'stripe_api_key': _'your api key'_,
* 'mailgun_api_key': _'your api key'_,
* 'mailgun_domain': _'your domain'_,
* 'validete_Email_recipient': _'recipient email'_
***


#### USERS => POST, GET, PUT, DELETE

##### POST
```
{
        "name": "test",
        "email": "test@gmail.com",
        "password": "testpassword",
        "address": "Moscow",
        "currency": "eur/usd",
        "creditCard": "visa/mastercard/amex"
}
```

##### GET

* token - must be included in request's header.

* ``` http://localhost:3000/users?name=test&email=test@gmail.com```


##### PUT

* token - must be included in request's header.
```
{
    "name": "test",
    "email": "test@gmail.com",
    "address": "Moscow2"
}
```

##### DELETE

* token - must be included in request's header.

* ``` http://localhost:3000/users?name=test&email=test@gmail.com ```

***


### TOKENS => POST, GET, PUT, DELETE

##### POST
```
{
        "password": "testpassword",
        "name": "test",
        "email": "test@gmail.com"
}
```
Response
```
{
    "name": "test",
    "id": "vooaa92zbkgrrjb08824",
    "expires": 1545119717274
}
```

##### GET

* ``` http://localhost:3000/tokens?id=vooaa92zbkgrrjb08824 ```

Response
```
{
    "name": "test",
    "id": "vooaa92zbkgrrjb08824",
    "expires": 1545119717274
}
```

##### PUT

```
{
    "id": "vooaa92zbkgrrjb08824",
    "extend": true
}
```

##### DELETE

* ``` http://localhost:3000/tokens?id=vooaa92zbkgrrjb08824 ```

***
