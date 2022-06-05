module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/**/*.{js,jsx,ts,tsx}","./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    colors: {
      transparent: "transparent",
      black: "#000000",
      white: "#ffffff",
      blue: "#0089E2",
      orange: "#F86C4B",
      purple: "#3C384D",
      grey: "#8C909D",
      "purple-pure": "#07021D",
      "bg-white": "#f7f7f9",
      "bg-grey": "#F1F2F6",
      red: "#E02A3F",
    },
    extend: {
      width: {
        button: "343px",
      },
      height: {
        button: "52px",
      },
    },
    borderRadius: {
      button: "12px",
    },
    fontSize: {
      button: "16px",
    },
    fontFamily: {
      lading: ['"Noto Sans JP"'],
      base: ['"M PLUS Rounded 1c"'],
    },
  },
  plugins: [],
};
