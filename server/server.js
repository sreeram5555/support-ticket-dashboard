require('dotenv').config({ path: '../.env' }); // Load .env from root
const app = require('./src/app');

const PORT = process.env.PORT || 3001;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
