from pydantic import BaseModel


class Movie(BaseModel):
    id: int
    title: str
    rating: float


class MovieRequest(BaseModel):
    title: str
    rating: float
