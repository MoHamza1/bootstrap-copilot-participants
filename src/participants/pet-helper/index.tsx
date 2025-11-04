import * as vscode from 'vscode';
import { ParticipantContext, ParticipantMessageMetadata, ParticipantModule } from '../../core/types';

interface UpdateInstancePayload {
  cycleSlug?: string;
  instanceSlug?: string;
  executionOwner?: string;
}

const parseUpdateInstanceCommand = (input: string, commandHint?: string): UpdateInstancePayload | undefined => {
  let candidate = input.trim();
  if (commandHint && !candidate.startsWith('/')) {
    candidate = `/${commandHint} ${candidate}`;
  }

  if (!candidate.toLowerCase().startsWith('/update_instance')) {
    return undefined;
  }

  const tokens = candidate.replace(/^\/\S+\s*/, '').split(/\s+/).filter(Boolean);
  const payload: UpdateInstancePayload = {};

  for (const token of tokens) {
    const [rawKey, rawValue] = token.split('=');
    if (!rawKey || !rawValue) {
      continue;
    }
    const key = rawKey.trim().toLowerCase();
    const value = rawValue.trim();
    if (key === 'cycle_slug') {
      payload.cycleSlug = value;
    } else if (key === 'instance_slug') {
      payload.instanceSlug = value;
    } else if (key === 'execution_owner') {
      payload.executionOwner = value;
    }
  }

  return payload;
};

const createPetHelperParticipant = (): ParticipantModule => {
  let output: vscode.OutputChannel | undefined;

  return {
    activate(context: ParticipantContext) {
      output = context.createOutputChannel('PET Helper');
      output.appendLine('PET Helper participant activated.');
    },
    async handleMessage(
      message: unknown,
      _context: ParticipantContext,
      stream?: vscode.ChatResponseStream,
      metadata?: ParticipantMessageMetadata
    ) {
      const text = typeof message === 'string' ? message : JSON.stringify(message);
      const maybeUpdate = parseUpdateInstanceCommand(text, metadata?.command);
      if (maybeUpdate && maybeUpdate.instanceSlug && maybeUpdate.cycleSlug && maybeUpdate.executionOwner) {
        output?.appendLine(`Update instance request parsed: ${JSON.stringify(maybeUpdate)}`);
        stream?.markdown('### PET Helper • Update Instance');
        stream?.markdown(
          `Hi there. So, you want to update the label execution owner with the value **'${maybeUpdate.executionOwner}'** for the instance **${maybeUpdate.instanceSlug}** in the cycle **${maybeUpdate.cycleSlug}**.`
        );
        stream?.markdown('TODO: this will eventually call a PET API.');
        stream?.button({
          title: 'Confirm',
          command: 'copilot-gmqe.petHelper.confirmUpdate',
          tooltip: 'Confirm and execute the update (stubbed).',
          arguments: [maybeUpdate]
        });
        return `PET Helper lined up an update for ${maybeUpdate.instanceSlug}.`;
      }

      output?.appendLine(`Guidance requested: ${text}`);
      stream?.markdown('### PET Helper');
      stream?.markdown(`Queued guidance tasks for:\n\n> ${text}`);
      stream?.markdown('TODO: integrate navigation insights here.');
      return `PET Helper streamed guidance summary for "${text}".`;
    },
    dispose() {
      output?.dispose();
      output = undefined;
    }
  };
};

export default createPetHelperParticipant();
