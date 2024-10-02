def enum_to_list(enum_cls):
    """
    Converte um Enum para lista de dicionários para representação de opções.

    Args:
    - enum_cls (Enum): Enum a ser convertido.

    Returns:
    - list: Lista de dicionários com as opções do Enum.
    """
    return [
        {"id": choice[0], "valor": choice[1]} for choice in enum_cls.choices
    ]
