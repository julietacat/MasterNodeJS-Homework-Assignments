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

* http://localhost:3000/users?name=test&email=test@gmail.com


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
```

```

