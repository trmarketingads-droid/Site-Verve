/*
 * LGPD — consentimento de cookies e carregamento de analytics.
 *
 * O Google Tag Manager, o Google Analytics 4 e o Microsoft Clarity só são
 * carregados depois que a pessoa aceita o uso de cookies no banner. Enquanto
 * não houver uma decisão salva, nenhuma dessas ferramentas é carregada —
 * isso é o que garante que a Política de Privacidade do site diga a verdade.
 *
 * CONFIGURAÇÃO:
 * 1) Google Tag Manager: container GTM-P6P5BT8S.
 * 2) Google Analytics 4: Measurement ID G-K80TM2PR28.
 * 3) Quando tiver o código do Microsoft Clarity, cole-o dentro de loadClarity(),
 *    no lugar indicado.
 */
(function () {
  var GTM_CONTAINER_ID = 'GTM-P6P5BT8S';
  var GA4_MEASUREMENT_ID = 'G-K80TM2PR28';
  var CONSENT_KEY = 'verve_consent';

  function loadGTM() {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtm.js?id=' + GTM_CONTAINER_ID;
    document.head.appendChild(script);
  }

  function loadGA4() {
    if (GA4_MEASUREMENT_ID.indexOf('XXXX') !== -1) return; // ainda não configurado

    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;

    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA4_MEASUREMENT_ID;
    document.head.appendChild(script);

    gtag('js', new Date());
    gtag('config', GA4_MEASUREMENT_ID);
  }

  function loadClarity() {
    // TODO: cole aqui o script de instalação fornecido pelo Microsoft Clarity.
    // Exemplo do formato oficial:
    //
    // (function(c,l,a,r,i,t,y){
    //     c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
    //     t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
    //     y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    // })(window, document, "clarity", "script", "SEU_ID_AQUI");
  }

  function loadAnalytics() {
    if (window.__verveAnalyticsLoaded) return;
    window.__verveAnalyticsLoaded = true;
    loadGTM();
    loadGA4();
    loadClarity();
  }

  function showBar() {
    var bar = document.getElementById('cookieBar');
    if (bar) bar.classList.add('show');
  }

  function hideBar() {
    var bar = document.getElementById('cookieBar');
    if (bar) bar.classList.remove('show');
  }

  window.verveAceitarCookies = function () {
    localStorage.setItem(CONSENT_KEY, 'accepted');
    hideBar();
    loadAnalytics();
  };

  window.verveRecusarCookies = function () {
    localStorage.setItem(CONSENT_KEY, 'rejected');
    hideBar();
  };

  var consent = localStorage.getItem(CONSENT_KEY);
  if (consent === 'accepted') {
    loadAnalytics();
  } else if (!consent) {
    document.addEventListener('DOMContentLoaded', showBar);
  }
})();
