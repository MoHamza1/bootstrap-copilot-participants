import * as vscode from 'vscode';
import { ParticipantRegistry, ParticipantRuntimeContext, Router } from '../../core/types';

const COMMAND_NAMESPACE = 'copilot-gmqe';

export const registerBaseCommands = (
  runtime: ParticipantRuntimeContext,
  registry: ParticipantRegistry,
  router: Router
): void => {
  const sendCommand = vscode.commands.registerCommand(`${COMMAND_NAMESPACE}.sendMessage`, async () => {
    const participants = registry.list().map((handle) => handle.definition.id);
    if (participants.length === 0) {
      void vscode.window.showInformationMessage('No participants available. Hydration may still be running.');
      return;
    }

    const target = await vscode.window.showQuickPick(participants, {
      placeHolder: 'Select a participant to receive the message'
    });

    if (!target) {
      return;
    }

    const message = await vscode.window.showInputBox({
      prompt: `Message for ${target}`
    });

    if (!message) {
      return;
    }

    const responseText = await router.routeMessage(target, message);
    if (responseText) {
      void vscode.window.showInformationMessage(`[${target}] ${responseText}`);
    }
  });

  const refreshCommand = vscode.commands.registerCommand(`${COMMAND_NAMESPACE}.refreshParticipants`, async () => {
    void vscode.commands.executeCommand('workbench.view.extension.copilot-gmqe-participants');
    void vscode.commands.executeCommand('copilot-gmqe.refreshTree');
  });

  runtime.disposables.push(sendCommand, refreshCommand);
};
