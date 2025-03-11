from fastapi import APIRouter, Path, HTTPException, status
from model import Movie, MovieRequest
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse

movie_router = APIRouter()

movie_list = []
max_id: int = 0


@movie_router.post("", status_code=status.HTTP_201_CREATED)
async def add_movie(movie: MovieRequest) -> Movie:
    global max_id
    max_id += 1  # auto increment ID

    newMovie = Movie(id=max_id, title=movie.title, rating=movie.rating)
    movie_list.append(newMovie)
    return newMovie


@movie_router.get("")
async def get_movie() -> list[Movie]:
    return movie_list


@movie_router.get("/{id}")
async def get_movie_by_id(id: int = Path(..., title="default")) -> Movie:
    for movie in movie_list:
        if movie.id == id:
            return movie

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"The movie with ID={id} is not found.",
    )


@movie_router.put("/{id}")
async def update_movie(movie: MovieRequest, id: int) -> dict:
    print("Before update:", movie_list)
    for x in movie_list:
        if x.id == id:
            x.title = movie.title
            x.rating = movie.rating
            print("After update:", movie_list)
            return {"message": "Movie updated successfully"}

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"The movie with ID={id} is not found.",
    )


@movie_router.delete("/{id}")
async def delete_movie(id: int) -> dict:
    for i in range(len(movie_list)):
        movie = movie_list[i]
        if movie.id == id:
            movie_list.pop(i)
            return {"message": f"The movie with ID={id} has been deleted."}

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"The movie with ID={id} is not found.",
    )
