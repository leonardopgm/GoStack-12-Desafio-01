const { request, response } = require('express')
const express = require('express')

const server = express()

server.use(express.json())

const projects = []
let requests = 0

server.use((request, response, next) => {
  requests = ++requests
  console.log(`Já foram realizadas ${requests} requisições na API`)
  next()
})

function checkIdIsExists(request, response, next) {

  const { id } = request.params
  const index = projects.findIndex((oneProject) => { return oneProject.id === id })
  if(index === -1) return response.status(400).json({error: 'This ID does not exist'})
  return next()
} 

server.get('/projects', (request, response) => {
  return response.json(projects)
})

server.post('/projects', (request, response) => {
  const { id, title } = request.body

  projects.push({id, title, tasks: []})

  return response.json(projects)
})

server.post('/projects/:id/tasks', checkIdIsExists, (request, response) => {

  const { id } = request.params
  const { title } = request.body

  const index = projects.findIndex((oneProject) => { return oneProject.id === id })

  projects[index].tasks.push(title)

  return response.json(projects)
})

server.put('/projects/:id', checkIdIsExists, (request, response) => {

  const { id } = request.params
  const { title } = request.body

  const index = projects.findIndex((oneProject) => { return oneProject.id === id })

  projects[index].title = title

  return response.json(projects)
})

server.delete('/projects/:id', checkIdIsExists, (request, response) => {

  const { id } = request.params

  const index = projects.findIndex((oneProject) => { return oneProject.id === id })

  projects.splice(index, 1)
  return response.json(projects)
})

server.listen(3000, () => console.warn('Server running...'))