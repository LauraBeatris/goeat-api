**Dashboard**
----
  _Opening a restaurant._

* **URL**

  _/dashboard/open/:restaurant-id_

*  **URL Params**

   * Restaurant id -> _dashboard/open/1_

* **Method:**
  
  _POST_


* **Success Response:**
  
  * **Code:** 200 <br />
    **Content:**  
    {
      "id": 3,
      "name": "Restaurant Example",
      "street_address": "Floripa",
      "number_address": "123",
      "city_address": "Floripa",
      "state_address": "Santa Catarina",
      "country_address": "Brazil",
      "description": null,
      "is_open": true,
      "createdAt": "2019-11-19T01:47:48.170Z",
      "updatedAt": "2019-11-19T11:14:38.063Z",
      "file_id": 1,
      "provider_id": 1
  }
              
* **Error Response:**

  * **Code:** 400 BAD REQUEST <br />
    **Content:** `{ err : "Restaurant id not provided" }`


