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
            post_id = body['id']
            
            # 1. THE METADATA ITEM (For the list view)
            metadata_item = {
                'PK': f"POST#{post_id}",
                'SK': 'METADATA',
                'title': body['title'],
                'author': body.get('author', 'Abhijeet'),
                'date': body.get('date', '2026-02-24'),
                'summary': body.get('summary', 'Click to read more...')
            }
            
            # 2. THE CONTENT ITEM (For the detail view)
            content_item = {
                'PK': f"POST#{post_id}",
                'SK': 'CONTENT',
                'content': body['content'] # The big block of text
            }
            
            # Write both to DynamoDB
            table.put_item(Item=metadata_item)
            table.put_item(Item=content_item)
            
            return {"statusCode": 201, "body": json.dumps({"message": "Full post created with split items"})}
        
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
            "id": "2",
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