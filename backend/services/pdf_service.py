import os
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib.units import inch
from reportlab.lib import colors
from datetime import datetime

def generate_booking_pdf(data):
    """
    Generates a PDF booking confirmation.
    Returns the absolute path to the generated file.
    """
    # Create 'generated_docs' directory if it doesn't exist
    output_dir = os.path.join(os.path.dirname(__file__), '../generated_docs')
    os.makedirs(output_dir, exist_ok=True)
    
    filename = f"Booking_{data.get('carrier', 'Unknown')}_{datetime.now().strftime('%Y%m%d%H%M%S')}.pdf"
    filepath = os.path.join(output_dir, filename)
    
    c = canvas.Canvas(filepath, pagesize=letter)
    width, height = letter
    
    # Header
    c.setFont("Helvetica-Bold", 24)
    c.drawString(1 * inch, height - 1 * inch, "Booking Confirmation")
    
    c.setFont("Helvetica", 10)
    c.drawString(1 * inch, height - 1.25 * inch, f"Date: {datetime.now().strftime('%Y-%m-%d')}")
    c.drawString(1 * inch, height - 1.4 * inch, f"Order Ref: LM-{datetime.now().strftime('%H%M%S')}")
    
    # Carrier Info
    c.setStrokeColor(colors.black)
    c.line(1 * inch, height - 1.6 * inch, width - 1 * inch, height - 1.6 * inch)
    
    c.setFont("Helvetica-Bold", 14)
    c.drawString(1 * inch, height - 2 * inch, "To Carrier:")
    c.setFont("Helvetica", 12)
    c.drawString(1 * inch, height - 2.25 * inch, data.get('carrier', 'Unknown Carrier'))
    
    # Shipment Details
    c.setFont("Helvetica-Bold", 14)
    c.drawString(1 * inch, height - 3 * inch, "Shipment Details:")
    
    c.setFont("Helvetica", 12)
    y_pos = height - 3.3 * inch
    c.drawString(1 * inch, y_pos, f"Origin: {data.get('origin', 'N/A')}")
    y_pos -= 0.25 * inch
    c.drawString(1 * inch, y_pos, f"Destination: {data.get('destination', 'N/A')}")
    y_pos -= 0.25 * inch
    c.drawString(1 * inch, y_pos, f"Agreed Price: {data.get('total_price', 'N/A')} {data.get('currency', '')}")
    
    # Surcharges Section
    y_pos -= 0.5 * inch
    c.setFont("Helvetica-Bold", 12)
    c.drawString(1 * inch, y_pos, "Included Surcharges:")
    c.setFont("Helvetica", 10)
    y_pos -= 0.2 * inch
    
    surcharges = data.get('surcharges', [])
    if surcharges:
        for s in surcharges:
            text = f"- {s.get('raw_name')} ({s.get('normalized_name') or 'Review Needed'}): {s.get('amount')} {s.get('currency')}"
            c.drawString(1.2 * inch, y_pos, text)
            y_pos -= 0.2 * inch
    else:
        c.drawString(1.2 * inch, y_pos, "No specific surcharges listed.")
    
    # Footer / Authorization
    c.line(1 * inch, 2 * inch, width - 1 * inch, 2 * inch)
    c.setFont("Helvetica-Oblique", 10)
    c.drawString(1 * inch, 1.75 * inch, "This document serves as a formal booking request based on the agreed quotation.")
    c.drawString(1 * inch, 1.5 * inch, "Authorized Signature: __________________________")
    
    c.save()
    return filepath
