window.addEventListener('load', () => {
    sessionStorage.clear(); // Clear session storage
    document.cookie.split(";").forEach(cookie => {
        const name = cookie.split("=")[0].trim();
        document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/';
    });

});

let scrollTop, scrollLeft, userSignedIn = false, userData = null;

let mainScreenActive = false, starsActive = false, planetsActive = false, asteroidsActive = false, galaxiesActive = false, bhActive = false, aboutActive = false, didYouKnowActive = false, calendarActive = false, horoscopeActive = false;

let touchStartY = 0, touchEndY = 0;

function lockScroll() {
    // Get the current scroll position
    scrollTop = window.scrollY || document.documentElement.scrollTop;
    scrollLeft = window.scrollX || document.documentElement.scrollLeft;

    // Freeze the scroll position by setting the body's overflow to hidden
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollTop}px`; // Preserve the scroll position
    document.body.style.left = `-${scrollLeft}px`;
    document.body.style.width = '100%';
}

function unlockScroll() {
    document.body.style.overflow = ''; // Re-enable scrolling
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.width = '';

    // Restore the scroll position
    window.scrollTo(scrollLeft, scrollTop);
}

function preventScrollEvents(event) {
    event.preventDefault();
    event.stopPropagation();
    return false;
}

function enableScrollEvents() {
    window.removeEventListener('wheel', preventScrollEvents, { passive: false });
    window.removeEventListener('touchmove', preventScrollEvents, { passive: false });
    window.removeEventListener('keydown', preventScrollEvents);
}

function disableScrollEvents() {
    window.addEventListener('wheel', preventScrollEvents, { passive: false });
    window.addEventListener('touchmove', preventScrollEvents, { passive: false });
    window.addEventListener('keydown', function (event) {
        // Disable specific keys like arrow keys, PageUp/Down, and spacebar
        if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', ' '].includes(event.key)) {
            preventScrollEvents(event);
        }
    });
}

function navigateTo(view) {
    const currentUrl = new URL(window.location.href);
    currentUrl.hash = view; // Update only the hash

    // Add a new entry even if the hash is the same
    window.history.pushState({ path: currentUrl.href }, '', currentUrl.href);
}

function renderPage() {
    const cardContainer = document.querySelector('.card-container');
    const firstImage = document.querySelector('.image.first');
    const secondImage = document.querySelector('.image.second');

    // Zoom in the first image and fade it into the second image
    secondImage.style.transform = 'scale(1.2)';
    secondImage.style.opacity = '0';
    firstImage.style.opacity = '1';
    firstImage.style.transform = 'scale(1.2)';
    cardContainer.innerHTML = ''; // Clear the existing cards

    cardContainer.classList.remove('sub-cards');  // This line adds the class
    cardContainer.classList.remove('stars-sub-cards');  // This line adds the class
    cardContainer.classList.remove('planets-sub-cards');  // This line adds the class
    cardContainer.classList.remove('asteroids-sub-cards');  // This line adds the class
    cardContainer.classList.remove('galaxies-sub-cards');  // This line adds the class
    cardContainer.classList.remove('black-holes-sub-cards');  // This line adds the class

    mainScreenActive = false;
    starsActive = false;
    planetsActive = false;
    asteroidsActive = false;
    galaxiesActive = false;
    bhActive = false;
    aboutActive = false;
    didYouKnowActive = false;
    calendarActive = false;
    horoscopeActive = false;

    removeAbout();
    removeDidYouKnow();
    removeCalendar();
    removeHoroscope();

    lockScroll(); // Call lockScroll to disable all scrolling
    disableScrollEvents(); // Block scroll events
}

function renderMainCards() {
    const cardContainer = document.querySelector('.card-container');
    const searchBarContainer = document.querySelector('.search-bar-container');
    toggleLoginLogout();
    searchBarContainer.style.display = 'flex';
    renderPage();
    removeCalendar();

    // Render the cards
    cardContainer.innerHTML = cardsHTML;

    // Move the search bar to the normal position
    setTimeout(() => {
        searchBarContainer.style.top = '30%';
        document.querySelector(".home-icon-container").style.display = "none";

        // Check if the device width is less than 768px (common breakpoint for mobile)
        if (window.innerWidth <= 768) {
            searchBarContainer.style.width = "80%";
            document.getElementById("searchBarInput").placeholder = "Search..."; // Shorten placeholder text
        }
        else {
            document.getElementById("searchBarInput").placeholder = "Search for celestial bodies..."; // Shorten placeholder text
        }

    }, 200); // Delay to match the timing of the image transition


    if (window.location.hash === '#Home-Page') {
        // The URL contains only "#Home-Page"
    } else {
        navigateTo('#Home-Page');
        mainScreenActive = true;
    }

}

document.addEventListener("DOMContentLoaded", function () {
    renderMainCards();
});

function triggerZoomEffect(cardType) {
    const firstImage = document.querySelector('.image.first');
    const secondImage = document.querySelector('.image.second');
    const searchBarContainer = document.querySelector('.search-bar-container');

    // Zoom in the first image and fade it into the second image
    firstImage.style.transform = 'scale(1.2)';
    firstImage.style.opacity = '0';
    secondImage.style.opacity = '1';
    secondImage.style.transform = 'scale(1.2)';

    // Move the search bar to the top
    setTimeout(() => {
        searchBarContainer.style.top = '5%'; // Move search bar to the top of the screen
        document.querySelector(".home-icon-container").style.display = "block";

        // Check if the device width is less than 768px (common breakpoint for mobile)
        if (window.innerWidth <= 768) {
            searchBarContainer.style.width = "60%"; // Make it smaller
            document.getElementById("searchBarInput").placeholder = "Search..."; // Shorten placeholder text
        } else {
            searchBarContainer.style.width = "50%"; // Default width for desktop
            document.getElementById("searchBarInput").placeholder = "Search for celestial bodies....";
        }

    }, 500); // Delay to match the timing of the image transition

    // Change the cards dynamically based on the clicked card
    setTimeout(() => {
        updateCards(cardType);
    }, 400); // Match with transition timing
}

// Function to toggle between Login and Logout buttons
function toggleLoginLogout() {
    const loginButton = document.getElementById("open-popup");
    const logoutButton = document.getElementById("logout-popup");

    if (userSignedIn) {
        // Show the logout button and hide the login button
        loginButton.style.display = "none";
        logoutButton.style.display = "inline-block";
    } else {
        // Show the login button and hide the logout button
        loginButton.style.display = "inline-block";
        logoutButton.style.display = "none";
    }
}

// Call the function to check user status on page load
toggleLoginLogout();

function logOut() {
    userData = null;
    userSignedIn = false;
    alert("You have logged out");
    toggleLoginLogout();
}

const hamburgerButton = document.querySelector('.hamburger');
const menu = document.querySelector('.menu');
const menuItems = document.querySelectorAll('.menu-item');

let isMenuOpen = false; // Track the menu state
menu.classList.add('hidden');

menuItems.forEach((item, index) => {
    let height, url;
    switch (index) {
        case 0:
            height = '30vh';
            url = 'Images/Home.JPG';
            break;
        case 1:
            height = '40vh';
            url = 'Images/About.JPG';
            break;
        case 2:
            height = '50vh';
            url = 'Images/Did_you_know.JPG';
            break;
        case 3:
            height = '60vh';
            url = 'Images/Calendar.JPG';
            break;
        case 4:
            height = '70vh';
            url = 'Images/Horoscope.JPG';
            break;
    }
    item.style.height = height;
    item.style.backgroundImage = `url(${url})`;
});

// Function to handle menu toggling and animation
function openMenu() {
    if (!isMenuOpen) {
        showMenu(); // Show menu with JavaScript-controlled animation
    } else {
        hideMenu(); // Hide menu with JavaScript-controlled animation
    }
}

// Function to show menu
function showMenu() {
    menu.classList.remove('hidden');
    menu.style.pointerEvents = 'auto'; // Enable interaction

    hamburgerButton.style.display = "none";

    const menuItems = document.querySelectorAll('.menu-item');

    // Animate menu items dropping down
    menuItems.forEach((item, index) => {
        setTimeout(() => {
            item.style.transition = 'transform 0.8s ease, opacity 0.8s ease';
            item.style.transform = 'translateY(0)';
            item.style.opacity = 0.7;
        }, index * 100); // Stagger animations with increasing delay
    });
    isMenuOpen = true;
}

// Increase opacity on hover or based on some event
menuItems.forEach(item => {
    item.addEventListener('mouseover', () => {
        item.style.opacity = 1; // Fully opaque on hover
    });
    item.addEventListener('mouseout', () => {
        item.style.opacity = 0.7; // Semi-transparent when mouse is out
    });
});

// Function to hide menu
function hideMenu() {

    hamburgerButton.style.display = "block";

    // Animate menu items sliding up
    menuItems.forEach((item, index) => {
        setTimeout(() => {
            item.style.transition = 'transform 0.8s ease, opacity 0.8s ease';
            item.style.transform = 'translateY(-100%)';
            item.style.opacity = 0;
        }, index * 100); // Reverse the order of animation delay
    });

    // After animation completes, hide the menu
    setTimeout(() => {
        menu.classList.add('hidden');
        menu.style.pointerEvents = 'none'; // Disable interaction
    }, menuItems.length * 100 + 200); // Ensure hide happens after animation completes
    isMenuOpen = false;
}

document.addEventListener("click", (event) => {
    const menuItems = document.querySelectorAll(".menu-item"); // All clickable menu items
    const hamburgerButton = document.querySelector(".hamburger");

    // Ensure elements exist
    if (!menuItems.length || !hamburgerButton) return;

    // Check if the clicked element is NOT a menu item AND NOT the hamburger button
    const clickedInsideMenuItem = Array.from(menuItems).some(item => item.contains(event.target));
    const clickedHamburger = hamburgerButton.contains(event.target);

    if (!menu.classList.contains("hidden") && !clickedInsideMenuItem && !clickedHamburger) {
        hideMenu(); // Close the menu
    }
});

function clearItems() {
    const searchBarContainer = document.querySelector('.search-bar-container');
    const loginButton = document.getElementById("open-popup");
    const logoutButton = document.getElementById("logout-popup");
    loginButton.style.display = 'none';
    logoutButton.style.display = 'none';
    searchBarContainer.style.display = 'none';
    document.querySelector(".home-icon-container").style.display = "none";
}

function homeNavView() {
    const zoomedCard = document.getElementById("zoomed-card");
    hideMenu();
    removeAbout();
    removeDidYouKnow();
    removeCalendar();
    removeHoroscope();
    if (!zoomedCard.classList.contains("hidden")) {
        closeZoomedCard();
        window.history.back();
    }
    renderMainCards();
    toggleLoginLogout();

}

function aboutUsView() {
    const zoomedCard = document.getElementById("zoomed-card");
    hideMenu();
    removeDidYouKnow();
    removeCalendar();
    removeHoroscope();

    // Remove any existing "about-us-section" before creating a new one
    removeAbout();

    if (!zoomedCard.classList.contains("hidden")) {
        closeZoomedCard();
        window.history.back();
    }

    renderPage();
    clearItems();

    if (!window.location.hash.includes('#Home-Page/About-Us')) {
        setTimeout(() => {
            navigateTo('#Home-Page/About-Us');
        }, 100);
        aboutActive = true;
    }

    unlockScroll();
    enableScrollEvents();

    // New section creation
    const invisibleSection = document.createElement("div");
    invisibleSection.id = "about-us-section";  // Ensure the ID is set correctly here
    invisibleSection.style.position = "fixed";
    invisibleSection.style.top = 0;
    invisibleSection.style.left = 0;
    invisibleSection.style.width = "100%";
    invisibleSection.style.height = "100%";
    invisibleSection.style.backgroundColor = "rgba(0, 0, 0, 0.5)"; // Transparent overlay
    invisibleSection.style.display = "flex";
    invisibleSection.style.justifyContent = "center";
    invisibleSection.style.alignItems = "center";
    invisibleSection.style.zIndex = "1000";

    // Centered rectangle
    const aboutUsContainer = document.createElement("div");
    aboutUsContainer.id = "about-us-box";
    aboutUsContainer.style.width = "80%";
    aboutUsContainer.style.maxWidth = "90%";
    aboutUsContainer.style.height = "80vh"; // Fix height so content can scroll
    aboutUsContainer.style.maxHeight = "80vh"; // Ensures it doesn't go beyond screen
    aboutUsContainer.style.padding = "20px";
    aboutUsContainer.style.border = "2px solid white";
    aboutUsContainer.style.borderRadius = "10px";
    aboutUsContainer.style.backgroundColor = "transparent";
    aboutUsContainer.style.textAlign = "center";
    aboutUsContainer.style.overflowY = "auto"; // Enable scrolling inside
    aboutUsContainer.style.overflowX = "hidden"; // Prevent horizontal scrolling

    // Header
    const header = document.createElement("h1");
    header.innerHTML = "About Us <br>";
    header.style.margin = "10px 0";
    header.style.fontSize = "2.6rem";
    header.style.color = "white";

    // Paragraph
    const paragraph = document.createElement("p");
    paragraph.innerHTML = "From the moment we first gazed up at the night sky, we were captivated by the vastness of the cosmos, sparking our curiosity and wonder. As children, stories of distant galaxies ignited our imaginations, leaving us longing to understand what lies beyond. Today, our platform rekindles that sense of awe, inviting both seasoned stargazers and curious newcomers to explore the universe. Whether you're fascinated by celestial wonders or simply want to check your horoscope, logging in opens the door to a world of cosmic discovery. <br><br> As we look to the future, we encourage everyone to embrace the endless possibilities of space. The night sky holds beauty, mystery, and stories passed down through generations—just waiting to be explored. Take a moment to look up, dream, and imagine what lies beyond. Together, we can unlock the secrets of the cosmos, one star at a time."
    paragraph.style.margin = "10px 0";
    paragraph.style.fontSize = "1.6rem";
    paragraph.style.color = "white";

    // Append elements
    aboutUsContainer.appendChild(header);
    aboutUsContainer.appendChild(paragraph);
    invisibleSection.appendChild(aboutUsContainer);
    document.body.appendChild(invisibleSection);
}

function removeAbout() {
    const aboutUsSection = document.getElementById("about-us-section");
    if (aboutUsSection) {
        aboutUsSection.remove();  // Removes the element from the DOM
        aboutActive = false;
    }
}


function didYouKnowView() {
    const zoomedCard = document.getElementById("zoomed-card");
    hideMenu();
    removeAbout();
    removeCalendar();
    removeHoroscope();

    if (!zoomedCard.classList.contains("hidden")) {
        closeZoomedCard();
        window.history.back();
    }

    renderPage();
    clearItems();

    if (!window.location.hash.includes('#Home-Page/Did-You-Know')) {
        navigateTo('#Home-Page/Did-You-Know');
        didYouKnowActive = true;
    }

    unlockScroll();
    enableScrollEvents();

    // Create the invisible section
    const invisibleSection = document.createElement("div");
    invisibleSection.id = "did-you-know-section";
    invisibleSection.style.position = "fixed";
    invisibleSection.style.top = 0;
    invisibleSection.style.left = 0;
    invisibleSection.style.width = "100%";
    invisibleSection.style.height = "100%";
    invisibleSection.style.backgroundColor = "rgba(0, 0, 0, 0.5)"; // Transparent overlay
    invisibleSection.style.display = "flex";
    invisibleSection.style.justifyContent = "center";
    invisibleSection.style.alignItems = "center";
    invisibleSection.style.zIndex = "1000";

    // Create inner section with a column layout for header and row for facts
    const innerSection = document.createElement("div");
    innerSection.style.maxHeight = "80vh";  // Set a max height to trigger scrolling
    innerSection.style.overflowY = "auto";  // Enable vertical scrolling
    innerSection.style.overflowX = "hidden";  // Prevent horizontal scrolling
    innerSection.style.width = "80%";
    innerSection.style.padding = "20px";
    innerSection.style.border = "2px solid white";
    innerSection.style.borderRadius = "10px";
    innerSection.style.backgroundColor = "transparent";
    innerSection.style.textAlign = "center";
    innerSection.style.display = "flex";
    innerSection.style.flexDirection = "column";  // Keep header in column, facts in row
    innerSection.style.alignItems = "center";  // Center items horizontally

    // Add header
    const header = document.createElement("h1");
    header.innerHTML = "Did You Know?<br>";
    header.style.margin = "10px 0";
    header.style.fontSize = "2.6rem";
    header.style.color = "white";
    innerSection.appendChild(header);

    if (window.innerWidth <= 768) {
        const headerLine = document.createElement("hr");
        headerLine.style.width = "100%";
        headerLine.style.border = "1px solid white";
        headerLine.style.margin = "10px 0";
        innerSection.appendChild(headerLine);
    }


    // Create a container for facts (arranged in a row)
    const factsContainer = document.createElement("div");
    factsContainer.style.display = "flex";
    factsContainer.style.flexDirection = "row";  // Arrange facts in a row
    factsContainer.style.overflow = "visible";  // Ensure child elements are fully visible
    factsContainer.style.height = "auto";  // Allow it to expand naturally
    factsContainer.style.maxWidth = "100%";  // Prevent horizontal overflow
    factsContainer.style.justifyContent = "center";  // Center the row
    factsContainer.style.alignItems = "center";  // Center vertically
    if (window.innerWidth > 768) {  // Desktop View
        factsContainer.style.flexWrap = "nowrap";  // Allow facts to wrap into multiple lines
    } else {  // Mobile View
        factsContainer.style.flexWrap = "wrap";  // Allow facts to wrap into multiple lines
    }

    // Add facts with text, number, and additional text
    const facts = [
        { text1: "Jupiter can fit ", number: 1300, text2: "earths within it, it's that massive!" },
        { text1: "Saturn, the 7-ringed planet has", number: 146, text2: "moons, the most moons a planet has in the solar system!" },
        { text1: "Canis Major Dwarf Galaxy is", number: 30000, text2: "light years away and it is the closest galaxy from earth!" },
        { text1: "Sagittarius A has a diameter of ", number: 24000, text2: "thousand kilometers including the event horizon. It is at the center of our galaxy." },
        { text1: "Vesta has a diameter of", number: 530, text2: "kilometers. It is the largest asteroid in the asteroid belt." },
    ];

    const totalDuration = 5000; // Total duration in ms (5 seconds)

    facts.forEach((fact, index) => {
        const factDiv = document.createElement("div");
        factDiv.style.marginRight = "20px";  // Space between facts
        factDiv.style.marginLeft = "20px";  // Space between facts

        // Fact text 1
        const factText1 = document.createElement("p");
        factText1.textContent = fact.text1;
        factText1.style.fontSize = "1.5rem";
        factText1.style.color = "white";
        factDiv.appendChild(factText1);

        // Fact number
        const factNumber = document.createElement("span");
        factNumber.style.fontSize = "3rem";
        factNumber.style.color = "white";
        factNumber.textContent = "0";
        factDiv.appendChild(factNumber);

        // Fact text 2
        const factText2 = document.createElement("p");
        factText2.textContent = fact.text2;
        factText2.style.fontSize = "1.5rem";
        factText2.style.color = "white";
        factDiv.appendChild(factText2);

        factsContainer.appendChild(factDiv);

        // Add a horizontal line after each fact (except the last one)
        if (window.innerWidth <= 768 && index !== facts.length - 1) {
            const factLine = document.createElement("hr");
            factLine.style.width = "100%";
            factLine.style.border = "0.5px solid white";
            factLine.style.margin = "10px 0";
            factsContainer.appendChild(factLine);
        }

        // Calculate the total number of all facts to normalize the animation speed
        const maxNumber = 30000; // The highest number among all facts
        const factor = totalDuration / (maxNumber / 50); // 50 is the time step for each increment (to ensure smooth animation)

        // Animate the number counting
        let count = 0;
        const targetNumber = fact.number;
        const increment = targetNumber / (totalDuration / 50); // This ensures all animations finish in 5 seconds

        function animateNumber() {
            if (count < targetNumber) {
                count += increment;
                factNumber.textContent = Math.floor(count);
                setTimeout(animateNumber, 50);
            } else {
                factNumber.textContent = targetNumber;
            }
        }

        animateNumber();
    });

    // Append facts container and inner section to invisible section
    innerSection.appendChild(factsContainer);
    invisibleSection.appendChild(innerSection);
    document.body.appendChild(invisibleSection);
}

let resizeTimeout;

window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout); // Clear any previous timeout to prevent spam

    resizeTimeout = setTimeout(() => {
        if (didYouKnowActive && (window.innerWidth !== prevWidth || window.innerHeight !== prevHeight)) {
            prevWidth = window.innerWidth;
            prevHeight = window.innerHeight;

            didYouKnowView(); // Re-render the page
        }
    }, 100); // Wait 100ms before triggering re-render (prevents excessive calls)
});

// Store initial dimensions
let prevWidth = window.innerWidth;
let prevHeight = window.innerHeight;

// Function to remove the section
function removeDidYouKnow() {
    const didYouKnowSection = document.getElementById("did-you-know-section");
    if (didYouKnowSection) {
        document.body.removeChild(didYouKnowSection);
        didYouKnowActive = false;
    }
}


function calendarView() {
    const zoomedCard = document.getElementById("zoomed-card");
    const calendarView = document.getElementById("calendar");
    hideMenu();
    removeAbout();
    removeDidYouKnow();
    removeHoroscope();

    // Ensure that we're in the right state before updating URL
    if (!zoomedCard.classList.contains("hidden")) {
        closeZoomedCard();
        window.history.back();  // Close the zoomed card without affecting history
    }

    // Clear other content (if necessary)
    renderPage();
    clearItems();

    // Inject calendar content
    calendarView.innerHTML = `
							<section class="calendar-section">
								<div class="calendar-container">
									<div class="calendar-header">
										<button id="prev-month">&lt;</button>
										<h3 id="month-year"></h3>
										<button id="next-month">&gt;</button>
									</div>
									<div class="calendar-days">
										<!-- Weekday Labels -->
										<div class="weekday">Sun</div>
										<div class="weekday">Mon</div>
										<div class="weekday">Tue</div>
										<div class="weekday">Wed</div>
										<div class="weekday">Thu</div>
										<div class="weekday">Fri</div>
										<div class="weekday">Sat</div>
									</div>
									<!-- Dates will be dynamically generated here -->
									<div id="calendar-grid"></div>
								</div>
							</section>`;

    // Generate the calendar
    const calendarGrid = document.getElementById("calendar-grid");
    const monthYear = document.getElementById("month-year");
    const prevMonthBtn = document.getElementById("prev-month");
    const nextMonthBtn = document.getElementById("next-month");

    let currentDate = new Date();
    const cachedImportantDates = {}; // Assume this will be populated from your Excel or another source

    // Function to generate the calendar
    function generateCalendar(date) {
        calendarGrid.innerHTML = "";  // Clear existing calendar grid
        const month = date.getMonth();  // Get current month
        const year = date.getFullYear(); // Get current year
        monthYear.textContent = date.toLocaleString("default", { month: "long", year: "numeric" });  // Update month-year display
        const firstDay = new Date(year, month, 1).getDay(); // Get the first day of the month
        const daysInMonth = new Date(year, month + 1, 0).getDate(); // Get the total days in the month

        // Add empty cells for the leading days of the month (before the first day)
        for (let i = 0; i < firstDay; i++) {
            const emptyDiv = document.createElement("div");
            calendarGrid.appendChild(emptyDiv);
        }

        // Loop through each day of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayDiv = document.createElement("div");
            const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;  // Create the date string

            dayDiv.textContent = day;

            // Check if there is an important event for this date
            if (cachedImportantDates[dateKey]) {
                dayDiv.classList.add("important");
                dayDiv.setAttribute("data-tooltip", cachedImportantDates[dateKey]);  // Add tooltip
            }

            calendarGrid.appendChild(dayDiv);
        }
    }

    // Event listeners for prev and next buttons
    prevMonthBtn.addEventListener("click", () => {
        currentDate.setMonth(currentDate.getMonth() - 1);  // Move back one month
        generateCalendar(currentDate);  // Re-render the calendar with the new date
    });

    nextMonthBtn.addEventListener("click", () => {
        currentDate.setMonth(currentDate.getMonth() + 1);  // Move forward one month
        generateCalendar(currentDate);  // Re-render the calendar with the new date
    });

    // Function to initialize the calendar
    async function initializeCalendar() {
        try {
            // Load the important dates from your Excel sheet or cache (the cachedImportantDates should be populated here)
            await loadImportantDates();  // Ensure that cachedImportantDates is populated

            // Generate the calendar for the current date
            generateCalendar(currentDate);

            // Update the URL to reflect the calendar view
            setTimeout(function () {
                if (!window.location.hash.includes('#Home-Page/Calendar')) {
                    navigateTo('#Home-Page/Calendar');
                    calendarActive = true;
                }  // Change the URL after loading
            }, 500);  // Delay of 500ms to ensure the calendar is visible before URL update
        } catch (error) {
            console.error("Error initializing the calendar:", error);
        }
    }

    // Example of how to load the important dates from Excel
    async function loadImportantDates() {
        try {
            const response = await fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vQwvnfmZ7eBhRvg0FqN41Cs8MChu1n91tzIj3uJWlm5CeVLgmAgaEdxqt4TXu0CBw/pub?gid=304422980&single=true&output=csv"); // Replace with your Sheet2 CSV URL
            const csvText = await response.text();
            const result = Papa.parse(csvText, {
                header: true,
                skipEmptyLines: true,
                dynamicTyping: true
            });
            result.data.forEach(row => {
                const date = row.Dates;
                const description = row.ImportanceOfDate;
                const formattedDate = formatExcelDate(date); // Keep existing date formatting
                if (formattedDate && description) {
                    cachedImportantDates[formattedDate] = description;
                }
            });
        } catch (error) {
            console.error("Error loading important dates from Google Sheets:", error);
        }
    }

    // Function to format Excel date (if it's in serial number format)
    function formatExcelDate(excelDate) {
        if (!excelDate) return null;

        const excelEpoch = new Date(1899, 11, 30);  // Excel's epoch is 30th December 1899
        const jsDate = new Date(excelEpoch.getTime() + (excelDate * 86400000));  // Convert days to milliseconds

        // Format date to yyyy-mm-dd for consistency
        const year = jsDate.getFullYear();
        const month = String(jsDate.getMonth() + 1).padStart(2, '0');
        const day = String(jsDate.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    }

    // Initialize the calendar on page load
    initializeCalendar();
}


function removeCalendar() {
    const calendarView = document.getElementById("calendar");
    if (calendarView) {
        calendarView.innerHTML = ''; // Clear the calendar content
        calendarActive = false;
    }
}

async function horoscopeView() {
    const zoomedCard = document.getElementById("zoomed-card");
    hideMenu();
    removeAbout();
    removeDidYouKnow();
    removeCalendar();
    removeHoroscope();

    if (!zoomedCard.classList.contains("hidden")) {
        closeZoomedCard();
        window.history.back();
    }

    if (!window.location.hash.includes('#Home-Page/Horoscope')) {
        navigateTo('#Home-Page/Horoscope');
        horoscopeActive = true;
    }

    if (!userSignedIn) {
        document.getElementById("popup").style.display = "flex"; // Show the popup
        renderMainCards();
    } else {
        renderPage();
        clearItems();

        unlockScroll();
        enableScrollEvents();

        // Get the user's date of birth from the userData object
        const dob = userData.DateOfBirth; // Assuming userData has a DateOfBirth field
        const starSign = getStarSign(dob); // Get the star sign

        // Await the horoscope prediction
        const horoscope = await getHoroscope(starSign);

        // New section creation
        const invisibleSection = document.createElement("div");
        invisibleSection.id = "horoscope-section"; // Ensure the ID is set correctly here
        invisibleSection.style.position = "fixed";
        invisibleSection.style.top = 0;
        invisibleSection.style.left = 0;
        invisibleSection.style.width = "100%";
        invisibleSection.style.height = "100%";
        invisibleSection.style.backgroundColor = "rgba(0, 0, 0, 0.5)"; // Transparent overlay
        invisibleSection.style.display = "flex";
        invisibleSection.style.justifyContent = "center";
        invisibleSection.style.alignItems = "center";
        invisibleSection.style.zIndex = "1000";

        // Centered rectangle (Horoscope Box)
        const horoscopeContainer = document.createElement("div");
        horoscopeContainer.id = "horoscope-box";
        horoscopeContainer.style.width = "80%";
        horoscopeContainer.style.maxWidth = "90%";
        horoscopeContainer.style.height = "80vh"; // Fix height so content can scroll
        horoscopeContainer.style.maxHeight = "80vh"; // Ensures it doesn't go beyond screen
        horoscopeContainer.style.padding = "20px";
        horoscopeContainer.style.border = "2px solid white";
        horoscopeContainer.style.borderRadius = "10px";
        horoscopeContainer.style.backgroundColor = "rgba(0, 0, 0, 0.5)"; // Slightly visible background
        horoscopeContainer.style.textAlign = "center";
        horoscopeContainer.style.overflowY = "auto"; // Enable scrolling inside
        horoscopeContainer.style.overflowX = "hidden"; // Prevent horizontal scrolling

        // Header with star sign
        const header = document.createElement("h1");
        header.innerHTML = `${starSign}`; // Display star sign as the header
        header.style.margin = "10px 0";
        header.style.fontSize = "2.6rem";
        header.style.color = "white";

        // Paragraph with horoscope prediction
        const paragraph = document.createElement("p");
        paragraph.innerHTML = horoscope;
        paragraph.style.margin = "10px 0";
        paragraph.style.fontSize = "1.6rem";
        paragraph.style.color = "white";

        // Append elements
        horoscopeContainer.appendChild(header);
        horoscopeContainer.appendChild(paragraph);
        invisibleSection.appendChild(horoscopeContainer);
        document.body.appendChild(invisibleSection);

    }
}

// Function to determine the star sign based on the DOB
function getStarSign(dob) {
    const date = new Date(dob);
    const month = date.getMonth() + 1; // Get month (1-based index)
    const day = date.getDate(); // Get day

    // List of star signs with their date ranges
    const starSigns = [
        { sign: "♈ Aries ♈", start: { month: 3, day: 21 }, end: { month: 4, day: 19 } },
        { sign: "♉ Taurus ♉", start: { month: 4, day: 20 }, end: { month: 5, day: 20 } },
        { sign: "♊ Gemini ♊", start: { month: 5, day: 21 }, end: { month: 6, day: 20 } },
        { sign: "♋ Cancer ♋", start: { month: 6, day: 21 }, end: { month: 7, day: 22 } },
        { sign: "♌ Leo ♌", start: { month: 7, day: 23 }, end: { month: 8, day: 22 } },
        { sign: "♍ Virgo ♍", start: { month: 8, day: 23 }, end: { month: 9, day: 22 } },
        { sign: "♎ Libra ♎", start: { month: 9, day: 23 }, end: { month: 10, day: 22 } },
        { sign: "♏ Scorpio ♏", start: { month: 10, day: 23 }, end: { month: 11, day: 21 } },
        { sign: "♐ Sagittarius ♐", start: { month: 11, day: 22 }, end: { month: 12, day: 21 } },
        { sign: "♑ Capricorn ♑", start: { month: 12, day: 22 }, end: { month: 1, day: 19 } },
        { sign: "♒ Aquarius ♒", start: { month: 1, day: 20 }, end: { month: 2, day: 18 } },
        { sign: "♓ Pisces ♓", start: { month: 2, day: 19 }, end: { month: 3, day: 20 } }
    ];

    // Loop through each sign and check if the DOB matches
    for (let i = 0; i < starSigns.length; i++) {
        const sign = starSigns[i];
        if ((month === sign.start.month && day >= sign.start.day) || (month === sign.end.month && day <= sign.end.day)) {
            return sign.sign;
        }
    }
    return "Unknown"; // If no match, return "Unknown"
}

// Function to return a horoscope based on the star sign
async function loadHoroscopesFromExcel() {
    const horoscopes = {};
    try {
        const response = await fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vQwvnfmZ7eBhRvg0FqN41Cs8MChu1n91tzIj3uJWlm5CeVLgmAgaEdxqt4TXu0CBw/pub?gid=167769837&single=true&output=csv"); // Replace with your Sheet4 CSV URL
        const csvText = await response.text();
        const result = Papa.parse(csvText, {
            header: true,
            skipEmptyLines: true,
            dynamicTyping: true
        });
        result.data.forEach(row => {
            const starSign = row["Star Sign"]?.toString().trim();
            const prediction = row["Prediction"];
            if (starSign && prediction) {
                horoscopes[starSign] = prediction;
            }
        });
        return horoscopes;
    } catch (error) {
        console.error("Error loading horoscopes from Google Sheets:", error);
        return {};
    }
}

async function getHoroscope(starSign) {
    const horoscopes = await loadHoroscopesFromExcel();
    return horoscopes[starSign.slice(2, -2).trim()] || "Your horoscope is unavailable today.";
}

function removeHoroscope() {
    const horoscopeSection = document.getElementById("horoscope-section");
    if (horoscopeSection) {
        horoscopeSection.remove();  // Removes the element from the DOM
        horoscopeActive = false;
    }
}

function renderCards(cardType, setNumber) {
    cardSets = generateCards(cardType);

    // Assuming you have a container element for the cards
    const cardContainer = document.querySelector('.card-container');
    cardContainer.innerHTML = '';

    // Assuming you have a container element for the cards
    // Append each card in the set
    if (cardSets[setNumber]) {
        for (let i = 0; i < 10; i++) {
            cardContainer.innerHTML += cardSets[setNumber][i];
        }
    }
}

function updateCards(cardType) {
    const cardContainer = document.querySelector('.card-container');
    cardContainer.innerHTML = ''; // Clear the existing cards

    removeCalendar();

    mainScreenActive = false;

    // Add the 'sub-cards' class to adjust positioning
    cardContainer.classList.add('sub-cards');  // This line adds the class

    unlockScroll();
    enableScrollEvents();

    if (cardType === 'stars') {
        cardContainer.classList.add('stars-sub-cards');  // This line adds the class
        cardContainer.classList.remove('planets-sub-cards');  // This line adds the class
        cardContainer.classList.remove('asteroids-sub-cards');  // This line adds the class
        cardContainer.classList.remove('galaxies-sub-cards');  // This line adds the class
        cardContainer.classList.remove('black-holes-sub-cards');  // This line adds the class

        starsActive = true;
        planetsActive = false;
        asteroidsActive = false;
        galaxiesActive = false;
        bhActive = false;

        // Detect touch start position
        window.addEventListener('touchstart', (event) => {
            touchStartY = event.touches[0].clientY; // Get initial Y position
        }, false);

        // Detect touch end position and determine scroll direction
        window.addEventListener('touchend', (event) => {
            touchEndY = event.changedTouches[0].clientY; // Get final Y position
            handleSwipe(); // Call function to check swipe direction
        }, false);

        // Wheel Scroll (Desktop)
        window.addEventListener('wheel', (event) => {
            if (!cardContainer.classList.contains('stars-sub-cards')) return;

            if (event.deltaY > 0) {
                if (currentSet === cardSets.length) return;
                cardContainer.innerHTML = '';
                renderCards(cardType, currentSet);
                currentSet += 1;
            } else if (event.deltaY < 0) {
                if (currentSet === 1) return;
                cardContainer.innerHTML = '';
                renderCards(cardType, currentSet - 2);
                currentSet -= 1;
            }
        });

        // Keyboard Navigation (Arrow Keys)
        window.addEventListener('keydown', (event) => {
            if (!cardContainer.classList.contains('stars-sub-cards')) return;

            if (event.key === "ArrowDown") {
                if (currentSet === cardSets.length) return;
                cardContainer.innerHTML = '';
                renderCards(cardType, currentSet);
                currentSet += 1;
            } else if (event.key === "ArrowUp") {
                if (currentSet === 1) return;
                cardContainer.innerHTML = '';
                renderCards(cardType, currentSet - 2);
                currentSet -= 1;
            }
        });
    }

    else if (cardType === 'planets') {
        cardContainer.classList.add('planets-sub-cards');  // This line adds the class
        cardContainer.classList.remove('stars-sub-cards');  // This line adds the class
        cardContainer.classList.remove('asteroids-sub-cards');  // This line adds the class
        cardContainer.classList.remove('galaxies-sub-cards');  // This line adds the class
        cardContainer.classList.remove('black-holes-sub-cards');  // This line adds the class

        planetsActive = true;
        starsActive = false;
        asteroidsActive = false;
        galaxiesActive = false;
        bhActive = false;

        // Detect touch start position
        window.addEventListener('touchstart', (event) => {
            touchStartY = event.touches[0].clientY; // Get initial Y position
        }, false);

        // Detect touch end position and determine scroll direction
        window.addEventListener('touchend', (event) => {
            touchEndY = event.changedTouches[0].clientY; // Get final Y position
            handleSwipe(); // Call function to check swipe direction
        }, false);

        // Wheel Scroll (Desktop)
        window.addEventListener('wheel', (event) => {
            if (!cardContainer.classList.contains('planets-sub-cards')) return;

            if (event.deltaY > 0) {
                if (currentSet === cardSets.length) return;
                cardContainer.innerHTML = '';
                renderCards(cardType, currentSet);
                currentSet += 1;
            } else if (event.deltaY < 0) {
                if (currentSet === 1) return;
                cardContainer.innerHTML = '';
                renderCards(cardType, currentSet - 2);
                currentSet -= 1;
            }
        });

        // Keyboard Navigation (Arrow Keys)
        window.addEventListener('keydown', (event) => {
            if (!cardContainer.classList.contains('planets-sub-cards')) return;

            if (event.key === "ArrowDown") {
                if (currentSet === cardSets.length) return;
                cardContainer.innerHTML = '';
                renderCards(cardType, currentSet);
                currentSet += 1;
            } else if (event.key === "ArrowUp") {
                if (currentSet === 1) return;
                cardContainer.innerHTML = '';
                renderCards(cardType, currentSet - 2);
                currentSet -= 1;
            }
        });
    }

    else if (cardType === 'asteroids') {
        cardContainer.classList.add('asteroids-sub-cards');  // This line adds the class
        cardContainer.classList.remove('stars-sub-cards');  // This line adds the class
        cardContainer.classList.remove('planets-sub-cards');  // This line adds the class
        cardContainer.classList.remove('galaxies-sub-cards');  // This line adds the class
        cardContainer.classList.remove('black-holes-sub-cards');  // This line adds the class

        asteroidsActive = true;
        starsActive = false;
        planetsActive = false;
        galaxiesActive = false;
        bhActive = false;

        // Detect touch start position
        window.addEventListener('touchstart', (event) => {
            touchStartY = event.touches[0].clientY; // Get initial Y position
        }, false);

        // Detect touch end position and determine scroll direction
        window.addEventListener('touchend', (event) => {
            touchEndY = event.changedTouches[0].clientY; // Get final Y position
            handleSwipe(); // Call function to check swipe direction
        }, false);

        // Wheel Scroll (Desktop)
        window.addEventListener('wheel', (event) => {
            if (!cardContainer.classList.contains('asteroids-sub-cards')) return;

            if (event.deltaY > 0) {
                if (currentSet === cardSets.length) return;
                cardContainer.innerHTML = '';
                renderCards(cardType, currentSet);
                currentSet += 1;
            } else if (event.deltaY < 0) {
                if (currentSet === 1) return;
                cardContainer.innerHTML = '';
                renderCards(cardType, currentSet - 2);
                currentSet -= 1;
            }
        });

        // Keyboard Navigation (Arrow Keys)
        window.addEventListener('keydown', (event) => {
            if (!cardContainer.classList.contains('asteroids-sub-cards')) return;

            if (event.key === "ArrowDown") {
                if (currentSet === cardSets.length) return;
                cardContainer.innerHTML = '';
                renderCards(cardType, currentSet);
                currentSet += 1;
            } else if (event.key === "ArrowUp") {
                if (currentSet === 1) return;
                cardContainer.innerHTML = '';
                renderCards(cardType, currentSet - 2);
                currentSet -= 1;
            }
        });
    }
    else if (cardType === 'galaxies') {
        cardContainer.classList.add('galaxies-sub-cards');  // This line adds the class
        cardContainer.classList.remove('stars-sub-cards');  // This line adds the class
        cardContainer.classList.remove('planets-sub-cards');  // This line adds the class
        cardContainer.classList.remove('asteroids-sub-cards');  // This line adds the class
        cardContainer.classList.remove('black-holes-sub-cards');  // This line adds the class

        galaxiesActive = true;
        starsActive = false;
        planetsActive = false;
        asteroidsActive = false;
        bhActive = false;

        // Detect touch start position
        window.addEventListener('touchstart', (event) => {
            touchStartY = event.touches[0].clientY; // Get initial Y position
        }, false);

        // Detect touch end position and determine scroll direction
        window.addEventListener('touchend', (event) => {
            touchEndY = event.changedTouches[0].clientY; // Get final Y position
            handleSwipe(); // Call function to check swipe direction
        }, false);

        // Wheel Scroll (Desktop)
        window.addEventListener('wheel', (event) => {
            if (!cardContainer.classList.contains('galaxies-sub-cards')) return;

            if (event.deltaY > 0) {
                if (currentSet === cardSets.length) return;
                cardContainer.innerHTML = '';
                renderCards(cardType, currentSet);
                currentSet += 1;
            } else if (event.deltaY < 0) {
                if (currentSet === 1) return;
                cardContainer.innerHTML = '';
                renderCards(cardType, currentSet - 2);
                currentSet -= 1;
            }
        });

        // Keyboard Navigation (Arrow Keys)
        window.addEventListener('keydown', (event) => {
            if (!cardContainer.classList.contains('galaxies-sub-cards')) return;

            if (event.key === "ArrowDown") {
                if (currentSet === cardSets.length) return;
                cardContainer.innerHTML = '';
                renderCards(cardType, currentSet);
                currentSet += 1;
            } else if (event.key === "ArrowUp") {
                if (currentSet === 1) return;
                cardContainer.innerHTML = '';
                renderCards(cardType, currentSet - 2);
                currentSet -= 1;
            }
        });
    }
    else if (cardType === 'black_holes') {
        cardContainer.classList.add('black-holes-sub-cards');  // This line adds the class
        cardContainer.classList.remove('stars-sub-cards');  // This line adds the class
        cardContainer.classList.remove('planets-sub-cards');  // This line adds the class
        cardContainer.classList.remove('asteroids-sub-cards');  // This line adds the class
        cardContainer.classList.remove('galaxies-sub-cards');  // This line adds the class

        bhActive = true;
        starsActive = false;
        planetsActive = false;
        asteroidsActive = false;
        galaxiesActive = false;

        // Detect touch start position
        window.addEventListener('touchstart', (event) => {
            touchStartY = event.touches[0].clientY; // Get initial Y position
        }, false);

        // Detect touch end position and determine scroll direction
        window.addEventListener('touchend', (event) => {
            touchEndY = event.changedTouches[0].clientY; // Get final Y position
            handleSwipe(); // Call function to check swipe direction
        }, false);

        // Wheel Scroll (Desktop)
        window.addEventListener('wheel', (event) => {
            if (!cardContainer.classList.contains('black-holes-sub-cards')) return;

            if (event.deltaY > 0) {
                if (currentSet === cardSets.length) return;
                cardContainer.innerHTML = '';
                renderCards(cardType, currentSet);
                currentSet += 1;
            } else if (event.deltaY < 0) {
                if (currentSet === 1) return;
                cardContainer.innerHTML = '';
                renderCards(cardType, currentSet - 2);
                currentSet -= 1;
            }
        });

        // Keyboard Navigation (Arrow Keys)
        window.addEventListener('keydown', (event) => {
            if (!cardContainer.classList.contains('black-holes-sub-cards')) return;

            if (event.key === "ArrowDown") {
                if (currentSet === cardSets.length) return;
                cardContainer.innerHTML = '';
                renderCards(cardType, currentSet);
                currentSet += 1;
            } else if (event.key === "ArrowUp") {
                if (currentSet === 1) return;
                cardContainer.innerHTML = '';
                renderCards(cardType, currentSet - 2);
                currentSet -= 1;
            }
        });

    }

    function handleSwipe() {
        if (
            !cardContainer.classList.contains('black-holes-sub-cards') &&
            !cardContainer.classList.contains('galaxies-sub-cards') &&
            !cardContainer.classList.contains('asteroids-sub-cards') &&
            !cardContainer.classList.contains('planets-sub-cards') &&
            !cardContainer.classList.contains('stars-sub-cards')
        ) {
            return; // Exit if none of these classes are present
        }

        const swipeDistance = touchStartY - touchEndY; // Calculate swipe direction

        if (swipeDistance > 30) {
            // Swipe Up (Next Set)
            if (currentSet === cardSets.length) return; // Prevent going past last set
            cardContainer.innerHTML = ''; // Clear cards
            renderCards(cardType, currentSet);
            currentSet += 1; // Move to next set
        } else if (swipeDistance < -30) {
            // Swipe Down (Previous Set)
            if (currentSet === 1) return; // Prevent going before first set
            cardContainer.innerHTML = ''; // Clear cards
            renderCards(cardType, currentSet - 2);
            currentSet -= 1; // Move to previous set
        }
    }


    renderCards(cardType, 0);

    // Update the URL with the current card type
    if (!window.location.hash.includes(`#Home-Page/${toTitleCase(cardType)}`)) {
        navigateTo(`#Home-Page/${toTitleCase(cardType)}`);
    }
    let currentSet = 1; // To track which set should be displayed

}

