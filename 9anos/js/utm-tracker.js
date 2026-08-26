/**
 * Sistema de rastreamento de UTMs
 * Salva parâmetros UTM no localStorage na primeira visita
 */

(function() {
    'use strict';
    
    // Captura parâmetros da URL
    const urlParams = new URLSearchParams(window.location.search);
    
    // Lista de parâmetros UTM para rastrear
    const utmParams = [
        'utm_source',
        'utm_medium', 
        'utm_campaign',
        'utm_content',
        'utm_term',
        'src',
        'sck',
        'fbclid'
    ];
    
    // Objeto para armazenar UTMs
    const utmData = {};
    let hasUtm = false;
    
    // Captura cada parâmetro UTM da URL
    utmParams.forEach(function(param) {
        const value = urlParams.get(param);
        if (value) {
            utmData[param] = value;
            hasUtm = true;
        }
    });
    
    // Se tem UTMs novos, salva no localStorage
    if (hasUtm) {
        utmData.captured_at = new Date().toISOString();
        utmData.landing_page = window.location.href;
        localStorage.setItem('ff_utm_data', JSON.stringify(utmData));
        console.log('[UTM Tracker] UTMs salvos:', utmData);
    } else {
        // Se não tem UTMs na URL, verifica se já tem salvo
        const savedUtm = localStorage.getItem('ff_utm_data');
        if (savedUtm) {
            console.log('[UTM Tracker] UTMs recuperados do localStorage:', JSON.parse(savedUtm));
        }
    }
    
    // Captura e salva cookies do Facebook
    function captureFbCookies() {
        const cookies = document.cookie.split(';');
        let fbc = '', fbp = '';
        
        cookies.forEach(function(c) {
            c = c.trim();
            if (c.startsWith('_fbc=')) fbc = c.substring(5);
            if (c.startsWith('_fbp=')) fbp = c.substring(5);
        });
        
        if (fbc || fbp) {
            const fbData = {
                fbc: fbc,
                fbp: fbp,
                captured_at: new Date().toISOString()
            };
            localStorage.setItem('ff_fb_cookies', JSON.stringify(fbData));
            console.log('[UTM Tracker] Facebook cookies salvos:', fbData);
        }
    }
    
    // Captura cookies do Facebook após um pequeno delay (para dar tempo do pixel setar)
    setTimeout(captureFbCookies, 2000);
    
    // Função global para obter UTMs salvos
    window.getStoredUtms = function() {
        const utmStr = localStorage.getItem('ff_utm_data');
        const fbStr = localStorage.getItem('ff_fb_cookies');
        
        const result = {
            utm_source: null,
            utm_medium: null,
            utm_campaign: null,
            utm_content: null,
            utm_term: null,
            src: null,
            sck: null,
            fbclid: null,
            fbc: null,
            fbp: null
        };
        
        if (utmStr) {
            const utmParsed = JSON.parse(utmStr);
            Object.assign(result, utmParsed);
        }
        
        if (fbStr) {
            const fbParsed = JSON.parse(fbStr);
            result.fbc = fbParsed.fbc || null;
            result.fbp = fbParsed.fbp || null;
        }
        
        return result;
    };
    
    console.log('[UTM Tracker] Inicializado');
})();
