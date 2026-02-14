import os
import json
import random
from datetime import datetime

# Global in-memory store for demo
# In production, these would be 'MessageThread' and 'Message' models in SQL
THREADS = []
MESSAGES = []

def create_thread(organization_id, carrier_id, shipment_id=None, quote_id=None):
    """
    Initializes a context-aware chat channel between a shipper (org) and a carrier.
    """
    thread_id = len(THREADS) + 1
    thread = {
        "id": thread_id,
        "organization_id": organization_id,
        "carrier_id": carrier_id,
        "shipment_id": shipment_id,
        "quote_id": quote_id,
        "created_at": datetime.now().isoformat(),
        "status": "OPEN",
        "last_message": None
    }
    THREADS.append(thread)
    return thread

def send_message(thread_id, sender_id, sender_name, text, attachments=None):
    """
    Persists a message to a thread.
    """
    msg_id = len(MESSAGES) + 1
    message = {
        "id": msg_id,
        "thread_id": thread_id,
        "sender_id": sender_id,
        "sender_name": sender_name,
        "text": text,
        "attachments": attachments or [],
        "timestamp": datetime.now().isoformat()
    }
    MESSAGES.append(message)
    
    # Update thread last message
    for t in THREADS:
        if t["id"] == thread_id:
            t["last_message"] = text
            
    return message

def get_threads(organization_id):
    """
    Returns all threads for an organization.
    """
    return [t for t in THREADS if t["organization_id"] == organization_id]

def get_messages(thread_id):
    """
    Returns all messages for a thread.
    """
    return [m for m in MESSAGES if m["thread_id"] == thread_id]

def generate_ai_quick_replies(thread_id):
    """
    Analyzes the last few messages and suggests quick responses using LLM logic.
    """
    thread_messages = get_messages(thread_id)
    if not thread_messages:
        return ["Hi, checking on status.", "Please provide an update.", "Call me when ready."]
        
    last_msg = thread_messages[-1]["text"].lower()
    
    # Simple rule-based logic for demo (can be piped to GPT-4)
    if "where" in last_msg or "eta" in last_msg:
        return ["Current ETA is on schedule.", "Checking telematics now.", "Slight delay due to traffic."]
    elif "cost" in last_msg or "rate" in last_msg or "fee" in last_msg:
        return ["Approved.", "Need to review internal budget.", "Let's negotiate."]
    else:
        return ["Copy that.", "Thanks for the update.", "Talk soon."]
