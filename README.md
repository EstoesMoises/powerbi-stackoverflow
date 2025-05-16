# StackOverflow driven Power BI Dashboard
This repo contains the code needed to create a StackOverflow driven Power BI Dashboard with the StackOverflow API, Automation Job, Dataset and Node.js. 

Power BI is an interactive data visualization software product developed by Microsoft. StackOverflow offers a REST/JSON API, but Power BI doesn’t provide the option to connect directly to an API yet. Instead of hitting the API directly, we will use an Automation Job to pull the data from the StackOverflow API into a database and then built the Power BI dashboard from that.

**You can find step-by-step instruction on how to connect your [Stack Overflow Enterprise instance](https://support.stackenterprise.co/support/solutions/articles/22000277504-create-a-power-bi-dashboard-with-the-stack-overflow-api) or Stackoverflow Team (Basic & Business) to PowerBI in the linked Support articles** 

**Tl;dr - Build a cron expression in a nodeJs application to pull the data from the Stack Overflow API and push it into your data source. We will be using the automation job executing this script.**

## Enterprise 
Please use the .env.template file and fill out the following variables: 

API_KEY= YourAPIAcessKEY (see https://***yourinstance***.stackenterprise.co/api/docs/authentication)

BASE_URL= https://***yourinstance***.stackenterprise.co

API_ROUTE= api/2.3/questions/unanswered

FILENAME=APIDashboardData.json

## Basic & Business
Please use the .env.template file and fill out the following variables: 

API_TOKEN= [PAT]

BASE_URL= https://api.stackoverflowteams.com

API_ROUTE=/2.3/questions/unanswered

FILENAME=APIDashboardData.json

TEAM= [team_slug]

