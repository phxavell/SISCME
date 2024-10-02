import re

from django.db.utils import OperationalError as DjangoOperationalError
from django.http import Http404

from common.responses import ErrorResponse
from psycopg2 import OperationalError as Psycopg2OperationalError
from rest_framework.exceptions import APIException, ErrorDetail
from rest_framework.views import exception_handler as drf_exception_handler


def check_exepction(response, exc, error_code):
    pattern = r"ErrorDetail\(string='(.*?)', code='(.*?)'\)"
    matches = re.findall(pattern, str(exc.detail[0]))
    descricao_error = matches[0][0] if matches else "Erro desconhecido"
    if descricao_error == "Erro desconhecido":
        response.data = {
            "status": "error",
            "error": {
                "code": error_code,
                "message": exc.detail[0].capitalize(),
            },
        }
    else:
        response.data = {
            "status": "error",
            "error": {
                "code": error_code,
                "message": descricao_error,
            },
        }


def exception_handler(exc, context):
    """Trata as exceções do framework para retornar um JSON padronizado.

    Args:
        exc (_type_): Exceção a ser tratada.
        context (_type_): Contexto da exceção.

    Returns:
        _type_: Resposta HTTP com o JSON padronizado.
    """

    if isinstance(exc, (Psycopg2OperationalError, DjangoOperationalError)):
        return ErrorResponse(
            error_code="erro_conexao_db",
            error_message="Erro de conexão com o banco de dados. Contate o suporte.",
            status_code=503,
        )

    response = drf_exception_handler(exc, context)

    if isinstance(exc, Http404):
        return ErrorResponse(
            error_code="objeto_nao_encontrado",
            error_message=response.data["detail"],
            status_code=response.status_code,
        )

    if isinstance(exc, PermissionError):
        return ErrorResponse(
            error_code="erro_de_permissao",
            error_message="Erro de permissao. Contate o suporte.",
            status_code=response.status_code,
        )

    if response is not None:
        if issubclass(exc.__class__, (APIException,)) and isinstance(
            exc.get_codes(), list
        ):
            error_code = exc.get_codes()[0]
        else:
            error_code = response.status_code

        if hasattr(exc, "detail") and exc.detail is not None:
            if isinstance(exc.detail, (list, dict)):
                if len(exc.detail) > 1 or isinstance(exc.detail, (dict,)):
                    response.data = {
                        "status": "error",
                        "error": {
                            "code": error_code,
                            "data": exc.detail,
                            "message": "Erro.",
                        },
                    }
                else:
                    check_exepction(response, exc, error_code)
            elif isinstance(exc.detail, ErrorDetail):
                return ErrorResponse(
                    error_code=exc.detail.code,
                    error_message=exc.detail.capitalize(),
                    status_code=response.status_code,
                )
            else:
                response.data = {
                    "status": "error",
                    "error": {
                        "code": error_code,
                        "message": response.data["detail"],
                    },
                }

    return response
