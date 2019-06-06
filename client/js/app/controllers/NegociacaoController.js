class NegociacaoController{
    constructor(){
        const $ = document.querySelector.bind(document);
        this._inputData = $('#data');
        this._inputQuantidade =  $('#quantidade');
        this._inputValor = $('#valor');
        
        this._listaNegociacoes = new Bind(
            new ListaNegociacoes(), 
            new NegociacoesView($('#negociacoesView')), 
            'adiciona', 'esvazia');
                
        this._mensagem = new Bind(
            new Mensagem(), 
            new MensagemView($("#mensagemView")), 
            'texto');
    }

    adiciona(event){
        event.preventDefault();

        this._listaNegociacoes.adiciona(this._criaNegociacao());
        this._mensagem.texto = 'Negociação adicionada com sucesso!';
        this._limpaFormulario();
    }

    importarNegociacoes(){
        const service = new NegociacaoService();

        Promise.all([
            service.obterNegociacoesDaSemana(),
            service.obterNegociacoesDaSemanaAnterior(),
            service.obterNegociacoesDaSemanaRetrasada()
        ]).then(negociacoes => {
            negociacoes
                .reduce((flattenArray, array) => flattenArray.concat(array, []))
                .forEach(negociacao => this._listaNegociacoes.adiciona(negociacao));
            this._mensagem.texto = 'Negociacoes importadas com sucesso'
        }).catch(erro => this._mensagem.texto = erro);

        //**** SINGLE PROMISE APPROACH */
        // service.obterNegociacoesDaSemana()
        //     .then( negociacoes => {
        //         negociacoes.forEach(negociacao => { 
        //             this._listaNegociacoes.adiciona(negociacao)
        //         });
        //         this._mensagem.texto = 'Negociacão da semana obtida com sucesso!';
        //     }).catch(error => this._mensagem.texto = error);

        // service.obterNegociacoesDaSemanaAnterior()
        //     .then( negociacoes => {
        //         negociacoes.forEach(negociacao => { 
        //             this._listaNegociacoes.adiciona(negociacao)
        //         });
        //         this._mensagem.texto = 'Negociacão da semana obtida com sucesso!';
        //     }).catch(error => this._mensagem.texto = error);

        // service.obterNegociacoesDaSemanaRetrasada()
        //     .then( negociacoes => {
        //         negociacoes.forEach(negociacao => { 
        //             this._listaNegociacoes.adiciona(negociacao)
        //         });
        //         this._mensagem.texto = 'Negociacão da semana obtida com sucesso!';
        //     }).catch(error => this._mensagem.texto = error);

        //****ERROR FIST CALLBACKS */
        // service.obterNegociacoesDaSemana((err, negociacoes) => {
        //     if(err){
        //         this._mensagem.text = err;
        //         return;
        //     }

        //     negociacoes.forEach(negociacao => this._listaNegociacoes.adiciona(negociacao));
        //     service.obterNegociacoesDaSemanaAnterior((err, negociacoes) => {
        //         if(err){
        //             this._mensagem.text = err;
        //             return;
        //         }
    
        //         negociacoes.forEach(negociacao => this._listaNegociacoes.adiciona(negociacao));
        //         service.obterNegociacoesDaSemanaRetrasada((err, negociacoes) => {
        //             if(err){
        //                 this._mensagem.text = err;
        //                 return;
        //             }
        
        //             negociacoes.forEach(negociacao => this._listaNegociacoes.adiciona(negociacao));
        //         });
        //     });
        //     this._mensagem.texto = 'Negociações importadas com sucesso';
        // });
    }

    apaga() {
        this._listaNegociacoes.esvazia();
        this._mensagem.texto = 'Negociações apagadas com sucesso!';
    }

    _criaNegociacao() {
        return new Negociacao(
                DateHelper.textoParaData(this._inputData.value),
                this._inputQuantidade.value,
                this._inputValor.value
            );
    }

    _limpaFormulario() {
        this._inputData.value = '';
        this._inputQuantidade.value = 1;
        this._inputValor.value = 0.0

        this._inputData.focus();

    }
}