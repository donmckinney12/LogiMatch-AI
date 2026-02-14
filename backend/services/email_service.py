import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

def send_email(to_email, subject, html_content):
    """
    Sends an email using SendGrid API.
    """
    api_key = os.getenv('SENDGRID_API_KEY')
    from_email = os.getenv('FROM_EMAIL', 'noreply@logimatch.ai') # Default fallback
    
    if not api_key:
        print("Warning: SENDGRID_API_KEY not found. Email not sent.")
        return {"status": "skipped", "message": "API Key missing"}
        
    message = Mail(
        from_email=from_email,
        to_emails=to_email,
        subject=subject,
        html_content=html_content
    )
    
    try:
        sg = SendGridAPIClient(api_key)
        response = sg.send(message)
        return {"status": "success", "status_code": response.status_code}
    except Exception as e:
        print(f"SendGrid Error: {str(e)}")
        raise e
