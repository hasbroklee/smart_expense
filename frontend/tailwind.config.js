/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#f0f9ff',
                    100: '#e0f2fe',
                    200: '#bae6fd',
                    300: '#7dd3fc',
                    400: '#38bdf8',
                    500: '#0ea5e9',
                    600: '#0284c7',
                    700: '#0369a1',
                    800: '#075985',
                    900: '#0c4a6e',
                },
                jar: {
                    NEC: '#e74c3c',
                    FFA: '#3498db',
                    LTSS: '#2ecc71',
                    EDU: '#9b59b6',
                    PLAY: '#f39c12',
                    GIVE: '#e67e22',
                }
            }
        },
    },
    plugins: [],
}

