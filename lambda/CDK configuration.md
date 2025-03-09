## CDK Configuration for AMI check
<p></p>

#### The other files illustrate how the services integrate.
#### These features will be implemented using Terraform/CDK as shown below.

### start a new project, initialize
```
mkdir ec2-ami-checker-cdk
cd ec2-ami-checker-cdk
cdk init app --language python
```

### Install dependencies
```
pip install aws-cdk-lib boto3 requests
```

### Add code to the Lambda file [ec2_checker/lambda_function.py]
```
import boto3
import json
import os
import requests

# AWS Clients
ec2 = boto3.client('ec2')
sns = boto3.client('sns')

# Environment Variables
SLACK_WEBHOOK_URL = os.environ['SLACK_WEBHOOK_URL']
SNS_TOPIC_ARN = os.environ['SNS_TOPIC_ARN']

# Approved AMI list (Update with your approved AMI IDs)
APPROVED_AMIS = os.environ['APPROVED_AMIS'].split(",")

# Fetch EC2 instance details
def get_instance_details(instance_id):
    response = ec2.describe_instances(InstanceIds=[instance_id])
    instance = response['Reservations'][0]['Instances'][0]
    return instance

# Check if the AMI is approved
def is_ami_approved(ami_id):
    return ami_id in APPROVED_AMIS

# Send alert to Slack
def send_to_slack(message):
    payload = {"text": message}
    requests.post(SLACK_WEBHOOK_URL, json=payload)

# Send alert via SNS (for email)
def send_to_sns(message):
    sns.publish(TopicArn=SNS_TOPIC_ARN, Message=message, Subject="Unapproved AMI Detected")

# Lambda Handler
def lambda_handler(event, context):
    print("Received event:", json.dumps(event, indent=2))

    # Extract the instance ID from the event
    instance_id = event['detail']['instance-id']

    # Get instance details
    instance = get_instance_details(instance_id)
    ami_id = instance['ImageId']
    owner = instance['Tags'][0]['Value'] if 'Tags' in instance and instance['Tags'] else "Unknown"

    # Check AMI approval status
    if not is_ami_approved(ami_id):
        alert_message = f*Unapproved AMI Detected!* \nInstance ID: {instance_id}\nAMI ID: {ami_id}\nOwner: {owner}"
        send_to_slack(alert_message)
        send_to_sns(alert_message)
        print(alert_message)
    else:
        print(f"Approved AMI detected for instance {instance_id}.")

```

### create ec2_checker/stack.py
```
from aws_cdk import (
    Stack,
    aws_lambda as _lambda,
    aws_events as events,
    aws_events_targets as targets,
    aws_sns as sns,
    aws_sns_subscriptions as subscriptions,
)
from constructs import Construct

class EC2CheckerStack(Stack):
    def __init__(self, scope: Construct, id: str, **kwargs) -> None:
        super().__init__(scope, id, **kwargs)

        # Create SNS Topic for email alerts
        topic = sns.Topic(self, "EC2AmiCheckTopic")
        topic.add_subscription(subscriptions.EmailSubscription("me@bah.com"))

        # Lambda function to check AMI compliance
        lambda_fn = _lambda.Function(
            self, "EC2AmiCheckLambda",
            runtime=_lambda.Runtime.PYTHON_3_12,
            handler="lambda_function.lambda_handler",
            code=_lambda.Code.from_asset("ec2_checker"),
            environment={
                "SNS_TOPIC_ARN": topic.topic_arn,
                "SLACK_WEBHOOK_URL": "https://hooks.slack.com/services/EK37DK",
                # approved ami list
                "APPROVED_AMIS": "ami-08b5b3a93ed654d19"
            }
        )

        # Grant Lambda permissions to describe EC2 instances and publish to SNS
        lambda_fn.add_to_role_policy(
            statement=_lambda.PolicyStatement(
                actions=["ec2:DescribeInstances"],
                resources=["*"]
            )
        )
        topic.grant_publish(lambda_fn)

        # EventBridge rule to trigger Lambda on EC2 launch
        rule = events.Rule(
            self, "EC2LaunchRule",
            event_pattern={
                "source": ["aws.ec2"],
                "detail-type": ["EC2 Instance State-change Notification"],
                "detail": {
                    "state": ["running"]
                }
            }
        )
        rule.add_target(targets.LambdaFunction(lambda_fn))
```
### Configure our stack, app.py
```
#!/usr/bin/env python3
import aws_cdk as cdk
from ec2_checker.stack import EC2CheckerStack

app = cdk.App()
EC2CheckerStack(app, "EC2CheckerStack")
app.synth()
```

### ship it and validate
```
cdk bootstrap
cdk deploy
```
- Confirm the SNS subscription
- Launch an approved or unapproved AMI to test SNS notification
- Use CloudWatch logs to view activity/troubleshoot
