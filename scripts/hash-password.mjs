#!/usr/bin/env node
import crypto from "node:crypto";

const password = process.argv[2];

if (!password) {
  console.error('Usage: node scripts/hash-password.mjs "your-password"');
  process.exit(1);
}

const salt = crypto.randomBytes(16);
const hash = crypto.scryptSync(password, salt, 64);

console.log(`${salt.toString("hex")}:${hash.toString("hex")}`);
