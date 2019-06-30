function PagamentoDao(connection) {
    this._connection = connection;
}

PagamentoDao.prototype.salva = function (pagamento, callback) {
    const query = `INSERT INTO pagamentos (
                                        forma_de_pagamento,
                                        valor,
                                        moeda,
                                        descricao,
                                        status,
                                        data
                                        )
                                        VALUES($1, $2,$3, $4,$5, $6)`
    this._connection.query(query, Object.values(pagamento), callback);
}

PagamentoDao.prototype.atualiza = function (pagamento, callback) {
    this._connection.query('UPDATE pagamentos SET status = $1 where id = $2', [pagamento.status, pagamento.id], callback);
}

PagamentoDao.prototype.cancela = function (pagamento, callback) {
    this._connection.query('UPDATE pagamentos SET status = $1 where id = $2', [pagamento.status, pagamento.id], callback);
}

PagamentoDao.prototype.buscaPorId = function (id, callback) {
    this._connection.query("select * from pagamentos where id = $1", [id], callback);
}

module.exports = function () {
    return PagamentoDao;
};