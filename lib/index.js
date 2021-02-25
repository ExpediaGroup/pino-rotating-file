#!/usr/bin/env node

/*
Copyright 2019 Expedia Group, Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

const Minimist = require('minimist')
const Path = require('path')
const Split = require('split2')
const Pump = require('pump')
const Through = require('through2')
const Rfs = require('rotating-file-stream')
const debug = require('debug')('pino-rotating-file')

const failThru = {
  filter: () => false
}

function start (config) {
  const { filter, output, exit } = config
  // create an output stream for rotating file logs that are filtered.
  let outputStream
  if (output) {
    debug('creating output stream: path=%s, options=%o', output.path, output.options)
    outputStream = Rfs.createStream(output.path, output.options || {})
  }

  function shutdown (reason) {
    try {
      debug('shutting down: %s (%s)', output.path, reason)
      /* istanbul ignore else */
      if (outputStream) {
        outputStream.end()
      }
    } catch (e) {
      // Can't close stream. Don't care because we are shutting down. Suppress the error.
      /* istanbul ignore next */
      debug('error ending stream: %s', e.message)
    } finally {
      /* istanbul ignore if */
      if (typeof exit === 'undefined' || exit) { // this is so it does not kill unit test
        process.exit(0)
      }
    }
  }

  function safeParse (line) {
    try {
      return JSON.parse(line)
    } catch (err) {
      return {
        level: 30,
        wasRaw: true,
        time: Date.now(),
        tags: ['info'],
        data: line
      }
    }
  }

  function unsafeParse (line) {
    return line
  }

  // transform stream
  const myTransport = Through.obj(function (data, enc, cb) {
    let result
    try {
      result = filter(data)
    } catch (err) {
      result = false
      process.stderr.write(`Unable to filter log: "${JSON.stringify(data)}". error: ${err.message}`)
    }
    if (result && outputStream) {
      debug('logging to %s', output.path)
      // if filtered by config, output to rotating file
      if (output && output.isJson === false) {
        setImmediate(() => { outputStream.write(data + '\n', 'utf8', cb) })
      } else {
        setImmediate(() => { outputStream.write(`${JSON.stringify(data)}\n`, 'utf8', cb) })
      }
    } else {
      // otherwise send out stdout and do not block the loop.
      if (output && output.isJson === false) {
        setImmediate(() => { process.stdout.write(data + '\n', 'utf8', cb) })
      } else {
        setImmediate(() => { process.stdout.write(`${JSON.stringify(data)}\n`, 'utf8', cb) })
      }
    }
  })

  // get stdin and pump through Split to parse JSON, and send to transport.
  if (output && output.isJson === false) {
    Pump(process.stdin, Split(unsafeParse), myTransport)
  } else {
    Pump(process.stdin, Split(safeParse), myTransport)
  }

  // stdin finishes, close the output stream.
  process.stdin.on('end', () => shutdown('stdin ended'))

  // on SIGINT end gracefully
  /* istanbul ignore next */
  process.on('SIGINT', () => shutdown('SIGINT'))

  // on SIGTERM end gracefully
  /* istanbul ignore next */
  process.on('SIGTERM', () => shutdown('SIGTERM'))
}

function parseArgs (args) {
  const configPath = (args && args.config) || '.rotate.js'
  let config
  try {
    config = require(Path.resolve(configPath))
  } catch (err) {
    process.stderr.write(`Failed to load config: ${err.message}. (using fail-thru)`)
    config = failThru
  }
  return config
}

/* istanbul ignore next */
if (require.main === module) {
  const args = Minimist(process.argv.slice(2))
  start(parseArgs(args))
} else {
  module.exports = { start, parseArgs }
}
