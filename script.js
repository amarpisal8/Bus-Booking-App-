// script.js

// Function to fetch and display passengers
function fetchPassengers() {
    axios.get('https://crudcrud.com/api/db7b28dbc07440518e5aca25f27a84a3/BusAppData')
        .then(response => {
            const passengerTable = document.getElementById('passenger-table');
            passengerTable.innerHTML = ''; // Clear previous data

            response.data.forEach(passenger => {
                // Check if the selected bus matches the filter
                const busFilter = document.getElementById('bus-filter').value;
                if (busFilter === 'all' || passenger.selectedBus === busFilter) {
                    // Create a new row for each passenger
                    const row = passengerTable.insertRow();
                    row.innerHTML = `
                        <td>${passenger.name}</td>
                        <td>${passenger.email}</td>
                        <td>${passenger.phone}</td>
                        <td>${passenger.selectedBus}</td>
                        <td>
                            <button class="delete-btn btn btn-danger" data-id="${passenger._id}">Delete</button>
                            <button class="edit-btn btn btn-primary" data-id="${passenger._id}" data-name="${passenger.name}" data-email="${passenger.email}" data-phone="${passenger.phone}" data-bus="${passenger.selectedBus}">Edit</button>
                        </td>
                    `;
                }
            });
        })
        .catch(error => console.error('Error fetching passengers:', error));
}

// Event listener for form submission
document.getElementById('passenger-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission behavior

    // Get form input values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const selectedBus = document.getElementById('bus-selection').value;

    // Create payload object
    const passengerData = {
        name: name,
        email: email,
        phone: phone,
        selectedBus: selectedBus
    };

    // POST request to add new passenger
    axios.post('https://crudcrud.com/api/db7b28dbc07440518e5aca25f27a84a3/BusAppData', passengerData)
        .then(() => {
            // Clear form inputs
            document.getElementById('name').value = '';
            document.getElementById('email').value = '';
            document.getElementById('phone').value = '';
            // Refresh passenger list
            fetchPassengers();
        })
        .catch(error => console.error('Error adding passenger:', error));
});

// Event listener for delete and edit buttons (event delegation)
document.getElementById('passenger-table').addEventListener('click', function(event) {
    if (event.target.classList.contains('delete-btn')) {
        const passengerId = event.target.dataset.id;
        // DELETE request to remove passenger
        axios.delete(`https://crudcrud.com/api/db7b28dbc07440518e5aca25f27a84a3/BusAppData/${passengerId}`)
            .then(() => {
                // Refresh passenger list
                fetchPassengers();
            })
            .catch(error => console.error('Error deleting passenger:', error));
    } else if (event.target.classList.contains('edit-btn')) {
        // Get data attributes for the selected passenger
        const passengerId = event.target.dataset.id;
        const name = event.target.dataset.name;
        const email = event.target.dataset.email;
        const phone = event.target.dataset.phone;
        const bus = event.target.dataset.bus;

        // Prompt user to edit passenger details
        const newName = prompt('Enter new name:', name);
        const newEmail = prompt('Enter new email:', email);
        const newPhone = prompt('Enter new phone:', phone);
        const newBus = prompt('Enter new bus:', bus);

        // Create payload object
        const editedPassengerData = {
            name: newName,
            email: newEmail,
            phone: newPhone,
            selectedBus: newBus
        };

        // PUT request to update passenger details
        axios.put(`https://crudcrud.com/api/db7b28dbc07440518e5aca25f27a84a3/BusAppData/${passengerId}`, editedPassengerData)
            .then(() => {
                // Refresh passenger list
                fetchPassengers();
            })
            .catch(error => console.error('Error updating passenger:', error));
    }
});

// Event listener for bus filter
document.getElementById('bus-filter').addEventListener('change', fetchPassengers);

// Initial fetch of passengers
fetchPassengers();
