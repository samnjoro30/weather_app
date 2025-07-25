import rippleui from 'rippleui';

const config =  {
    content: [
      "./app/api/**/*.{js,ts,jsx,tsx}",
      "./app/components/**/*.{js,ts,jsx,tsx}",
      "./layouts/**/*.{js,ts,jsx,tsx}"
    ],
    theme: { extend: {} },
    plugins: [ rippleui ],
  }
  
  export default config;