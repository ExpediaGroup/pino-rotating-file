# [4.4.0](https://github.com/expediagroup/pino-rotating-file/compare/v4.3.2...v4.4.0) (2023-02-27)


### Features

* Updating some dependencies ([#57](https://github.com/expediagroup/pino-rotating-file/issues/57)) ([82419a1](https://github.com/expediagroup/pino-rotating-file/commit/82419a1f1f4d981d8597ea316063cd4589d5947c))

## [4.3.2](https://github.com/expediagroup/pino-rotating-file/compare/v4.3.1...v4.3.2) (2023-02-16)


### Bug Fixes

* Altering the order of semantic release config file to have it correct ([#56](https://github.com/expediagroup/pino-rotating-file/issues/56)) ([d4baf4e](https://github.com/expediagroup/pino-rotating-file/commit/d4baf4e628b4c9aaffeedb73abaeaf378526f2da))

## [4.3.1](https://github.com/expediagroup/pino-rotating-file/compare/v4.3.0...v4.3.1) (2023-01-09)


### Bug Fixes

* bump json5 from 1.0.1 to 1.0.2 ([#49](https://github.com/expediagroup/pino-rotating-file/issues/49)) ([90a6333](https://github.com/expediagroup/pino-rotating-file/commit/90a6333324185154bc10d569954f7988091584db))

# [4.3.0](https://github.com/expediagroup/pino-rotating-file/compare/v4.2.0...v4.3.0) (2022-12-07)


### Features

* Upgrade to node v16 ([#48](https://github.com/expediagroup/pino-rotating-file/issues/48)) ([95de84d](https://github.com/expediagroup/pino-rotating-file/commit/95de84d9c340d829f94ff8e6d9e1ebf1d115ac10))

# [4.2.0](https://github.com/expediagroup/pino-rotating-file/compare/v4.1.0...v4.2.0) (2022-12-06)


### Features

* empty commit to trigger release pipeline ([#47](https://github.com/expediagroup/pino-rotating-file/issues/47)) ([3c1b3af](https://github.com/expediagroup/pino-rotating-file/commit/3c1b3afee9d55dc8147713b11112bdef21d26e32))

# [4.1.0](https://github.com/expediagroup/pino-rotating-file/compare/v4.0.0...v4.1.0) (2022-01-06)

### Features

* **semantic-release:** modify the semantic release config ([#42](https://github.com/expediagroup/pino-rotating-file/issues/42)) ([1658957](https://github.com/expediagroup/pino-rotating-file/commit/1658957d21d4d03ac30c8ef996a9b930dfdcb3e0))

### [4.0.0] Breaking change

- [Breaking] Drop support for node < 12.
- Update Github test workflow to only test againt node v 14.x
- Update dependencies, npm, and engines in package.json to support node version >= 14.

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
