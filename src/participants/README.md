Participant modules live here. Each participant exports an object that matches the `ParticipantModule`
interface from `src/core/types.tsx`. Keep side effects inside the `activate` lifecycle and use
`handleMessage` for runtime interactions.
