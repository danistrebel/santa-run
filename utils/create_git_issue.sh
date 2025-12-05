#!/bin/bash

set -e

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

## Create Backlog Issue
ISSUE_TITLE="Feature: Containerization"
ISSUE_BODY=$(cat << 'EOF'
## TL;DR 
Make sure this application can be containerized by creating a Dockerfile for it.

## Description 

To improve portability, simplify deployment, and ensure environment consistency across development, testing, and production, we need to containerize this application using Docker.

This involves creating a robust and efficient Dockerfile in the root of the repository.

## Acceptance Criteria

* A functional Dockerfile exists in the repository root.

* The Dockerfile is optimized (e.g., uses multi-stage builds if appropriate, includes only necessary files).

* The Docker image successfully builds without errors (docker build . -t ).

* The container starts and the application runs correctly within the container (docker run ).

## Tasks 

* [ ] Analyze the application's dependencies and build process.

* [ ] Create the initial Dockerfile.

* [ ] Test the Docker build and ensure the image is as small as possible.

* [ ] Verify the application runs successfully inside the container.

* [ ] Update relevant documentation with Docker build/run instructions.
EOF
)

ISSUE_PAYLOAD=$(jq -n \
                   --arg title "$ISSUE_TITLE" \
                   --arg body "$ISSUE_BODY"  \
                   '{title: $title, body: $body}')

# Use the GitHub API to create the issue
curl -H "Authorization: token $GITHUB_TOKEN" \
     -H "Accept: application/vnd.github+json" \
     -X POST \
     -d "$ISSUE_PAYLOAD" \
     "https://api.github.com/repos/$GITHUB_ORG/$GITHUB_REPO/issues"

if [ $? -eq 0 ]; then
  echo "Backlog issue created successfully."
else
  echo "Error: Failed to create GitHub issue."
  echo "Please check your GITHUB_TOKEN, GITHUB_ORG, and network connectivity."
fi
