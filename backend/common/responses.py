# Path: backend/common/responses.py

from rest_framework import status
from rest_framework.response import Response


class SuccessResponse(Response):
    """Padroniza a resposta de sucesso da API.

    Args:
        data (_type_): Dados a serem retornados.
        status_code (_type_, optional): Código HTTP de retorno. Defaults to
            status.HTTP_200_OK.
    """

    def __init__(self, data, status_code=status.HTTP_200_OK):
        super().__init__(
            data={
                "status": "success",
                "data": data,
            },
            status=status_code,
        )


class ErrorResponse(Response):
    """Padroniza a resposta de erro da API.

    Args:
        error_code (_type_): Código do erro.
        error_message (_type_): Mensagem do erro.
        error_data (_type_, optional): Dados do erro. Defaults to None.
        status_code (_type_, optional): Código HTTP de retorno. Defaults to
            status.HTTP_500_INTERNAL_SERVER_ERROR.
    """

    def __init__(
        self,
        error_code,
        error_message,
        error_data=None,
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
    ):
        super().__init__(
            data={
                "status": "error",
                "error": {
                    "code": error_code,
                    "message": error_message,
                    "data": error_data,
                },
            },
            status=status_code,
        )


class SuccessNoContentResponse(Response):
    """Padroniza a resposta de sucesso da API sem conteúdo."""

    def __init__(self):
        super().__init__(
            data={
                "status": "success",
            },
            status=status.HTTP_204_NO_CONTENT,
        )


class MethodNotAllowedResponse(Response):
    """Erro para metodos nao permitidos."""

    def __init__(self, error_message="Método não permitido"):
        super().__init__(
            data={
                "status": "error",
                "error": {
                    "code": "method_not_allowed",
                    "message": error_message,
                },
            },
            status=status.HTTP_405_METHOD_NOT_ALLOWED,
        )


class SucessfullyCrudResponse(Response):
    def __init__(
        self,
        data: dict | list,
        nome_entidade: str,
        is_creation: bool,
        campo_um: str,
        campo_dois: str = None,
        campo_tres: str = None,
    ):  # pylint: disable=too-many-arguments
        status_code = (
            status.HTTP_201_CREATED if is_creation else status.HTTP_200_OK
        )
        action = "criado" if is_creation else "atualizado"

        campos = [
            campo for campo in [campo_um, campo_dois, campo_tres] if campo
        ]
        super().__init__(
            data={
                "status": "success",
                "message": f"{nome_entidade} {action} com sucesso!\n{' | '.join(campos)}",
                "data": data,
            },
            status=status_code,
        )
