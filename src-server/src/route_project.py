import logging
from fastapi import APIRouter, HTTPException, Response, status
import pandas as pd
from constants import DomEventChannels, Messages

from decorators import http_response
from log import get_logger
from query_datafile import DatafileQuery, datafile_to_sql
from query_project import ProjectQuery
from request_types import BodyCreateProject, BodyUploadDataset, BodyUploadDatasets
from utils import get_datafile_metadata


router = APIRouter()


class RoutePaths:
    ROOT = "/"
    UPLOAD_DATASET = "/{project_name}/dataset"
    UPLOAD_DATASETS = "/{project_name}/datasets"


@router.post(RoutePaths.UPLOAD_DATASET)
@http_response()
def route_upload_dataset(project_name: str, body: BodyUploadDataset):
    project = ProjectQuery.retrieve_project(project_name, "name")
    if project is None:
        raise HTTPException(status_code=400, detail="Incorrect project ID")

    id = DatafileQuery.create_datafile_entry(
        get_datafile_metadata(body.datasetPath, project.id)
    )
    df = pd.read_csv(body.datasetPath)
    print(df.tail())
    return {"id": id}


@router.post(RoutePaths.UPLOAD_DATASETS)
@http_response()
def route_upload_datasets(project_name: str, body: BodyUploadDatasets):
    project = ProjectQuery.retrieve_project(project_name, "name")
    logger = get_logger()

    if project is None:
        raise HTTPException(status_code=400, detail="Incorrect project ID")

    idx = 1
    for item in body.dataset_paths:
        datafile_to_sql(project.name, project.id, item)
        DatafileQuery.create_datafile_entry(get_datafile_metadata(item, project.id))
        logger.log(
            Messages.UPLOAD_FILES.format(
                FILES_DONE=str(idx), FILES_MAX=len(body.dataset_paths)
            ),
            logging.INFO,
            False,
            False,
        )
        idx += 1

    return Response(
        content="OK", media_type="text/plain", status_code=status.HTTP_200_OK
    )


@router.post(RoutePaths.ROOT)
@http_response()
def route_create_project(body: BodyCreateProject):
    id = ProjectQuery.create_project_entry(body)
    return {"id": id}
