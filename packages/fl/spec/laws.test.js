
import test from 'tape'
import apply from 'fantasy-land/laws/apply'
import setoid from 'fantasy-land/laws/setoid'
import applicative from 'fantasy-land/laws/applicative'
import functor from 'fantasy-land/laws/functor'
import chain from 'fantasy-land/laws/chain'
import monad from 'fantasy-land/laws/monad'

import { eq, identity } from './utils'
import { createAction } from '../src'

test('actions implement fantasy-land laws', t => {
  t.plan(12)

  const Action = createAction('action')

  t.ok(setoid.reflexivity(Action.of)(eq)(1), 'setoid:reflexivity')
  t.ok(setoid.transitivity(Action.of)(eq)(1), 'setoid:reflexivity')
  t.ok(setoid.symmetry(Action.of)(eq)(1), 'setoid:symmetry')

  t.ok(functor.identity(Action.of)(eq)(1), 'functor:identity')
  t.ok(functor.composition(Action.of)(eq)(identity)(identity)(1), 'functor:composition')

  t.ok(apply.composition(Action)(eq)(1), 'apply:composition')

  t.ok(applicative.identity(Action)(eq)(1), 'applicative:identity')
  t.ok(applicative.homomorphism(Action)(eq)(1), 'applicative:homomorphism')
  t.ok(applicative.interchange(Action)(eq)(1), 'applicative:interchange')

  t.ok(chain.associativity(Action)(eq)(1), 'chain:associativity')

  t.ok(monad.leftIdentity(Action)(eq)(Action.of)(1), 'monad:leftIdentity')
  t.ok(monad.rightIdentity(Action)(eq)(1), 'monad:rightIdentity')
})
