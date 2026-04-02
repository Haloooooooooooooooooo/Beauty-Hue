/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bone: '#F1E4D1',
        navy: '#162660',
        sky: '#D0E6FD',
        text: '#3A3A3A',
        muted: '#8A8A8A',
      },
      borderRadius: {
        card: '24px',
        button: '16px',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        glass: '0 8px 32px rgba(0, 0, 0, 0.06)',
        'glass-hover': '0 12px 40px rgba(0, 0, 0, 0.1)',
        photo: '0 10px 30px rgba(0, 0, 0, 0.08)',
      },
      backdropBlur: {
        glass: '20px',
      },
      transitionDuration: {
        color: '700ms',
      },
    },
  },
  plugins: [],
};
