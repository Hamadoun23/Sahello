/* =========================================================
   SA'HELLO — Commande : liste compacte + panneau de validation
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
    { id: 'tilapia',      cat: 'Poisson',        nom: 'Tilapia frais',      unite: 'kg',            prix: null, img: 'assetsahello/commande/tilapia.webp' },
    { id: 'poisson-chat', cat: 'Poisson',        nom: 'Poisson-chat frais', unite: 'kg',            prix: null, img: 'assetsahello/commande/poisson-chat.webp' },
    { id: 'poisson-fume', cat: 'Poisson',        nom: 'Poisson fumé',       unite: 'kg',            prix: null, img: 'assetsahello/commande/poisson-fume.webp' },
    { id: 'poulet-frais', cat: 'Volaille & œufs', nom: 'Poulet frais',      unite: 'pièce',         prix: null, img: 'assetsahello/commande/poulet-frais.webp' },
    { id: 'poulet-fume',  cat: 'Volaille & œufs', nom: 'Poulet fumé',       unite: 'pièce',         prix: null, img: 'assetsahello/commande/poulet-fume.webp' },
    { id: 'oeufs',        cat: 'Volaille & œufs', nom: 'Œufs',              unite: 'plateau de 30', prix: null, img: 'assetsahello/commande/oeufs.webp' },
    { id: 'miel',         cat: 'Transformés',    nom: 'Miel',               unite: 'pot',           prix: null, img: null },
    { id: 'karite',       cat: 'Transformés',    nom: 'Beurre de karité',   unite: 'pot',           prix: null, img: 'assetsahello/commande/karite.webp' }
  ];

  var LIVRAISON = [
    { id: 'domicile', titre: 'Livraison',  desc: 'Bamako & Kati',  adresse: true },
    { id: 'retrait',  titre: 'Retrait',    desc: 'À la ferme',     adresse: false }
  ];
  var PAIEMENT = [
    { id: 'especes', titre: 'Espèces' },
    { id: 'orange',  titre: 'Orange Money' },
    { id: 'moov',    titre: 'Moov Money' }
  ];
  var MODALITES_PROVISOIRES = true; // false quand livraison/paiement seront validés
  /* ======================================================= */

  var I = {
    plus:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
    minus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M5 12h14"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    back:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5L20 7"/></svg>',
    wa:    '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 2.9 2.9 0 0 0-.9 2.2 5 5 0 0 0 1.1 2.7 11.4 11.4 0 0 0 4.4 3.9c1.6.7 2.3.8 3.1.6a2.6 2.6 0 0 0 1.7-1.2 2.1 2.1 0 0 0 .2-1.2c-.1-.1-.3-.2-.5-.3z"/></svg>'
  };

  var root = document.getElementById('commander');
  if (!root) return;

  /* ---------- État ---------- */
  var KEY = 'sahello-commande-v2';
  var st = { cart: {}, cat: 'Tout', step: 1, livraison: LIVRAISON[0].id, paiement: PAIEMENT[0].id, nom: '', tel: '', adresse: '', remarque: '' };
  try { var sv = JSON.parse(localStorage.getItem(KEY) || 'null'); if (sv) ['cart', 'livraison', 'paiement', 'nom', 'tel', 'adresse'].forEach(function (k) { if (sv[k] != null) st[k] = sv[k]; }); } catch (e) {}
  function save() { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {} }

  function esc(s) { var d = document.createElement('div'); d.textContent = s == null ? '' : String(s); return d.innerHTML; }
  function fcfa(n) { return n.toLocaleString('fr-FR').replace(/ | /g, ' ') + ' FCFA'; }
  function find(list, id) { for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i]; return null; }
  function court(u) { return u.split(' ')[0]; }

  function calc() {
    var L = PRODUITS.filter(function (p) { return st.cart[p.id] > 0; }).map(function (p) {
      var q = st.cart[p.id]; return { p: p, q: q, m: p.prix != null ? p.prix * q : null };
    });
    var t = 0, inc = false, n = 0;
    L.forEach(function (l) { n += l.q; if (l.m == null) inc = true; else t += l.m; });
    return { L: L, total: t, inc: inc, n: n, refs: L.length, txt: (inc && t === 0) ? 'Prix à confirmer' : fcfa(t) + (inc ? ' + à confirmer' : '') };
  }
  function setQty(id, q) { q = Math.max(0, Math.min(99, q)); if (q) st.cart[id] = q; else delete st.cart[id]; save(); renderList(); renderBar(); if (isOpen()) renderDrawer(); }

  function thumb(p) { return '<div class="shc-thumb">' + (p.img ? '<img src="' + esc(p.img) + '" alt="" loading="lazy">' : esc(p.nom.charAt(0))) + '</div>'; }
  function control(p) {
    var q = st.cart[p.id] || 0;
    if (!q) return '<button type="button" class="shc-plus" data-q="+1" aria-label="Ajouter ' + esc(p.nom) + '">' + I.plus + '</button>';
    return '<div class="shc-qty"><button type="button" data-q="-1" aria-label="Retirer">' + I.minus + '</button><span>' + q + '</span><button type="button" data-q="+1" aria-label="Ajouter">' + I.plus + '</button></div>';
  }
  function prixTxt(p) { return p.prix != null ? '<b>' + fcfa(p.prix) + '</b> / ' + esc(p.unite) : 'Par ' + esc(p.unite) + ' · prix à confirmer'; }

  /* ---------- Section : onglets + liste + barre ---------- */
  var cats = ['Tout'];
  PRODUITS.forEach(function (p) { if (cats.indexOf(p.cat) < 0) cats.push(p.cat); });
  var tabs = root.querySelector('.shc-tabs'), list = root.querySelector('.shc-list'), bar = root.querySelector('.shc-bar');
  tabs.innerHTML = cats.map(function (c) { return '<button type="button" class="shc-tab" role="tab" data-cat="' + esc(c) + '">' + esc(c) + '</button>'; }).join('');

  function renderList() {
    Array.prototype.forEach.call(tabs.children, function (b) { var on = b.getAttribute('data-cat') === st.cat; b.classList.toggle('is-active', on); b.setAttribute('aria-selected', on); });
    list.innerHTML = PRODUITS.filter(function (p) { return st.cat === 'Tout' || p.cat === st.cat; }).map(function (p) {
      return '<div class="shc-item' + (st.cart[p.id] ? ' is-in' : '') + '" data-id="' + p.id + '">' + thumb(p) +
        '<div class="shc-meta"><p class="shc-name">' + esc(p.nom) + '</p><p class="shc-price">' + prixTxt(p) + '</p></div>' + control(p) + '</div>';
    }).join('');
  }
  function renderBar() {
    var c = calc();
    bar.classList.toggle('is-empty', !c.refs);
    bar.innerHTML = c.refs
      ? '<div class="shc-bar-info"><strong>' + c.n + ' article' + (c.n > 1 ? 's' : '') + '</strong> · ' + c.refs + ' produit' + (c.refs > 1 ? 's' : '') + '<small>' + esc(c.txt) + '</small></div>' +
        '<button type="button" class="shc-cta" data-open>Voir ma commande ' + I.arrow + '</button>'
      : '<div class="shc-bar-info">Appuyez sur <strong>+</strong> pour ajouter des produits à votre commande.</div>';
  }
  tabs.addEventListener('click', function (e) { var b = e.target.closest('.shc-tab'); if (b) { st.cat = b.getAttribute('data-cat'); renderList(); } });
  root.addEventListener('click', function (e) {
    var b = e.target.closest('[data-q]');
    if (b && list.contains(b)) { var id = b.closest('.shc-item').getAttribute('data-id'); setQty(id, (st.cart[id] || 0) + (+b.getAttribute('data-q'))); return; }
    if (e.target.closest('[data-open]')) open();
  });

  /* ---------- Panneau (ajouté à <body> pour échapper au défilement fluide) ---------- */
  var d = document.createElement('div');
  d.className = 'shd'; d.setAttribute('role', 'dialog'); d.setAttribute('aria-modal', 'true'); d.setAttribute('aria-labelledby', 'shd-title');
  d.innerHTML =
    '<div class="shd-overlay" data-close></div>' +
    '<div class="shd-panel">' +
      '<div class="shd-top"><div class="shd-row">' +
        '<button type="button" class="shd-back" aria-label="Retour">' + I.back + '</button>' +
        '<h3 class="shd-title" id="shd-title"></h3>' +
        '<button type="button" class="shd-close" data-close aria-label="Fermer">' + I.close + '</button>' +
      '</div><div class="shd-progress"><i></i><i></i><i></i></div></div>' +
      '<div class="shd-body">' +
        '<div class="shd-step" data-s="1"><ul class="shd-lines"></ul><button type="button" class="shd-add-more" data-close>' + I.plus.replace('<svg', '<svg width="16" height="16"') + ' Ajouter d\'autres produits</button></div>' +
        '<div class="shd-step" data-s="2">' +
          '<div class="shd-group"><span class="shd-label">Mode de réception</span><div class="shd-seg" data-name="livraison"></div></div>' +
          '<div class="shd-field"><label class="shd-label" for="shd-nom">Nom complet</label><input class="shd-input" id="shd-nom" data-k="nom" autocomplete="name" placeholder="Ex. Aminata Traoré"><div class="shd-err">Indiquez votre nom.</div></div>' +
          '<div class="shd-field"><label class="shd-label" for="shd-tel">Téléphone / WhatsApp</label><input class="shd-input" id="shd-tel" data-k="tel" type="tel" inputmode="tel" autocomplete="tel" placeholder="+223 …"><div class="shd-err">Numéro invalide (8 chiffres minimum).</div></div>' +
          '<div class="shd-field" data-adresse><label class="shd-label" for="shd-adresse">Adresse de livraison</label><input class="shd-input" id="shd-adresse" data-k="adresse" autocomplete="street-address" placeholder="Quartier, rue, repère"><div class="shd-err">Indiquez l\'adresse de livraison.</div></div>' +
          '<div class="shd-group"><span class="shd-label">Paiement</span><div class="shd-seg cols-3" data-name="paiement"></div></div>' +
          '<div class="shd-field"><label class="shd-label" for="shd-remarque">Remarque <span class="shd-opt">(facultatif)</span></label><textarea class="shd-input" id="shd-remarque" data-k="remarque" placeholder="Horaire souhaité, précisions…"></textarea></div>' +
          (MODALITES_PROVISOIRES ? '<p class="shd-note">Les frais, délais de livraison et moyens de paiement vous seront confirmés par message.</p>' : '') +
        '</div>' +
        '<div class="shd-step" data-s="3"><div class="shd-sum" data-sum-produits></div><div class="shd-sum" data-sum-infos></div><p class="shd-note">Votre commande s\'ouvrira dans WhatsApp : il vous suffira d\'appuyer sur « Envoyer ».</p></div>' +
        '<div class="shd-step" data-s="4"><div class="shd-done"><div class="shd-done-ic">' + I.check + '</div><h3>Merci&nbsp;!</h3><p>WhatsApp s\'est ouvert avec votre commande. Nous vous confirmons rapidement la disponibilité et le montant.</p></div></div>' +
      '</div>' +
      '<div class="shd-foot"><div class="shd-total"><span>Total estimé</span><strong></strong></div><button type="button" class="shd-next"></button></div>' +
    '</div>';
  document.body.appendChild(d);
  var q = function (s) { return d.querySelector(s); };

  function seg(name, opts, cur) {
    q('[data-name="' + name + '"]').innerHTML = opts.map(function (o) {
      return '<label><input type="radio" name="shd-' + name + '" value="' + o.id + '"' + (o.id === cur ? ' checked' : '') + '><span>' + esc(o.titre) + (o.desc ? '<small>' + esc(o.desc) + '</small>' : '') + '</span></label>';
    }).join('');
  }
  seg('livraison', LIVRAISON, st.livraison);
  seg('paiement', PAIEMENT, st.paiement);
  Array.prototype.forEach.call(d.querySelectorAll('[data-k]'), function (el) {
    el.value = st[el.getAttribute('data-k')] || '';
    el.addEventListener('input', function () { st[el.getAttribute('data-k')] = el.value; el.closest('.shd-field').classList.remove('is-error'); save(); });
  });
  function majAdresse() { var l = find(LIVRAISON, st.livraison); q('[data-adresse]').hidden = !(l && l.adresse); }
  d.addEventListener('change', function (e) {
    if (e.target.name === 'shd-livraison') { st.livraison = e.target.value; majAdresse(); save(); }
    if (e.target.name === 'shd-paiement') { st.paiement = e.target.value; save(); }
  });
  majAdresse();

  var TITRES = { 1: 'Ma commande', 2: 'Vos coordonnées', 3: 'Vérification', 4: 'Commande envoyée' };
  var BOUTONS = { 1: 'Continuer', 2: 'Vérifier ma commande', 3: 'Envoyer sur WhatsApp', 4: 'Fermer' };

  function renderDrawer() {
    var c = calc(), s = st.step;
    q('.shd-title').textContent = TITRES[s];
    q('.shd-back').hidden = s === 1 || s === 4;
    Array.prototype.forEach.call(d.querySelectorAll('.shd-progress i'), function (i, k) { i.classList.toggle('on', k < Math.min(s, 3)); });
    Array.prototype.forEach.call(d.querySelectorAll('.shd-step'), function (el) { el.classList.toggle('is-active', +el.getAttribute('data-s') === s); });

    if (s === 1) {
      q('.shd-lines').innerHTML = c.refs ? c.L.map(function (l) {
        return '<li class="shd-line" data-id="' + l.p.id + '">' + thumb(l.p) + '<div class="shc-meta"><p class="shc-name">' + esc(l.p.nom) + '</p><p class="shc-price">' + (l.m != null ? fcfa(l.m) : esc(l.q + ' ' + l.p.unite)) + '</p></div>' + control(l.p) + '</li>';
      }).join('') : '<li class="shd-empty">Votre panier est vide.</li>';
    }
    if (s === 3) {
      var liv = find(LIVRAISON, st.livraison), pay = find(PAIEMENT, st.paiement);
      q('[data-sum-produits]').innerHTML = c.L.map(function (l) { return '<div class="shd-sum-row"><span>' + esc(l.p.nom) + ' × ' + l.q + ' ' + esc(court(l.p.unite)) + '</span><span>' + (l.m != null ? fcfa(l.m) : 'à confirmer') + '</span></div>'; }).join('');
      var rows = [['Nom', st.nom], ['Téléphone', st.tel], ['Réception', liv ? liv.titre + (liv.adresse ? ' — ' + st.adresse : '') : '-'], ['Paiement', pay ? pay.titre : '-']];
      if (st.remarque.trim()) rows.push(['Remarque', st.remarque.trim()]);
      q('[data-sum-infos]').innerHTML = rows.map(function (r) { return '<div class="shd-sum-row"><span>' + esc(r[0]) + '</span><span>' + esc(r[1]) + '</span></div>'; }).join('');
    }
    q('.shd-total').style.display = s === 4 ? 'none' : '';
    q('.shd-total strong').textContent = c.txt;
    var btn = q('.shd-next');
    btn.innerHTML = (s === 3 ? I.wa : '') + esc(BOUTONS[s]) + (s < 3 ? I.arrow : '');
    btn.classList.toggle('wa', s === 3);
    btn.disabled = s === 1 && !c.refs;
  }

  function err(k, ok) { q('#shd-' + k).closest('.shd-field').classList.toggle('is-error', !ok); return ok; }
  function valide() {
    var ok = err('nom', st.nom.trim().length >= 2);
    ok = err('tel', st.tel.replace(/\D/g, '').length >= 8) && ok;
    var l = find(LIVRAISON, st.livraison);
    if (l && l.adresse) ok = err('adresse', st.adresse.trim().length >= 3) && ok;
    if (!ok) { var f = d.querySelector('.shd-field.is-error .shd-input'); if (f) f.focus(); }
    return ok;
  }
  function envoyer() {
    var c = calc(), liv = find(LIVRAISON, st.livraison), pay = find(PAIEMENT, st.paiement);
    var m = ["Bonjour SA'HELLO, je souhaite commander :", ''];
    c.L.forEach(function (l) { m.push('• ' + l.p.nom + ' : ' + l.q + ' ' + l.p.unite + (l.m != null ? ' (' + fcfa(l.m) + ')' : '')); });
    m.push('', 'Total estimé : ' + c.txt, '', 'Nom : ' + st.nom.trim(), 'Téléphone : ' + st.tel.trim(),
      'Réception : ' + (liv ? liv.titre : '-') + (liv && liv.adresse ? ' — ' + st.adresse.trim() : ''), 'Paiement : ' + (pay ? pay.titre : '-'));
    if (st.remarque.trim()) m.push('Remarque : ' + st.remarque.trim());
    window.open('https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(m.join('\n')), '_blank', 'noopener');
    st.cart = {}; st.remarque = ''; q('#shd-remarque').value = ''; save();
    renderList(); renderBar();
    go(4);
  }

  function go(s) { st.step = s; renderDrawer(); q('.shd-body').scrollTop = 0; }
  q('.shd-next').addEventListener('click', function () {
    if (st.step === 1) go(2);
    else if (st.step === 2) { if (valide()) go(3); }
    else if (st.step === 3) envoyer();
    else close();
  });
  q('.shd-back').addEventListener('click', function () { if (st.step > 1) go(st.step - 1); });
  d.addEventListener('click', function (e) {
    var b = e.target.closest('[data-q]');
    if (b) { var id = b.closest('[data-id]').getAttribute('data-id'); setQty(id, (st.cart[id] || 0) + (+b.getAttribute('data-q'))); return; }
    if (e.target.closest('[data-close]')) close();
  });

  var lastFocus = null;
  function smoother() { return window.ScrollSmoother && ScrollSmoother.get && ScrollSmoother.get(); }
  function isOpen() { return d.classList.contains('is-open'); }
  function open() {
    lastFocus = document.activeElement;
    st.step = 1; renderDrawer();
    d.classList.add('is-open'); document.documentElement.classList.add('shd-lock');
    var sm = smoother(); if (sm) sm.paused(true);
    setTimeout(function () { q('.shd-close').focus(); }, 50);
  }
  function close() {
    d.classList.remove('is-open'); document.documentElement.classList.remove('shd-lock');
    var sm = smoother(); if (sm) sm.paused(false);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && isOpen()) close(); });

  renderList(); renderBar();
})();
