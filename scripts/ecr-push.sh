#!/bin/sh
AWS_ACCOUNT_ID=$(aws configure get account_id --profile mgritts)
AWS_REGION=$(aws configure get region --profile mgritts)
APP_VERSION=$(jq '.version' package.json | tr -d '\"')

# Authenticate to AWS ECR
aws ecr get-login-password --region $AWS_REGION |\
  docker login --username AWS \
  --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com

# push to AWS ECR
docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/huntnv-api:latest
docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/huntnv-api:$APP_VERSION
