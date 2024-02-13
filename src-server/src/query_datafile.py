import logging
import pandas as pd
import sqlite3
from typing import Dict, List

from pandas.compat import os
from config import append_app_data_path
from log import get_logger
from request_types import BodyUploadDatasets
from sqlalchemy import Column, ForeignKey, Integer, String
from constants import TEMP_EXTRACTED_FILES, AppConstants, Messages
from decorators import LogException
from orm import Base, Session
from utils import (
    get_datafile_metadata,
    get_datafile_table_name,
    get_path_last_item,
    run_in_thread,
    unzip_file,
)


class Datafile(Base):
    __tablename__ = "datafile"

    id = Column(Integer, primary_key=True)
    file_name = Column(String, nullable=False)
    size_bytes = Column(Integer)
    distinct_counts = Column(String, nullable=True)
    distinct_values = Column(String, nullable=True)
    was_import = Column(Integer)
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

    @staticmethod
    def get_datafiles_by_project(project_id: int) -> List[Datafile]:
        with Session() as session:
            return (
                session.query(Datafile).filter(Datafile.project_id == project_id).all()
            )

    @staticmethod
    def get_datafile_by_name(datafile: str) -> Datafile:
        with Session() as session:
            return (
                session.query(Datafile).filter(Datafile.file_name == datafile).first()
            )


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


def count_rows(project_name: str, file_path: str, filters: List[str]):
    with LogException():
        where_conditions = "WHERE " + " AND ".join(filters) if filters else ""

        with sqlite3.connect(AppConstants.DB_DATASETS) as conn:
            cursor = conn.cursor()
            query = f'SELECT COUNT(*) FROM "{get_datafile_table_name(project_name, file_path)}" {where_conditions};'
            cursor.execute(query)
            return cursor.fetchone()[0]


def get_dataset_pagination(
    project_name: str, file_path: str, page: int, page_size: int, filters: List[str]
):
    with LogException():
        offset = (page - 1) * page_size

        where_conditions = "WHERE " + " AND ".join(filters) if len(filters) > 0 else ""

        with sqlite3.connect(AppConstants.DB_DATASETS) as conn:
            cursor = conn.cursor()
            query = f'SELECT * FROM "{get_datafile_table_name(project_name, file_path)}" {where_conditions} LIMIT {page_size} OFFSET {offset};'
            cursor.execute(query)
            return cursor.fetchall()


def process_file(project_name, project_id, file_path):
    with sqlite3.connect(AppConstants.DB_DATASETS) as conn:
        first_chunk = True
        for chunk in pd.read_csv(file_path, chunksize=300000, header=0):
            try:
                chunk.to_sql(
                    get_datafile_table_name(
                        project_name, get_path_last_item(file_path)
                    ),
                    conn,
                    if_exists="replace" if first_chunk else "append",
                    index=False,
                )
            except Exception as _:
                pass
            if first_chunk:
                first_chunk = False

        DatafileQuery.create_datafile_entry(
            get_datafile_metadata(file_path, project_id)
        )


async def upload_datasets(project, body: BodyUploadDatasets):
    with LogException():

        def non_blocking():
            try:
                logger = get_logger()
                logger.log(
                    Messages.UPLOAD_FILES.format(
                        FILES_DONE="0", FILES_MAX=len(body.dataset_paths)
                    ),
                    logging.INFO,
                    False,
                    False,
                )
                idx = 0
                for item in body.dataset_paths:
                    datafile_to_sql(project.name, project.id, item)
                    logger.log(
                        Messages.UPLOAD_FILES.format(
                            FILES_DONE=str(idx + 1), FILES_MAX=len(body.dataset_paths)
                        ),
                        logging.INFO,
                        False,
                        False,
                    )
                    idx += 1

                logger = get_logger()
                logger.log(
                    Messages.FILE_UPLOAD_FINISH,
                    logging.INFO,
                    False,
                    False,
                )
            except Exception as e:
                logger = get_logger()
                logger.log(
                    Messages.FILE_UPLOAD_FINISH,
                    logging.INFO,
                    False,
                    False,
                )
                raise e

        run_in_thread(non_blocking)
