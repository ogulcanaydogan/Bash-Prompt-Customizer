# Bash Prompt Customization Website

This project provides a website where users can customize their Bash prompt with various colors for elements like timestamps, usernames, and directory paths. The website allows users to preview their Bash prompt configuration and copy the generated Bash command.

## Features

- Choose colors for multiple Bash prompt components.
- Preview the customized Bash prompt in real-time.
- Generate and copy the Bash command to apply the selected colors.

## Setup Instructions

### 1. Hosting on AWS S3

1. **Create an S3 Bucket:**
   - Open the [AWS S3 console](https://s3.console.aws.amazon.com/s3/home).
   - Create a new bucket with the name matching your subdomain, e.g., `color.ogulcanaydogan.com`.
   - Ensure **Block all public access** is unchecked to allow public access.

2. **Upload the Website Files:**
   - Upload all HTML, CSS, and JavaScript files to the bucket.
   - Once uploaded, go to **Properties** and enable **Static website hosting**.
   - Set the `index.html` file as the entry point for the website.

3. **Set Bucket Permissions for Public Access:**
   - Go to **Permissions** > **Bucket Policy** and apply the following policy to make the bucket publicly accessible:
     ```json
     {
       "Version": "2012-10-17",
       "Statement": [
         {
           "Sid": "PublicReadGetObject",
           "Effect": "Allow",
           "Principal": "*",
           "Action": "s3:GetObject",
           "Resource": "arn:aws:s3:::color.ogulcanaydogan.com/*"
         }
       ]
     }
     ```

### 2. Configure the Subdomain with Route 53

1. **Open Route 53:**
   - Go to the [Route 53 console](https://console.aws.amazon.com/route53/).

2. **Create an A Record for Your Subdomain:**
   - In the hosted zone for `ogulcanaydogan.com`, create a new record.
   - Choose **Record type** as **A - IPv4 address**.
   - Set **Alias** to **Yes** and select the **Alias target** as the S3 website endpoint for `color.ogulcanaydogan.com`.

3. **Save the Record:** Allow a few minutes for the DNS changes to propagate.

### 3. Accessing Your Website

After completing the steps above, your website should be available at `https://color.ogulcanaydogan.com`. You can visit this URL to start customizing your Bash prompt.

## Additional Notes

- The website files are hosted statically, meaning any changes require re-uploading files to S3.
- Ensure that AWS charges may apply for data transfer and storage if the bucket is heavily accessed.

## License

This project is licensed under the MIT License.
