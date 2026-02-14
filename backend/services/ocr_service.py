import fitz  # PyMuPDF

def extract_text_from_pdf(pdf_bytes):
    """
    Extracts text from a PDF file stream (bytes) using PyMuPDF.
    """
    try:
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        text = ""
        for page in doc:
            text += page.get_text()
        return text
    except Exception as e:
        print(f"Error extracting text: {e}")
        return None
