**Food**
----
  _Listing the menu of a restaurant._

* **URL**

  _/foods/:restaurant-id_

* **Method:**
  
  _GET_

* **URL Params**
  `Restaurant Id - /foods/1 

* **Success Response:**
  
  * **Code:** 200 <br />
    **Content:** `{
                    "id": 1,
                    "name": "Vegeterian Salad",
                    "price": 24,
                    "file_id": 1,
                    "description": "A description",
                    "type": "Salad",
                  }`
 
* **Error Response:**

  * **Code:** 404 NOT FOUND <br />
    **Content:** `{ err : "It's not possible to create a food without pass the restaurant id." }`
  
  * **Code:** 401 NOT FOUND <br />
    **Content:** `{ err : "This restaurant already have that food registed." }`


