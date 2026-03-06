import { execSync } from 'child_process';

const seedScripts = [
    'prisma/seeds/seed_dsa_sheet.ts',
    'prisma/seeds/seed_cp_sheet.ts',
    'prisma/seeds/seed_admin.ts',
    'prisma/seeds/update_templates.ts',
];

console.log('🌱 Starting unified seed process...\n');

for (const script of seedScripts) {
    console.log(`⏳ Running ${script}...`);
    try {
        execSync(`npx tsx ${script}`, { stdio: 'inherit' });
        console.log(`✅ Successfully finished ${script}\n`);
    } catch (error) {
        console.error(`❌ Error running ${script}`);
        process.exit(1);
    }
}

console.log('🎉 All seeds executed successfully!');
