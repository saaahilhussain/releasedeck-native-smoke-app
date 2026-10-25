'use strict';

module.exports = {
  apps: [
    {
      name: 'releasedeck-b8f558b6-f13d-46cb-8950-ce7911feed08',
      cwd: __dirname,
      script: './server.js',
      exec_mode: 'fork',
      instances: 1,
    },
  ],
};
