from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime
import random

app = FastAPI(
    title="SamadhanSetu API",
    description="Smart Citizen Grievance Redressal Platform",
    version="1.0.0"
)

# -----------------------------
# CORS
# -----------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# Temporary in-memory database
# -----------------------------

complaints = {}


# -----------------------------
# Models
# -----------------------------

class ComplaintCreate(BaseModel):
    full_name: str
    mobile: str
    category: str
    description: str


class ComplaintStatusUpdate(BaseModel):
    status: str


# -----------------------------
# Home API
# -----------------------------

@app.get("/")
def home():
    return {
        "message": "SamadhanSetu Backend is running 🚀",
        "status": "success"
    }


# -----------------------------
# Health Check
# -----------------------------

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "service": "SamadhanSetu Backend"
    }


# -----------------------------
# Register Complaint
# -----------------------------

@app.post("/complaints")
def create_complaint(complaint: ComplaintCreate):

    complaint_id = "SS-" + str(random.randint(100000, 999999))

    while complaint_id in complaints:
        complaint_id = "SS-" + str(random.randint(100000, 999999))

    complaint_data = {
        "complaint_id": complaint_id,
        "full_name": complaint.full_name,
        "mobile": complaint.mobile,
        "category": complaint.category,
        "description": complaint.description,
        "status": "Submitted",
        "created_at": datetime.now().isoformat()
    }

    complaints[complaint_id] = complaint_data

    return {
        "success": True,
        "message": "Complaint registered successfully",
        "complaint": complaint_data
    }


# -----------------------------
# Track Complaint
# -----------------------------

@app.get("/complaints/{complaint_id}")
def track_complaint(complaint_id: str):

    complaint_id = complaint_id.upper()

    if complaint_id not in complaints:
        return {
            "success": False,
            "message": "Complaint not found"
        }

    return {
        "success": True,
        "complaint": complaints[complaint_id]
    }


# -----------------------------
# Get All Complaints
# -----------------------------

@app.get("/complaints")
def get_all_complaints():

    return {
        "success": True,
        "total": len(complaints),
        "complaints": list(complaints.values())
    }


# -----------------------------
# Admin Update Status
# -----------------------------

@app.put("/complaints/{complaint_id}/status")
def update_complaint_status(
    complaint_id: str,
    status_update: ComplaintStatusUpdate
):

    complaint_id = complaint_id.upper()

    if complaint_id not in complaints:
        return {
            "success": False,
            "message": "Complaint not found"
        }

    complaints[complaint_id]["status"] = status_update.status

    return {
        "success": True,
        "message": "Complaint status updated",
        "complaint": complaints[complaint_id]
    }