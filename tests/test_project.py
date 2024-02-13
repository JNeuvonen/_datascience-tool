import pytest
from tests.fixtures.project import PD_SIMPLE_1, Files

from tests.utils import RestAPI, get_path_last_item


@pytest.mark.acceptance
def test_route_upload_datasets(cleanup_db, fixt_upload_datasets):
    project_name = fixt_upload_datasets["project_name"]
    project = RestAPI.get_project(project_name)
    assert len(project["datafiles"]) == Files.count_data_attributes()


@pytest.mark.acceptance
def test_route_get_datafile(cleanup_db, fixt_upload_datasets):
    project_name = fixt_upload_datasets["project_name"]
    file_name = get_path_last_item(Files.SIMPLE_1)
    project_cols = RestAPI.get_project_file(project_name, file_name)
    assert len(project_cols) == len(PD_SIMPLE_1.columns)
