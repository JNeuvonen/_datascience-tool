from fastapi import APIRouter, Body, Response, status
from decorators import HttpResponseContext

from query_datafile import DatafileSchema


class RoutePaths:
    PUT = "/"
    GET = "/{id}"


router = APIRouter()


@router.put(RoutePaths.PUT)
async def route_put_file_by_name(datafile: DatafileSchema = Body(...)):
    with HttpResponseContext():
        return Response(
            content="OK", media_type="text/plain", status_code=status.HTTP_200_OK
        )
