# pylint: disable=too-many-lines
# TODO: Dividir em vários arquivos futuramente.
from datetime import datetime

from django.contrib.auth.models import Group
from django.core.validators import EmailValidator, RegexValidator
from django.db import transaction
from django.db.models import Count, Q
from django.utils import timezone as tz

from common import helpers, models
from common.enums import ProgramacaEquipamentoEnum
from rest_framework import serializers
from rest_framework.exceptions import APIException, ValidationError
from rest_framework.serializers import ModelSerializer, SerializerMethodField
from rest_framework.validators import UniqueValidator
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from users.models import User

from .enums import (
    SerialSituacaoStringEnum,
    TipoEquipamentoEnum,
    TipoIntegradorEnum,
)
from .models import (
    Autoclavagem,
    AutoclavagemItem,
    Caixa,
    Caixavalor,
    Cliente,
    Diario,
    Equipamento,
    Itemcaixa,
    Itemdistribuicao,
    Itemproducao,
    Itenstermodesinfeccao,
    MovimentacaoEstoque,
    Profissao,
    Profissional,
    Sequenciaetiqueta,
    Setor,
    SolicitacaoEsterilizacaoModel,
    Termodesinfeccao,
    Tipocaixa,
    TipoOcorrencia,
    Usuario,
)


class UserSerializer(serializers.ModelSerializer):
    nome = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ["id", "username", "nome"]
        depth = 2

    def get_nome(self, user):
        return user.idprofissional.nome


class SerializacaoUser(serializers.ModelSerializer):
    queryset = User.objects.all()
    username = serializers.CharField(
        required=True,
        allow_blank=False,
        allow_null=False,
        validators=[
            UniqueValidator(
                queryset=queryset, message="Nome de usuário já utilizado."
            ),
            RegexValidator(
                regex=r"^[a-z0-9.]+$",
                message="O nome de usuário deve conter apenas letras minúsculas e números.",
                code="username_invalido",
            ),
        ],
    )

    class Meta:
        model = User
        fields = "__all__"
        extra_kwargs = {
            "password": {"write_only": True},
        }

    field_translation = {
        "created": "criado_em",
        "modified": "atualizado_em",
        "password": "senha",
        "is_active": "ativo",
        "is_superuser": "administrador",
        "username": "usuario",
        "last_login": "ultimo_login",
        "groups": "grupos",
        "user_permissions": "permissoes_usuario",
        "idprofissional": "profissional",
    }

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        return {
            self.field_translation.get(key, key): value
            for key, value in rep.items()
        }


class ProdutoSerializer(ModelSerializer):
    """
    Serializador para o modelo produto
    """

    queryset = models.Produto.objects.all()
    descricao = serializers.CharField(
        max_length=90,
        validators=[
            UniqueValidator(
                queryset=queryset,
                message="Já existe produto com essa descrição.",
            ),
        ],
    )

    criado_por = UserSerializer(source="created_by", read_only=True)
    atualizado_por = UserSerializer(source="updated_by", read_only=True)
    criado_em = serializers.DateTimeField(
        source="created_at", read_only=True, format="%d/%m/%Y %H:%M:%S"
    )
    atualizado_em = serializers.DateTimeField(
        source="updated_at", read_only=True, format="%d/%m/%Y %H:%M:%S"
    )

    def create(self, validated_data):
        validated_data["dtcadastro"] = helpers.datahora_local_atual()
        return super().create(validated_data)

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        if rep["idsubtipoproduto"]:
            rep["idsubtipoproduto"] = {
                "id": instance.idsubtipoproduto.idsubtipoproduto,
                "descricao": instance.idsubtipoproduto.descricao,
            }
        if rep["idtipopacote"]:
            rep["idtipopacote"] = {
                "id": instance.idtipopacote.idtipopacote,
                "descricao": instance.idtipopacote.descricao,
            }
        return rep

    class Meta:
        model = models.Produto
        exclude = [
            "created_by",
            "updated_by",
            "created_at",
            "updated_at",
            "dtcadastro",
        ]
        extra_kwargs = {
            "id": {"read_only": True},
            "dtcadastro": {"read_only": True},
        }


class LoteIndicadorEsterilizacaoSerializer(ModelSerializer):
    criado_por = UserSerializer(source="created_by", read_only=True)
    atualizado_por = UserSerializer(source="updated_by", read_only=True)
    criado_em = serializers.DateTimeField(
        source="created_at", read_only=True, format="%d/%m/%Y %H:%M:%S"
    )
    atualizado_em = serializers.DateTimeField(
        source="updated_at", read_only=True, format="%d/%m/%Y %H:%M:%S"
    )

    def validate_fabricacao(self, value):
        vencimento = datetime.strptime(
            self.initial_data["vencimento"], "%Y-%m-%d"
        ).date()

        if value >= vencimento:
            raise serializers.ValidationError(
                "Data de fabricação maior que Vencimento"
            )

        return value

    def validate_vencimento(self, value):
        fabricacao = datetime.strptime(
            self.initial_data["fabricacao"], "%Y-%m-%d"
        ).date()

        if value <= fabricacao:
            raise serializers.ValidationError(
                "Data de vencimento menor que Fabricação"
            )

        return value

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        del rep["indicador"]
        return rep

    class Meta:
        model = models.Lote
        fields = [
            "id",
            "codigo",
            "saldo",
            "fabricacao",
            "vencimento",
            "indicador",
            "criado_por",
            "atualizado_por",
            "criado_em",
            "atualizado_em",
        ]
        extra_kwargs = {"saldo": {"read_only": True}}


class IndicadorEsterilizacaoSerializer(ModelSerializer):
    criado_por = UserSerializer(source="created_by", read_only=True)
    atualizado_por = UserSerializer(source="updated_by", read_only=True)
    criado_em = serializers.DateTimeField(
        source="created_at", read_only=True, format="%d/%m/%Y %H:%M:%S"
    )
    atualizado_em = serializers.DateTimeField(
        source="updated_at", read_only=True, format="%d/%m/%Y %H:%M:%S"
    )
    descricao = serializers.CharField(
        required=True,
        validators=[
            UniqueValidator(
                queryset=models.IndicadoresEsterilizacao.objects.all(),
                message="Já existe um indicador com essa descrição",
                lookup="icontains",
            )
        ],
    )
    codigo = serializers.CharField(
        max_length=15,
        required=True,
        validators=[
            UniqueValidator(
                queryset=models.IndicadoresEsterilizacao.objects.all(),
                message="Já existe um indicador com esse código",
                lookup="icontains",
            )
        ],
    )
    lotes = LoteIndicadorEsterilizacaoSerializer(
        source="lote_set",
        many=True,
        required=False,
    )
    tipo = serializers.CharField(required=True)

    def create(self, validated_data):
        validated_data["dtcadastro"] = helpers.datahora_local_atual()
        validated_data["status"] = "1"
        validated_data["embalagem"] = "Indicadores"
        validated_data["situacao"] = True

        return super().create(validated_data)

    class Meta:
        model = models.IndicadoresEsterilizacao
        fields = [
            "id",
            "descricao",
            "situacao",
            "foto",
            "codigo",
            "tipo",
            "saldo",
            "fabricante",
            "criado_por",
            "atualizado_por",
            "criado_em",
            "atualizado_em",
            "lotes",
        ]
        extra_kwargs = {"saldo": {"read_only": True}}

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        lotes = instance.lote_set.order_by("-id")
        rep["lotes"] = LoteIndicadorEsterilizacaoSerializer(
            lotes, many=True
        ).data
        tipo = rep.pop("tipo")
        rep["tipo"] = f"{tipo} - {TipoIntegradorEnum(tipo).label}"
        return rep


class IndicadoresFormOption(ModelSerializer):
    valor = serializers.SerializerMethodField()
    tipo = serializers.SerializerMethodField()

    def get_tipo(self, obj):
        return obj.indicador.tipo

    def get_valor(self, obj):
        return f"Indicador: {obj.indicador.codigo} | Lote: {obj.codigo} | Saldo: {obj.saldo}"

    class Meta:
        model = models.Lote
        fields = ["id", "valor", "vencimento", "tipo"]


class MovimentacaoLoteSerializer(ModelSerializer):
    criado_por = UserSerializer(source="created_by", read_only=True)
    atualizado_por = UserSerializer(source="updated_by", read_only=True)
    criado_em = serializers.DateTimeField(
        source="created_at", read_only=True, format="%d/%m/%Y %H:%M:%S"
    )
    atualizado_em = serializers.DateTimeField(
        source="updated_at", read_only=True, format="%d/%m/%Y %H:%M:%S"
    )
    quantidade = serializers.IntegerField(
        required=True,
        validators=[
            RegexValidator(
                r"^\d+$",
                message="Quantidade deve ser um número inteiro positivo",
            )
        ],
    )

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep["lote"] = {
            "id": instance.lote.id,
            "codigo": instance.lote.codigo,
            "descricao": instance.lote.indicador.descricao,
            "saldo": instance.lote.saldo,
        }
        return rep

    class Meta:
        model = MovimentacaoEstoque
        fields = [
            "id",
            "lote",
            "operacao",
            "quantidade",
            "criado_por",
            "atualizado_por",
            "criado_em",
            "atualizado_em",
        ]


class SubTipoProdutoSerializer(ModelSerializer):
    """
    Serializador para o modelo subtipoproduto
    """

    queryset = models.Subtipoproduto.objects.all()
    descricao = serializers.CharField(
        max_length=90,
        validators=[
            UniqueValidator(
                queryset=queryset,
                message="Já existe subtipo do produto com essa descrição.",
            ),
        ],
    )

    created_by = UserSerializer(read_only=True)
    updated_by = UserSerializer(read_only=True)

    field_translation = {
        "created_at": "criado_em",
        "updated_at": "atualizado_em",
        "created_by": "criado_por",
        "updated_by": "atualizado_por",
        "idsubtipoproduto": "id",
    }

    def create(self, validated_data):
        validated_data["dtcadastro"] = datetime.now()
        return super().create(validated_data)

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        return {
            self.field_translation.get(key, key): value
            for key, value in rep.items()
        }

    class Meta:
        model = models.Subtipoproduto
        fields = "__all__"
        extra_kwargs = {
            "idsubtipoproduto": {"read_only": True},
            "dtcadastro": {"read_only": True},
        }


class TipoPacoteSerializer(ModelSerializer):
    """
    Serializador para o modelo tipopacote
    """

    queryset = models.Tipopacote.objects.all()
    descricao = serializers.CharField(
        max_length=90,
        validators=[
            UniqueValidator(
                queryset=queryset,
                message="Já existe um tipo de pacote com essa descrição.",
            ),
        ],
    )

    created_by = UserSerializer(read_only=True)
    updated_by = UserSerializer(read_only=True)

    field_translation = {
        "created_at": "criado_em",
        "updated_at": "atualizado_em",
        "created_by": "criado_por",
        "updated_by": "atualizado_por",
        "idtipopacote": "id",
    }

    def create(self, validated_data):
        validated_data["dtcadastro"] = datetime.now()
        return super().create(validated_data)

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        return {
            self.field_translation.get(key, key): value
            for key, value in rep.items()
        }

    class Meta:
        model = models.Tipopacote
        fields = "__all__"
        extra_kwargs = {
            "idtipopacote": {"read_only": True},
            "dtcadastro": {"read_only": True},
        }


