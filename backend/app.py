#!/usr/bin/env python3
import aws_cdk as cdk
from infrastructure.blog_stack import BlogStack

app = cdk.App()

# We call the class 'BlogStack' which matches the code I gave you earlier
BlogStack(app, "AbhijeetBlogStack",
    # If you want to deploy to a specific region, uncomment below
    # env=cdk.Environment(account='631764257626', region='us-east-1'),
)

app.synth()