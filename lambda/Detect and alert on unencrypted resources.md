This Lambda function ensures that EBS volumes, S3 buckets, and RDS instances are encrypted by default.\
Lambda monitors and alerts on unencrypted resources.\
It will automatically enable encryption where possible (S3).\
Alerts are sent via SNS.


### Lambda function
- Checks for encryption on EBS volumes, S3, and RDS
- Will encrypt unencrypted S3 buckets
- Create the Lambda function and add this code

```
import boto3
import os

ec2 = boto3.client('ec2')
s3 = boto3.client('s3')
rds = boto3.client('rds')
sns = boto3.client('sns')


# SNS topic ARN
SNS_TOPIC_ARN = os.environ.get('SNS_TOPIC_ARN')


# send alert function
def send_alert(message):
    print(message)
    sns.publish(TopicArn=SNS_TOPIC_ARN, Message=message, Subject='Unencrypted Resource Alert')


# check that EBS volumes are encrypted
def check_ebs_encryption():
    volumes = ec2.describe_volumes()['Volumes']
    for volume in volumes:
        if not volume['Encrypted']:
            volume_id = volume['VolumeId']
            send_alert(f"Unencrypted EBS Volume found: {volume_id}")


# check that S3 buckets enforce encryption
def check_s3_encryption():
    buckets = s3.list_buckets()['Buckets']
    for bucket in buckets:
        try:
            encryption = s3.get_bucket_encryption(Bucket=bucket['Name'])
        except Exception as e:
            if 'ServerSideEncryptionConfigurationNotFoundError' in str(e):
                send_alert(f"Unencrypted S3 Bucket found: {bucket['Name']}")
                enforce_s3_encryption(bucket['Name'])


# apply encryption to the S3 bucket
def enforce_s3_encryption(bucket_name):
    print(f"Enforce encryption on bucket: {bucket_name}")
    s3.put_bucket_encryption(
        Bucket=bucket_name,
        ServerSideEncryptionConfiguration={
            'Rules': [
                {
                    'ApplyServerSideEncryptionByDefault': {
                        'SSEAlgorithm': 'AES256'
                    }
                }
            ]
        }
    )
    send_alert(f"Encryption applied to S3 bucket: {bucket_name}")


# check if RDS instances are encrypted
def check_rds_encryption():
    instances = rds.describe_db_instances()['DBInstances']
    for instance in instances:
        if not instance['StorageEncrypted']:
            instance_id = instance['DBInstanceIdentifier']
            send_alert(f"Unencrypted RDS Instance found: {instance_id}")


# lambda handler
def lambda_handler(event, context):
    print("scanning for unencrypted resources...")

    check_ebs_encryption()
    check_s3_encryption()
    check_rds_encryption()
    print("scan complete.")
```


### Create the SNS topic
- Subscribe to the topic and approve it
![Image](https://github.com/user-attachments/assets/be89f119-ab56-47d6-bd31-50e89fcce140)

### Add the SNS topic as an environment variable to the Lambda
![Image](https://github.com/user-attachments/assets/11ee503e-cd98-4836-8f4b-c9210e36bc9d)


### Attach an IAM role with required permissions to Lambda
```
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ec2:DescribeVolumes",
        "s3:ListBuckets",
        "s3:GetBucketEncryption",
        "s3:PutBucketEncryption",
        "rds:DescribeDBInstances",
        "sns:Publish"
      ],
      "Resource": "*"
    }
  ]
}
```

### Create the EventBridge rules
- There will be three rules: EC2, S3, RDS
- The target will be the Lambda function

EBS Volume Creation
```{
  "source": ["aws.ec2"],
  "detail-type": ["AWS API Call via CloudTrail"],
  "detail": {
    "eventSource": ["ec2.amazonaws.com"],
    "eventName": ["CreateVolume"]
  }
}
```

S3 Bucket Creation
```{
  "source": ["aws.s3"],
  "detail-type": ["AWS API Call via CloudTrail"],
  "detail": {
    "eventName": ["CreateBucket"]
  }
}
```


RDS Instance Creation
```{
  "source": ["aws.rds"],
  "detail-type": ["AWS API Call via CloudTrail"],
  "detail": {
    "eventName": ["CreateDBInstance"]
  }
}
```
![Image](https://github.com/user-attachments/assets/e7426e2e-ef46-4f4c-90dd-834d722cb5be)


### Test the Lambda function
- Go to the function and select text
- Use a sample event like this or create an unencrypted resource
```
{
  "detail": {
    "eventSource": "ec2.amazonaws.com",
    "eventName": "CreateVolume"
  }
}
```
- You will receive the SNS alert
- S3 buckets will be encrypted if necessary
- To troubleshoot review the CloudWatch logs
![Image](https://github.com/user-attachments/assets/8ff453ef-c61a-48f9-9e89-c44f3c78312c)