class ClienteSerializer(ModelSerializer):
    """
    Serializador para o modelo Cliente-Cnpj
    """

    queryset = models.Cliente.objects.all()

    inscricaoestadualcli = serializers.CharField(
        required=False,
        allow_blank=True,
        label="Inscrição Estadual",
        validators=[
            UniqueValidator(
                queryset=queryset, message="Inscrição estadual já está em uso."
            )
        ],
    )
    inscricaomunicipalcli = serializers.CharField(
        required=False,
        allow_blank=True,
        label="Inscrição Municipal",
        validators=[
            UniqueValidator(
                queryset=queryset,
                message="Inscrição municipal já está em uso.",
            )
        ],
    )
    cnpjcli = serializers.CharField(
        max_length=20,
        min_length=14,
        required=False,
        allow_blank=True,
        label="CNPJ",
        validators=[
            UniqueValidator(
                queryset=queryset, message="Já existe cnpj com esse número."
            ),
            RegexValidator(
                r"^\d{2}\.\d{3}\.\d{3}/\d{4}-\d{2}$",
                message="O CNPJ deve estar no formato XX.XXX.XXX/YYYY-ZZ.",
            ),
        ],
    )

    cepcli = serializers.CharField(
        max_length=10,
        min_length=7,
        required=False,
        allow_blank=True,
        label="CEP",
        validators=[
            RegexValidator(
                regex=r"^\d{5}-\d{3}$",
                message="O CEP deve estar no formato XXXXX-XXX.",
            ),
        ],
    )

    emailcli = serializers.CharField(
        max_length=60,
        required=False,
        allow_blank=True,
        label="E-mail",
        validators=[
            EmailValidator(message="Digite um endereço de e-mail válido.")
        ],
    )

    telefonecli = serializers.CharField(
        max_length=15,
        required=False,
        allow_blank=True,
        label="Telefone",
        validators=[
            RegexValidator(
                regex=r"^\(\d{2}\)\d{4,5}-\d{4}$",
                message=(
                    "Digite um número de telefone válido no formato "
                    "(XX)XXXX-XXXX ou (XX)XXXXX-XXXX."
                ),
            )
        ],
    )

    created_by = UserSerializer(read_only=True)
    updated_by = UserSerializer(read_only=True)

    field_translation = {
        "created_at": "criado_em",
        "updated_at": "atualizado_em",
        "created_by": "criado_por",
        "updated_by": "atualizado_por",
    }

    class Meta:
        model = models.Cliente
        fields = "__all__"
        extra_kwargs = {
            "idcli": {"read_only": True},
            "datacadastrocli": {"read_only": True},
            "horacadastrocli": {"read_only": True},
        }

    def create(self, validated_data):
        validated_data["datacadastrocli"] = datetime.now().date()
        validated_data["horacadastrocli"] = datetime.now().time()
        return super().create(validated_data)

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep["nomefantasiacli"] = self.get_nomefantasiacli(instance)
        return {
            self.field_translation.get(key, key): value
            for key, value in rep.items()
        }

    def validate_inscricaoestadualcli(self, value):
        """
        Validação personalizada para garantir que a inscrição estadual
        contenha apenas números.
        """
        if value and not value.isdigit():
            raise serializers.ValidationError(
                "A inscrição estadual deve conter apenas números."
            )
        return value

    def validate_inscricaomunicipalcli(self, value):
        """
        Validação personalizada para garantir que a inscrição municipal
        contenha apenas números.
        """
        if value and not value.isdigit():
            raise serializers.ValidationError(
                "A inscrição municipal deve conter apenas números."
            )
        return value

    def get_nomefantasiacli(self, obj):
        return obj.nome_exibicao


class EquipamentoSerializer(ModelSerializer):
    """
    Serializador para o modelo equipamento
    """

    queryset = models.Equipamento.objects.all()
    descricao = serializers.CharField(
        max_length=90,
        validators=[
            UniqueValidator(
                queryset=queryset,
                message="Já existe equipamento com essa descrição.",
            ),
        ],
    )
    numero_serie = serializers.CharField(
        max_length=90,
        validators=[
            UniqueValidator(
                queryset=queryset,
                message="Já existe equipamento com esse número  de serie.",
            ),
        ],
    )

    created_by = UserSerializer(read_only=True)
    updated_by = UserSerializer(read_only=True)

    field_translation = {
        "created_at": "criado_em",
        "updated_at": "atualizado_em",
        "created_by": "criado_por",
        "updated_by": "atualizado_por",
    }

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        tipo_id = rep.pop("tipo")
        if tipo_id:
            rep["tipo"] = {
                "id": tipo_id,
                "valor": TipoEquipamentoEnum(tipo_id).label,
            }
        return {
            self.field_translation.get(key, key): value
            for key, value in rep.items()
        }

    def validate_registro_anvisa(self, value):
        """
        Validação personalizada para garantir que o
        registro ANVISA contenha apenas números.
        """
        if value and not value.isdigit():
            raise serializers.ValidationError(
                "A registro ANVISA deve conter apenas números."
            )
        return value

    class Meta:
        model = models.Equipamento
        fields = "__all__"
        extra_kwargs = {
            "idequipamento": {"read_only": True},
        }


class SerializacaoUsuario(ModelSerializer):
    class Meta:
        model = models.Usuario
        fields = [
            "idusu",
            "apelidousu",
            "ativo",
            "datacadastrousu",
            "idprofissional",
            "senhausu",
        ]
        extra_kwargs = {
            "senhausu": {"write_only": True},
        }
        read_only_fields = ["datacadastrousu"]

    def create(self, validated_data):
        validated_data["datacadastrousu"] = datetime.now()
        return super().create(validated_data)


# TODO: Refatorar serializer de profissional para validar permissão para
# requisição put na view invés de acessar o dict de contexto no serializer.
class SerializacaoProfissional(ModelSerializer):
    queryset = models.Profissional.objects.all()
    user = serializers.SerializerMethodField()
    matricula = serializers.CharField(
        required=False, allow_blank=True, allow_null=True
    )
    cpf = serializers.CharField(
        max_length=15,
        min_length=7,
        validators=[
            UniqueValidator(queryset=queryset, message="CPF já utilizado."),
            RegexValidator(
                regex=r"^\d{3}\.\d{3}\.\d{3}-\d{2}$",
                message="CPF deve seguir o formato XXX.XXX.XXX-XX.",
            ),
        ],
    )
    contato = serializers.CharField(
        max_length=15,
        required=False,
        allow_blank=True,
        allow_null=True,
        validators=[
            RegexValidator(
                regex=r"^\(\d{2}\)\d{4,5}-\d{4}$",
                message=(
                    "Digite um número de telefone válido no "
                    "formato (XX)XXXX-XXXX ou (XX)XXXXX-XXXX."
                ),
            )
        ],
    )
    email = serializers.CharField(
        required=False,
        allow_blank=True,
        allow_null=True,
        validators=[
            EmailValidator(message="Digite um endereço de e-mail válido.")
        ],
    )

    def get_user(self, obj):
        try:
            user = User.objects.filter(
                idprofissional=obj.idprofissional
            ).first()
            if user:
                return {
                    "id": user.id,
                    "username": user.username,
                    "grupos": list(user.groups.values_list("id", flat=True)),
                }

            return None
        except User.DoesNotExist:
            return None

    def validate_matricula(self, value):
        """
        Validação personalizada para garantir que a
        matricula contenha apenas números.
        """
        if value and not value.isdigit():
            raise serializers.ValidationError(
                "A matrícula deve conter apenas números."
            )
        return value

    def validate_rt(self, value):
        value = value.upper()
        if value not in ["S", "N"]:
            raise ValidationError(
                "O valor para 'rt' deve ser S ou N.", code="rt_invalido"
            )

        if self.context["request"].method == "PUT" and self.instance.rt == "S":
            return value

        if value == "S" and Profissional.objects.filter(rt="S").exists():
            profissional_responsavel = Profissional.objects.get(rt="S")
            raise ValidationError(
                f"Já existe um profissional responsável, {profissional_responsavel}.",
                code="rt_ja_existe",
            )

        return value

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep["profissao"] = {
            "id": instance.idprofissao.id,
            "descricao": instance.idprofissao.descricao,
        }
        if instance.cliente:
            rep["cliente"] = {
                "id": instance.cliente.idcli,
                "nome": instance.cliente.nomecli,
            }

        del rep["idprofissao"]

        rep = {
            self.field_translation.get(key, key): value
            for key, value in rep.items()
        }

        return rep

    field_translation = {
        "created_at": "criado_em",
        "updated_at": "atualizado_em",
        "created_by": "criado_por",
        "updated_by": "atualizado_por",
    }

    class Meta:
        model = models.Profissional
        fields = "__all__"


class ProfissaoSerializer(ModelSerializer):
    criado_por = UserSerializer(source="created_by", read_only=True)
    criado_em = serializers.DateTimeField(source="created_at", read_only=True)
    atualizado_por = UserSerializer(source="updated_by", read_only=True)
    atualizado_em = serializers.DateTimeField(
        source="updated_at", read_only=True
    )

    class Meta:
        model = Profissao
        exclude = ["created_by", "updated_by", "created_at", "updated_at"]


class SetorSerializer(ModelSerializer):
    criado_por = UserSerializer(source="created_by", read_only=True)
    criado_em = serializers.DateTimeField(source="created_at", read_only=True)
    atualizado_por = UserSerializer(source="updated_by", read_only=True)
    atualizado_em = serializers.DateTimeField(
        source="updated_at", read_only=True
    )

    class Meta:
        model = Setor
        exclude = ["created_by", "updated_by", "created_at", "updated_at"]


class SerializacaoSolicitacao(ModelSerializer):
    situacao = SerializerMethodField()
    cliente = serializers.PrimaryKeyRelatedField(
        queryset=models.Cliente.objects.all()
    )
    created_by = UserSerializer(read_only=True)
    updated_by = UserSerializer(read_only=True)

    def get_situacao(self, obj):
        return obj.get_situacao_display()

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        registros_do_historico = (
            models.HistoricoSolicitacaoEsterilizacaoModel.objects.filter(
                solicitacao_esterilizacao=instance.id
            ).order_by("data")
        )
        flag = models.ColetaEntregaModel.objects.filter(
            solicitacao_esterilizacao=instance.id
        )
        ret["cliente"] = instance.cliente.nome_exibicao
        ret["retorno"] = self.retorno(flag)
        ret["historico"] = self.historico(registros_do_historico)
        ret["data_criacao"] = ret.pop("created_at")
        ret["data_atualizacao"] = ret.pop("updated_at")
        ret["criado_por"] = ret.pop("created_by")
        ret["atualizado_por"] = ret.pop("updated_by")
        return ret

    def historico(self, queryset):
        historico_dict_list = []
        for obj in queryset:
            situacao = obj.status
            data_atualizacao = obj.data.strftime("%Y-%m-%dT%H:%M:%S.%f%z")
            historico_dict = {
                "situacao": situacao,
                "data_atualizacao": data_atualizacao,
            }

            historico_dict_list.append(historico_dict)
        return historico_dict_list

    def retorno(self, queryset):
        if queryset.count() == 1:
            return False
        if queryset.count() == 2:
            return True

        return "Sem Coleta"

    class Meta:
        model = models.SolicitacaoEsterilizacaoModel
        fields = "__all__"


