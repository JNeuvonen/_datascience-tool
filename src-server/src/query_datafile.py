import pandas as pd
import sqlite3
from typing import Dict

from pandas.compat import os
from config import append_app_data_path
from sqlalchemy import Column, ForeignKey, Integer, String
from constants import TEMP_EXTRACTED_FILES, AppConstants
from decorators import LogException
from orm import Base, Session
from utils import get_datafile_metadata, unzip_file


class Datafile(Base):
    __tablename__ = "datafile"

    id = Column(Integer, primary_key=True)
    file_name = Column(String, nullable=False)
    size_bytes = Column(Integer)
    project_id = Column(Integer, ForeignKey("project.id"), nullable=False)


class DatafileQuery:
    @staticmethod
    def create_datafile_entry(datafile_info: Dict):
        with LogException():
            with Session() as session:
                entry = Datafile(**datafile_info)
                session.add(entry)
                session.commit()
                return entry.id


def datafile_to_sql(project_name, project_id, file_path: str):
    with LogException():
        if file_path.endswith(".zip"):
            with unzip_file(file_path, append_app_data_path(TEMP_EXTRACTED_FILES)):
                for filename in os.listdir(append_app_data_path(TEMP_EXTRACTED_FILES)):
                    process_file(
                        project_name,
                        project_id,
                        os.path.join(
                            append_app_data_path(TEMP_EXTRACTED_FILES), filename
                        ),
                    )
        else:
            process_file(project_name, project_id, file_path)


def process_file(project_name, project_id, file_path):
    with sqlite3.connect(AppConstants.DB_DATASETS) as conn:
        first_chunk = True
        for chunk in pd.read_csv(file_path, chunksize=300000, header=0):
            chunk.to_sql(
                project_name + "_" + str(project_id),
                conn,
                if_exists="replace" if first_chunk else "append",
                index=False,
            )
            if first_chunk:
                first_chunk = False

        DatafileQuery.create_datafile_entry(
            get_datafile_metadata(file_path, project_id)
        )
