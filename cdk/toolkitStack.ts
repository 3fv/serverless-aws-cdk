import Serverless = require('serverless');

import { bootstrapEnvironment, ToolkitInfo } from 'aws-cdk';
import { AwsCdkDeploy } from '../deploy'
import { getEnvironment } from './environment'

function getToolkitStackName(serverless: Serverless) {
  // DEFAULT_TOOLKIT_STACK_NAME from aws-cdk/deployment-target
  const DEFAULT_TOOLKIT_STACK_NAME = 'CDKToolkit';
  return serverless.service.provider.toolkitStackName || DEFAULT_TOOLKIT_STACK_NAME;
}

export async function bootstrapToolkitStack(this: AwsCdkDeploy) {
  const environment = await getEnvironment(this.provider);
  const toolkitStackName = getToolkitStackName(this.serverless);
  const roleArn = this.provider.getCfnRoleArn();
  await bootstrapEnvironment(environment, await this.provider.getSdkProvider(), { toolkitStackName, roleArn, parameters: { bucketName: this.provider.getDeploymentBucketName() } });
}

export async function getToolkitInfo(this: AwsCdkDeploy): Promise<ToolkitInfo> {
  const environment = await this.provider.getEnvironment();
  const toolkitStackName = getToolkitStackName(this.serverless);
  const toolkitInfo = await ToolkitInfo.lookup(environment, await this.provider.getSdk(), toolkitStackName);
  return toolkitInfo!;
}