class SerializacaoSolicitacaoitem(ModelSerializer):
    class Meta:
        model = models.SolicitacaoEsterilizacaoItemModel
        fields = "__all__"


class SerializacaoColetaEntrega(ModelSerializer):
    criado_por = UserSerializer(source="created_by", read_only=True)
    criado_em = serializers.DateTimeField(source="created_at", read_only=True)
    atualizado_por = UserSerializer(source="updated_by", read_only=True)
    atualizado_em = serializers.DateTimeField(
        source="updated_at", read_only=True
    )

    class Meta:
        model = models.ColetaEntregaModel
        fields = "__all__"


class CaixaSerialSerializer(ModelSerializer):
    serial = serializers.CharField(source="idsequenciaetiqueta")
    modelo_caixa = serializers.CharField(source="idcaixa.nome")

    class Meta:
        model = models.Sequenciaetiqueta
        fields = ["serial", "modelo_caixa", "situacao"]


class SerializacaoCaixa(ModelSerializer):
    class Meta:
        model = models.Caixa
        fields = "__all__"


class VeiculoSerializer(ModelSerializer):
    """
    Serializador para o modelo Veiculo
    """

    queryset = models.Veiculo.objects.all()
    placa = serializers.CharField(
        max_length=7,
        min_length=7,
        validators=[
            UniqueValidator(
                queryset=queryset, message="Já existe veículo com essa placa."
            ),
            RegexValidator(
                r"(^[a-zA-Z]{3}\d{4}$)|(^[a-zA-Z]{3}\d[a-zA-Z]\d{2}$)",
                message=(
                    "Placa em formato inválido. Deve conter somente "
                    "letras e números, no formato antigo (ABC1234) "
                    "ou novo (Mercosul - ABC1D23)."
                ),
            ),
        ],
    )
    created_by = UserSerializer(read_only=True)
    updated_by = UserSerializer(read_only=True)

    class Meta:
        model = models.Veiculo
        fields = "__all__"
        depth = 1

    field_translation = {
        "created_at": "criado_em",
        "updated_at": "atualizado_em",
        "created_by": "criado_por",
        "updated_by": "atualizado_por",
    }

    def validate_marca(self, value):
        """Padroniza o valor de marca"""
        return value.strip().lower().title()

    def validate_modelo(self, value):
        """Padroniza o valor de modelo"""
        return value.strip().lower().title()

    def validate_placa(self, value):
        """Padroniza o valor de placa"""
        return value.strip().upper()

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        request = self.context.get("request")
        if instance.foto and request:
            rep["foto"] = request.build_absolute_uri(instance.foto.url)
        return {
            self.field_translation.get(key, key): value
            for key, value in rep.items()
        }


class SerializacaoUsuarioGrupo(ModelSerializer):
    class Meta:
        model = models.UsuarioGrupo
        fields = "__all__"


class ItemRecebimentoSerializer(ModelSerializer):
    class Meta:
        model = models.Itemrecebimento
        fields = "__all__"


class SerializacaoCadastroUsuarioProfissional(serializers.Serializer):
    Profissional = SerializacaoProfissional()
    Usuario = SerializacaoUsuario()

    def create(self, validated_data):
        pass

    def update(self, instance, validated_data):
        pass


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    default_error_messages = {
        "no_active_account": "Usuário desativado",
        "no_matching_account": "Usuário não encontrado",
        "invalid_password": "Senha incorreta.",
    }

    def create(self, validated_data):
        pass

    def update(self, instance, validated_data):
        pass

    def validate(self, attrs):
        credentials = {
            self.username_field: attrs.get(self.username_field),
            "password": attrs.get("password"),
        }

        if all(credentials.values()):
            try:
                user = User.objects.get(
                    **{self.username_field: credentials[self.username_field]}
                )

            except User.DoesNotExist as exc:
                raise APIException(
                    self.default_error_messages["no_matching_account"]
                ) from exc

            if not user.is_active:
                raise APIException(
                    self.default_error_messages["no_active_account"]
                )

            if not user.check_password(credentials["password"]):
                raise APIException(
                    self.default_error_messages["invalid_password"]
                )

            data = super().validate(attrs)

            data["user"] = {
                "username": self.user.username,
                "id": self.user.idprofissional.idprofissional,
                "nome": self.user.idprofissional.nome,
            }
            data["permissions"] = self.user.user_permissions.values_list(
                "codename", flat=True
            )
            data["groups"] = self.user.groups.values_list("name", flat=True)
        else:
            raise APIException("Usuario e senha incorretos.")

        return data


class ColetaEntregaSerializer(serializers.ModelSerializer):
    solicitacao_esterilizacao = SerializacaoSolicitacao(read_only=True)
    data_criacao = serializers.DateTimeField(
        source="created_at", read_only=True
    )

    class Meta:
        model = models.ColetaEntregaModel
        fields = ["id", "solicitacao_esterilizacao", "retorno", "data_criacao"]


class ItemCaixaSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField()
    produto = serializers.CharField(source="produto.descricao")
    quantidade = serializers.IntegerField()

    class Meta:
        model = models.Itemcaixa
        fields = ["id", "produto", "quantidade"]


class SolicitacaoEsterilizacaoSerializer(serializers.ModelSerializer):
    cliente = serializers.StringRelatedField()
    recebimento_id = serializers.SerializerMethodField()

    def get_recebimento_id(self, obj):
        if obj.current_recebimento:
            return obj.current_recebimento.idrecebimento
        return None

    class Meta:
        model = models.SolicitacaoEsterilizacaoModel
        fields = ["id", "cliente", "recebimento_id", "situacao"]


class CaixaDetailSerializer(serializers.ModelSerializer):
    serial = serializers.CharField(source="idsequenciaetiqueta")
    cliente = serializers.CharField(source="idcaixa.cliente.nome_exibicao")
    solicitacao_esterilizacao = SolicitacaoEsterilizacaoSerializer(
        source="current_solicitacao_esterilizacao"
    )
    descricao_caixa = serializers.CharField(source="idcaixa.nome")
    codigo_caixa = serializers.CharField(source="idcaixa.codigo_modelo")
    produtos = ItemCaixaSerializer(source="idcaixa.lista_de_itens", many=True)
    total_itens = serializers.SerializerMethodField()

    class Meta:
        model = models.Sequenciaetiqueta
        fields = [
            "serial",
            "cliente",
            "solicitacao_esterilizacao",
            "descricao_caixa",
            "codigo_caixa",
            "produtos",
            "total_itens",
        ]

    def get_total_itens(self, obj):
        return sum(item.quantidade for item in obj.idcaixa.lista_de_itens)


class ProdutoConferenciaSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    produto = serializers.CharField(max_length=200)
    quantidade = serializers.IntegerField()

    def create(self, validated_data):
        pass

    def update(self, instance, validated_data):
        pass


class RecebimentoConferenciaSerializer(serializers.Serializer):
    serial = serializers.CharField(max_length=100)
    recebimento_id = serializers.IntegerField()
    caixa_completa = serializers.BooleanField()
    produtos = ProdutoConferenciaSerializer(many=True)

    def create(self, validated_data):
        pass

    def update(self, instance, validated_data):
        pass


class CaixavalorSerializer(serializers.ModelSerializer):
    valor = serializers.CharField(source="descricao", read_only=True)

    class Meta:
        model = Caixavalor
        fields = ["id", "valor"]


class EquipamentoFormOptionsSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source="idequipamento", read_only=True)
    valor = serializers.CharField(source="descricao", read_only=True)

    class Meta:
        model = Equipamento
        fields = ["id", "valor"]


class TipocaixaSerializer(serializers.ModelSerializer):
    valor = serializers.CharField(source="descricao", read_only=True)

    class Meta:
        model = Tipocaixa
        fields = ["id", "valor"]


class EmbalagemSerializer(serializers.ModelSerializer):
    criado_por = UserSerializer(source="created_by", read_only=True)
    criado_em = serializers.DateTimeField(source="created_at", read_only=True)
    atualizado_por = UserSerializer(source="updated_by", read_only=True)
    atualizado_em = serializers.DateTimeField(
        source="updated_at", read_only=True
    )

    class Meta:
        model = Caixavalor
        exclude = ["created_by", "updated_by", "created_at", "updated_at"]


class TipoDeCaixaSerializer(serializers.ModelSerializer):
    criado_por = UserSerializer(source="created_by", read_only=True)
    criado_em = serializers.DateTimeField(source="created_at", read_only=True)
    atualizado_por = UserSerializer(source="updated_by", read_only=True)
    atualizado_em = serializers.DateTimeField(
        source="updated_at", read_only=True
    )

    class Meta:
        model = Tipocaixa
        exclude = ["created_by", "updated_by", "created_at", "updated_at"]


class ItensCaixaSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    caixa = serializers.PrimaryKeyRelatedField(
        queryset=Caixa.objects.all(), required=False
    )

    class Meta:
        model = Itemcaixa
        fields = ["id", "produto", "criticidade", "quantidade", "caixa"]


class ItensCaixaSerializerReport(ItensCaixaSerializer):
    produto = serializers.SerializerMethodField()
    id = serializers.SerializerMethodField()

    def get_produto(self, instance):
        return instance.produto.descricao

    def get_id(self, instance):
        return instance.produto.pk


