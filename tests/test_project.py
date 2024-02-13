import pytest

from tests.utils import RestAPI


@pytest.mark.acceptance
def test_route_upload_datasets(fixt_upload_datasets):
    project_name = fixt_upload_datasets["project_name"]
    project = RestAPI.get_project(project_name)
    assert len(project["datafiles"]) == 2
