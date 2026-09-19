import * as migration_20260916_234143_initial from './20260916_234143_initial';
import * as migration_20260917_141134_retention_job from './20260917_141134_retention_job';
import * as migration_20260917_153233_homepage_funnel from './20260917_153233_homepage_funnel';

export const migrations = [
  {
    up: migration_20260916_234143_initial.up,
    down: migration_20260916_234143_initial.down,
    name: '20260916_234143_initial',
  },
  {
    up: migration_20260917_141134_retention_job.up,
    down: migration_20260917_141134_retention_job.down,
    name: '20260917_141134_retention_job',
  },
  {
    up: migration_20260917_153233_homepage_funnel.up,
    down: migration_20260917_153233_homepage_funnel.down,
    name: '20260917_153233_homepage_funnel'
  },
];
