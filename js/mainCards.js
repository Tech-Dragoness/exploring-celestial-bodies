// Define the cards HTML
let cardsHTML = `
<div class="card" onclick="triggerZoomEffect('stars')">
        <div class="card-image" style="background-image: url('Images/Stars.JPG');"></div>
        <div class="card-name">Stars</div>
        <div class="card-hover-content">
            <div class="line top-line"></div>
            <div class="description">Stars are luminous spheres of plasma, the primary sources of light and energy in the universe.</div>
            <div class="line side-line"></div>
        </div>
    </div>
    <div class="card" onclick="triggerZoomEffect('planets')">
        <div class="card-image" style="background-image: url('Images/Planets.JPG');"></div>
        <div class="card-name">Planets</div>
        <div class="card-hover-content">
            <div class="line top-line"></div>
            <div class="description">Planets are celestial bodies orbiting stars, with rocky or gaseous compositions.</div>
            <div class="line side-line"></div>
        </div>
    </div>
    <div class="card" onclick="triggerZoomEffect('asteroids')">
        <div class="card-image" style="background-image: url('Images/Asteroids.JPG');"></div>
        <div class="card-name">Asteroids</div>
        <div class="card-hover-content">
            <div class="line top-line"></div>
            <div class="description">Asteroids are small, rocky bodies that orbit the Sun, mainly in the asteroid belt between Mars and Jupiter.</div>
            <div class="line side-line"></div>
        </div>
    </div>
    <div class="card" onclick="triggerZoomEffect('galaxies')">
        <div class="card-image" style="background-image: url('Images/Galaxies.JPG');"></div>
        <div class="card-name">Galaxies</div>
        <div class="card-hover-content">
            <div class="line top-line"></div>
            <div class="description">Galaxies are massive systems of stars, gas, and dust, bound together by gravity.</div>
            <div class="line side-line"></div>
        </div>
    </div>
    <div class="card" onclick="triggerZoomEffect('black_holes')">
        <div class="card-image" style="background-image: url('Images/Black_Holes.JPG');"></div>
        <div class="card-name">Black Holes</div>
        <div class="card-hover-content">
            <div class="line top-line"></div>
            <div class="description">Black holes are regions in space with gravity so strong that nothing, not even light, can escape.</div>
            <div class="line side-line"></div>
        </div>
    </div>
`;