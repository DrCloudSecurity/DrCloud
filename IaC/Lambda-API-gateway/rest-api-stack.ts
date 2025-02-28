// api stack

import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { join } from 'path';
import { RestApi } from 'aws-cdk-lib/aws-apigateway';

export class TsRestApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const emplLambda = new NodejsFunction(this, 'TS-EmplLambda', {
      runtime: Runtime.NODEJS_18_X,
      handler: 'handler',
      entry: (join(__dirname, '..', 'services', 'handler.ts')),
    })

// api gw
    const api = new RestApi(this, 'TS-EmplApi');
    const emplResource = api.root.addResource('empl', optionsWithCors);

// supported methods: get, post
    const emplLambdaIntegration = new LambdaIntegration(emplLambda);
    emplResource.addMethod('GET', emplLambdaIntegration);
    emplResource.addMethod('POST', emplLambdaIntegration);

  }
}