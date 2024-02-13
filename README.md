# github-report README

This project generates a report of a Github Repo PR's activity in the last 7 days by default.
It generates an HTML report of the in-progress, closed and created PR's.
The report can be sent to an email address, or if running locally visualize as an .html file.

## Configuration.

You need to pass some env variables in order to configure and run this tool.
there is .env.example file you can use as a template.

### Mandatory parameters:

**ghOrganization**: Organization owner of the repository.
**ghRepository**: Name you the repo you want to report.

**emailFrom**: Sender address of the email.
**emailTo**: Receiver address of the email.

### Optional parameters:

**reportDays**: Number of past days to generate the report, by default set to 7.

**emailUser**: Email user for authentication.
**emailPass**: Email Password for authentication.
**emailSMTPserver**: Emailt SMTP host.

**gh_token**: This is a GitHub API token needed to read a private repos or if you reach the API requests limit.

**htmlFile**: filename to save the html report locally.

## How to run this tool

### Local execution
This tool can be executed locally, you need node version 18.
Configure your `.env` file or export the requires configuration variables.
```
npm install

source .env

nodejs reporter.mjs
```

### Containerized
This tool includes dockerfile and docker-compose file for running this tool on container.
Configure your parameters in `.env` file
```
docker-compose up --build
```

### AWS Lambda
This tool is configured in modules and can be invoked in an AWS environment.

## How to run periodically.

### Running on AWS Lambda Schedule:
If you have deployed this tool as a lambda. You can use EventBridge rules to schedule the lambda execution.
Included with this tool there is a `serverless.yml` file that allows you to deploy using the serverless framework. You can configure and deploy it to aws lambda.
```
serverless deploy
```

### Running on AWS ECS environment:
You can use Amazon EventBridge Scheduler or Amazon EventBridge with rules to schedule your Amazon ECS tasks.
In this case you have to create the ECS cluster, task-definition and required permissions to execute the task. And then configure Eventbridge rules to run your task an periodic basis.
