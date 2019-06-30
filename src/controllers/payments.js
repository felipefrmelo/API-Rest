const { check, validationResult } = require('express-validator');

module.exports = (app) => {

  const PAGAMENTO_CRIADO = "CRIADO";
  const PAGAMENTO_CONFIRMADO = "CONFIRMADO";
  const PAGAMENTO_CANCELADO = "CANCELADO";

  app.get('/pagamentos', function (req, res) {
    console.log('Recebida requisicao de teste na porta 3000.')
    res.send('OK.');
  });

  app.get('/pagamentos/pagamento/:id', function (req, res) {
    var id = req.params.id;
    console.log('consultando pagamento: ' + id);

    var memcachedClient = app.service.memcachedClient();

    memcachedClient.get('pagamento-' + id, function (erro, retorno) {
      if (erro || !retorno) {
        console.log('MISS - chave nao encontrada');

        var connection = app.persistencia.connectionFactory();
        var pagamentoDao = new app.persistencia.PagamentoDao(connection);

        pagamentoDao.buscaPorId(id, function (erro, resultado) {
          if (erro) {
            console.log('erro ao consultar no banco: ' + erro);
            res.status(500).send(erro);
            return;
          }
          console.log('pagamento encontrado: ' + JSON.stringify(resultado));
          res.json(resultado.rows);
          return;
        });
        //HIT no cache
      } else {
        console.log('HIT - valor: ' + JSON.stringify(retorno));
        res.json(retorno);
        return;
      }
    });
  });

  app.post("/pagamentos/pagamento", [
    check('pagamento.forma_de_pagamento').not().isEmail().withMessage('Forma de pagamento é obrigatória'),
    check('pagamento.valor').not().isEmpty().withMessage('Valor é obrigatório e deve ser um decimal.'),
    check('pagamento.moeda').not().isEmpty().isLength({ min: 3, max: 3 }).withMessage('Moeda é obrigatória e deve ter 3 caracteres'),
  ], (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("Erros de validação encontrados");
      return res.status(422).json({ errors: errors.array() });
    }

    const { pagamento } = req.body;
    console.log('processando uma requisicao de um novo pagamento');

    pagamento.status = PAGAMENTO_CRIADO;
    pagamento.data = new Date;

    const connection = app.persistencia.connectionFactory();
    const pagamentoDao = new app.persistencia.PagamentoDao(connection);

    pagamentoDao.salva(pagamento, function (erro, result) {
      if (erro) {
        console.log('Erro ao inserir no banco:' + erro);
        res.status(500).send(erro);
      } else {
        pagamento.id = result.insertId;
        console.log('pagamento criado');

        const cache = app.service.memcachedClient();
        cache.set('pagamento-' + pagamento.id, pagamento, 1000, function (err) {
          console.log('nova chave: pagamento-' + pagamento.id)
        });

        if (pagamento.forma_de_pagamento == 'cartao') {
          const cartao = req.body["cartao"];
          console.log(cartao);

          const clienteCartoes = new app.service.clienteCartoes();

          clienteCartoes.autoriza(cartao,
            function (exception, request, response, retorno) {
              if (exception) {
                console.log(exception);
                res.status(400).send(exception);
                return;
              }
              console.log(retorno);

              res.location('/pagamentos/pagamento/' +
                pagamento.id);

              const data = {
                dados_do_pagamanto: pagamento,
                cartao: retorno,
                links: [
                  {
                    href: "http://localhost:3000/pagamentos/pagamento/"
                      + pagamento.id,
                    rel: "confirmar",
                    method: "PUT"
                  },
                  {
                    href: "http://localhost:3000/pagamentos/pagamento/"
                      + pagamento.id,
                    rel: "cancelar",
                    method: "DELETE"
                  }
                ]
              }

              res.status(201).json(data);
              return;
            });


        } else {
          res.location('/pagamentos/pagamento/' +
            pagamento.id);

          const data = {
            dados_do_pagamanto: pagamento,
            links: [
              {
                href: "http://localhost:3000/pagamentos/pagamento/"
                  + pagamento.id,
                rel: "confirmar",
                method: "PUT"
              },
              {
                href: "http://localhost:3000/pagamentos/pagamento/"
                  + pagamento.id,
                rel: "cancelar",
                method: "DELETE"
              }
            ]
          }

          res.status(201).json(data);
        }
      }
    });
  });

  app.put("/pagamentos/pagamento/:id", (req, res) => {

    const pagamento = {};
    const id = req.params.id;

    pagamento.id = id;
    pagamento.status = PAGAMENTO_CONFIRMADO;

    const connection = app.persistencia.connectionFactory();
    const pagamentoDao = new app.persistencia.PagamentoDao(connection);

    pagamentoDao.atualiza(pagamento, function (erro) {
      if (erro) {
        res.status(500).send(erro);
        return;
      }
      console.log('pagamento criado');
      res.send(pagamento);
    });
  });

  app.delete("/pagamentos/pagamento/:id", (req, res) => {

    const pagamento = {};
    const id = req.params.id;

    pagamento.id = id;
    pagamento.status = PAGAMENTO_CANCELADO;

    const connection = app.persistencia.connectionFactory();
    const pagamentoDao = new app.persistencia.PagamentoDao(connection);

    pagamentoDao.cancela(pagamento, function (erro) {
      if (erro) {
        res.status(500).send(erro);
        return;
      }
      console.log('pagamento cancelado');
      res.status(204).send(pagamento);
    });
  });

}
