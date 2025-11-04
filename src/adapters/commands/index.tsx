import { ParticipantRegistry, ParticipantRuntimeContext, Router } from '../../core/types';
import { registerBaseCommands } from './base';
import { registerPetHelperCommands } from './petHelper';

export const registerCommands = (
  runtime: ParticipantRuntimeContext,
  registry: ParticipantRegistry,
  router: Router
): void => {
  registerBaseCommands(runtime, registry, router);
  registerPetHelperCommands(runtime);
};
