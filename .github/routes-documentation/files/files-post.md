**File**
----
  _Creating a file._

* **URL**

  _/files/_

* **Method:**
  
  _POST_

* **Data Params**

  _Multipart Form: file_

* **Success Response:**
  
  * **Code:** 200 <br />
    **Content:**  
    `{
      "id": 1,
      "url": "https://go-eat-profiles.s3.amazonaws.com/Screenshot%20from%202019-11-12%2011-16-09-1574023132002.png"
    }`
              
* **Error Response:**

  * **Code:** 420 UNPROCESSABLE ENTITY <br />
    **Content:** `{ err : "Invalid data" }`

  OR

   * **Code:** 401 UNAUTHORIZED <br />
    **Content:** `{ err : "Already exists a file with that same name" }`
