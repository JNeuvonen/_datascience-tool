import asyncio
from fastapi import APIRouter, HTTPException, Response, status
import pandas as pd

from decorators import HttpResponseContext
from query_datafile import DatafileQuery, upload_datasets
from query_project import ProjectQuery
from request_types import (
    BodyCreateProject,
    BodyGetUploadsSize,
    BodyUploadDataset,
    BodyUploadDatasets,
)
from utils import get_datafile_metadata, get_sizes_of_files


router = APIRouter()


class RoutePaths:
    ROOT = "/"
    UPLOAD_DATASET = "/{project_name}/dataset"
    UPLOAD_DATASETS = "/{project_name}/datasets"
    GET_SIZE_OF_UPLOAD = "/size-of-uploads"


@router.post(RoutePaths.GET_SIZE_OF_UPLOAD)
async def route_get_uploads_size(body: BodyGetUploadsSize):
    with HttpResponseContext():
        res = get_sizes_of_files(body.file_paths)
        return {"data": res}


@router.post(RoutePaths.UPLOAD_DATASET)
async def route_upload_dataset(project_name: str, body: BodyUploadDataset):
    with HttpResponseContext():
        project = ProjectQuery.retrieve_project(project_name, "name")
        if project is None:
            raise HTTPException(status_code=400, detail="Incorrect project ID")

        id = DatafileQuery.create_datafile_entry(
            get_datafile_metadata(body.datasetPath, project.id)
        )
        df = pd.read_csv(body.datasetPath)
        return {"id": id}


@router.post(RoutePaths.UPLOAD_DATASETS)
async def route_upload_datasets(project_name: str, body: BodyUploadDatasets):
    with HttpResponseContext():
        project = ProjectQuery.retrieve_project(project_name, "name")
        if project is None:
            raise HTTPException(status_code=400, detail="Incorrect project ID")
        asyncio.create_task(upload_datasets(project, body))
        return Response(
            content="OK", media_type="text/plain", status_code=status.HTTP_200_OK
        )


@router.post(RoutePaths.ROOT)
async def route_create_project(body: BodyCreateProject):
    with HttpResponseContext():
        id = ProjectQuery.create_project_entry(body)
        return {"id": id}
