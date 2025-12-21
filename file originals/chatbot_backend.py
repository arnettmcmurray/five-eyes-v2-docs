# backend/app/routers/chat.py
# Core chatbot endpoint - answers questions about training content

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from openai import OpenAI
import os

router = APIRouter()

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Request/Response models
class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str

# Cache knowledge base at startup
KNOWLEDGE_BASE = None

def load_knowledge_base():
    """Load training content from dashboard files"""
    global KNOWLEDGE_BASE
    
    if KNOWLEDGE_BASE is not None:
        return KNOWLEDGE_BASE
    
    # For now, use placeholder content
    # Replace with actual file loading when content is provided
    KNOWLEDGE_BASE = """
    # Five Eyes Cybersecurity Training
    
    ## Email Security (SPF, DKIM, DMARC)
    
    ### SPF (Sender Policy Framework)
    Think of SPF like a mailbox lock. It says: "Only these specific mail servers are allowed to send emails from my company."
    When someone tries to send an email claiming to be from your company, the mail system checks if they're using one of your approved servers.
    
    ### DKIM (DomainKeys Identified Mail)
    DKIM is like a tamper-proof seal. You sign your emails with a digital signature that only you have.
    When someone receives your email, they check the signature. If it's been changed, the signature won't match anymore.
    
    ### DMARC (Domain-based Message Authentication)
    DMARC is the referee. It says: "If SPF or DKIM checks fail, here's what to do with the email."
    You can tell it to reject fake emails, put them in spam, or just send you a report.
    
    ## Phishing Detection
    Phishing emails pretend to be from someone you trust to steal information.
    Red flags:
    - Strange sender email address (even if name looks right)
    - Urgent requests for passwords or sensitive info
    - Links that don't match the company they claim to be from
    - Grammar and spelling mistakes (companies proofread)
    """
    
    return KNOWLEDGE_BASE

# System prompt that guides chatbot behavior
SYSTEM_PROMPT = """You are an assistant helping people learn about cybersecurity training. 
Use the provided knowledge base to answer questions.

IMPORTANT RULES:
1. You are a TEACHER, not a test-taker. Your job is to help people UNDERSTAND concepts.
2. Never provide direct answers to quiz or test questions.
3. If someone asks "What is the answer to question X?" redirect them to learning instead.
4. Use simple language (4th grade reading level when possible).
5. Use analogies and real-world examples.
6. If you don't know, say so. Don't make things up.

KNOWLEDGE BASE:
{knowledge_base}

Respond conversationally and helpfully."""

@router.post("/chat")
async def chat(request: ChatRequest):
    """
    Main chat endpoint.
    Accepts a user message, returns AI response.
    """
    try:
        # Load knowledge base
        knowledge = load_knowledge_base()
        
        # Build system message with knowledge
        system_message = SYSTEM_PROMPT.format(knowledge_base=knowledge)
        
        # Check if user is asking for quiz answer (detection)
        is_answer_seeking = detect_answer_seeking(request.message)
        
        # If answer-seeking, adjust system prompt to be firmer
        if is_answer_seeking:
            system_message += "\n\nIMPORTANT: The user is trying to get a direct answer. Politely refuse and redirect to learning."
        
        # Call OpenAI
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": system_message},
                {"role": "user", "content": request.message}
            ],
            max_tokens=500,
            temperature=0.7
        )
        
        # Extract response
        ai_response = response.choices[0].message.content
        
        return ChatResponse(response=ai_response)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat error: {str(e)}")

def detect_answer_seeking(message: str) -> bool:
    """
    Detect if user is asking for direct answers to quizzes/tests.
    Returns True if suspicious pattern detected.
    """
    answer_patterns = [
        "what is the answer",
        "give me the answer",
        "tell me the answer",
        "what should i choose",
        "is this correct",
        "is that right",
        "is it right",
        "which one is correct",
        "which one is right",
        "what's the answer",
        "what's the correct answer",
    ]
    
    message_lower = message.lower()
    return any(pattern in message_lower for pattern in answer_patterns)

@router.get("/health")
async def health():
    """Health check endpoint"""
    return {"status": "ok"}
