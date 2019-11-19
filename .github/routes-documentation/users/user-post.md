**User**
----
  _Creating a user._

* **URL**

  _/users/_

* **Method:**
  
  _POST_

* **Data Params**

  `{
    "name": "Laura Beatris Developer",
    "email": "laurigdm@gmail.com",
    "password": "123456",
    "file_id": 1
  }
  `

* **Success Response:**
  
  * **Code:** 200 <br />
    **Content:** `{ "id" : 1, "name": "Laura Beatris Developer",  "email": "laurigdm@gmail.com", "file_id": 1}`
 
* **Error Response:**

  * **Code:** 400 BAD REQUEST <br />
    **Content:** `{ err : "User already exists." }`

  OR

  * **Code:** 404 NOT FOUND <br />
    **Content:** `{ err : "File with id 1 not exists" }`
