import asyncio
import json
from fastapi import APIRouter, Body, HTTPException, Response, status
from config import append_app_data_path, is_testing
from constants import AppConstants
from decorators import HttpResponseContext
from fastapi import Query

from query_datafile import DatafileQuery, DatafileSchema
from query_project import ProjectQuery
from request_types import BodyCreateDatafile, BodyExportDataframe, BodyMergeDataframes
from utils import (
    ag_grid_filters_struct_to_sql,
    cleanup_temp_csvs,
    create_empty_table,
    get_datafile_table_name,
    get_df_export,
    merge_dataframes,
    rename_table,
)


class RoutePaths:
    PUT = "/"
    GET = "/{id}"
    DEL = "/{id}"
    POST = "/"
    SET_JOIN_COL = "/set-join-col/{id}"
    MERGE = "/merge/{id}"
    EXPORT = "/export/{id}"


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

        DatafileQuery.update_datafile(datafile)
        if datafile_from_db.file_name is not datafile.file_name:
            project = ProjectQuery.retrieve(datafile.project_id)

            if project is None:
                raise HTTPException(
                    status_code=400,
                    detail=f"Project was not found for id {datafile.project_id}",
                )

            rename_table(
                AppConstants.DB_DATASETS,
                get_datafile_table_name(project.name, datafile_from_db.file_name),
                get_datafile_table_name(project.name, datafile.file_name),
            )
            DatafileQuery.set_df_table_name(
                datafile.id,
                get_datafile_table_name(project.name, datafile.file_name),
            )

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

        create_empty_table(project.name, body.file_name)
        body_json = body.model_dump()
        body_json["df_table_name"] = get_datafile_table_name(
            project.name, body.file_name
        )
        id = DatafileQuery.create_datafile_entry(body_json)
        return {"id": id}


@router.post(RoutePaths.MERGE)
async def route_merge_dataframes(id: int, body: BodyMergeDataframes):
    with HttpResponseContext():
        file = DatafileQuery.retrieve(id)

        if is_testing():
            # blocking control flow if testing
            await merge_dataframes(
                file.df_table_name, body.dataframes, body.join_prefix
            )
            return Response(
                content="OK", media_type="text/plain", status_code=status.HTTP_200_OK
            )

        asyncio.create_task(
            merge_dataframes(file.df_table_name, body.dataframes, body.join_prefix)
        )
        return Response(
            content="OK", media_type="text/plain", status_code=status.HTTP_200_OK
        )


@router.put(RoutePaths.SET_JOIN_COL)
async def route_set_join_col(id: int, join_col: str):
    with HttpResponseContext():
        DatafileQuery.update_join_column(id, join_col)
        return Response(
            content="OK", media_type="text/plain", status_code=status.HTTP_200_OK
        )


@router.post(RoutePaths.EXPORT)
async def route_export_df(
    id: int, body: BodyExportDataframe, filters: str = Query(None)
):
    with HttpResponseContext():
        cleanup_temp_csvs()

        filters_parsed = body.filters
        filters_arr = []

        for key, value in filters_parsed.items():
            sql_filters = ag_grid_filters_struct_to_sql(key, value)
            filters_arr.append(sql_filters)

        df_metadata = DatafileQuery.retrieve(id)
        df = get_df_export(
            df_metadata.df_table_name,
            body.export_all,
            body.data_idx_start,
            body.data_limit,
            filters_arr,
        )
        csv_path = append_app_data_path("temporal.csv")
        df.to_csv(csv_path, index=False)

        return Response(
            content="OK", media_type="text/plain", status_code=status.HTTP_200_OK
        )
