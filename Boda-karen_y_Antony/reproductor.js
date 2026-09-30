const progreso = document.getElementById('progreso');
const cancion = document.getElementById('cancion');

const IconoControl = document.getElementById('pause');
const botonReproducir = document.querySelector('.controles button.reproducir');

const canciones = [
    {
        fuente: 'assets/audio/Toma_mi_mano.mp3'
    }
];

let indiceCancionActual = 0;

function ActulizarCancion() {
    cancion.src = canciones[indiceCancionActual].fuente;

    // cuando se conoce la duración, ajustamos el range
    cancion.addEventListener('loadedmetadata', function () {
        if (progreso) {
            progreso.min = 0;
            progreso.max = Math.floor(cancion.duration) || 0;
            progreso.value = 0;
            progreso.step = 1;
        }
        tryAutoplay(); // intentamos autoplay cuando ya sabemos la metadata
    });
}

if (botonReproducir) {
    botonReproducir.addEventListener('click', reproducirPausar);
}

function reproducirPausar() {
    if (cancion.paused) {
        reproducirCancion();
    } else {
        pausarCancion();
    }
}

function reproducirCancion() {
    cancion.play()
        .then(() => {
            IconoControl.classList.add('bi-pause-fill');
            IconoControl.classList.remove('bi-play-circle');
        })
        .catch(err => {
            // si falla, lo manejamos silenciosamente (se intentará en el primer gesto)
            console.warn('No se pudo reproducir automáticamente:', err);
        });
}

function pausarCancion() {
    cancion.pause();
    IconoControl.classList.remove('bi-pause-fill');
    IconoControl.classList.add('bi-play-circle');
}

// actualizar barra de progreso en cada cambio de tiempo
cancion.addEventListener('timeupdate', function () {
    if (progreso) {
        progreso.value = Math.floor(cancion.currentTime);
    }
});

// al arrastrar el slider
if (progreso) {
    progreso.addEventListener('input', function () {
        cancion.currentTime = progreso.value;
    });

    // si sueltas el slider, asegúrate de reproducir (opcional)
    progreso.addEventListener('change', function () {
        reproducirCancion();
    });
}

// Intento de autoplay robusto
function tryAutoplay() {
    cancion.play()
        .then(() => {
            // Autoplay permitido
            IconoControl.classList.add('bi-pause-fill');
            IconoControl.classList.remove('bi-play-circle');
        })
        .catch(() => {
            // Autoplay bloqueado -> reproducir en el primer gesto del usuario
            addFirstGestureListener();
            console.warn('Autoplay bloqueado por el navegador. Se reproducirá en el primer gesto del usuario.');
        });
}

function addFirstGestureListener() {
    function onFirstGesture() {
        cancion.play().catch(e => console.warn('Error al reproducir tras gesto:', e));
        removeGestureListeners();
    }
    function removeGestureListeners() {
        document.removeEventListener('click', onFirstGesture);
        document.removeEventListener('touchstart', onFirstGesture);
    }
    document.addEventListener('click', onFirstGesture, { once: true });
    document.addEventListener('touchstart', onFirstGesture, { once: true });
}

// inicializa
ActulizarCancion();
