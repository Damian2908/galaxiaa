/* =========================================================
   MI GALAXIA — LOVE UNIVERSE
   Motor principal
========================================================= */

const canvas =
    document.getElementById("galaxy");

const ctx =
    canvas.getContext("2d");


/* =========================================================
   CONFIGURACIÓN
========================================================= */

let width;
let height;

let stars = [];
let particles = [];

let planets = [];

let ship = {
    angle: 0,
    distance: 110,
    x: 0,
    y: 0
};

let camera = {
    x: 0,
    y: 0,
    zoom: 1
};

let dragging = false;

let lastX = 0;
let lastY = 0;

let selectedPlanet = null;

let universeStarted = false;


/* =========================================================
   PROGRESO
========================================================= */

let saveData = {
    love: 100,
    memories: 0,
    visited: {
        history: false,
        memories: false,
        letter: false,
        achievements: false,
        settings: false
    }
};


try {

    const stored =
        localStorage.getItem(
            "miGalaxiaSave"
        );

    if (stored) {

        saveData =
            JSON.parse(stored);

    }

} catch (error) {

    console.log(
        "No se pudo cargar el progreso."
    );
}


function saveGame() {

    try {

        localStorage.setItem(
            "miGalaxiaSave",
            JSON.stringify(saveData)
        );

    } catch (error) {

        console.log(
            "No se pudo guardar."
        );
    }

}


/* =========================================================
   CANVAS
========================================================= */

function resize() {

    const dpr =
        Math.min(
            window.devicePixelRatio || 1,
            2
        );

    width =
        window.innerWidth;

    height =
        window.innerHeight;

    canvas.width =
        width * dpr;

    canvas.height =
        height * dpr;

    canvas.style.width =
        width + "px";

    canvas.style.height =
        height + "px";

    ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
    );

    createStars();
}


window.addEventListener(
    "resize",
    resize
);


/* =========================================================
   ESTRELLAS
========================================================= */

function createStars() {

    stars = [];

    const amount =
        Math.min(
            450,
            Math.floor(
                width * height / 5000
            )
        );

    for (
        let i = 0;
        i < amount;
        i++
    ) {

        stars.push({

            x:
                Math.random() * width,

            y:
                Math.random() * height,

            radius:
                Math.random() * 1.8 + .2,

            alpha:
                Math.random() * .8 + .2,

            phase:
                Math.random() *
                Math.PI * 2,

            speed:
                Math.random() *
                .02 + .005

        });

    }

}


/* =========================================================
   PARTÍCULAS
========================================================= */

function createParticles() {

    particles = [];

    for (
        let i = 0;
        i < 80;
        i++
    ) {

        particles.push({

            angle:
                Math.random() *
                Math.PI * 2,

            distance:
                Math.random() *
                Math.max(width,height),

            speed:
                Math.random() *
                .0005 + .0001,

            size:
                Math.random() *
                2 + .5

        });

    }

}


/* =========================================================
   PLANETAS
========================================================= */

function createPlanets() {

    planets = [

        {
            id: "history",
            name: "PLANETA HISTORIA",
            icon: "📖",
            description:
                "Aquí comienza nuestra historia.",
            color: "#ff5ca8",
            radius: 125,
            size: 24,
            angle: 0,
            speed: .00015
        },

        {
            id: "memories",
            name: "PLANETA RECUERDOS",
            icon: "🌙",
            description:
                "Los momentos que decidimos guardar.",
            color: "#8d7aff",
            radius: 190,
            size: 20,
            angle: 2,
            speed: .0001
        },

        {
            id: "letter",
            name: "PLANETA CARTA",
            icon: "💌",
            description:
                "Un mensaje escondido entre las estrellas.",
            color: "#ff82c4",
            radius: 250,
            size: 22,
            angle: 4,
            speed: .00008
        },

        {
            id: "achievements",
            name: "PLANETA LOGROS",
            icon: "🏆",
            description:
                "Todo lo que hemos conseguido.",
            color: "#ffd76b",
            radius: 310,
            size: 18,
            angle: 1,
            speed: .00006
        },

        {
            id: "settings",
            name: "PLANETA SISTEMA",
            icon: "⚙️",
            description:
                "Configuración del universo.",
            color: "#72baff",
            radius: 365,
            size: 19,
            angle: 3,
            speed: .00005
        }

    ];

}


