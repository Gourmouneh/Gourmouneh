var purchaseBtn;

if (document.readyState == 'loading') {
  document.addEventListener("DOMContentLoaded", ready)
} else {
  ready();
}

function ready() {

  // remove cart item - accessing buttons
  var removeCartItemsBtn = document.getElementsByClassName("fa-times-circle");

  for (var i = 0; i < removeCartItemsBtn.length; i++) {
    var button = removeCartItemsBtn[i];
    button.addEventListener('click', removeCartItem);
  }
  // Quantity change - accesing qty inputs

  var quantityInputs = document.getElementsByClassName("cart-quantity-input");

  for (var i = 0; i < quantityInputs.length; i++) {
    var input = quantityInputs[i];
    input.addEventListener('change', quantityChanged);
    input.addEventListener('change', updateSubtotal);
    input.addEventListener('change', updateCartTotal);
  }

  // adding items to cart 
  var cartBody = document.getElementById("cart-body");

  if (cartBody) {
    if (localStorage.getItem('cartData') != null) {
      var myCartData = JSON.parse(localStorage.getItem('cartData'));

      for (var i = 0; i < myCartData.length; i++) {
        var itemData = myCartData[i];
        if (itemData != null) {
          var subtotal = itemData.price * itemData.quantity;
          var currency = itemData.currency;

          var imgUrl = "https://gourmouneh.github.io/Images/"
          var img = itemData.image == "" ? imgUrl + "ProductsLogo/" + itemData.logo : imgUrl + "Products/" + itemData.image;
          var itemDesc = itemData.description == "" ? "" : " - " + itemData.description;

          var cartRow = document.createElement('tr');
          cartRow.classList.add("cart-row");
          cartRow.id = itemData.sku;
          cartRow.innerHTML = `<td>
         <i class="far fa-times-circle"></i>
        </td>
        <td><img src="${img}" alt="" /></td>
        <td>${itemData.name} <span class="description">${itemDesc}</span></td>
         <td class="cart-price">${itemData.currency} ${itemData.price}</td>
         <td><input type="number" value="${itemData.quantity}" class="cart-quantity-input" min="1" step="1"/></td>
        <td class="cart-item-subtotal">${itemData.currency} ${subtotal}</td>`;

          var cartItems = document.getElementById("cart-body");

          cartItems.appendChild(cartRow);

          cartRow.getElementsByClassName("fa-times-circle")[0].addEventListener('click', removeCartItem);


          cartRow.getElementsByClassName("cart-quantity-input")[0].addEventListener('change', updateSubtotal);
          cartRow.getElementsByClassName("cart-quantity-input")[0].addEventListener('change', quantityChanged);
          cartRow.getElementsByClassName("cart-quantity-input")[0].addEventListener('change', updateSubtotal);
          cartRow.getElementsByClassName("cart-quantity-input")[0].addEventListener('change', updateCartTotal);

          updateCartTotal();

        }
      }
    }

    updateCartTotal();

    // purchase btn
    purchaseBtn = document.getElementById("btn-purchase");
    purchaseBtn.addEventListener('click', purchaseBtnClicked);


    //dont allow decimal
    document.querySelectorAll('.cart-quantity-input').forEach(function (input) {
      input.addEventListener('input', function () {
        // Remove any decimal point and digits following it
        this.value = this.value.replace(/\D+/g, '');
      });

      input.addEventListener('change', function () {
        // Ensure the value is at least the minimum value
        if (this.value < 1) {
          this.value = 1;
        }
      });
    });
  }
}

// update subtotal - function
function updateSubtotal(event) {
  var input = event.target;

  var curCartRow = input.parentElement.parentElement;

  var curPriceElement = curCartRow.getElementsByClassName("cart-price")[0];

  var curPrice = parseFloat(curPriceElement.innerText.replace("$", "").trim());
  var curSku = curCartRow.id;

  var curQuantity = (input.value == null || input.value == '' || input.value <= "0") ? "1" : input.value;

  var subtotal = curQuantity * curPrice;

  curCartRow.getElementsByClassName("cart-item-subtotal")[0].innerText = "$ " + subtotal;

  var existingCartData = JSON.parse(localStorage.getItem('cartData'));

  for (var i = 0; i < existingCartData.length; i++) {
    if (existingCartData[i].sku == curSku) {
      existingCartData[i].quantity = parseInt(curQuantity);
      break;
    }
  }

  localStorage.setItem('cartData', JSON.stringify(existingCartData));
}

// Quantity change - function
function quantityChanged(event) {
  var input = event.target;
  if (isNaN(input.value) || input.value <= 0) {
    input.value = 1;
  }
  updateCartTotal();

}

// remove cart item - function
function removeCartItem(event) {
  var buttonClicked = event.target;

  var cartRow = buttonClicked.parentElement.parentElement;

  var cartTitle = cartRow.id;

  var existingCartData = JSON.parse(localStorage.getItem('cartData'));

  for (var i = 0; i < existingCartData.length; i++) {
    if (existingCartData[i].sku == cartTitle) {
      existingCartData.splice(i, 1);
    }

  }

  localStorage.setItem('cartData', JSON.stringify(existingCartData));

  buttonClicked.parentElement.parentElement.remove();
  updateCartTotal();
}