class CaixaSerializer(serializers.ModelSerializer):
    codigo_modelo = serializers.CharField(required=False, allow_null=True)
    descricao = serializers.CharField(
        max_length=254, required=True, allow_null=False, allow_blank=False
    )
    instrucoes_uso = serializers.CharField(
        required=True, allow_null=False, allow_blank=False
    )
    prioridade = serializers.IntegerField(required=True, allow_null=False)
    situacao = serializers.IntegerField(required=True, allow_null=False)
    criticidade = serializers.IntegerField(required=True, allow_null=False)
    embalagem = serializers.PrimaryKeyRelatedField(
        queryset=Caixavalor.objects.all()
    )
    itens = ItensCaixaSerializer(many=True, required=True)

    criado_por = serializers.CharField(
        source="created_by.idprofissional.nome", read_only=True
    )
    atualizado_por = serializers.CharField(
        source="updated_by.idprofissional.nome", read_only=True
    )
    criado_em = serializers.DateTimeField(
        source="created_at", read_only=True, format="%d/%m/%Y %H:%M:%S"
    )
    atualizado_em = serializers.DateTimeField(
        source="updated_at", read_only=True, format="%d/%m/%Y %H:%M:%S"
    )
    total_itens = serializers.SerializerMethodField()

    class Meta:
        model = Caixa
        exclude = ["created_by", "updated_by", "created_at", "updated_at"]

    def validate_itens(self, itens):
        if not itens:
            raise serializers.ValidationError(
                "A caixa deve ter pelo menos um item."
            )

        produtos = [item["produto"] for item in itens]

        if len(produtos) != len(set(produtos)):
            raise serializers.ValidationError(
                "A caixa não pode ter produtos repetidos."
            )

        return itens

    def validate_embalagem(self, value):
        if not value:
            raise serializers.ValidationError(
                "O campo embalagem é obrigatório."
            )
        return value

    def get_total_itens(self, obj):
        return sum(item.quantidade for item in obj.itens.all())

    @transaction.atomic
    def create(self, validated_data):
        itens_data = validated_data.pop("itens", [])
        caixa = Caixa(**validated_data)
        caixa.save()

        for item_data in itens_data:
            Itemcaixa.objects.create(caixa=caixa, **item_data)

        return caixa

    @transaction.atomic
    def update(self, instance, validated_data):
        itens_data = validated_data.pop("itens", [])
        instance = super().update(instance, validated_data)

        itens_id_set = set(instance.itens.values_list("id", flat=True))

        for item_data in itens_data:
            item_id = item_data.pop("id", None)
            if item_id in itens_id_set:
                Itemcaixa.objects.filter(id=item_id).update(**item_data)
                itens_id_set.remove(item_id)
            else:
                Itemcaixa.objects.create(caixa=instance, **item_data)

        items_to_delete = Itemcaixa.objects.filter(id__in=itens_id_set)
        items_with_relation = []
        tables = []

        for items in items_to_delete:
            items_with_relation.append(items.check_relations(items, True))

        if any(item is not None for item in items_with_relation):
            products = [item.produto.descricao for item in items_with_relation]

            relations = items_with_relation[0]._meta.related_objects

            for relation in relations:
                tables.append(relation.name)

            raise serializers.ValidationError(
                f"A exclusão do(s) item(s) {', '.join(products)} não é permitida. "
                f"Item(s) atualmente vinculado(s) às seguintes relações: {', '.join(tables)}.",
                "Caixas_relacoes_edicao",
            )

        items_to_delete.delete()

        return instance


class CaixaSerializerReport(CaixaSerializer):
    itens = ItensCaixaSerializerReport(many=True, required=True)


# TODO: Refatorar serializer de profissional para validar permissão para
# requisição put na view invés de acessar o dict de contexto no serializer.
class SerializacaoMotorista(SerializacaoProfissional):
    idprofissional = serializers.SerializerMethodField()

    def get_idprofissional(self, obj):
        if obj.usuario.exists():
            return obj.usuario.first().id
        return None


class AlocarMotoristaSerializer(serializers.Serializer):
    motorista_id = serializers.IntegerField(required=True)

    def create(self, validated_data):
        pass

    def update(self, instance, validated_data):
        pass


class PlantaoSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)
    updated_by = UserSerializer(read_only=True)
    turno = serializers.CharField(
        required=False, allow_blank=True, allow_null=True
    )

    @transaction.atomic
    def create(self, validated_data):
        user = self.context["request"].user
        user_groups = [
            "ADMINISTRADORES",
            "SUPERVISAOENFERMAGEM",
            "ENFERMAGEM",
            "MOTORISTA",
        ]

        grupo = next(
            (
                group
                for group in user_groups
                if group in user.groups.values_list("name", flat=True)
            ),
            None,
        )

        validated_data["datacadastro"] = datetime.now().date()
        validated_data["horacadastro"] = datetime.now().time()
        validated_data["idprofissional"] = user.idprofissional
        validated_data["status"] = "ABERTO"
        validated_data["grupousuario"] = grupo
        validated_data["descricaofechamento"] = ""

        return super().create(validated_data)

    def to_representation(self, instance):
        rep = super().to_representation(instance)

        if instance.idprofissional:
            rep["profissional"] = {
                "id": instance.idprofissional.idprofissional,
                "nome": instance.idprofissional.nome,
            }
            del rep["idprofissional"]
        rep = {
            self.field_translation.get(key, key): value
            for key, value in rep.items()
        }

        return rep

    field_translation = {
        "created_at": "criado_em",
        "updated_at": "atualizado_em",
        "created_by": "criado_por",
        "updated_by": "atualizado_por",
    }

    class Meta:
        model = models.Plantao
        fields = "__all__"
        read_only_fields = [
            "idplantao",
            "idprofissional",
            "grupousuario",
            "datafechamento",
            "horacadastro",
            "horafechamento",
            "datacadastro",
            "status",
            "descricaofechamento",
            "periodo",
        ]


class EventoSerializer(ModelSerializer):
    class Meta:
        model = models.Evento
        fields = "__all__"


class EventoSerializerReduzido(ModelSerializer):
    field_translation = {
        "created_at": "criado_em",
        "updated_at": "atualizado_em",
        "created_by": "criado_por",
        "updated_by": "atualizado_por",
    }

    def get_status(self, obj):
        return obj.get_status_display()

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        if instance.status:
            rep["status"] = SerialSituacaoStringEnum(instance.status).label
        if instance.idusu:
            rep["usuario"] = {
                "id": instance.idusu.idprofissional.idprofissional,
                "nome": instance.idusu.idprofissional.nome,
            }
            del rep["idusu"]

        return {
            self.field_translation.get(key, key): value
            for key, value in rep.items()
        }

    class Meta:
        model = models.Evento
        fields = [
            "idevento",
            "apelidousuarioprimario",
            "created_at",
            "status",
            "nomecliente",
            "idusu",
        ]


class ItensRastreabilidadeBaseSerializer(serializers.ModelSerializer):
    cliente = serializers.SerializerMethodField()
    nome_caixa = serializers.SerializerMethodField()

    def get_cliente(self, obj):
        try:
            cliente = Sequenciaetiqueta.objects.get(
                idsequenciaetiqueta=obj.idsequenciaetiqueta
            ).idcaixa.cliente
        except Sequenciaetiqueta.DoesNotExist:
            cliente = None

        return cliente.nome_exibicao if cliente else "Serial não encontrado"

    def get_nome_caixa(self, obj):
        try:
            nome_caixa = Sequenciaetiqueta.objects.get(
                idsequenciaetiqueta=obj.idsequenciaetiqueta
            ).idcaixa.nome
        except Sequenciaetiqueta.DoesNotExist:
            nome_caixa = None

        return nome_caixa.rstrip() if nome_caixa else "Serial não encontrado"


class ItensAPrepararSerializer(ItensRastreabilidadeBaseSerializer):
    serial = serializers.CharField(source="idsequenciaetiqueta")
    ultimo_registro = serializers.DateTimeField(
        source="datafimtermodesinfecao",
        format="%d/%m/%Y %H:%M",
        default_timezone=tz.get_current_timezone(),
    )
    ciclo = serializers.SerializerMethodField()

    class Meta:
        model = models.Evento
        fields = [
            "serial",
            "nome_caixa",
            "ultimo_registro",
            "ciclo",
            "cliente",
        ]

    def get_ciclo(self, obj):
        ultimo_evento_termo_fim = (
            models.Evento.objects.ultimo_com_status_termo_fim(
                obj.idsequenciaetiqueta
            )
        )
        if ultimo_evento_termo_fim:
            return ultimo_evento_termo_fim.idtermodesinfeccao.ciclo
        return None


class ItensPreparadosSerializer(ItensRastreabilidadeBaseSerializer):
    id = serializers.IntegerField(source="preparo.id")
    serial = serializers.CharField(source="idsequenciaetiqueta")
    data_preparo = serializers.DateTimeField(
        source="dataproducao",
        format="%d/%m/%Y %H:%M",
        default_timezone=tz.get_current_timezone(),
    )
    data_validade = serializers.DateField(
        source="preparo.datavalidade",
        format="%d/%m/%Y",
    )

    class Meta:
        model = models.Evento
        fields = [
            "id",
            "serial",
            "nome_caixa",
            "data_preparo",
            "data_validade",
            "cliente",
        ]


class ItemPreparoSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Itemproducao
        fields = "__all__"


class PreparoSerializer(serializers.ModelSerializer):
    itens = ItemPreparoSerializer(many=True)

    class Meta:
        model = models.Producao
        fields = "__all__"


class ItensCaixaProcessoSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    produto = serializers.CharField(max_length=100)
    quantidade = serializers.IntegerField()
    quantidade_checada = serializers.IntegerField()
    conforme = serializers.BooleanField()

    def create(self, validated_data):
        raise NotImplementedError("Criar objeto não implementado.")

    def update(self, instance, validated_data):
        raise NotImplementedError("Atualizar objeto não implementado.")


class ProcessoPreparoSerializer(serializers.Serializer):
    caixa_completa = serializers.BooleanField()
    produtos = ItensCaixaProcessoSerializer(many=True)
    serial = serializers.CharField(max_length=100)
    cautela = serializers.CharField(
        max_length=10, required=False, allow_null=True, allow_blank=True
    )
    indicador = serializers.IntegerField(required=False)

    def validate_cautela(self, value):
        """
        Verifica se o valor de cautela é uma string vazia e converte para None.
        """
        if value == "":
            return None
        try:
            return int(value)
        except ValueError as exc:
            raise serializers.ValidationError(
                "Cautela deve ser um número inteiro ou vazio."
            ) from exc

    def create(self, validated_data):
        raise NotImplementedError("Criar objeto não implementado.")

    def update(self, instance, validated_data):
        raise NotImplementedError("Atualizar objeto não implementado.")


class ItemProducaoSerializer(serializers.ModelSerializer):
    descricao = serializers.CharField(source="iditemcaixa.produto.descricao")
    quantidade = serializers.IntegerField()

    class Meta:
        model = Itemproducao
        fields = ("descricao", "quantidade")


class EtiquetaEmbalagemPreparoSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField()
    serial = serializers.SerializerMethodField()
    cliente = serializers.SerializerMethodField()
    caixa = serializers.SerializerMethodField()
    quantidade = serializers.IntegerField()
    temperatura = serializers.SerializerMethodField()
    data_validade = serializers.DateField(
        source="datavalidade", format="%d/%m/%Y"
    )
    data_preparo = serializers.DateTimeField(
        source="dataproducao", format="%d/%m/%Y %H:%M"
    )
    usuario_preparo = serializers.CharField(source="idusu.idprofissional.nome")
    usuario_preparo_coren = serializers.CharField(
        source="idusu.idprofissional.coren"
    )
    responsavel_tecnico_nome = serializers.SerializerMethodField()
    responsavel_tecnico_coren = serializers.SerializerMethodField()
    embalagem = serializers.SerializerMethodField()
    itens = serializers.SerializerMethodField()
    ciclo_termodesinfeccao = serializers.SerializerMethodField()

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._responsavel_tecnico = Profissional.objects.filter(rt="S").first()
        self._item_producao = None

    def to_representation(self, instance):
        self._item_producao = instance.itens.first()
        return super().to_representation(instance)

    def get_serial(self, obj):  # pylint: disable=unused-argument
        return (
            self._item_producao.idsequenciaetiqueta.idsequenciaetiqueta
            if self._item_producao
            else None
        )

    def get_cliente(self, obj):  # pylint: disable=unused-argument
        return (
            self._item_producao.idsequenciaetiqueta.idcaixa.cliente.nome_exibicao
            if self._item_producao
            else None
        )

    def get_caixa(self, obj):  # pylint: disable=unused-argument
        return (
            self._item_producao.idsequenciaetiqueta.idcaixa.nome.rstrip()
            if self._item_producao
            else None
        )

    def get_temperatura(self, obj):  # pylint: disable=unused-argument
        return (
            self._item_producao.idsequenciaetiqueta.idcaixa.temperatura
            if self._item_producao
            else None
        )

    def get_responsavel_tecnico_nome(
        self, obj
    ):  # pylint: disable=unused-argument
        return (
            self._responsavel_tecnico.nome
            if self._responsavel_tecnico
            else None
        )

    def get_responsavel_tecnico_coren(
        self, obj
    ):  # pylint: disable=unused-argument
        return (
            self._responsavel_tecnico.coren
            if self._responsavel_tecnico
            else None
        )

    def get_itens(self, obj):
        return ItemProducaoSerializer(obj.itens.all(), many=True).data

    def get_embalagem(self, obj):  # pylint: disable=unused-argument
        embalagem = self._item_producao.idsequenciaetiqueta.idcaixa.embalagem
        return embalagem.descricao if embalagem else None

    def get_ciclo_termodesinfeccao(
        self, obj
    ):  # pylint: disable=unused-argument
        ultima_producao = (
            models.Evento.objects.filter(
                preparo=self._item_producao.idproducao
            )
            .order_by("-idevento")
            .first()
        )
        evento_anterior = (
            models.Evento.objects.filter(
                Q(idevento__lt=ultima_producao.idevento)
                & Q(status="TERMO_FIM")
            )
            .order_by("-idevento")
            .first()
        )

        return evento_anterior.idtermodesinfeccao.ciclo

    class Meta:
        model = models.Producao
        fields = [
            "id",
            "serial",
            "cliente",
            "caixa",
            "quantidade",
            "temperatura",
            "data_validade",
            "data_preparo",
            "cautela",
            "usuario_preparo",
            "usuario_preparo_coren",
            "responsavel_tecnico_nome",
            "responsavel_tecnico_coren",
            "embalagem",
            "itens",
            "ciclo_termodesinfeccao",
            "indicador",
        ]


class DistribuicaoSerializer(ModelSerializer):
    class Meta:
        model = models.Distribuicao
        fields = "__all__"


class HistoricoEtiquetaSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Etiqueta.historico.model
        fields = "__all__"


# TODO: Refatorar serializer de etiqueta para passar idprofissional do usuario na view
# invés de acessar o contexto da requisição no serializer.
class EtiquetaSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)
    updated_by = UserSerializer(read_only=True)

    responsavel_tecnico_nome = serializers.SerializerMethodField()
    responsavel_tecnico_coren = serializers.SerializerMethodField()

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._responsavel_tecnico = Profissional.objects.filter(rt="S").first()
        self._item_producao = None

    def get_responsavel_tecnico_nome(
        self, obj
    ):  # pylint: disable=unused-argument
        return (
            self._responsavel_tecnico.nome
            if self._responsavel_tecnico
            else None
        )

    def get_responsavel_tecnico_coren(
        self, obj
    ):  # pylint: disable=unused-argument
        return (
            self._responsavel_tecnico.coren
            if self._responsavel_tecnico
            else None
        )

    @transaction.atomic
    def create(self, validated_data):
        user = self.context["request"].user
        cliente = Cliente.objects.get(idcli=validated_data["idcli"].idcli)
        if cliente.ativo is False:
            raise ValidationError(
                detail="Não é possível criar uma etiqueta para um cliente desativado.",
                code="cliente_desativado",
            )

        validated_data["datalancamento"] = datetime.now().date()
        validated_data["datafabricacao"] = datetime.now().date()
        validated_data["horalancamento"] = datetime.now().time()
        validated_data["idprofissional"] = user.idprofissional
        # TODO: implementar mecanismo para controle de impressões
        validated_data["qtdimpressao"] = 1
        if "qtd" in validated_data and "qtdimpressao" in validated_data:
            validated_data["totalenvelopado"] = (
                validated_data["qtd"] * validated_data["qtdimpressao"]
            )

        return super().create(validated_data)

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep = {
            self.field_translation.get(key, key): value
            for key, value in rep.items()
        }

        if instance.idcomplemento:
            rep["complemento"] = {
                "id": instance.idcomplemento.id,
                "descricao": instance.idcomplemento.descricao,
            }
        else:
            rep["complemento"] = None
        del rep["idcomplemento"]

        if instance.autoclave:
            rep["autoclave"] = {
                "id": instance.autoclave.pk,
                "descricao": instance.autoclave.descricao,
            }
        if instance.seladora:
            rep["seladora"] = {
                "id": instance.seladora.pk,
                "descricao": instance.seladora.descricao,
            }
        if instance.termodesinfectora:
            rep["termodesinfectora"] = {
                "id": instance.termodesinfectora.pk,
                "descricao": instance.termodesinfectora.descricao,
            }

        if instance.idcli:
            rep["cliente"] = {
                "id": instance.idcli.idcli,
                "nome": instance.idcli.nome_exibicao,
            }
            del rep["idcli"]

        if instance.idprofissional:
            rep["profissional"] = {
                "id": instance.idprofissional.idprofissional,
                "nome": instance.idprofissional.nome,
                "coren": instance.idprofissional.coren,
            }
            del rep["idprofissional"]

        if instance.idproduto:
            rep["produto"] = {
                "id": instance.idproduto.id,
                "descricao": instance.idproduto.descricao,
                "tipoproduto": instance.idproduto.idtipopacote.descricao,
            }
            del rep["idproduto"]
        if instance.temperatura:
            rep["temperatura"] = str(f"{instance.temperatura}°C")
        if instance.setor:
            rep["setor"] = {
                "id": instance.setor.id,
                "descricao": instance.setor.descricao,
            }
        return rep

    def to_internal_value(self, data):
        for field_name in self.fields:
            if field_name in data:
                if (
                    data[field_name] == ""
                    and self.fields[field_name].allow_null
                ):
                    data[field_name] = None

        # pylint: disable=super-with-arguments
        return super(EtiquetaSerializer, self).to_internal_value(data)

    field_translation = {
        "created_at": "criado_em",
        "updated_at": "atualizado_em",
        "created_by": "criado_por",
        "updated_by": "atualizado_por",
    }

    class Meta:
        model = models.Etiqueta
        fields = "__all__"
        read_only_fields = [
            "id",
            "idprofissional",
            "datafabricacao",
            "datalancamento",
            "horalancamento",
            "totalenvelopado",
        ]


class ComplementoSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)
    updated_by = UserSerializer(read_only=True)

    @transaction.atomic
    def create(self, validated_data):
        return super().create(validated_data)

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep = {
            self.field_translation.get(key, key): value
            for key, value in rep.items()
        }

        return rep

    field_translation = {
        "created_at": "criado_em",
        "updated_at": "atualizado_em",
        "created_by": "criado_por",
        "updated_by": "atualizado_por",
    }

    class Meta:
        model = models.Complemento
        fields = "__all__"
        read_only_fields = [
            "idcomplemento",
        ]


class DiarioSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)
    updated_by = UserSerializer(read_only=True)
    dataabertura = serializers.DateField(format="%d/%m/%Y", read_only=True)
    horaabertura = serializers.TimeField(format="%H:%M:%S", read_only=True)
    dataretroativa = serializers.DateField(format="%d/%m/%Y")
    horaretroativa = serializers.TimeField(format="%H:%M:%S")
    datafechamento = serializers.DateField(format="%d/%m/%Y", required=False)
    horafechamento = serializers.TimeField(format="%H:%M:%S", required=False)

    @transaction.atomic
    def create(self, validated_data):
        user = self.context["request"].user
        usuario = Usuario.objects.get(idprofissional=user.idprofissional)

        profissional_responsavel = validated_data.get(
            "profissional_responsavel"
        )
        user_nome = User.objects.get(id=profissional_responsavel.id)

        if profissional_responsavel:
            username = user_nome.username
        else:
            username = "Ocorrencia"

        validated_data["nome_profissional_responsavel"] = username
        validated_data["dataabertura"] = datetime.now().date()
        validated_data["horaabertura"] = datetime.now().time()
        validated_data["statusdiariodeocorrencia"] = "ABERTO"
        validated_data["status"] = "ATIVO"
        validated_data["idusu"] = usuario

        return super().create(validated_data)

    def to_representation(self, instance):
        rep = super().to_representation(instance)

        if instance.idcli:
            rep["cliente"] = {
                "id": instance.idcli.idcli,
                "nome": instance.idcli.nome_exibicao,
            }
            del rep["idcli"]

        if instance.idsetor:
            rep["setor"] = {
                "id": instance.idsetor.id,
                "nome": instance.idsetor.descricao,
            }
            del rep["idsetor"]

        if instance.idusu:
            rep["usuario"] = {
                "id": instance.idusu.idusu,
                "nome": instance.idusu.apelidousu,
            }
            del rep["idusu"]

        if instance.idindicador:
            rep["indicador"] = {
                "id": instance.idindicador.id,
                "nome": instance.idindicador.status,
            }
            del rep["idindicador"]

        rep = {
            self.field_translation.get(key, key): value
            for key, value in rep.items()
        }

        return rep

    def update(self, instance, validated_data):
        profissional_responsavel = validated_data.get(
            "profissional_responsavel", instance.profissional_responsavel
        )

        if profissional_responsavel:
            username = profissional_responsavel.username
        else:
            username = "Ocorrencia"

        validated_data["nome_profissional_responsavel"] = username
        return super().update(instance, validated_data)

    field_translation = {
        "created_at": "criado_em",
        "updated_at": "atualizado_em",
        "created_by": "criado_por",
        "updated_by": "atualizado_por",
    }

    class Meta:
        model = Diario
        fields = "__all__"
        read_only_fields = [
            "id",
            "dataabertura",
            "datafechamento",
            "horaabertura",
            "horafechamento",
            "status",
            "uuid",
            "statusdiariodeocorrencia",
            "descricaoa",
            "nome_profissional_responsavel",
            "idusu",
        ]


class TipoOcorrenciaSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)
    updated_by = UserSerializer(read_only=True)

    @transaction.atomic
    def create(self, validated_data):
        if validated_data["descricao"] == "":
            raise serializers.ValidationError(
                "O campo descrição é obrigatório."
            )
        user = self.context["request"].user
        usuario = Usuario.objects.get(
            idprofissional=user.idprofissional.idprofissional
        )
        validated_data["datalancamento"] = datetime.now().date()
        validated_data["idusu"] = usuario

        return super().create(validated_data)

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep = {
            self.field_translation.get(key, key): value
            for key, value in rep.items()
        }

        return rep

    field_translation = {
        "created_at": "criado_em",
        "updated_at": "atualizado_em",
        "created_by": "criado_por",
        "updated_by": "atualizado_por",
    }

    class Meta:
        model = TipoOcorrencia
        fields = "__all__"
        read_only_fields = ["idindicador", "datalancamento", "idusu", "status"]


class SetorFormOptionsSerializer(serializers.ModelSerializer):
    value = serializers.CharField(source="descricao", read_only=True)

    class Meta:
        model = Setor
        fields = ["id", "value"]


class TipoOcorrenciaFormOptionsSerializer(serializers.ModelSerializer):
    value = serializers.CharField(source="status", read_only=True)

    class Meta:
        model = TipoOcorrencia
        fields = ["id", "value"]


class UserFormOptionsSerializer(serializers.ModelSerializer):
    value = serializers.CharField(source="username", read_only=True)

    class Meta:
        model = User
        fields = ["id", "value"]


class ProcessoEsterilizacaoItensPendentesSerializer(
    ItensRastreabilidadeBaseSerializer
):
    serial = serializers.CharField(source="idsequenciaetiqueta")
    ultimo_registro = serializers.DateTimeField(
        format="%d/%m/%Y %H:%M",
        default_timezone=tz.get_current_timezone(),
    )
    ultima_situacao = serializers.CharField(source="status")
    ciclo = serializers.SerializerMethodField()

    def get_ciclo(self, obj):
        return obj.ciclo or "Ciclo não informado"

    class Meta:
        model = models.Evento
        fields = [
            "serial",
            "nome_caixa",
            "ciclo",
            "cliente",
            "ultimo_registro",
            "ultima_situacao",
        ]


class EquipamentoSimplificadoSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source="idequipamento")

    class Meta:
        model = models.Equipamento
        fields = ["id", "descricao"]


class CiclosEsterilizacaoSerializer(serializers.ModelSerializer):
    data_inicio = serializers.DateTimeField(
        source="datainicio",
        format="%d/%m/%Y %H:%M",
        default_timezone=tz.get_current_timezone(),
    )
    data_fim = serializers.DateTimeField(
        format="%d/%m/%Y %H:%M",
        default_timezone=tz.get_current_timezone(),
    )
    equipamento = EquipamentoSimplificadoSerializer()

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        if rep["indicador"]:
            tipo = instance.indicador.tipo
            tipo = (
                f"{instance.indicador.tipo} - {TipoIntegradorEnum(tipo).label}"
            )
            rep["indicador"] = {
                "id": instance.indicador.pk,
                "descricao": instance.indicador.descricao,
                "tipo": tipo,
            }
        else:
            rep["indicador"] = None
        return rep

    class Meta:
        model = models.Autoclavagem
        fields = [
            "id",
            "ciclo",
            "data_inicio",
            "data_fim",
            "situacao_atual",
            "equipamento",
            "indicador",
        ]


class CiclosTermodesinfeccaoSerializer(serializers.ModelSerializer):
    data_inicio = serializers.DateTimeField(
        source="datainicio",
        format="%d/%m/%Y %H:%M",
        default_timezone=tz.get_current_timezone(),
    )
    data_fim = serializers.DateTimeField(
        format="%d/%m/%Y %H:%M",
        default_timezone=tz.get_current_timezone(),
    )
    equipamento = EquipamentoSimplificadoSerializer()

    class Meta:
        model = models.Termodesinfeccao
        fields = [
            "id",
            "ciclo",
            "data_inicio",
            "data_fim",
            "situacao_atual",
            "equipamento",
        ]


class ItensCicloEsterilizacaoSerializer(serializers.ModelSerializer):
    nome_caixa = serializers.CharField(source="serial.idcaixa", read_only=True)
    cliente = serializers.CharField(
        source="serial.idcaixa.cliente.nome_exibicao", read_only=True
    )

    class Meta:
        model = models.AutoclavagemItem
        fields = [
            "id",
            "serial",
            "nome_caixa",
            "cliente",
        ]


class CicloEsterilizacaoSerializer(serializers.ModelSerializer):
    itens = ItensCicloEsterilizacaoSerializer(many=True)
    data_inicio = serializers.DateTimeField(
        source="datainicio",
        format="%d/%m/%Y %H:%M",
        default_timezone=tz.get_current_timezone(),
    )
    data_fim = serializers.DateTimeField(
        format="%d/%m/%Y %H:%M",
        default_timezone=tz.get_current_timezone(),
    )

    class Meta:
        model = models.Autoclavagem
        fields = [
            "id",
            "ciclo",
            "data_inicio",
            "data_fim",
            "situacao_atual",
            "itens",
        ]


class CicloEsterilizacaoItensCriacaoSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    serial = serializers.PrimaryKeyRelatedField(
        queryset=models.Sequenciaetiqueta.objects.all(), required=True
    )

    class Meta:
        model = models.AutoclavagemItem
        fields = [
            "id",
            "serial",
        ]


class CicloEsterilizacaoCriacaoSerializer(serializers.ModelSerializer):
    itens = CicloEsterilizacaoItensCriacaoSerializer(
        many=True, required=True, allow_null=False
    )
    ciclo = serializers.CharField(required=True)
    programacao = (
        serializers.ChoiceField(
            choices=ProgramacaEquipamentoEnum.choices,
            required=True,
            allow_null=False,
        ),
    )
    equipamento = serializers.PrimaryKeyRelatedField(
        queryset=models.Equipamento.objects.all(),
        required=True,
        allow_null=False,
    )

    def validate_itens(self, itens):
        if not itens:
            raise serializers.ValidationError(
                "O ciclo de esterilização deve ter pelo menos uma caixa."
            )

        seriais = [item["serial"].idsequenciaetiqueta for item in itens]

        if len(seriais) != len(set(seriais)):
            raise serializers.ValidationError(
                "O ciclo de esterilização não pode ter caixas repetidas."
            )

        return itens

    class Meta:
        model = models.Autoclavagem
        fields = [
            "id",
            "ciclo",
            "programacao",
            "equipamento",
            "itens",
        ]


class CicloTermodesinfeccaoItensCriacaoSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    serial = serializers.PrimaryKeyRelatedField(
        queryset=models.Sequenciaetiqueta.objects.all(), required=True
    )

    class Meta:
        model = models.Termodesinfeccao
        fields = [
            "id",
            "serial",
        ]


class CicloTermodesinfeccaoCriacaoSerializer(serializers.ModelSerializer):
    itens = CicloTermodesinfeccaoItensCriacaoSerializer(
        many=True, required=True, allow_null=False
    )
    ciclo = serializers.CharField(required=True)
    programacao = (
        serializers.ChoiceField(
            choices=ProgramacaEquipamentoEnum.choices,
            required=True,
            allow_null=False,
        ),
    )
    equipamento = serializers.PrimaryKeyRelatedField(
        queryset=models.Equipamento.objects.all(),
        required=True,
        allow_null=False,
    )

    def validate_itens(self, itens):
        if not itens:
            raise serializers.ValidationError(
                "O ciclo de esterilização deve ter pelo menos uma caixa."
            )

        seriais = [item["serial"].idsequenciaetiqueta for item in itens]

        if len(seriais) != len(set(seriais)):
            raise serializers.ValidationError(
                "O ciclo de esterilização não pode ter caixas repetidas."
            )

        return itens

    class Meta:
        model = models.Termodesinfeccao
        fields = [
            "id",
            "ciclo",
            "programacao",
            "equipamento",
            "itens",
        ]


class CicloEsterilizacaoResponseSerializer(serializers.ModelSerializer):
    data_inicio = serializers.DateTimeField(
        source="datainicio",
        format="%d/%m/%Y %H:%M",
        default_timezone=tz.get_current_timezone(),
    )
    data_fim = serializers.DateTimeField(
        format="%d/%m/%Y %H:%M",
        default_timezone=tz.get_current_timezone(),
    )
    equipamento = serializers.CharField(source="equipamento.descricao")
    itens = ItensCicloEsterilizacaoSerializer(
        many=True, required=True, allow_null=False
    )
    criado_por = serializers.CharField(
        source="idusu.idprofissional.nome", read_only=True
    )
    atualizado_por = serializers.CharField(
        source="updated_by.idprofissional.nome", read_only=True
    )
    criado_em = serializers.DateTimeField(
        source="created_at",
        read_only=True,
        format="%d/%m/%Y %H:%M",
        default_timezone=tz.get_current_timezone(),
    )
    atualizado_em = serializers.DateTimeField(
        source="updated_at",
        read_only=True,
        format="%d/%m/%Y %H:%M",
        default_timezone=tz.get_current_timezone(),
    )

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        if rep["indicador"]:
            tipo = instance.indicador.tipo
            tipo = (
                f"{instance.indicador.tipo} - {TipoIntegradorEnum(tipo).label}"
            )
            rep["indicador"] = {
                "id": instance.indicador.pk,
                "descricao": instance.indicador.descricao,
                "tipo": tipo,
            }
        return rep

    class Meta:
        model = models.Autoclavagem
        fields = [
            "id",
            "ciclo",
            "data_inicio",
            "data_fim",
            "situacao_atual",
            "equipamento",
            "programacao",
            "criado_por",
            "atualizado_por",
            "criado_em",
            "atualizado_em",
            "indicador",
            "itens",
        ]


class CicloEsterilizacaoResponsetesteSerializer(
    CicloEsterilizacaoResponseSerializer
):
    class Meta:
        model = models.Autoclavagem
        fields = [
            "id",
            "ciclo",
            "data_inicio",
            "data_fim",
            "situacao_atual",
            "equipamento",
            "indicador",
            "programacao",
            "criado_por",
            "atualizado_por",
            "criado_em",
            "atualizado_em",
        ]


class CicloEsterilizacaoCriacaoTesteSerializer(
    CicloEsterilizacaoCriacaoSerializer
):
    indicador = serializers.PrimaryKeyRelatedField(
        queryset=models.IndicadoresEsterilizacao.objects.all(),
        required=True,
        allow_null=False,
    )

    class Meta:
        model = models.Autoclavagem
        fields = ["id", "ciclo", "programacao", "equipamento", "indicador"]


class CicloEsterilizacaoReportResponseSerializer(
    CicloEsterilizacaoResponseSerializer
):
    equipamento = serializers.IntegerField(source="equipamento.idequipamento")

    data_inicio = serializers.DateTimeField(
        source="datainicio",
        format="%d/%m/%Y %H:%M:%S",
        default_timezone=tz.get_current_timezone(),
    )
    data_fim = serializers.DateTimeField(
        format="%d/%m/%Y %H:%M:%S",
        default_timezone=tz.get_current_timezone(),
    )

    class Meta:
        model = models.Autoclavagem
        fields = [
            "id",
            "data_inicio",
            "data_fim",
            "equipamento",
            "itens",
            "duracao",
        ]


