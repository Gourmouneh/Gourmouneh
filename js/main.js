//Cart
let openShoppingS = document.querySelector('.shoppingS');
let openShopping = document.querySelector('.shopping');
let closeShopping = document.querySelector('.closeShopping');
let list = document.querySelector('.list');
let listCard = document.querySelector('.listCard');
let body = document.querySelector('body');
let total = document.querySelector('.total');
let quantity = document.querySelectorAll('.quantity');
let listCards = [];
var activeProducts = [];

(function ($) {
    "use strict";
    SetQuantityFlag();

    // //Cart
    // let openShoppingS = document.querySelector('.shoppingS');
    // let openShopping = document.querySelector('.shopping');
    // let closeShopping = document.querySelector('.closeShopping');
    // let list = document.querySelector('.list');
    // let listCard = document.querySelector('.listCard');
    // let body = document.querySelector('body');
    // let total = document.querySelector('.total');
    // let quantity = document.querySelectorAll('.quantity');

    // openshopping.addeventlistener('click', () => {
    //     body.classlist.add('active');
    // })
    // openshoppings.addeventlistener('click', () => {
    //     body.classlist.add('active');
    // })
    // closeShopping.addEventListener('click', () => {
    //     body.classList.remove('active');
    // })


    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();


    // Initiate the wowjs
    new WOW().init();


    // Fixed Navbar
    $(window).scroll(function () {
        if ($(window).width() < 992) {
            if ($(this).scrollTop() > 45) {
                $('.fixed-top').addClass('bg-grey shadow');
            } else {
                $('.fixed-top').removeClass('bg-grey shadow');
            }
        } else {
            if ($(this).scrollTop() > 45) {
                $('.fixed-top').addClass('bg-grey shadow').css('top', -45);
            } else {
                $('.fixed-top').removeClass('bg-grey shadow').css('top', 0);
            }
        }
    });


    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({ scrollTop: 0 }, 1500, 'easeInOutExpo', function () {
            // Set the URL hash to #home after the scroll animation completes
            window.location.hash = 'home';
        });
        return false;
    });

    //Add Active to links
    setActiveClass();

    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        margin: 25,
        loop: true,
        center: true,
        dots: false,
        nav: true,
        navText: [
            '<i class="bi bi-chevron-left"></i>',
            '<i class="bi bi-chevron-right"></i>'
        ],
        responsive: {
            0: {
                items: 1
            },
            768: {
                items: 2
            },
            992: {
                items: 3
            }
        }
    });

    //Get Products List
    fetchProducts();

})(jQuery);

function fetchProducts() {
    fetch('./Json/Products.json')
        .then(response => response.json())
        .then(products => {
            const productList = $('#product-list');
            activeProducts = products.filter(product => product.active);
            activeProducts.forEach((product, index) => {
                var imgUrl = "https://gourmouneh.github.io/Images/"
                var img = product.image == "" ? imgUrl + "ProductsLogo/" + product.logo : imgUrl + "Products/" + product.image;
                var isLocal = false;
                if (isLocal) {
                    img = "../imgs/" + product.logo
                }
                const productItem = $(`
                    <div class="col-xl-3 col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.${index + 1}s">
                        <div class="product-item">
                            <div class="position-relative bg-light overflow-hidden">
                                <img class="img-fluid w-100" src="${img}" alt="">
                                ${product.new ? '<div class="bg-secondary rounded text-white position-absolute start-0 top-0 m-4 py-1 px-3">New</div>' : ''}
                            </div>
                            <div class="text-center p-4">
                                <a class="d-block h6 mb-2">${product.name}</a>
                                <p class="d-block h6 mb-2 description">${product.description}</p>
                                ${product.discountedPrice != 0 ? '<span class="text-primary me-1">' + product.currency + product.discountedPrice + '</span><span class="text-body text-decoration-line-through">'
                        + product.currency + product.price + '</span>' : '<span class="text-primary me-1">' + product.currency + product.price + '</span>'}
                            </div>
                            <div class="d-flex border-top"  onclick="addToCard('${product.sku}')" style="cursor:pointer">
                                <small class="w-100 text-center py-2">
                                    <a style="cursor: pointer;" class="text-body"><i class="fa fa-shopping-bag text-primary me-2"></i>Add to cart</a>
                                </small>
                            </div>
                        </div>
                    </div>
                `);
                productList.append(productItem);
            });
        })
        .catch(error => console.error('Error fetching products:', error));
}