document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("searchBar");
    const suggestionsList = document.getElementById("suggestionsList");
    cachedRows = null; // Cache Excel data

    // Function to load and cache Excel file
    async function loadExcelFile() {
        try {
            if (!cachedRows) { // If not already loaded
                const response = await fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vQwvnfmZ7eBhRvg0FqN41Cs8MChu1n91tzIj3uJWlm5CeVLgmAgaEdxqt4TXu0CBw/pub?gid=1044517428&single=true&output=csv"); // Replace with your Sheet1 CSV URL
                const csvText = await response.text();
                const result = Papa.parse(csvText, {
                    header: true,
                    skipEmptyLines: true,
                    dynamicTyping: true
                });
                cachedRows = result.data.map(row => ({
                    Name: row.CelestialBody || "",
                    Description: row.Text || "",
                    ImagePath: row.Image || "",
                    Type: row.Type || "",
                    Brief: row.BriefDescription || ""
                }));
            }
        } catch (error) {
            console.error("Error loading celestial data from Google Sheets:", error);
        }
    }

    // Function to search for a star and display its information
    window.findStar = function (searchValue) {
        if (!cachedRows) {
            alert("Excel file is still loading. Please try again.");
            return;
        }

        // Match the star name
        const result = cachedRows.find(row => row.Name.toLowerCase() === searchValue.toLowerCase());
        if (result) {
            // Call `showSearchZoomedCard` with the matching row's data
            const typeName = result.Type.replace(/_/g, '-').replace(/ /g, '-');
            showSearchZoomedCard(result.Description, result.ImagePath, result.Name, typeName);
        } else {
            alert(`Star "${searchValue}" not found.`);
        }
    }

    // Listen for input in the search bar
    searchInput.addEventListener("input", (event) => {
        const searchQuery = event.target.value.toLowerCase().trim();
        suggestionsList.innerHTML = ""; // Clear previous suggestions

        if (searchQuery && cachedRows) {
            // Filter and prioritize matching star names
            const filteredStars = cachedRows
                .map(row => {
                    const words = row.Name.toLowerCase().split(/\s+/); // Split into words
                    const firstWordMatches = words[0].startsWith(searchQuery);
                    const anyWordMatches = words.some(word => word.startsWith(searchQuery));

                    return {
                        row,
                        relevance: firstWordMatches ? 1 : (anyWordMatches ? 2 : 3) // Prioritize first-word matches
                    };
                })
                .filter(entry => entry.relevance < 3) // Keep only relevant matches
                .sort((a, b) => a.relevance - b.relevance); // Sort by priority (first-word matches first)

            // Display suggestions
            filteredStars.forEach(entry => {
                const suggestionItem = document.createElement("li");
                suggestionItem.textContent = entry.row.Name;
                suggestionItem.addEventListener("click", () => {
                    document.getElementById("searchBarInput").value = ''; // Clear search bar
                    suggestionsList.innerHTML = ""; // Clear suggestions
                    suggestionsList.style.display = "none"; // Hide list
                    findStar(entry.row.Name); // Display star info
                });
                suggestionsList.appendChild(suggestionItem);
            });

            suggestionsList.style.display = filteredStars.length > 0 ? "block" : "none";
        } else {
            suggestionsList.style.display = "none"; // Hide suggestions if no query
        }
    });

    // Preload Excel file
    loadExcelFile();

});

