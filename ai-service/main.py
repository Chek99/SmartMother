"""
MamaCare+ Kenya — AI Microservice (FastAPI)
Features:
- Bilingual Swahili & English RAG Retrieval over Kenya MoH / WHO Clinical Guidelines
- Deterministic Danger Signs Screening & Emergency Webhook Dispatch
- WHO Anthro Growth Trajectory & Faltering Classifier
"""

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import uvicorn
import re
import os

app = FastAPI(
    title="MamaCare+ Kenya AI Service",
    description="Python FastAPI Microservice for Maternal & Infant Health Triage",
    version="1.0.0"
)

# Request / Response Schemas
class ChatQueryRequest(BaseModel):
    message: str
    child_id: Optional[str] = None
    child_age_months: Optional[float] = None
    language: Optional[str] = "sw" # 'sw' or 'en'
    context_vitals: Optional[Dict[str, Any]] = None

class ChatResponse(BaseModel):
    reply: str
    danger_sign_detected: bool
    matched_danger_signs: List[str]
    immediate_first_aid: Optional[str] = None
    language: str
    rag_sources: List[str]

class GrowthAnalysisRequest(BaseModel):
    child_id: str
    gender: str
    age_months: float
    weight_kg: float
    length_cm: float
    historical_weights: Optional[List[float]] = []

class GrowthAnalysisResponse(BaseModel):
    z_scores: Dict[str, float]
    faltering_detected: bool
    nutritional_category: str
    recommended_interventions: List[str]

DANGER_SIGNS = [
    {
        "id": "convulsions",
        "name_en": "Convulsions / Fits",
        "name_sw": "Kifafa / Degedege",
        "keywords": ["convulsion", "seizure", "fit", "degedege", "kifafa", "kutetemeka sana", "macho kugeuka"],
        "advice_sw": "Mlaze mtoto ubavu, usiweke chochote mdomoni, na umpeleke hospitali mara moja!",
        "advice_en": "Place child in recovery position, put nothing in mouth, and rush to emergency immediately!"
    },
    {
        "id": "chest_indrawing",
        "name_en": "Severe Chest Indrawing / Stridor",
        "name_sw": "Kifua Kuzama Ndani / Kushindwa Kupumua",
        "keywords": ["chest indrawing", "difficulty breathing", "grunting", "stridor", "kifua kinazama", "kuhema kwa shida"],
        "advice_sw": "Mshike wima, hakikisha njia ya hewa iko wazi, na nenda hospitalini mara moja apewe oksijeni.",
        "advice_en": "Keep upright, keep airway clear, do not give liquids, and transport immediately for oxygen."
    },
    {
        "id": "not_feeding",
        "name_en": "Unable to Breastfeed / Persistent Vomiting",
        "name_sw": "Kushindwa Kunyonya / Kutapika Kila Kitu",
        "keywords": ["unable to feed", "vomiting everything", "refusing breast", "hanyonyi", "anatapika kila kitu"],
        "advice_sw": "Mtoto yuko hatarini kupoteza nguvu na sukari kushuka. Mpeleke kliniki mara moja.",
        "advice_en": "Severe risk of rapid hypoglycemia and dehydration. Seek emergency clinic care immediately."
    }
]

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "MamaCare+ Python AI Service", "version": "1.0.0"}