function SetQuantityFlag() {
    if (localStorage.getItem('cartData') != null) {
        var myCartData = JSON.parse(localStorage.getItem('cartData'));
        var quantityFlag = 0;

        for (var i = 0; i < myCartData.length; i++) {
            var itemData = myCartData[i];
            if (itemData != null) {
                quantityFlag = quantityFlag + itemData.quantity

                quantity.forEach(element => {
                    element.innerText = quantityFlag;
                });
            }
        }
    } else {
        quantity.forEach(element => {
            element.innerText = 0;
        });
    }
}

function setActiveClass() {
    // Get all nav links
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const navbarCollapse = document.querySelector('.navbar-collapse');

    // Function to remove active class from all nav links
    function removeActiveClasses() {
        navLinks.forEach(link => {
            link.classList.remove('active');
        });
    }

    // Function to add active class to the specified nav link
    function setActiveClass(link) {
        removeActiveClasses();
        link.classList.add('active');
    }

    // Function to handle the active class based on URL hash
    function handleHash() {
        const hash = window.location.hash;
        if (hash) {
            const activeLink = document.querySelector(`.navbar-nav .nav-link[href="${hash}"]`);
            if (activeLink) {
                setActiveClass(activeLink);
            }
        }
    }

    // Add click event listener to each nav link
    navLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            setActiveClass(link);
            // Close the navbar dropdown
            if (navbarCollapse.classList.contains('show')) {
                new bootstrap.Collapse(navbarCollapse).hide();
            }
        });
    });

    // Set active class based on URL hash on page load
    handleHash();

    // Optional: Add event listener for hash changes (if hash changes dynamically)
    window.addEventListener('hashchange', handleHash);
}

function addToCard(sku) {

    var newCartData = activeProducts.find((product) => product.sku === sku);

    if (localStorage.getItem('cartData') == null) {
        localStorage.setItem('cartData', '[]');
    }

    var existingCartData = JSON.parse(localStorage.getItem('cartData'));

    if (existingCartData.length > 0) {
        for (var i = 0; i < existingCartData.length; i++) {
            if (sku == existingCartData[i].sku) {
                existingCartData[i].quantity = existingCartData[i].quantity + 1;
                break;
            } else {
                newCartData.quantity = 1;
                existingCartData.push(newCartData);
                break;
            }
        }
    } else {
        newCartData.quantity = 1;
        existingCartData.push(newCartData);
    }
    localStorage.setItem('cartData', JSON.stringify(existingCartData));
    SetQuantityFlag();
    // if (listCards[key] == null) {
    //     // copy product form list to list card
    //     console.log(activeProducts);
    //     listCards[key] = JSON.parse(JSON.stringify(activeProducts[key]));
    //     listCards[key].quantity = 1;
    // } else {
    //     listCards[key].quantity++;
    // }
    // reloadCard();
}
function SendContactEmail() {

    var name = $("#name").val();
    var email = $("#email").val();
    var message = $("#message").val();
    var phoneNumber = $("#phone").val();

    if (name == "" && phoneNumber == "") {
        alert("Please Enter Your Name and Number to proceed");
        return;
    } else {
        if (name == "") {
            alert("Please Enter Your Name to proceed");
            return;
        }
        if (phoneNumber == "") {
            alert("Please Enter Your Number to proceed");
            return;
        }
        if (message == "") {
            alert("Please Enter Your Message to proceed");
            return;
        }
    }
    console.log(message);


    var currentDate = new Date().toLocaleDateString();

    // Create a div element for customer info
    var customerInfoDiv = document.createElement("div");
    customerInfoDiv.innerHTML =
        "<p>Customer Name: " +
        name +
        "</p>" +
        "<p>Phone Number: " +
        phoneNumber +
        "</p>" +
        "<p>Email: " +
        email +
        "</p>" +
        "<p>Message: " +
        message +
        "</p>" +
        "<p>Date: " +
        currentDate +
        "</p>";
    var emailContent = customerInfoDiv.outerHTML;

    Email.send({
        Host: "smtp.elasticemail.com",
        Username: "gourmouneh@gmail.com",
        Password: "CCA89F3573A9769E58D3261644246999E1B5",
        To: "gourmouneh@gmail.com",
        From: "gourmouneh@gmail.com",
        Subject: "Contact Form - From " + name,
        Body: emailContent,
    }).then(function (message) {
        alert("Form Sent\nWe will contact you shortly.");
        location.reload();
    });
}