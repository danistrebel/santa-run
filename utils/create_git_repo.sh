#!/bin/bash

set -e

ORIGINAL_DIR="$(pwd)"
SCRIPT_DIR=$(dirname "$(readlink -f "$0")")

## Use either ORG OR USER
if [[ -z "$GITHUB_ORG" ]]; then
  echo "Error: GITHUB_ORG environment variable is not set."
  exit 1
fi

if [[ -z "$GITHUB_TOKEN" ]]; then
  echo "Error: GITHUB_TOKEN environment variable is not set."
  exit 1
fi

if [[ -z "$GITHUB_REPO" ]]; then
  echo "Error: GITHUB_REPO environment variable is not set."
  exit 1
fi

if [[ -z "$GEMINI_API_KEY" ]]; then
  echo "Warning: GEMINI_API_KEY environment variable is not set. The secret will not be added to the repo."
  # Do not exit, allow repo creation to continue
fi

# Check if repo exists and ask for deletion
REPO_EXISTS=$(curl -s -o /dev/null -w "%{http_code}" -H "Authorization: token $GITHUB_TOKEN" "https://api.github.com/repos/$GITHUB_ORG/$GITHUB_REPO")

if [ "$REPO_EXISTS" == "200" ]; then
    read -p "Repository '$GITHUB_REPO' already exists. Do you want to delete it and recreate it? (y/N) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "Deleting repository..."
        DELETE_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X DELETE -H "Authorization: token $GITHUB_TOKEN" "https://api.github.com/repos/$GITHUB_ORG/$GITHUB_REPO")
        if [ "$DELETE_STATUS" -eq 204 ]; then
            echo "Repository deleted successfully."
            # Give GitHub a moment to process the deletion
            sleep 3
        else
            echo "Failed to delete repository. GitHub API responded with status $DELETE_STATUS."
            exit 1
        fi
    else
        echo "Aborting. Repository already exists."
        exit 1
    fi
fi

echo "Creating repository https://github.com/$GITHUB_ORG/$GITHUB_REPO"

# Create the repo
curl -H "Authorization: token $GITHUB_TOKEN" \
  -X POST \
  -d "{\"name\":\"$GITHUB_REPO\", \"private\": false}" \
  "https://api.github.com/user/repos" || { echo "Failed to create GitHub repo $GITHUB_REPO"; exit 1; }

# Add a remote for the new repo
if git remote | grep -q "github-demo"; then
    git remote rm github-demo
fi

git remote add github-demo "git@github.com:$GITHUB_ORG/$GITHUB_REPO.git"
git push -u github-demo
git branch --set-upstream-to=github-demo/main
echo "Repository $GITHUB_REPO created and remote 'github-demo' added."

# Add GEMINI_API_KEY secret
if [[ -n "$GEMINI_API_KEY" ]]; then
  if ! command -v gh &> /dev/null; then
    echo "Warning: 'gh' command not found. Cannot add GEMINI_API_KEY secret."
    echo "Please add it manually: https://github.com/$GITHUB_ORG/$GITHUB_REPO/settings/secrets/actions/new"
  else
    echo "Adding GEMINI_API_KEY secret to the repository..."
    echo "$GEMINI_API_KEY" | gh secret set GEMINI_API_KEY -R "$GITHUB_ORG/$GITHUB_REPO" --body - > /dev/null
    if [ $? -eq 0 ]; then
      echo "Secret GEMINI_API_KEY added successfully."
    else
      echo "Failed to add GEMINI_API_KEY secret."
    fi
  fi
fi

# Add GEMINI_CLI_VERSION variable
echo "Adding GEMINI_CLI_VERSION variable to the repository..."
curl -s -X POST \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: token $GITHUB_TOKEN" \
  "https://api.github.com/repos/$GITHUB_ORG/$GITHUB_REPO/actions/variables" \
  -d '{"name":"GEMINI_CLI_VERSION","value":"v0.10.0"}' > /dev/null
echo "Variable GEMINI_CLI_VERSION added."

cd "$ORIGINAL_DIR"
