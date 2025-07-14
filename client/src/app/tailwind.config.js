import rippleui from 'rippleui';

export default {
    content: [
      "./app/api/**/*.{js,ts,jsx,tsx}",
      "./app/components/**/*.{js,ts,jsx,tsx}",
      "./layouts/**/*.{js,ts,jsx,tsx}"
    ],
    theme: { extend: {} },
    plugins: [ rippleui ],
  }
  