
const form = document.getElementById("bookingForm");
const movie = document.getElementById("movie");
const showtime = document.getElementById("showtime");
const quantity = document.getElementById("quantity");
const email = document.getElementById("email");
const total = document.getElementById("total");
const count = document.getElementById("count");
const bookingList = document.getElementById("bookingList");

let bookings = [];
let bookingCount = 0;

function calculateTotal() {
    total.textContent =
        "Total Price: ₹" + (Number(movie.value) * Number(quantity.value));
}

movie.addEventListener("change", calculateTotal);
quantity.addEventListener("input", calculateTotal);

form.addEventListener("submit", function(event) {
    event.preventDefault();

    let qty = Number(quantity.value);
    let userEmail = email.value.trim();

    if (!Number.isInteger(qty) || qty <= 0) {
        alert("Enter a valid ticket quantity!");
        return;
    }

    if (!email.checkValidity() || userEmail === "") {
        alert("Enter a valid email address!");
        return;
    }

    let movieName = movie.options[movie.selectedIndex].text;
    let price = Number(movie.value) * qty;

    let booking = {
        movie: movieName,
        showtime: showtime.value,
        quantity: qty,
        email: userEmail,
        price: price
    };

    bookings.push(booking);
    bookingCount++;

    alert(
        "Booking Successful!\n\n" +
        "Movie: " + movieName + "\n" +
        "Showtime: " + showtime.value + "\n" +
        "Tickets: " + qty + "\n" +
        "Email: " + userEmail + "\n" +
        "Total Price: ₹" + price
    );

    displayBookings();

    form.reset();
    email.value = "";

    calculateTotal();
});

function displayBookings() {
    bookingList.innerHTML = "";

    for (let i = 0; i < bookings.length; i++) {
        let div = document.createElement("div");
        div.className = "booking";

        div.innerHTML =
            "<p>Movie: " + bookings[i].movie + "</p>" +
            "<p>Showtime: " + bookings[i].showtime + "</p>" +
            "<p>Tickets: " + bookings[i].quantity + "</p>" +
            "<p>Email: " + bookings[i].email + "</p>" +
            "<p>Total: ₹" + bookings[i].price + "</p>";

        let cancelButton = document.createElement("button");
        cancelButton.textContent = "Cancel Booking";
        cancelButton.className = "cancel";

        cancelButton.addEventListener("click", function() {
            bookings.splice(i, 1);
            bookingCount--;

            displayBookings();

            alert("Booking Cancelled!");
        });

        div.appendChild(cancelButton);
        bookingList.appendChild(div);
    }

    count.textContent = bookingCount;
}

form.addEventListener("reset", function() {
    setTimeout(function() {
        email.value = "";
        calculateTotal();
    }, 0);
});

calculateTotal();
