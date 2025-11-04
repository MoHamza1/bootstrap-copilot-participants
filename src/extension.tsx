import * as vscode from 'vscode';
import { initializeContext } from './core/context';
import type { RuntimeContextHandle } from './core/types';
import { createParticipantRegistry } from './core/registry';
import { createRouter } from './core/router';
import { activateDiagnostics } from './core/diagnostics';
import { registerCommands } from './adapters/commands';
import { registerTreeView } from './adapters/treeview';
import { bootstrapChatApiShim } from './adapters/chatApiShim';
import { registerChatParticipants } from './adapters/chatParticipants';
import participantsConfig from './config/participants.json';

let runtimeContext: RuntimeContextHandle | undefined;

export async function activate(extensionContext: vscode.ExtensionContext): Promise<void> {
  const ctx = initializeContext(extensionContext);
  runtimeContext = ctx;

  const registry = createParticipantRegistry(ctx);
  const router = createRouter(ctx, registry);

  activateDiagnostics(ctx, registry);
  registerCommands(ctx, registry, router);
  registerTreeView(ctx, registry);
  bootstrapChatApiShim(ctx, router);

  await registry.hydrate(participantsConfig);
  registerChatParticipants(ctx, registry, router);
}

export function deactivate(): void {
  runtimeContext?.dispose();
  runtimeContext = undefined;
}
