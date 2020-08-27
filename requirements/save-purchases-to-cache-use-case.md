# Gravar compras no cache 

> ## Case de sucesso 
1. Sistema executa o comando "Salvar Compras" 
<!-- 2. Sistema faz um encoding nos dados a serem gravados  -->
3. Sistema cria uma data para ser armazenada no cache 
4. Sistema limpa os dados do cache atual 
5. Sistema grava os novos dados no cache 
6. Sistema não retorna nenhum erro 

> ## Exceção: Erro ao apagar dados do cache 
1. Sistema não grava os novos dados no cache 
2. Sistema retorna erro 

> ## Exceção: Erro ao gravar dados do cache 
1. Sistema retorna erro 
