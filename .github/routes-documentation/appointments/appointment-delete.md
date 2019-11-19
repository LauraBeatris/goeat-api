**Appointments**
----
  _Cancelling an appointment._

* **URL**

  _/appointments/:appointment-id_

* **Method:**
  
  _DELETE_

*  **URL Params**

   * Appointment id -> _appointments/1_

* **Success Response:**
  
  * **Code:** 200 <br />
    **Content:**  `{
  "past": false,
  "cancelable": true,
  "id": 4,
  "date": "2019-11-23T02:00:00.000Z",
  "canceled_at": "2019-11-18T22:31:22.085Z",
  "createdAt": "2019-11-18T22:31:10.380Z",
  "updatedAt": "2019-11-18T22:31:22.085Z",
  "user_id": 1,
  "restaurant_id": 1,
  "restaurant": {
    "id": 1,
    "name": "Prime",
    "street_address": "Floripa",
    "number_address": "123",
    "city_address": "Floripa",
    "state_address": "Santa Catarina",
    "country_address": "Brazil",
    "description": null,
    "is_open": false,
    "createdAt": "2019-11-18T20:52:19.925Z",
    "updatedAt": "2019-11-18T20:52:19.925Z",
    "file_id": 1,
    "provider_id": 1,
    "restaurant": {
      "id": 1,
      "name": "Laura Beatris",
      "email": "laurabeatriserafim@gmail.com"
    }
  },
  "user": {
    "id": 1,
    "name": "Laura Beatris Developer",
    "email": "laurigdm@gmail.com"
  }
}`
              
* **Error Response:**

   * **Code:** 401 UNAUTHORIZED <br />
    **Content:** `{ err : "It's not possible to cancel an appointment with passing an id" }`

  OR

   * **Code:** 401 UNAUTHORIZED <br />
    **Content:** `{ err : "You don't have permission to cancel this appointment" }`
  
   OR

   * **Code:** 401 UNAUTHORIZED <br />
    **Content:** `{ err : "You can only cancel appointments with 1 hour of advance" }`

  OR

  * **Code:** 404 NOT FOUND <br />
      **Content:** `{ err : "Appointment not found" }`
  
  OR

  * **Code:** 400 BAD REQUEST <br />
      **Content:** `{ err : "This appointment was already canceled" }`

