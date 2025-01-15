/**
 * This is a type definition comment that specifies the type of the exported object from the Tailwind CSS configuration file.
 * The `import('tailwindcss').Config` type represents the configuration object for Tailwind CSS, which is used to customize the default styles and behaviors of the framework.
 */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}