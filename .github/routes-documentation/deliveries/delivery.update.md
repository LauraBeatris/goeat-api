**Delivery**
----
  _Creating a delivery information._

* **URL**

  _/deliveries/:order-id_

* **Method:**
  
  _POST_

* **Data Params**

  ` 
    {
      "status": "Delivered succesfully",
      "message": "Thanks for choosing our restaurant :)"
    }
  `

* **Success Response:**
  
  * **Code:** 200 <br />
    **Content:**  `{
                    "message": "Delivered succesfully",
                    "status": "Thanks for choosing our restaurant :)",
                    "order": {
                      "cancelable": true,
                      "id": 46,
                      "date": "2020-12-24T02:00:00.000Z",
                      "created_at": "2019-11-23T16:56:27.901Z",
                      "updated_at": "2019-11-23T16:56:27.901Z",
                      "user": {
                        "id": 1,
                        "name": "Laura Beatris Developer",
                        "email": "laurigdm@gmail.com",
                        "avatar": {
                          "url": https://go-eat-profiles.s3.amazonaws.com/Screenshot%20from%202019-11-12%2011-16-09-1574524083122.png
                        }
                      },
                      "restaurant": {
                        "id": 1,
                        "name": "Prime",
                        "avatar": {
                          "url": https://go-eat-profiles.s3.amazonaws.com/Screenshot%20from%202019-11-12%2011-16-09-1574524083122.png
                        }
                      },
                      "food": {
                        "id": 2,
                        "name": "Vegeterian Salad 2",
                        "price": 24,
                        "type": "Salad",
                        "avatar": {
                          "url": https://go-eat-profiles.s3.amazonaws.com/Screenshot%20from%202019-11-12%2011-16-09-1574524083122.png
                        }
                      }
                    }
                  }`
              
* **Error Response:**

  * **Code:** 404 NOT FOUND <br />
    **Content:** `{ err : "Order not found" }`
  
  OR

  * **Code:** 401 UNAUTHORIZED <br />
    **Content:** `{ err : "Not allowed to update a finished delivery" }`

