
"use strict";

const EMAILJS_PUBLIC_KEY = "YOUR_EMAILJS_PUBLIC_KEY";
const EMAILJS_SERVICE_ID = "YOUR_EMAILJS_SERVICE_ID";
const EMAILJS_TEMPLATE_ID = "YOUR_EMAILJS_TEMPLATE_ID";

const movies = [
    {
        id: "avengers",
        name: "Avengers: Endgame",
        price: 280
    },
    {
        id: "avatar",
        name: "Avatar: The Way of Water",
        price: 300
    },
    {
        id: "godzilla",
        name: "Godzilla x Kong",
        price: 250
    }
];

const form = document.getElementById("bookingForm");
const movie = document.getElementById("movie");
const showtime = document.getElementById("showtime");
const quantity = document.getElementById("quantity");
const email = document.getElementById("email");

const unitPrice = document.getElementById("unitPrice");
const ticketDisplay = document.getElementById("ticketDisplay");
const totalPrice = document.getElementById("totalPrice");

const bookingCount = document.getElementById("bookingCount");
const movieCount = document.getElementById("movieCount");
const bookingList = document.getElementById("bookingList");
const listCount = document.getElementById("listCount");

const searchInput = document.getElementById("searchInput");
const movieFilter = document.getElementById("movieFilter");
const emptyMessage = document.getElementById("emptyMessage");
const formMessage = document.getElementById("formMessage");
const bookButton = document.getElementById("bookButton");

let bookings = [];
const STORAGE_KEY = "cinebook_bookings";

try {
    const savedBookings = localStorage.getItem(STORAGE_KEY);

    if (savedBookings !== null) {
        const parsedBookings = JSON.parse(savedBookings);

        if (
            Array.isArray(parsedBookings) &&
            parsedBookings.every(isValidSavedBooking)
        ) {
            bookings = parsedBookings;
        }
    }
} catch (error) {
    console.error("Could not restore bookings:", error);
}

function isValidSavedBooking(item) {
    return item !== null &&
        typeof item === "object" &&
        typeof item.id === "string" &&
        typeof item.movieId === "string" &&
        movies.some(movieItem => movieItem.id === item.movieId) &&
        typeof item.movieName === "string" &&
        typeof item.showtime === "string" &&
        typeof item.quantity === "number" &&
        Number.isInteger(item.quantity) &&
        item.quantity >= 1 &&
        item.quantity <= 10 &&
        typeof item.price === "number" &&
        Number.isFinite(item.price) &&
        item.price > 0 &&
        typeof item.total === "number" &&
        Number.isFinite(item.total) &&
        item.total === item.price * item.quantity &&
        typeof item.email === "string" &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(item.email);
}

function saveBookings() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
    } catch (error) {
        console.error("Could not save bookings:", error);
        alert("Warning: bookings could not be saved in this browser.");
    }
}

function formatINR(amount) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 2
    }).format(amount);
}

function getSelectedMovie() {
    return movies.find(item => item.id === movie.value);
}

function showMessage(message, type) {
    formMessage.textContent = message;
    formMessage.className =
        type === "success" ? "success-message" : "error-message";
}

function calculateTotal() {
    const selectedMovie = getSelectedMovie();
    const tickets = Number(quantity.value);

    const validQuantity =
        quantity.value.trim() !== "" &&
        Number.isInteger(tickets) &&
        tickets >= 1 &&
        tickets <= 10;

    unitPrice.textContent = selectedMovie
        ? formatINR(selectedMovie.price)
        : formatINR(0);

    ticketDisplay.textContent = validQuantity ? tickets : "—";

    totalPrice.textContent = validQuantity && selectedMovie
        ? formatINR(selectedMovie.price * tickets)
        : "—";
}

movie.addEventListener("change", calculateTotal);
quantity.addEventListener("input", calculateTotal);

