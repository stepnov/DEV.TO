# DEV.TO - template backend,

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Cookbook](#cookbook)
  - [Emails](#emails)
  - [Roles](#roles)
    - [Check multiple roles](#check-multiple-roles)

## Installation
Install dependencies

```bash
yarn install
```

Copy `.env` file as a new `.env.local`. Edit database credentials and anything you need in `.env.local` file. This file is ignored by git, and won't be uploaded anywhere.

## Usage

Start local development with command below:

```bash
yarn dev
```

To run your code on production server, run several commands:
```bash
# Compile TS code
yarn build

# Run compiled code in production mode
NODE_ENV=production yarn start
```

Additional commands:
| Command | Description |
| - | - |
| yarn build | Compile typescript files into `dist` folder |
| yarn start | Run compiled code from `dist` folder |
| yarn db:create | Create database |
| yarn db:drop | Drop database schema  |

## Cookbook

### Emails

All emails are stored as [mjml](https://mjml.io/) templates in `src/email/templates` folder, which lets you create beautiful responsive email templates.
Make sure to install mjml extension for your IDE to preview template aas you edit it:
 - [JetBrains](https://plugins.jetbrains.com/plugin/16418-mjml-support)
 - [Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=mjmlio.vscode-mjml)

On top of mjml, there is a [handlebars](https://handlebarsjs.com/) template engine, so you can use `{{  }}` in your emails for dynamic data.

To send an email, use `sendMail` function from `src/email/index.ts` file. For example
```javascript
import { sendMail } from 'src/email';

await sendEmail(
    // use template from src/email/templates/coolDogs.mjml file
    'coolDogs',

    // email recipient data
    {
        to: 'john@wick.com',
        subject: 'Dogs for adoption',
    },

    // dynamic data passed into email template using handlebars
    {
        name: 'John Wick',
        dogsYouMayLike: [{ name: '', breed: '' }],
    }
);
```

### Roles

Role consists of several fields:
- code - Unique string value to identify role in backend logic
- name - Role name, as displayed in frontend
- description - Role description, used as a helper text in frontend

Role code restrictions:
- Must be unique
- Must use [CamelCase](https://en.wikipedia.org/wiki/Camel_case). For example: `Admin`, `ArticleEditor`, `ArticlePublisher`
- Role code cannot start with number
- Role code name can contain only letters (a-z, A-Z) and numbers (0-9)

To manually check if user has specific role, use `UserRepository.hasRole(userId, roleCode)` method.

If you want to make specific route restricted, add `schema.security` and `preHandler` options, for example:
```javascript
app.get('my-route', {
    // each role has `verify<Role Code>` method that can be used in pre-handler
    preHandler: app.auth([app.verifyAdmin]),
    schema: {
        // Notify swagger that route has restricted access
        security: [{
            bearerAuth: [],
        }],
    }
}, (req, reply) => { /* route handler */ });
```

#### Check multiple roles
By default `auth` method requires only one successful role check. If you need to make all checks mandatory, use `relation: 'and'` property:

```javascript
app.get('my-route', {
    // check if user is either Admin OR Moderator
    preHandler: app.auth([app.verifyAdmin, app.verifyModerator]),

    // check if user is Editor AND Moderator at the same time
    preHandler: app.auth([app.verifyEditor, app.verifyModerator], { relation: 'and' }),
})
```
