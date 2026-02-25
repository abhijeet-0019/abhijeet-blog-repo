from constructs import Construct
from aws_cdk import (
    Stack,
    aws_iam as iam,
    aws_dynamodb as dynamodb, # Add this import
    aws_lambda as _lambda,      # Add this
    aws_apigatewayv2_alpha as apigwv2, # Add this (Modern HTTP API)
    aws_apigatewayv2_integrations_alpha as integrations, # Add this
    RemovalPolicy,            # Add this import
    CfnOutput
)

class BlogStack(Stack):
    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        # 1. Define the DynamoDB Table
        blog_table = dynamodb.Table(
            self, "BlogTable",
            partition_key=dynamodb.Attribute(
                name="PK", 
                type=dynamodb.AttributeType.STRING
            ),
            sort_key=dynamodb.Attribute(
                name="SK", 
                type=dynamodb.AttributeType.STRING
            ),
            billing_mode=dynamodb.BillingMode.PAY_PER_REQUEST,
            # For a personal project, we want to delete the table if we destroy the stack
            removal_policy=RemovalPolicy.DESTROY, 
            # This is good practice for DVA exam: encryption at rest
            encryption=dynamodb.TableEncryption.AWS_MANAGED
        )

        CfnOutput(self, "TableName", value=blog_table.table_name)

        # 2. Create the Lambda Function
        blog_lambda = _lambda.Function(
            self, "BlogHandler",
            runtime=_lambda.Runtime.PYTHON_3_11,
            handler="posts_handler.handler",
            code=_lambda.Code.from_asset("runtime"), # Points to our folder
            environment={
                "TABLE_NAME": blog_table.table_name
            }
        )

        # 3. Grant Permissions (Least Privilege - Key DVA Topic)
        blog_table.grant_read_write_data(blog_lambda)

        # 4. Create HTTP API Gateway with CORS
        http_api = apigwv2.HttpApi(
            self, "BlogApi",
            api_name="Blog API",
            cors_preflight=apigwv2.CorsPreflightOptions(
                allow_methods=[
                    apigwv2.CorsHttpMethod.GET,
                    apigwv2.CorsHttpMethod.POST,
                    apigwv2.CorsHttpMethod.OPTIONS,
                ],
                allow_origins=["*"], # For production, replace with your frontend URL
                allow_headers=["Content-Type", "Authorization"],
            )
        )

        # 5. Add a Route
        http_api.add_routes(
            path="/posts",
            methods=[apigwv2.HttpMethod.GET, apigwv2.HttpMethod.POST],
            integration=integrations.HttpLambdaIntegration("LambdaIntegration", blog_lambda)
        )

        CfnOutput(self, "ApiUrl", value=http_api.api_endpoint)

        account_id = Stack.of(self).account
        
        # 1. Reference the OIDC Provider ARN
        provider_arn = f"arn:aws:iam::{account_id}:oidc-provider/token.actions.githubusercontent.com"

        # 2. Create the Role for GitHub Actions 
        # We pass the ARN as the first positional argument
        github_role = iam.Role(
            self, "GitHubActionsRole",
            assumed_by=iam.FederatedPrincipal(
                provider_arn,
                conditions={
                    "StringLike": {
                        "token.actions.githubusercontent.com:sub": "repo:abhijeet-0019/abhijeet-blog-repo:*"
                    },
                    "StringEquals": {
                        "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
                    }
                },
                assume_role_action="sts:AssumeRoleWithWebIdentity"
            ),
            description="Role assumed by GitHub Actions for CDK deployments"
        )

        # 3. Grant AdministratorAccess
        github_role.add_managed_policy(
            iam.ManagedPolicy.from_aws_managed_policy_name("AdministratorAccess")
        )

        # 4. Output the ARN
        CfnOutput(self, "GitHubRoleArn", value=github_role.role_arn)