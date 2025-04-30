
// Initialize Google API Client
function loadGapiClient() {
    return new Promise((resolve, reject) => {
        gapi.load('client', async () => {
            try {
                await gapi.client.init({
                    apiKey: 'YOUR_API_KEY', // Replace with your Google API Key
                    discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4']
                });
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    });
}

window.addEventListener('load', () => {
    sessionStorage.clear();
    document.cookie.split(";").forEach(cookie => {
        const name = cookie.split("=")[0].trim();
        document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/';
    });
});

let scrollTop, scrollLeft, userSignedIn = false, userData = null;
let mainScreenActive = false, starsActive = false, planetsActive = false, asteroidsActive = false, galaxiesActive = false, bhActive = false, aboutActive = false, didYouKnowActive = false, calendarActive = false, horoscopeActive = false;
let touchStartY = 0, touchEndY = 0;

function lockScroll() {
    scrollTop = window.scrollY || document.documentElement.scrollTop;
    scrollLeft = window.scrollX || document.documentElement.scrollLeft;
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollTop}px`;
    document.body.style.left = `-${scrollLeft}px`;
    document.body.style.width = '100%';
}

function unlockScroll() {
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.width = '';
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
        if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', ' '].includes(event.key)) {
            preventScrollEvents(event);
        }
    });
}

function navigateTo(view) {
    const currentUrl = new URL(window.location.href);
    currentUrl.hash = view;
    window.history.pushState({ path: currentUrl.href }, '', currentUrl.href);
}

function renderPage() {
    const cardContainer = document.querySelector('.card-container');
    const firstImage = document.querySelector('.image.first');
    const secondImage = document.querySelector('.image.second');
    secondImage.style.transform = 'scale(1.2)';
    secondImage.style.opacity = '0';
    firstImage.style.opacity = '1';
    firstImage.style.transform = 'scale(1.2)';
    cardContainer.innerHTML = '';
    cardContainer.classList.remove('sub-cards', 'stars-sub-cards', 'planets-sub-cards', 'asteroids-sub-cards', 'galaxies-sub-cards', 'black-holes-sub-cards');
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
    lockScroll();
    disableScrollEvents();
}

function renderMainCards() {
    const cardContainer = document.querySelector('.card-container');
    const searchBarContainer = document.querySelector('.search-bar-container');
    toggleLoginLogout();
    searchBarContainer.style.display = 'flex';
    renderPage();
    removeCalendar();
    cardContainer.innerHTML = cardsHTML;
    setTimeout(() => {
        searchBarContainer.style.top = '30%';
        document.querySelector(".home-icon-container").style.display = "none";
        if (window.innerWidth <= 768) {
            searchBarContainer.style.width = "80%";
            document.getElementById("searchBarInput").placeholder = "Search...";
        } else {
            document.getElementById("searchBarInput").placeholder = "Search for celestial bodies...";
        }
    }, 200);
    if (window.location.hash !== '#Home-Page') {
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
    firstImage.style.transform = 'scale(1.2)';
    firstImage.style.opacity = '0';
    secondImage.style.opacity = '1';
    secondImage.style.transform = 'scale(1.2)';
    setTimeout(() => {
        searchBarContainer.style.top = '5%';
        document.querySelector(".home-icon-container").style.display = "block";
        if (window.innerWidth <= 768) {
            searchBarContainer.style.width = "60%";
            document.getElementById("searchBarInput").placeholder = "Search...";
        } else {
            searchBarContainer.style.width = "50%";
            document.getElementById("searchBarInput").placeholder = "Search for celestial bodies....";
        }
    }, 500);
    setTimeout(() => {
        updateCards(cardType);
    }, 400);
}

function toggleLoginLogout() {
    const loginButton = document.getElementById("open-popup");
    const logoutButton = document.getElementById("logout-popup");
    if (userSignedIn) {
        loginButton.style.display = "none";
        logoutButton.style.display = "inline-block";
    } else {
        loginButton.style.display = "inline-block";
        logoutButton.style.display = "none";
    }
}

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
let isMenuOpen = false;
menu.classList.add('hidden');

menuItems.forEach((item, index) => {
    let height, url;
    switch (index) {
        case 0: height = '30vh'; url = 'Images/Home.JPG'; break;
        case 1: height = '40vh'; url = 'Images/About.JPG'; break;
        case 2: height = '50vh'; url = 'Images/Did_you_know.JPG'; break;
        case 3: height = '60vh'; url = 'Images/Calendar.JPG'; break;
        case 4: height = '70vh'; url = 'Images/Horoscope.JPG'; break;
    }
    item.style.height = height;
    item.style.backgroundImage = `url(${url})`;
});

function openMenu() {
    if (!isMenuOpen) {
        showMenu();
    } else {
        hideMenu();
    }
}

function showMenu() {
    menu.classList.remove('hidden');
    menu.style.pointerEvents = 'auto';
    hamburgerButton.style.display = "none";
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach((item, index) => {
        setTimeout(() => {
            item.style.transition = 'transform 0.8s ease, opacity 0.8s ease';
            item.style.transform = 'translateY(0)';
            item.style.opacity = 0.7;
        }, index * 100);
    });
    isMenuOpen = true;
}

menuItems.forEach(item => {
    item.addEventListener('mouseover', () => {
        item.style.opacity = 1;
    });
    item.addEventListener('mouseout', () => {
        item.style.opacity = 0.7;
    });
});

function hideMenu() {
    hamburgerButton.style.display = "block";
    menuItems.forEach((item, index) => {
        setTimeout(() => {
            item.style.transition = 'transform 0.8s ease, opacity 0.8s ease';
            item.style.transform = 'translateY(-100%)';
            item.style.opacity = 0;
        }, index * 100);
    });
    setTimeout(() => {
        menu.classList.add('hidden');
        menu.style.pointerEvents = 'none';
    }, menuItems.length * 100 + 200);
    isMenuOpen = false;
}

document.addEventListener("click", (event) => {
    const menuItems = document.querySelectorAll(".menu-item");
    const hamburgerButton = document.querySelector(".hamburger");
    if (!menuItems.length || !hamburgerButton) return;
    const clickedInsideMenuItem = Array.from(menuItems).some(item => item.contains(event.target));
    const clickedHamburger = hamburgerButton.contains(event.target);
    if (!menu.classList.contains("hidden") && !clickedInsideMenuItem && !clickedHamburger) {
        hideMenu();
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
    const invisibleSection = document.createElement("div");
    invisibleSection.id = "about-us-section";
    invisibleSection.style.position = "fixed";
    invisibleSection.style.top = 0;
    invisibleSection.style.left = 0;
    invisibleSection.style.width = "100%";
    invisibleSection.style.height = "100%";
    invisibleSection.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    invisibleSection.style.display = "flex";
    invisibleSection.style.justifyContent = "center";
    invisibleSection.style.alignItems = "center";
    invisibleSection.style.zIndex = "1000";
    const aboutUsContainer = document.createElement("div");
    aboutUsContainer.id = "about-us-box";
    aboutUsContainer.style.width = "80%";
    aboutUsContainer.style.maxWidth = "90%";
    aboutUsContainer.style.height = "80vh";
    aboutUsContainer.style.maxHeight = "80vh";
    aboutUsContainer.style.padding = "20px";
    aboutUsContainer.style.border = "2px solid white";
    aboutUsContainer.style.borderRadius = "10px";
    aboutUsContainer.style.backgroundColor = "transparent";
    aboutUsContainer.style.textAlign = "center";
    aboutUsContainer.style.overflowY = "auto";
    aboutUsContainer.style.overflowX = "hidden";
    const header = document.createElement("h1");
    header.innerHTML = "About Us <br>";
    header.style.margin = "10px 0";
    header.style.fontSize = "2.6rem";
    header.style.color = "white";
    const paragraph = document.createElement("p");
    paragraph.innerHTML = "From the moment we first gazed up at the night sky, we were captivated by the vastness of the cosmos, sparking our curiosity and wonder. As children, stories of distant galaxies ignited our imaginations, leaving us longing to understand what lies beyond. Today, our platform rekindles that sense of awe, inviting both seasoned stargazers and curious newcomers to explore the universe. Whether you're fascinated by celestial wonders or simply want to check your horoscope, logging in opens the door to a world of cosmic discovery. <br><br> As we look to the future, we encourage everyone to embrace the endless possibilities of space. The night sky holds beauty, mystery, and stories passed down through generations—just waiting to be explored. Take a moment to look up, dream, and imagine what lies beyond. Together, we can unlock the secrets of the cosmos, one star at a time.";
    paragraph.style.margin = "10px 0";
    paragraph.style.fontSize = "1.6rem";
    paragraph.style.color = "white";
    aboutUsContainer.appendChild(header);
    aboutUsContainer.appendChild(paragraph);
    invisibleSection.appendChild(aboutUsContainer);
    document.body.appendChild(invisibleSection);
}

function removeAbout() {
    const aboutUsSection = document.getElementById("about-us-section");
    if (aboutUsSection) {
        aboutUsSection.remove();
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
    const invisibleSection = document.createElement("div");
    invisibleSection.id = "did-you-know-section";
    invisibleSection.style.position = "fixed";
    invisibleSection.style.top = 0;
    invisibleSection.style.left = 0;
    invisibleSection.style.width = "100%";
    invisibleSection.style.height = "100%";
    invisibleSection.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    invisibleSection.style.display = "flex";
    invisibleSection.style.justifyContent = "center";
    invisibleSection.style.alignItems = "center";
    invisibleSection.style.zIndex = "1000";
    const innerSection = document.createElement("div");
    innerSection.style.maxHeight = "80vh";
    innerSection.style.overflowY = "auto";
    innerSection.style.overflowX = "hidden";
    innerSection.style.width = "80%";
    innerSection.style.padding = "20px";
    innerSection.style.border = "2px solid white";
    innerSection.style.borderRadius = "10px";
    innerSection.style.backgroundColor = "transparent";
    innerSection.style.textAlign = "center";
    innerSection.style.display = "flex";
    innerSection.style.flexDirection = "column";
    innerSection.style.alignItems = "center";
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
    const factsContainer = document.createElement("div");
    factsContainer.style.display = "flex";
    factsContainer.style.flexDirection = "row";
    factsContainer.style.overflow = "visible";
    factsContainer.style.height = "auto";
    factsContainer.style.maxWidth = "100%";
    factsContainer.style.justifyContent = "center";
    factsContainer.style.alignItems = "center";
    factsContainer.style.flexWrap = window.innerWidth > 768 ? "nowrap" : "wrap";
    const facts = [
        { text1: "Jupiter can fit ", number: 1300, text2: "earths within it, it's that massive!" },
        { text1: "Saturn, the 7-ringed planet has", number: 146, text2: "moons, the most moons a planet has in the solar system!" },
        { text1: "Canis Major Dwarf Galaxy is", number: 30000, text2: "light years away and it is the closest galaxy from earth!" },
        { text1: "Sagittarius A has a diameter of ", number: 24000, text2: "thousand kilometers including the event horizon. It is at the center of our galaxy." },
        { text1: "Vesta has a diameter of", number: 530, text2: "kilometers. It is the largest asteroid in the asteroid belt." },
    ];
    const totalDuration = 5000;
    facts.forEach((fact, index) => {
        const factDiv = document.createElement("div");
        factDiv.style.marginRight = "20px";
        factDiv.style.marginLeft = "20px";
        const factText1 = document.createElement("p");
        factText1.textContent = fact.text1;
        factText1.style.fontSize = "1.5rem";
        factText1.style.color = "white";
        factDiv.appendChild(factText1);
        const factNumber = document.createElement("span");
        factNumber.style.fontSize = "3rem";
        factNumber.style.color = "white";
        factNumber.textContent = "0";
        factDiv.appendChild(factNumber);
        const factText2 = document.createElement("p");
        factText2.textContent = fact.text2;
        factText2.style.fontSize = "1.5rem";
        factText2.style.color = "white";
        factDiv.appendChild(factText2);
        factsContainer.appendChild(factDiv);
        if (window.innerWidth <= 768 && index !== facts.length - 1) {
            const factLine = document.createElement("hr");
            factLine.style.width = "100%";
            factLine.style.border = "0.5px solid white";
            factLine.style.margin = "10px 0";
            factsContainer.appendChild(factLine);
        }
        const maxNumber = 30000;
        const factor = totalDuration / (maxNumber / 50);
        let count = 0;
        const targetNumber = fact.number;
        const increment = targetNumber / (totalDuration / 50);
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
    innerSection.appendChild(factsContainer);
    invisibleSection.appendChild(innerSection);
    document.body.appendChild(invisibleSection);
}

let resizeTimeout;
window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        if (didYouKnowActive && (window.innerWidth !== prevWidth || window.innerHeight !== prevHeight)) {
            prevWidth = window.innerWidth;
            prevHeight = window.innerHeight;
            didYouKnowView();
        }
    }, 100);
});

let prevWidth = window.innerWidth;
let prevHeight = window.innerHeight;

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
    if (!zoomedCard.classList.contains("hidden")) {
        closeZoomedCard();
        window.history.back();
    }
    renderPage();
    clearItems();
    calendarView.innerHTML = `
        <section class="calendar-section">
            <div class="calendar-container">
                <div class="calendar-header">
                    <button id="prev-month"><</button>
                    <h3 id="month-year"></h3>
                    <button id="next-month">></button>
                </div>
                <div class="calendar-days">
                    <div class="weekday">Sun</div>
                    <div class="weekday">Mon</div>
                    <div class="weekday">Tue</div>
                    <div class="weekday">Wed</div>
                    <div class="weekday">Thu</div>
                    <div class="weekday">Fri</div>
                    <div class="weekday">Sat</div>
                </div>
                <div id="calendar-grid"></div>
            </div>
        </section>`;
    const calendarGrid = document.getElementById("calendar-grid");
    const monthYear = document.getElementById("month-year");
    const prevMonthBtn = document.getElementById("prev-month");
    const nextMonthBtn = document.getElementById("next-month");
    let currentDate = new Date();
    const cachedImportantDates = {};
    function generateCalendar(date) {
        calendarGrid.innerHTML = "";
        const month = date.getMonth();
        const year = date.getFullYear();
        monthYear.textContent = date.toLocaleString("default", { month: "long", year: "numeric" });
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        for (let i = 0; i < firstDay; i++) {
            const emptyDiv = document.createElement("div");
            calendarGrid.appendChild(emptyDiv);
        }
        for (let day = 1; day <= daysInMonth; day++) {
            const dayDiv = document.createElement("div");
            const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            dayDiv.textContent = day;
            if (cachedImportantDates[dateKey]) {
                dayDiv.classList.add("important");
                dayDiv.setAttribute("data-tooltip", cachedImportantDates[dateKey]);
            }
            calendarGrid.appendChild(dayDiv);
        }
    }
    prevMonthBtn.addEventListener("click", () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        generateCalendar(currentDate);
    });
    nextMonthBtn.addEventListener("click", () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        generateCalendar(currentDate);
    });
    async function initializeCalendar() {
        try {
            await loadImportantDates();
            generateCalendar(currentDate);
            setTimeout(function () {
                if (!window.location.hash.includes('#Home-Page/Calendar')) {
                    navigateTo('#Home-Page/Calendar');
                    calendarActive = true;
                }
            }, 500);
        } catch (error) {
            console.error("Error initializing the calendar:", error);
        }
    }
    async function loadImportantDates() {
        try {
            await loadGapiClient();
            const response = await gapi.client.sheets.spreadsheets.values.get({
                spreadsheetId: '1kzqK1_1GmIf-u76vozW3FA5ZV50IOcaI',
                range: 'Sheet2!A2:B'
            });
            const rows = response.result.values || [];
            rows.forEach(row => {
                const [date, description] = row;
                const formattedDate = formatSheetDate(date);
                if (formattedDate) {
                    cachedImportantDates[formattedDate] = description;
                }
            });
        } catch (error) {
            console.error("Error loading important dates from Google Sheet:", error);
        }
    }
    function formatSheetDate(sheetDate) {
        if (!sheetDate) return null;
        let dateObj;
        if (/^\d{4}-\d{2}-\d{2}$/.test(sheetDate)) {
            dateObj = new Date(sheetDate);
        } else if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(sheetDate)) {
            dateObj = new Date(sheetDate);
        } else {
            const baseDate = new Date('1899-12-30');
            dateObj = new Date(baseDate.getTime() + Number(sheetDate) * 24 * 60 * 60 * 1000);
        }
        if (isNaN(dateObj.getTime())) return null;
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    initializeCalendar();
}

function removeCalendar() {
    const calendarView = document.getElementById("calendar");
    if (calendarView) {
        calendarView.innerHTML = '';
        calendarActive = false;
    }
}

async function horoscopeView() {
    const zoomedCard = document.getElementById("zoomed-card");
    hideMenu();
    removeAbout();
    removeDidYouKnow();
    removeCalendar();
    if (!zoomedCard.classList.contains("hidden")) {
        closeZoomedCard();
        window.history.back();
    }
    if (!window.location.hash.includes('#Home-Page/Horoscope')) {
        navigateTo('#Home-Page/Horoscope');
        horoscopeActive = true;
    }
    if (!userSignedIn) {
        document.getElementById("popup").style.display = "flex";
        renderMainCards();
    } else {
        renderPage();
        clearItems();
        unlockScroll();
        enableScrollEvents();
        const dob = userData.DateOfBirth;
        const starSign = getStarSign(dob);
        const horoscope = await getHoroscope(starSign);
        const invisibleSection = document.createElement("div");
        invisibleSection.id = "horoscope-section";
        invisibleSection.style.position = "fixed";
        invisibleSection.style.top = 0;
        invisibleSection.style.left = 0;
        invisibleSection.style.width = "100%";
        invisibleSection.style.height = "100%";
        invisibleSection.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
        invisibleSection.style.display = "flex";
        invisibleSection.style.justifyContent = "center";
        invisibleSection.style.alignItems = "center";
        invisibleSection.style.zIndex = "1000";
        const horoscopeContainer = document.createElement("div");
        horoscopeContainer.id = "horoscope-box";
        horoscopeContainer.style.width = "80%";
        horoscopeContainer.style.maxWidth = "90%";
        horoscopeContainer.style.height = "80vh";
        horoscopeContainer.style.maxHeight = "80vh";
        horoscopeContainer.style.padding = "20px";
        horoscopeContainer.style.border = "2px solid white";
        horoscopeContainer.style.borderRadius = "10px";
        horoscopeContainer.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
        horoscopeContainer.style.textAlign = "center";
        horoscopeContainer.style.overflowY = "auto";
        horoscopeContainer.style.overflowX = "hidden";
        const header = document.createElement("h1");
        header.innerHTML = `${starSign}`;
        header.style.margin = "10px 0";
        header.style.fontSize = "2.6rem";
        header.style.color = "white";
        const paragraph = document.createElement("p");
        paragraph.innerHTML = horoscope;
        paragraph.style.margin = "10px 0";
        paragraph.style.fontSize = "1.6rem";
        paragraph.style.color = "white";
        horoscopeContainer.appendChild(header);
        horoscopeContainer.appendChild(paragraph);
        invisibleSection.appendChild(horoscopeContainer);
        document.body.appendChild(invisibleSection);
    }
}

function getStarSign(dob) {
    const date = new Date(dob);
    const month = date.getMonth() + 1;
    const day = date.getDate();
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
    for (let i = 0; i < starSigns.length; i++) {
        const sign = starSigns[i];
        if ((month === sign.start.month && day >= sign.start.day) || (month === sign.end.month && day <= sign.end.day)) {
            return sign.sign;
        }
    }
    return "Unknown";
}

async function loadHoroscopesFromSheet() {
    const horoscopes = {};
    try {
        await loadGapiClient();
        const response = await gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: '1kzqK1_1GmIf-u76vozW3FA5ZV50IOcaI',
            range: 'Sheet4!A2:B'
        });
        const data = response.result.values || [];
        data.forEach(row => {
            const [starSign, prediction] = row;
            if (starSign && prediction) {
                horoscopes[starSign.trim()] = prediction;
            }
        });
        return horoscopes;
    } catch (error) {
        console.error("Error loading horoscopes from Google Sheet:", error);
        return {};
    }
}

async function getHoroscope(starSign) {
    const horoscopes = await loadHoroscopesFromSheet();
    return horoscopes[starSign.slice(2, -2).trim()] || "Your horoscope is unavailable today.";
}

function removeHoroscope() {
    const horoscopeSection = document.getElementById("horoscope-section");
    if (horoscopeSection) {
        horoscopeSection.remove();
        horoscopeActive = false;
    }
}

function renderCards(cardType, setNumber) {
    cardSets = generateCards(cardType);
    const cardContainer = document.querySelector('.card-container');
    cardContainer.innerHTML = '';
    if (cardSets[setNumber]) {
        for (let i = 0; i < 10; i++) {
            cardContainer.innerHTML += cardSets[setNumber][i];
        }
    }
}

function updateCards(cardType) {
    const cardContainer = document.querySelector('.card-container');
    cardContainer.innerHTML = '';
    removeCalendar();
    mainScreenActive = false;
    cardContainer.classList.add('sub-cards');
    unlockScroll();
    enableScrollEvents();
    if (cardType === 'stars') {
        cardContainer.classList.add('stars-sub-cards');
        cardContainer.classList.remove('planets-sub-cards', 'asteroids-sub-cards', 'galaxies-sub-cards', 'black-holes-sub-cards');
        starsActive = true;
        planetsActive = false;
        asteroidsActive = false;
        galaxiesActive = false;
        bhActive = false;
    } else if (cardType === 'planets') {
        cardContainer.classList.add('planets-sub-cards');
        cardContainer.classList.remove('stars-sub-cards', 'asteroids-sub-cards', 'galaxies-sub-cards', 'black-holes-sub-cards');
        planetsActive = true;
        starsActive = false;
        asteroidsActive = false;
        galaxiesActive = false;
        bhActive = false;
    } else if (cardType === 'asteroids') {
        cardContainer.classList.add('asteroids-sub-cards');
        cardContainer.classList.remove('stars-sub-cards', 'planets-sub-cards', 'galaxies-sub-cards', 'black-holes-sub-cards');
        asteroidsActive = true;
        starsActive = false;
        planetsActive = false;
        galaxiesActive = false;
        bhActive = false;
    } else if (cardType === 'galaxies') {
        cardContainer.classList.add('galaxies-sub-cards');
        cardContainer.classList.remove('stars-sub-cards', 'planets-sub-cards', 'asteroids-sub-cards', 'black-holes-sub-cards');
        galaxiesActive = true;
        starsActive = false;
        planetsActive = false;
        asteroidsActive = false;
        bhActive = false;
    } else if (cardType === 'black_holes') {
        cardContainer.classList.add('black-holes-sub-cards');
        cardContainer.classList.remove('stars-sub-cards', 'planets-sub-cards', 'asteroids-sub-cards', 'galaxies-sub-cards');
        bhActive = true;
        starsActive = false;
        planetsActive = false;
        asteroidsActive = false;
        galaxiesActive = false;
    }
    window.addEventListener('touchstart', (event) => {
        touchStartY = event.touches[0].clientY;
    }, false);
    window.addEventListener('touchend', (event) => {
        touchEndY = event.changedTouches[0].clientY;
        handleSwipe();
    }, false);
    window.addEventListener('wheel', (event) => {
        if (!cardContainer.classList.contains(`${cardType.replace('_', '-')}-sub-cards`)) return;
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
    window.addEventListener('keydown', (event) => {
        if (!cardContainer.classList.contains(`${cardType.replace('_', '-')}-sub-cards`)) return;
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
    function handleSwipe() {
        if (!['stars-sub-cards', 'planets-sub-cards', 'asteroids-sub-cards', 'galaxies-sub-cards', 'black-holes-sub-cards'].some(cls => cardContainer.classList.contains(cls))) {
            return;
        }
        const swipeDistance = touchStartY - touchEndY;
        if (swipeDistance > 30) {
            if (currentSet === cardSets.length) return;
            cardContainer.innerHTML = '';
            renderCards(cardType, currentSet);
            currentSet += 1;
        } else if (swipeDistance < -30) {
            if (currentSet === 1) return;
            cardContainer.innerHTML = '';
            renderCards(cardType, currentSet - 2);
            currentSet -= 1;
        }
    }
    renderCards(cardType, 0);
    if (!window.location.hash.includes(`#Home-Page/${toTitleCase(cardType)}`)) {
        navigateTo(`#Home-Page/${toTitleCase(cardType)}`);
    }
    let currentSet = 1;
}

document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("searchBar");
    const suggestionsList = document.getElementById("suggestionsList");
    cachedRows = null;
    async function loadExcelFile() {
        try {
            if (!cachedRows) {
                await loadGapiClient();
                const response = await gapi.client.sheets.spreadsheets.values.get({
                    spreadsheetId: '1kzqK1_1GmIf-u76vozW3FA5ZV50IOcaI',
                    range: 'Sheet1!A2:E'
                });
                const rows = response.result.values || [];
                cachedRows = rows.map(row => ({
                    Name: row[0] || "",
                    Description: row[1] || "",
                    ImagePath: row[2] || "",
                    Type: row[3] || "",
                    Brief: row[4] || ""
                }));
            }
        } catch (error) {
            console.error("Error loading Google Sheet:", error);
        }
    }
    window.findStar = function (searchValue) {
        if (!cachedRows) {
            alert("Google Sheet is still loading. Please try again.");
            return;
        }
        const result = cachedRows.find(row => row.Name.toLowerCase() === searchValue.toLowerCase());
        if (result) {
            const typeName = result.Type.replace(/_/g, '-').replace(/ /g, '-');
            showSearchZoomedCard(result.Description, result.ImagePath, result.Name, typeName);
        } else {
            alert(`Star "${searchValue}" not found.`);
        }
    }
    searchInput.addEventListener("input", (event) => {
        const searchQuery = event.target.value.toLowerCase().trim();
        suggestionsList.innerHTML = "";
        if (searchQuery && cachedRows) {
            const filteredStars = cachedRows
                .map(row => {
                    const words = row.Name.toLowerCase().split(/\s+/);
                    const firstWordMatches = words[0].startsWith(searchQuery);
                    const anyWordMatches = words.some(word => word.startsWith(searchQuery));
                    return {
                        row,
                        relevance: firstWordMatches ? 1 : (anyWordMatches ? 2 : 3)
                    };
                })
                .filter(entry => entry.relevance < 3)
                .sort((a, b) => a.relevance - b.relevance);
            filteredStars.forEach(entry => {
                const suggestionItem = document.createElement("li");
                suggestionItem.textContent = entry.row.Name;
                suggestionItem.addEventListener("click", () => {
                    document.getElementById("searchBarInput").value = '';
                    suggestionsList.innerHTML = "";
                    suggestionsList.style.display = "none";
                    findStar(entry.row.Name);
                });
                suggestionsList.appendChild(suggestionItem);
            });
            suggestionsList.style.display = filteredStars.length > 0 ? "block" : "none";
        } else {
            suggestionsList.style.display = "none";
        }
    });
    loadExcelFile();
});

