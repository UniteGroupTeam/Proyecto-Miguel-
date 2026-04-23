document.addEventListener('DOMContentLoaded', () => {
    const orderForm = document.getElementById('orderForm');
    const submitBtn = document.getElementById('submitBtn');
    const successModal = document.getElementById('successModal');
    const whatsappBtn = document.getElementById('whatsappBtn');
    const closeModal = document.getElementById('closeModal');
    const installToast = document.getElementById('installToast');
    const toastInstall = document.getElementById('toastInstall');
    const toastDismiss = document.getElementById('toastDismiss');
    const navInstallBtn = document.getElementById('navInstallBtn');
    const waTrigger = document.getElementById('waTrigger');

    let deferredPrompt;
    let generatedFolio = '';

    // Business Data
    const CONTACT_WHATSAPP = '524732924885'; // (473) 292 48 85

    // Pre-fill Plan from URL
    const urlParams = new URLSearchParams(window.location.search);
    const selectedPlan = urlParams.get('plan');
    if (selectedPlan && document.querySelector('input[name="servicio"]')) {
        const radio = document.querySelector(`input[value^="${selectedPlan}"]`);
        if (radio) radio.checked = true;
    }

    // Generate Random Folio
    const generateFolio = () => {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const numbers = '0123456789';
        let res = 'LAB-';
        for(let i=0; i<2; i++) res += letters.charAt(Math.floor(Math.random() * letters.length));
        for(let i=0; i<4; i++) res += numbers.charAt(Math.floor(Math.random() * numbers.length));
        return res;
    };

    // Form Submission
    if (orderForm) {
        orderForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="loader"></span> Registrando...';
            
            const formData = new FormData(orderForm);
            const data = Object.fromEntries(formData.entries());
            
            // Handle multiple checkboxes for Physical State
            data.estado_fisico = formData.getAll('estado_fisico').join(', ');
            
            generatedFolio = generateFolio();
            data.folio = generatedFolio;
            data.timestamp = new Date().toLocaleString();

            try {
                // IMPORTANT: Replace this URL with your Google Apps Script Web App URL
                const WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbz_REPLACE_WITH_YOUR_ID/exec';
                
                await fetch(WEBHOOK_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    cache: 'no-cache',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                document.getElementById('folioDisplay').textContent = generatedFolio;
                showSuccess(data);
            } catch (error) {
                console.error('Error:', error);
                document.getElementById('folioDisplay').textContent = generatedFolio;
                showSuccess(data);
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Registrar Entrada';
            }
        });
    }

    const showSuccess = (data) => {
        successModal.classList.remove('hidden');
        
        // Setup WhatsApp Button
        whatsappBtn.onclick = () => {
            const message = `Hola, confirmo mi entrega de calzado:\nFolio: ${data.folio}\nNombre: ${data.nombre}\nBolsa: ${data.bolsa}\nMarca/Modelo: ${data.marca} ${data.modelo}\nServicio: ${data.servicio}\n\nUbicación: Terminal 33.`;
            const encodedMsg = encodeURIComponent(message);
            window.open(`https://wa.me/${CONTACT_WHATSAPP}?text=${encodedMsg}`, '_blank');
        };
    };

    if (closeModal) {
        closeModal.onclick = () => {
            successModal.classList.add('hidden');
            orderForm.reset();
        };
    }

    // PWA Logic
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        if (installToast) installToast.classList.remove('hidden');
        if (navInstallBtn) navInstallBtn.classList.remove('hidden');
    });

    const handleInstall = async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            console.log(`User response to install prompt: ${outcome}`);
            deferredPrompt = null;
            if (installToast) installToast.classList.add('hidden');
            if (navInstallBtn) navInstallBtn.classList.add('hidden');
        }
    };

    if (toastInstall) toastInstall.onclick = handleInstall;
    if (navInstallBtn) navInstallBtn.onclick = handleInstall;
    if (toastDismiss) toastDismiss.onclick = () => installToast.classList.add('hidden');

    // WhatsApp Assistant Logic
    if (waTrigger) {
        waTrigger.onclick = () => {
            const message = "Hola Shoe Cleaning Lab, necesito ayuda con mi registro.";
            window.open(`https://wa.me/${CONTACT_WHATSAPP}?text=${encodeURIComponent(message)}`, '_blank');
        };
    }
});
