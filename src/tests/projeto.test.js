const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../../app');
const Projeto = require('../models/projetoModel');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Projeto.deleteMany();
});

describe('CRUD de Projetos', () => {

  test('deve criar um novo projeto com dados válidos', async () => {
    const projetoData = {
      nome: 'Projeto Teste',
      cliente: 'Cliente X',
      prazo: '2025-12-31',
      status: 'pendente'
    };

    const res = await request(app)
      .post('/api/projetos')
      .send(projetoData);

    expect(res.statusCode).toBe(201);
    expect(res.body.nome).toBe(projetoData.nome);
    expect(res.body.cliente).toBe(projetoData.cliente);
  });

  test('deve falhar ao criar projeto sem nome', async () => {
    const res = await request(app)
      .post('/api/projetos')
      .send({ cliente: 'Cliente X', prazo: '2025-12-31' });

    expect(res.statusCode).toBe(400);
    expect(res.body.erro).toBeDefined();
  });

  test('deve listar todos os projetos', async () => {
    await Projeto.create([
      { nome: 'Proj1', cliente: 'C1', prazo: '2025-12-31' },
      { nome: 'Proj2', cliente: 'C2', prazo: '2025-11-30' }
    ]);

    const res = await request(app).get('/api/projetos');

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(2);
  });

  test('deve obter um projeto pelo id', async () => {
    const projeto = await Projeto.create({ nome: 'Proj', cliente: 'C', prazo: '2025-12-31' });
    const res = await request(app).get(`/api/projetos/${projeto._id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.nome).toBe('Proj');
  });

  test('deve retornar 404 se projeto não existir', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/api/projetos/${fakeId}`);

    expect(res.statusCode).toBe(404);
  });

  test('deve atualizar um projeto existente', async () => {
    const projeto = await Projeto.create({ nome: 'Proj', cliente: 'C', prazo: '2025-12-31' });
    const res = await request(app)
      .put(`/api/projetos/${projeto._id}`)
      .send({ status: 'em andamento' });

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('em andamento');
  });

  test('deve deletar um projeto existente', async () => {
    const projeto = await Projeto.create({ nome: 'Proj', cliente: 'C', prazo: '2025-12-31' });
    const res = await request(app).delete(`/api/projetos/${projeto._id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.mensagem).toBe('Projeto removido com sucesso.');
  });
});		
