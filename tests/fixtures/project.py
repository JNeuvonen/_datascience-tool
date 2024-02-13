import pytest

from tests.utils import RestAPI, get_abs_path


class ProjectFixture:
    name = "ProjectFixture"


class Files:
    SIMPLE_1 = "./tests/files/simple_dataset_1.csv"
    SIMPLE_2 = "./tests/files/simple_dataset_2.csv"


@pytest.fixture
def create_project():
    RestAPI.create_project({"name": ProjectFixture.name})
    return ProjectFixture.name


@pytest.fixture
def upload_datasets(create_project):
    project_name = create_project
    datasets = [get_abs_path(Files.SIMPLE_1), get_abs_path(Files.SIMPLE_2)]
    RestAPI.upload_datasets(project_name, {"dataset_paths": datasets})
    return project_name
