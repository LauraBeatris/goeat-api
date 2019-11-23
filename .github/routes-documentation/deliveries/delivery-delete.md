**Delivery**
----
  _Creating a delivery information._

* **URL**

  _/deliveries/:delivery-id_

* **URL Params**
  `Delivery Id - /deliveries/1 

* **Method:**
  
  _DELETE_

* **Success Response:**
  
  * **Code:** 200 <br />
    **Content:**  `{
                   {
                      "msg": "The order 46 was finished at Sunday, 23 of November, 2019"
                    }`
              
* **Error Response:**

  * **Code:** 404 NOT FOUND <br />
    **Content:** `{ err : "Delivery not found" }`
