import * as vscode from 'vscode';
import { ParticipantContext, ParticipantMessageMetadata, ParticipantModule } from '../../core/types';

const createExampleParticipant = (): ParticipantModule => {
  let output: vscode.OutputChannel | undefined;

  return {
    activate(context: ParticipantContext) {
      output = context.createOutputChannel('Example Participant');
      output.appendLine('Example participant ready.');
    },
    async handleMessage(
      message: unknown,
      _context: ParticipantContext,
      stream?: vscode.ChatResponseStream,
      _metadata?: ParticipantMessageMetadata
    ) {
      const text = typeof message === 'string' ? message : JSON.stringify(message);
      output?.appendLine(`Echoing message: ${text}`);
      stream?.markdown('### Example Participant');
      stream?.markdown(`You said: \`${text}\``);
      stream?.markdown('This is a demo response streamed from the participant.');
      return `Example participant streamed a response for "${text}".`;
    },
    dispose() {
      output?.dispose();
      output = undefined;
    }
  };
};

export default createExampleParticipant();
