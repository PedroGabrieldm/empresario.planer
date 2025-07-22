# 🔧 Tutorial: Configurar OpenAI no Entrepreneur Growth Suite

Este tutorial te ensina como configurar a integração OpenAI para que o sistema possa gerar planos de negócio automaticamente.

## 📋 Pré-requisitos

1. **Conta OpenAI**: Você precisa ter uma conta na OpenAI com créditos disponíveis
2. **Acesso ao Supabase**: Acesso ao painel administrativo do projeto Supabase
3. **Chave de API OpenAI**: Obtida no painel da OpenAI

## 🔑 Passo 1: Obter Chave de API da OpenAI

1. Acesse [platform.openai.com](https://platform.openai.com)
2. Faça login na sua conta
3. Vá para **"API Keys"** no menu lateral
4. Clique em **"Create new secret key"**
5. Dê um nome para a chave (ex: "Entrepreneur Suite")
6. **COPIE A CHAVE** (ela só será mostrada uma vez!)

⚠️ **IMPORTANTE**: A chave tem o formato `sk-proj-...` e deve ser mantida em segredo!

## 🔧 Passo 2: Configurar no Supabase

### Método 1: Painel Web (Recomendado)

1. Acesse o [Painel do Supabase](https://app.supabase.com)
2. Selecione seu projeto
3. Vá para **Settings** > **Edge Functions**
4. Na seção **"Environment Variables"**, clique em **"Add Variable"**
5. **Nome da variável**: `OPENAI_API_KEY`
6. **Valor**: `sua_chave_openai_aqui`
7. Clique em **"Save"** ou **"Add"**
8. Aguarde alguns segundos para a variável ser aplicada

### Método 2: Supabase CLI (Avançado)

Se você tem o Supabase CLI instalado:

```bash
supabase secrets set OPENAI_API_KEY=your_openai_api_key_here
```

## ✅ Passo 3: Verificar Configuração

1. Acesse o sistema em http://localhost:8080
2. Faça login/registro
3. Vá para o **Dashboard**
4. No topo da página, você verá o **Status OpenAI**:
   - ✅ Verde: "OpenAI configurada e funcionando"
   - ❌ Vermelho: "OpenAI não configurada"

## 🧪 Passo 4: Testar Geração de Plano

1. No Dashboard, clique em **"Criar Novo Projeto"**
2. Preencha os campos com uma ideia de negócio
3. Salve o projeto
4. Na página do projeto, clique em **"Gerar Plano de Negócio"**
5. Se configurado corretamente, o plano será gerado em 30-60 segundos

## ❌ Problemas Comuns

### "OpenAI não configurada"
- Verifique se a variável `OPENAI_API_KEY` foi salva corretamente
- Aguarde alguns minutos após salvar (pode demorar para aplicar)
- Verifique se a chave não tem espaços extras

### "Erro ao gerar plano"
- Verifique se você tem créditos na sua conta OpenAI
- Teste a chave em outro lugar para garantir que está válida
- Verifique os logs no painel do Supabase

### "Tempo limite excedido"
- A geração pode demorar até 2 minutos
- Verifique sua conexão com a internet
- Tente novamente em alguns minutos

## 💡 Dicas Importantes

1. **Mantenha a chave segura**: Nunca compartilhe sua chave de API
2. **Monitore uso**: Acompanhe o consumo de créditos no painel da OpenAI
3. **Defina limites**: Configure limites de gasto na OpenAI para evitar surpresas
4. **Backup**: Anote a chave em local seguro (gerenciador de senhas)

## 🔒 Segurança

- ✅ A chave fica segura nas variáveis de ambiente do Supabase
- ✅ Não é exposta no código do frontend
- ✅ Apenas as Edge Functions têm acesso à chave
- ✅ Toda comunicação é criptografada

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs no painel do Supabase
2. Teste a configuração seguindo este tutorial
3. Consulte a documentação da OpenAI
4. Verifique se há créditos suficientes na conta OpenAI

---

🎉 **Pronto!** Agora você pode gerar planos de negócio automaticamente com IA! 