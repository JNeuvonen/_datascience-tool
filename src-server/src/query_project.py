from sqlalchemy import Column, Integer, String
from decorators import LogException
from orm import Base, Session
from request_types import BodyCreateProject


class Project(Base):
    __tablename__ = "project"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=True, unique=True)


class ProjectQuery:
    @staticmethod
    def create_project_entry(body: BodyCreateProject):
        with LogException():
            with Session() as session:
                data = body.model_dump()
                project = Project(**data)
                session.add(project)
                session.commit()
                return project.id

    @staticmethod
    def retrieve_project(value, field="id"):
        with LogException():
            with Session() as session:
                query = session.query(Project)
                train_job_data = query.filter(getattr(Project, field) == value).first()
                return train_job_data

    @staticmethod
    def retrieve_all_projects():
        with LogException():
            with Session() as session:
                query = session.query(Project)
                return query.all()
