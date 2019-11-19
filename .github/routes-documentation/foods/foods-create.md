**Foods**
----
  _Creating a food._

* **URL**

  _/foods/:restaurant-id_

*  **URL Params**

   * Restaurant id -> _dashboard/open/1_

* **Method:**
  
  _POST_

* **Data Params**

  `{
    "name": "Vegeterian Salad",
    "price": 24.00, 
    "file_id": 1,
    "description": "A description",
    "type": "Salad"
  }
  `

* **Success Response:**
  
  * **Code:** 200 <br />
    **Content:**  
    {
      "id": 1,
      "name": "Vegeterian Salad",
      "price": 24,
      "file_id": 1,
      "description": "A description",
      "type": "Salad",
      "updatedAt": "2019-11-12T22:07:18.565Z",
      "createdAt": "2019-11-12T22:07:18.565Z"
    } 
              
* **Error Response:**

  * **Code:** 404 NOT FOUND <br />
    **Content:** `{ err : "Restaurant not found" }`

  * **Code:** 401 UNAUTHORIZED <br />
    **Content:** `{ err : "This restaurant already have that food registed" }`


