import * as vscode from 'vscode';
import { createParticipantContext } from './context';
import { ParticipantMessageMetadata, ParticipantRegistry, ParticipantRuntimeContext, Router } from './types';

export const createRouter = (
  runtime: ParticipantRuntimeContext,
  registry: ParticipantRegistry
): Router => {
  const participantContext = createParticipantContext(runtime);

  const routeMessage = async (
    participantId: string,
    message: unknown,
    stream?: vscode.ChatResponseStream,
    metadata?: ParticipantMessageMetadata
  ): Promise<string | undefined> => {
    const handle = registry.get(participantId);
    if (!handle) {
      void vscode.window.showWarningMessage(`Participant ${participantId} is not registered.`);
      return undefined;
    }

    if (!handle.module.handleMessage) {
      void vscode.window.showInformationMessage(
        `Participant ${handle.definition.title} does not handle direct messages yet.`
      );
      return undefined;
    }

    const result = await Promise.resolve(
      handle.module.handleMessage(message, participantContext, stream, metadata)
    );
    if (typeof result === 'string') {
      return result;
    }
    if (result !== undefined) {
      return String(result);
    }
    return undefined;
  };

  return { routeMessage };
};
