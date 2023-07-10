#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { CdkStack } from "./main/app/cdk-stack";

const app = new cdk.App();
new CdkStack(app, "CartApiStack", {env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION
}});
