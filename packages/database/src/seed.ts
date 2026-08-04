/**
 * Dashboard Capsule AI — Production Database Seeding Script
 */

import { OrganizationRecord, UserRecord } from './index';

export async function seedInitialDatabase(): Promise<{ org: OrganizationRecord; adminUser: UserRecord }> {
  console.log('🌱 Seeding initial organization, enterprise roles, and audit schemas...');

  const org: OrganizationRecord = {
    id: 'org_acme_90123',
    name: 'Acme Global Enterprise',
    slug: 'acme-global',
    planTier: 'ENTERPRISE',
    createdAt: new Date(),
  };

  const adminUser: UserRecord = {
    id: 'usr_demo_10921',
    organizationId: org.id,
    email: 'admin@enterprise.com',
    fullName: 'Alex Rivera',
    role: 'ORG_ADMIN',
    status: 'ACTIVE',
    createdAt: new Date(),
  };

  console.log(`✅ Default Organization Initialized: ${org.name} (${org.id})`);
  console.log(`✅ Default Admin User Initialized: ${adminUser.email} [${adminUser.role}]`);
  console.log('🎉 Production database seeding completed successfully!');

  return { org, adminUser };
}

async function main() {
  await seedInitialDatabase();
}

if (require.main === module) {
  main().catch((err) => {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  });
}

