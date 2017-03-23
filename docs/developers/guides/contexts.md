---
title: Contexts
layout: doc_page.html
order: 1
---

# Contexts

The `contexts` define ***where*** and ***when*** can be executed.

Contexts are implements with three files in the recipe:

```
-rwxr-xr-x    1 pisco  staff   contexts/context-name/config.js
-rwxr-xr-x    1 pisco  staff   contexts/context-name/index.js
-rwxr-xr-x    1 pisco  staff   contexts/context-name/info.md
```

Note, it exists a [scaffold generator tool](#scaffold)

## Configuration

The `config.js` file has the definition of the context:

```json
{
  "name": "context-name",
  "description": "A description of context-name"
}
```

The contexts are described by two fields:

- `name`: short name of the context, it must be a descriptive and unique.
- `description`: is a short description about the context.

## Implementation

The `index.js` file implements a `checks` function which defines the context. Please, replace it with the following content:

```javascript
'use strict';
const path = require('path');
const process = require('process');

const _isWorldFolder = function() {
  let dir = process.cwd().split(path.sep);

  return dir[dir.length - 1] === 'world';
};

module.exports = {
  check() {
    return _isWorldFolder();
  }
};
```

## Documentation

The `info.md` file just explain the context with a markdown format:


```markdown
# Context context-name

The description about the context.
```

## <a name="scaffold"></a>Scaffold generator

Pisco provides a scaffold generator. Launch it placed inside your recipe with:

```sh
$ cd your-recipe
$ pisco recipe:add-context
```
