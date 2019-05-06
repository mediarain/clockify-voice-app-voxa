# Clockify Logger Voice App

### Development Setup

* `git clone` this repository
* Install and use Node v8.10
* Run `yarn install`

* Make a copy of the `src/config/local.example.json` file and name it `local.json`
* Edit `src/config/local.json` with all of the required fields.

* Make a copy of the `interaction.example.json` file and name it `interaction.json`
* Edit `interaction.json` with all of the required fields.

`yarn watch` will start the server and watch for changes.

### Directory Structure

    `src/` -> Amazon Echo Skill login, the state machine and flow
    `speech-assets/` -> Amazon Echo Utterances, Intent Schema and Custom Slots.
    `test/` -> Unit Tests
    `.editorconfig` -> IDE configuration
    `gulpfile.js` -> Some automated tasks
    `interaction.example.json` -> Interaction file to work with voxa-cli
    `package.json` -> Dependencies
    `README.md`
    `server.js` -> Development server
    `tsconfig.json` -> Eslint configuration
    `tslint.json` -> Eslint rules

#### CanFulfillIntentRequest Testing

In the `test` folder you will find a subfolder called `canFulfillIntentRequest` with 3 different type of testings for this feature. You can run these tests using the `ask cli` with the following commands:

```
ask api invoke-skill --skill-id [skill-id] --endpoint-region default --file tests/canFulfillIntentRequest/rightIntentRightSlotValue.json

ask api invoke-skill --skill-id [skill-id] --endpoint-region default --file tests/canFulfillIntentRequest/rightIntentWrongSlotValue.json

ask api invoke-skill --skill-id [skill-id] --endpoint-region default --file tests/canFulfillIntentRequest/wrongIntent.json
```

#### External resources

- [Account Linking project](https://glitch.com/~lunar-guardian)
- [Publishing information sheet](https://docs.google.com/spreadsheets/d/1arE9FswRHCvfnMvK6qcyUF_VytEYIrN-w0w7n0OXra8/edit#gid=1739144044)
- [VUI sheet](https://docs.google.com/spreadsheets/d/1_y2ayLe9sj6_MGNDCIhG765WCiEdNMQjiv4SIMqr-CM/edit#gid=1731787678)
