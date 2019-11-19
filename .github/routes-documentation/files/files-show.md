**Files**
----
  _Showing an specific file._

* **URL**

  _/files/:file-id_

* **Method:**
  
  _GET_


* **Success Response:**
  
  * **Code:** 200 <br />
    **Content:**  
    `{
        "id": 1,
        "name": "Screenshot from 2019-11-12 11-16-09-1573951002547.png",
        "url": "https://go-eat-profiles.s3.amazonaws.com/Screenshot%20from%202019-11-12%2011-16-09-1573951002547.png"
      }`
                    
* **Error Response:**

  * **Code:** 400 BAD REQUEST <br />
    **Content:** `{ err : "File id not provided" }`

  OR

   * **Code:** 404 NOT FOUND <br />
    **Content:** `{ err : "File not found" }`
