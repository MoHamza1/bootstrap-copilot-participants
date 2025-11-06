import * as vscode from 'vscode';
import { ParticipantContext, ParticipantMessageMetadata, ParticipantModule } from '../../core/types';

const createCodegenParticipant = (): ParticipantModule => {
  let output: vscode.OutputChannel | undefined;

  return {
    activate(context: ParticipantContext) {
      output = context.createOutputChannel('Codegen Participant');
      output.appendLine('Code generator participant ready.');
    },
    async handleMessage(
      message: unknown,
      _context: ParticipantContext,
      stream?: vscode.ChatResponseStream,
      _metadata?: ParticipantMessageMetadata
    ) {
      output?.appendLine(`Received message: ${JSON.stringify(message)}`);
      const messageText = typeof message === 'string' ? message : JSON.stringify(message);
      stream?.markdown('### Code Generator');
      stream?.markdown(`Scaffolding request acknowledged for:\n\n- \`${messageText}\``);

      try {
        const models = await vscode.lm.selectChatModels();
        if (!models.length) {
          const warning = 'No chat models available to generate the poem.';
          stream?.markdown(`⚠️ ${warning}`);
          return warning;
        }

        const chat = models[0];
        const prompt =
          'Write a 50 word poem titled "The Road to Production Isn\'t Free". Return the title on the first line, followed by the poem text. Keep it exactly 50 words.';
        const response = await chat.sendRequest([vscode.LanguageModelChatMessage.User(prompt)]);

        let poem = '';
        for await (const chunk of response.text) {
          poem += chunk;
        }

        const trimmedPoem = poem.trim();
        if (trimmedPoem.length === 0) {
          const fallback = 'The language model returned an empty response.';
          stream?.markdown(`⚠️ ${fallback}`);
          return fallback;
        }

        stream?.markdown(trimmedPoem);
        return 'Code generator streamed the LLM-generated poem.';
      } catch (err) {
        const messageError = err instanceof Error ? err.message : String(err);
        const errorNote = `Failed to generate poem: ${messageError}`;
        output?.appendLine(errorNote);
        stream?.markdown(`⚠️ ${errorNote}`);
        return errorNote;
      }
    },
    dispose() {
      output?.dispose();
      output = undefined;
    }
  };
};

export const participant = createCodegenParticipant();
export default participant;
