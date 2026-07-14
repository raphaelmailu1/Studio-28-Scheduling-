from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers.appointments import router as appointments_router
from routers.auth import router as auth_router
from routers.admin import router as admin_router

app = FastAPI(title="Studio 28 Scheduler API")

# Development + Production frontend URLs
origins = [
    "http://localhost:5173",
    "https://your-netlify-site.netlify.app",
    "https://yourcustomdomain.com",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    appointments_router,
    prefix="/appointments",
    tags=["Appointments"],
)

app.include_router(auth_router, prefix="/auth")
app.include_router(admin_router)


@app.get("/")
def root():
    return {
        "message": "Studio 28 Scheduler API is running!"
    }