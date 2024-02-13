from typing import Dict, List

from sqlalchemy import Column, ForeignKey, Integer, String
from decorators import LogException
from orm import Base, Session


class Datafile(Base):
    __tablename__ = "datafile"

    id = Column(Integer, primary_key=True)
    file_name = Column(String, nullable=False, unique=True)
    size_bytes = Column(Integer)
    distinct_counts = Column(String, nullable=True)
    distinct_values = Column(String, nullable=True)
    was_import = Column(Integer)
    join_column = Column(String, nullable=True)
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
    def get_datafiles_by_project(project_id) -> List[Datafile]:
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

    @staticmethod
    def update_join_column(datafile_id: int, join_column: str):
        with Session() as session:
            session.query(Datafile).filter(Datafile.id == datafile_id).update(
                {"join_column": join_column}
            )
            session.commit()
