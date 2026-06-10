/**
 * Project Name: Shipment Management Form
 * Database Name: DELIVERY-DB
 * Relation Name: SHIPMENT-TABLE
 * Technology: HTML5, Bootstrap 5, JavaScript, jQuery, JsonPowerDB (JPDB)
 */

// ==========================================
// 1. JSONPOWERDB CONFIGURATION CONSTANTS
// ==========================================
var connToken = "90935190|-31949239796102122|90958766";
var dbName = "DELIVERY-DB";
var relName = "SHIPMENT-TABLE";
var baseUrl = "http://api.login2explore.com:5577";

// Global variable to store record number of existing shipment
let saveRecNo = "";

// ==========================================
// 2. INITIALIZATION / PAGE LOAD
// ==========================================
$(document).ready(function () {
    resetForm();
});

/**
 * Resets the form to its initial state.
 * Enables Shipment-No, disables all other fields, disables buttons, and focuses Shipment-No.
 */
function resetForm() {
    // Clear all fields
    $("#shipmentNo").val("");
    $("#description").val("");
    $("#source").val("");
    $("#destination").val("");
    $("#shippingDate").val("");
    $("#expectedDeliveryDate").val("");

    // Enable Shipment-No, disable remaining fields
    $("#shipmentNo").prop("disabled", false);
    $("#description").prop("disabled", true);
    $("#source").prop("disabled", true);
    $("#destination").prop("disabled", true);
    $("#shippingDate").prop("disabled", true);
    $("#expectedDeliveryDate").prop("disabled", true);

    // Disable all control buttons
    $("#btnSave").prop("disabled", true);
    $("#btnUpdate").prop("disabled", true);
    $("#btnReset").prop("disabled", true);

    // Remove any Bootstrap validation styles
    $("#shipmentForm").removeClass("was-validated");
    $(".form-control, textarea").removeClass("is-invalid is-valid");

    // Automatically focus the primary key input cursor
    $("#shipmentNo").focus();
    saveRecNo = "";
}

// ==========================================
// 3. UTILITY / NOTIFICATION FUNCTIONS
// ==========================================
/**
 * Displays a Bootstrap alert at the top right of the page.
 * @param {string} message - The text message to display.
 * @param {string} type - Bootstrap alert type (e.g. 'success', 'danger', 'warning').
 */
function showAlert(message, type = "success") {
    const icon = type === "success" 
        ? '<i class="fa-solid fa-circle-check"></i>' 
        : '<i class="fa-solid fa-triangle-exclamation"></i>';

    const alertHtml = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${icon}
            <div>${message}</div>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
    $("#alertContainer").append(alertHtml);

    // Auto dismiss after 4 seconds
    setTimeout(() => {
        $(".alert").first().alert("close");
    }, 4000);
}

// ==========================================
// 4. VALIDATION LOGIC
// ==========================================
/**
 * Validates the form fields based on rules:
 * - All fields mandatory.
 * - Non-empty, no whitespace-only values.
 * - Expected Delivery Date must be after or equal to Shipping Date.
 * @returns {boolean} True if form is valid, false otherwise.
 */
function validateData() {
    let isValid = true;

    // Reset styles
    $(".form-control, textarea").removeClass("is-invalid is-valid");

    const shipmentNo = $("#shipmentNo").val().trim();
    const description = $("#description").val().trim();
    const source = $("#source").val().trim();
    const destination = $("#destination").val().trim();
    const shippingDateStr = $("#shippingDate").val();
    const expectedDeliveryDateStr = $("#expectedDeliveryDate").val();

    // 1. Shipment-No validation
    if (shipmentNo === "") {
        $("#shipmentNo").addClass("is-invalid");
        isValid = false;
    } else {
        $("#shipmentNo").addClass("is-valid");
    }

    // 2. Description validation
    if (description === "") {
        $("#description").addClass("is-invalid");
        isValid = false;
    } else {
        $("#description").addClass("is-valid");
    }

    // 3. Source validation
    if (source === "") {
        $("#source").addClass("is-invalid");
        isValid = false;
    } else {
        $("#source").addClass("is-valid");
    }

    // 4. Destination validation
    if (destination === "") {
        $("#destination").addClass("is-invalid");
        isValid = false;
    } else {
        $("#destination").addClass("is-valid");
    }

    // 5. Shipping Date validation
    if (shippingDateStr === "") {
        $("#shippingDate").addClass("is-invalid");
        isValid = false;
    } else {
        $("#shippingDate").addClass("is-valid");
    }

    // 6. Expected Delivery Date validation
    if (expectedDeliveryDateStr === "") {
        $("#expectedDeliveryDate").addClass("is-invalid");
        isValid = false;
    } else {
        $("#expectedDeliveryDate").addClass("is-valid");
    }

    // 7. Date Relation Validation (Expected Delivery Date >= Shipping Date)
    if (shippingDateStr !== "" && expectedDeliveryDateStr !== "") {
        const shipDate = new Date(shippingDateStr);
        const delivDate = new Date(expectedDeliveryDateStr);
        // Clear times to compare just the calendar dates
        shipDate.setHours(0, 0, 0, 0);
        delivDate.setHours(0, 0, 0, 0);

        if (delivDate < shipDate) {
            $("#expectedDeliveryDate").removeClass("is-valid").addClass("is-invalid");
            showAlert("Expected Delivery Date must be on or after the Shipping Date.", "danger");
            isValid = false;
        }
    }

    return isValid;
}

