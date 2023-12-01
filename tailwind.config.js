/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{html,js,ts,tsx,jsx}', './dist/**/*.{html,js,ts,tsx,jsx}'],
    theme: {
        extend: {
            colors: {
                bootstrapdark: '#212529',
            },
        },
    },
    plugins: [],
    safelist: ['bg-bootstrapdark'],
}
