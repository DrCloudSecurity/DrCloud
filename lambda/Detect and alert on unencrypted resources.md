This Lambda function ensures that EBS volumes, S3 buckets, and RDS instances are encrypted by default.
Lambda monitors and alerts on unencrypted resources.
It will automatically enable encryption when possible.
Alerts are sent via SNS.

Lambda function
- Checks for encryption on EBS volumes, S3, and RDS
- Will encrypt unencrypted S3 buckets
- Create the Lambda function wit the code below

```

```