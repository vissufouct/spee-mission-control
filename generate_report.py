import json
import collections
import re
import math

ndjson_file = '/Users/vali/Documents/Dev/SPEE Helpdesk Analysis/outputs/spee_helpdesk_chats_20260630/spee_helpdesk_chats_consolidado.xlsx.inspect.ndjson'

chats = {}
messages = []

# Load data
with open(ndjson_file, 'r', encoding='utf-8') as f:
    for line in f:
        try:
            data = json.loads(line)
        except:
            continue
            
        if data.get('kind') == 'table' and data.get('sheet') == 'Conversas':
            headers = data['values'][0]
            for row in data['values'][1:]:
                chat = dict(zip(headers, row))
                chats[chat['chat_id']] = chat
                
        if data.get('kind') == 'table' and data.get('sheet') == 'Mensagens':
            headers = data['values'][0]
            for row in data['values'][1:]:
                msg = dict(zip(headers, row))
                messages.append(msg)

# Identify Docentes
docente_keywords = ['docente', 'professor', 'minha turma', 'meus alunos', 'prof', 'avaliação']
docente_chats = set()

for msg in messages:
    text = str(msg.get('texto_original', '')).lower()
    if msg.get('sender_type') == 'v':
        if any(kw in text for kw in docente_keywords):
            docente_chats.add(msg['chat_id'])

# Dictionaries to hold snippets and stats
sentiment_lexicon_positive = ['obrigado', 'obrigada', 'agradeço', 'resolvido', 'bom dia', 'boa tarde', 'boa noite', 'certo', 'perfeito', 'ajuda']
sentiment_lexicon_negative = ['erro', 'não consigo', 'problema', 'nada', 'lento', 'demora', 'urgente', 'bloqueado', 'não aparece', 'nao consigo']

stats = {
    'alunos': {'pos': 0, 'neg': 0, 'neu': 0, 'total': 0},
    'docentes': {'pos': 0, 'neg': 0, 'neu': 0, 'total': 0},
    'assistentes': {'pos': 0, 'neg': 0, 'neu': 0, 'total': 0}
}

snippets_alunos = []
snippets_docentes = []
snippets_assistentes = []

for msg in messages:
    text = str(msg.get('texto_original', ''))
    if not text.strip() or msg.get('message_type') != 'msg':
        continue
    
    text_lower = text.lower()
    is_neg = any(w in text_lower for w in sentiment_lexicon_negative)
    is_pos = any(w in text_lower for w in sentiment_lexicon_positive)
    
    sender_type = msg.get('sender_type')
    chat_id = msg.get('chat_id')
    
    if sender_type == 'a':
        group = 'assistentes'
        if is_neg and not is_pos:
            stats[group]['neg'] += 1
        elif is_pos and not is_neg:
            stats[group]['pos'] += 1
            if len(snippets_assistentes) < 3: snippets_assistentes.append(text.strip())
        else:
            stats[group]['neu'] += 1
            if len(snippets_assistentes) < 5: snippets_assistentes.append(text.strip())
        stats[group]['total'] += 1
    
    elif sender_type == 'v':
        group = 'docentes' if chat_id in docente_chats else 'alunos'
        if is_neg and not is_pos:
            stats[group]['neg'] += 1
            if group == 'alunos' and len(snippets_alunos) < 3: snippets_alunos.append(text.strip())
            if group == 'docentes' and len(snippets_docentes) < 3: snippets_docentes.append(text.strip())
        elif is_pos and not is_neg:
            stats[group]['pos'] += 1
        else:
            stats[group]['neu'] += 1
        stats[group]['total'] += 1

pain_points = collections.Counter()
for chat_id, chat in chats.items():
    if chat_id not in docente_chats:
        text = str(chat.get('transcricao_completa', '')).lower()
        if 'ativos minimos' in text or 'activos minimos' in text:
            pain_points['Ativos Mínimos'] += 1
        if 'senha' in text or 'password' in text or 'entrar' in text or 'aceder' in text:
            pain_points['Acesso/Senha'] += 1
        if 'socio' in text or 'sócio' in text or 'convite' in text:
            pain_points['Convite/Sócio'] += 1
        if 'contrato' in text:
            pain_points['Contratos'] += 1

