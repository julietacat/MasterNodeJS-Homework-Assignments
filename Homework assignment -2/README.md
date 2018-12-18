# Homework Assignment №2
***
Author: Julia Kraeva
***



#### Modify lib/config.js to 

* 'stripe_api_key': 'your api key','
* 'mailgun_api_key': 'your api key',
* 'mailgun_domain': 'your domain',
* 'validete_Email_recipient': 'recipient email'
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

``` http://localhost:3000/users?name=test&email=test@gmail.com```


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

``` http://localhost:3000/users?name=test&email=test@gmail.com ```

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

``` http://localhost:3000/tokens?id=vooaa92zbkgrrjb08824 ```


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

``` http://localhost:3000/users?name=test&email=test@gmail.com ```

***
