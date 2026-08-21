import * as migration_20260821_034936_initial_schema from './20260821_034936_initial_schema';
import * as migration_20260821_043528_optional_images from './20260821_043528_optional_images';

export const migrations = [
  {
    up: migration_20260821_034936_initial_schema.up,
    down: migration_20260821_034936_initial_schema.down,
    name: '20260821_034936_initial_schema',
  },
  {
    up: migration_20260821_043528_optional_images.up,
    down: migration_20260821_043528_optional_images.down,
    name: '20260821_043528_optional_images'
  },
];
