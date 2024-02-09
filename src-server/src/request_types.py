from typing import List
from pydantic import BaseModel


class BodyUploadDataset(BaseModel):
    datasetPath: str


class BodyUploadDatasets(BaseModel):
    dataset_paths: List[str]


class BodyCreateProject(BaseModel):
    name: str
