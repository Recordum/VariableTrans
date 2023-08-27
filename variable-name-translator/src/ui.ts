import * as vscode from 'vscode';

export function showRegisterForm(): Thenable<{ email: string; password: string; } | undefined> {
    return new Promise<{ email: string; password: string; } | undefined>((resolve, reject) => {
        vscode.window.showInputBox({
            placeHolder: 'Enter your email',
            prompt: 'Email Address'
        }).then(email => {
            if (email) {
                vscode.window.showInputBox({
                    placeHolder: 'Enter your password',
                    prompt: 'Password',
                    password: true
                }).then(password => {
                    if (password) {
                        resolve({ email, password });
                    } else {
                        resolve(undefined);
                    }
                });
            } else {
                resolve(undefined);
            }
        });
    });
}

export function showTranslationOptions(translations: any): Thenable<string | undefined> {
    const options = Object.entries(translations).map(([key, value]) => `Convert to ${key}: ${value}`);
    return vscode.window.showQuickPick(options, { placeHolder: 'Choose a translation' });
}

export async function showLoginForm(): Promise<{ email: string; password: string } | undefined> {
    const email = await vscode.window.showInputBox({ prompt: 'Enter your email' });
    if (!email) {
        return;
    }

    const password = await vscode.window.showInputBox({ prompt: 'Enter your password', password: true });
    if (!password) {
        return;
    }

    return { email, password };
}