function showSearchZoomedCard(text, imagePath, name, type) {
    const zoomedCard = document.getElementById("zoomed-card");
    const zoomedContent = document.getElementById("zoomed-content");
    const zoomedText = document.getElementById("zoomed-text");
    const zoomedImage = zoomedCard.querySelector("img");
    removeCalendar();
    zoomedImage.src = imagePath || "Images/Favicon.jpg";
    zoomedImage.alt = name || "Star Image";
    zoomedText.innerHTML = `<div style="text-align: center; font-size: 50px;">${name}</div><p>${text}</p>`;
    zoomedCard.classList.remove("hidden");
    setTimeout(() => zoomedContent.classList.add("zoomed-in"), 10);
    const bodyName = name.replace(/%20/g, '-').replace(/ /g, '-');
    if (!window.location.hash.includes(`#Home-Page/${type}/${bodyName}`)) {
        navigateTo(`#Home-Page/${type}/${bodyName}`);
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
        .split(/[\s-_]+/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join('-');
}

let cachedCredentials = null;

async function loadCredentialsFromExcel() {
    try {
        if (!cachedCredentials) {
            await loadGapiClient();
            const response = await gapi.client.sheets.spreadsheets.values.get({
                spreadsheetId: '1kzqK1_1GmIf-u76vozW3FA5ZV50IOcaI',
                range: 'Sheet3!A2:F'
            });
            const rows = response.result.values || [];
            cachedCredentials = rows.map(row => ({
                RegisteredDateTime: row[0] || "",
                Name: row[1] || "",
                Email: row[2] || "",
                DateOfBirth: row[3] || "",
                PhoneNumber: row[4] || "",
                Password: row[5] || ""
            }));
        }
    } catch (error) {
        console.error("Error loading Google Sheet:", error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    function handlePopup() {
        const openPopupButton = document.getElementById('open-popup');
        const closePopupButton = document.getElementById('close-popup');
        const popup = document.getElementById('popup');
        const popupContent = document.querySelector('.popup-content');
        openPopupButton?.addEventListener('click', () => {
            popup.style.display = 'flex';
        });
        closePopupButton?.addEventListener('click', () => {
            popup.style.display = 'none';
        });
        popup?.addEventListener('click', (event) => {
            if (!popupContent.contains(event.target)) {
                popup.style.display = 'none';
            }
        });
    }
    function handleFormSwitching() {
        const recoveryLink = document.querySelector('.login-form .switch-to-recovery');
        const loginLink = document.querySelector('.recovery-form a');
        const registrationLink = document.querySelector('.login-form .register-link');
        const loginForm = document.querySelector('.login-form');
        const registrationForm = document.querySelector('.registration-form');
        const popup = document.getElementById('popup');
        recoveryLink?.addEventListener('click', (event) => {
            event.preventDefault();
            popup.classList.add('recovery-active');
        });
        loginLink?.addEventListener('click', (event) => {
            event.preventDefault();
            popup.classList.remove('recovery-active');
        });
        registrationLink?.addEventListener('click', (event) => {
            event.preventDefault();
            popup.classList.add('registration-active');
            popup.classList.remove('recovery-active');
        });
        const backToLoginLink = document.querySelector('.registration-form .back-to-login');
        backToLoginLink?.addEventListener('click', (event) => {
            event.preventDefault();
            popup.classList.remove('registration-active');
            popup.classList.remove('recovery-active');
        });
    }
    handlePopup();
    handleFormSwitching();
});


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

            // If valid, check if email or phone exists in Google Sheet
            if (valid) {
                const registrationData = {
                    name: nameInput.value.trim(),
                    email: emailInput.value.trim(),
                    dob: dobInput.value.trim(),
                    phone: phoneInput.value.trim(),
                    password: passwordInput.value.trim()
                };

                try {
                    await loadCredentialsFromExcel();
                    if (cachedCredentials.some(cred => cred.Email.toLowerCase() === registrationData.email.toLowerCase())) {
                        emailError.innerHTML = '<span>This email is already registered. Please use a different email.</span>';
                        return;
                    }
                    if (cachedCredentials.some(cred => cred.PhoneNumber === registrationData.phone)) {
                        phoneError.innerHTML = '<span>This number is already registered. Please use a different number.</span>';
                        return;
                    }

                    // Simulate registration (actual write requires server-side API)
                    const registeredDateTime = new Date().toISOString();
                    const newUser = [
                        registeredDateTime,
                        registrationData.name,
                        registrationData.email,
                        registrationData.dob,
                        registrationData.phone,
                        registrationData.password
                    ];
                    console.log("New user to be appended to Sheet3:", newUser);
                    alert("Registration submitted. Please contact the admin to complete registration via server-side Google Sheets API.");

                    // Update local cache for demo purposes
                    cachedCredentials.push({
                        RegisteredDateTime: registeredDateTime,
                        Name: registrationData.name,
                        Email: registrationData.email,
                        DateOfBirth: registrationData.dob,
                        PhoneNumber: registrationData.phone,
                        Password: registrationData.password
                    });

                    userSignedIn = true;
                    userData = {
                        Name: registrationData.name,
                        Email: registrationData.email,
                        DateOfBirth: registrationData.dob,
                        PhoneNumber: registrationData.phone,
                        Password: registrationData.password
                    };

                    // Clear form inputs
                    nameInput.value = '';
                    emailInput.value = '';
                    dobInput.value = '';
                    phoneInput.value = '';
                    passwordInput.value = '';
                    confirmPasswordInput.value = '';

                    setTimeout(() => alert("Registration successful!"), 500);

                    document.getElementById('popup').style.display = 'none';
                    setTimeout(() => horoscopeView(), 300);
                } catch (error) {
                    userData = null;
                    userSignedIn = false;
                    console.error("Error during registration:", error);
                    alert("An error occurred. Please try again.");
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

    const defaultCountryCode = "+91";

    // ✅ Get DOM Elements
    const sendOtpButton = document.getElementById("otpsend");
    const verifyOtpButton = document.getElementById("verify-otp");
    const phoneNumberInput = document.getElementById("phone-number");
    const otpInput = document.getElementById("otp");
    const phoneError = document.getElementById("phone-error");
    const message = document.getElementById("message");
    const verifySection = document.getElementById("verify-section");

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

    // 🔹 Global Variable for Phone Number and OTP
    let storedPhoneNumber = "";
    let storedOtp = "";

    // 🔹 Check if Phone Number Exists in Google Sheet
    async function isPhoneNumberRegistered(phoneNumber) {
        await loadCredentialsFromExcel();
        if (!cachedCredentials || cachedCredentials.length === 0) {
            console.error("No credentials found in database.");
            return false;
        }
        return cachedCredentials.some(row => row.PhoneNumber === phoneNumber);
    }

    // 🔹 Send OTP Function (With Database Check)
    async function sendOTP() {
        let phoneNumber = phoneNumberInput.value.trim();

        const regex = /^\d{10}$/;
        if (!regex.test(phoneNumber)) {
            phoneError.innerHTML = '<span>Invalid phone number.</span>';
            return;
        }

        // Check if the phone number is in the database
        const isRegistered = await isPhoneNumberRegistered(phoneNumber);
        if (!isRegistered) {
            phoneError.innerHTML = '<span>This phone number is not registered.</span>';
            return;
        }

        // Store phone number globally
        storedPhoneNumber = phoneNumber;

        try {
            // Generate a 6-digit OTP
            storedOtp = Math.floor(100000 + Math.random() * 900000).toString();
            console.log(`OTP for ${phoneNumber}: ${storedOtp}`);
            alert(`OTP sent to ${phoneNumber}. Check console for demo OTP.`);

            // Disable button for 5 seconds
            disableSendOtpButton(5);

            // Show Verify OTP Section
            verifySection.style.display = "block";
        } catch (error) {
            console.error("Error sending OTP:", error);
            phoneError.innerHTML = `<span>${error.message}</span>`;
        }
    }

    // 🔹 Verify OTP Function
    async function verifyOTP() {
        const otp = otpInput.value.trim();

        if (!otp) {
            message.innerHTML = "Enter OTP.";
            return;
        }

        try {
            if (otp === storedOtp) {
                message.innerHTML = "OTP Verified!";

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
                    }, 500);
                }
            } else {
                message.innerHTML = "Invalid OTP.";
            }
        } catch (error) {
            console.error("OTP Verification Error:", error);
            message.innerHTML = "Invalid OTP.";
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
        zoomedImage.src = result.ImagePath || "Images/Favicon.jpg";
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
                const afterBodyName = bodyNameMatch[2].replace(/-/g, ' ');
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
    }, 100);
}
