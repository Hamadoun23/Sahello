/* SA'HELLO — panier visible sur tout le site.
   Lit le panier enregistré par la boutique (commande.js) et met à jour :
   - le compteur du bouton panier dans l'en-tête (.sh-hcart-n) ;
   - une pastille flottante « Voir mon panier » (hors page Commander). */
(function () {
  'use strict';
  var KEY = 'sahello-boutique';
  var surCommander = !!document.getElementById('sha');

  function nbArticles() {
    try {
      var sv = JSON.parse(localStorage.getItem(KEY) || 'null');
      var c = (sv && sv.cart) || {}, n = 0;
      Object.keys(c).forEach(function (k) { var q = +c[k]; if (q > 0) n += q; });
      return n;
    } catch (e) { return 0; }
  }

  var flot = null;
  if (!surCommander) {
    flot = document.createElement('a');
    flot.className = 'sh-flot';
    flot.href = 'commander.html#panier';
    flot.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M2.5 3.5h2.6l2.4 11.2a1.6 1.6 0 0 0 1.6 1.3h8.4a1.6 1.6 0 0 0 1.6-1.2l1.6-6.8H6.2"/></svg>' +
      '<span class="sh-flot-txt">Voir mon panier</span><b class="sh-flot-n">0</b>';
    document.body.appendChild(flot);
  }

  function maj() {
    var n = nbArticles();
    Array.prototype.forEach.call(document.querySelectorAll('.sh-hcart-n'), function (b) {
      b.textContent = n > 99 ? '99+' : n; b.hidden = !n;
    });
    Array.prototype.forEach.call(document.querySelectorAll('.sh-hcart'), function (a) {
      a.setAttribute('aria-label', n ? 'Panier, ' + n + ' article' + (n > 1 ? 's' : '') : 'Panier vide');
    });
    if (flot) {
      flot.querySelector('.sh-flot-n').textContent = n > 99 ? '99+' : n;
      flot.classList.toggle('on', n > 0);
    }
  }

  document.addEventListener('sahello:panier', maj);
  window.addEventListener('storage', function (e) { if (e.key === KEY) maj(); });
  window.addEventListener('pageshow', maj);
  maj();
})();
