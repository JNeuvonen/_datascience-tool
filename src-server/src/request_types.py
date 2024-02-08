from pydantic import BaseModel


class BodyUploadDataset(BaseModel):
    datasetPath: str


class BodyCreateProject(BaseModel):
    name: str
