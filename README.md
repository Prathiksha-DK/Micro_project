**Shipment Management Form using JsonPowerDB**

---

# Description

The Shipment Management Form is a web application developed using HTML, Bootstrap 5, JavaScript, jQuery, and JsonPowerDB.

It allows users to store, retrieve, and update shipment information using Shipment Number as the Primary Key.

---

# Benefits of JsonPowerDB

* Simple and easy to use.
* High-performance NoSQL database.
* Schema-free JSON storage.
* Fast CRUD operations.
* REST API based database.
* Reduces backend development effort.

---

# Scope of Functionalities

* Add new shipment records.
* Search shipment records using Shipment Number.
* Update existing shipment details.
* Reset form data.
* Validate user input before saving.

---

# Database Structure

**Database Name:** DELIVERY-DB

**Relation Name:** SHIPMENT-TABLE

**Primary Key:** Shipment-No

### Fields

* Shipment-No
* Description
* Source
* Destination
* Shipping-Date
* Expected-Delivery-Date

---

# Illustrations

### Initial State

* Only Shipment Number field enabled.
* All other fields and buttons disabled.

### New Record

* User can enter shipment details and save.

### Existing Record

* Data is fetched automatically.
* User can update shipment details.

---

# Examples of Use

### Sample Record

```json
{
  "Shipment-No": "SH001",
  "Description": "Electronics",
  "Source": "Chennai",
  "Destination": "Coimbatore",
  "Shipping-Date": "2026-06-10",
  "Expected-Delivery-Date": "2026-06-12"
}
```

---

# Technologies Used

* HTML5
* Bootstrap 5
* JavaScript
* jQuery
* JsonPowerDB



# Project Status

✅ Completed

Version: 1.0

---

# Release History

### Version 1.0 (June 2026)

* Created Shipment Management Form.
* Integrated JsonPowerDB.
* Implemented Save, Update, and Reset functionalities.
* Added form validation.
* Published project on GitHub.

---

# Sources

* JsonPowerDB Documentation: https://login2explore.com/jpdb/docs.html
* Bootstrap Documentation: https://getbootstrap.com
* jQuery Documentation: https://jquery.com

---

# Other Information

The application follows the Login2Xplore micro-project workflow where Shipment Number acts as the primary key and controls Save/Update operations.


