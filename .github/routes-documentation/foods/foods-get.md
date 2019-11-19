**Provider**
----
  _Creating a provider._

* **URL**

  _/providers/_

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
    **Content:** `{ "id" : 1, "name": "Laura Beatris Developer",  "email": "laurigdm@gmail.com"}`
 
* **Error Response:**

  * **Code:** 404 NOT FOUND <br />
    **Content:** `{ err : "It's not possible to create a food without pass the restaurant id." }`
  
  * **Code:** 401 NOT FOUND <br />
    **Content:** `{ err : "This restaurant already have that food registed." }`


