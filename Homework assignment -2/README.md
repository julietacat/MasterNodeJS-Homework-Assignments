# Homework Assignment №2
***
Author: Julia Kraeva
***



#### Modify lib/config.js to 

* 'stripe_api_key': _your api key_,
* 'mailgun_api_key': _your api key_,
* 'mailgun_domain': _your domain_,
* 'validete_Email_recipient': _recipient email_

**Please put your data**
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
### MENU => GET
* token - must be included in request's header.
* ``` http://localhost:3000/menu?name=test&email=test@gmail.com  ```
***
### ORDERS => POST, GET, PUT, DELETE
##### POST
* token - must be included in request's header.
```
{   
        "name": "test",
        "email": "test@gmail.com",
        "password": "testpassword",
        "Appetizers": "Greek salad",
        "First_courses": "Borsch",
        "main_courses": "Boiled chicken breast",
        "Garnishes": "French fries"
}
```

##### GET
* token - must be included in request's header.
* ``` http://localhost:3000/orders?id=wg28ns4wea8xpkcid5ot ```

Response
```
{
    "id": "wg28ns4wea8xpkcid5ot",
    "name": "test",
    "email": "test@gmail.com",
    "address": "Moscow2",
    "order_summary": {
        "Greek salad": 12,
        "Borsch": 14,
        "Boiled chicken breast": 15,
        "French fries": 5
    },
    "total": 46,
    "has_payed": false
}
```

##### PUT
* token - must be included in request's header.
```
{   
        "id": "wg28ns4wea8xpkcid5ot",
        "Appetizers": "Russian salad",
        "First_courses": "Chicken soup",
        "main_courses": "Marbled beefsteak",
        "Garnishes": "Potatoes in a rural"
} 
```

##### DELETE
* token - must be included in request's header.
* ``` id=http://localhost:3000/orders?id=wg28ns4wea8xpkcid5ot ```

***