/* =========================================================
   CENTRO DE GALAXIA
========================================================= */

function galaxyCenter() {

    return {

        x:
            width / 2 + camera.x,

        y:
            height / 2 + camera.y

    };

}


/* =========================================================
   DIBUJAR FONDO
========================================================= */

function drawBackground() {

    const gradient =
        ctx.createRadialGradient(
            width / 2,
            height / 2,
            0,
            width / 2,
            height / 2,
            Math.max(width,height)
        );

    gradient.addColorStop(
        0,
        "#25103f"
    );

    gradient.addColorStop(
        .4,
        "#0d0625"
    );

    gradient.addColorStop(
        1,
        "#02000c"
    );

    ctx.fillStyle =
        gradient;

    ctx.fillRect(
        0,
        0,
        width,
        height
    );

}


/* =========================================================
   NEBULOSA
========================================================= */

function drawNebula() {

    const time =
        Date.now() * .00005;

    for (
        let i = 0;
        i < 7;
        i++
    ) {

        const x =
            width / 2 +
            Math.sin(
                time + i
            ) *
            width *
            .3;

        const y =
            height / 2 +
            Math.cos(
                time * 1.3 + i
            ) *
            height *
            .25;

        const radius =
            120 + i * 60;

        const gradient =
            ctx.createRadialGradient(
                x,
                y,
                0,
                x,
                y,
                radius
            );

        gradient.addColorStop(
            0,
            `rgba(
                ${150 + i * 10},
                40,
                150,
                .06
            )`
        );

        gradient.addColorStop(
            1,
            "rgba(0,0,0,0)"
        );

        ctx.fillStyle =
            gradient;

        ctx.beginPath();

        ctx.arc(
            x,
            y,
            radius,
            0,
            Math.PI * 2
        );

        ctx.fill();

    }

}


/* =========================================================
   ESTRELLAS
========================================================= */

function drawStars() {

    const time =
        Date.now();

    for (const star of stars) {

        const pulse =
            (
                Math.sin(
                    time * star.speed +
                    star.phase
                ) + 1
            ) / 2;

        ctx.globalAlpha =
            star.alpha *
            (.5 + pulse * .5);

        ctx.fillStyle =
            "#ffffff";

        ctx.beginPath();

        ctx.arc(
            star.x,
            star.y,
            star.radius,
            0,
            Math.PI * 2
        );

        ctx.fill();

    }

    ctx.globalAlpha = 1;

}


/* =========================================================
   PARTÍCULAS ORBITALES
========================================================= */

function drawParticles() {

    const center =
        galaxyCenter();

    const time =
        Date.now();

    for (const p of particles) {

        p.angle += p.speed;

        const distance =
            p.distance % 500;

        const x =
            center.x +
            Math.cos(
                p.angle +
                time * .00005
            ) *
            distance;

        const y =
            center.y +
            Math.sin(
                p.angle +
                time * .00005
            ) *
            distance *
            .45;

        ctx.globalAlpha =
            .15;

        ctx.fillStyle =
            "#dca4ff";

        ctx.beginPath();

        ctx.arc(
            x,
            y,
            p.size,
            0,
            Math.PI * 2
        );

        ctx.fill();

    }

    ctx.globalAlpha = 1;

}


/* =========================================================
   ÓRBITAS
========================================================= */

function drawOrbits() {

    const center =
        galaxyCenter();

    for (const planet of planets) {

        ctx.beginPath();

        ctx.ellipse(
            center.x,
            center.y,
            planet.radius,
            planet.radius * .45,
            0,
            0,
            Math.PI * 2
        );

        ctx.strokeStyle =
            "rgba(255,255,255,.06)";

        ctx.lineWidth = 1;

        ctx.stroke();

    }

}


