**Session**
----
  _Creating a session._

* **URL**

  _/sessions/_

* **Method:**
  
  _POST_

* **Data Params**

  `{ 
	"email": "laurigdm@gmail.com",
	"password": "123456"
}
  `

* **Success Response:**
  
  * **Code:** 200 <br />
    **Content:**  `{ "user": {
                      "id": 1,
                      "name": "Laura Beatris Developer",
                      "email": "laurigdm@gmail.com"
                    },
                    "token": "eyJhbGciOiJIUzxxxxxxxkpXVCJ9.eyJpZCI6MSwiaWF0IjoxxTExMTQ0LCJleHAiOjE1NzQ3MTU5NDR9.EAgkvF5_u6QKuxPml0afBUGKVKYGw1Tk6J20Pm18YiE"
                    }`
              
* **Error Response:**

  * **Code:** 404 NOT FOUND <br />
    **Content:** `{ err : "Provider/User not found" }`

  OR

   * **Code:** 401 UNAUTHORIZED <br />
    **Content:** `{ err : "Password doesn't match" }`