// Function to display star details in a zoomed card
function showSearchZoomedCard(text, imagePath, name, type) {
    const zoomedCard = document.getElementById("zoomed-card");
    const zoomedContent = document.getElementById("zoomed-content");
    const zoomedText = document.getElementById("zoomed-text");
    const zoomedImage = zoomedCard.querySelector("img");

    removeCalendar();

    // Set data in the zoomed card
    zoomedImage.src = imagePath || "Images/Favicon.jpg"; // Fallback image
    zoomedImage.alt = name || "Star Image";
    zoomedText.innerHTML = `<div style="text-align: center; font-size: 50px;">${name}</div><p>${text}</p>`;

    // Show the zoomed card
    zoomedCard.classList.remove("hidden");
    setTimeout(() => zoomedContent.classList.add("zoomed-in"), 10);

    const bodyName = name.replace(/%20/g, '-').replace(/ /g, '-');

    if (window.location.href.includes("#Home-Page/")) {
        // Update the URL in the browser's address bar without reloading
        if (!window.location.hash.includes(`#Home-Page/${type}/${bodyName}`)) {
            navigateTo(`#Home-Page/${type}/${bodyName}`);
        }
    } else {

        // Update the URL in the browser's address bar without reloading
        if (!window.location.hash.includes(`#Home-Page/${type}/${bodyName}`)) {
            navigateTo(`#Home-Page/${type}/${bodyName}`);
        }
    }

}

