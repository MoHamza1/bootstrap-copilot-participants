import * as vscode from 'vscode';
import { ParticipantRuntimeContext } from '../../core/types';

const COMMAND_NAMESPACE = 'copilot-gmqe';

export interface PetHelperUpdatePayload {
  cycleSlug?: string;
  instanceSlug?: string;
  executionOwner?: string;
}

export const registerPetHelperCommands = (runtime: ParticipantRuntimeContext): void => {
  const confirmUpdateCommand = vscode.commands.registerCommand(
    `${COMMAND_NAMESPACE}.petHelper.confirmUpdate`,
    async (payload?: PetHelperUpdatePayload) => {
      if (!payload) {
        void vscode.window.showWarningMessage('No update payload provided to PET Helper.');
        return;
      }

      const { cycleSlug, instanceSlug, executionOwner } = payload;
      const summary = `Cycle: ${cycleSlug ?? 'unknown'}, Instance: ${instanceSlug ?? 'unknown'}, Owner: ${
        executionOwner ?? 'unknown'
      }`;
      console.log('[PET Helper] Confirming update', summary);
      void vscode.window.showInformationMessage(
        `PET Helper is (stub) updating ${instanceSlug ?? 'instance'} in ${cycleSlug ?? 'cycle'} to owner ${
          executionOwner ?? 'owner'
        }.`
      );
    }
  );

  runtime.disposables.push(confirmUpdateCommand);
};
