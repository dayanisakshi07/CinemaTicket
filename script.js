// Get movie details from URL
const params = new URLSearchParams(window.location.search);
const movie = decodeURIComponent(params.get("movie"));
const time = decodeURIComponent(params.get("time"));
const price = parseInt(params.get("price")); // convert to number

// Show movie details
if (document.getElementById("movieTitle")) {
  document.getElementById("movieTitle").innerText = movie;
  document.getElementById("showDetails").innerText =
    `Showtime: ${time} IST | Ticket: ₹${price}`;
}

// Generate seats grid
const seatsContainer = document.getElementById("seats");
if (seatsContainer) {
  for (let i = 1; i <= 60; i++) {
    const seat = document.createElement("div");
    seat.classList.add("seat");
    seat.dataset.seatNum = i;

    // Check LocalStorage for booked seats
    const bookedSeats = JSON.parse(localStorage.getItem(movie + time)) || [];
    if (bookedSeats.includes(i)) seat.classList.add("booked");

    seat.addEventListener("click", () => {
      if (!seat.classList.contains("booked")) seat.classList.toggle("selected");
    });

    seatsContainer.appendChild(seat);
  }
}

// Confirm booking
const confirmBtn = document.getElementById("confirmBtn");
if (confirmBtn) {
  confirmBtn.addEventListener("click", () => {
    const selectedSeats = Array.from(document.querySelectorAll(".seat.selected"))
      .map(seat => parseInt(seat.dataset.seatNum));

    if (selectedSeats.length === 0) {
      alert("Please select at least one seat.");
      return;
    }

    // Save booked seats
    const bookedSeats = JSON.parse(localStorage.getItem(movie + time)) || [];
    const newBooked = [...bookedSeats, ...selectedSeats];
    localStorage.setItem(movie + time, JSON.stringify(newBooked));

    // Generate unique receipt ID
    const receiptID = 'INOX-' + Math.floor(Math.random() * 1000000);

    // Show confirmation / receipt with print button
    document.getElementById("confirmation").innerHTML =
      `<h2>✅ Booking Confirmed!</h2>
       <p>Receipt ID: <strong>${receiptID}</strong></p>
       <p>Movie: ${movie}</p>
       <p>Showtime: ${time} IST</p>
       <p>Seats: ${selectedSeats.join(", ")}</p>
       <p>Total: ₹${selectedSeats.length * price}</p>
       <button id="printBtn" style="
         margin-top:10px;
         padding:8px 16px;
         border:none;
         border-radius:5px;
         background:#ff416c;
         color:white;
         font-weight:bold;
         cursor:pointer;
       ">Print Receipt</button>`;

    // Add event listener to print button
    document.getElementById("printBtn").addEventListener("click", () => {
      window.print();
    });

    // Update UI: mark seats as booked
    document.querySelectorAll(".seat.selected").forEach(seat => {
      seat.classList.remove("selected");
      seat.classList.add("booked");
    });
  });
}
