# Blog Post Formatting Guide

This guide explains how to format your blog content when storing it in DynamoDB. The frontend uses **Markdown** to render beautiful, formatted blog posts.

---

## 📝 Basic Text Formatting

### Headings
```markdown
# Heading 1 (Main Title)
## Heading 2 (Section)
### Heading 3 (Subsection)
#### Heading 4 (Small heading)
```

### Text Styles
```markdown
**Bold text**
*Italic text*
***Bold and italic***
~~Strikethrough text~~
```

**Example:**
- This is **bold**
- This is *italic*
- This is ***bold and italic***
- This is ~~deleted~~

---

## 🔗 Links and Images

### Links
```markdown
[Link text](https://example.com)
[Link with title](https://example.com "This is a tooltip")
```

### Images
```markdown
![Alt text](https://example.com/image.jpg)
![Image with title](https://example.com/image.jpg "Image caption")
```

**Pro tip:** Use external image hosting (like Imgur, AWS S3, or CloudFront) for images.

---

## 📋 Lists

### Unordered Lists
```markdown
- First item
- Second item
- Third item
  - Nested item
  - Another nested item
```

### Ordered Lists
```markdown
1. First item
2. Second item
3. Third item
   1. Nested item
   2. Another nested item
```

### Task Lists
```markdown
- [x] Completed task
- [ ] Incomplete task
- [ ] Another task
```

---

## 💻 Code

### Inline Code
```markdown
Use `inline code` for short snippets or commands.
```

### Code Blocks
````markdown
```javascript
// Specify the language for syntax highlighting
function hello() {
  console.log("Hello, World!");
}
```
````

**Supported languages:** javascript, python, java, bash, sql, json, yaml, html, css, typescript, and many more!

**Example Python:**
````markdown
```python
def greet(name):
    return f"Hello, {name}!"

print(greet("Abhijeet"))
```
````

---

## 💬 Blockquotes

```markdown
> This is a blockquote.
> It can span multiple lines.
>
> — Author Name
```

**Result:**
> This is a blockquote.
> It can span multiple lines.

---

## 📊 Tables

```markdown
| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Row 1    | Data     | More     |
| Row 2    | Data     | More     |
```

**Result:**

| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Row 1    | Data     | More     |
| Row 2    | Data     | More     |

**Alignment:**
```markdown
| Left | Center | Right |
|:-----|:------:|------:|
| L    |   C    |     R |
```

---

## 🔀 Horizontal Rule

```markdown
---
or
***
or
___
```

All create a horizontal line.

---

## 🎨 HTML (Advanced)

You can also use inline HTML for special formatting:

```html
<div style="background: #f0f0f0; padding: 1rem; border-radius: 8px;">
  Custom styled content
</div>

<span style="color: red;">Red text</span>
```

**Use sparingly!** Stick to Markdown when possible.

---

## 📌 Sample Blog Post

Here's a complete example you can copy to DynamoDB:

````markdown
# Getting Started with AWS Lambda

AWS Lambda is a **serverless compute service** that lets you run code without provisioning servers. In this post, we'll explore the basics.

## What is Serverless?

Serverless doesn't mean *no servers*—it means you don't manage them! AWS handles:

- Auto-scaling
- High availability
- Infrastructure maintenance

## Creating Your First Lambda Function

Here's a simple Python Lambda function:

```python
def lambda_handler(event, context):
    name = event.get('name', 'World')
    return {
        'statusCode': 200,
        'body': f'Hello, {name}!'
    }
```

### Key Components

1. **Handler function**: Entry point for Lambda
2. **Event object**: Input data
3. **Context object**: Runtime information

## Pricing

Lambda pricing is based on:

| Metric | Cost |
|--------|------|
| Requests | $0.20 per 1M requests |
| Duration | $0.0000166667 per GB-second |

> **Pro tip:** Use provisioned concurrency for latency-sensitive applications!

## Common Use Cases

- [ ] API backends
- [x] Data processing
- [x] Event-driven workflows
- [ ] Scheduled tasks

## Conclusion

AWS Lambda enables you to build scalable applications without infrastructure overhead. Check out the [official docs](https://aws.amazon.com/lambda/) for more!

---

*Written by Abhijeet Singh Rajpurohit*
````

---

## ✅ Best Practices

1. **Use headings hierarchically**: Start with `##` (h2) since the blog title is already h1
2. **Add code comments**: Make code examples self-explanatory
3. **Break up long content**: Use headings, lists, and horizontal rules
4. **Test your markdown**: Use an online preview tool before publishing
5. **Keep it simple**: Don't overformat—readability matters most
6. **Use meaningful link text**: Instead of "click here", use "AWS documentation"
7. **Add alt text to images**: Makes content accessible

---

## 🔧 How to Add Formatted Content to DynamoDB

### Using AWS Console:
1. Go to DynamoDB → Tables → Your blog table
2. Click "Explore table items"
3. Find your post (PK: POST#{id}, SK: CONTENT)
4. Edit the `content` field
5. Paste your markdown-formatted text
6. Save

### Using AWS CLI:
```bash
aws dynamodb update-item \
  --table-name YourBlogTable \
  --key '{"PK": {"S": "POST#1"}, "SK": {"S": "CONTENT"}}' \
  --update-expression "SET content = :c" \
  --expression-attribute-values '{":c": {"S": "# Your Title\n\nYour markdown content..."}}'
```

---

## 🚀 Need Help?

- [Markdown Guide](https://www.markdownguide.org/)
- [GitHub Flavored Markdown](https://github.github.com/gfm/)
- [CommonMark Spec](https://commonmark.org/)

Happy blogging! 🎉
