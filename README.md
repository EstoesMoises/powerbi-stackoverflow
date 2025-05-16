# Stack Overflow-Driven Power BI Dashboard

This repository contains everything you need to create a Power BI dashboard powered by the Stack Overflow API, using an Automation Job, a dataset, and a Node.js application.

**Power BI** is an interactive data visualization platform by Microsoft. While Stack Overflow offers a RESTful JSON API, Power BI doesn’t natively support direct API connections. To bridge this gap, we'll use an **Automation Job** to pull data from the Stack Overflow API into a database, and then build the Power BI dashboard on top of that dataset.

> 📖 **Step-by-step instructions for connecting your Stack Overflow instance to Power BI are available in the following Support articles:**
>
> * [For Stack Overflow Enterprise](https://stackoverflowteams.help/en/articles/9722233-create-a-power-bi-dashboard-with-the-stack-overflow-api)
> * [For Stack Overflow Basic & Business](https://stackoverflowteams.help/en/articles/6846248-create-a-power-bi-dashboard-with-the-stack-overflow-api)

---

## 🚀 Quick Summary (TL;DR)

You’ll set up a cron expression in a Node.js application to periodically pull data from the Stack Overflow API and push it to your data source. This is handled by an **Automation Job** executing the script on a schedule.

---

## 📦 Environment Setup

### For Enterprise Instances

Use the provided `.env.template` file and configure the following variables:

```env
API_KEY=YourAPIAccessKey        # See https://yourinstance.stackenterprise.co/api/docs/authentication
BASE_URL=https://yourinstance.stackenterprise.co
API_ROUTE=api/2.3/questions/unanswered
FILENAME=APIDashboardData.json
```

---

### For Basic & Business Instances

Use the `.env.template` file and configure these variables:

```env
API_TOKEN=YourPersonalAccessToken
BASE_URL=https://api.stackoverflowteams.com
API_ROUTE=/2.3/questions/unanswered
FILENAME=APIDashboardData.json
TEAM=YourTeamSlug
```

---

## 📌 Project Origin

This project was originally created by **Hannah Schepers** and is now actively maintained by **Moisés (EstoesMoises)**.
