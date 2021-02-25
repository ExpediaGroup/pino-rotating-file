const Tape = require('tape')
const Mock = require('mock-require')
const Path = require('path')
const Sinon = require('sinon')
const requirePath = Path.resolve('./lib/index.js')

const StdOutMock = require('std-mocks')
const StdInMock = require('mock-stdin')

const beforeEach = () => {
  // Need to delete the cache before requiring the lib again or subsequent tests will fail
  delete require.cache[requirePath]
}

Tape('parseArgs without config using default', (t) => {
  beforeEach()
  t.plan(1)
  const path = Path.resolve('.rotate.js')
  Mock(path, { done: true })
  const { parseArgs } = require(requirePath)
  const config = parseArgs()
  Mock.stop(path)
  t.equals(config.done, true, 'got default')
})

Tape('parseArgs with config', (t) => {
  beforeEach()
  t.plan(1)
  const path = Path.resolve('test.js')
  Mock(path, { done: true })
  const { parseArgs } = require(requirePath)
  const config = parseArgs({ config: 'test.js' })
  Mock.stop(path)
  t.equals(config.done, true, 'got from config')
})

Tape('parseArgs with error (and fail through)', (t) => {
  beforeEach()
  t.plan(4)
  const { parseArgs } = require(requirePath)
  const config = parseArgs({ config: 'THIS_DOES_NOT_EXIST.js!' })
  t.ok(config, 'config ok')
  t.ok(config.filter, 'config.filter ok')
  t.equals(typeof config.filter, 'function', 'config.filter is function')
  t.false(config.filter(), 'filter returns false')
})

Tape('start with false filter with output to stdout', (t) => {
  beforeEach()
  t.plan(2)
  const stdin = StdInMock.stdin()
  StdOutMock.use({ stdout: true, stderr: true })
  const { start } = require(requirePath)
  const config = { filter () { return false }, output: { path: 'test.log', options: {} }, exit: false }
  start(config)
  stdin.send(Buffer.from('{}', 'utf8'))
  stdin.send(null)
  setImmediate(() => {
    StdOutMock.restore()
    stdin.restore()
    const { stdout } = StdOutMock.flush()
    t.equals(stdout.length, 1, 'one line')
    t.equals(stdout[0].trim(), '{}', 'got sent data')
  })
})

Tape('start with false filter with output to stdout with is JSON set false', (t) => {
  beforeEach()
  t.plan(2)
  const stdin = StdInMock.stdin()
  StdOutMock.use({ stdout: true, stderr: true })
  const { start } = require(requirePath)
  const config = { filter () { return false }, output: { path: 'test.log', options: {}, isJson: false }, exit: false }
  start(config)
  stdin.send(Buffer.from('msg', 'utf8'))
  stdin.send(null)
  setImmediate(() => {
    StdOutMock.restore()
    stdin.restore()
    const { stdout } = StdOutMock.flush()
    t.equals(stdout.length, 1, 'one line')
    t.equals(stdout[0].trim(), 'msg', 'got sent data')
  })
})

Tape('start with true filter with write to file with is Json set true', (t) => {
  beforeEach()
  t.plan(7)

  const writeStub = Sinon.stub()
  const endStub = Sinon.stub()
  const rfs = {
    createStream: () => ({
      write: writeStub,
      end: endStub
    })
  }
  Mock('rotating-file-stream', rfs)

  const stdin = StdInMock.stdin()
  StdOutMock.use({ stdout: true, stderr: true, print: true })

  const config = { filter () { return true }, output: { path: 'test.log', options: {}, isJson: true }, exit: false }
  const { start } = require(requirePath)
  start(config)

  stdin.send(Buffer.from('msg', 'utf8'))
  stdin.send(null)
  setImmediate(() => {
    StdOutMock.restore()
    stdin.restore()
    const { stdout } = StdOutMock.flush()
    t.equals(stdout.length, 0, 'zero lines')

    t.true(writeStub.calledOnce, 'Write stub called')
    const arg = JSON.parse(writeStub.getCall(0).args[0])
    t.equals(arg.data, 'msg', 'write stub called with json')
    t.equals(arg.level, 30, 'write stub called with json at level 30')
    t.equals(arg.tags[0], 'info', 'write stub called with json with tags set to info')
    t.true(arg.wasRaw, 'wasRaw was set to true')
    t.true(endStub.calledOnce, 'end called')
  })
})

Tape('start with true filter with write to file', (t) => {
  beforeEach()
  t.plan(3)

  const writeStub = Sinon.stub()
  const endStub = Sinon.stub()
  const rfs = {
    createStream: () => ({
      write: writeStub,
      end: endStub
    })
  }

  Mock('rotating-file-stream', rfs)

  const stdin = StdInMock.stdin()
  StdOutMock.use({ stdout: true, stderr: true, print: true })

  const config = { filter () { return true }, output: { path: 'test.log', options: {} }, exit: false }
  const { start } = require(requirePath)
  start(config)

  stdin.send(Buffer.from('{}', 'utf8'))
  stdin.send(null)
  setImmediate(() => {
    StdOutMock.restore()
    stdin.restore()
    const { stdout } = StdOutMock.flush()
    t.equals(stdout.length, 0, 'zero lines')

    t.true(writeStub.calledOnce, 'Write stub called')
    t.true(endStub.calledOnce, 'end called')
  })
})