function closeZoomedCard() {
    const zoomedCard = document.getElementById('zoomed-card');
    const zoomedContent = document.getElementById('zoomed-content');
    zoomedContent.classList.remove('zoomed-in');
    zoomedCard.classList.add('hidden');
    window.history.back();
}

function toTitleCase(str) {
    return str
        .toLowerCase()
        .split(/[\s-_]+/) // Split on spaces, hyphens, or underscores
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join('-');
}

let cachedCredentials = null;

async function loadCredentialsFromExcel() {
    try {
        if (!cachedCredentials) { // Load if not already cached
            const response = await fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vQwvnfmZ7eBhRvg0FqN41Cs8MChu1n91tzIj3uJWlm5CeVLgmAgaEdxqt4TXu0CBw/pub?gid=830547563&single=true&output=csv"); // Replace with your Sheet3 CSV URL
            const csvText = await response.text();
            const result = Papa.parse(csvText, {
                header: true,
                skipEmptyLines: true,
                dynamicTyping: false
            });
            cachedCredentials = result.data.map(row => ({
                RegisteredDateTime: row.RegisteredDateTime || "",
                Name: row.Name || "",
                Email: row.Email || "",
                DateOfBirth: row.DateOfBirth || "",
                PhoneNumber: row.PhoneNumber || "",
                Password: row.Password || ""
            }));
        }
    } catch (error) {
        console.error("Error loading credentials from Google Sheets:", error);
    }
}

