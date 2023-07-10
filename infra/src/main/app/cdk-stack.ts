import {
  CfnOutput,
  aws_ec2,
  aws_rds,
  aws_lambda,
  aws_apigateway,
  Duration,
  aws_secretsmanager
} from "aws-cdk-lib";
import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { join } from "path";
import {Architecture, DockerImageCode} from "aws-cdk-lib/aws-lambda";
import {Cors} from "aws-cdk-lib/aws-apigateway";
import {SubnetType} from "aws-cdk-lib/aws-ec2";

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = aws_ec2.Vpc.fromLookup(this, "RSAppVPC", {vpcName: "rs-app-vpc"});
    const dbSecurityGroup = aws_ec2.SecurityGroup.fromLookupByName(this, "DBSecurityGroup", "db-security-group", vpc);
    const lambdaSecurityGroup = aws_ec2.SecurityGroup.fromLookupByName(this, "LambdaSecurityGroup", "productsFunc-security-group", vpc);
    const databaseInstance = aws_rds.DatabaseInstance.fromDatabaseInstanceAttributes(this, "RSAppDB", {
        instanceEndpointAddress: "cdkbestack-rsappdb54f111b9-cy8fmuqb9mpj.ctbiciqa36xl.us-east-1.rds.amazonaws.com:5432",
        instanceIdentifier: "cdkbestack-rsappdb54f111b9-cy8fmuqb9mpj",
        port: 5432,
        securityGroups: [dbSecurityGroup],
    });
    const dbSecret = aws_secretsmanager.Secret.fromSecretCompleteArn(this, "DBSecret", "")

    const cartApiLambda = new aws_lambda.DockerImageFunction(this, "CartApiHandler", {
      vpc: vpc,
      vpcSubnets: { subnetType: SubnetType.PRIVATE_WITH_EGRESS },
      timeout: Duration.seconds(90),
      code: DockerImageCode.fromImageAsset(join(__dirname, "..", "..", "..", "..", ".."), {}),
      architecture: Architecture.X86_64,
      securityGroups: [lambdaSecurityGroup],
      environment: {
        DB_ENDPOINT: databaseInstance.instanceEndpoint.hostname,
        DB_NAME: 'rs_school',
        DB_USER: 'postgres',
        DB_SECRET_ARN: dbSecret.secretArn,
        NO_COLOR: "1"
      }
    });

    dbSecret.grantRead(cartApiLambda)
    databaseInstance.grantConnect(cartApiLambda, "postgres")

    const apigw = new aws_apigateway.LambdaRestApi(this, "CartApiEndpoint", {
      handler: cartApiLambda,
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: Cors.ALL_METHODS,
        allowHeaders: Cors.DEFAULT_HEADERS,
      }
    });

    new CfnOutput(this, "CartApiGatewayUrl", {
      value: apigw.url,
      exportName: "CartApiGatewayUrl",
    });
  }
}