class CicloTermodesinfeccaoResponseSerializer(serializers.ModelSerializer):
    data_inicio = serializers.DateTimeField(
        source="datainicio",
        format="%d/%m/%Y %H:%M",
        default_timezone=tz.get_current_timezone(),
    )
    data_fim = serializers.DateTimeField(
        format="%d/%m/%Y %H:%M",
        default_timezone=tz.get_current_timezone(),
    )
    equipamento = serializers.CharField(source="equipamento.descricao")
    itens = ItensCicloEsterilizacaoSerializer(
        many=True, required=True, allow_null=False
    )
    criado_por = serializers.CharField(
        source="idusu.idprofissional.nome", read_only=True
    )
    atualizado_por = serializers.CharField(
        source="updated_by.idprofissional.nome", read_only=True
    )
    criado_em = serializers.DateTimeField(
        source="created_at",
        read_only=True,
        format="%d/%m/%Y %H:%M",
        default_timezone=tz.get_current_timezone(),
    )
    atualizado_em = serializers.DateTimeField(
        source="updated_at",
        read_only=True,
        format="%d/%m/%Y %H:%M",
        default_timezone=tz.get_current_timezone(),
    )

    class Meta:
        model = models.Termodesinfeccao
        fields = [
            "id",
            "ciclo",
            "data_inicio",
            "data_fim",
            "situacao_atual",
            "equipamento",
            "programacao",
            "criado_por",
            "atualizado_por",
            "criado_em",
            "atualizado_em",
            "itens",
        ]


class AutoclavagemItensReportSerializer(serializers.ModelSerializer):
    serial = serializers.CharField(source="serial.idsequenciaetiqueta")
    caixa = serializers.CharField(source="serial.idcaixa.nome")

    class Meta:
        model = AutoclavagemItem
        fields = ("serial", "caixa")


class AutoclavagemReportSerializer(serializers.ModelSerializer):
    lote = serializers.CharField(source="id")
    usuario = serializers.CharField(source="idusu.idprofissional.nome")
    equipamento = serializers.CharField(source="equipamento.descricao")
    ciclo = serializers.CharField()
    data_hora_inicio = serializers.DateTimeField(
        source="datainicio", format="%d/%m/%Y %H:%M"
    )
    data_hora_fim = serializers.DateTimeField(
        source="datafim", format="%d/%m/%Y %H:%M"
    )
    itens_por_cliente = serializers.SerializerMethodField()
    total_itens = serializers.SerializerMethodField()

    class Meta:
        model = Autoclavagem
        fields = (
            "lote",
            "usuario",
            "equipamento",
            "programacao",
            "ciclo",
            "data_hora_inicio",
            "data_hora_fim",
            "itens_por_cliente",
            "total_itens",
        )

    def get_itens_por_cliente(self, obj):
        itens = obj.itens.all().select_related("serial__idcaixa__cliente")
        clientes = {}
        for item in itens:
            cliente_nome = item.serial.idcaixa.cliente.nome_exibicao
            if cliente_nome not in clientes:
                clientes[cliente_nome] = []
            clientes[cliente_nome].append(item)

        return [
            {
                "cliente": cliente,
                "itens": AutoclavagemItensReportSerializer(
                    cliente_itens, many=True
                ).data,
            }
            for cliente, cliente_itens in clientes.items()
        ]

    def get_total_itens(self, obj):
        return obj.itens.count()


class TermodesinfeccaoItensReportSerializer(serializers.ModelSerializer):
    serial = serializers.CharField(source="serial.idsequenciaetiqueta")
    caixa = serializers.CharField(source="serial.idcaixa.nome")

    class Meta:
        model = Itenstermodesinfeccao
        fields = ("serial", "caixa")


class TermodesinfeccaoReportSerializer(serializers.ModelSerializer):
    lote = serializers.CharField(source="id")
    usuario = serializers.CharField(source="idusu.idprofissional.nome")
    equipamento = serializers.CharField(source="equipamento.descricao")
    ciclo = serializers.CharField()
    data_hora_inicio = serializers.DateTimeField(
        source="datainicio", format="%d/%m/%Y %H:%M"
    )
    data_hora_fim = serializers.DateTimeField(
        source="datafim", format="%d/%m/%Y %H:%M"
    )
    itens = serializers.SerializerMethodField()
    total_itens = serializers.SerializerMethodField()

    class Meta:
        model = Termodesinfeccao
        fields = (
            "lote",
            "usuario",
            "equipamento",
            "programacao",
            "ciclo",
            "data_hora_inicio",
            "data_hora_fim",
            "itens",
            "total_itens",
        )

    def get_itens(self, obj):
        itens = obj.itens.all().select_related("serial__idcaixa__cliente")
        clientes = {}
        for item in itens:
            cliente_nome = item.serial.idcaixa.cliente.nome_exibicao
            if cliente_nome not in clientes:
                clientes[cliente_nome] = []
            clientes[cliente_nome].append(item)

        return [
            {
                "cliente": cliente,
                "itens": TermodesinfeccaoItensReportSerializer(
                    cliente_itens, many=True
                ).data,
            }
            for cliente, cliente_itens in clientes.items()
        ]

    def get_total_itens(self, obj):
        return obj.itens.count()


class ItemDistribuicaoSerializer(serializers.ModelSerializer):
    serial = serializers.SlugRelatedField(
        slug_field="idsequenciaetiqueta",
        queryset=Sequenciaetiqueta.objects.all(),
        error_messages={
            "does_not_exist": "Serial '{value}' não existe",
        },
    )

    class Meta:
        model = Itemdistribuicao
        fields = [
            "serial",
        ]


class DistribuicaoCreateSerializer(serializers.Serializer):
    cliente = serializers.PrimaryKeyRelatedField(
        queryset=Cliente.objects.all(), required=True
    )
    setor = serializers.PrimaryKeyRelatedField(
        queryset=Setor.objects.all(), required=True
    )
    cautela = serializers.CharField(max_length=255)
    itens = ItemDistribuicaoSerializer(many=True, required=True)
    solicitacao_esterilizacao = serializers.PrimaryKeyRelatedField(
        queryset=SolicitacaoEsterilizacaoModel.objects.all(),
        required=False,
        allow_null=True,
    )

    def validate_itens(self, itens):
        if not itens:
            raise serializers.ValidationError(
                "A distribuição deve ter pelo menos uma caixa."
            )

        seriais = [item["serial"].idsequenciaetiqueta for item in itens]

        if len(seriais) != len(set(seriais)):
            raise serializers.ValidationError(
                "A distribuição não pode ter caixas repetidas."
            )

        return itens

    def create(self, validated_data):
        raise NotImplementedError("Não implementado no serializer.")


class ItensDistribuidosSerializer(ItensRastreabilidadeBaseSerializer):
    distribuicao = serializers.IntegerField(
        source="iddistribuicao.iddistribuicao"
    )
    data_distribuicao = serializers.DateTimeField(
        source="iddistribuicao.datadistribuicao",
        format="%d/%m/%Y %H:%M",
    )
    data_hora = serializers.DateTimeField(
        source="iddistribuicao.datadistribuicao",
        format="%H:%M",
    )
    usuario = serializers.CharField(
        source="iddistribuicao.idusu.apelidousu",
    )
    setor = serializers.SerializerMethodField()
    quantidade_caixas = serializers.SerializerMethodField()
    solicitacao = serializers.SerializerMethodField()

    def get_setor(self, obj):
        try:
            if obj.iddistribuicao.setor_id:
                return obj.iddistribuicao.setor.descricao
            return None
        except AttributeError:
            return None

    def get_quantidade_caixas(self, obj):
        return obj.iddistribuicao.itemdistribuicao_set.count()

    def get_solicitacao(self, obj):
        if obj.iddistribuicao.solicitacao_esterilizacao_id:
            return obj.iddistribuicao.solicitacao_esterilizacao_id.id

        return "Solicitacao nao informada"

    class Meta:
        model = models.Evento
        fields = [
            "distribuicao",
            "data_distribuicao",
            "data_hora",
            "cliente",
            "usuario",
            "quantidade_caixas",
            "solicitacao",
            "setor",
        ]


class EstoquePorClienteSerializer(serializers.Serializer):
    id = serializers.IntegerField(source="idcaixa")
    modelo = serializers.CharField()
    nome = serializers.CharField()
    estoque = serializers.IntegerField()

    def create(self, validated_data):
        raise NotImplementedError("Não implementado no serializer.")

    def update(self, instance, validated_data):
        raise NotImplementedError("Não implementado no serializer.")


class EstoqueFiltradoPorClienteSerializer(serializers.Serializer):
    id = serializers.SerializerMethodField()
    nome = serializers.SerializerMethodField()
    caixas = serializers.SerializerMethodField()

    def get_caixas(self, obj):
        return obj["itens"]

    def get_nome(self, obj):
        return obj["nome"]

    def get_id(self, obj):
        return obj["id"]

    def create(self, validated_data):
        raise NotImplementedError("Não implementado no serializer.")

    def update(self, instance, validated_data):
        raise NotImplementedError("Não implementado no serializer.")


class CaixasCriticasSerializer(serializers.Serializer):
    id = serializers.IntegerField(source="idcaixa")
    serial = serializers.CharField(source="sequencial")
    modelo = serializers.CharField()
    produzido_em = serializers.DateTimeField(format="%d/%m/%Y %H:%M")
    descricao = serializers.CharField()
    dias_parados = serializers.IntegerField()

    def create(self, validated_data):
        raise NotImplementedError("Não implementado no serializer.")

    def update(self, instance, validated_data):
        raise NotImplementedError("Não implementado no serializer.")


class ClientePorEstoqueSerializer(serializers.Serializer):
    cliente_id = serializers.IntegerField()
    nome = serializers.CharField()
    estoque = serializers.SerializerMethodField()

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        caixas_criticas = rep["estoque"].pop("caixas_criticas", [])
        caixas = CaixasCriticasSerializer(caixas_criticas, many=True)

        rep["estoque"]["caixas_criticas"] = caixas.data
        return rep

    def get_estoque(self, obj):
        return obj["estoque"]

    def create(self, validated_data):
        raise NotImplementedError("Não implementado no serializer.")

    def update(self, instance, validated_data):
        raise NotImplementedError("Não implementado no serializer.")


class CaixaComSeriaisPorClienteSerializer(serializers.Serializer):
    id = serializers.IntegerField(source="caixa_id")
    modelo = serializers.CharField()
    nome = serializers.CharField()
    serial = serializers.CharField(source="sequencial")
    validade = serializers.CharField()
    produzido_em = serializers.CharField()

    def create(self, validated_data):
        raise NotImplementedError("Não implementado no serializer.")

    def update(self, instance, validated_data):
        raise NotImplementedError("Não implementado no serializer.")


