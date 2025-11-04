import * as vscode from 'vscode';
import { createParticipantContext } from './context';
import {
  ParticipantConfigEntry,
  ParticipantHandle,
  ParticipantModule,
  ParticipantRegistry,
  ParticipantRuntimeContext,
  ParticipantsConfiguration
} from './types';

const resolveParticipantModule = async (entry: string): Promise<ParticipantModule> => {
  const modulePath = `../${entry}/index`;
  const imported = await import(modulePath);
  const candidate =
    (typeof imported.createParticipant === 'function' && imported.createParticipant()) ||
    imported.default ||
    imported.participant ||
    imported;

  if (!candidate || typeof candidate.activate !== 'function') {
    throw new Error(`Participant module at ${modulePath} does not expose an activate() function`);
  }

  return candidate as ParticipantModule;
};

export const createParticipantRegistry = (runtime: ParticipantRuntimeContext): ParticipantRegistry => {
  const handles = new Map<string, ParticipantHandle>();
  const participantContext = createParticipantContext(runtime);

  const register = (definition: ParticipantConfigEntry, module: ParticipantModule) => {
    const existing = handles.get(definition.id);
    if (existing) {
      existing.module.dispose?.();
    }
    handles.set(definition.id, { definition, module });
  };

  const hydrate = async (configuration: ParticipantsConfiguration) => {
    for (const definition of configuration.participants) {
      try {
        const module = await resolveParticipantModule(definition.entry);
        await module.activate(participantContext);
        register(definition, module);
      } catch (err) {
        console.error(`Failed to hydrate participant ${definition.id}`, err);
      }
    }
    void vscode.commands.executeCommand('copilot-gmqe.refreshTree');
  };

  const dispose = () => {
    for (const handle of handles.values()) {
      try {
        handle.module.dispose?.();
      } catch (err) {
        console.error(`Failed to dispose participant ${handle.definition.id}`, err);
      }
    }
    handles.clear();
  };

  return {
    hydrate,
    register,
    list: () => Array.from(handles.values()),
    get: (id: string) => handles.get(id),
    dispose
  };
};
