import * as vscode from 'vscode';
import { ParticipantRegistry, ParticipantRuntimeContext } from './types';

export const activateDiagnostics = (
  runtime: ParticipantRuntimeContext,
  registry: ParticipantRegistry
): void => {
  const status = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  status.name = 'ParticipantStatus';

  const render = () => {
    const count = registry.list().length;
    status.text = `$(hubot) ${count} participants`;
    status.tooltip = 'Active participant modules';
    status.show();
  };

  render();

  const interval = setInterval(render, 5000);

  runtime.disposables.push(
    status,
    new vscode.Disposable(() => {
      clearInterval(interval);
    })
  );
};
