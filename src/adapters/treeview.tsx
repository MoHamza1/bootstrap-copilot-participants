import * as vscode from 'vscode';
import { ParticipantRegistry, ParticipantRuntimeContext } from '../core/types';

class ParticipantsTreeDataProvider implements vscode.TreeDataProvider<string> {
  private readonly _onDidChangeTreeData = new vscode.EventEmitter<void>();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  constructor(private readonly registry: ParticipantRegistry) {}

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: string): vscode.TreeItem {
    const handle = this.registry.get(element);
    if (!handle) {
      return new vscode.TreeItem(element);
    }
    const item = new vscode.TreeItem(handle.definition.title);
    item.description = handle.definition.id;
    item.tooltip = handle.definition.description;
    item.contextValue = 'participant';
    return item;
  }

  getChildren(element?: string): vscode.ProviderResult<string[]> {
    if (element) {
      return [];
    }
    return this.registry.list().map((handle) => handle.definition.id);
  }
}

export const registerTreeView = (
  runtime: ParticipantRuntimeContext,
  registry: ParticipantRegistry
): void => {
  const provider = new ParticipantsTreeDataProvider(registry);
  const treeView = vscode.window.createTreeView('copilot-gmqe-participants', {
    treeDataProvider: provider
  });

  const refreshDisposable = vscode.commands.registerCommand('copilot-gmqe.refreshTree', () => {
    provider.refresh();
  });

  runtime.disposables.push(treeView, refreshDisposable);
};
