(/readme-banner.png)

# Frame Studio

Transforme um vídeo em várias versões com textos, cores, templates e seu @ do Instagram. O processamento acontece no seu computador, sem conta, API de IA ou consumo de tokens.

**Enviar vídeo → escolher template → personalizar → gerar MP4s.**

## Recursos

- Entrada em MP4, MOV ou WebM, até 1 GB por arquivo.
- Templates **Manchete**, **Destaque** e **Cinema**.
- Até 12 variações por lote, com texto e cor individuais.
- @ do Instagram editável, aplicado em todas as versões.
- Prévia de composição e exportação H.264/AAC.
- Mantém a sequência completa e o áudio; redimensiona sem recortar o vídeo. A exportação recodifica o arquivo.

| Formato | Resolução | Proporção |
| --- | --- | --- |
| Reels | 1080 × 1920 | 9:16 |
| Story | 1080 × 1920 | 9:16 |
| Post vertical | 1080 × 1350 | 4:5 |
| Post quadrado | 1080 × 1080 | 1:1 |

O aplicativo gera vídeos para baixar. Não publica nas redes e não cria textos com IA. A capa deste README é ilustrativa; não representa uma captura da interface.

## 1. Instalar os requisitos

1. Instale [Node.js](https://nodejs.org/en/download), versão 22 ou superior, com npm.
2. Instale [FFmpeg](https://ffmpeg.org/download.html). No Windows, a página oficial indica fornecedores de executáveis: extraia o pacote e adicione sua pasta `bin` ao PATH.
3. Abra um novo terminal e confira:

```powershell
node --version
npm --version
ffmpeg -version
```

O FFmpeg precisa incluir `libx264` e o filtro `drawtext`. O projeto usa uma fonte TTF instalada no sistema: procura Arial Bold no Windows/macOS e DejaVu Sans Bold ou Liberation Sans Bold no Linux. Também aceita uma fonte configurada manualmente.

**Validação realizada no Windows.** Há caminhos de fonte previstos para macOS/Linux, mas esses sistemas ainda não foram testados.

## 2. Baixar o projeto

No GitHub, clique em **Code → Download ZIP**, extraia o arquivo e abra um terminal dentro da pasta que contém `package.json`.

Se preferir Git, substitua a URL abaixo pela URL real do repositório publicado:

```sh
git clone https://github.com/SEU-USUARIO/frame-studio.git
cd frame-studio
```

O aplicativo utiliza módulos nativos do Node.js: não há dependências npm para baixar e não precisa executar `npm install`.

## 3. Conferir e iniciar

```sh
npm run doctor
npm start
```

Abra **http://127.0.0.1:4318** no navegador. Mantenha o terminal aberto enquanto usa o estúdio; para encerrar, pressione `Ctrl+C`.

No Windows, você também pode executar **Iniciar.cmd**. Ele verifica os requisitos e inicia o servidor. Abra o endereço informado no terminal.

### Se o FFmpeg não estiver no PATH

Copie `config.example.json` para `config.local.json` e ajuste o caminho para o executável instalado:

```json
{
  "ffmpegPath": "C:/ferramentas/ffmpeg/bin/ffmpeg.exe",
  "fontPath": "",
  "port": 4318
}
```

Use barras `/` nos caminhos JSON. Deixe `fontPath` vazio para detecção automática ou informe o caminho absoluto de uma fonte `.ttf`. Reinicie o servidor após alterações.

Também são aceitas as variáveis de ambiente `FFMPEG_PATH`, `FONT_PATH` e `PORT`; elas têm prioridade sobre o arquivo. O arquivo `config.local.json` fica fora do Git.

## 4. Criar suas versões

1. Arraste o vídeo para a área de upload ou clique para selecioná-lo.
2. Aguarde a mensagem de validação do vídeo.
3. Digite seu **@**: até 30 letras, números, pontos ou sublinhados.
4. Escolha **Reels**, **Story**, **Post vertical** ou **Post quadrado**.
5. Selecione um template:
   - **Manchete:** título centralizado acima do vídeo.
   - **Destaque:** título em caixas coloridas com contraste automático.
   - **Cinema:** vídeo acima e título abaixo.
6. Edite texto e cor de cada variação. Clique no campo de texto para visualizar aquela versão.
7. Adicione ou remova variações; o lote aceita de 1 a 12.
8. Clique em **Gerar variações** e aguarde o processamento sequencial.
9. Baixe os MP4s nos links apresentados ao concluir.

O template, formato e @ escolhidos valem para todo o lote. Textos aceitam até 90 caracteres e palavras de até 25 caracteres. A fonte se ajusta ao espaço reservado; a prévia é aproximada, e a quebra final usa a fonte instalada. Emojis dependem da cobertura da fonte e não são garantidos.

## Arquivos e privacidade

- `data/` guarda a cópia do vídeo enviado e os resultados em subpastas por geração.
- O arquivo original selecionado não é alterado.
- Os arquivos permanecem no disco depois de fechar o aplicativo; tarefas e uploads registrados em memória não persistem após reiniciar.
- Após reiniciar, selecione novamente o vídeo. Resultados antigos continuam acessíveis pela pasta `data/`.
- Para liberar espaço, encerre o servidor e remova somente os arquivos de `data/` de que não precisa mais.
- `data/`, configurações locais e resultados de teste são ignorados pelo Git.

Este é um aplicativo local, sem autenticação, ligado apenas a `127.0.0.1`. Não foi preparado para exposição pública ou múltiplos usuários. GitHub hospeda o código; **GitHub Pages não executa o servidor Node.js nem o FFmpeg**.

## Problemas comuns

| Problema | Como resolver |
| --- | --- |
| `node` ou `npm` não reconhecido | Instale Node.js e reabra o terminal. |
| FFmpeg não encontrado | Configure o PATH ou `ffmpegPath`; execute `npm run doctor`. |
| Fonte não encontrada | Configure `fontPath` com uma fonte TTF instalada. |
| Porta ocupada | Feche a outra instância ou mude `port` em `config.local.json`. |
| Vídeo não aparece na prévia | O navegador pode não suportar o codec; a exportação ainda pode funcionar se o FFmpeg conseguir decodificá-lo. |
| Geração lenta | Vídeos longos e lotes maiores exigem mais CPU e espaço. Aguarde o processamento. |
| Falha na exportação | Confira o terminal, espaço em disco e `npm run doctor`. |
| Página perdeu o upload após reiniciar | Selecione o vídeo novamente. |

## Desenvolvimento e testes

```sh
npm test
npm run test:render
```

O primeiro comando testa as composições e quebras de texto. O segundo usa FFmpeg para criar um vídeo sintético, enviar ao servidor local temporário e conferir uma exportação real. Não usa vídeos pessoais, não requer Playwright e não depende de caminhos do computador do autor. Os artefatos de teste ficam em `test-results/` e `data/`, ignorados pelo Git.

```text
frame-studio/
├── public/                 # Interface e regras de layout compartilhadas
├── docs/readme-banner.png  # Capa do README
├── test/                   # Testes de composição e renderização
├── config.cjs              # Configuração e detecção de fontes
├── config.example.json     # Modelo de configuração local
├── doctor.cjs              # Verificação dos requisitos
├── server.cjs              # Servidor local e integração FFmpeg
├── Iniciar.cmd             # Inicializador Windows
├── package.json
├── README.md
└── LICENSE
```

## Publicar sua cópia no GitHub

1. Crie um repositório vazio chamado `frame-studio` no GitHub. Escolha **Public** para compartilhar com outras pessoas. Não adicione README ou licença pelo site: já estão nesta pasta.
2. No terminal desta pasta, execute os comandos abaixo, substituindo `SEU-USUARIO`:

```sh
git init
git add .
git status
git commit -m "Adiciona Frame Studio"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/frame-studio.git
git push -u origin main
```

Antes do commit, confira no `git status` que não aparecem vídeos, `data/` ou `config.local.json`. O GitHub poderá solicitar autenticação. A capa será exibida automaticamente porque o README usa um caminho relativo dentro do repositório.

Veja também o [guia oficial de repositórios do GitHub](https://docs.github.com/en/repositories/creating-and-managing-repositories/quickstart-for-repositories).

## Licença e créditos

Código distribuído sob a [licença MIT](LICENSE). Node.js, FFmpeg e fontes são instalados separadamente e mantêm suas próprias licenças. Não há executáveis, fontes proprietárias, vídeos de terceiros ou credenciais incluídos no repositório. Use conteúdo que você tenha direito de editar e compartilhar. Capa gerada com IA para este projeto.
