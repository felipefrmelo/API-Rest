const { check, validationResult } = require('express-validator');

module.exports = (app) => {
  app.get('/pagamentos', function (req, res) {
    console.log('Recebida requisicao de teste na porta 3000.')
    res.send('OK.');
  });

  app.post("/pagamentos/pagamento", [
    check('forma_de_pagamento').not().isEmail().withMessage('Forma de pagamento é obrigatória'),
    check('valor').not().isEmpty().withMessage('Valor é obrigatório e deve ser um decimal.'),
    check('moeda').not().isEmpty().isLength({ min: 3, max: 3 }).withMessage('Moeda é obrigatória e deve ter 3 caracteres'),
  ], (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("Erros de validação encontrados");
      return res.status(422).json({ errors: errors.array() });
    }

    const pagamento = req.body;
    console.log('processando pagamento...');

    const connection = app.persistencia.connectionFactory();
    const pagamentoDao = new app.persistencia.PagamentoDao(connection);

    pagamento.status = "CRIADO";
    pagamento.data = new Date;

    pagamentoDao.salva(pagamento, (exception, resultado) => {
      console.log('pagamento criado: ' + JSON.stringify(resultado));

      res.location('/pagamentos/pagamento/' + resultado.insertId);
      pagamento.id = resultado.insertId;

      res.status(201).json(pagamento);
    });
  });
}
