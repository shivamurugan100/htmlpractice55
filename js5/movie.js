const movies = [
    { name: "Avengers Endgame Encore", time: "7:00 PM", price: 280 },
    { name: "Avatar (IMAX)", time: "10:00 PM", price: 300 },
    { name: "Godzilla x Kong :The new empire", time: "11:00 PM", price: 250 }
];

const booked = document.getElementById("booked");
const bookings = document.getElementById("bookings");

booked.innerHTML = `
    <form id="form">
        <h3>Book Your Tickets</h3>

        <label>Select Movie:</label>
        <select id="movieSelect">
            <option value="0">Avengers Endgame Encore</option>
            <option value="1">Avatar (IMAX)</option>
            <option value="2">Godzilla x Kong :The new empire</option>
        </select>
        <br><br>

        <label>Showtime:</label>
        <select id="showtime">
            <option value="7:00 PM">7:00 PM</option>
            <option value="10:00 PM">10:00 PM</option>
            <option value="11:00 PM">11:00 PM</option>
        </select>
        <br><br>

        <label>Email Address:</label>
        <input type="email" id="email" placeholder="Enter your email" required>
        <br><br>

        <label>Number of Tickets:</label>
        <input type="number" id="quantity" min="1" step="1" value="1" required>
        <br><br>

        <p id="total">Total Price: ₹280</p>

        <button type="submit">Book Tickets</button>
        <button type="reset">Reset</button>

        <p id="message"></p>
    </form>
`;

const form = document.getElementById("form");
const movieSelect = document.getElementById("movieSelect");
const showtime = document.getElementById("showtime");
const email = document.getElementById("email");
const quantity = document.getElementById("quantity");
const total = document.getElementById("total");
const message = document.getElementById("message");

let bookingList = [];
let bookingId = 1;

function calculateTotal() {
    const movie = movies[Number(movieSelect.value)];
    const tickets = Number(quantity.value);

    if (Number.isInteger(tickets) && tickets > 0) {
        total.textContent = "Total Price: ₹" + movie.price * tickets;
    } else {
        total.textContent = "Enter a valid ticket quantity";
    }
}

movieSelect.addEventListener("change", function() {
    showtime.value = movies[Number(movieSelect.value)].time;
    calculateTotal();
});

quantity.addEventListener("input", calculateTotal);

form.addEventListener("submit", function(event) {
    event.preventDefault();

    const movie = movies[Number(movieSelect.value)];
    const tickets = Number(quantity.value);
    const userEmail = email.value.trim();

    if (!Number.isInteger(tickets) || tickets <= 0) {
        message.textContent = "Enter a valid number of tickets.";
        return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail)) {
        message.textContent = "Please enter a valid email address.";
        return;
    }

    const price = movie.price * tickets;

    const booking = {
        id: bookingId,
        movie: movie.name,
        time: showtime.value,
        tickets: tickets,
        email: userEmail,
        price: price
    };

    bookingId++;
    bookingList.push(booking);

    message.textContent = "Booking successful! Total: ₹" + price;

    displayBookings();

    const subject = encodeURIComponent("Movie Ticket Booking Confirmation");

    const body = encodeURIComponent(
        "Movie: " + booking.movie + "\n" +
        "Showtime: " + booking.time + "\n" +
        "Number of tickets: " + booking.tickets + "\n" +
        "Total Price: ₹" + booking.price + "\n" +
        "Booking ID: " + booking.id
    );

    window.location.href = "mailto:" + encodeURIComponent(booking.email) +
        "?subject=" + subject + "&body=" + body;
});

function displayBookings() {
    bookings.innerHTML = "<h3>Booked Tickets (" + bookingList.length + ")</h3>";

    const search = document.createElement("input");
    search.type = "text";
    search.placeholder = "Search booked tickets...";
    bookings.appendChild(search);

    const bookingContainer = document.createElement("div");
    bookings.appendChild(bookingContainer);

    function showBookings() {
        bookingContainer.innerHTML = "";

        const searchText = search.value.toLowerCase();

        const filteredBookings = bookingList.filter(function(booking) {
            return booking.movie.toLowerCase().includes(searchText) ||
                booking.email.toLowerCase().includes(searchText);
        });

        if (filteredBookings.length === 0) {
            const text = document.createElement("p");

            if (bookingList.length === 0) {
                text.textContent = "No bookings yet.";
            } else {
                text.textContent = "No matching bookings found.";
            }

            bookingContainer.appendChild(text);
        }

        filteredBookings.forEach(function(booking) {
            const card = document.createElement("div");
            card.className = "bookingCard";

            const details = document.createElement("p");

            details.textContent =
                "Booking ID: " + booking.id + "\n" +
                "Movie: " + booking.movie + "\n" +
                "Showtime: " + booking.time + "\n" +
                "Tickets: " + booking.tickets + "\n" +
                "Total Price: ₹" + booking.price + "\n" +
                "Email: " + booking.email;

            card.appendChild(details);

            const cancelButton = document.createElement("button");
            cancelButton.textContent = "Cancel Booking";

            cancelButton.addEventListener("click", function() {
                const answer = confirm("Do you want to cancel this booking?");

                if (answer) {
                    bookingList = bookingList.filter(function(item) {
                        return item.id !== booking.id;
                    });

                    displayBookings();
                }
            });

            card.appendChild(cancelButton);
            bookingContainer.appendChild(card);
        });
    }

    search.addEventListener("input", showBookings);

    showBookings();
}

form.addEventListener("reset", function() {
    setTimeout(function() {
        movieSelect.value = "0";
        showtime.value = "7:00 PM";
        quantity.value = "1";
        email.value = "";
        message.textContent = "";
        calculateTotal();
    }, 0);
});

calculateTotal();
displayBookings();