## cdk quick guide

## setup
npm i -g aws-cdk\
cdk init
cdk init app --language typescript\
cdk bootstrap #####/us-east-1


## push
cdk synth\
cdk deploy

## other stuff
aws sts get-caller-identity --query "Account" --output
npm run build\
cdk list\
cdk diff\
cdk doctor\
cdk destroy