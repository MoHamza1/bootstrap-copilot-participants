import type * as vscode from 'vscode';

export interface ParticipantConfigEntry {
  id: string;
  entry: string;
  title: string;
  description?: string;
  capabilities?: string[];
}

export interface ParticipantsConfiguration {
  participants: ParticipantConfigEntry[];
}

export interface ParticipantModule {
  activate(context: ParticipantContext): Promise<void> | void;
  handleMessage?(
    message: unknown,
    context: ParticipantContext,
    stream?: vscode.ChatResponseStream,
    metadata?: ParticipantMessageMetadata
  ): Promise<string | void> | string | void;
  dispose?(): void;
}

export interface ParticipantHandle {
  definition: ParticipantConfigEntry;
  module: ParticipantModule;
}

export interface ParticipantRegistry {
  hydrate(configuration: ParticipantsConfiguration): Promise<void>;
  register(definition: ParticipantConfigEntry, module: ParticipantModule): void;
  list(): ParticipantHandle[];
  get(id: string): ParticipantHandle | undefined;
  dispose(): void;
}

export interface ParticipantContext {
  extension: vscode.ExtensionContext;
  subscriptions: vscode.Disposable[];
  createOutputChannel(name: string): vscode.OutputChannel;
}

export interface RuntimeDisposables {
  push(...items: vscode.Disposable[]): void;
  dispose(): void;
}

export interface Router {
  routeMessage(
    participantId: string,
    message: unknown,
    stream?: vscode.ChatResponseStream,
    metadata?: ParticipantMessageMetadata
  ): Promise<string | undefined>;
}

export interface ParticipantRuntimeContext {
  extension: vscode.ExtensionContext;
  disposables: RuntimeDisposables;
}

export type RuntimeContextHandle = ParticipantRuntimeContext & {
  dispose(): void;
};

export interface ParticipantMessageMetadata {
  command?: string;
}
