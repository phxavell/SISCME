# Este arquivo fornece um mecanismo de filtragem dinâmica para endpoints do Swagger
# com base no modo definido em settings.SWAGGER_MODE. Quando SWAGGER_MODE="api_externa",
# apenas as classes decoradas com @api_externa serão incluídas na documentação do Swagger.
# Se SWAGGER_MODE for "default", todos os endpoints serão exibidos. A lógica de filtragem
# ocorre na função preprocessing_filter_spec. O decorador @api_externa adiciona as classes
# relevantes a api_externa_classes, e get_decorated_classes agrupa essas classes de acordo
# com o modo de filtro. Essa abordagem oferece flexibilidade na geração de documentação
# Swagger com base nos requisitos específicos do projeto.

from django.conf import settings


api_externa_classes = []


def preprocessing_filter_spec(endpoints):
    filtered = []
    endpoint_filter_mode = getattr(settings, "SWAGGER_MODE", "default")
    class_result = get_decorated_classes()

    if endpoint_filter_mode != "default":
        for path, path_regex, method, callback in endpoints:
            viewset_name = callback.__qualname__.split(".")[0]

            if viewset_name in class_result[f"{endpoint_filter_mode}"]:
                filtered.append((path, path_regex, method, callback))

    else:
        filtered = endpoints

    return filtered


def api_externa(cls):
    api_externa_classes.append(cls)
    return cls


def get_decorated_classes():
    api_externa_class_names = [cls.__name__ for cls in api_externa_classes]
    return {"api_externa": api_externa_class_names}
