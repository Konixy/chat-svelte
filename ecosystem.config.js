module.exports = {
  apps: [
    {
      name: 'chat-svelte',
      script: 'node --env-file=.env build',
    },
  ],
};
