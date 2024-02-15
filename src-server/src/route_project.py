import asyncio
import json
from fastapi import APIRouter, HTTPException, Response, status
import pandas as pd
from decorators import HttpResponseContext
from query_datafile import (
    DatafileQuery,
)
from query_project import ProjectQuery
from request_types import (
    BodyCreateProject,
    BodyGetUploadsSize,
    BodyUploadDataset,
    BodyUploadDatasets,
)
from utils import (
    ag_grid_filters_struct_to_sql,
    count_rows,
    get_datafile_columns,
    get_datafile_metadata,
    get_dataset_pagination,
    get_join_col_actions,
    get_sizes_of_files,
    upload_datasets,
)
from config import is_testing


router = APIRouter()


class RoutePaths:
    ROOT = "/"
    DATASET = "/{project_name}/dataset"
    FILE_ROWS_PAGINATION = "/{project_name}/row-pagination/{file_name}"
    FILE_BY_NAME = "/{project_name}/file/{file_name}"
    DATASETS = "/{project_name}/datasets"
    GET_SIZE_OF_UPLOAD = "/size-of-uploads"
    PROJECT = "/{project_name}"
    ORGANIZE = "/{project_name}/organize"
    JOIN_COL = "/{project_name}/join-col"


@router.post(RoutePaths.GET_SIZE_OF_UPLOAD)
async def route_get_uploads_size(body: BodyGetUploadsSize):
    with HttpResponseContext():
        res = get_sizes_of_files(body.file_paths)
        return {"data": res}


@router.post(RoutePaths.DATASET)
async def route_upload_dataset(project_name: str, body: BodyUploadDataset):
    with HttpResponseContext():
        project = ProjectQuery.retrieve(project_name, "name")
        if project is None:
            raise HTTPException(status_code=400, detail="Incorrect project ID")

        id = DatafileQuery.create_datafile_entry(
            get_datafile_metadata(body.datasetPath, project.id)
        )
        df = pd.read_csv(body.datasetPath)
        return {"id": id}


@router.post(RoutePaths.DATASETS)
async def route_upload_datasets(project_name: str, body: BodyUploadDatasets):
    with HttpResponseContext():
        project = ProjectQuery.retrieve(project_name, "name")
        if project is None:
            raise HTTPException(status_code=400, detail="Incorrect project name")

        if is_testing():
            # blocking return if testing
            await upload_datasets(project, body)
            return Response(
                content="OK", media_type="text/plain", status_code=status.HTTP_200_OK
            )
        asyncio.create_task(upload_datasets(project, body))
        return Response(
            content="OK", media_type="text/plain", status_code=status.HTTP_200_OK
        )


@router.get(RoutePaths.ROOT)
async def route_get_projects():
    with HttpResponseContext():
        projects = ProjectQuery.retrieve_all_projects()
        ret = []

        for item in projects:
            datafiles = DatafileQuery.get_datafiles_by_project(item.id)
            ret.append({"datafiles": datafiles, "project": item})
        return {"data": ret}


@router.post(RoutePaths.ROOT)
async def route_create_project(body: BodyCreateProject):
    with HttpResponseContext():
        id = ProjectQuery.create_project_entry(body)
        return {"id": id}


@router.get(RoutePaths.PROJECT)
async def route_get_project(project_name: str):
    with HttpResponseContext():
        project = ProjectQuery.retrieve(project_name, "name")

        if project is None:
            raise HTTPException(status_code=400, detail="Incorrect project name")

        datafiles = DatafileQuery.get_datafiles_by_project(project.id)
        join_col_actions = get_join_col_actions(project.name)
        ret = {
            "datafiles": datafiles,
            "project": project,
            "metadata": {"join_col": join_col_actions},
        }
        return {"data": ret}


@router.get(RoutePaths.FILE_ROWS_PAGINATION)
async def route_get_project_dataset(
    project_name: str, file_name: str, page: int, page_size: int, filters: str
):
    with HttpResponseContext():
        filters_parsed = json.loads(filters)
        filters_arr = []

        for key, value in filters_parsed.items():
            sql_filters = ag_grid_filters_struct_to_sql(key, value)
            filters_arr.append(sql_filters)

        project = ProjectQuery.retrieve(project_name, "name")

        if project is None:
            raise HTTPException(status_code=400, detail="Incorrect project name")

        pagination_data = get_dataset_pagination(
            project.name, file_name, page, page_size, filters_arr
        )

        return {
            "data": pagination_data,
            "max_rows": count_rows(project.name, file_name, filters_arr),
        }


@router.get(RoutePaths.FILE_BY_NAME)
async def route_file_by_name(project_name: str, file_name: str):
    with HttpResponseContext():
        datafile = DatafileQuery.get_datafile_by_name(file_name)
        return {
            "data": get_datafile_columns(project_name, file_name, datafile),
        }


@router.get(RoutePaths.ORGANIZE)
async def route_organize_info(project_name: str):
    with HttpResponseContext():
        return {"data": get_join_col_actions(project_name)}


@router.put(RoutePaths.JOIN_COL)
async def route_set_join_col(project_name: str, join_col: str):
    with HttpResponseContext():
        project = ProjectQuery.retrieve(project_name, "name")

        if project is None:
            raise HTTPException(status_code=400, detail="Incorrect project name")

        datafiles = DatafileQuery.get_datafiles_by_project(project.id)

        for item in datafiles:
            if item.join_column is None:
                DatafileQuery.update_join_column(item.id, join_col)

        ProjectQuery.update_join_column(project.id, join_col)

        return Response(
            content="OK", media_type="text/plain", status_code=status.HTTP_200_OK
        )
