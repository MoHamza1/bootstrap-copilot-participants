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
      stream?.markdown('_Stub_: actual code generation coming soon.');
      return 'Code generator streamed a placeholder response.';
    },
    dispose() {
      output?.dispose();
      output = undefined;
    }
  };
};

export const participant = createCodegenParticipant();
export default participant;
