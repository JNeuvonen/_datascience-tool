from fastapi import APIRouter, Body, HTTPException, Response, status
from constants import AppConstants
from decorators import HttpResponseContext

from query_datafile import DatafileQuery, DatafileSchema
from query_project import ProjectQuery
from request_types import BodyCreateDatafile
from utils import get_datafile_table_name, rename_table


class RoutePaths:
    PUT = "/"
    GET = "/{id}"
    DEL = "/{id}"
    POST = "/"


router = APIRouter()


@router.put(RoutePaths.PUT)
async def route_put_file_by_name(datafile: DatafileSchema = Body(...)):
    with HttpResponseContext():
        datafile_from_db = DatafileQuery.retrieve(datafile.id)

        if datafile_from_db is None:
            raise HTTPException(
                status_code=400, detail=f"Datafile was not found for id {datafile.id}"
            )

        if datafile_from_db.id is not datafile.id:
            raise HTTPException(
                status_code=400, detail="Changing of primary key is not possible"
            )

        if datafile_from_db.file_name is not datafile.file_name:
            project = ProjectQuery.retrieve(datafile.project_id)
            rename_table(
                AppConstants.DB_DATASETS,
                get_datafile_table_name(project.name, datafile_from_db.file_name),
                get_datafile_table_name(project.name, datafile.file_name),
            )

        DatafileQuery.update_datafile(datafile)
        return Response(
            content="OK", media_type="text/plain", status_code=status.HTTP_200_OK
        )


@router.get(RoutePaths.GET)
async def route_get_file(id: int):
    with HttpResponseContext():
        datafile = DatafileQuery.retrieve(id)
        return {"data": datafile}


@router.delete(RoutePaths.DEL)
async def route_delete_datafile(id: int):
    with HttpResponseContext():
        was_success = DatafileQuery.delete(id)

        if was_success is not True:
            raise HTTPException(
                status_code=400, detail=f"Datafile was not found for id {id}"
            )

        return Response(
            content="OK", media_type="text/plain", status_code=status.HTTP_200_OK
        )


@router.post(RoutePaths.POST)
async def route_create_file(body: BodyCreateDatafile):
    with HttpResponseContext():
        project = ProjectQuery.retrieve(body.project_id)

        if project is None:
            raise HTTPException(
                status_code=400,
                detail=f"Project was not found for id {body.project_id}",
            )

        DatafileQuery.create_datafile_entry(body.model_dump())

        return Response(
            content="OK", media_type="text/plain", status_code=status.HTTP_200_OK
        )
