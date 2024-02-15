from fastapi import APIRouter, Body, HTTPException, Response, status
from decorators import HttpResponseContext

from query_datafile import DatafileQuery, DatafileSchema
from utils import rename_project_file


class RoutePaths:
    PUT = "/"
    GET = "/{id}"


router = APIRouter()


@router.put(RoutePaths.PUT)
async def route_put_file_by_name(datafile: DatafileSchema = Body(...)):
    with HttpResponseContext():
        datafile_from_db = DatafileQuery.retrieve(datafile.id)

        if datafile_from_db is None:
            raise HTTPException(
                status_code=400, detail=f"Datafile was not found for id {datafile.id}"
            )

        if datafile_from_db.file_name is not datafile.file_name:
            rename_project_file(datafile.id, datafile.file_name)

        DatafileQuery.update_datafile(datafile)
        return Response(
            content="OK", media_type="text/plain", status_code=status.HTTP_200_OK
        )


@router.get(RoutePaths.GET)
async def route_get_file(id: int):
    with HttpResponseContext():
        datafile = DatafileQuery.retrieve(id)
        return {"data": datafile}
