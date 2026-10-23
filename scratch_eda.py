import json
import collections
import re

ndjson_file = '/Users/vali/Documents/Dev/SPEE Helpdesk Analysis/outputs/spee_helpdesk_chats_20260630/spee_helpdesk_chats_consolidado.xlsx.inspect.ndjson'

chats = []
messages = []

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
                chats.append(chat)
                
        if data.get('kind') == 'table' and data.get('sheet') == 'Mensagens':
            headers = data['values'][0]
            for row in data['values'][1:]:
                msg = dict(zip(headers, row))
                messages.append(msg)

print(f"Total Chats: {len(chats)}")
print(f"Total Messages: {len(messages)}")

# Keyword analysis to find Docentes
docente_keywords = ['docente', 'professor', 'minha turma', 'meus alunos', 'prof', 'avaliação']
docente_chats = set()

for msg in messages:
    text = str(msg.get('texto_original', '')).lower()
    if msg.get('sender_type') == 'v':
        if any(kw in text for kw in docente_keywords):
            docente_chats.add(msg['chat_id'])

print(f"Chats identifying as Docentes: {len(docente_chats)}")

# Find common pain points (Alunos)
pain_points = collections.Counter()
for chat in chats:
    if chat['chat_id'] not in docente_chats:
        text = str(chat.get('transcricao_completa', '')).lower()
        if 'ativos minimos' in text or 'activos minimos' in text:
            pain_points['Ativos Mínimos'] += 1
        if 'senha' in text or 'password' in text or 'entrar' in text or 'aceder' in text:
            pain_points['Acesso/Senha'] += 1
        if 'socio' in text or 'sócio' in text or 'convite' in text:
            pain_points['Convite/Sócio'] += 1
        if 'contrato' in text:
            pain_points['Contratos'] += 1

print("Top Pain Points (Alunos):", pain_points.most_common())
