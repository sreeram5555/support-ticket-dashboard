require('dotenv').config({ path: '../.env' }); // Load .env from root
const app = require('./src/app');
const { initDB } = require('./src/config/database');

const PORT = process.env.PORT || 3001;

initDB().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to initialize database', err);
  process.exit(1);
});
