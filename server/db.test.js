import test from 'node:test';
import assert from 'node:assert/strict';
import { createDb, hashPassword } from './db.js';

test('hashPassword should create a secure hash and salt', () => {
  const { hash, salt } = hashPassword('123456');

  assert.equal(typeof hash, 'string');
  assert.equal(typeof salt, 'string');
  assert.notEqual(hash, '123456');
  assert.ok(hash.length > 20);
  assert.ok(salt.length > 10);
});

test('createDb should initialize tables', () => {
  const db = createDb(':memory:');

  const tables = db.prepare(
    "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name"
  ).all();

  const names = tables.map((row) => row.name);

  assert.ok(names.includes('users'));
  assert.ok(names.includes('vouchers'));
});
