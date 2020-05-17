/**
 * FastButtons's buttons list
 *
 * @see [[MediaWiki:Gadget-fastbuttons.js]]
 * @see [[MediaWiki:Gadget-fastbuttons.css]]
 * @see [[MediaWiki:Gadget-fastbuttons.js/core.js]]
 * @class fastb.buttons
 */
/* jshint laxbreak:true */
/* global mediaWiki, jQuery, fastButtons, window */

( function ( mw, $, fastb, window ) {
'use strict';

mw.messages.set( {
	// General
	'fastb-FastButtons': 'FastButtons',
	'fastb-hideButton': 'Esconder',
	'fastb-hideButton-title': 'Esconde os bot�es do FastButtons. Para reav�-los na skin vector, basta clicar em "Mais".',
	'fastb-petScan': 'Procurar nesta categoria',
	'fastb-loading': 'Carregando...',
	'fastb-noRecentChange': 'Nenhuma altera��o recente.',
	'fastb-noNewPage': 'Nenhuma p�gina nova ainda n�o patrulhada ou que n�o seja um redirecionamento dentre as p�ginas criadas � no m�ximo, um m�s.',
	'fastb-noScoredRecentChanges': 'Nenhuma edi��o para patrulhar ou desfazer.',
	'fastb-noER': 'Nenhuma p�gina marcada para elimina��o r�pida.',
	'fastb-yes': 'Sim',
	'fastb-no': 'N�o',
	'fastb-hours': '$1h$2min',
	'fastb-date': '$1 de $2 de $3', // $1 = day, $2 = month, $3 = year
	'fastb-none': 'Nenhum',
	'fastb-OK': 'OK',
	'fastb-cancel': 'Cancelar',
	'fastb-alreadyExistsEliminationTag': 'J� existe uma predefini��o de elimina��o nesta p�gina.',
	'fastb-alreadyExistsThisTag': 'A predefini��o "$1" j� est� inclu�da nesta p�gina.',
	'fastb-alreadyExistsThisStub': 'J� existe um esbo�o nesta p�gina.',
	'fastb-warning': 'Aviso',
	'fastb-checkingBacklinksTitle': 'Verifica��o de afluentes',
	'fastb-checkingBacklinksText': 'Verificando a exist�ncia de afluentes. Aguarde...',
	'fastb-checkingBacklinksStop': 'O redirecionamento possui afluentes, deseja realmente prop�-lo para elimina��o? Recomenda-se a leitura de <a href="https://meta.wikimedia.org/w/index.php?title=Don%27t_delete_redirects/pt&uselang=pt">meta:Don\'t delete redirects/pt</a>.',
	'fastb-insufficiencyTemplateNotFound': 'N�o foi encontrada a predefini��o "$1" na p�gina, requisito para a utiliza��o desta.',

	// Notify
	'fastb-notify-editSuccess': 'A p�gina foi editada com sucesso.',
	'fastb-notify-moveSuccess': 'A p�gina foi movida com sucesso.',
	'fastb-notify-sendWarning': 'Enviando a notifica��o para o criador...',
	'fastb-notify-editingPage': 'Editando a p�gina...',
	'fastb-notify-patrollingPage': 'Patrulhando a p�gina...',
	'fastb-notify-getPageContent': 'Obtendo o conte�do da p�gina...',
	'fastb-notify-creatingEliminationPage': 'Criando a p�gina de elimina��o...',
	'fastb-notify-editingSomePage': 'Editando a p�gina "$1"...',
	'fastb-notify-archivingPE': 'Arquivando o pedido de elimina��o anterior...',
	'fastb-notify-errorSufix': '<br />Se o problema persistir,'
		+ ' favor informar no <a href="' + mw.util.getUrl( 'WP:Caf� dos Programadores' ) + '">Caf� dos programadores</a>'
		+ ' ou em <a href="' + mw.util.getUrl( 'MediaWiki Discuss�o:Gadget-fastbuttons.js' ) + '">MediaWiki Discuss�o:Gadget-fastbuttons.js</a>.',
	'fastb-notify-apiErrorEdit': 'N�o foi poss�vel realizar a edi��o.<br />A API retornou o c�digo de erro "$1": $2',
	'fastb-notify-editFail': 'N�o foi poss�vel realizar a edi��o devido a um erro desconhecido da API.',

	// Dialog
	'fastb-dialog-note': 'Se necess�rio, coloque uma observa��o.',
	'fastb-dialog-labelDefault': 'Observa��o',
	'fastb-dialog-placeholderDefault': 'N�o � necess�rio assinar.',
	'fastb-dialog-pageSituation': 'Escreva um breve resumo das condi��es atuais da p�gina',

	// Dialog [ESR prompt]
	'fastb-dialog-ESR-title-1': 'Qual a justificativa para a elimina��o do arquivo?',
	'fastb-dialog-ESR-title-2': 'Elimina��o semirr�pida',
	'fastb-dialog-ESR-reason': 'Justificativa',
	'fastb-dialog-ESR-subject': 'Assunto',
	'fastb-dialog-ESR-other': 'Outro',
	'fastb-dialog-ESR-badTranslation': 'M� tradu��o',
	'fastb-dialog-ESR-VDA': 'Suspeita de viola��o dos direitos',
	'fastb-dialog-ESR-language': 'Idioma (somente a sigla)',
	'fastb-dialog-ESR-addComent': 'Coment�rio adicional',
	'fastb-dialog-ESR-sendWarning': 'Enviar um aviso para o criador da p�gina',

	// Dialog [PE prompt]
	'fastb-dialog-PE-title': 'P�gina para eliminar',
	'fastb-dialog-PE-sendWarning': 'Enviar um aviso para o criador da p�gina',
	'fastb-dialog-PE-type-1': 'Enviar um aviso de elimina��o',
	'fastb-dialog-PE-type-2': 'Enviar um aviso de remo��o de marca��es de elimina��o nas p�ginas',
	'fastb-dialog-PE-create': 'Criar a discuss�o para a elimina��o da p�gina',
	'fastb-dialog-PE-reason': 'Justificativa para elimina��o. N�o precisa assinar.',

	// Dialog [Requests prompt]
	'fastb-dialog-requests-argumentation': 'Argumenta��o',
	'fastb-dialog-requests-page': 'P�gina',
	'fastb-dialog-requests-user': 'Usu�rio',
	'fastb-dialog-requests-subject': 'Assunto',
	'fastb-dialog-requests-historyPageExtra': 'P�gina 2',
	'fastb-dialog-requests-dontSign': 'N�o precisa assinar.',

	// Dialog [Merging prompt]
	'fastb-dialog-merging-title': 'Fus�o',
	'fastb-dialog-merging-page1': 'P�gina que permanecer�',
	'fastb-dialog-merging-page2': 'P�gina que ser� fundida com a de cima',

	// Page
	'fastb-page-ref': '$1 est� referenciada',
	'fastb-page-cat': '$1 est� categorizada',
	'fastb-page-iw': '$1 possui interwikis',
	'fastb-page-it': 'A p�gina',
	'fastb-page-backlinks': 'Afluentes da p�gina',
	'fastb-page-noBacklinks': 'Esta p�gina ainda n�o possui afluentes',
	'fastb-page-quality': 'Qualidade',
	'fastb-page-qualityUnknown': 'desconhecida',
	'fastb-page-deletedEdit': 'edi��o eliminada',
	'fastb-page-deletedEdits': 'edi��es eliminadas',
	'fastb-page-size': 'Tamanho',
	'fastb-page-watchers': 'Vigilantes',
	'fastb-page-lastEdit': '�ltima edi��o',
	'fastb-page-requestDeletion': 'Pedido de elimina��o',
	'fastb-page-requestDeletionLink': 'Pedido de elimina��o desta p�gina',
	'fastb-page-neverProposedElimination': 'A p�gina nunca foi proposta para elimina��o',
	'fastb-page-notExist': 'A p�gina n�o existe.',
	'fastb-page-pageDeleteDate': 'A p�gina foi deletada �s <b>$1</b>',
	'fastb-page-pageviews': 'Visualiza��es da p�gina',
	'fastb-page-moreInfo': 'Mais informa��es',
	'fastb-page-log': 'Registros da p�gina',
	'fastb-page-noEditPermission': 'Voc� n�o possui permiss�o para editar esta p�gina.',

	// Page [move]
	'fastb-page-move-noPermissions': 'Voc� n�o possui permiss�o para mover esta p�gina.',
	'fastb-page-move-moving': 'Movendo a p�gina',
	'fastb-page-move-redirect': 'Criar um redirecionamento',
	'fastb-page-move-talk': 'Mover a p�gina de discuss�o tamb�m, se aplic�vel',
	'fastb-page-move-reason': 'Motivo',
	'fastb-page-move-newTitle': 'Novo t�tulo',
	'fastb-page-move-buttonName': 'Mover a p�gina',
	'fastb-page-move-buttonTitle': 'Move a p�gina para o t�tulo informado',
	'fastb-page-move-mainDomain': '(Principal)',

	// User
	'fastb-user-anonFirstEdit': 'Primeira edi��o',
	'fastb-user-registryDate': 'Data de registro',
	'fastb-user-userFirstEdit': 'A data em quest�o se refere, na realidade, � primeira edi��o do usu�rio, pois n�o foi poss�vel obter a data de registro original, por se tratar de uma conta muito antiga',
	'fastb-user-unkownRegisterDate': 'N�o foi poss�vel encontrar a data de registro do editor.',
	'fastb-user-undefined': 'indefinido',
	'fastb-user-priorTo': 'antes de',
	'fastb-user-groups': 'Grupos',
	'fastb-user-edits': 'Edi��es',
	'fastb-user-blocked': 'Editor <b>bloqueado</b>',
	'fastb-user-error': 'Ocorreu um erro ao tentar obter as informa��es do usu�rio',
	'fastb-user-notExist': 'O usu�rio <b>n�o existe</b>',
	'fastb-user-anonNoEdit': 'Ainda n�o foi realizada nenhuma edi��o com este endere�o de IP',
	'fastb-user-anonLargeEdits': 'mais de $1',

	// Errors
	'fastb-error-unableGetList': 'n�o foi poss�vel obter a lista "$1" atrav�s da API.',
	'fastb-error-backlinksNoData': 'a consulta dos afluentes da p�gina n�o retornou nenhum dado.',
	'fastb-error-categoryIncompleteData': 'a consulta para se obter a qualidade da p�gina atrav�s das categorias retornou dados incompletos.',
	'fastb-error-categoryNoData': 'a consulta para se obter a qualidade da p�gina atrav�s das categorias n�o retornou nenhum dado.',
	'fastb-error-userInfoNoData': 'a consulta com as informa��es do usu�rio n�o retornou nenhum dado.',

	// Summary
	'fastb-summary-requestElimination': 'P�gina proposta para [[WP:ER|elimina��o r�pida]] (regra $1)',
	'fastb-summary-redirect': 'Feito redirecionamento para [[$1]]$2',
	'fastb-summary-addMessage': 'Adicionando mensagem com a predefini��o "[[Predefini��o:$1|$1]]"',
	'fastb-summary-stub': 'P�gina marcada como [[WP:EBC|esbo�o]]',
	'fastb-summary-addTag': 'Adicionando marca��o',
	'fastb-summary-ESR': 'P�gina proposta para [[WP:ESR|elimina��o semirr�pida]]',
	'fastb-summary-creatingEliminationPage': 'Criando p�gina de elimina��o',
	'fastb-summary-elimination': 'P�gina proposta para [[WP:Elimina��o por consenso|elimina��o por consenso]]',
	'fastb-summary-maintenance': 'Adicionando a p�gina "$1"',
	'fastb-summary-archivingPE': 'Arquivando pedido de elimina��o',
	'fastb-summary-newRequest': 'Adicionando novo pedido',
	'fastb-summary-addMergingPropose': 'Adicionando proposta de fus�o',

	// Warn [elimination]
	'fastb-warn-elimination-summary-pageElimination': 'Aviso sobre a elimina��o da p�gina "[[$1]]"',
	'fastb-warn-elimination-summary-removeEliminationTag': 'Aviso sobre a remo��o da marca��o de elimina��o da p�gina',
	'fastb-warn-elimination-prompt-title': 'Enviar notifica��o',
	'fastb-warn-elimination-prompt-select-user': 'Para enviar um aviso de elimina��o ao editor <a href="/wiki/User:$1">$1</a>, selecione uma op��o abaixo',
	'fastb-warn-elimination-prompt-select-anon': 'Para enviar um aviso de elimina��o ao usu�rio an�nimo <a href="/wiki/Special:Contributions/$1">$1</a>, selecione uma op��o abaixo',
	'fastb-warn-elimination-prompt-option-1': 'Enviar um aviso de elimina��o',
	'fastb-warn-elimination-prompt-option-2': 'Enviar um aviso sobre a remo��o da marca��o de elimina��o da p�gina',
	'fastb-warn-elimination-prompt-option-3': 'N�o enviar nenhum aviso',

	// Warn [maintenanceTags]
	'fastb-warn-maintenanceTags-summary': 'Aviso sobre a marca��o da p�gina "[[$1]]" com a predefini��o "[[Predefini��o:$2|$2]]"',
	'fastb-warn-maintenanceTags-prompt-title': 'Enviar notifica��o sobre a marca��o de "$1"',
	'fastb-warn-maintenanceTags-prompt-content': 'Deseja notificar o editor <a href="/wiki/User:$1">$1</a>?'
} );

var nsNum = mw.config.get( 'wgNamespaceNumber' ),
	pageName = mw.config.get( 'wgPageName' ),
	userGroups = mw.config.get( 'wgUserGroups' ),
	userName =  ( mw.config.get( 'wgCanonicalSpecialPageName' ) !== 'Contributions' )
		? mw.config.get( 'wgTitle' ).split( '/' )[ 0 ]
		: window.decodeURI( mw.util.getUrl().split( '/' )[ 3 ] || mw.util.getParamValue( 'target' ) );

function redirectEliminationPrevent () {
	var buttons = {},
		apiDeferred = $.Deferred();

	buttons[ fastb.message( 'fastb-yes' ) ] = function () {
		apiDeferred.resolve( 'continue' );
		$( this ).dialog( 'close' );
	};

	buttons[ fastb.message( 'fastb-no' ) ] = function () {
		apiDeferred.resolve();
		$( this ).dialog( 'close' );
	};

	fastb.dialog( {
		title: fastb.message( 'fastb-checkingBacklinksTitle' ),
		content: fastb.message( 'fastb-checkingBacklinksText' )
	} );

	fastb.callAPI( 'backLinks', 'justData' ).done( function ( data ) {
		if ( !data.query.backlinks.length ) {
			$( '.fastb-dialog' ).last().dialog( 'close' );
			apiDeferred.resolve( 'continue' );
		} else {
			$( '.fastb-dialog' ).last().dialog( 'close' );
			fastb.dialog( {
				title: fastb.message( 'fastb-checkingBacklinksTitle' ),
				content: fastb.message( 'fastb-checkingBacklinksStop' ),
				buttons: buttons
			} );
		}
	} );

	return apiDeferred.promise();
}

$.extend( fastb.buttons, {
	/**
	 * Submenu [Elimina��o]
	 * @property {Object[]} elimination
	 */
	elimination: [ {
			action: function () {
				fastb.changeSubmenu( fastb.buttons.ER );
			},
			text: 'R�pida',
			title: 'Exibir regras para a elimina��o r�pida'
		}, {
			action: fastb.openPrompt.bind( fastb, 'ESR' ),
			text: 'Semirr�pida',
			title: 'Exibe um prompt para propor a elimina��o semirr�pida da p�gina',
			disable: $.inArray( nsNum, [ 0, 6 ] ) === -1
		}, {
			action: fastb.openPrompt.bind( fastb, 'PE' ),
			text: 'Consenso',
			title: 'Marcar para elimina��o por consenso',
			disable: $.inArray( nsNum, [ 8, 828 ] ) !== -1
		}, {
			action: function() {
				fastb.changeSubmenu( fastb.buttons.insufficiency );
			},
			text: 'Insufici�ncia',
			title: 'Exibir bot�es para candidatos a artigos',
			disable: nsNum !== 0
		}
	],

	insufficiency: [ {
			action: 'Artigo insuficiente',
			templatename: 'Artigo insuficiente',
			text: 'Candidato a artigo',
			title: 'Marcar como candidato a artigo',
			sum: 'P�gina marcada para [[WP:CA|candidato a artigo]]',
			prompt: 'Justifique o porqu� desta p�gina<br />obedecer �s regras de <code>[[<a href="https://pt.wikipedia.org/wiki/Wikip%C3%A9dia:Candidatos_a_artigo">WP:CA</a>]]</code>.',
			label: 'Justificativa[required]',
			disable: nsNum !== 0
		}, {
			action: 'Candidatura-cabe�alho',
			templatename: 'Candidatura-cabe�alho',
			text: 'Enviar para manuten��o',
			title: 'Enviar o artigo para manuten��o, para que seus problemas sejam corrigidos',
			sum: 'Artigo marcado para manuten��o, conforme [[WP:CA]]',
			prompt: 'Justifique o motivo para levar a p�gina � manuten��o',
			label: 'Justificativa[required]',
			disable: nsNum !== 0
		}, {
			action: 'Elimina��o por insufici�ncia',
			templatename: 'Elimina��o por insufici�ncia',
			text: 'Elimina��o por insufici�ncia',
			title: 'Atestar o artigo como insuficiente, ap�s decorrido o prazo de manuten��o',
			sum: 'Artigo marcado para elimina��o por insufici�ncia',
			prompt: 'Justifique o motivo da elimina��o',
			label: 'Justificativa[required]',
			disable: nsNum !== 0 || ( $.inArray( 'sysop', userGroups ) !== -1
				&& $.inArray( 'eliminator', userGroups ) !== -1
			)
		}
	],

	/**
	 * Submenu [ER]
	 * @property {Object[]} ER
	 */
	ER: [ {
			action: 'ER|1',
			text: '1',
			title: 'Marcar subp�gina do pr�prio usu�rio para elimina��o',
			disable: true
		}, {
			action: 'ER|5',
			text: '5',
			title: 'Aparecimento recorrente (se o conte�do for igual ao eliminado por consenso)'
		}, {
			action: 'ER|6',
			text: '6',
			title: 'T�tulo � SPAM',
			disable: nsNum !== 0
		}, {
			action: 'ER|7',
			text: '7',
			title: 'Pr�prio criador reconhece que se enganou'
		}, {
			action: 'ER|8',
			text: '8',
			title: 'Elimina��o tempor�ria sem perda de hist�rico para resolver problemas t�cnicos',
			disable: $.inArray( 'sysop', mw.config.get( 'wgUserGroups' ) ) === -1
				&& $.inArray( 'eliminator', mw.config.get( 'wgUserGroups' ) ) === -1
		}, {
			preload: redirectEliminationPrevent,
			action: 'ER|9',
			text: '9',
			title: 'Eliminar redirect, p�gina sem hist�rico relevante (mover p�gina redirecionada para c�)',
			disable: !mw.config.get( 'wgIsRedirect' )
		}, {
			action: 'ER|10',
			text: '10',
			title: 'Dom�nio que n�o existe (Wikip�dia, AjUda)',
			disable: nsNum !== 0
		}, {
			action: 'ER|12',
			text: '12',
			title: 'Imagem (somente por quem a carregou)',
			disable: nsNum !== 6
		}, {
			action: 'ER|13',
			text: '13',
			title: 'P�gina sem hist�rico relevante que � viola��o flagrante de direitos autorais de outras p�ginas na internet',
			disable: nsNum !== 0
		}, {
			action: 'ER|14',
			text: '14',
			title: 'Ficheiro (arquivos) duplicados',
			disable: nsNum !== 6
		}, {
			action: 'ER|17',
			text: '17',
			title: 'Salto de dom�nio'
		}, {
			action: 'ER|18',
			text: '18',
			title: 'Discuss�o cujos artigos n�o existem',
			disable: nsNum !== 1
		}, {
			action: 'ER|20',
			text: '20',
			title: 'Impr�prio'
		}, {
			action: 'ER|21',
			text: '21',
			title: 'P�gina de elimina��o de um artigo antes de passados 6 meses do �ltimo consenso',
			disable: pageName.indexOf( 'Wikip�dia:P�ginas_para_eliminar/' ) !== 0
		}, {
			action: 'ER|A1',
			text: 'A1',
			title: 'P�gina com o t�tulo malformatado, absurdo, com palavras que n�o'
				+ ' o s�o, com erros devidos � m� configura��o do teclado, com codifica��o'
				+ ' incorreta do sistema ou que expressem dom�nios que n�o existem.',
			disable: nsNum !== 0
		}, {
			action: 'ER|A2',
			text: 'A2',
			title: 'Sem contexto',
			disable: nsNum !== 0
		}, {
			action: 'ER|A3',
			text: 'A3',
			title: 'Sem conte�do',
			disable: nsNum !== 0
		}, {
			action: 'ER|A4',
			text: 'A4',
			title: 'Sem indica��o de import�ncia'
				+ ' (pessoas, animais, organiza��es, conte�do web, eventos)',
			disable: nsNum !== 0
		}, {
			action: 'ER|A5',
			text: 'A5',
			title: 'Sem indica��o de import�ncia'
				+ ' (grava��es musicais e livros)',
			disable: nsNum !== 0
		}, {
			action: 'ER|A6',
			text: 'A6',
			title: 'Artigo criado recentemente que duplica um t�pico existente',
			disable: nsNum !== 0
		}, {
			action: 'ER|C1',
			text: 'C1',
			title: 'Categoria vazia, desnecess�ria ou substitu�da',
			disable: nsNum !== 14
		}, {
			action: 'ER|D1',
			text: 'D1',
			title: 'Discuss�o de p�gina inexistente',
			disable: nsNum % 2 === 0
		}, {
			action: 'ER|D2',
			text: 'D2',
			title: 'Discuss�o de p�gina para elimina��o ou com hist�rico irrelevante',
			disable: nsNum % 2 === 0
		}, {
			action: 'ER|U1',
			text: 'U1',
			title: 'Uso impr�prio da p�gina de usu�rio',
			disable: $.inArray( nsNum, [ 2, 3 ] ) === -1
		}, {
			action: 'ER|U2',
			text: 'U2',
			title: 'P�gina de usu�rio criada por outro usu�rio',
			disable: nsNum !== 2
		}, {
			action: 'ER|P1',
			text: 'P1',
			title: 'Predefini��o vazia, desnecess�ria ou substitu�da',
			disable: nsNum !== 10
		}, {
			action: 'ER|P2',
			text: 'P2',
			title: 'Predefini��o que � uma deturpa��o das regras',
			disable: nsNum !== 10
		}, {
			preload: redirectEliminationPrevent,
			action: 'ER|R1',
			text: 'R1',
			title: 'Redirecionamento indevido, desnecess�rio, sem afluentes, para p�ginas inexistente ou eliminadas',
			disable: !mw.config.get( 'wgIsRedirect' )
		}, {
			action: 'ER|G1',
			text: 'G1',
			title: 'Elimina��o t�cnica'
		}
	],

	/**
	 * Submenu [Manute��o]
	 * @property {Object[]} maintenance
	 */
	maintenance: [ {
			action: 'subst:s-fontes',
			templatename: 'Sem-fontes',
			text: 'Sem fontes',
			title: 'P�gina n�o cita nenhuma fonte ou refer�ncia',
			sum: 'P�gina marcada como sem fontes',
			warn: true
		}, {
			action: 'subst:s-fontes-bpv',
			templatename: 'Sem-fontes-bpv',
			text: 'Sem fontes BPV',
			title: 'Biografia de pessoa viva que n�o cita nenhuma fonte',
			sum: 'P�gina marcada como [[WP:BPV|biografia de pessoa viva]] sem fontes',
			warn: true
		}, {
			action: 'subst:s-notas',
			templatename: 'Sem notas',
			text: 'Sem notas',
			title: 'Existem fontes no final da p�gina, mas n�o s�o citadas no corpo do artigo',
			sum: 'P�gina marcada como sem notas'
		}, {
			action: 'subst:m-fontes',
			templatename: 'Mais fontes',
			text: 'Mais fontes',
			title: 'P�gina cita fontes fi�veis, mas n�o cobre todo o texto',
			sum: 'P�gina marcada que carece de mais fontes'
		}, {
			action: 'subst:m-fontes-bpv',
			templatename: 'Mais fontes-bpv',
			text: 'Mais fontes BPV',
			title: 'Biografia de pessoa viva que cita fontes, por�m que n�o cobrem todo o texto',
			sum: 'P�gina marcada como [[WP:BPV|biografia de pessoa viva]] que carece de mais fontes'
		}, {
			action: 'subst:fpr',
			templatename: 'Fontes prim�rias',
			text: 'Fonte prim�ria',
			title: 'Artigo necessita de fontes secund�rias fi�veis publicadas por terceiros',
			sum: 'P�gina marcada como sem fontes secund�rias fi�veis'
		}, {
			action: 'subst:f-refer�ncias',
			templatename: 'Formatar refer�ncias',
			text: 'Formatar refer�ncias',
			title: 'Artigo cont�m refer�ncias que necessitam de formata��o',
			sum: 'P�gina marcada que existem refer�ncias sem formata��o'
		}, {
			action: 'subst:wkf',
			templatename: 'Wikifica��o',
			text: 'Wikificar',
			title: 'N�o est� formatado de acordo com o livro de estilo',
			sum: 'P�gina marcada para [[WP:WKF|wikifica��o]]'
		}, {
			action: 'subst:rec',
			templatename: 'Reciclagem',
			text: 'Reciclagem',
			title: 'P�gina precisa ser reciclada de acordo com o livro de estilo',
			sum: 'P�gina marcada para [[WP:RECI|reciclagem]]'
		}, {
			action: 'subst:s-cat',
			templatename: 'Sem cat',
			text: 'Sem categoria',
			title: 'P�gina n�o est� em nenhuma categoria',
			sum: 'P�gina marcada como sem categoria',
			warn: true
		}, {
			action: 'Sem infocaixa',
			templatename: 'Sem infocaixa',
			text: 'Sem infocaixa',
			title: 'P�gina n�o possui nenhuma infocaixa',
			prompt: 'Existe alguma sugest�o de infocaixa a ser usada?<br />Obs: n�o colocar <b>Predefini��o:Info/NOME</b>, e sim somente <b>NOME</b>.',
			label: 'Sugest�o',
			sum: 'P�gina marcada como sem infocaixa'
		}, {
			action: 'Parcial',
			templatename: 'Parcial',
			text: 'Parcial',
			title: 'Artigo possui passagens que n�o respeitam o princ�pio da imparcialidade',
			sum: 'P�gina marcada como parcial'
		}, {
			action: 'subst:pub',
			templatename: 'Publicidade',
			text: 'Publicidade',
			title: 'A conte�do da p�gina est� possivelmente apresentado em formato publicit�rio',
			sum: 'P�gina marcada que possui conte�do em formato publicit�rio'
		}, {
			action: 'subst:ctx',
			templatename: 'Contextualizar',
			text: 'Contexto',
			title: 'P�gina carece de contexto',
			sum: 'P�gina marcada como sem contexto'
		}, {
			action: 'subst:n�o-enc',
			templatename: 'N�o enciclop�dico',
			text: 'N�o enciclop�dico',
			title: 'A conte�do da p�gina � possivelmente apresentado de uma maneira n�o-enciclop�dica',
			sum: 'P�gina marcada que possui conte�do n�o-enciclop�dico'
		}, {
			action: 'Global',
			templatename: 'Global',
			text: 'Global',
			title: 'A conte�do da p�gina est� redigido sob uma perspectiva majoritariamente brasileira, portuguesa ou lus�fona',
			sum: 'P�gina marcada que possui um conte�do redigido numa perspectiva regionalizada',
			prompt: 'Qual o tipo da perspectiva?',
			label: 'Digite o n�mero correspondente:<br />1 = Lusofonia<br />2 = Brasil<br />3 = Portugal<br />Ou deixe em branco para utilizar a predefini��o gen�rica[optional]'
		}, {
			action: 'M� tradu��o',
			templatename: 'M� tradu��o',
			text: 'M� tradu��o',
			title: 'A conte�do da p�gina est� possivelmente mal traduzido',
			sum: 'P�gina marcada como m� tradu��o'
		}, {
			action: 'Corrigir',
			templatename: 'publicidade',
			text: 'Corrigir',
			title: 'A conte�do da p�gina possivelmente precisa de corre��o ortogr�fico-gramatical',
			sum: 'P�gina marcada como carece de corre��o'
		}, {
			action: 'Revis�o',
			templatename: 'Revis�o',
			text: 'Revis�o',
			title: 'A conte�do da p�gina est� possivelmente inconsistente',
			sum: 'P�gina marcada para revis�o'
		}, {
			action: 'Em manuten��o',
			templatename: 'Em manuten��o',
			text: 'Em manuten��o',
			title: 'Marcar a p�gina para uma manuten��o emergencial, afim de evitar uma elimina��o',
			sum: 'P�gina marcada para manuten��o emergencial'
		}, {
			action: 'Desatualizado',
			templatename: 'Desatualizado',
			text: 'Desatualizado',
			title: 'A p�gina cont�m um conte�do que pode est� desatualizado',
			sum: 'P�gina marcada como desatualizada'
		}, {
			action: 'subst:ev-atual',
			templatename: 'Evento atual',
			text: 'Evento atual',
			title: 'Artigo sobre um evento atual',
			sum: 'P�gina marcada como evento atual',
			prompt: 'Especifique o evento, preferencialmente (<a href="https://pt.wikipedia.org/wiki/Predefini%C3%A7%C3%A3o:Evento_atual#Uso">temas poss�veis<a>).',
			label: 'Tema do evento'
		}, {
			action: 'subst:m-recente',
			templatename: 'Morte recente',
			text: 'Morte recente',
			title: 'Artigo sobre uma pessoa que morreu recentemente',
			sum: 'P�gina marcada como morte recente'
		}, {
			action: fastb.openPrompt.bind( fastb, 'merging' ),
			text: 'Fus�o',
			title: 'P�gina necessita de fus�o',
		}, {
			action: 'Renomear p�gina',
			templatename: 'Renomear p�gina',
			text: 'Renomear p�gina',
			title: 'Proposi��o para renomear o nome da p�gina',
			prompt: 'Indique o novo nome sugerido e o motivo.',
			label: 'Novo nome|2=Motivo',
			sum: 'P�gina marcada para renomea��o'
		},
	],

	/**
	 * Submenu [Aviso]
	 * @property {Object[]} warn
	 */
	warn: [  {
			action: 'subst:bem-vindo(a)',
			text: 'BV',
			title: 'Bem-vindo(a) � Wikip�dia',
			disable: mw.util.isIPAddress( userName )
		}, {
			action: 'subst:bv-av-registrado',
			text: 'Av-BV',
			title: 'Aviso sobre erro em artigo e boas-vindas para usu�rio(a) registrado',
			prompt: 'Aviso sobre qual artigo?',
			label: 'Artigo',
			disable: mw.util.isIPAddress( userName )
		}, {
			action: 'subst:bem-vindo IP',
			text: 'BV-IP',
			title: 'Boas-vindas para usu�rio(a) n�o registrado(a)',
			disable: !mw.util.isIPAddress( userName )
		}, {
			action: 'subst:bv-av',
			text: 'Av-BV-IP',
			title: 'Aviso sobre erro em artigo e boas-vindas para usu�rio(a) n�o registrado(a)',
			prompt: 'Aviso sobre qual artigo?',
			label: 'Artigo',
			disable: !mw.util.isIPAddress( userName )
		}, {
			action: 'Vandalismo repetido',
			text: 'Vandalismo repetido',
			title: 'Adiciona uma marca informando que o IP em quest�o tem sido constantemente bloqueado.',
			disable: !mw.util.isIPAddress( userName )
		}, {
			action: 'subst:nome impr�prio',
			text: 'Nome impr�prio',
			title: 'Aviso sobre o nome impr�prio do usu�rio'
		}, {
			action: 'subst:aviso-ER',
			text: 'Av-ER',
			title: 'Aviso sobre elimina��o r�pida',
			prompt: 'Qual p�gina foi proposta para elimina��o?',
			label: 'P�gina|2=Regra de elimina��o'
		}, {
			action: 'subst:av-bv-ER',
			text: 'Av-BV-ER',
			title: 'Aviso sobre elimina��o r�pida + boas-vindas',
			prompt: 'Qual p�gina foi proposta para elimina��o?',
			label: 'P�gina|2=Regra de elimina��o'
		}, {
			action: 'subst:aviso-ESR',
			text: 'Av-ESR',
			title: 'Aviso sobre elimina��o semirr�pida',
			prompt: 'Qual p�gina foi proposta para elimina��o?',
			label: 'P�gina'
		}, {
			action: 'subst:aviso-PE',
			text: 'Av-PE',
			title: 'Aviso sobre elimina��o por consenso',
			prompt: 'Qual p�gina foi proposta para elimina��o?',
			label: 'P�gina'
		}, {
			action: 'subst:av-p�gina de usu�rio',
			text: 'Av-PU',
			title: 'Considere refazer a p�gina de usu�rio(a)'
		}, {
			action: 'subst:bv-propaganda',
			text: 'Propaganda + BV',
			title: 'Caro editor,por favor n�o fa�a propaganda, [...] Apesar disso, bem-vindo � Wikip�dia'
		}, {
			action: 'subst:aviso',
			text: 'Av-erro em p�gina',
			title: 'Aviso sobre erro em artigo',
			prompt: 'Aviso sobre qual artigo?',
			label: 'Artigo'
		}, {
			action: 'subst:aviso2',
			text: 'Av2',
			title: 'Aviso sobre vandalismo',
			prompt: 'Qual p�gina foi vandalizada?',
			label: 'P�gina'
		}, {
			action: 'subst:aviso-vandalismo',
			text: 'Av-vandalismo',
			title: 'N�o vandalize os artigos',
			prompt: 'Qual o n�vel do aviso (1 para primeiro, 2 para segundo, 3 para terceiro ou b para notifica��o de bloqueio)? E que p�gina foi vandalizada?',
			label: 'N�vel|2=P�gina'
		}, {
			action: 'subst:av-Bpv',
			text: 'Av-BPV',
			title: 'N�o adicione conte�do difamat�rio nos artigos sobre biografias de pessoas vivas',
			prompt: 'Qual o n�vel do aviso (1 para primeiro, 2 para segundo, 3 para terceiro ou b para notifica��o de bloqueio)? E em que p�gina foi adicionado conte�do difamat�rio?',
			label: 'N�vel|2=P�gina'
		}, {
			action: 'subst:aviso-mo��o',
			text: 'Aviso-mo��o',
			title: 'N�o mova p�ginas indevidamente',
			prompt: 'Qual o n�vel do aviso (1 para primeiro, 2 para segundo, 3 para terceiro ou b para notifica��o de bloqueio)? E qual p�gina foi movida indevidamente?',
			label: 'N�vel|2=P�gina'
		}, {
			action: 'subst:av-Remo��o',
			text: 'Av-remo��o',
			title: 'N�o remova conte�do dos artigos',
			prompt: 'Qual o n�vel do aviso (1 para primeiro, 2 para segundo, 3 para terceiro ou b para notifica��o de bloqueio)? E de qual p�gina foi removido conte�do?',
			label: 'N�vel|2=P�gina'
		}, {
			action: 'subst:av-Spam',
			text: 'Av-spam',
			title: 'N�o insira liga��es externas inadequadas nos artigos',
			prompt: 'Qual o n�vel do aviso (1 para primeiro, 2 para segundo, 3 para terceiro ou b para notifica��o de bloqueio)? E em que p�gina foram inseridas liga��es externas inadequadas?',
			label: 'N�vel|2=P�gina'
		}, {
			action: 'subst:av-teste',
			text: 'Av-teste',
			title: 'N�o fa�a testes nos artigos',
			prompt: 'Qual o n�vel do aviso (1 para primeiro, 2 para segundo, 3 para terceiro ou b para notifica��o de bloqueio)? E em que p�gina foram feitos testes?',
			label: 'N�vel|2=P�gina'
		}, {
			action: 'subst:av-data',
			text: 'Av-data',
			title: 'N�o insira seu nome e data de nascimento em p�ginas de datas',
			prompt: 'Em que p�gina de data foram inseridos o nome e a data de nascimento?',
			label: 'P�gina'
		}, {
			action: 'subst:av-interwiki',
			text: 'Av-interwikis',
			title: 'Faltou adicionar os interwikis � p�gina',
			prompt: 'Qual foi a p�gina?',
			label: 'P�gina'
		}, {
			action: 'subst:av-categoria',
			text: 'Av-Categoria',
			title: 'Faltou adicionar categorias � p�gina',
			prompt: 'Qual foi a p�gina?',
			label: 'P�gina'
		}, {
			action: 'subst:assine',
			text: 'Assine',
			title: 'Faltou assinar o coment�rio',
			prompt: 'Qual foi o local?',
			label: 'Local'
		}, {
			action: 'subst:morder',
			text: 'Morder',
			title: 'Aviso sobre ser agressivo com os novatos',
			prompt: 'Qual usu�rio foi mordido? Pode deixar uma observa��o tamb�m',
			label: 'Usu�rio|2=Observa��o[optional]'
		}, {
			action: 'subst:propaganda',
			text: 'Propaganda',
			title: 'Caro editor, por favor n�o fa�a propaganda...',
			prompt: 'Em que p�gina foi feita propaganda?',
			label: 'P�gina'
		}, {
			action: 'subst:BSRE',
			text: 'BSRE',
			title: 'Aviso de biografia sem relevo enciclop�dico',
			prompt: 'Qual artigo?',
			label: 'Artigo'
		}, {
			action: 'subst:c�pia',
			text: 'C�pia',
			title: 'Aviso sobre artigo copiado de fonte externa/VDA',
			prompt: 'Qual a p�gina da Wikip�dia? E qual a URL da p�gina copiada?',
			label: 'P�gina|2=URL'
		}, {
			action: 'subst:linguagem incorreta',
			text: 'Linguagem',
			title: 'N�o insulte nem use linguagem inadequada em artigos ou discuss�es'
		}, {
			action: 'subst:ortografia',
			text: 'Ortografia',
			title: 'N�o mude a vers�o da l�ngua',
			prompt: 'Em qual artigo a vers�o da l�ngua foi alterada?',
			label: 'Artigo'
		}, {
			action: 'subst:mostrar previs�o',
			text: 'Salvamento sucessivo',
			title: 'N�o fa�a salvamentos sucessivos, utilize o bot�o \'Mostrar previs�o\'',
			prompt: 'Em que artigo foram feitos salvamentos sucessivos?',
			label: 'P�gina'
		}, {
			action: 'subst:n�o remova',
			text: 'N�o remova',
			title: 'N�o remova marca��es de elimina��o das p�ginas',
			prompt: 'Qual p�gina em que a marca��o de elimina��o foi removida? Se desejar, pode especificar o tipo de marca��o.',
			label: 'P�gina|2=Tipo de marca��o[optional]',
			sum: 'Aviso sobre remo��o de marca��es de elimina��o das p�ginas'
		}, {
			action: 'subst:autobiografia',
			text: 'Autobiografia',
			title: 'N�o crie autobiografias',
			prompt: 'Qual autobiografia foi criada?',
			label: 'P�gina'
		}, {
			action: 'subst:cite fonte',
			text: 'Citar fontes',
			title: 'Faltou citar fontes � p�gina',
			prompt: 'Qual foi a p�gina?',
			label: 'P�gina'
		}, {
			action: 'subst:aviso-GE',
			text: 'Aviso-GE',
			title: 'A p�gina foi protegida devido � guerra de edi��es',
			prompt: 'Qual p�gina foi protegida?',
			label: 'P�gina'
		}, {
			action: 'subst:bloqueado',
			text: 'Bloqueado',
			title: 'Notifica��o de bloqueio quando o usu�rio N�O est� autorizado a usar a sua discuss�o',
			prompt: 'Especifique o tempo e o motivo do bloqueio.',
			label: 'Tempo|2=Motivo'
		}, {
			action: 'subst:bloqueado-disc',
			text: 'Bloqueado-disc',
			title: 'Notifica��o de bloqueio com discuss�o quando o usu�rio est� autorizado a usar a sua discuss�o',
			prompt: 'Especifique o tempo e o motivo do bloqueio.',
			label: 'Tempo|2=Motivo'
		}, {
			action: 'subst:bloqueado-CPV',
			text: 'Bloqueado-CPV',
			title: 'Notifica��o de bloqueio para contas para vandalismo'
		}, {
			action: 'subst:proxy',
			text: 'Proxy',
			title: 'Notifica��o de proxy bloqueado'
		}
	],

	/**
	 * Submenu [Busca]
	 * @property {Object[]} search
	 */
	search: [ {
			text: 'Google',
			desc: 'Pesquisar o t�tulo desta p�gina no Google',
			url: '//www.google.com/search?&as_eq=wikipedia&as_epq='
		}, {
			text: 'Google not�cias',
			desc: 'Pesquisar o t�tulo desta p�gina no Google Not�cias',
			url: '//google.com/search?tbm=nws&q='
		}, {
			text: 'Google livros',
			desc: 'Pesquisar o t�tulo desta p�gina no Google Livros',
			url: '//books.google.com/books?&as_brr=0&as_epq='
		}, {
			text: 'Google acad�mico',
			desc: 'Pesquisar o t�tulo desta p�gina no Google Acad�mico',
			url: '//scholar.google.com/scholar?q='
		}, {
			text: 'Bing',
			desc: 'Pesquisar o t�tulo desta p�gina no Bing',
			url: '//www.bing.com/search?q='
		}
	],

	/**
	 * Submenu [PetScan]
	 * @property {Object[]} cat
	 */
	cat: [ {
			text: 'Sem fontes',
			desc: 'Procurar p�ginas desta categoria que precisam de fontes',
			url: '&templates_yes=Sem-fontes'
		}, {
			text: 'Revis�o',
			desc: 'Procurar p�ginas desta categoria que precisam de revis�o',
			url: '&templates_yes=Revis%C3%A3o'
		}, {
			text: 'Wikifica��o',
			desc: 'Procurar p�ginas desta categoria que precisam de wikifica��o',
			url: '&templates_yes=Wikifica%C3%A7%C3%A3o'
		}, {
			text: 'Menos de 1 000 bytes ou 4 links',
			desc: 'Procurar p�ginas desta categoria que possuem menos de 1 000 bytes ou 4 links',
			url: '&smaller=1000&minlinks=4'
		}, {
			text: 'Menos de 500 bytes ou 2 links',
			desc: 'Procurar p�ginas desta categoria que possuem menos de 500 bytes ou 2 links',
			url: '&smaller=500&minlinks=2'
		}
	],

	/**
	 * Submenu [Pedidos]
	 * @property {Object[]} requests
	 */
	requests: [ {
			action: 'request',
			text: 'Bloqueio',
			title: 'Requisitar o bloqueio de um usu�rio.',
			placeholder: 'Qual a justificativa para o pedido de bloqueio?',
			page: 'Wikip�dia:Pedidos/Bloqueio'
		}, {
			action: 'request',
			text: 'Desprote��o',
			title: 'Requisitar a desprote��o de uma p�gina.',
			placeholder: 'Qual a justificativa para o pedido de desprote��o?',
			page: 'Wikip�dia:Pedidos/Desprote��o'
		}, {
			action: 'request',
			text: 'Edi��o',
			title: 'Requisitar uma altera��o de uma p�gina, pois devido ao fato de estar protegida, n�o pode ser feita por voc�.',
			placeholder: 'Qual a altera��o deseja fazer e por qu�?',
			page: 'Wikip�dia:Pedidos/P�ginas protegidas'
		}, {
			action: 'request',
			text: 'Hist�rico',
			title: 'Requisitar a fus�o do hist�rico de uma p�gina com outra.',
			placeholder: 'Qual a justificativa para o pedido de fus�o de hist�ricos?',
			page: 'Wikip�dia:Pedidos/Hist�rico'
		}, {
			action: 'request',
			text: 'Prote��o',
			title: 'Requisitar a prote��o de uma p�gina.',
			placeholder: 'Qual a justificativa para o pedido de prote��o?',
			page: 'Wikip�dia:Pedidos/Prote��o'
		}, {
			action: 'request',
			text: 'Restauro',
			title: 'Requisitar o restauro de uma p�gina',
			placeholder: 'Qual a justificativa para o pedido de restauro?',
			page: 'Wikip�dia:Pedidos/Restauro'
		}, {
			action: 'request',
			text: 'Supress�o',
			title: 'Requisitar a supress�o de uma ou mais edi��es de uma p�gina.',
			page: 'Wikip�dia:Pedidos/Supress�o',
			placeholder: 'Quais edi��es devem ser suprimidas e por qu�?'
		}, {
			action: 'request',
			text: 'Outro',
			title: 'Fazer um pedido sobre algo.',
			page: 'Wikip�dia:Pedidos/Outros',
			placeholder: 'Esclare�a o pedido.'
		}
	],

	/**
	 * User infomation
	 * @property {Object[]} userInfo
	 */
	userInfo: [ {
			href: mw.util.getUrl( 'Special:Contributions/' ) + userName,
			title: 'Abrir a lista de contribui��es deste editor',
			text: 'Contribui��es',
			disable: mw.config.get( 'wgCanonicalSpecialPageName' ) === 'Contributions'
		}, {
			href: mw.util.getUrl( 'Special:Log/' ) + userName,
			title: 'Abrir a lista de registros deste editor',
			text: 'Registros'
		}, {
			href: mw.util.getUrl( 'Special:Log' ) + '?type=block&page=User%3A' + userName,
			title: 'Abrir a lista de registros de bloqueio deste editor',
			text: 'Registros de bloqueio'
		}, {
			href: 'https://xtools.wmflabs.org/ec/pt.wikipedia.org/' + userName,
			title: 'Abrir a contagem de edi��es deste editor',
			text: 'Contador de edi��es'
		}, {
			href: 'https://xtools.wmflabs.org/pages/pt.wikipedia.org/' + userName,
			title: 'Abrir a lista de p�ginas criadas por este editor',
			text: 'P�ginas criadas'
		}, {
			href: 'https://tools.wmflabs.org/stimmberechtigung/direito_ao_voto.php?user=' + userName,
			title: 'Verificar se o editor possui direito ao voto',
			text: 'Direito ao voto'
		}
	],

	/**
	 * Recent Changes, new pages and watched pages
	 * @property {Object[]} list
	 */
	list:  [ {
			action: function () {
				fastb.callAPI( 'PV' );
			},
			text: 'P�ginas vigiadas',
			title: 'Exibir p�ginas vigiadas que foram alteradas recentemente'
		}, {
			action: function () {
				fastb.callAPI( 'MR' );
			},
			text: 'Mudan�as recentes',
			title: 'Exibir mudan�as recentes feitas por IPs em p�ginas do dom�nio principal'
		}, {
			action: function () {
				fastb.callAPI( 'PN' );
			},
			text: 'P�ginas novas',
			title: 'Exibir p�ginas novas que ainda n�o foram patrulhadas'
		}, {
			action: function () {
				fastb.callAPI( 'SCORES' );
			},
			text: 'Edi��es a revisar',
			title: 'Exibir edi��es com grandes chances de serem desfeitas e que ainda n�o foram patrulhadas'
		}, {
			action: function () {
				fastb.callAPI( 'ER' );
			},
			text: 'Elimina��o r�pida',
			title: 'Exibir as p�ginas que foram marcadas para elimina��o r�pida'
		}
	]
} );

/**
 * Default justifications for the ESR prompt
 * @property {Object[]} defaultJustifications_ESR
 */
fastb.defaultJustificationsESR = {
	'Arte': 'Artigo sem [[WP:FF|fontes fi�veis]] e [[WP:FI|independentes]] que confirmem as afirma��es do texto e atestem'
		+ ' notoriedade. Ver [[WP:V|princ�pio da verificabilidade]] e [[WP:CDN|crit�rios de notoriedade]]. P�ginas'
		+ ' pessoais, sites de f�s, blogues e redes sociais (como Facebook, Twitter, etc.) n�o s�o fontes fi�veis.',

	'Banda': [
		'Artigo sobre banda/grupo musical sem [[WP:FF|fontes fi�veis]] e [[WP:FI|independentes]] que confirmem as afirma��es do'
			+ ' texto e atestem a notoriedade do artista ou de sua obra. Ver [[WP:V|princ�pio da verificabilidade]] e'
			+ ' [[WP:CDN|crit�rios de notoriedade]] (e o [[Wikip�dia:Crit�rios de notoriedade/M�sica|crit�rio espec�fico para m�sica]]). P�ginas'
			+ ' pessoais, sites de f�s, blogues e redes sociais (como Facebook, Twitter, etc.) n�o s�o fontes fi�veis.',
		'ESR-banda'
	],

	'Cantores, �lbuns e m�sicas':'Artigo relacionado � m�sica sem [[WP:FF|fontes fi�veis]] e [[WP:FI|independentes]] que confirmem as afirma��es do'
		+ ' texto e atestem a notoriedade do artista ou de sua obra. Ver [[WP:V|princ�pio da verificabilidade]] e'
		+ ' [[WP:CDN|crit�rios de notoriedade]] (e o [[Wikip�dia:Crit�rios de notoriedade/M�sica|crit�rio espec�fico para m�sica]]). P�ginas'
		+ ' pessoais, sites de f�s, blogues e redes sociais (como Facebook, Twitter, etc.) n�o s�o fontes fi�veis.',

	'Carnaval': 'Artigo sem [[WP:FF|fontes fi�veis]] e [[WP:FI|independentes]] que confirmem as afirma��es do texto e atestem'
		+ ' notoriedade. Ver [[WP:V|princ�pio da verificabilidade]] e [[WP:CDN|crit�rios de notoriedade]] (e o'
		+ ' [[Wikip�dia:Crit�rios de notoriedade/Carnaval|crit�rio espec�fico para carnaval]]). P�ginas pessoais, sites'
		+ ' de f�s, blogues e redes sociais (como Facebook, Twitter, etc.) n�o s�o fontes fi�veis.',

	'Ci�ncia': 'Artigo sem [[WP:FF|fontes fi�veis]] e [[WP:FI|independentes]] que confirmem as afirma��es do texto e atestem'
		+ ' notoriedade. Ver [[WP:V|princ�pio da verificabilidade]] e [[WP:CDN|crit�rios de notoriedade]]. P�ginas'
		+ ' pessoais, f�runs, blogues e redes sociais (como Facebook, Twitter, etc.) n�o s�o fontes fi�veis.',

	'Ci�ncias sociais': 'Artigo sem [[WP:FF|fontes fi�veis]] e [[WP:FI|independentes]] que confirmem as afirma��es do texto e atestem'
		+ ' notoriedade. Ver [[WP:V|princ�pio da verificabilidade]] e [[WP:CDN|crit�rios de notoriedade]]. P�ginas'
		+ ' pessoais, f�runs, blogues e redes sociais (como Facebook, Twitter, etc.) n�o s�o fontes fi�veis.',

	'Cinema': 'Artigo sem [[WP:FF|fontes fi�veis]] e [[WP:FI|independentes]] que confirmem as afirma��es do texto e atestem'
		+ ' notoriedade. Ver [[WP:V|princ�pio da verificabilidade]] e [[WP:CDN|crit�rios de notoriedade]]. (e o'
		+ ' [[Wikip�dia:Crit�rios de notoriedade/Cinema, r�dio e televis�o|crit�rio espec�fico para cinema]]). P�ginas'
		+ '  pessoais, sites de f�s, blogues e redes sociais (como Facebook, Twitter, etc.) n�o s�o fontes fi�veis.',

	'Educa��o': 'Artigo sem [[WP:FF|fontes fi�veis]] e [[WP:FI|independentes]] que confirmem as afirma��es do texto e atestem'
		+ ' notoriedade. Ver [[WP:V|princ�pio da verificabilidade]] e [[WP:CDN|crit�rios de notoriedade]] (e o'
		+ ' [[Wikip�dia:Crit�rios de notoriedade/Educa��o|crit�rio espec�fico para educa��o]]). P�ginas'
		+ ' pessoais, f�runs, blogues e redes sociais (como Facebook, Twitter, etc.) n�o s�o fontes fi�veis.',

	'Empresas, produtos e servi�os': [
		'Artigo sobre organiza��o sem [[WP:FF|fontes fi�veis]] e [[WP:FI|independentes]] que confirmem as afirma��es'
			+ ' do texto e atestem notoriedade. Ver [[WP:V|princ�pio da verificabilidade]] e [[WP:CDN|crit�rios'
			+ ' de notoriedade]] (e os [[Wikip�dia:Crit�rios de notoriedade/Empresas, produtos e servi�os|crit�rios espec�ficos para'
			+ ' empresas, produtos e servi�os]]). P�ginas mantidas pela pr�pria organiza��o, blogues, f�runs e redes sociais (como'
			+ ' Facebook, Twitter, etc.) n�o s�o considerados fontes fi�veis.',
		'ESR-organiza��o'
	],

	'Entretenimento': 'Artigo sem [[WP:FF|fontes fi�veis]] e [[WP:FI|independentes]] que confirmem as afirma��es do texto e atestem'
		+ ' notoriedade. Ver [[WP:V|princ�pio da verificabilidade]] e [[WP:CDN|crit�rios de notoriedade]]. P�ginas'
		+ ' pessoais, sites de f�s, blogues e redes sociais (como Facebook, Twitter, etc.) n�o s�o fontes fi�veis.',

	'Esporte/desporto': 'Artigo sem [[WP:FF|fontes fi�veis]] e [[WP:FI|independentes]] que confirmem as afirma��es do texto e atestem'
		+ ' notoriedade. Ver [[WP:V|princ�pio da verificabilidade]] e [[WP:CDN|crit�rios de notoriedade]] (e o'
		+ ' [[Wikip�dia:Crit�rios de notoriedade/Desporto|crit�rio espec�fico para desporto]]. P�ginas pessoais, sites'
		+ ' de f�s, blogues e redes sociais (como Facebook, Twitter, etc.) n�o s�o fontes fi�veis.',

	'Geografia': 'Artigo sem [[WP:FF|fontes fi�veis]] e [[WP:FI|independentes]] que confirmem as afirma��es do texto e atestem'
		+ ' notoriedade. Ver [[WP:V|princ�pio da verificabilidade]] e [[WP:CDN|crit�rios de notoriedade]] (e o'
		+ ' [[Wikip�dia:Crit�rios de notoriedade/Geografia|crit�rio espec�fico para geografia]]). P�ginas'
		+ ' pessoais, f�runs, blogues e redes sociais (como Facebook, Twitter, etc.) n�o s�o fontes fi�veis.',

	'Gin�stica': 'Artigo sem [[WP:FF|fontes fi�veis]] e [[WP:FI|independentes]] que confirmem as afirma��es do texto e atestem'
		+ ' notoriedade. Ver [[WP:V|princ�pio da verificabilidade]] e [[WP:CDN|crit�rios de notoriedade]] (e o'
		+ ' [[Wikip�dia:Crit�rios de notoriedade/Gin�stica|crit�rio espec�fico para gin�stica]]). P�ginas'
		+ ' pessoais, sites de f�s, blogues e redes sociais (como Facebook, Twitter, etc.) n�o s�o fontes fi�veis.',

	'Hist�ria e sociedade': 'Artigo sem [[WP:FF|fontes fi�veis]] e [[WP:FI|independentes]] que confirmem as afirma��es do texto e atestem'
		+ ' notoriedade. Ver [[WP:V|princ�pio da verificabilidade]] e [[WP:CDN|crit�rios de notoriedade]]. P�ginas'
		+ ' pessoais, f�runs, blogues e redes sociais (como Facebook, Twitter, etc.) n�o s�o fontes fi�veis.',

	'Medicina': 'Artigo sem [[WP:FF|fontes fi�veis]] e [[WP:FI|independentes]] que confirmem as afirma��es do texto e atestem'
		+ ' notoriedade. Ver [[WP:V|princ�pio da verificabilidade]] e [[WP:CDN|crit�rios de notoriedade]]. P�ginas'
		+ ' pessoais, f�runs, blogues e redes sociais (como Facebook, Twitter, etc.) n�o s�o fontes fi�veis.',

	'Pa�ses': 'Artigo sem [[WP:FF|fontes fi�veis]] e [[WP:FI|independentes]] que confirmem as afirma��es do texto e atestem'
		+ ' notoriedade. Ver [[WP:V|princ�pio da verificabilidade]] e [[WP:CDN|crit�rios de notoriedade]]. P�ginas'
		+ ' pessoais, f�runs, blogues e redes sociais (como Facebook, Twitter, etc.) n�o s�o fontes fi�veis.',

	'Pessoas': [
		'Biografia sem [[WP:FF|fontes fi�veis]] e [[WP:FI|independentes]] que confirmem as afirma��es do texto e atestem a'
			+ ' notoriedade do biografado. Ver [[WP:V|princ�pio da verificabilidade]] e [[WP:CDN|crit�rios de notoriedade]] (e o'
			+ ' [[Wikip�dia:Crit�rios de notoriedade/Biografias|crit�rio espec�fico para biografias]]). P�ginas '
			+ ' pessoais, sites de f�s, blogues e redes sociais (como Facebook, Twitter, etc.) n�o s�o considerados fontes fi�veis.',
		'ESR-bio'
	],

	'Pol�tica': 'Artigo sem [[WP:FF|fontes fi�veis]] e [[WP:FI|independentes]] que confirmem as afirma��es do texto e atestem '
		+ ' notoriedade. Ver [[WP:V|princ�pio da verificabilidade]] e [[WP:CDN|crit�rios de notoriedade]] (e o'
		+ ' [[Wikip�dia:Crit�rios de notoriedade/Pol�tica|crit�rio espec�fico para pol�tica]]). P�ginas'
		+ ' pessoais, f�runs, blogues e redes sociais (como Facebook, Twitter, etc.) n�o s�o fontes fi�veis.',

	'R�dio e televis�o': 'Artigo sem [[WP:FF|fontes fi�veis]] e [[WP:FI|independentes]] que confirmem as afirma��es do texto e atestem'
		+ ' notoriedade. Ver [[WP:V|princ�pio da verificabilidade]] e [[WP:CDN|crit�rios de notoriedade]] (e o'
		+ ' [[Wikip�dia:Crit�rios de notoriedade/Cinema, r�dio e televis�o|crit�rio espec�fico para r�dio e televis�o]]). P�ginas'
		+ ' pessoais, sites de f�s, blogues e redes sociais (como Facebook, Twitter, etc.) n�o s�o fontes fi�veis.'
};

}( mediaWiki, jQuery, fastButtons, window ) );

// [[Categoria:!C�digo-fonte de scripts|FastButtons/Lista de bot�es]]