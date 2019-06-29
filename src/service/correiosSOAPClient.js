const soap = require('soap');

class CorreiosSOAPClient {
    constructor() {
        this._url = 'http://ws.correios.com.br/calculador/CalcPrecoPrazo.asmx?wsdl';
    }

    calculaPrazo(args, callback) {
        soap.createClient(this._url, function (erro, cliente) {
            console.log('cliente soap criado');
            cliente.CalcPrazo(args, callback);
        });
    }
}

module.exports = () => CorreiosSOAPClient;
