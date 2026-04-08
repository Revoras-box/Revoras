const fs = require('fs');
const path = require('path');

const dirs = [
  'src/components/barber',
  'src/app/barbers/dashboard',
  'src/app/barbers/schedule',
  'src/app/barbers/barbers',
  'src/app/barbers/services',
  'src/app/barbers/walk-in',
  'src/app/barbers/payments',
  'src/app/barbers/analytics',
  'src/app/barbers/settings',
  'src/app/barbers/bookings',
  'src/app/barbers/slots'
];

process.chdir(path.resolve(__dirname));

dirs.forEach(dir => {
  try {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`✓ Created: ${dir}`);
  } catch (e) {
    console.log(`✗ Error creating ${dir}: ${e.message}`);
  }
});

console.log('\nVerifying created directories:');
const showTree = (dir, prefix = '') => {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  files.forEach((file, index) => {
    const isLast = index === files.length - 1;
    const connector = isLast ? '└── ' : '├── ';
    console.log(prefix + connector + file.name);
    if (file.isDirectory() && !file.name.startsWith('.')) {
      const extension = isLast ? '    ' : '│   ';
      showTree(path.join(dir, file.name), prefix + extension);
    }
  });
};

console.log('src/');
showTree('src');
