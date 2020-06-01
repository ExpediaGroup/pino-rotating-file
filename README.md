# @vrbo/pino-rotating-file
[![NPM Version](https://img.shields.io/npm/v/@vrbo/pino-rotating-file.svg?style=flat-square)](https://www.npmjs.com/package/@vrbo/pino-rotating-file)
![](https://github.com/ExpediaGroup/pino-rotating-file/workflows/Node_CI/badge.svg)
[![Dependency Status](https://david-dm.org/expediagroup/pino-rotating-file.svg?theme=shields.io)](https://david-dm.org/expediagroup/pino-rotating-file)
[![NPM Downloads](https://img.shields.io/npm/dm/@vrbo/pino-rotating-file.svg?style=flat-square)](https://npm-stat.com/charts.html?package=@vrbo/pino-rotating-file)

*   [Introduction](#introduction)
*   [Usage](#usage)
*   [Development](#development)
*   [Further Reading](#further-reading)

## Introduction
A [pino](https://getpino.io/) transport for filtering log entries and writing them to a file that automatically rotates.  Log entries that are not filtered continue out of stdout.

This is useful for logging when you want different entries in different rotating files. Using rotating files allows you to roll logs across multiple files so that individual file sizes don't grow too large and old files get deleted.

At its core, this processor takes a simple config js file that contains an output path and additional options for the rotation. Under the hood, it uses the [rotating-file-stream](https://www.npmjs.com/package/rotating-file-stream) - check out the [options](https://www.npmjs.com/package/rotating-file-stream#options-object). It also has a filter function to determine if the log entry should go to the log file, or be forwarded through to stdout.

## Usage

Install this module as a dependency in your project with ```npm install @vrbo/pino-rotating-file```

After this, you can reference it as ```rotate-logs``` in your npm scripts in your package.json file when running your main application, like this:

### package.json
```json
...
"scripts": {
  "start": "node ./index.js | rotate-logs --config=.request-log.js"
}
...
```

### Example config file `.request-log.js`

```javascript
module.exports = {
  filter(data) {return !!data.req},
  output: {
    path: "request.log", // name of file
    options: {
      path: "logs/", // path to write files to
      size: "10M", // max file size
      rotate: 5 // keep 5 rotated logs
    }
  }
}
```

> If no `--config` flag is given, it will look for the file `.rotate.js` by default

### Multiple log files

You can chain all these together to split your logs into separate, automatically rotating log files:

### package.json
```json
...
"scripts": {
  "start": "node ./index.js | rotate-logs --config=.request-log.js | rotate-logs --config=.error-log.js | rotate-logs --config=.server-log.js"
}
...
```

Where `.request-log.js` pulls all the logs that have `req` tags, `.error-log.js` pulls all the logs with `error` tags, and `.server-log.js` puts all the rest into another file.

> NOTE: if the config provided does not exist or fails to load, then all logs will be passed to stdout.

### File rotation _only_

To disable formatting logs into JSON and take advantage of file rotation only, simply add `isJson: false` to the `output` object in your configuration file:

```javascript
module.exports = {
  filter(data) {return !!data.req},
  output: {
    path: "request.log",
    isJson: false // JSON formatting will be disabled,
    options: {
      // Options configured here are passed along to rotating-file-stream.
      // See the Introduction of this README for a link to valid options.
      ... 
    }
  }
}
```

## Further Reading

*   [License](LICENSE)
*   [Code of conduct](CODE_OF_CONDUCT.md)
*   [Contributing](CONTRIBUTING.md)
*   [Changelog](CHANGELOG.md)
