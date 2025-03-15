## cdk quick guide

### setup
npm i -g aws-cdk\
cdk init app --language typescript\
aws configure  [add keys]\
cdk bootstrap 316178934648/us-east-1


### continuing in a new sandbox
aws configure  [add keys]\
cdk bootstrap 316178934648/us-east-1
cdk synth
cdk deploy


### push
cdk synth\
cdk deploy

### other stuff
aws sts get-caller-identity --query "Account" --output
npm run build\
cdk list\
cdk diff\
cdk doctor\
cdk destroy