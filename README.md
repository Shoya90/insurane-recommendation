# insurance-recommendation


### How to run the application
To run the application, navigate to root directory of the app and run:
```
    npm i
    npm run start
```

&nbsp;

That will start the server on port `3000` by default. to run on a different port run
```
    PORT=<port_number> npm run start
```

--- 
&nbsp;

### How to run unit tests
In the root directory run:
```
    npm run test
```

---    
&nbsp;

### Making requests with Postman
A Postman collection is included under `/postman`. you can import it on Postman by going to `Collections > import`. \
After starting the server, make these requests the get the recommendations:
1. **Register**: this returns a magic link. you need to pass in the `email`
2. **Get access token from magic link**: Click on the magic link that'll open in a new tab. the response will include the `accessToken`. Copy the `accessToken` 
3. **Put user questionnaire**: Next will be sending in the user questionnaire, make sure you paste the `accessToken` under the `Authorization > token`. The type is pre-selected to `Bearer Token`
4. **Get user recommendations**: Finally you can get the recommendations. Again the endpoint expects the `accessToken` to be in the headers, same as step 3.