class CaixasRecebidasSerializer(ItensRastreabilidadeBaseSerializer):
    serial = serializers.CharField(source="idsequenciaetiqueta")
    data_recebimento = serializers.DateTimeField(
        source="datarecebimento",
        format="%d/%m/%Y %H:%M",
    )
    recebimento = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()
    ultimo_registro = serializers.DateTimeField(
        format="%d/%m/%Y %H:%M",
        default_timezone=tz.get_current_timezone(),
    )
    ultima_situacao = serializers.CharField(source="status")
    foto = serializers.SerializerMethodField()

    def get_foto(self, obj):
        if obj.idrecebimento:
            midias = models.Midia.objects.filter(recebimento=obj.idrecebimento)
            request = self.context.get("request")
            return [
                request.build_absolute_uri(midia.foto.url) for midia in midias
            ]

        return []

    def get_status(self, obj):
        if obj.idrecebimento:
            return obj.idrecebimento.statusrecebimento

        return "ABORTADO"

    def get_recebimento(self, obj):
        if obj.idrecebimento:
            return obj.idrecebimento.idrecebimento

        return None

    class Meta:
        model = models.Evento
        fields = [
            "serial",
            "nome_caixa",
            "recebimento",
            "data_recebimento",
            "status",
            "cliente",
            "ultimo_registro",
            "ultima_situacao",
            "foto",
        ]


class SerialSerializer(serializers.Serializer):
    serial = serializers.CharField(source="idsequenciaetiqueta")
    descricao = serializers.CharField(source="idcaixa.nome")
    cliente = serializers.CharField(source="idcaixa.cliente.nome_exibicao")
    situacao = serializers.SerializerMethodField()

    def get_situacao(self, obj):
        return obj.get_ultima_situacao_display()

    class Meta:
        model = models.Sequenciaetiqueta
        fields = ["serial", "descricao", "cliente", "situacao"]

    def create(self, validated_data):
        raise NotImplementedError("Não implementado no serializer.")

    def update(self, instance, validated_data):
        raise NotImplementedError("Não implementado no serializer.")


class ItemRecebimentoReport(serializers.ModelSerializer):
    descricao = serializers.CharField(source="iditemcaixa.produto.descricao")
    quantidade = serializers.IntegerField()

    class Meta:
        model = models.Itemrecebimento
        fields = ("descricao", "quantidade")


class RecebimentoReportSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source="idrecebimento")
    itens = serializers.SerializerMethodField()
    cliente = serializers.SerializerMethodField()
    profissional = serializers.CharField(source="idusu.idprofissional.nome")
    descricao = serializers.SerializerMethodField()
    embalagem = serializers.SerializerMethodField()
    temperatura = serializers.SerializerMethodField()
    serial = serializers.SerializerMethodField()
    quantidade = serializers.IntegerField()
    datarecebimento = serializers.DateTimeField(
        format="%d/%m/%Y %H:%M",
    )

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._responsavel_tecnico = Profissional.objects.filter(rt="S").first()
        self._item_producao = None

    def to_representation(self, instance):
        self._item_producao = instance.itens.first()
        return super().to_representation(instance)

    def get_cliente(self, obj):  # pylint: disable=unused-argument
        return (
            self._item_producao.idsequenciaetiqueta.idcaixa.cliente.nome_exibicao
            if self._item_producao
            else None
        )

    def get_itens(self, obj):
        return ItemRecebimentoReport(obj.itens.all(), many=True).data

    def get_embalagem(self, obj):  # pylint: disable=unused-argument
        return (
            self._item_producao.idsequenciaetiqueta.idcaixa.tipo_caixa.descricao.rstrip()
            if self._item_producao
            else None
        )

    def get_descricao(self, obj):  # pylint: disable=unused-argument
        return (
            self._item_producao.idsequenciaetiqueta.idcaixa.nome.rstrip()
            if self._item_producao
            else None
        )

    def get_temperatura(self, obj):  # pylint: disable=unused-argument
        return (
            self._item_producao.idsequenciaetiqueta.idcaixa.temperatura.rstrip()
            if self._item_producao
            else None
        )

    def get_serial(self, obj):  # pylint: disable=unused-argument
        return (
            self._item_producao.idsequenciaetiqueta.idsequenciaetiqueta
            if self._item_producao
            else None
        )

    class Meta:
        fields = [
            "id",
            "cliente",
            "profissional",
            "descricao",
            "embalagem",
            "temperatura",
            "datarecebimento",
            "serial",
            "quantidade",
            "itens",
        ]
        model = models.Recebimento


class RegistroManutencaoSerializer(serializers.ModelSerializer):
    field_translation = {
        "created_at": "criado_em",
        "updated_at": "atualizado_em",
        "created_by": "criado_por",
        "updated_by": "atualizado_por",
    }

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep = {
            self.field_translation.get(key, key): value
            for key, value in rep.items()
        }

        if instance.usuario:
            rep["usuario"] = {
                "id": instance.usuario.id,
                "nome": instance.usuario.idprofissional.nome,
            }

        if instance.equipamento:
            rep["equipamento"] = {
                "id": instance.equipamento.idequipamento,
                "descricao": instance.equipamento.descricao,
            }

        rep["duracao"] = f"{instance.duracao}"
        rep["tipo"] = instance.get_tipo_display()

        return rep

    class Meta:
        model = models.RegistroManutencao
        fields = [
            "id",
            "inicio",
            "inicio_planejado",
            "fim",
            "fim_planejado",
            "usuario",
            "equipamento",
            "tipo",
            "descricao",
        ]


class SerialDetalhadoSerializer(SerialSerializer):
    quantidade_itens = serializers.IntegerField(
        source="idcaixa.quantidade_itens"
    )
    ultimo_registro = serializers.DateTimeField(
        format="%d/%m/%Y %H:%M",
        default_timezone=tz.get_current_timezone(),
        source="data_ultima_situacao",
    )

    class Meta:
        model = models.Sequenciaetiqueta
        fields = ["ultimo_registro", "quantidade_itens"]

    def create(self, validated_data):
        raise NotImplementedError("Não implementado no serializer.")

    def update(self, instance, validated_data):
        raise NotImplementedError("Não implementado no serializer.")


class GroupFormOptionsSerializer(serializers.ModelSerializer):
    value = serializers.CharField(source="name")

    class Meta:
        model = Group
        fields = ["id", "value"]


class ClassificacaoDeMaterialSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Etiqueta
        fields = "__all__"


class ErrorDetailSerializer(serializers.Serializer):
    STATUS_CHOICES = (
        ("error_message", "Error"),
        (f"{None}", "Data"),
        ("error", "Error"),
    )
    detail = serializers.ChoiceField(
        choices=STATUS_CHOICES[0], label="datail example: 'error'"
    )
    data = serializers.ChoiceField(
        choices=STATUS_CHOICES[1], label="data example: 'error'"
    )

    def create(self, validated_data):
        pass

    def update(self, instance, validated_data):
        pass


class BadRequestErrorSerializer(serializers.Serializer):
    options = ErrorDetailSerializer.STATUS_CHOICES

    status = serializers.ChoiceField(
        choices=options[2], label="Status example: 'error'"
    )
    error = ErrorDetailSerializer()

    def create(self, validated_data):
        pass

    def update(self, instance, validated_data):
        pass


class ErrorCodeSerializer(serializers.Serializer):
    STATUS_CHOICES = (
        ("error_code", "Error"),
        ("explained message error", "Data"),
        ("error", "Error"),
        (f"{None}", "Error"),
    )
    code = serializers.ChoiceField(
        choices=STATUS_CHOICES[0], label="code example: 'error'"
    )
    message = serializers.ChoiceField(
        choices=STATUS_CHOICES[1], label="message example: 'motivation'"
    )
    data = serializers.ChoiceField(
        choices=STATUS_CHOICES[3], label="data example: ''"
    )

    def create(self, validated_data):
        pass

    def update(self, instance, validated_data):
        pass


class ForbiddenErrorSerializer(serializers.Serializer):
    options = ErrorDetailSerializer.STATUS_CHOICES

    status = serializers.ChoiceField(
        choices=options[2], label="status example: 'error'"
    )
    error = ErrorCodeSerializer()

    def create(self, validated_data):
        pass

    def update(self, instance, validated_data):
        pass


class NotFoundErrorSerializer(serializers.Serializer):
    options = ErrorDetailSerializer.STATUS_CHOICES

    status = serializers.ChoiceField(
        choices=options[2], label="status example: 'error'"
    )
    error = ErrorCodeSerializer()

    def create(self, validated_data):
        pass

    def update(self, instance, validated_data):
        pass


class CaixasPorClientesAguardandoConferencia(serializers.ModelSerializer):
    id = serializers.CharField(source="idcli")
    nome = serializers.CharField(source="nome_exibicao")
    nome_abreviado = serializers.CharField(source="nomeabreviado")

    class Meta:
        model = models.Cliente
        fields = ["id", "nome", "nome_abreviado"]


class RecebimentosPendentesSerializer(serializers.ModelSerializer):
    serial = serializers.CharField(source="idsequenciaetiqueta")
    descricao = serializers.CharField(source="idcaixa.descricao")
    cliente = CaixasPorClientesAguardandoConferencia()
    solicitacao_esterilizacao = SolicitacaoEsterilizacaoSerializer(
        source="current_solicitacao_esterilizacao"
    )
    situacao = serializers.CharField(source="get_ultima_situacao_display")
    ultimo_registro = serializers.SerializerMethodField()

    class Meta:
        model = models.Sequenciaetiqueta
        fields = [
            "serial",
            "descricao",
            "cliente",
            "solicitacao_esterilizacao",
            "situacao",
            "ultimo_registro",
        ]

    def get_ultimo_registro(self, obj):
        return helpers.datahora_formato_br(obj.data_ultima_situacao)


class RecebimentosPendentesResumoSerializer(serializers.ModelSerializer):
    total = serializers.SerializerMethodField()
    por_cliente = serializers.SerializerMethodField()

    class Meta:
        model = models.Sequenciaetiqueta
        fields = [
            "total",
            "por_cliente",
        ]

    # pylint: disable=unused-argument
    def get_total(self, instance):
        return (
            models.Sequenciaetiqueta.objects.caixas_aguardando_conferencia().count()
        )

    def get_por_cliente(self, instance):
        clientes = (
            models.Sequenciaetiqueta.objects.caixas_aguardando_conferencia()
            .values("idcaixa__cliente__idcli")
            .annotate(total=Count("idsequenciaetiqueta"))
        )

        resultados_formatados = []

        for cliente in clientes:
            id_cliente = cliente["idcaixa__cliente__idcli"]
            quantidade = cliente["total"]

            cliente_info = models.Cliente.objects.get(idcli=id_cliente)

            clientes_formatado = {
                "cliente": {
                    "id": cliente_info.idcli,
                    "nome": cliente_info.nome_exibicao,
                    "nome_abreviado": cliente_info.nomeabreviado,
                },
                "quantidade": quantidade,
            }

            resultados_formatados.append(clientes_formatado)

        return resultados_formatados
