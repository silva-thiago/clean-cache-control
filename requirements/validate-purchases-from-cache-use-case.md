# Validar compras no cache 

> ## Caso de uso 
1. Sistema executa o comando "Validar Compras" 
2. Sistema carrega os dados do cache 
3. Sistema valida se o cache tem menos de 3 dias 

> ## Exceção: Erro ao carregar dados do cache 
1. Sistema limpa o cache 

> ## Exceção: Cache expirado 
1. Sistema limpa o cache 
