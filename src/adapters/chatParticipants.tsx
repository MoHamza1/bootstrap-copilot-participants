import * as vscode from 'vscode';
import { ParticipantRegistry, ParticipantRuntimeContext, Router } from '../core/types';

const createChatParticipantId = (participantId: string): string => `copilot-gmqe.${participantId}`;

export const registerChatParticipants = (
  runtime: ParticipantRuntimeContext,
  registry: ParticipantRegistry,
  router: Router
): void => {
  for (const handle of registry.list()) {
    const chatId = createChatParticipantId(handle.definition.id);
    const chatParticipant = vscode.chat.createChatParticipant(
      chatId,
      async (request, _context, response, token) => {
        if (token.isCancellationRequested) {
          return;
        }

        response.markdown(`Routing request to **${handle.definition.title}**...`);
        const metadata = request.command ? { command: request.command } : undefined;
        const result = await router.routeMessage(handle.definition.id, request.prompt, response, metadata);
        if (token.isCancellationRequested) {
          return;
        }

        if (result) {
          response.markdown(result);
        }

        return {
          metadata: {
            participantId: handle.definition.id
          }
        };
      }
    );

    chatParticipant.iconPath = new vscode.ThemeIcon('hubot');
    runtime.disposables.push(chatParticipant);
  }
};