// update cart total - function
function updateCartTotal() {
  var cartItemContainer = document.getElementsByClassName("cart-items")[0];

  var cartRows = cartItemContainer.getElementsByClassName("cart-row");
  var total = 0;

  for (var i = 0; i < cartRows.length; i++) {
    var cartRow = cartRows[i];
    var subtotalElement = cartRow.getElementsByClassName("cart-item-subtotal")[0];

    var subtotal = parseFloat(subtotalElement.innerText.replace("$", "").trim());

    var total = total + subtotal;

  }
  total = Math.round(total * 100) / 100;

  document.getElementsByClassName("cart-subtotal")[0].innerText = "$ " + total;
  document.getElementsByClassName("cart-total")[0].innerText = "$ " + total;

  SetQuantityFlag();

}

// Purchase clicked - functio
function purchaseBtnClicked(event) {
  var customerName = $("#name").val();
  var phoneNumber = $("#number").val();
  var cartData = localStorage.getItem("cartData");
  if (cartData && JSON.parse(cartData).length > 0) {

    if (customerName == "" && phoneNumber == "") {
      alert("Please Enter Your Name and Number to proceed");
      return;
    } else {
      if (customerName == "") {
        alert("Please Enter Your Name to proceed");
        return;
      }
      if (phoneNumber == "") {
        alert("Please Enter Your Number to proceed");
        return;
      }
    }

    sendEmail();


  } else {

    alert("Shopping cart Empty. Please Add Items to Your cart!")
  }
}


function sendEmail() {

  purchaseBtn.disabled = true;
  purchaseBtn.textContent = "Processing...";

  var cartList = JSON.parse(localStorage.getItem("cartData")) || [];
  var customerName = $("#name").val();
  var phoneNumber = $("#number").val();
  var quantity = document.getElementsByClassName('quantity')[0].innerText;

  var cartTotal = $(".cart-total").text();

  console.log(cartList);
  console.log(customerName);
  console.log(phoneNumber);

  var currentDate = new Date().toLocaleDateString();

  // Create a div element for customer info
  var customerInfoDiv = document.createElement("div");
  customerInfoDiv.innerHTML =
    "<p>Customer Name: " +
    customerName +
    "</p>" +
    "<p>Phone Number: " +
    phoneNumber +
    "</p>" +
    "<p>Total Items: " +
    quantity +
    "</p>" +
    "<p>Total Price: " +
    cartTotal +
    "</p>" +
    "<p>Date: " +
    currentDate +
    "</p>";

  // Create a table element
  var table = document.createElement("table");
  table.style.borderCollapse = "collapse";
  table.style.width = "100%";

  var headerRow = document.createElement("tr");

  var headers = ["SKU", "Name", "Description", "Quantity", "Price", "SubTotal"];

  headers.forEach(function (headerText) {
    var headerCell = document.createElement("th");
    headerCell.style.border = "1px solid black";
    headerCell.style.padding = "8px";
    headerCell.textContent = headerText;
    headerRow.appendChild(headerCell);
  });

  table.appendChild(headerRow);

  var tbody = document.createElement("tbody");

  cartList.forEach(function (product) {
    var row = document.createElement("tr");

    headers.forEach(function (headerText) {
      var cell = document.createElement("td");
      cell.style.border = "1px solid black";
      cell.style.padding = "8px";
      cell.textContent = headerText === "Price" ? "$ " + product[headerText.toLowerCase()] : headerText === "SubTotal" ? "$ " + product["quantity"] * product["price"] : product[headerText.toLowerCase()];
      row.appendChild(cell);
    });

    tbody.appendChild(row);
  });

  table.appendChild(tbody);

  // Combine customer info div and table
  var emailContent = customerInfoDiv.outerHTML + table.outerHTML;


  // Email.send({
  //   Host: "smtp.elasticemail.com",
  //   Username: "gourmouneh@gmail.com",
  //   Password: "CCA89F3573A9769E58D3261644246999E1B5",
  //   To: "gourmouneh@gmail.com",
  //   From: "gourmouneh@gmail.com",
  //   Subject: "Order Details from " + customerName,
  //   Body: emailContent,
  // }).then(function (message) {
  //   alert("Order Sent\nWe will contact you shortly to confirm the details.");
  //   sessionStorage.clear();
  //   localStorage.removeItem('cartData');

  //   location.reload();
  // });


  // console.log(cartList);

  var orderItems = cartList.map(product => ({
    sku: product.sku,
    item_name: product.name,
    qty: product.quantity,
    item_price: product.price,
    price: (product.price * product.quantity),
    item_description: product.description ? " - " + product.description : ""
  }));

  // Calculate the total cost
  var totalCost = orderItems.reduce((sum, item) => sum + item.price, 0);

  var templateParams = {
    name: customerName,
    phone: phoneNumber,
    orders: orderItems,
    quantity: quantity,
    cost: {
      total: totalCost
    }
  };

  console.log(templateParams);

  // Send the email
  emailjs.send('service_eaoo0k7', 'template_order', templateParams, 'VdUR0V6FGw8c3sn7t')
    .then(response => {
      console.log('SUCCESS!', response.status, response.text);
      alert("Order Sent\nWe will contact you shortly to confirm the details.");
      sessionStorage.clear();
      localStorage.removeItem('cartData');

      window.location.href = window.location.origin + "/Gourmouneh/";

    })
    .catch(error => {
      console.error('FAILED...', error);

      purchaseBtn.disabled = false;
      purchaseBtn.textContent = "Proceed to Checkout";

      alert("Failed to send order confirmation.");
    });
}