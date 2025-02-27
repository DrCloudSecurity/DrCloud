import * as project from '@project/cdk-constructs';
import { AccountConstants } from '@project/cdk-constructs';
import { App } from 'aws-cdk-lib';
import { DetectiveStack } from './DetectiveStack';
import { IamStack } from './IamStack';

const app = new App();

const eastEnv = {
    account: AccountConstants.redacted_SECURITY.accountID,
    region: AccountConstants.EAST,
};

const westEnv = {
    account: AccountConstants.redacted_SECURITY.accountID,
    region: AccountConstants.WEST,
};

// stacks go here
new DetectiveStack(app, 'DetectiveStackEast', { env: eastEnv });
new DetectiveStack(app, 'DetectiveStackWest', { env: eastEnv });
new IamStack(app, 'iamRoleStack', { env: eastEnv });

project.NagUtils.nag(app);
app.synth();