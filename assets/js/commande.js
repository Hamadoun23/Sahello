/* =========================================================
   SA'HELLO — Assistant de commande en 4 étapes
   ---------------------------------------------------------
   À COMPLÉTER PAR SA'HELLO :
   - prix : en FCFA par unité ; null = « Prix à confirmer »
   - img  : chemin de la photo ; null = tuile avec l'initiale
   - LIVRAISON / PAIEMENT : options provisoires à remplacer
   ========================================================= */
(function () {
  'use strict';

  var WHATSAPP = '22372707914';

  var PRODUITS = [
    { id: 'tomate',       cat: 'Maraîchage',     nom: 'Tomate',             unite: 'kg',            prix: null, img: 'assetsahello/commande/tomate.webp' },
    { id: 'gombo',        cat: 'Maraîchage',     nom: 'Gombo',              unite: 'kg',            prix: null, img: 'assetsahello/commande/gombo.webp' },
    { id: 'oignons',      cat: 'Maraîchage',     nom: 'Oignons frais',      unite: 'kg',            prix: null, img: 'assetsahello/commande/oignons.webp' },
    { id: 'aubergines',   cat: 'Maraîchage',     nom: 'Aubergines',         unite: 'kg',            prix: null, img: 'assetsahello/commande/aubergines.webp' },
    { id: 'piment',       cat: 'Maraîchage',     nom: 'Piment',             unite: 'kg',            prix: null, img: 'assetsahello/commande/piment.webp' },
    { id: 'tilapia',      cat: 'Pisciculture',   nom: 'Tilapia frais',      unite: 'kg',            prix: null, img: 'assetsahello/commande/tilapia.webp' },
    { id: 'poisson-chat', cat: 'Pisciculture',   nom: 'Poisson-chat frais', unite: 'kg',            prix: null, img: 'assetsahello/commande/poisson-chat.webp' },
    { id: 'poisson-fume', cat: 'Pisciculture',   nom: 'Poisson fumé',       unite: 'kg',            prix: null, img: 'assetsahello/commande/poisson-fume.webp' },
    { id: 'poulet-frais', cat: 'Aviculture',     nom: 'Poulet frais',       unite: 'pièce',         prix: null, img: 'assetsahello/commande/poulet-frais.webp' },
    { id: 'poulet-fume',  cat: 'Aviculture',     nom: 'Poulet fumé',        unite: 'pièce',         prix: null, img: 'assetsahello/commande/poulet-fume.webp' },
    { id: 'oeufs',        cat: 'Aviculture',     nom: 'Œufs',               unite: 'plateau de 30', prix: null, img: 'assetsahello/commande/oeufs.webp' },
    { id: 'miel',         cat: 'Transformation', nom: 'Miel',               unite: 'pot',           prix: null, img: null },
    { id: 'karite',       cat: 'Transformation', nom: 'Beurre de karité',   unite: 'pot',           prix: null, img: 'assetsahello/commande/karite.webp' }
  ];

  var LIVRAISON = [
    { id: 'domicile', titre: 'Livraison à domicile', desc: 'Bamako & Kati — frais et délais à préciser', adresse: true,  icon: 'truck' },
    { id: 'retrait',  titre: 'Retrait sur place',    desc: 'À la ferme de Dio Ba ou point de retrait',  adresse: false, icon: 'store' }
  ];

  var PAIEMENT = [
    { id: 'especes', titre: 'Espèces',      desc: 'À la livraison ou au retrait', icon: 'cash' },
    { id: 'orange',  titre: 'Orange Money', desc: 'Paiement mobile',              icon: 'phone' },
    { id: 'moov',    titre: 'Moov Money',   desc: 'Paiement mobile',              icon: 'phone' }
  ];

  var LIVRAISON_PROVISOIRE = true;  // passer à false quand les modes seront validés
  var PAIEMENT_PROVISOIRE  = true;
  /* ======================================================= */

  var ICONS = {
    truck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 3h15v13H1z"/><path d="M16 8h4l3 3v5h-7z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>',
    store: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l1.5-5h15L21 9"/><path d="M3 9h18v2a3 3 0 0 1-6 0 3 3 0 0 1-6 0 3 3 0 0 1-6 0z"/><path d="M5 13v8h14v-8"/><path d="M10 21v-5h4v5"/></svg>',
    cash:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/><path d="M6 12h.01M18 12h.01"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="2" width="12" height="20" rx="2.5"/><path d="M11 18h2"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5L20 7"/></svg>'
  };

  var root = document.getElementById('commander');
  if (!root) return;
  var $ = function (s) { return root.querySelector(s); };
  var $$ = function (s) { return Array.prototype.slice.call(root.querySelectorAll(s)); };

  var STORE_KEY = 'sahello-commande';
  var state = { step: 1, cart: {}, filtre: 'Tous', livraison: LIVRAISON[0].id, paiement: PAIEMENT[0].id, nom: '', tel: '', adresse: '', remarque: '' };
  try { var saved = JSON.parse(localStorage.getItem(STORE_KEY) || 'null'); if (saved) { state.cart = saved.cart || {}; ['nom', 'tel', 'adresse', 'remarque', 'livraison', 'paiement'].forEach(function (k) { if (saved[k]) state[k] = saved[k]; }); } } catch (e) {}
  function save() { try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) {} }

  function esc(s) { var d = document.createElement('div'); d.textContent = s == null ? '' : String(s); return d.innerHTML; }
  function fcfa(n) { return n.toLocaleString('fr-FR').replace(/ | /g, ' ') + ' FCFA'; }
  function byId(list, id) { for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i]; return null; }

  function lignes() {
    return PRODUITS.filter(function (p) { return state.cart[p.id] > 0; }).map(function (p) {
      var q = state.cart[p.id];
      return { p: p, q: q, montant: p.prix != null ? p.prix * q : null };
    });
  }
  function totaux() {
    var L = lignes(), total = 0, inconnu = false, nb = 0;
    L.forEach(function (l) { nb += l.q; if (l.montant == null) inconnu = true; else total += l.montant; });
    return { lignes: L, total: total, inconnu: inconnu, nb: nb, refs: L.length };
  }
  function totalTxt(t) { return (t.inconnu && t.total === 0) ? 'Prix à confirmer' : fcfa(t.total) + (t.inconnu ? ' + à confirmer' : ''); }

  /* ---------- Étape 1 : produits ---------- */
  var cats = ['Tous'];
  PRODUITS.forEach(function (p) { if (cats.indexOf(p.cat) < 0) cats.push(p.cat); });
  $('#shc-filters').innerHTML = cats.map(function (c) {
    return '<button type="button" class="shc-filter" data-cat="' + esc(c) + '">' + esc(c) + '</button>';
  }).join('');

  function carteProduit(p) {
    var q = state.cart[p.id] || 0;
    var img = p.img ? '<img src="' + esc(p.img) + '" alt="' + esc(p.nom) + '" loading="lazy">' : '<div class="shc-ph">' + esc(p.nom.charAt(0)) + '</div>';
    var prix = p.prix != null ? fcfa(p.prix) + ' / ' + p.unite : 'Prix à confirmer · ' + p.unite;
    var action = q > 0
      ? '<div class="shc-stepper"><button type="button" data-act="moins" aria-label="Retirer">−</button><span>' + q + ' ' + esc(p.unite.split(' ')[0]) + '</span><button type="button" data-act="plus" aria-label="Ajouter">+</button></div>'
      : '<button type="button" class="shc-add" data-act="plus">Ajouter</button>';
    return '<article class="shc-prod' + (q > 0 ? ' is-in' : '') + '" data-id="' + p.id + '">' +
      '<div class="shc-prod-img">' + img + (q > 0 ? '<span class="shc-prod-badge">× ' + q + '</span>' : '') + '</div>' +
      '<div class="shc-prod-info"><div><p class="shc-prod-name">' + esc(p.nom) + '</p><p class="shc-prod-price' + (p.prix == null ? ' tbd' : '') + '">' + esc(prix) + '</p></div>' +
      '<div class="shc-prod-action">' + action + '</div></div></article>';
  }
  function renderProduits() {
    $$('.shc-filter').forEach(function (b) { b.classList.toggle('is-active', b.getAttribute('data-cat') === state.filtre); });
    var liste = PRODUITS.filter(function (p) { return state.filtre === 'Tous' || p.cat === state.filtre; });
    $('#shc-grid').innerHTML = liste.map(carteProduit).join('');
  }
  $('#shc-filters').addEventListener('click', function (e) {
    var b = e.target.closest('.shc-filter'); if (!b) return;
    state.filtre = b.getAttribute('data-cat'); renderProduits();
  });
  $('#shc-grid').addEventListener('click', function (e) {
    var b = e.target.closest('[data-act]'); if (!b) return;
    var id = b.closest('.shc-prod').getAttribute('data-id');
    var q = state.cart[id] || 0;
    q = b.getAttribute('data-act') === 'plus' ? Math.min(999, q + 1) : Math.max(0, q - 1);
    if (q) state.cart[id] = q; else delete state.cart[id];
    save(); renderProduits(); renderFoot(true); hint('');
  });

  /* ---------- Étapes 2 & 3 : options ---------- */
  function renderOptions(boxId, name, list, current) {
    $(boxId).innerHTML = list.map(function (o) {
      return '<label class="shc-option"><input type="radio" name="' + name + '" value="' + o.id + '"' + (o.id === current ? ' checked' : '') + '>' +
        '<span class="shc-option-icon">' + (ICONS[o.icon] || '') + '</span>' +
        '<span><span class="shc-option-title">' + esc(o.titre) + '</span><span class="shc-option-desc">' + esc(o.desc) + '</span></span>' +
        '<span class="shc-option-check"></span></label>';
    }).join('');
  }
  renderOptions('#shc-livraison', 'shc-livraison', LIVRAISON, state.livraison);
  renderOptions('#shc-paiement', 'shc-paiement', PAIEMENT, state.paiement);
  $('#shc-tbd-livraison').hidden = !LIVRAISON_PROVISOIRE;
  $('#shc-tbd-paiement').hidden = !PAIEMENT_PROVISOIRE;

  function majAdresse() {
    var l = byId(LIVRAISON, state.livraison);
    $('#shc-f-adresse').hidden = !(l && l.adresse);
  }
  root.addEventListener('change', function (e) {
    if (e.target.name === 'shc-livraison') { state.livraison = e.target.value; majAdresse(); save(); }
    if (e.target.name === 'shc-paiement') { state.paiement = e.target.value; save(); }
  });
  ['nom', 'tel', 'adresse', 'remarque'].forEach(function (k) {
    var el = $('#shc-' + k);
    el.value = state[k] || '';
    el.addEventListener('input', function () { state[k] = el.value; el.closest('.shc-field').classList.remove('is-error'); save(); });
  });
  majAdresse();

  /* ---------- Étape 4 : récapitulatif ---------- */
  function renderRecap() {
    var t = totaux();
    $('#shc-recap-lignes').innerHTML = t.lignes.map(function (l) {
      return '<li><span>' + esc(l.p.nom) + ' <span class="muted">× ' + l.q + ' ' + esc(l.p.unite) + '</span></span><span>' + (l.montant != null ? fcfa(l.montant) : '<span class="muted">à confirmer</span>') + '</span></li>';
    }).join('');
    $('#shc-recap-total').textContent = totalTxt(t);
    $('#shc-recap-note').hidden = !t.inconnu;
    var liv = byId(LIVRAISON, state.livraison), pay = byId(PAIEMENT, state.paiement);
    var infos = [
      ['Nom', state.nom], ['Téléphone', state.tel],
      ['Livraison', liv ? liv.titre : '-'],
    ];
    if (liv && liv.adresse) infos.push(['Adresse', state.adresse]);
    infos.push(['Paiement', pay ? pay.titre : '-']);
    if (state.remarque.trim()) infos.push(['Remarque', state.remarque.trim()]);
    $('#shc-recap-infos').innerHTML = infos.map(function (i) { return '<div><dt>' + esc(i[0]) + '</dt><dd>' + esc(i[1]) + '</dd></div>'; }).join('');
  }

  /* ---------- Navigation ---------- */
  var LABELS_SUIVANT = { 1: 'Continuer', 2: 'Continuer', 3: 'Voir le récapitulatif', 4: 'Envoyer sur WhatsApp' };

  function renderFoot(bump) {
    var t = totaux();
    var c = $('#shc-cart-count');
    c.textContent = t.nb;
    if (bump) { c.classList.remove('bump'); void c.offsetWidth; c.classList.add('bump'); setTimeout(function () { c.classList.remove('bump'); }, 200); }
    $('#shc-cart-text').innerHTML = t.refs
      ? '<strong>' + t.refs + ' produit' + (t.refs > 1 ? 's' : '') + '</strong>' + esc(totalTxt(t))
      : '<strong>Panier vide</strong>Ajoutez vos produits';
    var next = $('#shc-next');
    next.querySelector('.shc-btn-txt').textContent = LABELS_SUIVANT[state.step];
    next.classList.toggle('shc-btn-wa', state.step === 4);
    $('#shc-prev').hidden = state.step === 1;
  }

  function hint(msg) { $('#shc-hint').textContent = msg; }

  function erreur(champ, ok) { $('#shc-' + champ).closest('.shc-field').classList.toggle('is-error', !ok); return ok; }

  function valider(step) {
    if (step === 1 && !totaux().refs) { hint('Ajoutez au moins un produit pour continuer.'); return false; }
    if (step === 2) {
      var ok = true;
      ok = erreur('nom', state.nom.trim().length >= 2) && ok;
      ok = erreur('tel', state.tel.replace(/\D/g, '').length >= 8) && ok;
      var l = byId(LIVRAISON, state.livraison);
      if (l && l.adresse) ok = erreur('adresse', state.adresse.trim().length >= 3) && ok;
      if (!ok) { hint('Vérifiez les champs en rouge.'); var f = root.querySelector('.shc-field.is-error input'); if (f) f.focus(); }
      return ok;
    }
    return true;
  }

  function scrollTop() {
    var card = $('.shc-card');
    var smoother = window.ScrollSmoother && window.ScrollSmoother.get && window.ScrollSmoother.get();
    var top = card.getBoundingClientRect().top;
    if (top > 0 && top < window.innerHeight * 0.3) return;
    if (smoother) smoother.scrollTo(card, true, 'top 90px');
    else window.scrollTo({ top: window.scrollY + top - 90, behavior: 'smooth' });
  }

  function goto(step) {
    state.step = step;
    hint('');
    $$('.shc-panel').forEach(function (p) { p.classList.toggle('is-active', +p.getAttribute('data-step') === step); });
    $$('.shc-step').forEach(function (s) {
      var n = +s.getAttribute('data-step');
      s.classList.toggle('is-active', n === step);
      s.classList.toggle('is-done', n < step);
      s.querySelector('.shc-step-dot').innerHTML = n < step ? ICONS.check.replace('<svg', '<svg width="14" height="14"') : n;
    });
    if (step === 1) renderProduits();
    if (step === 4) renderRecap();
    $('#shc-foot').hidden = false;
    renderFoot();
    scrollTop();
  }

  function envoyer() {
    var t = totaux();
    var liv = byId(LIVRAISON, state.livraison), pay = byId(PAIEMENT, state.paiement);
    var msg = ['Bonjour SA\'HELLO, je souhaite passer commande :', ''];
    t.lignes.forEach(function (l) {
      msg.push('• ' + l.p.nom + ' : ' + l.q + ' ' + l.p.unite + (l.montant != null ? ' (' + fcfa(l.montant) + ')' : ''));
    });
    msg.push('', 'Total estimé : ' + totalTxt(t), '');
    msg.push('Nom : ' + state.nom.trim());
    msg.push('Téléphone : ' + state.tel.trim());
    msg.push('Livraison : ' + (liv ? liv.titre : '-') + (liv && liv.adresse ? ' — ' + state.adresse.trim() : ''));
    msg.push('Paiement : ' + (pay ? pay.titre : '-'));
    if (state.remarque.trim()) msg.push('Remarque : ' + state.remarque.trim());
    window.open('https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(msg.join('\n')), '_blank', 'noopener');

    $$('.shc-panel').forEach(function (p) { p.classList.remove('is-active'); });
    $('#shc-done').classList.add('is-active');
    $('#shc-foot').hidden = true;
    $$('.shc-step').forEach(function (s) { s.classList.remove('is-active'); s.classList.add('is-done'); s.querySelector('.shc-step-dot').innerHTML = ICONS.check.replace('<svg', '<svg width="14" height="14"'); });
  }

  $('#shc-next').addEventListener('click', function () {
    if (!valider(state.step)) return;
    if (state.step < 4) goto(state.step + 1); else envoyer();
  });
  $('#shc-prev').addEventListener('click', function () { if (state.step > 1) goto(state.step - 1); });
  root.addEventListener('click', function (e) {
    var b = e.target.closest('[data-goto]'); if (b) goto(+b.getAttribute('data-goto'));
  });
  $('#shc-restart').addEventListener('click', function () {
    state.cart = {}; state.remarque = ''; $('#shc-remarque').value = ''; save();
    $('#shc-done').classList.remove('is-active');
    goto(1);
  });

  goto(1);
  // pas de défilement automatique au premier affichage
})();
