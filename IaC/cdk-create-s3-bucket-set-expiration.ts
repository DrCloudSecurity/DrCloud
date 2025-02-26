// create S3 bucket, set expiration time on files

import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { aws_s3, Fn } from 'aws-cdk-lib'

export class TsStarterStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

// create bucket, set expiration
    new aws_s3.Bucket(this, 'NewBucket', {
//      bucketName: `logging-bucket-${suffix}`,
      lifecycleRules: [
        {
          expiration: cdk.Duration.days(3)
        }
      ]
    })
  }
}