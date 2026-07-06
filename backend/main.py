from fastapi import FastAPI
from routers.appointments import router as appointments_router
from routers.auth import router as auth_router
from fastapi.middleware.cors import CORSMiddleware
from routers.admin import router as admin_router

app = FastAPI(title="Studio 28 Scheduler API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(appointments_router, prefix="/appointments", tags=["Appointments"])

app.include_router(auth_router, prefix="/auth")

app.include_router(admin_router)