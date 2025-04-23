"use strict"

//theme-switcher
let themeSwitch = document.getElementById('theme-switch');

let enableLightMode = () => {
    document.body.classList.add("lightmode");
}

let disableLightMode = () => {
    document.body.classList.remove("lightmode");
}

themeSwitch.addEventListener("click", () => {
    if (document.body.classList.contains("lightmode")) {
        disableLightMode();
    } else {
        enableLightMode();
    }
});

//form validation
let validateForm = e => {
    e.preventDefault();

    // inputs
    let fullName = document.getElementById("fullname");
    let email = document.getElementById("email");
    let phoneNum = document.getElementById("phone");
    let fieldSet = document.querySelector("fieldset");
    let contactPref = document.querySelector('input[name="preferences"]:checked')?.value;
    let vehicle = document.getElementById("car");
    let packageSelect = document.getElementById("package");
    let comments = document.getElementById("comments");
    let phoneRequired = document.getElementById("phone-required");
    let emailRequired = document.getElementById("email-required");


    // containers for display to user
    let confirm = document.getElementById("confirm");

    // re-hide the output paragraph
    confirm.classList.add("hidden");

    // regular expressions
    let fullNameRegex = /^[a-z ,.'-]+$/i;
    let emailRegex =  /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,5}$/;
    let phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
    let vehicleRegex = /\S+/;

    // reset the border styles on the inputs
    fullName.classList.remove("error");
    email.classList.remove("error");
    phoneNum.classList.remove("error");
    vehicle.classList.remove("error");
    packageSelect.classList.remove("error");
    comments.classList.remove("error");

    // hide any previous error messages/empty output containers
    fullName.nextElementSibling.classList.add("hidden");
    email.nextElementSibling.classList.add("hidden");
    phoneNum.nextElementSibling.classList.add("hidden");
    vehicle.nextElementSibling.classList.add("hidden");
    packageSelect.nextElementSibling.classList.add("hidden");
    comments.nextElementSibling.classList.add("hidden");

    confirm.innerHTML = "";

     // variable to track whether or not the form is valid
    let isValid = true;

    // ensure that fullname matches pattern, give feedback to user if not
    if (!fullNameRegex.test(fullName.value)) {
        isValid = false;
        fullName.classList.add("error");
        fullName.nextElementSibling.classList.remove("hidden");
    }

    // ensure that email address is correct/matches pattern
    if (contactPref === "email" && !emailRegex.test(email.value)) {
        isValid = false;
        email.classList.add("error");
        email.nextElementSibling.classList.remove("hidden");
        phoneNum.nextElementSibling.classList.add("hidden");
        phoneRequired.style.display = "none";
        emailRequired.style.display = "inline"
    }

    // ensure that the phoneNum is 10 digits only with -/passes regex
    if (contactPref === "phone" && !phoneRegex.test(phoneNum.value)) {
        isValid = false;
        phoneNum.classList.add("error");
        phoneNum.nextElementSibling.classList.remove("hidden");
        emailRequired.style.display = "none";
        phoneRequired.style.display = "inline"
    }

    // ensure that the vehicle input is not empty/passes regex
    if (!vehicleRegex.test(vehicle.value)) {
        isValid = false;
        vehicle.classList.add("error");
        vehicle.nextElementSibling.classList.remove("hidden");
    }

    // ensure that the package selection is not empty
    if (packageSelect.value === "") {
        isValid = false;
        packageSelect.classList.add("error");
        packageSelect.nextElementSibling.classList.remove("hidden");
    }

    // ensure that the comments selection is not empty
    if (comments.value === "") {
        isValid = false;
        comments.classList.add("error");
        comments.nextElementSibling.classList.remove("hidden");
    }



    // if the form is valid, submit it after displaying the user's info to them and clearing the form for new input.
    if (isValid) {
        // object to hold contact info
        let contact = {
            name: fullName.value,
            contactMethod: contactPref,
            email: email.value,
            phone: phoneNum.value,
            vehicle: vehicle.value,
            package: packageSelect.value,
            comments: comments.value
        }
        // reset form
        document.querySelector("form").reset();

        // display message to user
        confirm.innerHTML = `
        <div id="confirm-msg">
            <h4>Thank you for your submission, ${contact.name}!</h4>
            <p>We’ll reach out to you via <strong>${contact.contactMethod}</strong>:</p>
            <ul>
                ${contact.contactMethod === 'email' ? `<li>Email: ${contact.email}</li>` : ''}
                ${contact.contactMethod === 'phone' ? `<li>Phone: ${contact.phone}</li>` : ''}
                <li>Vehicle: ${contact.vehicle}</li>
                <li>Package: ${contact.package}</li>
                <li>Comments: ${contact.comments}</li>
            </ul>
        </div>
        `;

        confirm.classList.remove("hidden");

        document.querySelector("form").submit();
    }
}

//form validation event listener
document.querySelector("form").addEventListener("submit", validateForm);


//Shoping cart functionality 
const taxRate = 0.085;
const shippingCost = 5.00;
const cartItems = {};
const cartMsg = document.getElementById("cartMsg");
const selectedItems = document.getElementById("selectedItems");
const subTotalDisplay = document.getElementById("subTotal");
const totalDisplay = document.getElementById("total");
const checkOutButton = document.getElementById("checkOut");

const products = [
    { id: "p1", name: "T-Shirt", price: 19.99 },
    { id: "p2", name: "Hoodie", price: 39.99 },
    { id: "p3", name: "Sweatshirt", price: 29.99 }
];

products.forEach(product => {
    const checkbox = document.querySelector(`#${product.id} input[type="checkbox"]`);
    checkbox.addEventListener("change", () => {
        if (checkbox.checked) {
            cartItems[product.id] = product;
        } else {
            delete cartItems[product.id];
        }
        updateCartDisplay();
    });
});

function updateCartDisplay() {
    selectedItems.innerHTML = ""; // clear current list
    const itemKeys = Object.keys(cartItems);

    if (itemKeys.length === 0) {
        selectedItems.innerHTML = `<li id="cartMsg">Your cart is empty</li>`;
        subTotalDisplay.textContent = "$0.00";
        totalDisplay.textContent = "$0.00";
        return;
    }

    let subtotal = 0;
    itemKeys.forEach(key => {
        const item = cartItems[key];
        subtotal += item.price;

        const li = document.createElement("li");
        li.textContent = `${item.name} - $${item.price.toFixed(2)}`;
        selectedItems.appendChild(li);
    });

    const tax = subtotal * taxRate;
    const total = subtotal + tax + shippingCost;

    subTotalDisplay.textContent = `$${subtotal.toFixed(2)}`;
    totalDisplay.textContent = `$${total.toFixed(2)}`;
}

checkOutButton.addEventListener("click", () => {
    const itemKeys = Object.keys(cartItems);
    if (itemKeys.length === 0) {
        alert("Please add items to your cart before checking out.");
        return;
    }

    const subtotal = itemKeys.reduce((sum, key) => sum + cartItems[key].price, 0);
    const tax = subtotal * taxRate;
    const total = subtotal + tax + shippingCost;

    alert(`Thank you for your order! Your total is $${total.toFixed(2)}.`);

    // Clear cart
    itemKeys.forEach(id => {
        const checkbox = document.querySelector(`#${id} input[type="checkbox"]`);
        checkbox.checked = false;
    });
    Object.keys(cartItems).forEach(key => delete cartItems[key]);
    updateCartDisplay();
});