// Wait for the DOM to fully load
document.addEventListener('DOMContentLoaded', () => {
    // Encapsulate popup functionality
    function handlePopup() {
        const openPopupButton = document.getElementById('open-popup');
        const closePopupButton = document.getElementById('close-popup');
        const popup = document.getElementById('popup');
        const popupContent = document.querySelector('.popup-content');

        // Show the popup
        openPopupButton?.addEventListener('click', () => {
            popup.style.display = 'flex'; // Flexbox ensures it's centered
        });

        // Hide the popup when the close button is clicked
        closePopupButton?.addEventListener('click', () => {
            popup.style.display = 'none';
        });

        // Hide the popup when clicking outside of the form
        popup?.addEventListener('click', (event) => {
            if (!popupContent.contains(event.target)) {
                popup.style.display = 'none';
            }
        });
    }

    // Encapsulate form switching functionality
    function handleFormSwitching() {
        const recoveryLink = document.querySelector('.login-form .switch-to-recovery');
        const loginLink = document.querySelector('.recovery-form a');
        const registrationLink = document.querySelector('.login-form .register-link'); // Added for registration
        const loginForm = document.querySelector('.login-form');
        const registrationForm = document.querySelector('.registration-form');
        const popup = document.getElementById('popup');

        // Show the recovery form
        recoveryLink?.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent default link behavior
            popup.classList.add('recovery-active'); // Add class to show recovery form
        });

        // Show the login form
        loginLink?.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent default link behavior
            popup.classList.remove('recovery-active'); // Remove class to show login form
        });

        // Show the registration form
        registrationLink?.addEventListener('click', (event) => {
            event.preventDefault();
            popup.classList.add('registration-active');
            popup.classList.remove('recovery-active'); // Remove class to show login form
        });

        // Show login form again if needed (e.g., for switching back)
        const backToLoginLink = document.querySelector('.registration-form .back-to-login');
        backToLoginLink?.addEventListener('click', (event) => {
            event.preventDefault();
            popup.classList.remove('registration-active'); // Remove class to show login form
            popup.classList.remove('recovery-active'); // Remove class to show login form
        });
    }

    // Encapsulate validation functionality for login
    async function handleValidation() {
        // Ensure credentials are loaded before validating
        await loadCredentialsFromExcel();

        const form = document.getElementById('login-form');
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const emailError = document.getElementById('email-error');
        const passwordError = document.getElementById('password-error');

        form.addEventListener('submit', (event) => {
            event.preventDefault(); // Prevent form submission

            let valid = true;

            // Clear previous error messages
            emailError.innerHTML = '';
            passwordError.innerHTML = '';

            // Get user input
            const emailValue = emailInput.value.trim();
            const passwordValue = passwordInput.value;

            // Check if email and password match credentials from the Excel sheet
            const match = cachedCredentials.find(
                (cred) => cred.Email === emailValue && cred.Password === passwordValue
            );

            if (!match) {
                emailError.innerHTML = '<span>Invalid email or password.</span>';
                passwordError.innerHTML = '<span>Invalid email or password.</span>';
                valid = false;
            }

            // If the form is valid, log success
            if (valid) {

                // Clear the form inputs
                emailInput.value = '';
                passwordInput.value = '';

                // Delay the alert to ensure inputs are cleared and updated on the screen
                setTimeout(() => {
                    setTimeout(() => alert(`Welcome back, ${match.Name}!!!`), 500);
                }, 5); // Delay by 0 milliseconds to let the browser repaint the UI
                userSignedIn = true;
                userData = match;
                document.getElementById('popup').style.display = 'none';
                setTimeout(() => horoscopeView(), 300);
            }
        });
    }


    // Register form validation
    // Register form validation