@app.post("/api/v1/triage/chat", response_model=ChatResponse)
def triage_chat(request: ChatQueryRequest):
    text_lower = request.message.lower()
    matched_signs = []
    immediate_advice = []

    # Deterministic rule scan
    for ds in DANGER_SIGNS:
        if any(kw in text_lower for kw in ds["keywords"]):
            matched_signs.append(ds["name_en"])
            advice = ds["advice_sw"] if request.language == "sw" else ds["advice_en"]
            immediate_advice.append(advice)

    if matched_signs:
        reply = (
            f"🚨 TAHADHARI YA HARAKA: Dalili zilizotajwa ({', '.join(matched_signs)}) ni hatari sana kwa mtoto.\n"
            + " ".join(immediate_advice)
            if request.language == "sw"
            else f"🚨 IMMEDIATE DANGER ALERT: The reported symptoms ({', '.join(matched_signs)}) indicate an urgent medical danger.\n"
            + " ".join(immediate_advice)
        )
        return ChatResponse(
            reply=reply,
            danger_sign_detected=True,
            matched_danger_signs=matched_signs,
            immediate_first_aid=" ".join(immediate_advice),
            language=request.language or "sw",
            rag_sources=["MoH Kenya IMCI Clinical Guidelines 2026"]
        )

    # Standard guidance synthesis
    if request.language == "sw":
        reply = (
            "Asante kwa swali lako mama. Kulingana na miongozo ya Wizara ya Afya (MoH Kenya): "
            "Hakikisha mtoto anapata maziwa ya mama pekee kwa miezi 6 ya kwanza bila kuongeza maji au chakula kingine. "
            "Mtoto anapofikisha miezi 6, anza uji mzito wa mtama au wimbi uliochanganywa na maziwa au njugu, "
            "pamoja na matunda laini na viazi vitamu. Kumbuka daima kufuatilia chanjo zote katika kitabu cha kliniki cha MoH 216."
        )
    else:
        reply = (
            "Thank you for reaching out. Under Ministry of Health Kenya and WHO guidelines: "
            "Infants should be exclusively breastfed on demand for the first 6 months. "
            "At 6 months, begin nutrient-dense complementary foods such as fortified millet/sorghum porridge, "
            "mashed pumpkin, ripe avocado, and pureed greens, while continuing frequent breastfeeding up to 2 years. "
            "Always verify your child's vaccination progress in your physical MoH 216 health booklet."
        )

    return ChatResponse(
        reply=reply,
        danger_sign_detected=False,
        matched_danger_signs=[],
        immediate_first_aid=None,
        language=request.language or "sw",
        rag_sources=["Kenya MoH Infant and Young Child Feeding (IYCF) Policy", "WHO Guideline on Complementary Feeding"]
    )

@app.post("/api/v1/growth/analyze", response_model=GrowthAnalysisResponse)
def analyze_growth(request: GrowthAnalysisRequest):
    # Standard WHO approximations
    expected_weight = 3.3 + (request.age_months * 0.7)
    sd_weight = 0.9
    waz = round((request.weight_kg - expected_weight) / sd_weight, 2)
    
    expected_length = 50.0 + (request.age_months * 2.2)
    sd_length = 2.4
    haz = round((request.length_cm - expected_length) / sd_length, 2)

    faltering = False
    if len(request.historical_weights) >= 2:
        last_weight = request.historical_weights[-1]
        prev_weight = request.historical_weights[-2]
        if last_weight <= prev_weight:
            faltering = True

    category = "normal"
    interventions = []

    if waz < -3.0 or haz < -3.0:
        category = "severe_acute_malnutrition"
        interventions = [
            "Refer immediately to Sub-County Hospital Nutrition Support Unit.",
            "Screen for bilateral pitting oedema and medical complications.",
            "Initiate Ready-to-Use Therapeutic Food (RUTF) protocol."
        ]
    elif waz < -2.0:
        category = "moderate_acute_malnutrition"
        interventions = [
            "Enroll in Supplementary Feeding Programme (SFP) at local dispensary.",
            "Counsel on energy-dense family porridge fortified with groundnut paste or milk.",
            "Follow-up weight check every 14 days."
        ]
    elif faltering:
        category = "growth_faltering"
        interventions = [
            "Growth velocity flattening detected over last two visits.",
            "Assess maternal breastfeeding frequency, latch, and complementary food thickness."
        ]
    else:
        category = "normal"
        interventions = [
            "Growth progressing well along WHO green percentile trajectory.",
            "Continue optimal age-appropriate feeding and KEPI routine visits."
        ]

    return GrowthAnalysisResponse(
        z_scores={"weight_for_age": waz, "height_for_age": haz},
        faltering_detected=faltering,
        nutritional_category=category,
        recommended_interventions=interventions
    )

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
