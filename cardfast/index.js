var app = require('./config/custom-express')();

const PORT = process.env.PORT || 3001

app.listen(PORT, function(){
  console.log('Servidor de cartoes rodando na porta %d.', PORT);
});
