/* =========================================================
   SA'HELLO — Boutique de commande (style app d'épicerie)
   ---------------------------------------------------------
   À COMPLÉTER PAR SA'HELLO :
   - prix : en FCFA par unité ; null = « Prix à confirmer »
   - img  : chemin de la photo ; null = tuile avec l'initiale
   - LIVRAISON / PAIEMENT / CRENEAUX : options provisoires
   ========================================================= */
(function () {
  'use strict';

  var WHATSAPP = '22372707914';

  var CATEGORIES = [
    { id: 'maraichage', nom: 'Maraîchage',      img: 'assetsahello/commande/gombo.webp',        desc: 'Légumes cultivés à Dio Ba avec du compost et des engrais organiques, récoltés au plus près de la commande.' },
    { id: 'poisson',    nom: 'Poisson',         img: 'assetsahello/commande/poisson-chat.webp', desc: 'Tilapias et poissons-chats élevés dans nos bassins, vendus frais ou fumés de façon artisanale.' },
    { id: 'volaille',   nom: 'Volaille & œufs', img: 'assetsahello/commande/oeufs.webp',        desc: 'Volaille élevée sur notre ferme, fraîche ou fumée, et œufs frais vendus au plateau.' },
    { id: 'transfo',    nom: 'Transformés',     img: 'assetsahello/commande/karite.webp',       desc: 'Produits locaux transformés de façon artisanale.' }
  ];

  var PRODUITS = [
    { id: 'tomate',       cat: 'maraichage', nom: 'Tomate',             unite: 'kg',            prix: null, img: 'assetsahello/commande/tomate.webp' },
    { id: 'gombo',        cat: 'maraichage', nom: 'Gombo',              unite: 'kg',            prix: null, img: 'assetsahello/commande/gombo.webp' },
    { id: 'oignons',      cat: 'maraichage', nom: 'Oignons frais',      unite: 'kg',            prix: null, img: 'assetsahello/commande/oignons.webp' },
    { id: 'aubergines',   cat: 'maraichage', nom: 'Aubergines',         unite: 'kg',            prix: null, img: 'assetsahello/commande/aubergines.webp' },
    { id: 'piment',       cat: 'maraichage', nom: 'Piment',             unite: 'kg',            prix: null, img: 'assetsahello/commande/piment.webp' },
    { id: 'tilapia',      cat: 'poisson',    nom: 'Tilapia frais',      unite: 'kg',            prix: null, img: 'assetsahello/commande/tilapia.webp' },
    { id: 'poisson-chat', cat: 'poisson',    nom: 'Poisson-chat frais', unite: 'kg',            prix: null, img: 'assetsahello/commande/poisson-chat.webp' },
    { id: 'poisson-fume', cat: 'poisson',    nom: 'Poisson fumé',       unite: 'kg',            prix: null, img: 'assetsahello/commande/poisson-fume.webp' },
    { id: 'poulet-frais', cat: 'volaille',   nom: 'Poulet frais',       unite: 'pièce',         prix: null, img: 'assetsahello/commande/poulet-frais.webp' },
    { id: 'poulet-fume',  cat: 'volaille',   nom: 'Poulet fumé',        unite: 'pièce',         prix: null, img: 'assetsahello/commande/poulet-fume.webp' },
    { id: 'oeufs',        cat: 'volaille',   nom: 'Œufs frais',         unite: 'plateau de 30', prix: null, img: 'assetsahello/commande/oeufs.webp' },
    { id: 'miel',         cat: 'transfo',    nom: 'Miel',               unite: 'pot',           prix: null, img: null },
    { id: 'karite',       cat: 'transfo',    nom: 'Beurre de karité',   unite: 'pot',           prix: null, img: 'assetsahello/commande/karite.webp' }
  ];

  var LIVRAISON = [
    { id: 'domicile', titre: 'Livraison', desc: 'Bamako & Kati', adresse: true },
    { id: 'retrait',  titre: 'Retrait',   desc: 'À la ferme',    adresse: false }
  ];
  var PAIEMENT = [
    { id: 'especes', titre: 'Espèces' },
    { id: 'orange',  titre: 'Orange Money' },
    { id: 'moov',    titre: 'Moov Money' }
  ];
  var CRENEAUX = ['8h – 12h', '12h – 16h', '16h – 19h'];
  var MODALITES_PROVISOIRES = true;
  /* ======================================================= */

  var svg = function (p, w) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' + (w || 2) + '" stroke-linecap="round" stroke-linejoin="round">' + p + '</svg>'; };
  var I = {
    home: svg('<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/>'),
    grid: svg('<rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/>'),
    cart: svg('<circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M2 3h3l2.5 12h11.5l2-8H6.2"/>'),
    plus: svg('<path d="M12 5v14M5 12h14"/>', 2.5),
    minus: svg('<path d="M5 12h14"/>', 2.5),
    back: svg('<path d="M15 18l-6-6 6-6"/>', 2.5),
    arrow: svg('<path d="M5 12h14M13 6l6 6-6 6"/>', 2.5),
    trash: svg('<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>'),
    search: svg('<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>'),
    leaf: svg('<path d="M5 19c8 0 14-6 14-14-8 0-14 6-14 14z"/><path d="M5 19l7-7"/>'),
    truck: svg('<path d="M1 4h14v12H1z"/><path d="M15 8h4l3 3v5h-7z"/><circle cx="5.5" cy="18.5" r="2"/><circle cx="18.5" cy="18.5" r="2"/>'),
    chat: svg('<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/>'),
    pin: svg('<path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>'),
    cal: svg('<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>'),
    user: svg('<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>'),
    card: svg('<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>'),
    check: svg('<path d="M5 12l5 5L20 7"/>', 3),
    sun: svg('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>'),
    receipt: svg('<path d="M5 3h14v18l-3-2-2 2-2-2-2 2-2-2-3 2z"/><path d="M9 8h6M9 12h6"/>'),
    wa: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 2.9 2.9 0 0 0-.9 2.2 5 5 0 0 0 1.1 2.7 11.4 11.4 0 0 0 4.4 3.9c1.6.7 2.3.8 3.1.6a2.6 2.6 0 0 0 1.7-1.2 2.1 2.1 0 0 0 .2-1.2c-.1-.1-.3-.2-.5-.3z"/></svg>'
  };

  var app = document.getElementById('sha');
  if (!app) return;

  /* ---------- État ---------- */
  var KEY = 'sahello-boutique';
  var st = { view: 'home', cat: null, prod: null, q: '', cart: {}, jour: 0, creneau: 0, livraison: LIVRAISON[0].id, paiement: PAIEMENT[0].id, nom: '', tel: '', adresse: '', remarque: '' };
  try { var sv = JSON.parse(localStorage.getItem(KEY) || 'null'); if (sv) ['cart', 'livraison', 'paiement', 'nom', 'tel', 'adresse'].forEach(function (k) { if (sv[k] != null) st[k] = sv[k]; }); } catch (e) {}
  function save() { try { localStorage.setItem(KEY, JSON.stringify({ cart: st.cart, livraison: st.livraison, paiement: st.paiement, nom: st.nom, tel: st.tel, adresse: st.adresse })); } catch (e) {}
    try { document.dispatchEvent(new CustomEvent('sahello:panier')); } catch (e) {} }

  function esc(s) { var d = document.createElement('div'); d.textContent = s == null ? '' : String(s); return d.innerHTML; }
  function fcfa(n) { return n.toLocaleString('fr-FR').replace(/ | /g, ' ') + ' FCFA'; }
  function find(list, id) { for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i]; return null; }
  function qte(q, u) { return q + ' ' + (q > 1 ? u.replace(/^pièce/, 'pièces').replace(/^pot/, 'pots').replace(/^plateau/, 'plateaux') : u); }
  function img(p, cls) { return '<div class="' + cls + '">' + (p.img ? '<img src="' + esc(p.img) + '" alt="' + esc(p.nom) + '" loading="lazy">' : esc(p.nom.charAt(0))) + '</div>'; }
  function prix(p, q) { return p.prix != null ? '<p class="sha-price">' + fcfa(p.prix * (q || 1)) + '</p>' : '<p class="sha-price tbd">Prix à confirmer</p>'; }
  function stepper(id, q, lg) { return '<div class="sha-step' + (lg ? ' lg' : '') + '" data-id="' + id + '"><button type="button" data-d="-1" aria-label="Retirer">' + I.minus + '</button><span>' + q + '</span><button type="button" data-d="1" aria-label="Ajouter">' + I.plus + '</button></div>'; }

  var JOURS = (function () {
    var out = [], noms = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'], mois = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
    for (var i = 0; i < 3; i++) { var d = new Date(); d.setDate(d.getDate() + i); out.push({ titre: i === 0 ? "Aujourd'hui" : i === 1 ? 'Demain' : noms[d.getDay()], date: d.getDate() + ' ' + mois[d.getMonth()] }); }
    return out;
  })();

  function calc() {
    var L = PRODUITS.filter(function (p) { return st.cart[p.id] > 0; }).map(function (p) { var q = st.cart[p.id]; return { p: p, q: q, m: p.prix != null ? p.prix * q : null }; });
    var t = 0, inc = false, n = 0;
    L.forEach(function (l) { n += l.q; if (l.m == null) inc = true; else t += l.m; });
    return { L: L, total: t, inc: inc, n: n, txt: (inc && t === 0) ? 'À confirmer' : fcfa(t) + (inc ? ' + à confirmer' : '') };
  }

  /* ---------- Squelette ---------- */
  app.innerHTML =
    '<div class="sha-top">' +
      '<div class="sha-brand"><img src="assetsahello/commande/picto.png" alt="">SA\'HELLO <span>Fresh</span></div>' +
      '<nav class="sha-nav">' +
        '<button type="button" data-go="home">' + I.home + '<span class="lbl">Accueil</span></button>' +
        '<button type="button" data-go="cat">' + I.grid + '<span class="lbl">Produits</span></button>' +
        '<button type="button" data-go="cart">' + I.cart + '<span class="lbl">Panier</span><span class="sha-badge" hidden>0</span></button>' +
      '</nav>' +
    '</div>' +
    '<div class="sha-view" data-v="home"></div>' +
    '<div class="sha-view" data-v="cat"></div>' +
    '<div class="sha-view" data-v="prod"></div>' +
    '<div class="sha-view" data-v="cart"></div>' +
    '<div class="sha-view" data-v="done"></div>' +
    '<div class="sha-toast" role="status"><span></span><button type="button" data-go="cart">Voir le panier</button></div>';
  var $ = function (s) { return app.querySelector(s); };
  var V = function (v) { return app.querySelector('[data-v="' + v + '"]'); };

  function card(p) {
    var q = st.cart[p.id] || 0;
    return '<article class="sha-card" data-open="' + p.id + '">' + img(p, 'sha-card-img') +
      '<span class="sha-card-tag">Frais de la ferme</span>' +
      '<div class="sha-card-body"><div><h4>' + esc(p.nom) + '</h4><p class="sha-unit">Par ' + esc(p.unite) + '</p>' + prix(p) + '</div>' +
      '<button type="button" class="sha-add' + (q ? ' in' : '') + '" data-add="' + p.id + '" aria-label="Ajouter ' + esc(p.nom) + ' au panier">' + (q ? q : I.plus) + '</button></div></article>';
  }

  /* ---------- Vues ---------- */
  function vHome() {
    V('home').innerHTML =
      '<div class="sha-hero"><div class="sha-hero-txt"><h3>Frais de la ferme à votre table</h3><p>Légumes, poisson, volaille et œufs cultivés et élevés à Dio Ba, au Mali.</p>' +
        '<button type="button" class="sha-btn" data-go="cat">Commander maintenant ' + I.arrow + '</button></div>' +
        '<div class="sha-hero-img"><img src="assetsahello/commande/banniere.webp" alt="Panier de légumes frais SA\'HELLO"></div></div>' +
      '<div class="sha-perks">' +
        '<div class="sha-perk"><i>' + I.leaf + '</i><div>Agriculture écologique<small>Compost & engrais organiques</small></div></div>' +
        '<div class="sha-perk"><i>' + I.sun + '</i><div>Frais toute l\'année<small>Récolté près de chez vous</small></div></div>' +
        '<div class="sha-perk"><i>' + I.chat + '</i><div>Commande WhatsApp<small>Simple et rapide</small></div></div>' +
      '</div>' +
      '<label class="sha-search">' + I.search + '<input type="search" placeholder="Rechercher un produit…" data-search aria-label="Rechercher un produit"></label>' +
      '<div class="sha-sec"><h3>Nos catégories</h3><button type="button" class="sha-link" data-go="cat">Tout voir ' + I.arrow + '</button></div>' +
      '<div class="sha-cats">' + CATEGORIES.map(function (c) {
        var n = PRODUITS.filter(function (p) { return p.cat === c.id; }).length;
        return '<button type="button" class="sha-cat" data-cat="' + c.id + '"><div class="sha-cat-img"><img src="' + esc(c.img) + '" alt="" loading="lazy"></div><b>' + esc(c.nom) + '</b><small>' + n + ' produit' + (n > 1 ? 's' : '') + '</small></button>';
      }).join('') +
        '<button type="button" class="sha-cat" data-go="cat"><div class="sha-cat-img"><img src="assetsahello/commande/banniere.webp" alt="" loading="lazy"></div><b>Tout</b><small>' + PRODUITS.length + ' produits</small></button>' +
      '</div>' +
      '<div class="sha-sec"><h3>Populaires</h3><button type="button" class="sha-link" data-go="cat">Voir plus ' + I.arrow + '</button></div>' +
      '<div class="sha-grid">' + ['tomate', 'tilapia', 'oeufs', 'poulet-frais'].map(function (id) { return card(find(PRODUITS, id)); }).join('') + '</div>';
  }

  function vCat() {
    var c = st.cat ? find(CATEGORIES, st.cat) : null;
    var q = st.q.trim().toLowerCase();
    var list = PRODUITS.filter(function (p) { return (!c || p.cat === c.id) && (!q || p.nom.toLowerCase().indexOf(q) >= 0); });
    V('cat').innerHTML =
      '<button type="button" class="sha-back" data-go="home">' + I.back + ' Accueil</button>' +
      '<div class="sha-filter">' +
        ['tout'].concat(CATEGORIES.map(function (x) { return x.id; })).map(function (id) {
          var nom = id === 'tout' ? 'Tout' : find(CATEGORIES, id).nom, on = id === 'tout' ? !c : c && c.id === id;
          return '<label class="sha-chip"><input type="radio" name="sha-cat" value="' + id + '"' + (on ? ' checked' : '') + '><span>' + esc(nom) + '</span></label>';
        }).join('') + '</div>' +
      '<label class="sha-search" style="margin:0 0 18px">' + I.search + '<input type="search" placeholder="Rechercher un produit…" data-search value="' + esc(st.q) + '" aria-label="Rechercher un produit"></label>' +
      '<div class="sha-grid">' + (list.length ? list.map(card).join('') : '<p class="sha-empty">Aucun produit ne correspond à « ' + esc(st.q) + ' ».</p>') + '</div>';
  }

  function vProd() {
    var p = find(PRODUITS, st.prod); if (!p) return;
    var c = find(CATEGORIES, p.cat), q = st.cart[p.id] || 1;
    V('prod').innerHTML =
      '<button type="button" class="sha-back" data-cat="' + c.id + '">' + I.back + ' ' + esc(c.nom) + '</button>' +
      '<div class="sha-detail">' + img(p, 'sha-detail-img') +
        '<div><p class="sha-detail-cat">' + esc(c.nom) + '</p><h3>' + esc(p.nom) + '</h3><p class="sha-unit">Vendu par ' + esc(p.unite) + '</p>' + prix(p) +
        '<p class="sha-desc">' + esc(c.desc) + '</p>' +
        '<div class="sha-feats"><div class="sha-feat"><i>' + I.leaf + '</i>Agriculture écologique</div><div class="sha-feat"><i>' + I.sun + '</i>Frais de la ferme</div><div class="sha-feat"><i>' + I.pin + '</i>Produit à Dio Ba</div></div>' +
        '<div class="sha-buy"><div class="sha-step lg" data-local><button type="button" data-l="-1" aria-label="Moins">' + I.minus + '</button><span>' + q + '</span><button type="button" data-l="1" aria-label="Plus">' + I.plus + '</button></div>' +
        '<button type="button" class="sha-btn" data-buy="' + p.id + '">' + I.cart + (st.cart[p.id] ? 'Mettre à jour' : 'Ajouter au panier') + '</button></div></div>' +
      '</div>';
  }

  function vCart() {
    var c = calc();
    if (!c.L.length) {
      V('cart').innerHTML = '<div class="sha-cart-empty">' + I.cart.replace('<svg', '<svg width="40" height="40" style="color:var(--o)"') + '<h3 style="margin:10px 0 0;font-size:22px;font-weight:800">Votre panier est vide</h3><p>Ajoutez des produits frais de la ferme pour commencer.</p><button type="button" class="sha-btn" data-go="cat">Voir les produits ' + I.arrow + '</button></div>';
      return;
    }
    var liv = find(LIVRAISON, st.livraison);
    function chips(name, opts, cur, cls) {
      return '<div class="sha-chips' + (opts.length === 2 ? ' two' : '') + '">' + opts.map(function (o, i) {
        var val = o.id != null ? o.id : i, on = String(val) === String(cur);
        return '<label class="sha-chip' + (cls || '') + '"><input type="radio" name="' + name + '" value="' + val + '"' + (on ? ' checked' : '') + '><span>' + esc(o.titre || o) + (o.desc || o.date ? '<small>' + esc(o.desc || o.date) + '</small>' : '') + '</span></label>';
      }).join('') + '</div>';
    }
    V('cart').innerHTML =
      '<div class="sha-cart"><div>' +
        '<h3 class="t">Votre panier (' + c.L.length + ')</h3>' +
        '<div class="sha-lines">' + c.L.map(function (l) {
          return '<div class="sha-line">' + img(l.p, 'sha-line-img') + '<div class="sha-line-info"><h4>' + esc(l.p.nom) + '</h4><p class="sha-unit">' + esc(qte(l.q, l.p.unite)) + '</p>' + prix(l.p, l.q) + '</div>' +
            '<div class="sha-line-right"><button type="button" class="sha-trash" data-del="' + l.p.id + '" aria-label="Supprimer ' + esc(l.p.nom) + '">' + I.trash + '</button>' + stepper(l.p.id, l.q) + '</div></div>';
        }).join('') + '</div>' +
        '<button type="button" class="sha-link" data-go="cat" style="margin-top:14px">' + I.plus + ' Ajouter d\'autres produits</button>' +
      '</div><div>' +
        '<div class="sha-panel"><h4>' + I.truck + 'Réception</h4>' + chips('sha-liv', LIVRAISON, st.livraison) +
          '<h4 style="margin-top:16px">' + I.cal + 'Créneau souhaité</h4>' + chips('sha-jour', JOURS, st.jour) + chips('sha-creneau', CRENEAUX, st.creneau, ' soft') + '</div>' +
        '<div class="sha-panel"><h4>' + I.user + 'Vos coordonnées</h4>' +
          '<label class="sha-field"><input data-k="nom" autocomplete="name" placeholder="Nom complet" value="' + esc(st.nom) + '"><em>Indiquez votre nom.</em></label>' +
          '<label class="sha-field"><input data-k="tel" type="tel" inputmode="tel" autocomplete="tel" placeholder="Téléphone / WhatsApp" value="' + esc(st.tel) + '"><em>Numéro invalide (8 chiffres minimum).</em></label>' +
          (liv && liv.adresse ? '<label class="sha-field"><input data-k="adresse" autocomplete="street-address" placeholder="Adresse : quartier, rue, repère" value="' + esc(st.adresse) + '"><em>Indiquez l\'adresse de livraison.</em></label>' : '') +
          '<label class="sha-field"><textarea data-k="remarque" placeholder="Remarque (facultatif)">' + esc(st.remarque) + '</textarea></label>' +
          '<h4 style="margin-top:6px">' + I.card + 'Paiement</h4>' + chips('sha-pay', PAIEMENT, st.paiement) +
          (MODALITES_PROVISOIRES ? '<p class="sha-note">Frais, créneaux de livraison et moyens de paiement vous seront confirmés par message.</p>' : '') + '</div>' +
        '<div class="sha-panel"><div class="sha-totals"><div><span>Sous-total</span><span>' + esc(c.txt) + '</span></div><div><span>Livraison</span><span>' + (liv && liv.adresse ? 'À confirmer' : 'Gratuit') + '</span></div><div class="big"><span>Total</span><span>' + esc(c.txt) + '</span></div></div>' +
          '<button type="button" class="sha-btn block" data-order>Passer la commande ' + I.arrow + '</button></div>' +
      '</div></div>';
  }

  var lastMsg = '';
  function vDone() {
    V('done').innerHTML =
      '<div class="sha-done"><div class="sha-done-hero"><img src="assetsahello/commande/banniere.webp" alt=""></div><div class="sha-done-ok">' + I.check + '</div>' +
      '<h3>Commande prête&nbsp;!</h3><p>WhatsApp s\'est ouvert avec votre commande : appuyez sur « Envoyer » pour nous la transmettre.</p>' +
      '<div class="sha-done-rows">' + lastRows + '</div>' +
      '<button type="button" class="sha-btn wa block" data-resend>' + I.wa + 'Rouvrir WhatsApp</button>' +
      '<button type="button" class="sha-btn ghost block" data-go="home">Continuer mes achats</button></div>';
  }
  var lastRows = '';

  /* ---------- Navigation ---------- */
  function badge(bump) {
    var n = calc().n, b = $('.sha-badge');
    b.hidden = !n; b.textContent = n;
    if (bump) { b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump'); }
  }
  function show(v, opts) {
    st.view = v;
    if (v === 'home') vHome(); if (v === 'cat') vCat(); if (v === 'prod') vProd(); if (v === 'cart') vCart(); if (v === 'done') vDone();
    Array.prototype.forEach.call(app.querySelectorAll('.sha-view'), function (el) { el.classList.toggle('is-active', el.getAttribute('data-v') === v); });
    Array.prototype.forEach.call(app.querySelectorAll('.sha-nav [data-go]'), function (b) { var g = b.getAttribute('data-go'); b.classList.toggle('is-active', g === v || (g === 'cat' && v === 'prod')); });
    if (!(opts && opts.noScroll)) toTop();
  }
  function toTop() {
    var top = app.getBoundingClientRect().top;
    if (top > -10 && top < 140) return;
    var sm = window.ScrollSmoother && ScrollSmoother.get && ScrollSmoother.get();
    if (sm) sm.scrollTo(app, true, 'top 90px'); else window.scrollTo({ top: window.scrollY + top - 90, behavior: 'smooth' });
  }
  var tTimer;
  function toast(msg) {
    var t = $('.sha-toast'); t.querySelector('span').textContent = msg; t.classList.add('on');
    clearTimeout(tTimer); tTimer = setTimeout(function () { t.classList.remove('on'); }, 2600);
  }
  function setQty(id, q) {
    q = Math.max(0, Math.min(99, q));
    if (q) st.cart[id] = q; else delete st.cart[id];
    save(); badge(true);
  }
  function refresh() { show(st.view, { noScroll: true }); }

  /* ---------- Événements ---------- */
  app.addEventListener('click', function (e) {
    var t;
    if ((t = e.target.closest('[data-add]'))) {
      e.stopPropagation(); var id = t.getAttribute('data-add'), p = find(PRODUITS, id);
      setQty(id, (st.cart[id] || 0) + 1); refresh(); toast(p.nom + ' ajouté au panier'); return;
    }
    if ((t = e.target.closest('.sha-step[data-id] [data-d]'))) {
      var sid = t.closest('[data-id]').getAttribute('data-id'); setQty(sid, (st.cart[sid] || 0) + (+t.getAttribute('data-d'))); refresh(); return;
    }
    if ((t = e.target.closest('[data-l]'))) {
      var span = t.parentNode.querySelector('span'); span.textContent = Math.max(1, Math.min(99, (+span.textContent) + (+t.getAttribute('data-l')))); return;
    }
    if ((t = e.target.closest('[data-buy]'))) {
      var bid = t.getAttribute('data-buy'), bq = +app.querySelector('[data-local] span').textContent;
      setQty(bid, bq); toast(find(PRODUITS, bid).nom + ' × ' + bq + ' dans le panier'); vProd(); return;
    }
    if ((t = e.target.closest('[data-del]'))) { setQty(t.getAttribute('data-del'), 0); refresh(); return; }
    if ((t = e.target.closest('[data-order]'))) { commander(); return; }
    if ((t = e.target.closest('[data-resend]'))) { ouvrirWA(); return; }
    if ((t = e.target.closest('[data-cat]'))) { st.cat = t.getAttribute('data-cat'); st.q = ''; show('cat'); return; }
    if ((t = e.target.closest('[data-go]'))) { var g = t.getAttribute('data-go'); if (g === 'cat') { st.cat = null; st.q = ''; } $('.sha-toast').classList.remove('on'); show(g); return; }
    if ((t = e.target.closest('[data-open]'))) { st.prod = t.getAttribute('data-open'); show('prod'); return; }
  });
  app.addEventListener('change', function (e) {
    var n = e.target.name, v = e.target.value;
    if (n === 'sha-cat') { st.cat = v === 'tout' ? null : v; vCat(); }
    if (n === 'sha-liv') { st.livraison = v; save(); vCart(); }
    if (n === 'sha-pay') { st.paiement = v; save(); }
    if (n === 'sha-jour') st.jour = +v;
    if (n === 'sha-creneau') st.creneau = +v;
  });
  app.addEventListener('input', function (e) {
    var k = e.target.getAttribute('data-k');
    if (k) { st[k] = e.target.value; e.target.closest('.sha-field').classList.remove('err'); save(); return; }
    if (e.target.hasAttribute('data-search')) {
      st.q = e.target.value;
      if (st.view !== 'cat') { st.cat = null; show('cat'); }
      else vCat();
      var s = V('cat').querySelector('[data-search]'); s.focus(); s.setSelectionRange(s.value.length, s.value.length);
    }
  });

  /* ---------- Commande ---------- */
  function err(k, ok) { var el = app.querySelector('[data-k="' + k + '"]'); if (el) el.closest('.sha-field').classList.toggle('err', !ok); return ok; }
  function commander() {
    var liv = find(LIVRAISON, st.livraison);
    var ok = err('nom', st.nom.trim().length >= 2);
    ok = err('tel', st.tel.replace(/\D/g, '').length >= 8) && ok;
    if (liv && liv.adresse) ok = err('adresse', st.adresse.trim().length >= 3) && ok;
    if (!ok) { var f = app.querySelector('.sha-field.err input'); if (f) f.focus(); return; }

    var c = calc(), pay = find(PAIEMENT, st.paiement), j = JOURS[st.jour], cr = CRENEAUX[st.creneau];
    var m = ["Bonjour SA'HELLO, je souhaite commander :", ''];
    c.L.forEach(function (l) { m.push('• ' + l.p.nom + ' : ' + qte(l.q, l.p.unite) + (l.m != null ? ' (' + fcfa(l.m) + ')' : '')); });
    m.push('', 'Total estimé : ' + c.txt, '', 'Nom : ' + st.nom.trim(), 'Téléphone : ' + st.tel.trim(),
      'Réception : ' + (liv ? liv.titre : '-') + (liv && liv.adresse ? ' — ' + st.adresse.trim() : ''),
      'Créneau souhaité : ' + j.titre + ' ' + j.date + ', ' + cr, 'Paiement : ' + (pay ? pay.titre : '-'));
    if (st.remarque.trim()) m.push('Remarque : ' + st.remarque.trim());
    lastMsg = m.join('\n');

    lastRows =
      '<div class="sha-done-row"><i>' + I.truck + '</i><div><b>' + esc(liv.titre) + '</b><span>' + esc(j.titre + ' ' + j.date + ' · ' + cr) + '</span></div></div>' +
      (liv.adresse ? '<div class="sha-done-row"><i>' + I.pin + '</i><div><b>Adresse</b><span>' + esc(st.adresse.trim()) + '</span></div></div>' : '') +
      '<div class="sha-done-row"><i>' + I.receipt + '</i><div><b>' + c.n + ' article' + (c.n > 1 ? 's' : '') + ' · ' + esc(c.txt) + '</b><span>' + esc(c.L.map(function (l) { return l.p.nom + ' × ' + l.q; }).join(', ')) + '</span></div></div>';

    ouvrirWA();
    st.cart = {}; st.remarque = ''; save(); badge();
    show('done');
  }
  function ouvrirWA() { if (lastMsg) window.open('https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(lastMsg), '_blank', 'noopener'); }

  badge();
  /* commander.html#panier (bouton panier du menu) ouvre directement le panier */
  function depuisAdresse(scroll) {
    if (location.hash === '#panier') show('cart', { noScroll: !scroll });
    else if (location.hash === '#produits') { st.cat = null; show('cat', { noScroll: !scroll }); }
    else return false;
    return true;
  }
  if (!depuisAdresse(false)) show('home', { noScroll: true });
  else setTimeout(toTop, 700); /* attendre le défilement doux du thème */
  window.addEventListener('hashchange', function () { depuisAdresse(true); });
})();
