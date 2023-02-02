const fixtures = {}

fixtures.Profile = {}
fixtures.Profile.client = { firstName: 'John', lastName: 'Doe', profession: 'programmer', balance: 0, type: 'client' }
fixtures.Profile.contractor = { ...fixtures.Profile.client, type: 'contractor' }

fixtures.Contract = {}
fixtures.Contract.new = { terms: 'blah', status: 'new' }
fixtures.Contract.inProgress = { ...fixtures.Contract.new, status: 'in_progress' }
fixtures.Contract.terminated = { ...fixtures.Contract.new, status: 'terminated' }

fixtures.Job = {}
fixtures.Job.unpaid = { description: 'a job', price: 100, paid: false }
fixtures.Job.paid = { ...fixtures.Job.unpaid, paid: true, paymentDate: new Date() }

module.exports = fixtures
