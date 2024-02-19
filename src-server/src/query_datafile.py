import json
from typing import Dict, List, Optional
from pydantic import BaseModel

from sqlalchemy import Column, ForeignKey, Integer, String
from decorators import LogException
from orm import Base, Session


class Datafile(Base):
    __tablename__ = "datafile"

    id = Column(Integer, primary_key=True)
    file_name = Column(String, nullable=False)
    df_table_name = Column(String, nullable=False, unique=True)
    size_bytes = Column(Integer)
    row_count = Column(Integer)
    distinct_counts = Column(String, nullable=True)
    distinct_values = Column(String, nullable=True)
    first_non_null_values = Column(String, nullable=True)
    was_import = Column(Integer)
    join_column = Column(String, nullable=True)
    merged_dataframes = Column(String, nullable=True)
    columns = Column(String, nullable=True)
    project_id = Column(Integer, ForeignKey("project.id"), nullable=False)

    def deserialize(self):
        if self.merged_dataframes:
            self.merged_dataframes = json.loads(self.merged_dataframes)

        if self.columns:
            self.columns = json.loads(self.columns)


class DatafileSchema(BaseModel):
    id: int
    file_name: str
    df_table_name: Optional[str]
    size_bytes: Optional[int]
    row_count: Optional[int]
    distinct_counts: Optional[str]
    distinct_values: Optional[str]
    first_non_null_values: Optional[str]
    was_import: Optional[int]
    join_column: Optional[str]
    merged_dataframes: Optional[List[str]]
    columns: Optional[List[str]]
    project_id: int


class DatafileQuery:
    @staticmethod
    def create_datafile_entry(datafile_info: Dict):
        with LogException():
            with Session() as session:
                entry = Datafile(**datafile_info)
                session.add(entry)
                session.commit()
                return entry.id

    @staticmethod
    def get_datafiles_by_project(project_id) -> List[Datafile]:
        with Session() as session:
            datafiles = (
                session.query(Datafile).filter(Datafile.project_id == project_id).all()
            )

            for item in datafiles:
                item.deserialize()

            return datafiles

    @staticmethod
    def get_datafile_by_name(datafile: str) -> Datafile:
        with Session() as session:
            return (
                session.query(Datafile).filter(Datafile.file_name == datafile).first()
            )

    @staticmethod
    def update_join_column(datafile_id: int, join_column: str):
        with Session() as session:
            session.query(Datafile).filter(Datafile.id == datafile_id).update(
                {"join_column": join_column}
            )
            session.commit()

    @staticmethod
    def retrieve(value, field="id"):
        with LogException():
            with Session() as session:
                query = session.query(Datafile)
                train_job_data = query.filter(getattr(Datafile, field) == value).first()
                return train_job_data

    @staticmethod
    def update_datafile(datafile_schema: DatafileSchema):
        datafile_info = datafile_schema.model_dump(exclude_unset=True)
        columns = datafile_info.get("columns")
        if columns is not None:
            datafile_info["columns"] = json.dumps(columns)
        with Session() as session:
            datafile_id = datafile_info.pop("id", None)
            if datafile_id:
                session.query(Datafile).filter(Datafile.id == datafile_id).update(
                    {
                        Datafile.__table__.c[key]: value
                        for key, value in datafile_info.items()
                    }
                )
                session.commit()

    @staticmethod
    def delete(datafile_id: int) -> bool:
        with Session() as session:
            if session.query(Datafile).filter(Datafile.id == datafile_id).delete():
                session.commit()
                return True
            return False

    @staticmethod
    def set_df_table_name(id: int, df_table_name):
        with Session() as session:
            session.query(Datafile).filter(Datafile.id == id).update(
                {"df_table_name": df_table_name}
            )
            session.commit()
