from constructs import Construct
from aws_cdk import (
    Stack,
    aws_iam as iam,
    aws_dynamodb as dynamodb,
    aws_lambda as _lambda,
    aws_apigatewayv2_alpha as apigwv2,
    aws_apigatewayv2_integrations_alpha as integrations,
    aws_s3 as s3,
    aws_s3_deployment as s3_deploy,
    aws_cloudfront as cloudfront,
    aws_cloudfront_origins as origins,
    RemovalPolicy,
    CfnOutput,
    Duration
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

        # ==========================================
        # FRONTEND HOSTING (S3 + CloudFront)
        # ==========================================

        # 6. Create S3 Bucket for Frontend
        frontend_bucket = s3.Bucket(
            self, "FrontendBucket",
            website_index_document="index.html",
            website_error_document="404.html",
            public_read_access=True,
            block_public_access=s3.BlockPublicAccess(
                block_public_acls=False,
                block_public_policy=False,
                ignore_public_acls=False,
                restrict_public_buckets=False
            ),
            removal_policy=RemovalPolicy.DESTROY,
            auto_delete_objects=True,
            cors=[
                s3.CorsRule(
                    allowed_methods=[s3.HttpMethods.GET, s3.HttpMethods.HEAD],
                    allowed_origins=["*"],
                    allowed_headers=["*"]
                )
            ]
        )

        # 7. Create CloudFront Distribution (before deployment for invalidation)
        distribution = cloudfront.Distribution(
            self, "FrontendDistribution",
            default_behavior=cloudfront.BehaviorOptions(
                origin=origins.S3Origin(frontend_bucket),
                viewer_protocol_policy=cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                allowed_methods=cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
                cached_methods=cloudfront.CachedMethods.CACHE_GET_HEAD_OPTIONS,
                cache_policy=cloudfront.CachePolicy.CACHING_OPTIMIZED,
                compress=True
            ),
            default_root_object="index.html",
            error_responses=[
                cloudfront.ErrorResponse(
                    http_status=404,
                    response_http_status=200,
                    response_page_path="/index.html",
                    ttl=Duration.minutes(5)
                ),
                cloudfront.ErrorResponse(
                    http_status=403,
                    response_http_status=200,
                    response_page_path="/index.html",
                    ttl=Duration.minutes(5)
                )
            ],
            price_class=cloudfront.PriceClass.PRICE_CLASS_100,  # Use only North America & Europe
            comment="Blog Frontend Distribution"
        )

        # 8. Deploy Frontend Files to S3 with CloudFront invalidation
        frontend_deployment = s3_deploy.BucketDeployment(
            self, "DeployFrontend",
            sources=[s3_deploy.Source.asset("../frontend/out")],
            destination_bucket=frontend_bucket,
            distribution=distribution,  # Auto-invalidate CloudFront
            distribution_paths=["/*"],  # Invalidate all paths
            # Cache control for static assets
            cache_control=[
                s3_deploy.CacheControl.max_age(Duration.days(365)),
                s3_deploy.CacheControl.must_revalidate()
            ],
            # Prune old files when redeploying
            prune=True
        )

        # ==========================================
        # OUTPUT CLOUDFRONT AND S3 URLS
        # ==========================================
        CfnOutput(self, "WebsiteURL", value=f"https://{distribution.distribution_domain_name}")
        CfnOutput(self, "S3BucketName", value=frontend_bucket.bucket_name)
        CfnOutput(self, "CloudFrontDistributionId", value=distribution.distribution_id)

        # ==========================================
        # GITHUB ACTIONS IAM ROLE
        # ==========================================

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