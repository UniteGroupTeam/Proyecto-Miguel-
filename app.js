document.addEventListener('DOMContentLoaded', () => {
    initThreeJS();
    initAnimations();
    initPWA();
    initForm();
});

// --- THREE.JS BACKGROUND ---
function initThreeJS() {
    const container = document.getElementById('three-container');
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Create a dynamic particle field
    const geometry = new THREE.BufferGeometry();
    const count = 5000;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 10;
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
        color: 0x03DAC6,
        size: 0.02,
        transparent: true,
        opacity: 0.8
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    camera.position.z = 3;

    function animate() {
        requestAnimationFrame(animate);
        points.rotation.y += 0.001;
        points.rotation.x += 0.0005;
        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// --- GSAP ANIMATIONS ---
function initAnimations() {
    gsap.to('.fade-in', {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.3,
        ease: 'power3.out'
    });

    if (typeof ScrollTrigger !== 'undefined') {
        gsap.utils.toArray('.glass-card').forEach(card => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 80%',
                },
                opacity: 0,
                y: 50,
                duration: 1,
                ease: 'power2.out'
            });
        });
    }
}

// --- PWA INSTALL LOGIC ---
function initPWA() {
    let deferredPrompt;
    const pwaToast = document.getElementById('pwa-toast');
    const installBtn = document.getElementById('btn-install');

    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        if (pwaToast) pwaToast.style.display = 'block';
    });

    if (installBtn) {
        installBtn.addEventListener('click', async () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                if (outcome === 'accepted') {
                    if (pwaToast) pwaToast.style.display = 'none';
                }
                deferredPrompt = null;
            }
        });
    }
}

// --- FORM HANDLING ---
function initForm() {
    const form = document.getElementById('registration-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerText = 'Enviando...';

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Handle multi-checkbox
        const servicios = formData.getAll('servicio');
        data.servicios = servicios.join(', ');

        // Generate Random ID
        const folioId = Math.floor(100000 + Math.random() * 900000);
        data.folio = folioId;

        try {
            // WEBHOOK Integration (Google Sheets)
            // The USER should provide the actual URL, but we set up the POST logic.
            const WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbyL4v4v4v4v4v4v4v4v/exec'; 
            
            // Note: In a real scenario, we use fetch with mode: 'no-cors' for Apps Script
            // or handle the CORS in the script. For now, we simulate success for the demo.
            console.log('Sending data to Webhook:', data);
            
            // Simulating fetch
            // await fetch(WEBHOOK_URL, {
            //     method: 'POST',
            //     mode: 'no-cors',
            //     body: JSON.stringify(data)
            // });

            // Show Success
            showSuccess(data);
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Hubo un error al enviar el registro. Por favor intenta de nuevo.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerText = 'Registrar Calzado';
        }
    });
}

function showSuccess(data) {
    const modal = document.getElementById('success-modal');
    const folioSpan = document.getElementById('folio-id');
    const whatsappBtn = document.getElementById('whatsapp-btn');

    folioSpan.innerText = data.folio;

    // WHATSAPP API Integration
    const phone = '4732924885'; // Number from the form analysis
    const message = `Hola, confirmo mi entrega de [${data.marca}/${data.modelo}] para el servicio de [${data.servicios}] en el punto [${data.punto}]. Folio generado: [${data.folio}]`;
    
    whatsappBtn.href = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    
    modal.style.display = 'block';
    gsap.from(modal, {
        scale: 0.8,
        opacity: 0,
        duration: 0.5,
        ease: 'back.out(1.7)'
    });

    // Blur background
    document.getElementById('registration-form').style.filter = 'blur(10px)';
}
