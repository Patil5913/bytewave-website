import * as migration_20260821_034936_initial_schema from './20260821_034936_initial_schema';
import * as migration_20260821_043528_optional_images from './20260821_043528_optional_images';
import * as migration_20260826_200532_newsletters from './20260826_200532_newsletters';
import * as migration_20260826_201447_post_announced_at from './20260826_201447_post_announced_at';

export const migrations = [
  {
    up: migration_20260821_034936_initial_schema.up,
    down: migration_20260821_034936_initial_schema.down,
    name: '20260821_034936_initial_schema',
  },
  {
    up: migration_20260821_043528_optional_images.up,
    down: migration_20260821_043528_optional_images.down,
    name: '20260821_043528_optional_images',
  },
  {
    up: migration_20260826_200532_newsletters.up,
    down: migration_20260826_200532_newsletters.down,
    name: '20260826_200532_newsletters',
  },
  {
    up: migration_20260826_201447_post_announced_at.up,
    down: migration_20260826_201447_post_announced_at.down,
    name: '20260826_201447_post_announced_at'
  },
];
