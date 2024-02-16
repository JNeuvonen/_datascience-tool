import pytest
import pandas as pd

from tests.utils import RestAPI, get_abs_path


class ProjectFixture:
    name = "ProjectFixture"


class Files:
    SIMPLE_1 = "./tests/files/simple_dataset_1.csv"
    SIMPLE_2 = "./tests/files/simple_dataset_2.csv"

    @classmethod
    def count_data_attributes(cls):
        return len(
            [
                attr
                for attr in dir(cls)
                if not callable(getattr(cls, attr)) and not attr.startswith("__")
            ]
        )


PD_SIMPLE_1 = pd.read_csv(Files.SIMPLE_1)


@pytest.fixture
def fixt_create_project():
    RestAPI.create_project({"name": ProjectFixture.name})
    return ProjectFixture.name


@pytest.fixture
def fixt_upload_datasets(fixt_create_project):
    project_name = fixt_create_project
    datasets = [get_abs_path(Files.SIMPLE_1), get_abs_path(Files.SIMPLE_2)]
    RestAPI.upload_datasets(project_name, {"dataset_paths": datasets})

    return {"project_name": project_name}


@pytest.fixture
def fixt_set_common_join_col(fixt_upload_datasets):
    project_name = fixt_upload_datasets["project_name"]
    organize_metadata = RestAPI.organize(project_name)
    join_col = organize_metadata["common_columns"][0]
    RestAPI.set_join_col(project_name, join_col)
    return {"project_name": fixt_upload_datasets["project_name"]}