Tape('start with true filter with write to file with non-JSON', (t) => {
  beforeEach()
  t.plan(7)

  const writeStub = Sinon.stub()
  const endStub = Sinon.stub()
  const rfs = {
    createStream: () => ({
      write: writeStub,
      end: endStub
    })
  }

  Mock('rotating-file-stream', rfs)

  const stdin = StdInMock.stdin()
  StdOutMock.use({ stdout: true, stderr: true, print: true })

  const config = { filter () { return true }, output: { path: 'test.log', options: {} }, exit: false }
  const { start } = require(requirePath)
  start(config)

  stdin.send(Buffer.from('msg', 'utf8'))
  stdin.send(null)
  setImmediate(() => {
    StdOutMock.restore()
    stdin.restore()
    const { stdout } = StdOutMock.flush()
    t.equals(stdout.length, 0, 'zero lines')

    t.true(writeStub.calledOnce, 'Write stub called')
    const arg = JSON.parse(writeStub.getCall(0).args[0])
    t.equals(arg.data, 'msg', 'write stub called with json')
    t.equals(arg.level, 30, 'write stub called with json at level 30')
    t.equals(arg.tags[0], 'info', 'write stub called with json with tags set to info')
    t.true(arg.wasRaw, 'wasRaw was set to true')
    t.true(endStub.calledOnce, 'end called')
  })
})

Tape('start with true filter with write to file with non-JSON with isJson=false', (t) => {
  beforeEach()
  t.plan(4)

  const writeStub = Sinon.stub()
  const endStub = Sinon.stub()
  const rfs = {
    createStream: () => ({
      write: writeStub,
      end: endStub
    })
  }

  Mock('rotating-file-stream', rfs)

  const stdin = StdInMock.stdin()
  StdOutMock.use({ stdout: true, stderr: true, print: true })

  const config = { filter () { return true }, output: { isJson: false, path: 'test.log', options: {} }, exit: false }
  const { start } = require(requirePath)
  start(config)

  stdin.send(Buffer.from('msg', 'utf8'))
  stdin.send(null)
  setImmediate(() => {
    StdOutMock.restore()
    stdin.restore()
    const { stdout } = StdOutMock.flush()
    t.equals(stdout.length, 0, 'zero lines')

    t.true(writeStub.calledOnce, 'Write stub called')
    const arg = writeStub.getCall(0).args[0]
    t.equals(arg, 'msg\n', 'write stub called with string')
    t.true(endStub.calledOnce, 'end called')
  })
})

Tape('start with true filter with write to file (no output options)', (t) => {
  beforeEach()
  t.plan(3)

  const writeStub = Sinon.stub()
  const endStub = Sinon.stub()
  const rfs = {
    createStream: () => ({
      write: writeStub,
      end: endStub
    })
  }

  Mock('rotating-file-stream', rfs)

  const stdin = StdInMock.stdin()
  StdOutMock.use({ stdout: true, stderr: true, print: true })

  const config = { filter () { return true }, output: { path: 'test.log' }, exit: false }
  const { start } = require(requirePath)
  start(config)

  stdin.send(Buffer.from('{}', 'utf8'))
  stdin.send(null)
  setImmediate(() => {
    StdOutMock.restore()
    stdin.restore()
    const { stdout } = StdOutMock.flush()
    t.equals(stdout.length, 0, 'zero lines')

    t.true(writeStub.calledOnce, 'Write stub called')
    t.true(endStub.calledOnce, 'end called')
  })
})

Tape('start with failing filter with write to stdout (and error to stderr)', (t) => {
  beforeEach()
  t.plan(4)
  const stdin = StdInMock.stdin()
  StdOutMock.use({ stdout: true, stderr: true, print: true })
  const config = { filter () { throw new Error('error') }, output: { path: 'test.log', options: {} }, exit: false }
  const { start } = require(requirePath)
  start(config)
  stdin.send(Buffer.from('{}', 'utf8'))
  stdin.send(null)
  setImmediate(() => {
    StdOutMock.restore()
    stdin.restore()
    const { stdout, stderr } = StdOutMock.flush()
    t.equals(stdout.length, 1, 'one line')
    t.equals(stdout[0].trim(), '{}', 'got sent data')
    t.equals(stderr.length, 1, 'one line')
    t.equals(stderr[0].trim(), 'Unable to filter log: "{}". error: error', 'got sent data')
  })
})

Tape('start with no output (filter false)', (t) => {
  beforeEach()
  t.plan(2)
  const stdin = StdInMock.stdin()
  StdOutMock.use({ stdout: true, stderr: true })
  const { start } = require(requirePath)
  const config = { filter () { return false }, exit: false }
  start(config)
  stdin.send(Buffer.from('{}', 'utf8'))
  stdin.send(null)
  setImmediate(() => {
    StdOutMock.restore()
    stdin.restore()
    const { stdout } = StdOutMock.flush()
    t.equals(stdout.length, 1, 'one line')
    t.equals(stdout[0].trim(), '{}', 'got sent data')
  })
})

Tape('start with no output (filter false)', (t) => {
  beforeEach()
  t.plan(2)
  const stdin = StdInMock.stdin()
  StdOutMock.use({ stdout: true, stderr: true })
  const { start } = require(requirePath)
  const config = { filter () { return true }, exit: false }
  start(config)
  stdin.send(Buffer.from('{}', 'utf8'))
  stdin.send(null)
  setImmediate(() => {
    StdOutMock.restore()
    stdin.restore()
    const { stdout } = StdOutMock.flush()
    t.equals(stdout.length, 1, 'one line')
    t.equals(stdout[0].trim(), '{}', 'got sent data')
  })
})
