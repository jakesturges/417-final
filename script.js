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
let shoppingCart = () => {
    //constant variables
    const taxRate = 0.085;
    const shippingCost = 5.00;

    //DOM
    let cartMsg = document.getElementById("cartMsg");
    let subTotal = document.getElementById("subTotal");
    let total = document.getElementById("total");
    let selectedItems = document.getElementById("selectedItems");
    let checkOutBtn = document.getElementById("checkOut");
    let checkboxes = document.querySelectorAll("#shopping input[type='checkbox']");

    //Map to hold cart items
    let cart = new Map();

    //function to update cart
    let updateCartDisplay = () => {
        selectedItems.innerHTML = "";
        let totalPrice = 0;

        if (cart.size === 0) {
            selectedItems.innerHTML = `<li id="cartMsg">Your cart is empty</li>`;
        } else {
            cart.forEach((price, itemName) => {
                let item = document.createElement("li");
                //use toFixed to only allow 2 decimal places
                item.textContent = `${itemName} - $${price.toFixed(2)}`;
                selectedItems.appendChild(item);
                totalPrice += price;
            });
        }
        
        let taxPrice = totalPrice * taxRate;
        let grandTotal;
        if (totalPrice === 0) {
            grandTotal = 0;
        } else {
            grandTotal = totalPrice + taxPrice + shippingCost;
        }

        subTotal.textContent = `$${totalPrice.toFixed(2)}`;
        total.textContent = `$${grandTotal.toFixed(2)}`;
    };

    //add event listeners to checkboxes and add products to map and call updateCartDisplay()
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener("change", function() {
            //searches the DOM for the closets product class on the checkbox that we click
            let product = this.closest(".product");
            let productName = product.querySelector("h4").textContent;
            //replace $ or you will get NaN displayed in output
            let productPrice = parseFloat(product.querySelector(".price").textContent.replace("$", ""));

            if (this.checked) {
                cart.set(productName, productPrice);
            } else {
                cart.delete(productName);
            }

            updateCartDisplay();
        });
    });

    //Event listener for checkout button
    checkOutBtn.addEventListener("click", () => {
        //if users tries to checkout empty cart display message
        if (cart.size === 0) {
            selectedItems.innerHTML = `<li>Your cart is empty. Please add something to check out.</li>`;
            return;
        //if users tries to checkout with cartItems display message and clear cart/checkboxes
        } else {
            let totalPrice = 0;
            cart.forEach(price => totalPrice += price);
            let taxPrice = totalPrice * taxRate;
            let grandTotal = totalPrice + taxPrice + shippingCost;
    
            //thank you message
            selectedItems.innerHTML = `<li>Thanks for your order! Your total is $${grandTotal.toFixed(2)}</li>`;

            //clear cart and checkboxes
            cart.clear();
            checkboxes.forEach(checkbox => checkbox.checked = false);

            //clear out totals
            subTotal.textContent = "$0.00";
            total.textContent = "$0.00";
        }
    });
    
}

//Initialize Cart
shoppingCart();