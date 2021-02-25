### [3.0.0](https://github.com/expediagroup/pino-rotating-file/compare/v2.0.2...v3.0.0) (2021-02-25)

- [Breaking] Enable raw output for file-rotation-only cases. ([#28](https://github.com/ExpediaGroup/pino-rotating-file/pull/28)) ([15a1e1b](https://github.com/ExpediaGroup/pino-rotating-file/commit/2dbf9f0847d1a14de876dec2d64d4a7e115a1e1b))
- Output is no longer run though `JSON.stringify` if the `isJson` option is `false`. This affects output in the following way:

Previously, when logging entries run through `pino-pretty`, the output is wrapped in double-quotes on each line:
```
"[2021-02-23 22:10:29.888 +0000] INFO (myLabel): my log {"
"    req: {"
"        url: '/'"
"    }"
"[2021-02-23 22:10:29.999 +0000] ERROR (myLabel): TypeError: my error log"
"    at line 42"
...
```
Which would then require additional configurations for Splunk indexers to correctly parse the log.

Preferably in this case, it would just log the output as-is, without calling `JSON.stringify()` on it, like it is now.

These changes wrap the call to the output stream in a similar check for `isJson === false` that is happening in other use-cases, so that the raw `data` value will get passed directly to the destination stream, rather than first calling `${JSON.stringify(data)}\n`.

## [2.0.2](https://github.com/expediagroup/pino-rotating-file/compare/v2.0.1...v2.0.2) (2020-08-19)


### Bug Fixes

* **release workflow:** Update release.yml ([#24](https://github.com/expediagroup/pino-rotating-file/issues/24)) ([1951803](https://github.com/expediagroup/pino-rotating-file/commit/1951803758ec06624e7f1125230c7588c49e31e6))

## [2.0.1](https://github.com/expediagroup/pino-rotating-file/compare/v2.0.0...v2.0.1) (2020-08-19)


### Bug Fixes

* **release workflow:** Update release.yml ([#23](https://github.com/expediagroup/pino-rotating-file/issues/23)) ([326635b](https://github.com/expediagroup/pino-rotating-file/commit/326635b00615e2740563fc015949e9d604389dd4))

### [2.0.0](https://github.com/expediagroup/pino-rotating-file/compare/v1.1.1...v2.0.0) (2020-08-10)

- [Breaking] Drop support for node < 12.
- Update Github test workflow to only test againt node v 12.x
- Update dependencies, npm, and engines in package.json to support node version >= 12.

## [1.1.1](https://github.com/expediagroup/pino-rotating-file/compare/v1.1.0...v1.1.1) (2020-07-28)

### Bug Fixes

* **deps:** Upgrade to rotating-file-stream 2.1.3 ([#21](https://github.com/expediagroup/pino-rotating-file/issues/21)) ([bb0c149](https://github.com/expediagroup/pino-rotating-file/commit/bb0c1492e79812d5003f69aa01e963288ff49e23))
