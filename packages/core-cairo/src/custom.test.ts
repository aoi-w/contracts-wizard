import test from 'ava';
import { custom } from '.';

import { buildCustom, CustomOptions } from './custom';
import { printContract } from './print';

function testCustom(title: string, opts: Partial<CustomOptions>) {
  test(title, t => {
    const c = buildCustom({
      ...opts,
    });
    t.snapshot(printContract(c));
  });
}

/**
 * Tests external API for equivalence with internal API
 */
 function testAPIEquivalence(title: string, opts?: CustomOptions) {
  test(title, t => {
    t.is(custom.print(opts), printContract(buildCustom({
      ...opts,
    })));
  });
}

testCustom('custom', {});

testCustom('pausable', {
  pausable: true,
});

testCustom('upgradeable', {
  upgradeable: true,
});

testCustom('access control disabled', {
  access: false,
});

testCustom('access control ownable', {
  access: 'ownable',
});

testCustom('pausable with access control disabled', {
  // API should override access to true since it is required for pausable
  access: false,
  pausable: true,
});

testAPIEquivalence('custom API default');

testAPIEquivalence('custom API full upgradeable', {
  access: 'ownable',
  pausable: true,
  upgradeable: true,
});

test('custom API assert defaults', async t => {
  t.is(custom.print(custom.defaults), custom.print());
});

test('API isAccessControlRequired', async t => {
  t.is(custom.isAccessControlRequired({ pausable: true }), true);
  t.is(custom.isAccessControlRequired({ upgradeable: true }), false);
});