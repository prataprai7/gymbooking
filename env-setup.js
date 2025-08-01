const fs = require('fs');

// Create .env file with correct backend URL
const envContent = 'VITE_API_URL=http://localhost:6000/api\n';

fs.writeFileSync('.env', envContent);
console.log('✅ Created .env file with correct backend URL');
console.log('📝 Content: VITE_API_URL=http://localhost:6000/api'); 