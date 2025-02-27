// build aws detective stack for the root OU
// brings in all accounts under the root OU

// import constructs
import * as arcturus from '@arcturus/cdk-constructs';
import { App, Stack, StackProps, aws_detective as detective } from 'aws-cdk-lib';
export class DetectiveStack extends Stack {

// main config
// set up two regions: us-east-1, us-west-2
// throw exception for other regions
    constructor(scope: App, id: string, props: StackProps) {
        super(scope, id, props);

        let graphID;
        const accountID = arcturus.AccountConstants.SECURITY.accountID;
        if (props.env!.region == arcturus.AccountConstants.EAST) {
            graphID = '5234523434kljsd234324';
        } else if (props.env!.region == arcturus.AccountConstants.EAST) {
            graphID = '423432432432432423433';
        } else {
            throw 'invalid region specified: '${props.env!.region}'`;
            }
        const graphArn = 'arn:aws:detective:${props.env!.region}:${accountID}:graph:${graphID}`;

// invitations for child accounts
    new detective.CfnMemberInvitation(this, 'ToolsDevInvitation', {
        graphArn: graphArn,
        memberEmailAddress: maple@systems.rd',
        memberID: arcturus.AccountContants.TOOS_DEV.accountID,
        });

    new detective.CfnMemberInvitation(this, 'ToolsProdInvitation', {
        graphArn: graphArn,
        memberEmailAddress: hammock@district.rd',
        memberID: arcturus.AccountContants.TOOS_DEV.accountID,
        });

    new detective.CfnMemberInvitation(this, 'BuildDevInvitation', {
        graphArn: graphArn,
        memberEmailAddress: fun@run.co',
        memberID: arcturus.AccountContants.TOOS_DEV.accountID,
        });
    }
}