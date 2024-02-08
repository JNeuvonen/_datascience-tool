from fastapi import APIRouter, HTTPException
import pandas as pd

from decorators import http_response
from query_datafile import DatafileQuery
from query_project import ProjectQuery
from request_types import BodyCreateProject, BodyUploadDataset
from utils import get_datafile_metadata


router = APIRouter()


class RoutePaths:
    ROOT = "/"
    UPLOAD_DATASET = "/{project_name}/dataset"


@router.post(RoutePaths.UPLOAD_DATASET)
@http_response()
def route_dataset(project_name: int, body: BodyUploadDataset):
    project = ProjectQuery.retrieve_project(project_name, "name")

    if project is None:
        raise HTTPException(status_code=400, detail="Incorrect project ID")

    id = DatafileQuery.create_datafile_entry(
        get_datafile_metadata(body.datasetPath, project.id)
    )
    df = pd.read_csv(body.datasetPath)
    return {"id": id}


@router.post(RoutePaths.ROOT)
@http_response()
def route_create_project(body: BodyCreateProject):
    id = ProjectQuery.create_project_entry(body)
    return {"id": id}
