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


@pytest.mark.acceptance
def test_route_organize_happy_path(cleanup_db, fixt_upload_datasets):
    project_name = fixt_upload_datasets["project_name"]
    organize_metadata = RestAPI.organize(project_name)
    assert (organize_metadata["common_columns"][0]) == "id"


@pytest.mark.acceptance
def test_set_join_col(cleanup_db, fixt_upload_datasets):
    project_name = fixt_upload_datasets["project_name"]
    organize_metadata = RestAPI.organize(project_name)
    join_col = organize_metadata["common_columns"][0]
    res = RestAPI.set_join_col(project_name, join_col)
    print(res)
