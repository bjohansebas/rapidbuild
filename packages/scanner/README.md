# @rapidapp/scanner

> A simple scan the technologies used in a TypeScript/JavaScript project

## Install

```sh
npm install ora
```

## Usage


```js
import { generateReport } from '@rapidapp/scanner'
import { scanFolder } from '@rapidapp/scanner/helpers'

const files = await scanFolder(process.cwd())

const report = await generateReport(files)
```

## API

### generateReport(files, config)

#### files

Type: `string[]`

> The files that belong to the project can be obtained using [scanFolder](#scanfolderroot) to get the project files.

#### config (optional)

Type: `object`

Scanned project path

##### config.root

Type: `string`\
Default: `process.cwd()`

##### config.checkContent (optional)

Type: `boolean` (optional)\
Default: `false`

Check the contents of the files to determine each configuration

##### config.checkDependencies (optional)

Type: `boolean` (optional)\
Default: `true`

Check if it is listed as a dependency in the package.json

### scanFolder(root)

#### root

Type: `string`

Path where it will start searching for all files

## CLI

### Installation

```bash
npm i -g rapidapp
```

### Usage

```bash
rapidapp scan <project-directory>
```

### Output

```json
[
  "name": "project-name",
  "packages": [
    {
      "name": "package-name",
      "languages": ["typescript","javascript"],
      "linters": ["eslint"],
      "formatter": ["prettier"]
    }
  ],
  "languages": ["typescript","javascript"],
  "package_manager": "pnpm",
  "linters": ["biome"],
  "formatter": ["biome"]
]
``` 

## License

[Mozilla Public License Version 2.0](https://github.com/bjohansebas/rapidapp/blob/main/LICENSE)