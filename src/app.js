const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const oRepositories = [];

app.get("/repositories", (request, oResponse) => {
  return oResponse.json(oRepositories);
});

app.post("/repositories", (oRequest, oResponse) => {

  const { title, url, techs } = oRequest.body;

  const oRepository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  oRepositories.push(oRepository)

  return oResponse.json(oRepository);
});

app.put("/repositories/:id", (oRequest, oResponse) => {

  const { id } = oRequest.params;
  const { title, url, techs } = oRequest.body;
  
  const iRepositoryIndex = oRepositories.findIndex(Repository =>
    Repository.id == id);
  
  if (iRepositoryIndex == -1) {
    return oResponse.status(400).json( { error: 'Repository not found!' } )
  }

  const oRepository = {
    id,
    title,
    url,
    techs,
    likes: oRepositories[iRepositoryIndex].likes,
  };

  oRepositories[iRepositoryIndex] = oRepository;

  return oResponse.json(
    oRepository
  );
});

app.delete("/repositories/:id", (oRequest, oResponse) => {
  
  const { id } = oRequest.params;

  const iRepositoryIndex = oRepositories.findIndex(Repository => Repository.id == id);

  if (iRepositoryIndex == -1) {
    return oResponse.status(400).json( { error: 'Repository not found!' } )
  }

  oRepositories.splice(iRepositoryIndex, 1);

  return oResponse.status(204).send();
});

app.post("/repositories/:id/like", (oRequest, oResponse) => {
    
  const { id } = oRequest.params;
    
  const iRepositoryIndex = oRepositories.findIndex(Repository =>
    Repository.id == id);
    
  if (iRepositoryIndex == -1) {
    return oResponse.status(400).json({ error: 'Repository not found!' })
  }

  oRepositories[iRepositoryIndex].likes++;

  return oResponse.json(oRepositories[iRepositoryIndex]);
});

module.exports = app;
