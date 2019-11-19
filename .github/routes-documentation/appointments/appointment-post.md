**Appointments**
----
  _Creating an appointment._

* **URL**

  _/appointments/_

* **Method:**
  
  _POST_

* **Data Params**

  ` 
  {
    "date": "2019-11-22T23:00:00-03:00",
    "restaurant_id": 1
  }
  `

* **Success Response:**
  
  * **Code:** 200 <br />
    **Content:**  `{
                    "past": false,
                    "cancelable": true,
                    "id": 4,
                    "date": "2019-11-23T02:00:00.000Z",
                    "user_id": 1,
                    "restaurant_id": 1,
                    "updatedAt": "2019-11-18T22:31:10.380Z",
                    "createdAt": "2019-11-18T22:31:10.380Z",
                    "canceled_at": null
                  }`
              
* **Error Response:**

  * **Code:** 404 NOT FOUND <br />
    **Content:** `{ err : "Restaurant not found" }`

  OR

  * **Code:** 404 NOT FOUND <br />
    **Content:** `{ err : "User not found" }`

  OR

   * **Code:** 401 UNAUTHORIZED <br />
    **Content:** `{ err : "It's not allowed to do appointments in past dates" }`

  OR

  * **Code:** 400 BAD REQUEST <br />
      **Content:** `{ err : "This date already was booked" }`
