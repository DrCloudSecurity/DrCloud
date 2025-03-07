This walks you through creating a Lambda function that checks if EC2 instances are created from approved AMIs.\
A notification email will be sent when a new instance is out of compliance.\
EventBridge and SNS tie this together.
<br/>

### SNS topic
- Create an SNS topic
- Subscribe to the topic and approve the notice

### Lambda function
- Looks for the EC2 instance launch
- Pulls the AMI ID from the instance
- Compares it to the list of approved AMIs
- Alerts on unapproved AMIs


### Deploy the function
- set runtime to python
- add the code below
- add the SNS topic as an environment variable

```
# import libs
import boto3
import os

ec2 = boto3.client('ec2')
sns = boto3.client('sns')

# approved AMIs
APPROVED_AMIS = ['ami-1234567890abcdef0', 'ami-0987654321abcdef0']

SNS_TOPIC_ARN = os.environ['SNS_TOPIC_ARN']

def lambda_handler(event, context):
    try:
        # Get the instance ID
        instance_id = event['detail']['instance-id']

        # Describe the instance to get AMI ID
        response = ec2.describe_instances(InstanceIds=[instance_id])
        ami_id = response['Reservations'][0]['Instances'][0]['ImageId']

        print(f"Instance {instance_id} launched with AMI {ami_id}")

        # Check if the AMI is approved
        if ami_id not in APPROVED_AMIS:
            message = f"Unapproved AMI detected\nInstance: {instance_id}\nAMI: {ami_id}"
            print(message)

            # Send SNS alert
            sns.publish(TopicArn=SNS_TOPIC_ARN, Subject="Unapproved AMI Alert", Message=message)

        else:
            print(f"Approved AMI used: {ami_id}")

    except Exception as e:
        print(f"Error: {e}")
        raise e
```


### EventBridge
- create a rule
- source: aws events
- target: Lambda, then select the new function


### Validation
- Launch a new EC2 instance with an unapproved AMI and confirm you receive the email
- Logs are in CloudWatch
