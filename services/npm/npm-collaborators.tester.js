import { nonNegativeInteger } from '../validators.js'
import { createServiceTester } from '../tester.js'
export const t = await createServiceTester()

t.create('gets the contributor count')
  .get('/prettier.json')
  .expectBadge({ label: 'npm collaborators', message: nonNegativeInteger })

t.create('gets the contributor count from a custom registry')
  .get('/prettier.json?registry_uri=https://registry.npmjs.com')
  .expectBadge({ label: 'npm collaborators', message: nonNegativeInteger })

t.create('contributor count for unknown package')
  .get('/npm-registry-does-not-have-this-package.json')
  .expectBadge({
    label: 'npm collaborators',
    message: 'package not found',
  })

t.create('contributor count for package package without a maintainers property')
  .get('/package-without-maintainers.json')
  .intercept(nock =>
    nock('https://registry.npmjs.org')
      .get('/package-without-maintainers/latest')
      .reply(200, {}),
  )
  .expectBadge({ label: 'npm collaborators', message: '0' })
