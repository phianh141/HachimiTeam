import sys
sys.path.append(".")

from app.core.database import SessionLocal
from app.models.models import Drug, Disease

db = SessionLocal()

sample_drugs = [
    {"drug_name": "Aspirin",       "description": "Anti-inflammatory and analgesic drug"},
    {"drug_name": "Metformin",     "description": "First-line treatment for type 2 diabetes"},
    {"drug_name": "Ibuprofen",     "description": "NSAID for pain and inflammation"},
    {"drug_name": "Atorvastatin",  "description": "Statin for cholesterol management"},
    {"drug_name": "Omeprazole",    "description": "Proton pump inhibitor for acid reflux"},
    {"drug_name": "Amlodipine",    "description": "Calcium channel blocker for hypertension"},
    {"drug_name": "Lisinopril",    "description": "ACE inhibitor for heart failure"},
    {"drug_name": "Simvastatin",   "description": "Statin to lower LDL cholesterol"},
    {"drug_name": "Losartan",      "description": "ARB for hypertension and kidney protection"},
    {"drug_name": "Doxycycline",   "description": "Broad-spectrum antibiotic"},
]

sample_diseases = [
    {"disease_name": "Type 2 Diabetes",      "description": "Metabolic disorder with insulin resistance"},
    {"disease_name": "Hypertension",         "description": "Chronic high blood pressure condition"},
    {"disease_name": "Alzheimer's Disease",  "description": "Neurodegenerative disease affecting memory"},
    {"disease_name": "Breast Cancer",        "description": "Malignant tumor of breast tissue"},
    {"disease_name": "Rheumatoid Arthritis", "description": "Autoimmune inflammatory joint disease"},
    {"disease_name": "Heart Failure",        "description": "Chronic condition where heart cannot pump enough blood"},
    {"disease_name": "Gastric Ulcer",        "description": "Sore in the lining of the stomach"},
    {"disease_name": "Hyperlipidemia",       "description": "Elevated levels of lipids in the blood"},
    {"disease_name": "Chronic Kidney Disease","description": "Gradual loss of kidney function"},
    {"disease_name": "Pneumonia",            "description": "Infection that inflames air sacs in the lungs"},
]

# Chỉ insert nếu chưa có — tránh chạy seed 2 lần bị lỗi duplicate
for d in sample_drugs:
    exists = db.query(Drug).filter(Drug.drug_name == d["drug_name"]).first()
    if not exists:
        db.add(Drug(**d))

for d in sample_diseases:
    exists = db.query(Disease).filter(Disease.disease_name == d["disease_name"]).first()
    if not exists:
        db.add(Disease(**d))

db.commit()
print("✅ Seed data inserted successfully!")
db.close()