from rest_framework.request import Request
from rest_framework.response import Response

from sentry.api.bases.project import ProjectEndpoint
from sentry.ingest import inbound_filters


class ProjectFiltersEndpoint(ProjectEndpoint):
    def get(self, request: Request, project) -> Response:
        """
        List a project's filters

        Retrieve a list of filters for a given project.

            {method} {path}

        """
        results = [
            {
                "id": flt.id,
                "active": inbound_filters.get_filter_state(flt.id, project),
                "description": flt.description,
                "name": flt.name,
                "hello": f"{flt.id} - {flt.name}",
            }
            for flt in inbound_filters.get_all_filter_specs()
        ]

        results.sort(key=lambda x: x["name"])
        return Response(results)
