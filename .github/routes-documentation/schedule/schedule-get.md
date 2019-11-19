**Schedule**
----
  _Showing the schedule of the provider and his/her restaurant._

* **URL**

  _/schedules/:restaurant-id_

*  **URL Params**

   * Restaurant id -> _dashboard/open/1_

*  **Query Params**

   * Page - Offset of 20 items per page -> _dashboard/open/1?page=1_
   * Date - Will show the schedule of this date -> _dashboard/open/1?date=2019-11-22T23:00:00-03:00_

* **Method:**
  
  _GET_


* **Success Response:**
  
  * **Code:** 200 <br />
    **Content:**  

  {
    "appointments": [
      {
        "past": false,
        "id": 2,
        "date": "2019-11-23T02:00:00.000Z",
        "restaurant": {
          "id": 1,
          "name": "Prime",
          "street_address": "Floripa",
          "number_address": "123"
        },
        "user": {
          "id": 1,
          "name": "Laura Beatris Developer",
          "email": "laurigdm@gmail.com",
          "avatar": {
            "id": 1,
            "url": "https://go-eat-profiles.s3.amazonaws.com/Screenshot%20from%202019-11-12%2011-16-09-1574023132002.png"
          }
        }
      }
    ]
  }     

* **Error Response:**
  * **Code:** 404 NOT FOUND <br />
    **Content:** `{ err : "It's not possible to find a restaurant without pass the id" }`

  OR

  * **Code:** 404 NOT FOUND <br />
    **Content:** `{ err : "Restaurant id not provided" }`