async function handleRegistrationValidation() {
    const registrationForm = document.getElementById('registration-form');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('reg-email');
    const dobInput = document.getElementById('dob');
    const phoneInput = document.getElementById('phone');
    const passwordInput = document.getElementById('reg-password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error1');
    const dobError = document.getElementById('dob-error');
    const phoneError = document.getElementById('phone-error1');
    const passwordError = document.getElementById('password-error1');
    const confirmPasswordError = document.getElementById('confirm-password-error');

    registrationForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        let valid = true;

        // Clear previous error messages
        nameError.innerHTML = '';
        emailError.innerHTML = '';
        dobError.innerHTML = '';
        phoneError.innerHTML = '';
        passwordError.innerHTML = '';
        confirmPasswordError.innerHTML = '';

        // Validate name
        if (nameInput.value.trim() === '') {
            nameError.innerHTML = '<span>Name is required.</span>';
            valid = false;
        }

        // Validate email
        const emailValue = emailInput.value.trim();
        if (!/^[\w.-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(emailValue)) {
            emailError.innerHTML = '<span>Please enter a valid email id.</span>';
            valid = false;
        }

        // Validate date of birth
        const dobValue = dobInput.value.trim();
        if (dobValue === '') {
            dobError.innerHTML = '<span>Date of birth is required.</span>';
            valid = false;
        }

        // Validate phone number
        const phoneNumber = phoneInput.value.trim();
        const regex = /^\d{10}$/;
        if (!regex.test(phoneNumber)) {
            phoneError.innerHTML = '<span>Please enter a valid phone number.</span>';
            valid = false;
        }

        // Validate password
        const passwordValue = passwordInput.value.trim();
        const confirmPasswordValue = confirmPasswordInput.value.trim();
        if (passwordValue.length <= 3) {
            passwordError.innerHTML = '<span>Please enter a stronger password.</span>';
            valid = false;
        }
        if (passwordValue !== confirmPasswordValue) {
            confirmPasswordError.innerHTML = '<span>Passwords do not match.</span>';
            valid = false;
        }

        // If valid, check if email already exists
        if (valid) {
            const registrationData = {
                name: nameInput.value.trim(),
                email: emailInput.value.trim(),
                dob: dobInput.value.trim(),
                phone: phoneInput.value.trim(),
                password: passwordInput.value.trim()
            };

            try {
                // Send a request to check if the email is already registered
                const emailCheckResponse = await fetch('https://exploring-celestial-bodies.onrender.com/check-email', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email: registrationData.email })
                });
                const emailCheckResult = await emailCheckResponse.json();

                // If email exists, alert and stop registration
                if (emailCheckResult.exists) {
                    emailError.innerHTML = '<span>This email is already registered. Please use a different email.</span>';
                    return;
                }

                // Send a request to check if the phone number is already registered
                const phoneCheckResponse = await fetch('https://exploring-celestial-bodies.onrender.com/check-phone', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ phone: registrationData.phone })
                });
                const phoneCheckResult = await phoneCheckResponse.json();

                // If phone number exists, alert and stop registration
                if (phoneCheckResult.exists) {
                    phoneError.innerHTML = '<span>This number is already registered. Please use a different number.</span>';
                    return;
                }

                // Otherwise, proceed with registration
                const response = await fetch('https://exploring-celestial-bodies.onrender.com/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(registrationData)
                });

                const result = await response.json();

                if (!response.ok || result.check === false) {
                    // Handle error case
                    console.error('Registration error:', result.message);
                    alert(result.message || 'An error occurred during registration.');
                    return;
                }

                userSignedIn = true;
                userData = {
                    Name: nameInput.value.trim(),
                    Email: emailInput.value.trim(),
                    DateOfBirth: dobInput.value.trim(),
                    PhoneNumber: phoneInput.value.trim(),
                    Password: passwordInput.value.trim()
                };

                // Clear form inputs
                nameInput.value = '';
                emailInput.value = '';
                dobInput.value = '';
                phoneInput.value = '';
                passwordInput.value = '';
                confirmPasswordInput.value = '';

                setTimeout(() => alert(result.message), 500);

                document.getElementById('popup').style.display = 'none';
                setTimeout(() => horoscopeView(), 300);
            } catch (error) {
                userData = null;
                userSignedIn = false;
                console.error('Error during registration:', error);
                alert('An error occurred. Please try again.');
            }
        }
    });
}

    // ✅ Firebase Configuration
    const firebaseConfig = {
        apiKey: "AIzaSyBPI8nAiMlM6MAC1m7Yq7H6W4wmzO9gGsA",
        authDomain: "exploring-celestial-bodies.firebaseapp.com",
        projectId: "exploring-celestial-bodies",
        storageBucket: "exploring-celestial-bodies.firebasestorage.app",
        messagingSenderId: "122888965261",
        appId: "1:122888965261:web:00311f8c3b06c97f94e6c4"
    };

    // 🔥 Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    window.auth = firebase.auth();

    const defaultCountryCode = "+91"; // Change this if needed

    // ✅ Get DOM Elements
    const sendOtpButton = document.getElementById("otpsend");
    const verifyOtpButton = document.getElementById("verify-otp");
    const phoneNumberInput = document.getElementById("phone-number");
    const otpInput = document.getElementById("otp");
    const phoneError = document.getElementById("phone-error");
    const message = document.getElementById("message");
    const verifySection = document.getElementById("verify-section"); // Section that contains the OTP verification

    // ✅ Ensure reCAPTCHA is loaded
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier("recaptcha-container", {
        size: "invisible"
    });

    // 🔹 Hide Verify OTP Section Initially
    verifySection.style.display = "none";

    // 🔹 Disable Send OTP Button Temporarily
    function disableSendOtpButton(seconds) {
        let remainingTime = seconds;
        sendOtpButton.disabled = true;

        function updateButtonText() {
            sendOtpButton.innerText = `Resend OTP in ${remainingTime}s`;
            remainingTime--;

            if (remainingTime < 0) {
                sendOtpButton.innerText = "Resend OTP";
                sendOtpButton.disabled = false;
            } else {
                setTimeout(updateButtonText, 1000);
            }
        }

        updateButtonText();
    }

    // 🔹 Global Variable for Phone Number (To Be Used in verifyOTP)
    let storedPhoneNumber = "";

    // 🔹 Check if Phone Number Exists in Excel
    async function isPhoneNumberRegistered(phoneNumber) {
        await loadCredentialsFromExcel();
        console.log("Input Phone:", phoneNumber, "Type:", typeof phoneNumber);
        console.log("Cached Credentials:", cachedCredentials);
        if (!cachedCredentials || cachedCredentials.length === 0) {
            console.error("❌ No credentials found in database.");
            return false;
        }
        const found = cachedCredentials.some(row => {
            const storedPhone = String(row.PhoneNumber).trim();
            console.log("Comparing:", storedPhone, "with", phoneNumber, "Types:", typeof storedPhone, typeof phoneNumber);
            return storedPhone === phoneNumber;
        });
        console.log("Phone Found:", found);
        return found;
    }

    // 🔹 Handle Recovery Form Submission
    function handleRecoveryFormSubmission() {
        const recoveryForm = document.querySelector('#recovery-form');
        if (!recoveryForm) {
            console.error("Recovery form not found!");
            return;
        }
        recoveryForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            console.log("Recovery form submitted, active element:", document.activeElement);
            const activeElement = document.activeElement;
            if (activeElement === phoneNumberInput) {
                await sendOTP();
            }
        });
    }

    // 🔹 Send OTP Function (With Database Check)
    async function sendOTP() {
        let phoneNumber = phoneNumberInput.value.trim();

        const regex = /^\d{10}$/; // Matches exactly 10 digits
        if (!regex.test(phoneNumber)) {
            phoneError.innerHTML = '<span>❌ Invalid phone number.</span>';
            return;
        }

        // ✅ Check if the phone number is in the database
        const isRegistered = await isPhoneNumberRegistered(phoneNumber);
        if (!isRegistered) {
            phoneError.innerHTML = '<span>❌ This phone number is not registered.</span>';
            return;
        }

        // ✅ Store phone number globally (To use in verifyOTP)
        storedPhoneNumber = phoneNumber;

        if (!phoneNumber.startsWith("+")) {
            phoneNumber = defaultCountryCode + phoneNumber;
        }

        try {
            const confirmationResult = await window.auth.signInWithPhoneNumber(phoneNumber, window.recaptchaVerifier);
            window.confirmationResult = confirmationResult;
            alert("✅ OTP Sent!");

            // 🔹 Disable button for 5 seconds
            disableSendOtpButton(5);

            // 🔹 Show Verify OTP Section
            verifySection.style.display = "block";

        } catch (error) {
            console.error("❌ Error Sending OTP:", error);
            phoneError.innerHTML = `<span>❌ ${error.message}</span>`;
        }
    }

    // 🔹 Verify OTP Function
    let isVerifying = false; // Debounce flag to prevent multiple executions
    async function verifyOTP(event) {
        if (isVerifying) {
            console.log("verifyOTP skipped due to isVerifying");
            return;
        }
        isVerifying = true;
        console.log("verifyOTP called, event type:", event ? event.type : "direct call");

        const otp = otpInput.value.trim();

        if (!otp) {
            message.innerHTML = "❌ Enter OTP.";
            isVerifying = false;
            return;
        }

        try {
            const result = await window.confirmationResult.confirm(otp);
            message.innerHTML = "✅ OTP Verified!";

            // Find the user in cached credentials
            const matchedUser = cachedCredentials.find(
                row => row.PhoneNumber === storedPhoneNumber
            );
            document.getElementById("phone-number").value = '';
            document.getElementById("otp").value = '';
            sendOtpButton.innerText = "Send OTP";
            verifySection.style.display = "none";

            if (matchedUser) {
                setTimeout(() => {
                    userSignedIn = true;
                    userData = matchedUser;
                    document.getElementById('popup').style.display = 'none';
                    horoscopeView();
                }, 300);
                setTimeout(() => {
                    alert(`Welcome back, ${matchedUser.Name}!!!`);
                    isVerifying = false; // Reset after successful verification
                }, 500);
            } else {
                isVerifying = false; // Reset if no user found
            }
        } catch (error) {
            console.error("❌ OTP Verification Error:", error);
            message.innerHTML = "❌ Invalid OTP.";
            isVerifying = false; // Reset on error
        }
    }

    // ✅ Attach Event Listeners
    sendOtpButton.addEventListener("click", sendOTP);
    verifyOtpButton.addEventListener("click", verifyOTP);


    // Initialize all functionalities
    handlePopup();
    handleFormSwitching();
    handleValidation();
    handleRegistrationValidation();
    handleRecoveryFormSubmission();
});