function displayBookings() {
    bookingList.replaceChildren();

    const searchText = searchInput.value.trim().toLowerCase();
    const selectedFilter = movieFilter.value;

    const filteredBookings = bookings.filter(booking => {
        const matchesSearch =
            booking.movieName.toLowerCase().includes(searchText) ||
            booking.email.toLowerCase().includes(searchText);

        const matchesMovie =
            selectedFilter === "all" ||
            booking.movieId === selectedFilter;

        return matchesSearch && matchesMovie;
    });

    for (const booking of filteredBookings) {
        const row = document.createElement("tr");

        const movieCell = document.createElement("td");
        const movieName = document.createElement("div");
        movieName.className = "movie-title";
        movieName.textContent = booking.movieName;

        const customerEmail = document.createElement("div");
        customerEmail.className = "movie-email";
        customerEmail.textContent = booking.email;

        movieCell.append(movieName, customerEmail);

        const timeCell = document.createElement("td");
        const timeBadge = document.createElement("span");
        timeBadge.className = "showtime-badge";
        timeBadge.textContent = booking.showtime;
        timeCell.appendChild(timeBadge);

        const quantityCell = document.createElement("td");
        quantityCell.textContent = booking.quantity;

        const priceCell = document.createElement("td");
        priceCell.className = "total-cell";
        priceCell.textContent = formatINR(booking.total);

        const actionCell = document.createElement("td");
        const cancelButton = document.createElement("button");

        cancelButton.type = "button";
        cancelButton.className = "cancel-button";
        cancelButton.textContent = "Cancel";

        cancelButton.addEventListener("click", () => {
            const confirmed = confirm(
                `Cancel the booking for ${booking.movieName}?`
            );

            if (!confirmed) {
                return;
            }

            bookings = bookings.filter(
                item => item.id !== booking.id
            );

            saveBookings();
       ============================================     updateDashboard();
            displayBookings();

            showMessage(
                "Booking cancelled successfully.",
                "success"
            );
        });

        actionCell.appendChild(cancelButton);

        row.append(
            movieCell,
            timeCell,
            quantityCell,
            priceCell,
            actionCell
        );

        bookingList.appendChild(row);
    }

    listCount.textContent = filteredBookings.length;

    emptyMessage.hidden = filteredBookings.length > 0;

    if (filteredBookings.length === 0) {
        emptyMessage.textContent = bookings.length === 0
            ? "No bookings yet. Book your first movie above!"
            : "No bookings match your search or filter.";
    }
}

searchInput.addEventListener("input", displayBookings);
movieFilter.addEventListener("change", displayBookings);

function updateDashboard() {
    bookingCount.textContent = bookings.length;
    movieCount.textContent = movies.length;
    listCount.textContent = bookings.length;
}

function isEmailJSConfigured() {
    return typeof window.emailjs !== "undefined" &&
        EMAILJS_PUBLIC_KEY !== "YOUR_EMAILJS_PUBLIC_KEY" &&
        EMAILJS_SERVICE_ID !== "YOUR_EMAILJS_SERVICE_ID" &&
        EMAILJS_TEMPLATE_ID !== "YOUR_EMAILJS_TEMPLATE_ID";
}

async function sendConfirmationEmail(booking) {
    if (!isEmailJSConfigured()) {
        throw new Error(
            "Email service is not configured. Add your EmailJS IDs in script.js."
        );
    }

    const templateParams = {
        to_email: booking.email,
        movie_name: booking.movieName,
        showtime: booking.showtime,
        ticket_quantity: String(booking.quantity),
        total_price: formatINR(booking.total),
        booking_id: booking.id
    };

    const response = await window.emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        { publicKey: EMAILJS_PUBLIC_KEY }
    );

    return response;
}

form.addEventListener("submit", async event => {
    event.preventDefault();

    const selectedMovie = getSelectedMovie();
    const tickets = Number(quantity.value);
    const customerEmail = email.value.trim();

    if (!selectedMovie) {
        showMessage("Please select a valid movie.", "error");
        return;
    }

    if (
        quantity.value.trim() === "" ||
        !Number.isInteger(tickets) ||
        tickets < 1 ||
        tickets > 10
    ) {
        showMessage(
            "Enter a whole number of tickets between 1 and 10.",
            "error"
        );
        quantity.focus();
        return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.checkValidity() || !emailPattern.test(customerEmail)) {
        showMessage("Please enter a valid email address.", "error");
        email.focus();
        return;
    }

    const total = selectedMovie.price * tickets;

    const booking = {
        id: crypto.randomUUID(),
        movieId: selectedMovie.id,
        movieName: selectedMovie.name,
        showtime: showtime.value,
        quantity: tickets,
        price: selectedMovie.price,
        total: total,
        email: customerEmail
    };

    bookButton.disabled = true;
    bookButton.textContent = "Sending confirmation...";

    try {
        await sendConfirmationEmail(booking);
        bookings.push(booking);
        saveBookings();

        updateDashboard();
        displayBookings();

        form.reset();
        calculateTotal();

        showMessage(
            `Booking confirmed! Confirmation email sent to ${customerEmail}.`,
            "success"
        );
    } catch (error) {
        console.error("Booking/email error:", error);

        showMessage(
            error.message && error.message.includes("not configured")
                ? error.message
                : "Confirmation email failed. No booking was saved. " +
                  "Check your email configuration and try again.",
            "error"
        );
    } finally {
        bookButton.disabled = false;
        bookButton.textContent = "Confirm booking →";
    }
});

form.addEventListener("reset", () => {
    setTimeout(() => {
        calculateTotal();
        showMessage("", "success");
    }, 0);
});

calculateTotal();
updateDashboard();
displayBookings();
