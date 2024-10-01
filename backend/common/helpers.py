from datetime import datetime

from django.utils import timezone

from rest_framework.exceptions import ValidationError


# get with optional date parameters
def validate_date(self):
    initial_date_str = self.request.query_params.get("data_inicial")
    final_date_str = self.request.query_params.get("data_final")

    if initial_date_str == "" and not final_date_str == "":
        raise ValidationError(
            "Forneça corretamente a data inicial.",
            "datas_vazio",
        )

    if not initial_date_str == "" and final_date_str == "":
        raise ValidationError(
            "Forneça corretamente a data final.",
            "datas_vazio",
        )

    if initial_date_str and final_date_str:
        try:
            self.formatted_initial = datetime.strptime(
                initial_date_str, "%d-%m-%Y %H:%M"
            )
            self.formatted_final = datetime.strptime(
                final_date_str, "%d-%m-%Y %H:%M"
            )

            if self.formatted_initial == self.formatted_final:
                raise ValidationError(
                    "As datas fornecidas nao podem ser iguais.",
                    "datas_iguais",
                )

            if self.formatted_initial > self.formatted_final:
                raise ValidationError(
                    "Data inicial nao pode ser superior a final",
                    "datas_incompativeis",
                )

        except ValueError as exc:
            raise ValidationError(
                "Forneça corretamente as datas.",
                "datas_invalidas",
            ) from exc
    else:
        self.formatted_initial = None
        self.formatted_initial = None


def date_format(received_data, date_type):
    try:
        if date_type == "D":
            formatted_date = received_data.strftime("%d-%m-%Y")
        elif date_type == "H":
            formatted_date = received_data.strftime("%H:%M:%S")
        elif date_type == "F":
            formatted_date = received_data.strftime("%d/%m/%Y %H:%M")
            formatted_date = formatted_date.replace("T", "")

        return formatted_date
    except AttributeError:
        return "Dados de entrada inválidos"


def datahora_local_atual():
    return timezone.localtime(timezone.now())


def data_local_atual():
    return datahora_local_atual().date()


def hora_local_atual():
    return datahora_local_atual().time()


def datahora_formato_br(datahora):
    return timezone.localtime(datahora).strftime("%d/%m/%Y %H:%M")


def validate_uuid(uuid):
    if not uuid:
        raise ValidationError(
            "Forneça o uuid.",
            "uuid_vazio",
        )
    if len(uuid) != 36:
        raise ValidationError(
            "Forneça o uuid no formato correto.",
            "uuid_invalido",
        )
    return uuid


def diff_dates(date):
    now = datetime.now(timezone.utc)
    diff = (now - date).total_seconds()

    return diff