window.displayZoomedCard = function (searchValue) {
    if (!cachedRows) {
        alert("Excel file is still loading. Please try again.");
        return;
    }

    // Match the star name
    const result = cachedRows.find(row => row.Name.toLowerCase() === searchValue.toLowerCase());
    if (result) {
        const zoomedCard = document.getElementById("zoomed-card");
        const zoomedContent = document.getElementById("zoomed-content");
        const zoomedText = document.getElementById("zoomed-text");
        const zoomedImage = zoomedCard.querySelector("img");

        removeCalendar();

        // Set data in the zoomed card
        zoomedImage.src = result.ImagePath || "Images/Favicon.jpg"; // Fallback image
        zoomedImage.alt = result.Name || "Star Image";
        zoomedText.innerHTML = `<div style="text-align: center; font-size: 50px;">${result.Name}</div><p>${result.Description}</p>`;

        // Show the zoomed card
        zoomedCard.classList.remove("hidden");
        setTimeout(() => zoomedContent.classList.add("zoomed-in"), 10);
    } else {
        alert(`Star "${searchValue}" not found.`);
    }
}

// Listen for changes to the URL hash or history navigation (back/forward buttons)
window.addEventListener('hashchange', handleNavigation);

function handleNavigation() {
    // Use setTimeout() to allow the browser to fully update the hash
    setTimeout(() => {
        const currentHash = window.location.hash;

        const zoomedCard = document.getElementById("zoomed-card");

        if (!zoomedCard.classList.contains("hidden")) {
            const zoomedCard = document.getElementById('zoomed-card');
            const zoomedContent = document.getElementById('zoomed-content');
            zoomedContent.classList.remove('zoomed-in');
            zoomedCard.classList.add('hidden');
        }
        else if (/^#Home-Page\/(Stars|Planets|Asteroids|Galaxies|Black-Holes)\/.+$/.test(currentHash)) {
            const bodyNameMatch = currentHash.match(/^#Home-Page\/(Stars|Planets|Asteroids|Galaxies|Black-Holes)\/(.+)$/);
            if (bodyNameMatch) {
                const afterBodyName = bodyNameMatch[2].replace(/-/g, ' '); // Extracts the part after "/BodyName/" and replaces '-' with ' '

                window.displayZoomedCard(afterBodyName);
            }
        }
        // Now, you can safely check for changes in the hash
        else if (currentHash.includes('#Home-Page/Stars')) {
            if (!starsActive) {
                triggerZoomEffect("stars");
            }
        } else if (currentHash.includes('#Home-Page/Planets')) {
            if (!planetsActive) {
                triggerZoomEffect("planets");
            }
        } else if (currentHash.includes('#Home-Page/Asteroids')) {
            if (!asteroidsActive) {
                triggerZoomEffect("asteroids");
            }
        } else if (currentHash.includes('#Home-Page/Galaxies')) {
            if (!galaxiesActive) {
                triggerZoomEffect("galaxies");
            }
        } else if (currentHash.includes('#Home-Page/Black-Holes')) {
            if (!bhActive) {
                triggerZoomEffect("black_holes");
            }
        } else if (currentHash.includes('#Home-Page/About-Us')) {
            if (!aboutActive) {
                aboutUsView();
            }
        } else if (currentHash.includes('#Home-Page/Did-You-Know')) {
            if (!didYouKnowActive) {
                didYouKnowView();
            }
        } else if (currentHash.includes('#Home-Page/Calendar')) {
            if (!calendarActive) {
                calendarView();
            }
        } else if (currentHash.includes('#Home-Page/Horoscope')) {
            if (!horoscopeActive) {
                setTimeout(() => {
                    horoscopeView();
                }, 50);
            }
        }
        else if (currentHash === '#Home-Page') {
            if (!mainScreenActive) {
                renderMainCards();
            }
        }
    }, 100);  // Short delay to ensure the hash is updated
}
