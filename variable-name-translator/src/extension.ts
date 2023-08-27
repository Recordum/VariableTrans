import * as vscode from 'vscode';
import { ResponseSessionDto, loginUser, logoutUser, registerUser, translateWord } from './api';
import { showLoginForm, showRegisterForm, showTranslationOptions } from './ui';

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand('extension.registerUser', async () => {
            const userDetails = await showRegisterForm();
            if (userDetails) {
                try {
                    await registerUser(userDetails.email, userDetails.password);
                    vscode.window.showInformationMessage('Registration successful!');
                } catch (error) {
                    vscode.window.showErrorMessage('Registration failed.');
                }
            }
        }),

		vscode.commands.registerCommand('extension.login', async () => {
			if (context.globalState.get<string>('sessionId')){
				vscode.window.showErrorMessage('이미 로그인 되어 있습니다.');
				return;
			}
			const userInput = await showLoginForm();
			
			if (userInput) {
				try {
					const { email, password } = userInput;
					const response =  await loginUser(userInput.email, userInput.password);
					const responseSessionDto: ResponseSessionDto = response.data;
					context.globalState.update('sessionId', responseSessionDto.sessionId);
					console.log(responseSessionDto.sessionId);
					vscode.window.showInformationMessage("로그인 완료" + responseSessionDto.sessionId);
				}catch(error: any){
					vscode.window.showErrorMessage(error.message);
				}
			}
		}),

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
        }, { providedCodeActionKinds: [vscode.CodeActionKind.QuickFix] }),

        vscode.commands.registerCommand('extension.translateAndShowOptions', async (uri: vscode.Uri, range: vscode.Range, word: string) => {
            try {
				const sessionId: string | undefined = context.globalState.get<string>('sessionId');
				console.log("sessionID 찾기 " + sessionId);
				if (sessionId === undefined){
					vscode.window.showErrorMessage('로그인 해주세요!');
					return;
				}
                const response = await translateWord(word, sessionId);
                const selected = await showTranslationOptions(response.data);
                if (selected) {
                    const translation = selected.split(": ")[1];
                    const textEditor = vscode.window.activeTextEditor;
                    if (textEditor) {
                        textEditor.edit(builder => {
                            builder.replace(range, translation);
                        });
                    }
                }
            } catch (error: any) {
				if (error.response.data.message === "만료된 세션입니다"){
					vscode.window.showErrorMessage("세션이 만료되었습니다 다시 로그인 해주세요");
					context.globalState.update('sessionId', undefined);
					return;
				}
                vscode.window.showErrorMessage(error.response.data.message);
            }
        }),

		vscode.commands.registerCommand('extension.logout', async () => {
			const sessionId: string | undefined= context.globalState.get<string>('sessionId');
			console.log("LOGOUT" +sessionId);
			if (sessionId === undefined){
				vscode.window.showErrorMessage('로그인 상태가 아닙니다');
				return; 
			}
			context.globalState.update('sessionId', undefined);
			await logoutUser(sessionId);
			vscode.window.showInformationMessage('로그아웃 성공');
		})
    );
}
