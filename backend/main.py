from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="Loan EMI & Eligibility API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class EmiRequest(BaseModel):
    principal: float
    annualInterestRate: float
    tenureMonths: int


class EmiResponse(BaseModel):
    emi: float
    totalPayment: float
    totalInterest: float


class EligibilityRequest(BaseModel):
    salary: float
    emi: float


class EligibilityResponse(BaseModel):
    status: str
    ratio: float
    maxRecommendedEmi: float


@app.get("/healthz")
def healthz():
    return {"status": "ok"}


@app.post("/api/emi", response_model=EmiResponse)
def calculate_emi(payload: EmiRequest):
    P = payload.principal
    yearly_rate = payload.annualInterestRate / 100.0
    r = yearly_rate / 12.0
    n = payload.tenureMonths

    if n <= 0 or P <= 0:
        # Simple guard, you can refine later
        return EmiResponse(emi=0, totalPayment=0, totalInterest=0)

    if r == 0:
        emi = P / n
    else:
        factor = (1 + r) ** n
        emi = (P * r * factor) / (factor - 1)

    total_payment = emi * n
    total_interest = total_payment - P

    return EmiResponse(
        emi=round(emi, 2),
        totalPayment=round(total_payment, 2),
        totalInterest=round(total_interest, 2),
    )


@app.post("/api/eligibility", response_model=EligibilityResponse)
def check_eligibility(payload: EligibilityRequest):
    salary = payload.salary
    emi = payload.emi

    if salary <= 0:
        return EligibilityResponse(
            status="REJECTED",
            ratio=0.0,
            maxRecommendedEmi=0.0,
        )

    ratio = emi / salary  # EMI-to-income
    max_recommended = 0.4 * salary

    if ratio <= 0.4:
        status = "APPROVED"
    elif ratio <= 0.5:
        status = "BORDERLINE"
    else:
        status = "REJECTED"

    return EligibilityResponse(
        status=status,
        ratio=round(ratio, 2),
        maxRecommendedEmi=round(max_recommended, 2),
    )