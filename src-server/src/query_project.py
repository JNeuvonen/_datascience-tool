from enum import unique
from sqlalchemy import Column, ForeignKey, Integer, String
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
