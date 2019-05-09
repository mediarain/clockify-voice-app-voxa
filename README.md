# Clockify Logger Voice App

### Development Setup

* `git clone` this repository
* Install and use Node v8.10
* Run `yarn install`

* Make a copy of the `src/config/local.example.json` file and name it `local.json`
* Edit `src/config/local.json` with all of the required fields.

* Make a copy of the `interaction.example.json` file and name it `interaction.json`
* Edit `interaction.json` with all of the required fields.

* Make a copy of the `aws-config.sample.js` file and name it `aws-config.js`
* Edit `aws-config.js` with all of the required fields.

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

#### How to set it up

To set up this project in a production environment you'll need the following resources:

- An Amazon Alexa Skill
- An AWS Lambda function
- An Account Linking Web application

### Amazon Alexa Skill

1. Sign in with your [Amazon Developer Portal account](https://developer.amazon.com/alexa/console/ask). If you don't have one, you can click on the Sign up button from the same link to create one.

2. Click on the Create Skill button
![Screen Shot 2019-05-09 at 4 20 48 PM](https://user-images.githubusercontent.com/12286824/57490335-22f99480-7276-11e9-886e-8783fd3cb33a.png)

3. Give the skill a name and keep the option **Custom** selected. Then click on the **Create skill** button
![Screen Shot 2019-05-09 at 4 20 48 PM](https://user-images.githubusercontent.com/12286824/57490454-8c79a300-7276-11e9-840a-dce27aaa0fff.png)

4. Leave the **Start from scratch** option selected and click on the **Choose** button
![Screen Shot 2019-05-09 at 4 22 57 PM](https://user-images.githubusercontent.com/12286824/57490509-bcc14180-7276-11e9-980e-927f7339ff78.png)

5. Your skill has been successfully created!
![Screen Shot 2019-05-09 at 4 24 27 PM](https://user-images.githubusercontent.com/12286824/57490592-f5611b00-7276-11e9-9c3c-b8da44a02655.png)

Now we need to modify the interaction model.

6. In this project, copy the content from this file: **speech-assets/alexa/en-US/production-interaction.json**. Then go to the JSON Editor menu in the developer portal and paste the content. It should look like the image below. Then click on the **Save Model** button. You can modify the invocation name to whatever you want, in this example, we chose **office tracker** as we found it was hard for Alexa to recognize the word `clockify`.

![Screen Shot 2019-05-09 at 4 27 05 PM](https://user-images.githubusercontent.com/12286824/57490704-51c43a80-7277-11e9-9564-c7fff72d8f60.png)

Then click on the **Build Model** button, it will last less than a minute to be updated. You can also go to the **Distribution** tab and modify the skill's metadata with important fields like the short and long description, example phrases, keywords or privacy policy. You can leave them in blank while you use the skill in development mode.
![Screen Shot 2019-05-09 at 4 29 41 PM](https://user-images.githubusercontent.com/12286824/57490796-acf62d00-7277-11e9-829a-fc4dff17a168.png)

There are 2 more steps needed: set the lambda function and set the Account Linking properties, but we'll come back to these steps after we set up those other resources. Don't close this tab as we'll be returning to it in the next steps.


### AWS Lambda function


1. Sign in with your [AWS account](https://console.aws.amazon.com/lambda/home?region=us-east-1) and go to the Lambda menu. If you don't have one, you can click on the Sign up button from the same link to create one.

2. In the lambda menu, click on the **Create function** button
![Screen Shot 2019-05-09 at 4 34 10 PM](https://user-images.githubusercontent.com/12286824/57490969-4d4c5180-7278-11e9-83df-6b84224ec2ab.png)

3. Give the lambda function a name, leave the Runtime option in **Node.js 8.10** and create a new role for the function, it does not need any additional permissions than the one the menu suggests.
![Screen Shot 2019-05-09 at 4 35 41 PM](https://user-images.githubusercontent.com/12286824/57491035-84bafe00-7278-11e9-8325-918b886326f6.png)

4. Click on the **Create function** button
![Screen Shot 2019-05-09 at 4 36 55 PM](https://user-images.githubusercontent.com/12286824/57491091-ad42f800-7278-11e9-9124-36641f271a35.png)

5. The lambda function is created. Now we need to add the Alexa Skills Kit event to it. On the left panel, click on the **Alexa Skills Kit** option, a new text box will show up and you need to enter the Alexa skill's ID in the box.
![Screen Shot 2019-05-09 at 4 39 04 PM](https://user-images.githubusercontent.com/12286824/57492062-9acabd80-727c-11e9-9049-5ae987574994.png)

6. To get this ID, go to your developer portal account, in your skill configuration go to the **Build** tab, on the left panel, click on the **Endpoint** menu. Select AWS Lambda ARN option and the skill ID will appear at the right side:
![Screen Shot 2019-05-09 at 4 42 56 PM](https://user-images.githubusercontent.com/12286824/57491297-8d600400-7279-11e9-8ddc-4a0ee5e866d3.png)

7. Copy the ID, go back to the tab your Lambda function is in, and paste the skill ID into the textbox. Click on the **Add** button. Then click on the button with the name of your lambda function, in our case is **ClockifyTrackerVoiceApp**
![Screen Shot 2019-05-09 at 4 45 25 PM](https://user-images.githubusercontent.com/12286824/57491597-bd5bd700-727a-11e9-8dc0-29338dbee113.png)

8. In the Function code section, in the Handler section, write **src/handler.alexaLambda** as the handler for this function.
![Screen Shot 2019-05-09 at 4 53 04 PM](https://user-images.githubusercontent.com/12286824/57491683-f7c57400-727a-11e9-8b1f-016b53ea92bd.png)

In this step, we need to upload the zip file of the source code. After you have completed the **Development Setup** process at the beginning of this README, you can execute the command **gulp deploy** in your terminal, this will create a zip file in this path **/dist/dist.zip**. If you have set up the AWS-CLI in your computer you would be able to upload the zip from your terminal. In the `aws-config.js` file, you only need to set the properties:
- profile
- functionName
- role

You can get the profile value from your aws-cli configuration. The functionName is the one you created in the AWS account and you can get the role ARN from the [IAM menu](https://console.aws.amazon.com/iam/home?region=us-east-1#/roles)

If you don't have this setup, after the **gulp deploy** finishes, you can get the zip file and upload it manually to the lambda console.

9. Once the upload is done, scroll down to the **Basic settings** section and make sure the Timeout is set to 0min and 10sec as it the max timeout for Alexa.
![Screen Shot 2019-05-09 at 5 01 09 PM](https://user-images.githubusercontent.com/12286824/57491961-2d1e9180-727c-11e9-8f51-754110e55f9b.png)

10. After you complete that, go up and click on the **Save button**. Right above this button, you can see the Lambda's ARN, copy it and go back to the Endpoint menu in the Amazon Developer Portal account
![Screen Shot 2019-05-09 at 5 03 42 PM](https://user-images.githubusercontent.com/12286824/57492092-bafa7c80-727c-11e9-90f2-461066bcc3f0.png)

11. Paste the Lambda's ARN into the **Default Region** textbox and click on the **Save Endpoints** button
![Screen Shot 2019-05-09 at 5 07 25 PM](https://user-images.githubusercontent.com/12286824/57492157-f1d09280-727c-11e9-9201-b0e176ea2394.png)


### Account Linking Web application

This application needs some information from the user: user's email address, password and Clockify's API key. This will allow the skill to connect to user's information in Clockify and be able to log tasks in name of the user.

The full project is in the **web** folder. In the terminal go to this folder and run **npm install** to install all the necessary packages. Upload the project to your node server. If you don't own a server, you can create your project in [Glitch](https://glitch.com/) I have created a project in this [URL](https://glitch.com/edit/#!/lunar-guardian?path=server.js:1:0)

You can even use this same project and simply fill in the Account Linking fields in the Amazon Developer Portal account

1. Go to the **Build** tab and on left side click on the **ACCOUNT LINKING** section. Fill in the fields with this information:

Authorization URI: https://lunar-guardian.glitch.me/
Client ID: alexa
Domain List:
- lunar-guardian.glitch.me
- glitch.me

Click on the **Save** button
![Screen Shot 2019-05-09 at 5 16 23 PM](https://user-images.githubusercontent.com/12286824/57492488-36106280-727e-11e9-9365-d82eaada8434.png)


Now, EVERYTHING IS SETUP !!!

As an extra validation, make sure you have set the skill to Development mode. Go to the **Test** tab and in the dropdown in the top-left of the page, make sure you have selected the **Development** option
![Screen Shot 2019-05-09 at 5 17 09 PM](https://user-images.githubusercontent.com/12286824/57492561-77a10d80-727e-11e9-9504-4b971e03fdd2.png)

You can now go to the Alexa app in your phone or the web version in this [link](https://alexa.amazon.com/spa/index.html#skills/your-skills/?ref-suffix=ysa_gw). This will take you to the **Your Skills** section and you can look for the skill you just created:

![Screen Shot 2019-05-09 at 5 20 05 PM](https://user-images.githubusercontent.com/12286824/57492652-d5cdf080-727e-11e9-84ab-5a1a9e0357f5.png)

Click on it and you will see the metadata you entered in the **Distribution** tab of the Developer Portal account. It's time to link your account, click on the **SETTINGS** button
![Screen Shot 2019-05-09 at 5 20 58 PM](https://user-images.githubusercontent.com/12286824/57492683-fac26380-727e-11e9-95cd-e9b0c601d210.png)

Click on the **Link Account** label, this will take you to your web project's URL:
![Screen Shot 2019-05-09 at 5 22 24 PM](https://user-images.githubusercontent.com/12286824/57492710-16c60500-727f-11e9-8e1d-a7823e338da4.png)
![Screen Shot 2019-05-09 at 5 23 05 PM](https://user-images.githubusercontent.com/12286824/57492724-32311000-727f-11e9-8ffd-1404af6543e3.png)

You will need to enter your credentials as well as your Clockify API key. To do that go to the [**Personal settings**](https://clockify.me/user/settings) menu of your Clockify account. Scroll down to the API key section, copy it, and paste it in the account linking page.

If everything is set up correctly, you will get this screen after you submit the form:
![Screen Shot 2019-05-09 at 5 25 30 PM](https://user-images.githubusercontent.com/12286824/57492794-77554200-727f-11e9-9dab-1d77c4fec499.png)

Now you are able to talk to Alexa like this:

User: Alexa, open office tracker
Alexa: Welcome back to Clockify Tracker! What project would you like to log to? You need to start with the project is: like, the project is internal tasks, or the project is time off.

User: Alexa, log my lunch
Alexa: I just logged all your lunch hours for the week. Anything else?

User: I want to log a task
Alexa: What project would you like to log to? You need to start with the project is: like, the project is internal tasks, or the project is time off

User: The project is internal tasks
Alexa: Internal Tasks. Is this correct?

User: yes
Alexa: What is the task's name? You need to start with the task is: like, the task is internal meetings, or the task is company training, or the task is independent study

User: The task is internal meetings
Alexa: Internal Meetings. Is this correct?

User: yes
Alexa: What's the description for your task? You need to start with description is, like: description is: studying AWS

User: I was creating a tutorial
Alexa: Creating a tutorial. Is this correct?

User: yes
Alexa: How much time are you logging for this task?

User: I lasted 1 hour
Alexa: Ok, just to confirm. I'm going to create the following task: You lasted an hour in: Creating a tutorial, for the task Internal Meetings, in the project Internal Tasks. Is this correct?

User: yes
Alexa: Ok, I just logged this task. Anything else?

User: no
Alexa: Ok. Goodbye!

You can check out your Clockify and verify the entry was logged successfully:
![Screen Shot 2019-05-09 at 5 31 39 PM](https://user-images.githubusercontent.com/12286824/57492986-5f31f280-7280-11e9-91aa-420f33a1c14c.png)

