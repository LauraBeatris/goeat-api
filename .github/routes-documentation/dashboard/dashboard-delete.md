**Dashboard**
----
  _Closing a restaurant._

* **URL**

  _/dashboard/close/:restaurant-id_

*  **URL Params**

   * Restaurant id -> _dashboard/close/1_

* **Method:**
  
  _DELETE_


* **Success Response:**
  
  * **Code:** 200 <br />
    **Content:**  
   {
    "id": 1,
    "name": "Delicious Hamburgers",
    "street_address": "Random",
    "number_address": "123",
    "city_address": "Random",
    "state_address": "Random",
    "country_address": "",
    "description": null,
    "is_open": false,
    "createdAt": "2019-11-02T15:08:51.000Z",
    "updatedAt": "2019-11-07T01:18:32.797Z",
    "file_id": null,
    "provider_id": 1
}
              
* **Error Response:**

  * **Code:** 400 BAD REQUEST <br />
    **Content:** `{ err : "Restaurant id not provided" }`


