import * as vscode from 'vscode';
import { ParticipantRuntimeContext, Router } from '../core/types';

export const bootstrapChatApiShim = (runtime: ParticipantRuntimeContext, router: Router): void => {
  const channel = vscode.window.createOutputChannel('Chat Shim');
  channel.appendLine('Chat API shim initialized.');
  runtime.disposables.push(channel);

  const disposable = vscode.commands.registerCommand('copilot-gmqe.forwardChat', async () => {
    const input = await vscode.window.showInputBox({
      prompt: 'Enter the participant id and message (id: message)'
    });

    if (!input) {
      return;
    }

    const [id, ...messageParts] = input.split(':');
    if (!id || messageParts.length === 0) {
      void vscode.window.showErrorMessage('Provide input in the form "participant-id: message".');
      return;
    }

    const message = messageParts.join(':').trim();
    const targetId = id.trim();
    channel.appendLine(`Routing message to ${targetId}: ${message}`);
    const responseText = await router.routeMessage(targetId, message);
    if (responseText) {
      channel.appendLine(`Response from ${targetId}: ${responseText}`);
    }
  });

  runtime.disposables.push(disposable);
};
