from backend.models.MyConfig import get_settings
from backend.models.movie import Movie
from backend.models.user import User
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from pydantic import BaseModel


async def init_database():
    my_config = get_settings()
    client = AsyncIOMotorClient(my_config.connection_string)
    db = client["movie_app"]
    await init_beanie(database=db, document_models=[User, Movie])
