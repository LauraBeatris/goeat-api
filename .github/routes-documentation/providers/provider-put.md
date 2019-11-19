**Provider**
----
  _Updating the provider data. The id is passed by the auth middleware, so the provider needs to be authenticated to update his data._

* **URL**

  _/providers/_

* **Method:**
  
  _PUT_

* **Data Params**

  `{
	"name": "Laura",
	"email": "changed@gmail.com",
	"oldPassword": "123456",
	"password": "whatsupguys",
	"confirmPassword": "whatsupguys"
}
  `

* **Success Response:**
  
  * **Code:** 200 <br />
    **Content:** `{ "id" : 1, "name": "Laura", "email": "changed@gmail.com"}`
 
* **Error Response:**

  * **Code:** 401 UNAUTHORIZED <br />
    **Content:** `{ err : "Already exists a user using this email." }`

  OR

  * **Code:** 401 UNAUTHORIZED <br />
    **Content:** `{ err : "Password doesn't match" }`
