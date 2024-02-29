from typing import List, Optional
from pydantic import BaseModel, Field


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


class BodyMergeDataframes(BaseModel):
    dataframes: List[str]
    join_prefix: Optional[str] = Field(default=None)


class BodyExportDataframe(BaseModel):
    export_all: bool
    data_idx_start: int
    data_limit: int
