from pydantic import BaseModel
from beanie import Document


class Movie(Document):
    title: str
    rating: float

    class Settings:
        name = "Movie"


class MovieRequest(BaseModel):
    title: str
    rating: float
