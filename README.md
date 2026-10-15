# Cloud Agent Demo

A small ASP.NET Core app for demonstrating the GitHub Copilot cloud agent:
describe a change in an issue, review the generated pull request, and ship it
to Azure with GitHub Actions.

The app uses .NET 10 with no external NuGet or frontend dependencies. It includes
a responsive landing page, an interactive API demo, and a health endpoint.

## Run locally

Install the [.NET 10 SDK](https://dotnet.microsoft.com/download/dotnet/10.0), then run:

```bash
dotnet run --project CloudAgentWebApp.csproj --urls http://localhost:5080
```

Open <http://localhost:5080>. Click **Call the API** to display a fresh server
response. You can also visit:

- `/api/demo` — JSON greeting, framework, and UTC timestamp.
- `/health` — returns HTTP 200 and `Healthy` when the app is running.

## Validate and publish

```bash
dotnet restore
dotnet build --configuration Release --no-restore
dotnet format --verify-no-changes --no-restore
dotnet publish --configuration Release --no-build --output ./publish
```

There is no automated test project yet. For a quick smoke test, run the app and use:

```bash
curl --fail http://localhost:5080/
curl --fail http://localhost:5080/api/demo
curl --fail http://localhost:5080/health
```

## Deploy to Azure App Service

The included **Build and deploy to Azure** workflow builds and publishes on pull
requests and pushes to `main`. Deployment is **manual only**, so builds work
without an Azure subscription or credentials.

Before deploying:

1. Create an Azure App Service web app using **Code**, **Linux**, and the
   **.NET 10** runtime. Set its startup command to
   `dotnet CloudAgentWebApp.dll`. Enable **HTTPS Only** in Azure; local development
   uses HTTP. Optionally set the App Service health check path to `/health`.
2. Create a Microsoft Entra application/service principal or user-assigned managed
   identity for GitHub Actions. Grant it **Website Contributor** scoped to the
   target web app.
3. Add a federated identity credential for this repository with:
   - Issuer: `https://token.actions.githubusercontent.com`
   - Subject: `repo:ksamba/cloudagentwebapp:environment:production`
   - Audience: `api://AzureADTokenExchange`
4. In GitHub repository **Settings → Environments**, create `production`.
   Configure required reviewers and restrict deployment branches to `main` if
   desired. The environment name must match the federated credential.
5. Under that environment's **Variables**, set:

   | Variable | Value |
   | --- | --- |
   | `AZURE_CLIENT_ID` | Client ID of the identity |
   | `AZURE_TENANT_ID` | Microsoft Entra tenant ID |
   | `AZURE_SUBSCRIPTION_ID` | Azure subscription ID |
   | `AZURE_WEBAPP_NAME` | Name of the existing App Service web app |

After merging to `main`, open **Actions → Build and deploy to Azure → Run workflow**
and select `main`. Approve the environment deployment if configured. The workflow
builds the selected revision, authenticates using OpenID Connect, and deploys its
published artifact. No publish profile or client secret is needed. Azure
resources are not provisioned by this workflow and may incur charges.

## Demo ideas

- Ask the cloud agent to customize the landing page for your audience.
- Request a new API endpoint and review its implementation in a pull request.
- Merge the change, inspect the Actions build, and manually deploy it to Azure.