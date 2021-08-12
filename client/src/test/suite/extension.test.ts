import * as vscode from 'vscode';
import { expect } from 'chai';
import { SemanticObject, OutputColorizerSemanticsProvider } from '../../extension'

let doc : vscode.TextDocument;


function getSemanticToken(tokens: vscode.SemanticTokens, legend: vscode.SemanticTokensLegend, idx: number) {
    const i = idx*5;
    return {
        deltaLine: tokens.data[i],
        deltaStart: tokens.data[i+1],
        length: tokens.data[i+2],
        tokenType: legend.tokenTypes[tokens.data[i+3]],
        tokenModifier: legend.tokenModifiers.filter((tMod, _idx) => !!((1 << _idx) & tokens.data[i+4]))
    }
}

// We use vscode integration so that we can generate text documents
suite('Semantic Provider Test Suite', () => {
    vscode.window.showInformationMessage('Start all tests.');

    let docWithSemantics = 'This is some content {error}\n and an [info] plus\n an (eol style heading \n and (eol with a [info] block\n and a eof with \n multiple lines \n and a (eol stop';

    suiteSetup(async () => {
        const promise = new Promise<vscode.TextDocument>((resolve, reject) => {
            vscode.workspace.openTextDocument({
                language: 'Log',
                content: docWithSemantics,
            }).then( doc => {
                resolve(doc);
            });
        })
    
        doc = await promise;
    })

    const errorBetween : SemanticObject = {
        pattern: '{.*}',
        applies: 'between',
        tokenType: 'error',
        tokenModifier: 'output',
    };
    const infoBetween : SemanticObject = {
        pattern: '\\[.*\\]',
        applies: 'between',
        tokenType: 'info',
        tokenModifier: 'output2',
    };
    const eol : SemanticObject = {
        pattern: '\\(eol',
        applies: 'eol',
        tokenType: 'eoltype',
        tokenModifier: 'output3',
    };
    const eof : SemanticObject = {
        pattern: 'eof',
        applies: 'eof',
        tokenType: 'therest',
        tokenModifier: 'output4',
    }

    const dummyCancellationToken : vscode.CancellationToken = {
        isCancellationRequested: false,
        onCancellationRequested: (listener) => { return new vscode.Disposable(() => {}) },
    }

    test('Applies between semantics', () => {
        const provider = new OutputColorizerSemanticsProvider([errorBetween, infoBetween]);
        const result = provider.provideDocumentSemanticTokens(doc, dummyCancellationToken) as vscode.SemanticTokens;
        const error = getSemanticToken(result, provider.legend, 0);
        const info1 =  getSemanticToken(result, provider.legend, 1);
        const info2 =  getSemanticToken(result, provider.legend, 2);

        expect(error).to.eql({
            deltaLine: 0,
            deltaStart: 21,
            length: 7,
            tokenType: 'error',
            tokenModifier: ['output']
        });
        expect(info1).to.eql({
            deltaLine: 1,
            deltaStart: 8,
            length: 6,
            tokenType: 'info',
            tokenModifier: ['output2']
        });
        expect(info2).to.eql({
            deltaLine: 2,
            deltaStart: 17,
            length: 6,
            tokenType: 'info',
            tokenModifier: ['output2']
        });
    });

    test('Applies eol semantics', () => {
        const provider = new OutputColorizerSemanticsProvider([errorBetween, infoBetween, eol]);
        const result = provider.provideDocumentSemanticTokens(doc, dummyCancellationToken) as vscode.SemanticTokens;
        const error = getSemanticToken(result, provider.legend, 0);
        const info1 =  getSemanticToken(result, provider.legend, 1);
        const eol1 = getSemanticToken(result, provider.legend, 2);
        const eol2 =  getSemanticToken(result, provider.legend, 3);
        const info2 =  getSemanticToken(result, provider.legend, 4);

        expect(error).to.eql({
            deltaLine: 0,
            deltaStart: 21,
            length: 7,
            tokenType: 'error',
            tokenModifier: ['output']
        });
        expect(info1).to.eql({
            deltaLine: 1,
            deltaStart: 8,
            length: 6,
            tokenType: 'info',
            tokenModifier: ['output2']
        });
        expect(eol1).to.eql({
            deltaLine: 1,
            deltaStart: 4,
            length: 19,
            tokenType: 'eoltype',
            tokenModifier: ['output3']
        })
        expect(eol2).to.eql({
            deltaLine: 1,
            deltaStart: 5,
            length: 12,
            tokenType: 'eoltype',
            tokenModifier: ['output3']
        })
        expect(info2).to.eql({
            deltaLine: 0,
            deltaStart: 12,
            length: 6,
            tokenType: 'info',
            tokenModifier: ['output2']
        });
    })
    test('Applies eof semantics', () => {
        const provider = new OutputColorizerSemanticsProvider([eol, eof]);
        const result = provider.provideDocumentSemanticTokens(doc, dummyCancellationToken) as vscode.SemanticTokens;
        const eol1 = getSemanticToken(result, provider.legend, 0);
        const eol2 =  getSemanticToken(result, provider.legend, 1);
        const eof1 =  getSemanticToken(result, provider.legend, 2);
        // Currently we make each line semantic
        const eof2 = getSemanticToken(result, provider.legend, 3);
        const eof3 = getSemanticToken(result, provider.legend, 4);
        const eol3 =  getSemanticToken(result, provider.legend, 5);

        expect(eol1).to.eql({
            deltaLine: 2,
            deltaStart: 4,
            length: 19,
            tokenType: 'eoltype',
            tokenModifier: ['output3']
        });
        expect(eol2).to.eql({
            deltaLine: 1,
            deltaStart: 5,
            length: 24,
            tokenType: 'eoltype',
            tokenModifier: ['output3']
        });
        expect(eof1).to.eql({
            deltaLine: 1,
            deltaStart: 7,
            length: 9,
            tokenType: 'therest',
            tokenModifier: ['output4']
        });
        expect(eof2).to.eql({
            deltaLine: 1,
            deltaStart: 0,
            length: 16,
            tokenType: 'therest',
            tokenModifier: ['output4']
        });
        expect(eof3).to.eql({
            deltaLine: 1,
            deltaStart: 0,
            length: 7,
            tokenType: 'therest',
            tokenModifier: ['output4']
        });
        expect(eol3).to.eql({
            deltaLine: 0,
            deltaStart: 7,
            length: 9,
            tokenType: 'eoltype',
            tokenModifier: ['output3']
        });
    })
})
