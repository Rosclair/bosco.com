/**
 * BOSCO CONSTRUCTION GROUP — Configuration Tailwind CSS partagée
 * Ce fichier est chargé après le CDN Tailwind sur chaque page.
 * Toutes les couleurs, espacements et typographies du projet sont définis ici.
 */
tailwind.config = {
    darkMode: "class",
    theme: {
        extend: {

            /* ---- Palette de couleurs ---- */
            colors: {
                /* Couleurs de marque */
                "vert-energie":   "#ADCE1E",   /* Vert lime – couleur signature */
                "vert-croissance":"#1F8438",   /* Vert foncé – accents */
                "anthracite":     "#2A2A2A",   /* Anthracite – textes sur fond clair */
                "jaune-soleil":   "#E8F000",   /* Jaune – accents secondaires */

                /* Surfaces */
                "surface":        "#f8f9fa",
                "background":     "#f8f9fa",

                /* Couleurs primaires (sombre) */
                "primary":              "#151616",
                "on-primary":           "#ffffff",
                "primary-container":    "#2a2a2a",
                "on-primary-container": "#929191",

                /* Couleurs secondaires (vert) */
                "secondary":            "#006e28",
                "on-secondary":         "#ffffff",

                /* Utilitaires */
                "border-gray":         "#D1D5DB",
                "on-surface-variant":  "#444748",
                "on-surface":          "#191c1d",
                "text-muted":          "#6B7280",
                "outline":             "#747878",
                "outline-variant":     "#c4c7c7",
                "inverse-surface":     "#2e3132",
                "inverse-on-surface":  "#f0f1f2",
            },

            /* ---- Espacements ---- */
            spacing: {
                "margin-mobile":  "16px",
                "margin-desktop": "80px",
                "gutter":         "24px",
                "2xl":            "64px",
                "xl":             "40px",
                "lg":             "24px",
                "md":             "16px",
                "sm":             "8px",
                "xs":             "4px",
            },

            /* ---- Familles de polices ---- */
            fontFamily: {
                "headline-xl":        ["Montserrat", "sans-serif"],
                "headline-xl-mobile": ["Montserrat", "sans-serif"],
                "headline-lg":        ["Montserrat", "sans-serif"],
                "headline-lg-mobile": ["Montserrat", "sans-serif"],
                "headline-md":        ["Montserrat", "sans-serif"],
                "headline-sm":        ["Montserrat", "sans-serif"],
                "label-md":           ["Montserrat", "sans-serif"],
                "label-sm":           ["Inter", "sans-serif"],
                "body-lg":            ["Inter", "sans-serif"],
                "body-md":            ["Inter", "sans-serif"],
                "body-sm":            ["Inter", "sans-serif"],
            },

            /* ---- Tailles de texte ---- */
            fontSize: {
                "headline-xl":        ["48px", { lineHeight: "58px",  letterSpacing: "-0.02em", fontWeight: "800" }],
                "headline-xl-mobile": ["32px", { lineHeight: "38px",  fontWeight: "800" }],
                "headline-lg":        ["36px", { lineHeight: "43px",  fontWeight: "700" }],
                "headline-lg-mobile": ["28px", { lineHeight: "34px",  fontWeight: "700" }],
                "headline-md":        ["28px", { lineHeight: "34px",  fontWeight: "600" }],
                "headline-sm":        ["22px", { lineHeight: "26px",  fontWeight: "600" }],
                "label-md":           ["16px", { lineHeight: "24px",  letterSpacing: "0.05em", fontWeight: "600" }],
                "label-sm":           ["12px", { lineHeight: "18px",  letterSpacing: "0.02em", fontWeight: "600" }],
                "body-lg":            ["18px", { lineHeight: "29px",  fontWeight: "400" }],
                "body-md":            ["16px", { lineHeight: "26px",  fontWeight: "400" }],
                "body-sm":            ["14px", { lineHeight: "22px",  fontWeight: "400" }],
            },
        }
    }
};
