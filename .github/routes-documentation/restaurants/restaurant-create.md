**Restaurant**
----
  _Creating a restaurant._

* **URL**

  _/restaurants/_

* **Method:**
  
  _POST_

* **Data Params**

  `{
	"name": "Prime",
	"street_address": "Floripa",
	"number_address": 123,
	"city_address": "Floripa",
	"state_address": "Santa Catarina",
	"country_address": "Brazil",
	"is_closed": false,
	"file_id": 1
}
  `

* **Success Response:**
  
  * **Code:** 200 <br />
    **Content:**  `{
                    "id": 1,
                    "name": "Restaurant Example",
                    "street_address": "Floripa",
                    "number_address": "123",
                    "city_address": "Floripa",
                    "state_address": "Santa Catarina",
                    "country_address": "Brazil",
                    "file_id": 1,
                    "provider_id": 1,
                    "updatedAt": "2019-11-19T01:47:48.170Z",
                    "createdAt": "2019-11-19T01:47:48.170Z",
                    "description": null,
                    "is_open": false
                  }`
              
* **Error Response:**

  * **Code:** 400 BAD REQUEST <br />
    **Content:** `{ err : "A restaurant with that name already exists" }`

  OR

   * **Code:** 404 NOT FOUND <br />
    **Content:** `{ err : "The provider was not found" }`
