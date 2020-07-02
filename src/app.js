const express = require('express');
const cors = require('cors');

const { uuid } = require('uuidv4');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get('/repositories', (request, response) => {
  return response.json(repositories);
});

app.post('/repositories', (request, response) => {
  const { title, url, techs } = request.body;

  const newRepository = {
    title,
    url,
    techs,
    id: uuid(),
    likes: 0,
  };

  repositories.push(newRepository);

  return response.status(201).json(newRepository);
});

app.put('/repositories/:id', (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  /* recovers a reference to the repository */
  const repository = repositories.find((repo) => repo.id === id);

  if (!repository) {
    return response.status(400).json({ error: 'Repository not found' });
  }

  /* updates the repository in repositories array, since repository is a reference to it */
  repository.title = title;
  repository.url = url;
  repository.techs = techs;

  return response.json(repository);
});

app.delete('/repositories/:id', (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex((repo) => repo.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found' });
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post('/repositories/:id/like', (request, response) => {
  const { id } = request.params;

  /* recovers a reference to the repository */
  const repository = repositories.find((repo) => repo.id === id);

  if (!repository) {
    return response.status(400).json({ error: 'Repository not found' });
  }

  /* updates the repository in repositories array, since repository is a reference to it */
  repository.likes += 1;

  return response.json(repository);
});

module.exports = app;
