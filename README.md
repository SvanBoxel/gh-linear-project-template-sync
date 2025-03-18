# GitHub Linear Sync

This action synchronizes GitHub issues with a Linear project template based on a provided template.

## Inputs 
### `project_folder` (Required)
The folder path where the Linear project template is stored. 

#### Project folder structure
This folder should contain `project-template.md` and optionally an `./issues` directory with issue templates. Issue templates are ordered by filename in the template.

```
.
├── project-template.md
└── issues
    ├── 01-feature-request.md
    └── 02-bug-report.md
```

#### File structure example
`project-template.md` and related issue templates support a header for metadata. Example

`./project-template.md` supported metadata: `name`, `title`.

Example:

```
---
name: Onboarding template
title: Onboarding project for new team members
---

Welcome to the team! 🎉 This project outlines all the tasks you need to complete in the first 90 days. 
```

`./issues/01-first-day.md` supported metadata: `title`, `labels`.

Example:
```
---
name: Your first day
labels: onboarding, week 1
---

It's your first day! Make sure to complete the following tasks:

- Complete your profile
- Set up your laptop with IT
```

> [!IMPORTANT]  
> Labels need to exist in your linear team before use

### `LINEAR_TOKEN` (Required)
The [Linear API key](https://linear.app/docs/api-and-webhooks#api) used for authentication.

### `LINEAR_TEAM_ID` (Required)
The Linear team ID to which the project template belongs.

> [!TIP]  
> To get the team ID select the team in linear and hit CMD+k or CTRL+k it will open the dialogue and type Copy model UUID and select.

### `LINEAR_TEMPLATE_ID` (Required)
The Linear template ID of the project template.

> [!TIP]  
> To get the Template ID select the project template in linear and hit CMD+k or CTRL+k it will open the dialogue and type Copy model UUID and select your template.

> [!IMPORTANT]  
> Project needs to be created in Linear before running this action. This action will populate the project template with the data from the project folder.

## Example GitHub Actions Workflow

Here is an example GitHub Actions workflow that you can use to run the GitHub Linear Sync action:

```yaml
name: Sync GitHub to Linear Project template

on:
  push:
    branches:
      - main
  schedule:
    - cron: '0 0 * * *'  # Run every day at midnight

jobs:
  sync:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v3
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16'
      - name: Run the sync action
        input:
          linear_token: ${{ secrets.LINEAR_TOKEN }}
          linear_team_id: 12345678-1234-1234-1234-123456789abc
          linear_template_id: 12345678-1234-1234-1234-123456789abc
          project_folder: "./linear-template"
        run: npm run dev
```

This workflow will run the sync action on every push to the `main` branch and also on a daily schedule at midnight. Make sure to set the required environment variables in your GitHub repository secrets.

## Running Locally

To run the project locally, follow these steps:

1. **Set Environment Variables**: You can set the environment variables in a `.env` file at the root of the project. Create a `.env` file and add the following lines:

   ```plaintext
   LINEAR_TOKEN=your_linear_token
   LINEAR_TEAM_ID=your_linear_team_id
   LINEAR_TEMPLATE_ID=your_linear_template_id
   GITHUB_TOKEN=your_github_token
   ```

Make sure to replace `your_linear_token`, `your_linear_team_id`, and `your_linear_template_id` with your actual Linear API key, team ID, and template ID.

2. **Install Dependencies**: Ensure you have Node.js installed on your machine. Run the following command to install the project dependencies:

```sh
npm install
```

3. **Run the app**: You can run the it using the following command:

```sh
npm run dev
```

This command will execute the `index.js` file, which should handle the synchronization process with the Linear project template.

4. **Linting**: To lint the code and fix any issues, use the following command:

```sh
npm run lint
```

This command will run the linter and automatically fix any fixable issues.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your changes.