/* ================================================
   BOSCO CONSTRUCTION GROUP — main.js
   Scripts partagés par toutes les pages du site.
   Chargé en bas de <body> sur chaque page.
   ================================================ */


/* ------------------------------------------------
   Page Loader
   Masque l'écran de chargement dès que la page
   (images incluses) est entièrement chargée.
   ------------------------------------------------ */
(function () {
    const loader = document.getElementById('page-loader');
    if (!loader) return;

    const hide = () => {
        loader.classList.add('loader-hidden');
        loader.addEventListener('transitionend', () => loader.remove(), { once: true });
    };

    if (document.readyState === 'complete') {
        hide();
    } else {
        window.addEventListener('load', hide);
    }
})();


/* ------------------------------------------------
   Scroll Reveal
   Fait apparaître en fondu tous les éléments .reveal
   quand ils entrent dans le viewport.
   ------------------------------------------------ */
const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    },
    { threshold: 0.1 }
);

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


/* ------------------------------------------------
   Lucide icons
   ------------------------------------------------ */
lucide.createIcons();


/* ------------------------------------------------
   Ombre de la navbar au défilement
   Ajoute shadow-md quand on n'est plus en haut.
   ------------------------------------------------ */
(function () {
    const nav = document.querySelector('nav');
    if (!nav) return;

    window.addEventListener('scroll', () => {
        nav.classList.toggle('shadow-md', window.scrollY > 50);
    }, { passive: true });
})();


/* ------------------------------------------------
   Menu mobile (overlay plein écran)
   Bouton hamburger → ouvre l'overlay.
   Bouton fermer ou clic sur un lien → ferme.
   ------------------------------------------------ */
(function () {
    const menuBtn    = document.getElementById('mobile-menu-btn');
    const closeBtn   = document.getElementById('close-menu');
    const mobileMenu = document.getElementById('mobile-menu');

    if (!menuBtn || !closeBtn || !mobileMenu) return;

    const open = () => {
        mobileMenu.classList.remove('hidden');
        mobileMenu.classList.add('flex');
        document.body.style.overflow = 'hidden';
    };

    const close = () => {
        mobileMenu.classList.add('hidden');
        mobileMenu.classList.remove('flex');
        document.body.style.overflow = '';
    };

    menuBtn.addEventListener('click', open);
    closeBtn.addEventListener('click', close);

    /* Ferme aussi quand on clique sur un lien du menu */
    mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', close));
})();
