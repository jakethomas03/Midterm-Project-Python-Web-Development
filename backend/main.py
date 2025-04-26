from contextlib import asynccontextmanager
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from starlette.responses import FileResponse
from backend.db.db_context import init_database
from backend.routers.user import user_router
from backend.routers.movie import movie_router
import os


@asynccontextmanager
async def lifespan(app: FastAPI):
    # on startup event
    print("Application starts...")
    await init_database()
    yield
    # on shutdown event
    print("Application shuts down...")


app = FastAPI(title="Movie App", version="2.0.0", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def read_index():
    return FileResponse("../frontend/index.html")


app.include_router(user_router, tags=["Users"], prefix="/users")
app.include_router(movie_router, tags=["Movies"], prefix="/movies")


# 🔍 Get correct absolute path to Angular build
project_root = os.path.dirname(os.path.abspath(__file__))
frontend_path = os.path.join(project_root, "../angular/dist/angular/browser")

# ✅ Debug print (optional)
print("Serving frontend from:", frontend_path)

# 🧠 Ensure file exists
index_file = os.path.join(frontend_path, "index.html")
if not os.path.exists(index_file):
    raise RuntimeError(f"File at path {index_file} does not exist.")

# 🔗 Mount static files from Angular build
app.mount("/static", StaticFiles(directory=frontend_path), name="static")


# 🔁 Catch-all route for client-side routing (e.g., Angular Router)
@app.get("/{full_path:path}")
async def serve_vue_app():
    return FileResponse(index_file)


@app.get("/{full_path:path}")
async def serve_vue_app(full_path: str):
    if full_path.startswith("api/"):  # or any other pattern to avoid conflict
        return
    return FileResponse(index_file)


@app.get("/{full_path:path}")
async def serve_vue_app(full_path: str):
    if full_path == "favicon.ico":
        return FileResponse("path_to_your_favicon.ico")  # If you have a favicon
    return FileResponse(index_file)


# uvicorn.run(app, host="localhost", port=8000)
