from fastapi import APIRouter, Path, HTTPException, status
from backend.models.movie import Movie, MovieRequest
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from beanie import PydanticObjectId

movie_router = APIRouter()


@movie_router.post("", status_code=status.HTTP_201_CREATED)
async def add_movie(movie: MovieRequest):
    new_movie = Movie(title=movie.title, rating=movie.rating)
    await new_movie.insert()
    return jsonable_encoder(new_movie)


@movie_router.get("")
async def get_movie() -> list[Movie]:
    movies = await Movie.find_all().to_list()
    return jsonable_encoder(movies)


@movie_router.get("/{id}")
async def get_movie_by_id(id: PydanticObjectId):
    movie = await Movie.get(id)
    if movie:
        return jsonable_encoder(movie)

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"The movie with ID={id} is not found.",
    )


@movie_router.put("/{id}")
async def update_movie(movie: MovieRequest, id: PydanticObjectId):
    existing_movie = await Movie.get(id)
    if existing_movie:
        existing_movie.title = movie.title
        existing_movie.rating = movie.rating
        await existing_movie.save()
        return {"message": "Movie updated successfully"}

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"The movie with ID={id} is not found.",
    )


@movie_router.delete("/{id}")
async def delete_movie(id: PydanticObjectId):
    movie = await Movie.get(id)
    if movie:
        await movie.delete()
        return {"message": f"The movie with ID={id} has been deleted."}

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"The movie with ID={id} is not found.",
    )
