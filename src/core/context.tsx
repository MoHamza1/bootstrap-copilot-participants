import * as vscode from 'vscode';
import { ParticipantContext, ParticipantRuntimeContext, RuntimeContextHandle, RuntimeDisposables } from './types';

const createRuntimeDisposables = (): RuntimeDisposables => {
  const items: vscode.Disposable[] = [];
  return {
    push: (...disposables: vscode.Disposable[]) => {
      items.push(...disposables);
    },
    dispose: () => {
      while (items.length) {
        const disposable = items.pop();
        try {
          disposable?.dispose();
        } catch (err) {
          console.error('Failed to dispose runtime resource', err);
        }
      }
    }
  };
};

export const initializeContext = (extension: vscode.ExtensionContext): RuntimeContextHandle => {
  const disposables = createRuntimeDisposables();
  const dispose = () => disposables.dispose();
  extension.subscriptions.push({ dispose });
  return {
    extension,
    disposables,
    dispose
  };
};

export const createParticipantContext = (runtime: ParticipantRuntimeContext): ParticipantContext => ({
  extension: runtime.extension,
  subscriptions: runtime.extension.subscriptions,
  createOutputChannel: (name: string) => {
    const channel = vscode.window.createOutputChannel(name);
    runtime.disposables.push(channel);
    return channel;
  }
});
