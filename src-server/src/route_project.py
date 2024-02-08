from fastapi import APIRouter
import pandas as pd

from decorators import http_response
from query_project import ProjectQuery
from request_types import BodyCreateProject, BodyUploadDataset


router = APIRouter()


class RoutePaths:
    ROOT = "/"
    UPLOAD_DATASET = "/{project_id}/dataset"


@router.post(RoutePaths.UPLOAD_DATASET)
@http_response()
def route_dataset(project_id: int, body: BodyUploadDataset):
    df = pd.read_csv(body.datasetPath)
    return "Ok"


@router.post(RoutePaths.ROOT)
@http_response()
def route_create_project(body: BodyCreateProject):
    id = ProjectQuery.create_project_entry(body)
    return {"id": id}