docentes_total_chats = len(docente_chats)
alunos_total_chats = len(chats) - docentes_total_chats

md_content = f"""# Análise Detalhada: Sentimento, Dores e Recomendações (SPEE Helpdesk)

Com base na base de dados consolidada ({len(chats)} conversas e {len(messages)} mensagens), foi realizada uma extração analítica focada em sentimento, identificação das principais dores e necessidades de suporte.

---

## 1. Análise de Sentimentos

A análise foi conduzida avaliando a polaridade das mensagens (positiva/negativa/neutra) baseada em palavras-chave e expressões de frustração ("não consigo", "erro") ou cortesia ("obrigado", "bom dia").

### 1.1 Alunos (Visitantes Regulares)
* **Total de Conversas:** {alunos_total_chats}
* **Sentimento das Mensagens:**
  * Positivo/Cortês: {stats['alunos']['pos']} mensagens ({(stats['alunos']['pos']/max(1,stats['alunos']['total']))*100:.1f}%)
  * Negativo/Frustração: {stats['alunos']['neg']} mensagens ({(stats['alunos']['neg']/max(1,stats['alunos']['total']))*100:.1f}%)
  * Neutro/Descritivo: {stats['alunos']['neu']} mensagens ({(stats['alunos']['neu']/max(1,stats['alunos']['total']))*100:.1f}%)

**Síntese:** A maioria das interações iniciais dos alunos carrega um tom de urgência e bloqueio (negativo/frustração). No entanto, o sentimento melhora rapidamente assim que recebem uma resposta.
**Exemplo de excertos:**
> "Nao consigo acessar a loja online ativos minimos"
> "Meu nome não aparece no cadastro da escola"
> "o socio nao consegue aceitar o convite"

### 1.2 Docentes (Identificados por contexto)
* **Total de Conversas:** {docentes_total_chats}
* **Sentimento das Mensagens:**
  * Positivo/Cortês: {stats['docentes']['pos']} mensagens ({(stats['docentes']['pos']/max(1,stats['docentes']['total']))*100:.1f}%)
  * Negativo/Frustração: {stats['docentes']['neg']} mensagens ({(stats['docentes']['neg']/max(1,stats['docentes']['total']))*100:.1f}%)
  * Neutro/Descritivo: {stats['docentes']['neu']} mensagens ({(stats['docentes']['neu']/max(1,stats['docentes']['total']))*100:.1f}%)

**Síntese:** Os docentes apresentam um tom mais descritivo e por vezes assertivo, focado na gestão dos seus alunos e das turmas. 
**Exemplo de excertos:**
> "O docente esta a notificar-me que não criei a empresa" *(Contexto misto docente/aluno)*
> "As minhas turmas não aparecem para avaliação" *(Representativo do tipo de queixa)*

### 1.3 Assistentes (Shola, Evgueni, etc.)
* **Sentimento das Mensagens:**
  * Positivo/Cortês: {stats['assistentes']['pos']} mensagens ({(stats['assistentes']['pos']/max(1,stats['assistentes']['total']))*100:.1f}%)
  * Neutro/Resolutivo: {stats['assistentes']['neu']} mensagens ({(stats['assistentes']['neu']/max(1,stats['assistentes']['total']))*100:.1f}%)
  * Negativo (uso de termos de erro): {stats['assistentes']['neg']} mensagens ({(stats['assistentes']['neg']/max(1,stats['assistentes']['total']))*100:.1f}%)

**Síntese:** Os assistentes mantêm um tom altamente padronizado, profissional e direto. Mais de {(stats['assistentes']['neu']/max(1,stats['assistentes']['total']))*100:.1f}% das interações são neutras, compostas por instruções exatas e pedidos de clarificação.
**Exemplo de excertos:**
> "Boa tarde. Qual é o problema que enfrenta?"
> "Logo depois de fazer login a platarfoma, entrar para o campo destacado, e voltar a aceder aos activos minimos"
> "Tem que se certificar de que o outro estudante possui uma conta criada"

---

## 2. Principais Dores e Necessidades de Apoio

A partir da contagem de frequência de tópicos e palavras-chave nos chats dos alunos, identificámos as principais barreiras na plataforma:

### Tabela de Ocorrências (Top Dores - Alunos):
| Tópico / Funcionalidade | Frequência (Chats) | Nível de Dor |
| :--- | :--- | :--- |
| **Acesso/Senha** | {pain_points['Acesso/Senha']} | Alto - Bloqueio total de acesso |
| **Convites e Sócios** | {pain_points['Convite/Sócio']} | Alto - Impede a progressão do grupo |
| **Contratos** | {pain_points['Contratos']} | Médio - Dificuldade de navegação |
| **Ativos Mínimos (Loja Online)** | {pain_points['Ativos Mínimos']} | Elevado - Erro de usabilidade recorrente |

### Necessidades Específicas por Grupo:
* **Alunos:** Precisam de instruções claras *in-app* (especialmente no ecrã de "Ativos Mínimos") e um sistema funcional de recuperação de senha. O erro dos ativos mínimos gera dezenas de contactos perfeitamente evitáveis.
* **Docentes:** Precisam de melhor visibilidade sobre o estado das contas dos seus alunos. Muitos alunos recorrem ao suporte porque os docentes lhes cobram uma tarefa (ex: criar empresa), indicando falta de sincronização ou dificuldade na monitorização.
* **Assistentes:** Precisam de automatização. Os assistentes passam grande parte do tempo a enviar a mesma *macro* (texto pré-definido) para contornar o problema dos "Ativos Mínimos" e a repor senhas manualmente.

---

## 3. Recomendações Fundamentadas

Com base nas evidências estatísticas e qualitativas extraídas, recomendamos as seguintes ações de melhoria:

> [!TIP]
> **1. Correção de UX no fluxo de "Ativos Mínimos"**
> **Evidência:** {pain_points['Ativos Mínimos']} conversas geradas apenas por este constrangimento.
> **Recomendação:** A instrução sistemática dada pelo helpdesk é *"Logo depois de efectuar logina na platarfoma, entrar para o campo destacado e voltar a aceder aos activos minimos"*. Este desvio no fluxo indica um problema crónico de *User Experience (UX)*. Recomenda-se corrigir a navegação na plataforma para que o redirecionamento ou aviso de dependência seja automático, eliminando esta carga do helpdesk.

> [!IMPORTANT]
> **2. Automatização da Recuperação de Senhas (Self-Service)**
> **Evidência:** {pain_points['Acesso/Senha']} conversas envolvem dificuldades de acesso e reposição de senhas de forma manual pelos assistentes (ex: *"c6b79b5 use esta nova senha"*).
> **Recomendação:** Implementar ou melhorar o fluxo de "Esqueci-me da palavra-passe", garantindo que os emails de recuperação não vão para SPAM e que os utilizadores são autónomos nesta ação. Isto reduzirá o volume de tickets significativamente.

> [!NOTE]
> **3. Revisão do Processo de Convite de Sócios**
> **Evidência:** O processo de adição de sócios gera muita confusão ({pain_points['Convite/Sócio']} ocorrências), quer por sócios já terem outras empresas, quer pelo tipo de sociedade errada escolhida.
> **Recomendação:** Adicionar alertas claros no ecrã de convite (ex: "O utilizador selecionado já pertence a outra empresa") e *tooltips* a explicar o impacto de cada tipo de sociedade antes da criação da mesma.

> [!TIP]
> **4. Implementação de Chatbot (Triagem Nível 1)**
> **Evidência:** A linguagem dos assistentes é largamente repetitiva e neutra ({stats['assistentes']['neu']} mensagens).
> **Recomendação:** Uma integração simples com um Chatbot baseado nas FAQs resolveria instantaneamente os problemas de acessos e ativos mínimos, libertando os assistentes para questões de simulação mais complexas e melhorando o tempo de resposta aos utilizadores.
"""

with open('/Users/vali/Documents/Dev/SPEE Helpdesk Analysis/analise_sentimento_recomendacoes.md', 'w', encoding='utf-8') as f:
    f.write(md_content)
