import os
import json
import boto3
from botocore.exceptions import ClientError

# Initialize the DynamoDB client outside the handler (Best Practice: Connection Reuse)
dynamodb = boto3.resource('dynamodb')
# TABLE_NAME = os.environ.get('TABLE_NAME')
# table = dynamodb.Table(TABLE_NAME)

def handler(event, context):
    print(f"Event: {json.dumps(event)}") # Basic logging
    
    TABLE_NAME = os.environ.get('TABLE_NAME')
    table = dynamodb.Table(TABLE_NAME)
    http_method = event['requestContext']['http']['method']
    
    try:
        if http_method == 'GET':
            # Logic to list posts (simplified)
            response = table.scan() # We'll optimize this to a Query later
            return {
                "statusCode": 200,
                "body": json.dumps(response.get('Items', []))
            }
            
        elif http_method == 'POST':
            body = json.loads(event['body'])
            item = {
                'PK': f"POST#{body['id']}",
                'SK': 'METADATA',
                'title': body['title'],
                'content': body['content']
            }
            table.put_item(Item=item)
            return {"statusCode": 201, "body": json.dumps({"message": "Post created"})}

    except Exception as e:
        print(f"Error: {str(e)}")
        return {"statusCode": 500, "body": json.dumps({"error": "Internal Server Error"})}


# --- THIS IS THE PART FOR LOCAL TESTING ---
if __name__ == "__main__":
    # Set a variable
    os.environ['TABLE_NAME'] = "AbhijeetBlogStack-BlogTable4F8B6C55-BG8Z13PYX0Z"

    # 1. Mock a POST request
    mock_post_event = {
        "requestContext": {"http": {"method": "POST"}},
        "body": json.dumps({
            "id": "1",
            "title": "My First Cloud Blog",
            "content": "Hello World! This was sent from my VS Code terminal."
        })
    }
    print("Testing POST...")
    print(handler(mock_post_event, None))

    # 2. Mock a GET request
    mock_get_event = {
        "requestContext": {"http": {"method": "GET"}}
    }
    print("\nTesting GET...")
    print(handler(mock_get_event, None))