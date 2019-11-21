**Provider**
----
  _Creating a provider._

* **URL**

  _/providers/_

* **Method:**
  
  _POST_

 
* **Error Response:**

  * **Code:** 404 NOT FOUND <br />
    **Content:** `{ err : "It's not possible to create a food without pass the restaurant id." }`
  
  * **Code:** 401 NOT FOUND <br />
    **Content:** `{ err : "This restaurant already have that food registed." }`


