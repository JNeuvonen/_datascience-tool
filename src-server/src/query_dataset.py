from sqlalchemy import Column, ForeignKey, Integer, String
from orm import Base, Session


class Project(Base):
    __tablename__ = "model"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=True)
