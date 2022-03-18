#!/bin/sh
AWS_ACCOUNT_ID=$(aws configure get account_id --profile mgritts)
AWS_REGION=$(aws configure get region --profile mgritts)
APP_VERSION=$(jq '.version' package.json | tr -d '\"')

# tag docker images for AWS ECR
docker tag huntnv-api:latest $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/huntnv-api:latest
docker tag huntnv-api:latest $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/huntnv-api:$APP_VERSION