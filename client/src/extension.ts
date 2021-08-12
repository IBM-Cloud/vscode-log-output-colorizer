import {
    ExtensionContext,
    workspace,
    languages,
    TextDocument,
    Position,
    ProviderResult,
    Range,
    SemanticTokensLegend,
    DocumentSemanticTokensProvider,
    SemanticTokens,
    SemanticTokensBuilder,
    CancellationToken,
    Disposable,
} from 'vscode';

export interface SemanticObject {
  // A Regex compliant string
  pattern: string;
  applies: 'between' | 'eol' | 'eof',
  tokenType: string;
  tokenModifier: string;
}

interface SemanticsFounds {
  // The index of the identifier in the SemanticsProvider
  idIdx: number;
  // The start index of the semantic match token
  matchStartIdx: number;
  matchEndIdx: number;
}

export class OutputColorizerSemanticsProvider implements DocumentSemanticTokensProvider {

  private identifiers: SemanticObject[];
  legend: SemanticTokensLegend;

  constructor(identifierConfig: SemanticObject[]) {
    this.identifiers = identifierConfig;
    const tokenTypes: string[] = [];
    const tokenModifiers: string[] = [];
    identifierConfig.forEach((iConfig) => {
      tokenTypes.push(iConfig.tokenType);
      tokenModifiers.push(iConfig.tokenModifier);
    });
    this.legend = new SemanticTokensLegend(tokenTypes, tokenModifiers);
  }

  provideDocumentSemanticTokens(doc: TextDocument, token: CancellationToken): ProviderResult<SemanticTokens> {
    // analyze the document and return semantic tokens

    const tokensBuilder = new SemanticTokensBuilder(this.legend);
    const text = doc.getText();

    // For now, not sure of async behavior, so we make Regexp every time
    const regexps = this.identifiers.map(i => RegExp(i.pattern, "g"));

    // Get all regexes against the document
    const semanticsFoundMap : SemanticsFounds[] = [];
    for (let i = 0; i < regexps.length; i++) {
      let match = null;
      const regexp = regexps[i];
      do {
        match = null;
        match = regexp.exec(text);
        if (match) {
          semanticsFoundMap.push({
            idIdx: i,
            matchEndIdx: regexp.lastIndex,
            matchStartIdx: regexp.lastIndex - match[0].length,
          });
        }
      } while(match)
    }

    // sort by startIdx
    semanticsFoundMap.sort((a, b) => a.matchStartIdx - b.matchStartIdx)
      .forEach((found, idx) => {
        const identifier = this.identifiers[found.idIdx];
        const startPos = doc.positionAt(found.matchStartIdx);
        let nextSemantic : Position | null = null;
        let endPosition : Position | null = null;
        switch(identifier.applies) {
          case "between":
            tokensBuilder.push(new Range(
              startPos,
              doc.positionAt(found.matchEndIdx),
            ), identifier.tokenType, [identifier.tokenModifier]);
            break;
          case "eol":
            const line = doc.lineAt(startPos.line)
            if (idx < semanticsFoundMap.length - 1) {
              nextSemantic = doc.positionAt(semanticsFoundMap[idx + 1].matchStartIdx);
            }
            
            if (nextSemantic && nextSemantic.line === line.lineNumber) {
              endPosition = new Position(line.lineNumber, nextSemantic.character);
            } else {
              endPosition = new Position(line.lineNumber, line.range.end.character);
            }
            tokensBuilder.push(new Range(
              startPos,
              endPosition,
            ), identifier.tokenType, [identifier.tokenModifier]);
            break;
          case 'eof':
            const eof = doc.positionAt(text.length - 1);
            if (idx < semanticsFoundMap.length - 1) {
              nextSemantic = doc.positionAt(semanticsFoundMap[idx + 1].matchStartIdx)
            }
          
            for(let curLine = startPos.line, end = false; !end && curLine <= eof.line; curLine++) {
              if (nextSemantic && nextSemantic.line === curLine) {
                endPosition = new Position(curLine, nextSemantic.character);
                end = true;
              } else {
                const curLineObj = doc.lineAt(curLine);
                endPosition = new Position(curLine, curLineObj.range.end.character);
              }
              tokensBuilder.push(new Range(
                curLine == startPos.line ? startPos : new Position(curLine, 0),
                endPosition,
              ), identifier.tokenType, [identifier.tokenModifier]);
            }
            break;
        }
      });

    return tokensBuilder.build();
  }
}

let providerDisposable : Disposable;
export function activate(context: ExtensionContext) {

  const semantics = workspace.getConfiguration().get<SemanticObject[]>('outputcolorizer.semantics');
  const provider = new OutputColorizerSemanticsProvider(semantics ?? []);
  providerDisposable = languages.registerDocumentSemanticTokensProvider('Log', provider, provider.legend);

  context.subscriptions.push(workspace.onDidChangeConfiguration(e => {
    if (e.affectsConfiguration('outputcolorizer.semantics')) {
      // Dispose of the old semantics provider
      providerDisposable.dispose();

      const semantics = workspace.getConfiguration().get<SemanticObject[]>('outputcolorizer.semantics');
      const provider = new OutputColorizerSemanticsProvider(semantics ?? []);
      providerDisposable = languages.registerDocumentSemanticTokensProvider('Log', provider, provider.legend);
    }
  }));
}

export function deactivate(): Thenable<void> | undefined {
  if (!providerDisposable) {
    return undefined;
  }
  return providerDisposable.dispose();
}
