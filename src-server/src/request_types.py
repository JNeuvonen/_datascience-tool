from typing import List
from pydantic import BaseModel


class BodyGetUploadsSize(BaseModel):
    file_paths: List[str]


class BodyUploadDataset(BaseModel):
    datasetPath: str


class BodyUploadDatasets(BaseModel):
    dataset_paths: List[str]


class BodyCreateProject(BaseModel):
    name: str


class BodyCreateDatafile(BaseModel):
    file_name: str
    project_id: int
