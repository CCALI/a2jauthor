let config = {};

try {
  config = JSON.parse(localStorage.getItem('a2jConfig'));
} catch(e) {
  console.log('Error loading config from localStorage', e);
}

export default config;