/* =========================================================
   PLANETAS
========================================================= */

function getPlanetPosition(
    planet
) {

    const center =
        galaxyCenter();

    return {

        x:
            center.x +
            Math.cos(
                planet.angle
            ) *
            planet.radius,

        y:
            center.y +
            Math.sin(
                planet.angle
            ) *
            planet.radius *
            .45

    };

}


function drawPlanets() {

    for (const planet of planets) {

        planet.angle +=
            planet.speed;

        const pos =
            getPlanetPosition(
                planet
            );

        const gradient =
            ctx.createRadialGradient(
                pos.x - 7,
                pos.y - 7,
                2,
                pos.x,
                pos.y,
                planet.size * 2
            );

        gradient.addColorStop(
            0,
            "#ffffff"
        );

        gradient.addColorStop(
            .2,
            planet.color
        );

        gradient.addColorStop(
            1,
            "rgba(0,0,0,0)"
        );

        ctx.fillStyle =
            gradient;

        ctx.beginPath();

        ctx.arc(
            pos.x,
            pos.y,
            planet.size * 2,
            0,
            Math.PI * 2
        );

        ctx.fill();

        ctx.fillStyle =
            planet.color;

        ctx.beginPath();

        ctx.arc(
            pos.x,
            pos.y,
            planet.size,
            0,
            Math.PI * 2
        );

        ctx.fill();

        ctx.globalAlpha = .35;

        ctx.beginPath();

        ctx.arc(
            pos.x - 5,
            pos.y - 6,
            planet.size * .35,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            "#ffffff";

        ctx.fill();

        ctx.globalAlpha = 1;

    }

}


/* =========================================================
   CORAZÓN CENTRAL
========================================================= */

function drawHeart(
    x,
    y,
    size
) {

    const pulse =
        1 +
        Math.sin(
            Date.now() * .004
        ) *
        .08;

    size *= pulse;

    ctx.save();

    ctx.translate(
        x,
        y
    );

    ctx.scale(
        size,
        size
    );

    ctx.beginPath();

    ctx.moveTo(
        0,
        .3
    );

    ctx.bezierCurveTo(
        -.5,
        -.1,
        -1,
        -.4,
        -1,
        -.8
    );

    ctx.bezierCurveTo(
        -1,
        -1.5,
        -.2,
        -1.7,
        0,
        -1
    );

    ctx.bezierCurveTo(
        .2,
        -1.7,
        1,
        -1.5,
        1,
        -.8
    );

    ctx.bezierCurveTo(
        1,
        -.4,
        .5,
        -.1,
        0,
        .3
    );

    const gradient =
        ctx.createRadialGradient(
            -.2,
            -.5,
            .1,
            0,
            0,
            1.5
        );

    gradient.addColorStop(
        0,
        "#ffffff"
    );

    gradient.addColorStop(
        .25,
        "#ff8ac5"
    );

    gradient.addColorStop(
        1,
        "#ff237d"
    );

    ctx.fillStyle =
        gradient;

    ctx.shadowBlur = 30;

    ctx.shadowColor =
        "#ff398f";

    ctx.fill();

    ctx.restore();

}


/* =========================================================
   NAVE
========================================================= */

function drawShip() {

    const center =
        galaxyCenter();

    ship.angle +=
        .002;

    ship.x =
        center.x +
        Math.cos(ship.angle) *
        ship.distance;

    ship.y =
        center.y +
        Math.sin(ship.angle) *
        ship.distance *
        .45;

    ctx.save();

    ctx.translate(
        ship.x,
        ship.y
    );

    ctx.rotate(
        ship.angle + Math.PI / 2
    );

    ctx.font =
        "28px Arial";

    ctx.textAlign =
        "center";

    ctx.textBaseline =
        "middle";

    ctx.fillText(
        "🚀",
        0,
        0
    );

    ctx.restore();

}


/* =========================================================
   GALAXIA COMPLETA
========================================================= */

function drawUniverse() {

    drawBackground();

    drawNebula();

    drawStars();

    drawParticles();

    drawOrbits();

    drawPlanets();

    const center =
        galaxyCenter();

    drawHeart(
        center.x,
        center.y,
        35
    );

    drawShip();

}


/* =========================================================
   ANIMACIÓN
========================================================= */

function animate() {

    requestAnimationFrame(
        animate
    );

    if (
        universeStarted
    ) {

        drawUniverse();

    }

}


resize();

createParticles();

createPlanets();

animate();


/* =========================================================
   INTERFAZ
========================================================= */

const intro =
    document.getElementById(
        "intro"
    );

const universe =
    document.getElementById(
        "universe"
    );

const sectionScreen =
    document.getElementById(
        "sectionScreen"
    );


const enterButton =
    document.getElementById(
        "enterButton"
    );


enterButton.addEventListener(
    "click",
    startUniverse
);


function startUniverse() {

    universeStarted = true;

    intro.classList.remove(
        "active"
    );

    universe.classList.add(
        "active"
    );

}


/* =========================================================
   PLANETA INFO
========================================================= */

const planetInfo =
    document.getElementById(
        "planetInfo"
    );

const planetTitle =
    document.getElementById(
        "planetTitle"
    );

const planetDescription =
    document.getElementById(
        "planetDescription"
    );

const planetIcon =
    document.getElementById(
        "planetIcon"
    );

const visitPlanet =
    document.getElementById(
        "visitPlanet"
    );

const closeInfo =
    document.getElementById(
        "closeInfo"
    );


function showPlanet(
    planet
) {

    selectedPlanet =
        planet;

    planetTitle.textContent =
        planet.name;

    planetDescription.textContent =
        planet.description;

    planetIcon.textContent =
        planet.icon;

    planetInfo.classList.add(
        "show"
    );

}


closeInfo.addEventListener(
    "click",
    () => {

        planetInfo.classList.remove(
            "show"
        );

    }
);


/* =========================================================
   CLICK / TOQUE
========================================================= */

function pointerPosition(
    event
) {

    const rect =
        canvas.getBoundingClientRect();

    return {

        x:
            event.clientX -
            rect.left,

        y:
            event.clientY -
            rect.top

    };

}


canvas.addEventListener(
    "pointerdown",
    event => {

        dragging = true;

        lastX =
            event.clientX;

        lastY =
            event.clientY;

    }
);


canvas.addEventListener(
    "pointermove",
    event => {

        if (!dragging)
            return;

        const dx =
            event.clientX -
            lastX;

        const dy =
            event.clientY -
            lastY;

        camera.x += dx;
        camera.y += dy;

        lastX =
            event.clientX;

        lastY =
            event.clientY;

    }
);


canvas.addEventListener(
    "pointerup",
    event => {

        if (!dragging)
            return;

        dragging = false;

        const pos =
            pointerPosition(
                event
            );

        checkPlanetClick(
            pos.x,
            pos.y
        );

    }
);


canvas.addEventListener(
    "pointercancel",
    () => {

        dragging = false;

    }
);


/* =========================================================
   DETECTAR PLANETA
========================================================= */

function checkPlanetClick(
    x,
    y
) {

    for (const planet of planets) {

        const pos =
            getPlanetPosition(
                planet
            );

        const dx =
            x - pos.x;

        const dy =
            y - pos.y;

        const distance =
            Math.sqrt(
                dx * dx +
                dy * dy
            );

        if (
            distance <
            planet.size * 2.5
        ) {

            showPlanet(
                planet
            );

            return;

        }

    }

}


/* =========================================================
   VISITAR PLANETA
========================================================= */

visitPlanet.addEventListener(
    "click",
    () => {

        if (
            !selectedPlanet
        )
            return;

        openSection(
            selectedPlanet.id
        );

        planetInfo.classList.remove(
            "show"
        );

    }
);


/* =========================================================
   SECCIONES
========================================================= */

const sectionIcon =
    document.getElementById(
        "sectionIcon"
    );

const sectionTitle =
    document.getElementById(
        "sectionTitle"
    );

const sectionText =
    document.getElementById(
        "sectionText"
    );

const memoryList =
    document.getElementById(
        "memoryList"
    );


const sectionData = {

    history: {

        icon: "📖",

        title:
            "Nuestra Historia",

        text:
            "Aquí comienza nuestro pequeño viaje. Cada capítulo puede convertirse en un recuerdo."

    },

    memories: {

        icon: "🌙",

        title:
            "Nuestros Recuerdos",

        text:
            "Los momentos especiales quedan guardados como estrellas dentro de esta galaxia."

    },

    letter: {

        icon: "💌",

        title:
            "Carta Especial",

        text:
            "Hay mensajes que merecen viajar mucho más lejos que cualquier planeta."

    },

    achievements: {

        icon: "🏆",

        title:
            "Logros",

        text:
            "Cada cosa que descubras puede convertirse en una nueva estrella de tu universo."

    },

    settings: {

        icon: "⚙️",

        title:
            "Sistema",

        text:
            "Configuración de Mi Galaxia."

    }

};


function openSection(
    id
) {

    const data =
        sectionData[id];

    if (!data)
        return;

    saveData.visited[id] =
        true;

    saveData.memories =
        Object.values(
            saveData.visited
        ).filter(
            value => value
        ).length;

    saveGame();

    sectionIcon.textContent =
        data.icon;

    sectionTitle.textContent =
        data.title;

    sectionText.textContent =
        data.text;

    memoryList.innerHTML = "";

    if (
        id === "memories"
    ) {

        const memories = [

            "✨ El comienzo",

            "🌸 Un momento especial",

            "🌙 Bajo las estrellas",

            "💗 Un recuerdo guardado",

            "🌌 Nuestro universo"

        ];

        memories.forEach(
            (memory, index) => {

                const item =
                    document.createElement(
                        "div"
                    );

                item.className =
                    "memory";

                item.textContent =
                    `${index + 1}. ${memory}`;

                memoryList.appendChild(
                    item
                );

            }
        );

    }

    if (
        id === "history"
    ) {

        const chapters = [

            "❤️ Capítulo I — El encuentro",

            "🌸 Capítulo II — El paseo",

            "🌙 Capítulo III — Bajo las estrellas",

            "🌅 Capítulo IV — Nuestro atardecer",

            "✨ Capítulo V — Para siempre"

        ];

        chapters.forEach(
            chapter => {

                const item =
                    document.createElement(
                        "div"
                    );

                item.className =
                    "memory";

                item.textContent =
                    chapter;

                memoryList.appendChild(
                    item
                );

            }
        );

    }

    sectionScreen.classList.add(
        "active"
    );

    universe.classList.remove(
        "active"
    );

}


/* =========================================================
   VOLVER A GALAXIA
========================================================= */

document
    .getElementById(
        "backGalaxy"
    )
    .addEventListener(
        "click",
        () => {

            sectionScreen.classList.remove(
                "active"
            );

            universe.classList.add(
                "active"
            );

            updateStats();

        }
    );


/* =========================================================
   HOME
========================================================= */

document
    .getElementById(
        "homeButton"
    )
    .addEventListener(
        "click",
        () => {

            camera.x = 0;
            camera.y = 0;

        }
    );


/* =========================================================
   ESTADÍSTICAS
========================================================= */

function updateStats() {

    document.getElementById(
        "loveValue"
    ).textContent =
        saveData.love;

    document.getElementById(
        "memoryValue"
    ).textContent =
        saveData.memories;

}


updateStats();


/* =========================================================
   ATAJOS
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape"
        ) {

            planetInfo.classList.remove(
                "show"
            );

            sectionScreen.classList.remove(
                "active"
            );

            universe.classList.add(
                "active"
            );

        }

    }
);