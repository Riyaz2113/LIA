/**
 * seedAdmin.js
 * One-time admin account creation script.
 *
 * USAGE (from server/ directory):
 *   node scripts/seedAdmin.js
 *
 * PREREQUISITES:
 *   Fill in the following in your server/.env BEFORE running:
 *     ADMIN_NAME=
 *     ADMIN_EMAIL=
 *     ADMIN_PASSWORD=
 *     MONGODB_URI=
 *
 * SAFETY:
 *   - Running this script multiple times will NOT create duplicate admins.
 *     If an admin with ADMIN_EMAIL already exists, the script exits cleanly.
 *   - Admin credentials are read from environment variables — nothing is hardcoded.
 *   - The password is hashed with bcryptjs before storage.
 *   - This script does NOT run automatically on server start.
 *
 * SECURITY:
 *   - Never share or commit ADMIN_PASSWORD in source control.
 *   - Use a strong, unique password in production.
 */
require('dotenv').config();

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// ─── Validate required env variables before attempting anything ───────────────
const required = ['ADMIN_NAME', 'ADMIN_EMAIL', 'ADMIN_PASSWORD', 'MONGODB_URI'];
const missing = required.filter((k) => !process.env[k]);

if (missing.length > 0) {
  console.error(
    `\n❌ Missing required environment variables: ${missing.join(', ')}\n` +
    '   Please set them in server/.env before running this script.\n'
  );
  process.exit(1);
}

const ADMIN_NAME = process.env.ADMIN_NAME.trim();
const ADMIN_EMAIL = process.env.ADMIN_EMAIL.trim().toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (ADMIN_PASSWORD.length < 8) {
  console.error('\n❌ ADMIN_PASSWORD must be at least 8 characters.\n');
  process.exit(1);
}

// ─── Import User model AFTER dotenv config ────────────────────────────────────
const User = require('../src/models/User');

const seed = async () => {
  try {
    // ── Connect to MongoDB ─────────────────────────────────────────────────────
    console.log('\n🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected.');

    // ── Check for existing admin with this email ────────────────────────────────
    const existing = await User.findOne({ email: ADMIN_EMAIL });

    if (existing) {
      if (existing.role === 'ADMIN') {
        console.log(`\nℹ️  An admin with email "${ADMIN_EMAIL}" already exists. No changes made.\n`);
      } else {
        console.log(
          `\n⚠️  A user with email "${ADMIN_EMAIL}" exists but has role "${existing.role}". ` +
          'No changes made. Use a different email for the admin account.\n'
        );
      }
      await mongoose.disconnect();
      process.exit(0);
    }

    // ── Hash the password ─────────────────────────────────────────────────────
    const SALT_ROUNDS = 12;
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, SALT_ROUNDS);

    // ── Create the admin user ─────────────────────────────────────────────────
    const admin = await User.create({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: passwordHash,
      role: 'ADMIN',
      isActive: true,
    });

    console.log('\n✅ Admin account created successfully!');
    console.log(`   Name  : ${admin.name}`);
    console.log(`   Email : ${admin.email}`);
    console.log(`   Role  : ${admin.role}`);
    console.log(`   ID    : ${admin._id}\n`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('\n❌ Seed failed:', err.message);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seed();
