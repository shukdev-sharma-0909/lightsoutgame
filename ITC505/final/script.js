$(document).ready(function () {
    let gridSize = 3; // Default grid size
    let moves = 0;
    let difficulty = 30; // Default difficulty in seconds
    let timerInterval; // Timer interval reference
    let timeRemaining; // Remaining time

    // Create the grid
    const createGrid = () => {
        const gridContainer = $('#grid-container');
        gridContainer.empty(); // Clear any existing grid
        gridContainer.css({
            'grid-template-columns': `repeat(${gridSize}, 1fr)`,
            'grid-template-rows': `repeat(${gridSize}, 1fr)`,
        });

        for (let i = 0; i < gridSize * gridSize; i++) {
            const button = $('<button>')
                .addClass('on')
                .attr('data-id', i);
            gridContainer.append(button);
        }
    };

    // Toggle light state
    const toggleLight = (id) => {
        const button = $(`[data-id="${id}"]`);
        button.toggleClass('on off');
    };

    // Toggle current button and neighbors
    const toggleNeighbours = (id) => {
        const row = Math.floor(id / gridSize);
        const col = id % gridSize;

        toggleLight(id); // Current button
        if (row > 0) toggleLight(id - gridSize); // Top
        if (row < gridSize - 1) toggleLight(id + gridSize); // Bottom
        if (col > 0) toggleLight(id - 1); // Left
        if (col < gridSize - 1) toggleLight(id + 1); // Right
    };

    // Check if the game is won
    const checkWin = () => {
        const allOff = $('#grid-container button').filter('.on').length === 0;
        if (allOff) {
            clearInterval(timerInterval); // Stop the timer
            alert(`Congratulations! You won in ${moves} moves!`);
        }
    };

    // Handle button click on the grid
    $('#grid-container').on('click', 'button', function () {
        const id = parseInt($(this).attr('data-id'));
        toggleNeighbours(id);
        moves++;
        $('#move-counter').text(moves);
        checkWin();
    });
    // Reset the grid and restart the timer
    $('#reset-btn').on('click', function () {
        moves = 0;
        $('#move-counter').text(moves);
        setTimeLimit(difficulty);  // Reset difficulty timer
        createGrid();               // Recreate the grid
        startTimer();               // Restart the timer
    });

    // Handle grid size button click
    $('.grid-size-btn').on('click', function () {
        gridSize = parseInt($(this).data('size')); // Get grid size from button
        moves = 0; // Reset moves
        $('#move-counter').text(moves);
        createGrid(); // Recreate the grid
        startTimer(); // Restart timer
    });

    // Set difficulty level
    const setTimeLimit = (seconds) => {
        difficulty = seconds; // Update difficulty
        clearInterval(timerInterval); // Stop current timer
        startTimer(); // Restart with new difficulty
    };

    // Start the timer
    const startTimer = () => {
        const timerDisplay = document.getElementById('timer');
        timeRemaining = difficulty; // Set timer to difficulty level
        timerDisplay.innerText = timeRemaining;

        if (timerInterval) clearInterval(timerInterval);

        timerInterval = setInterval(() => {
            timeRemaining--;
            timerDisplay.innerText = timeRemaining;

            if (timeRemaining <= 0) {
                clearInterval(timerInterval);
                alert("Time's up! You lost the challenge.");
                createGrid(); // Reset the grid
                startTimer(); // Restart timer
            }
        }, 1000);
    };

    // Initialize the game
    createGrid();
    startTimer(); // Start timer on load

    // Attach setTimeLimit function to global scope for button click handlers
    window.setTimeLimit = setTimeLimit;
});

// Toggle Crazy Effect on Button Click
$('#toggle-crazy-btn').on('click', function () {
    $('#game-title').toggleClass('crazy-text');
});
