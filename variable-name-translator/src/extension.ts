import * as vscode from 'vscode';
import axios from 'axios';

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.languages.registerCodeActionsProvider({ pattern: '**/*', scheme: 'file' }, {
            provideCodeActions(document, range, context, token) {
                const word = document.getText(range);
                const action = new vscode.CodeAction('Translate', vscode.CodeActionKind.QuickFix);
                action.command = {
                    command: 'extension.translateAndShowOptions',
                    title: 'Translate and Show Options',
                    arguments: [document.uri, range, word]
                };
                return [action];
            }
        }, { providedCodeActionKinds: [vscode.CodeActionKind.QuickFix] })
    );

    let translateAndShowOptionsCommand = vscode.commands.registerCommand('extension.translateAndShowOptions', async (uri: vscode.Uri, range: vscode.Range, word: string) => {
        try {
            const response = await axios.get(`http://localhost:3000/translation?korean=${word}`);
            const translations = response.data;

            const options = Object.entries(translations).map(([key, value]) => `Convert to ${key}: ${value}`);

            const selected = await vscode.window.showQuickPick(options, { placeHolder: 'Choose a translation' });

            if (selected) {
                const translation = selected.split(": ")[1];
                const textEditor = vscode.window.activeTextEditor;
                if (textEditor) {
                    textEditor.edit(builder => {
                        builder.replace(range, translation);
                    });
                }
            }
        } catch (error) {
            vscode.window.showErrorMessage("Translation failed.");
            console.error(error);
        }
    });

    context.subscriptions.push(translateAndShowOptionsCommand);
}


