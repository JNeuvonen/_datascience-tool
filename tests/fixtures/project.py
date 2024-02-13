import pytest

from tests.utils import RestAPI


class ProjectFixture:
    name = "ProjectFixture"


@pytest.fixture
def create_project():
    RestAPI.create_project({"name": ProjectFixture.name})
    return ProjectFixture.name