// ==========================================
// 5. PRIMARY KEY CHECK / DATABASE RETRIEVAL
// ==========================================
/**
 * Triggered when Shipment-No input loses focus.
 * Queries JsonPowerDB to verify if Shipment-No exists.
 */
$("#shipmentNo").blur(function () {
    checkShipmentNo();
});

function checkShipmentNo() {
    const shipmentNoVal = $("#shipmentNo").val().trim();
    if (shipmentNoVal === "") {
        return;
    }

    // Create GET_BY_KEY request JSON string
    const jsonStr = JSON.stringify({
        "Shipment-No": shipmentNoVal
    });

    const getRequest = createGET_BY_KEYRequest(connToken, dbName, relName, jsonStr);

    jQuery.ajaxSetup({ async: false });
    const result = executeCommandAtGivenBaseUrl(getRequest, baseUrl, "/api/irl");

console.log("RAW RESULT:");
console.log(result);

const resJsonObj = result;

console.log("PARSED RESULT:");
console.log(resJsonObj);
    jQuery.ajaxSetup({ async: true });

    // CASE A: Shipment-No DOES NOT exist (JPDB returns 400 for key not found)
    if (resJsonObj.status === 400) {
        // Enable fields
        $("#description").prop("disabled", false);
        $("#source").prop("disabled", false);
        $("#destination").prop("disabled", false);
        $("#shippingDate").prop("disabled", false);
        $("#expectedDeliveryDate").prop("disabled", false);

        // Configure buttons
        $("#btnSave").prop("disabled", false);
        $("#btnReset").prop("disabled", false);
        $("#btnUpdate").prop("disabled", true);

        // Focus next field
        $("#description").focus();
    }
    // CASE B: Shipment-No EXISTS (JPDB returns 200)
    else if (resJsonObj.status === 200) {
        // Disable primary key input
        $("#shipmentNo").prop("disabled", true);

        // Populate fields
        const data = JSON.parse(resJsonObj.data).record;
        $("#description").val(data["Description"]);
        $("#source").val(data["Source"]);
        $("#destination").val(data["Destination"]);
        $("#shippingDate").val(data["Shipping-Date"]);
        $("#expectedDeliveryDate").val(data["Expected-Delivery-Date"]);

        // Enable other fields so user can update them if needed
        $("#description").prop("disabled", false);
        $("#source").prop("disabled", false);
        $("#destination").prop("disabled", false);
        $("#shippingDate").prop("disabled", false);
        $("#expectedDeliveryDate").prop("disabled", false);

        // Configure buttons
        $("#btnUpdate").prop("disabled", false);
        $("#btnReset").prop("disabled", false);
        $("#btnSave").prop("disabled", true);

        // Store record number globally
        saveRecNo = JSON.parse(resJsonObj.data).rec_no;

        // Focus next field
        $("#description").focus();
    }
}

// ==========================================
// 6. SAVE LOGIC
// ==========================================
$("#btnSave").click(function () {
    saveData();
});

function saveData() {
    // Validate inputs
    if (!validateData()) {
        return;
    }

    // Build values object
    const shipmentObj = {
        "Shipment-No": $("#shipmentNo").val().trim(),
        "Description": $("#description").val().trim(),
        "Source": $("#source").val().trim(),
        "Destination": $("#destination").val().trim(),
        "Shipping-Date": $("#shippingDate").val(),
        "Expected-Delivery-Date": $("#expectedDeliveryDate").val()
    };

    const jsonStr = JSON.stringify(shipmentObj);

    // Create PUT request to JPDB
    const putRequest = createPUTRequest(connToken, jsonStr, dbName, relName);

    jQuery.ajaxSetup({ async: false });
    const resStr = executeCommandAtGivenBaseUrl(putRequest, baseUrl, "/api/iml");
    const resJsonObj = JSON.parse(resStr);
    jQuery.ajaxSetup({ async: true });
    

    if (resJsonObj.status === 200) {
        showAlert("Shipment record successfully saved!", "success");
        resetForm();
    } else {
        showAlert("Failed to save shipment. Error: " + resJsonObj.message, "danger");
    }
}

// ==========================================
// 7. UPDATE LOGIC
// ==========================================
$("#btnUpdate").click(function () {
    updateData();
});

function updateData() {
    // Validate inputs
    if (!validateData()) {
        return;
    }

    // Build updated values object
    const shipmentUpdateObj = {
        "Description": $("#description").val().trim(),
        "Source": $("#source").val().trim(),
        "Destination": $("#destination").val().trim(),
        "Shipping-Date": $("#shippingDate").val(),
        "Expected-Delivery-Date": $("#expectedDeliveryDate").val()
    };

    const jsonStr = JSON.stringify(shipmentUpdateObj);

    // Create UPDATE request to JPDB
    const updateRequest = createUPDATERecordRequest(connToken, jsonStr, dbName, relName, saveRecNo);

    jQuery.ajaxSetup({ async: false });
    const resStr = executeCommandAtGivenBaseUrl(updateRequest, baseUrl, "/api/iml");
    const resJsonObj = JSON.parse(resStr);
    jQuery.ajaxSetup({ async: true });

    if (resJsonObj.status === 200) {
        showAlert("Shipment record successfully updated!", "success");
        resetForm();
    } else {
        showAlert("Failed to update shipment. Error: " + resJsonObj.message, "danger");
    }
}

// ==========================================
// 8. RESET LOGIC
// ==========================================
$("#btnReset").click(function () {
    resetForm();
});

console.log("JPDB Response:", result);
console.log("Parsed Response:", resJsonObj);
