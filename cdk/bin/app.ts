#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { EcsFargateStack } from "../lib/stack";

const app = new cdk.App();

const commonProps = {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: "ap-northeast-1" },
};

const envName = app.node.tryGetContext("env") ?? "development";
const acmCertArn = app.node.tryGetContext("acmCertArn") as string;
if (!acmCertArn) throw new Error("Context 'acmCertArn' is required. Pass via -c acmCertArn=<ARN>");

const configs: Record<string, Partial<ConstructorParameters<typeof EcsFargateStack>[2]>> = {
  production:   { natCount: 2, minTasks: 2, maxTasks: 10, logRetention: 90,  dbMinAcu: 1,   dbMaxAcu: 8  },
  staging:      { natCount: 1, minTasks: 2, maxTasks: 4,  logRetention: 30,  dbMinAcu: 0.5, dbMaxAcu: 4  },
  development:  { natCount: 1, minTasks: 1, maxTasks: 2,  logRetention: 14,  dbMinAcu: 0.5, dbMaxAcu: 2  },
};

new EcsFargateStack(app, `EcsFargate-${envName}`, {
  ...commonProps,
  envName,
  acmCertArn,
  ...(configs[envName] ?? configs.development),
  tags: { Project: "prj", Environment: envName, ManagedBy: "CDK" },
});