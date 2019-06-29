module.exports = (app) => {

    app.post('/correios/calculo-prazo', function (req, res) {
        const dadosDaEntrega = req.body

        const correiosSOAPClient = new app.service.correiosSOAPClient();

        correiosSOAPClient.calculaPrazo(dadosDaEntrega, function(erro, resultado){
            if (erro){
              res.status(500).send(erro);
              return;
            }
            console.log('prazo calculado');
            res.json(resultado);
          });
    });

}