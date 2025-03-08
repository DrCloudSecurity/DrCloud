This walks you through creating a Lambda function that checks if EC2 instances are created from approved AMIs.\
A notification email will be sent when a new instance is out of compliance.\
EventBridge and SNS tie this together.
<br/>

### SNS topic
- Create an SNS topic
- Subscribe to the topic and approve the notice <p>
![Image](https://github.com/user-attachments/assets/771f9e6f-8ad9-46c5-be13-cfadc84d9c1b)



### Lambda function
- Looks for the EC2 instance launch
- Pulls the AMI ID from the instance
- Compares it to the list of approved AMIs
- Alerts on unapproved AMIs<p>


### Deploy the function
- Create a new function
- Set runtime to python
- Add the code below
- Add the SNS topic as an environment variable

```
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

<p>
    ![Image](https://github.com/user-attachments/assets/53a9743f-88c3-4941-9be6-e341db5df9b3)
</p>

### EventBridge
- create a rule
- source: aws events
- target: Lambda, then select the new function <p>
![Image](https://github.com/user-attachments/assets/ecb4d192-f902-4240-bfa8-85de1d6a3fc7)


### Validation
- Launch a new EC2 instance with an unapproved AMI and confirm you receive the email
- Review logs in CloudWatch if there is a problem <p>

![image](https://github.com/user-attachments/assets/ad2a38ea-49f0-4273-8cee-6342828c73e4)

