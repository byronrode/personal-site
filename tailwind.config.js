const allPlugins = {
  typography: require("@tailwindcss/typography"),
};

const plugins = Object.keys(allPlugins).map((k) => {
  return allPlugins[k];
});

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.hbs", "./**/*.hbs"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          dark: "rgb(17,24,39)",
          light: "rgb(75 81 96)",
        },
        highlight: "rgb(255 26 117)",
        "br-red": "#95323f",
        "br-charcoal": "#131306",
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        "zilla-slab": ['"Zilla Slab"', "serif"],
        bitter: ["Bitter", "serif"],
      },
    },
  },
  safelist: [
    {
      pattern: /text-(1|2|3|4|5|6)xl/,
      variants: ["sm", "md", "lg", "sm:hover", "md:hover", "lg:hover"],
    },
    "rounded",
    {
      pattern: /font-(bold|light)/,
    },
    {
      pattern: /rounded-(md|lg|full)/,
    },
    {
      pattern: /tracking-(tight|tighter|normal|wide)/,
    },
    {
      pattern: /leading-(tight|snug|normal|relaxed)/,
    },
    {
      pattern: /bg-(br-red|br-charcoal)/,
      variants: ["lg", "hover", "focus", "lg:hover"],
    },
  ],
  plugins: plugins,
};
