/**
 * FastButtons's buttons list
 *
 * @see [[MediaWiki:Gadget-fastbuttons.js]]
 * @see [[MediaWiki:Gadget-fastbuttons.css]]
 * @see [[MediaWiki:Gadget-fastbuttons.js/core.js]]
 * @class fastb.buttons
 */
/* jshint laxbreak:true */
/* global mw, $, fastButtons, window */

( function ( fastb ) {
'use strict';

mw.messages.set( {
	// General
	'fastb-FastButtons': 'FastButtons',
	'fastb-showButton': 'exibir',
	'fastb-hideButton': 'esconder',
	'fastb-hideButton-title': 'Esconde os botões do FastButtons. Para reavê-los na skin vector, basta clicar em "Mais".',
	'fastb-petScan': 'Procurar nesta categoria',
	'fastb-loading': 'Carregando...',
	'fastb-noRecentChange': 'Nenhuma alteração recente.',
	'fastb-noNewPage': 'Nenhuma página nova ainda não patrulhada ou que não seja um redirecionamento dentre as páginas criadas à no máximo, um mês.',
	'fastb-noScoredRecentChanges': 'Nenhuma edição para patrulhar ou desfazer.',
	'fastb-noER': 'Nenhuma página marcada para eliminação rápida.',
	'fastb-yes': 'Sim',
	'fastb-no': 'Não',
	'fastb-hours': '$1h$2min',
	'fastb-date': '$1 de $2 de $3', // $1 = day, $2 = month, $3 = year
	'fastb-none': 'Nenhum',
	'fastb-OK': 'OK',
	'fastb-cancel': 'Cancelar',
	'fastb-alreadyExistsEliminationTag': 'Já existe uma predefinição de eliminação nesta página.',
	'fastb-alreadyExistsThisTag': 'A predefinição "$1" já está incluída nesta página.',
	'fastb-alreadyExistsThisStub': 'Já existe um esboço nesta página.',
	'fastb-warning': 'Aviso',
	'fastb-checkingBacklinksTitle': 'Verificação de afluentes',
	'fastb-checkingBacklinksText': 'Verificando a existência de afluentes. Aguarde...',
	'fastb-checkingBacklinksStop': 'O redirecionamento possui afluentes, deseja realmente propô-lo para eliminação? Recomenda-se a leitura de <a href="https://meta.wikimedia.org/w/index.php?title=Don%27t_delete_redirects/pt&uselang=pt">meta:Don\'t delete redirects/pt</a>.',
	'fastb-insufficiencyTemplateNotFound': 'Não foi encontrada a predefinição "$1" na página, requisito para a utilização desta.',

	// Notify
	'fastb-notify-editSuccess': 'A página foi editada com sucesso.',
	'fastb-notify-moveSuccess': 'A página foi movida com sucesso.',
	'fastb-notify-sendWarning': 'Enviando a notificação para o criador...',
	'fastb-notify-editingPage': 'Editando a página...',
	'fastb-notify-patrollingPage': 'Patrulhando a página...',
	'fastb-notify-getPageContent': 'Obtendo o conteúdo da página...',
	'fastb-notify-creatingEliminationPage': 'Criando a página de eliminação...',
	'fastb-notify-editingSomePage': 'Editando a página "$1"...',
	'fastb-notify-archivingPE': 'Arquivando o pedido de eliminação anterior...',
	'fastb-notify-errorSufix': '<br />Se o problema persistir,'
		+ ' favor informar no <a href="' + mw.util.getUrl( 'WP:Café dos Programadores' ) + '">Café dos programadores</a>'
		+ ' ou em <a href="' + mw.util.getUrl( 'MediaWiki Discussão:Gadget-fastbuttons.js' ) + '">MediaWiki Discussão:Gadget-fastbuttons.js</a>.',
	'fastb-notify-apiErrorEdit': 'Não foi possível realizar a edição.<br />A API retornou o código de erro "$1": $2',
	'fastb-notify-editFail': 'Não foi possível realizar a edição devido a um erro desconhecido da API.',

	// Dialog
	'fastb-dialog-note': 'Se necessário, coloque uma observação.',
	'fastb-dialog-labelDefault': 'Observação',
	'fastb-dialog-placeholderDefault': 'Não é necessário assinar.',
	'fastb-dialog-pageSituation': 'Escreva um breve resumo das condições atuais da página',

	// Dialog [ESR prompt]
	'fastb-dialog-ESR-title-1': 'Qual a justificativa para a eliminação do arquivo?',
	'fastb-dialog-ESR-title-2': 'Eliminação semirrápida',
	'fastb-dialog-ESR-reason': 'Justificativa',
	'fastb-dialog-ESR-subject': 'Assunto',
	'fastb-dialog-ESR-other': 'Outro',
	'fastb-dialog-ESR-badTranslation': 'Má tradução',
	'fastb-dialog-ESR-VDA': 'Suspeita de violação dos direitos',
	'fastb-dialog-ESR-language': 'Idioma (somente a sigla)',
	'fastb-dialog-ESR-addComent': 'Comentário adicional',
	'fastb-dialog-ESR-sendWarning': 'Enviar um aviso para o criador da página',

	// Dialog [PE prompt]
	'fastb-dialog-PE-title': 'Página para eliminar',
	'fastb-dialog-PE-sendWarning': 'Enviar um aviso para o criador da página',
	'fastb-dialog-PE-type-1': 'Enviar um aviso de eliminação',
	'fastb-dialog-PE-type-2': 'Enviar um aviso de remoção de marcações de eliminação nas páginas',
	'fastb-dialog-PE-create': 'Criar a discussão para a eliminação da página',
	'fastb-dialog-PE-reason': 'Justificativa para eliminação. Não precisa assinar.',

	// Dialog [Requests prompt]
	'fastb-dialog-requests-argumentation': 'Argumentação',
	'fastb-dialog-requests-page': 'Página',
	'fastb-dialog-requests-user': 'Usuário',
	'fastb-dialog-requests-subject': 'Assunto',
	'fastb-dialog-requests-historyPageExtra': 'Página 2',
	'fastb-dialog-requests-dontSign': 'Não precisa assinar.',

	// Dialog [Merging prompt]
	'fastb-dialog-merging-title': 'Fusão',
	'fastb-dialog-merging-page1': 'Página que permanecerá',
	'fastb-dialog-merging-page2': 'Página que será fundida com a de cima',

	// Page
	'fastb-page-ref': '$1 está referenciada',
	'fastb-page-cat': '$1 está categorizada',
	'fastb-page-iw': '$1 possui interwikis',
	'fastb-page-it': 'A página',
	'fastb-page-backlinks': 'Afluentes da página',
	'fastb-page-noBacklinks': 'Esta página ainda não possui afluentes',
	'fastb-page-quality': 'Qualidade',
	'fastb-page-qualityUnknown': 'desconhecida',
	'fastb-page-deletedEdit': 'edição eliminada',
	'fastb-page-deletedEdits': 'edições eliminadas',
	'fastb-page-size': 'Tamanho',
	'fastb-page-watchers': 'Vigilantes',
	'fastb-page-lastEdit': 'Última edição',
	'fastb-page-requestDeletion': 'Pedido de eliminação',
	'fastb-page-requestDeletionLink': 'Pedido de eliminação desta página',
	'fastb-page-neverProposedElimination': 'A página nunca foi proposta para eliminação',
	'fastb-page-notExist': 'A página não existe.',
	'fastb-page-pageDeleteDate': 'A página foi deletada às <b>$1</b>',
	'fastb-page-pageviews': 'Visualizações da página',
	'fastb-page-moreInfo': 'Mais informações',
	'fastb-page-log': 'Registros da página',
	'fastb-page-noEditPermission': 'Você não possui permissão para editar esta página.',

	// Page [move]
	'fastb-page-move-noPermissions': 'Você não possui permissão para mover esta página.',
	'fastb-page-move-moving': 'Movendo a página',
	'fastb-page-move-redirect': 'Criar um redirecionamento',
	'fastb-page-move-talk': 'Mover a página de discussão também, se aplicável',
	'fastb-page-move-reason': 'Motivo',
	'fastb-page-move-newTitle': 'Novo título',
	'fastb-page-move-buttonName': 'Mover a página',
	'fastb-page-move-buttonTitle': 'Move a página para o título informado',
	'fastb-page-move-mainDomain': '(Principal)',

	// User
	'fastb-user-anonFirstEdit': 'Primeira edição',
	'fastb-user-registryDate': 'Data de registro',
	'fastb-user-userFirstEdit': 'A data em questão se refere à primeira edição do usuário, pois por se tratar de uma conta muito antiga não foi possível obter a data de registro original.',
	'fastb-user-unkownRegisterDate': 'Não foi possível encontrar a data de registro do editor.',
	'fastb-user-undefined': 'indefinido',
	'fastb-user-priorTo': 'antes de',
	'fastb-user-groups': 'Grupos',
	'fastb-user-edits': 'Edições',
	'fastb-user-blocked': 'Editor <b>bloqueado</b>',
	'fastb-user-error': 'Ocorreu um erro ao tentar obter as informações do usuário',
	'fastb-user-notExist': 'O usuário <b>não existe</b>',
	'fastb-user-anonNoEdit': 'Ainda não foi realizada nenhuma edição com este endereço de IP',
	'fastb-user-anonLargeEdits': 'mais de $1',

	// Errors
	'fastb-error-unableGetList': 'não foi possível obter a lista "$1" através da API.',
	'fastb-error-backlinksNoData': 'a consulta dos afluentes da página não retornou nenhum dado.',
	'fastb-error-categoryIncompleteData': 'a consulta para se obter a qualidade da página através das categorias retornou dados incompletos.',
	'fastb-error-categoryNoData': 'a consulta para se obter a qualidade da página através das categorias não retornou nenhum dado.',
	'fastb-error-userInfoNoData': 'a consulta com as informações do usuário não retornou nenhum dado.',

	// Summary
	'fastb-summary-requestElimination': 'Página proposta para [[WP:ER|eliminação rápida]] (regra $1)',
	'fastb-summary-redirect': 'Feito redirecionamento para [[$1]]$2',
	'fastb-summary-addMessage': 'Adicionando mensagem com a predefinição "[[Predefinição:$1|$1]]"',
	'fastb-summary-stub': 'Página marcada como [[WP:EBC|esboço]]',
	'fastb-summary-addTag': 'Adicionando marcação',
	'fastb-summary-ESR': 'Página proposta para [[WP:ESR|eliminação semirrápida]]',
	'fastb-summary-creatingEliminationPage': 'Criando página de eliminação',
	'fastb-summary-elimination': 'Página proposta para [[WP:Eliminação por consenso|eliminação por consenso]]',
	'fastb-summary-maintenance': 'Adicionando a página "$1"',
	'fastb-summary-archivingPE': 'Arquivando pedido de eliminação',
	'fastb-summary-newRequest': 'Adicionando novo pedido',
	'fastb-summary-addMergingPropose': 'Adicionando proposta de fusão',

	// Warn [elimination]
	'fastb-warn-elimination-summary-pageElimination': 'Aviso sobre a eliminação da página "[[$1]]"',
	'fastb-warn-elimination-summary-removeEliminationTag': 'Aviso sobre a remoção da marcação de eliminação da página',
	'fastb-warn-elimination-prompt-title': 'Enviar notificação',
	'fastb-warn-elimination-prompt-select-user': 'Para enviar um aviso de eliminação ao editor <a href="/wiki/User:$1">$1</a>, selecione uma opção abaixo',
	'fastb-warn-elimination-prompt-select-anon': 'Para enviar um aviso de eliminação ao usuário anônimo <a href="/wiki/Special:Contributions/$1">$1</a>, selecione uma opção abaixo',
	'fastb-warn-elimination-prompt-option-1': 'Enviar um aviso de eliminação',
	'fastb-warn-elimination-prompt-option-2': 'Enviar um aviso sobre a remoção da marcação de eliminação da página',
	'fastb-warn-elimination-prompt-option-3': 'Não enviar nenhum aviso',

	// Warn [maintenanceTags]
	'fastb-warn-maintenanceTags-summary': 'Aviso sobre a marcação da página "[[$1]]" com a predefinição "[[Predefinição:$2|$2]]"',
	'fastb-warn-maintenanceTags-prompt-title': 'Enviar notificação sobre a marcação de "$1"',
	'fastb-warn-maintenanceTags-prompt-content': 'Deseja notificar o editor <a href="/wiki/User:$1">$1</a>?'
} );

var nsNum = mw.config.get( 'wgNamespaceNumber' ),
	userName =  ( mw.config.get( 'wgCanonicalSpecialPageName' ) !== 'Contributions' )
		? mw.config.get( 'wgTitle' ).split( '/' )[ 0 ]
		: window.decodeURI( mw.util.getUrl().split( '/' )[ 3 ] || mw.util.getParamValue( 'target' ) );

// Shows a warning if the redirect has backlinks
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
	 * Submenu [Eliminação]
	 * @property {Object[]} elimination
	 */
	elimination: [ {
			action: function () {
				fastb.changeSubmenu( fastb.buttons.ER );
			},
			text: 'Rápida',
			title: 'Exibir regras para a eliminação rápida'
		}, {
			action: fastb.openPrompt.bind( fastb, 'ESR' ),
			text: 'Semirrápida',
			title: 'Exibe um prompt para propor a eliminação semirrápida da página',
			disable: $.inArray( nsNum, [ 0, 6 ] ) === -1
		}, {
			action: fastb.openPrompt.bind( fastb, 'PE' ),
			text: 'Consenso',
			title: 'Marcar para eliminação por consenso',
			disable: $.inArray( nsNum, [ 8, 828 ] ) !== -1
		}, {
			action: function() {
				fastb.changeSubmenu( fastb.buttons.insufficiency );
			},
			text: 'Insuficiência',
			title: 'Exibir botões para candidatos a artigos',
			disable: nsNum !== 0
		}
	],

	insufficiency: [ {
			action: 'Insuficiente',
			templatename: 'Insuficiente',
			text: 'Candidato a artigo',
			title: 'Marcar como candidato a artigo',
			sum: 'Página marcada para [[WP:CAA|candidato a artigo]]',
			prompt: 'Justifique o porquê desta página<br />obedecer às regras de <code>[[<a href="https://pt.wikipedia.org/wiki/Wikip%C3%A9dia:Candidatos_a_artigo">WP:CA</a>]]</code>.',
			label: 'Justificativa[required]',
			disable: nsNum !== 0
		}
	],

	/**
	 * Submenu [ER]
	 * @property {Object[]} ER
	 */
	ER: [ {
			action: 'ER|A2',
			text: 'A2',
			title: 'Sem contexto',
			disable: nsNum !== 0
		}, {
			action: 'ER|A3',
			text: 'A3',
			title: 'Sem conteúdo',
			disable: nsNum !== 0
		}, {
			action: 'ER|A4',
			text: 'A4',
			title: 'Sem indicação de importância'
				+ ' (pessoas, animais, organizações, conteúdo web, eventos)',
			disable: nsNum !== 0
		}, {
			action: 'ER|A5',
			text: 'A5',
			title: 'Sem indicação de importância'
				+ ' (gravações musicais e livros)',
			disable: nsNum !== 0
		}, {
			action: 'ER|A6',
			text: 'A6',
			title: 'Artigo criado recentemente que duplica um tópico existente',
			disable: nsNum !== 0
		}, {
			action: 'ER|C1',
			text: 'C1',
			title: 'Categoria vazia, desnecessária ou substituída',
			disable: nsNum !== 14
		}, {
			action: 'ER|D1',
			text: 'D1',
			title: 'Discussão de página inexistente',
			disable: nsNum % 2 === 0
		}, {
			action: 'ER|D2',
			text: 'D2',
			title: 'Discussão de página para eliminação ou com histórico irrelevante',
			disable: nsNum % 2 === 0
		}, {
			action: 'ER|U1',
			text: 'U1',
			title: 'Uso impróprio da página de usuário',
			disable: $.inArray( nsNum, [ 2, 3 ] ) === -1
		}, {
			action: 'ER|U2',
			text: 'U2',
			title: 'Página de usuário criada por outro usuário',
			disable: nsNum !== 2
		}, {
			action: 'ER|P1',
			text: 'P1',
			title: 'Predefinição vazia, desnecessária ou substituída',
			disable: nsNum !== 10
		}, {
			action: 'ER|P2',
			text: 'P2',
			title: 'Predefinição que é uma deturpação das regras',
			disable: nsNum !== 10
		}, {
			action: 'ER|F1',
			text: 'F1',
			title: 'Ficheiros duplicados ou que não cumprem a política de Conteúdo restrito',
			disable: nsNum !== 6
		}, {
			preload: redirectEliminationPrevent,
			action: 'ER|R1',
			text: 'R1',
			title: 'Redirecionamento indevido, desnecessário, sem afluentes, para páginas inexistente ou eliminadas',
			disable: !mw.config.get( 'wgIsRedirect' )
		}, {
			preload: redirectEliminationPrevent,
			action: 'ER|R2',
			text: 'R2',
			title: 'Eliminar redirect, página sem histórico relevante (mover página redirecionada para cá)',
			disable: !mw.config.get( 'wgIsRedirect' )
		}, {
			action: 'ER|G1',
			text: 'G1',
			title: 'Eliminação técnica'
		}, {
			action: 'ER|G2',
			text: 'G2',
			title: 'Impróprio'
		}, {
			action: 'ER|G3',
			text: 'G3',
			title: 'Página sem histórico relevante que é violação flagrante de direitos autorais de outras páginas na internet',
			disable: nsNum !== 0
		}, {
			action: 'ER|G4',
			text: 'G4',
			title: 'Páginas criadas por editores bloqueados ou banidos',
			disable: nsNum !== 0
		}, {
			action: 'ER|G5',
			text: 'G5',
			title: 'Aparecimento recorrente (se o conteúdo for igual ao eliminado por consenso)'
		}, {
			action: 'ER|G6',
			text: 'G6',
			title: 'Título é SPAM',
			disable: nsNum !== 0
		}, {
			action: 'ER|G7',
			text: 'G7',
			title: 'Eliminação a pedido do autor'
		}
	],

	/**
	 * Submenu [Manuteção]
	 * @property {Object[]} maintenance
	 */
	maintenance: [ {
			action: 'subst:s-fontes',
			templatename: 'Sem-fontes',
			text: 'Sem fontes',
			title: 'Página não cita nenhuma fonte ou referência',
			sum: 'Página marcada como sem fontes',
			warn: true
		}, {
			action: 'subst:s-fontes-bpv',
			templatename: 'Sem-fontes-bpv',
			text: 'Sem fontes BPV',
			title: 'Biografia de pessoa viva que não cita nenhuma fonte',
			sum: 'Página marcada como [[WP:BPV|biografia de pessoa viva]] sem fontes',
			warn: true
		}, {
			action: 'subst:s-notas',
			templatename: 'Sem notas',
			text: 'Sem notas',
			title: 'Existem fontes no final da página, mas não são citadas no corpo do artigo',
			sum: 'Página marcada como sem notas'
		}, {
			action: 'subst:m-fontes',
			templatename: 'Mais fontes',
			text: 'Mais fontes',
			title: 'Página cita fontes confiáveis, mas não cobre todo o texto',
			sum: 'Página marcada que carece de mais fontes'
		}, {
			action: 'subst:m-fontes-bpv',
			templatename: 'Mais fontes-bpv',
			text: 'Mais fontes BPV',
			title: 'Biografia de pessoa viva que cita fontes, porém que não cobrem todo o texto',
			sum: 'Página marcada como [[WP:BPV|biografia de pessoa viva]] que carece de mais fontes'
		}, {
			action: 'subst:fpr',
			templatename: 'Fontes primárias',
			text: 'Fonte primária',
			title: 'Artigo necessita de fontes secundárias fiáveis publicadas por terceiros',
			sum: 'Página marcada como sem fontes secundárias fiáveis'
		}, {
			action: 'Uma-fonte',
			templatename: 'Uma-fonte',
			text: 'Uma fonte',
			title: 'Página se baseia numa única fonte',
			sum: 'Página marcada como tendo apenas uma fonte'
		}, {
			action: 'subst:f-referências',
			templatename: 'Formatar referências',
			text: 'Formatar referências',
			title: 'Artigo contém referências que necessitam de formatação',
			sum: 'Página marcada que existem referências sem formatação'
		}, {
			action: 'subst:wkf',
			templatename: 'Wikificação',
			text: 'Wikificar',
			title: 'Não está formatado de acordo com o livro de estilo',
			sum: 'Página marcada para [[WP:WKF|wikificação]]'
		}, {
			action: 'subst:rec',
			templatename: 'Reciclagem',
			text: 'Reciclagem',
			title: 'Página precisa ser reciclada de acordo com o livro de estilo',
			sum: 'Página marcada para [[WP:RECI|reciclagem]]'
		}, {
			action: 'subst:s-cat',
			templatename: 'Sem cat',
			text: 'Sem categoria',
			title: 'Página não está em nenhuma categoria',
			sum: 'Página marcada como sem categoria',
			warn: true
		}, {
			action: 'Sem infocaixa',
			templatename: 'Sem infocaixa',
			text: 'Sem infocaixa',
			title: 'Página não possui nenhuma infocaixa',
			prompt: 'Existe alguma sugestão de infocaixa a ser usada?<br />Obs: não colocar <b>Predefinição:Info/NOME</b>, e sim somente <b>NOME</b>.',
			label: 'Sugestão',
			sum: 'Página marcada como sem infocaixa'
		}, {
			action: 'Sem sinopse',
			templatename: 'Sem sinopse',
			text: 'Sem sinopse',
			title: 'Página não possui nenhuma sinopse',
			sum: 'Página marcada como sem sinopse'
		}, {
			action: 'Parcial',
			templatename: 'Parcial',
			text: 'Parcial',
			title: 'Artigo possui passagens que não respeitam o princípio da imparcialidade',
			sum: 'Página marcada como parcial'
		}, {
			action: 'subst:pub',
			templatename: 'Publicidade',
			text: 'Publicidade',
			title: 'A conteúdo da página está possivelmente apresentado em formato publicitário',
			sum: 'Página marcada que possui conteúdo em formato publicitário'
		}, {
			action: 'subst:ctx',
			templatename: 'Contextualizar',
			text: 'Contexto',
			title: 'Página carece de contexto',
			sum: 'Página marcada como sem contexto'
		}, {
			action: 'subst:não-enc',
			templatename: 'Não enciclopédico',
			text: 'Não enciclopédico',
			title: 'A conteúdo da página é possivelmente apresentado de uma maneira não-enciclopédica',
			sum: 'Página marcada que possui conteúdo não-enciclopédico'
		}, {
			action: 'Global',
			templatename: 'Global',
			text: 'Global',
			title: 'A conteúdo da página está redigido sob uma perspectiva majoritariamente brasileira, portuguesa ou lusófona',
			sum: 'Página marcada que possui um conteúdo redigido numa perspectiva regionalizada',
			prompt: 'Qual o tipo da perspectiva?',
			label: 'Digite o número correspondente:<br />1 = Lusofonia<br />2 = Brasil<br />3 = Portugal<br />Ou deixe em branco para utilizar a predefinição genérica[optional]'
		}, {
			action: 'subst:m-tradução',
			templatename: 'Má tradução',
			text: 'Má tradução',
			title: 'A conteúdo da página está possivelmente mal traduzido',
			sum: 'Página marcada como má tradução'
		}, {
			action: 'Corrigir',
			templatename: 'publicidade',
			text: 'Corrigir',
			title: 'A conteúdo da página possivelmente precisa de correção ortográfico-gramatical',
			sum: 'Página marcada como carece de correção'
		}, {
			action: 'Revisão',
			templatename: 'Revisão',
			text: 'Revisão',
			title: 'A conteúdo da página está possivelmente inconsistente',
			sum: 'Página marcada para revisão'
		}, {
			action: 'subst:Intro',
			templatename: 'Má introdução',
			text: 'Má introdução',
			title: 'A página não possui uma seção introdutória ou está malformatada',
			sum: 'Página marcada como má introdução'
		}, {
			action: 'subst:sin',
			templatename: 'Sinopse',
			text: 'Sinopse',
			title: 'A sinopse do artigo é extensa demais ou muito detalhada',
			sum: 'Página marcada como sinopse extensa'
		}, {
			action: 'Em manutenção',
			templatename: 'Em manutenção',
			text: 'Em manutenção',
			title: 'Marcar a página para uma manutenção emergencial, afim de evitar uma eliminação',
			sum: 'Página marcada para manutenção emergencial'
		}, {
			action: 'Em construção',
			templatename: 'Em construção',
			text: 'Em construção',
			title: 'Marcar a página como em processo de construção',
			sum: 'Página marcada como em contrução'
		}, {
			action: 'subst:e-tradução',
			templatename: 'Em tradução',
			text: 'Em tradução',
			title: 'Marcar a página como em processo de tradução',
			sum: 'Página marcada como em tradução'
		}, {
			action: 'Desatualizado',
			templatename: 'Desatualizado',
			text: 'Desatualizado',
			title: 'A página contém um conteúdo que pode estar desatualizado',
			sum: 'Página marcada como desatualizada'
		}, {
			action: 'subst:ev-atual',
			templatename: 'Evento atual',
			text: 'Evento atual',
			title: 'Artigo sobre um evento atual',
			sum: 'Página marcada como evento atual',
			prompt: 'Especifique o evento, preferencialmente (<a href="https://pt.wikipedia.org/wiki/Predefini%C3%A7%C3%A3o:Evento_atual#Uso">temas possíveis<a>).',
			label: 'Tema do evento'
		}, {
			action: fastb.openPrompt.bind( fastb, 'merging' ),
			text: 'Fusão',
			title: 'Página necessita de fusão',
		}, {
			action: 'Renomear página',
			templatename: 'Renomear página',
			text: 'Renomear página',
			title: 'Proposição para renomear o nome da página',
			prompt: 'Indique o novo nome sugerido e o motivo.',
			label: 'Novo nome|2=Motivo',
			sum: 'Página marcada para renomeação'
		},
	],

	/**
	 * Submenu [Aviso]
	 * @property {Object[]} warn
	 */
	warn: [  {
			action: 'subst:bem-vindo(a)',
			text: 'BV',
			title: 'Bem-vindo(a) à Wikipédia',
			disable: mw.util.isIPAddress( userName )
		}, {
			action: 'subst:bv-av-registrado',
			text: 'Av-BV',
			title: 'Aviso sobre erro em artigo e boas-vindas para usuário(a) registrado',
			prompt: 'Aviso sobre qual artigo?',
			label: 'Artigo',
			disable: mw.util.isIPAddress( userName )
		}, {
			action: 'subst:bem-vindo IP',
			text: 'BV-IP',
			title: 'Boas-vindas para usuário(a) não registrado(a)',
			disable: !mw.util.isIPAddress( userName )
		}, {
			action: 'subst:bv-av',
			text: 'Av-BV-IP',
			title: 'Aviso sobre erro em artigo e boas-vindas para usuário(a) não registrado(a)',
			prompt: 'Aviso sobre qual artigo?',
			label: 'Artigo',
			disable: !mw.util.isIPAddress( userName )
		}, {
			action: 'Vandalismo repetido',
			text: 'Vandalismo repetido',
			title: 'Adiciona uma marca informando que o IP em questão tem sido constantemente bloqueado.',
			disable: !mw.util.isIPAddress( userName )
		}, {
			action: 'subst:nome impróprio',
			text: 'Nome impróprio',
			title: 'Aviso sobre o nome impróprio do usuário'
		}, {
			action: 'subst:aviso-ER',
			text: 'Av-ER',
			title: 'Aviso sobre eliminação rápida',
			prompt: 'Qual página foi proposta para eliminação?',
			label: 'Página|2=Regra de eliminação'
		}, {
			action: 'subst:av-bv-ER',
			text: 'Av-BV-ER',
			title: 'Aviso sobre eliminação rápida + boas-vindas',
			prompt: 'Qual página foi proposta para eliminação?',
			label: 'Página|2=Regra de eliminação'
		}, {
			action: 'subst:aviso-ESR',
			text: 'Av-ESR',
			title: 'Aviso sobre eliminação semirrápida',
			prompt: 'Qual página foi proposta para eliminação?',
			label: 'Página'
		}, {
			action: 'subst:aviso-PE',
			text: 'Av-PE',
			title: 'Aviso sobre eliminação por consenso',
			prompt: 'Qual página foi proposta para eliminação?',
			label: 'Página'
		}, {
			action: 'subst:av-página de usuário',
			text: 'Av-PU',
			title: 'Considere refazer a página de usuário(a)'
		}, {
			action: 'subst:bv-propaganda',
			text: 'Propaganda + BV',
			title: 'Caro editor,por favor não faça propaganda, [...] Apesar disso, bem-vindo à Wikipédia'
		}, {
			action: 'subst:aviso',
			text: 'Av-erro em página',
			title: 'Aviso sobre erro em artigo',
			prompt: 'Aviso sobre qual artigo?',
			label: 'Artigo'
		}, {
			action: 'subst:aviso2',
			text: 'Av2',
			title: 'Segundo aviso sobre erro em artigo',
			prompt: 'Segundo aviso sobre qual artigo?',
			label: 'Página'
		}, {
			action: 'subst:aviso3',
			text: 'Av3',
			title: 'Terceiro aviso sobre erro em artigo',
			prompt: 'Terceiro aviso sobre qual artigo?',
			label: 'Página'
		}, {
			action: 'subst:aviso-vandalismo',
			text: 'Av-vandalismo',
			title: 'Não vandalize os artigos',
			prompt: 'Qual o nível do aviso (1 para primeiro, 2 para segundo, 3 para terceiro ou b para notificação de bloqueio)? E que página foi vandalizada?',
			label: 'Nível|2=Página'
		}, {
			action: 'subst:av-Bpv',
			text: 'Av-BPV',
			title: 'Não adicione conteúdo difamatório nos artigos sobre biografias de pessoas vivas',
			prompt: 'Qual o nível do aviso (1 para primeiro, 2 para segundo, 3 para terceiro ou b para notificação de bloqueio)? E em que página foi adicionado conteúdo difamatório?',
			label: 'Nível|2=Página'
		}, {
			action: 'subst:aviso-moção',
			text: 'Aviso-moção',
			title: 'Não mova páginas indevidamente',
			prompt: 'Qual o nível do aviso (1 para primeiro, 2 para segundo, 3 para terceiro ou b para notificação de bloqueio)? E qual página foi movida indevidamente?',
			label: 'Nível|2=Página'
		}, {
			action: 'subst:av-Remoção',
			text: 'Av-remoção',
			title: 'Não remova conteúdo dos artigos',
			prompt: 'Qual o nível do aviso (1 para primeiro, 2 para segundo, 3 para terceiro ou b para notificação de bloqueio)? E de qual página foi removido conteúdo?',
			label: 'Nível|2=Página'
		}, {
			action: 'subst:av-Spam',
			text: 'Av-spam',
			title: 'Não insira ligações externas inadequadas nos artigos',
			prompt: 'Qual o nível do aviso (1 para primeiro, 2 para segundo, 3 para terceiro ou b para notificação de bloqueio)? E em que página foram inseridas ligações externas inadequadas?',
			label: 'Nível|2=Página'
		}, {
			action: 'subst:av-teste',
			text: 'Av-teste',
			title: 'Não faça testes nos artigos',
			prompt: 'Qual o nível do aviso (1 para primeiro, 2 para segundo, 3 para terceiro ou b para notificação de bloqueio)? E em que página foram feitos testes?',
			label: 'Nível|2=Página'
		}, {
			action: 'subst:av-data',
			text: 'Av-data',
			title: 'Não insira seu nome e data de nascimento em páginas de datas',
			prompt: 'Em que página de data foram inseridos o nome e a data de nascimento?',
			label: 'Página'
		}, {
			action: 'subst:av-interwiki',
			text: 'Av-interwikis',
			title: 'Faltou adicionar os interwikis à página',
			prompt: 'Qual foi a página?',
			label: 'Página'
		}, {
			action: 'subst:av-categoria',
			text: 'Av-Categoria',
			title: 'Faltou adicionar categorias à página',
			prompt: 'Qual foi a página?',
			label: 'Página'
		}, {
			action: 'subst:assine',
			text: 'Assine',
			title: 'Faltou assinar o comentário',
			prompt: 'Qual foi o local?',
			label: 'Local'
		}, {
			action: 'subst:morder',
			text: 'Morder',
			title: 'Aviso sobre ser agressivo com os novatos',
			prompt: 'Qual usuário foi mordido? Pode deixar uma observação também',
			label: 'Usuário|2=Observação[optional]'
		}, {
			action: 'subst:propaganda',
			text: 'Propaganda',
			title: 'Caro editor, por favor não faça propaganda...',
			prompt: 'Em que página foi feita propaganda?',
			label: 'Página'
		}, {
			action: 'subst:BSRE',
			text: 'BSRE',
			title: 'Aviso de biografia sem relevo enciclopédico',
			prompt: 'Qual artigo?',
			label: 'Artigo'
		}, {
			action: 'subst:cópia',
			text: 'Cópia',
			title: 'Aviso sobre artigo copiado de fonte externa/VDA',
			prompt: 'Qual a página da Wikipédia? E qual a URL da página copiada?',
			label: 'Página|2=URL'
		}, {
			action: 'subst:linguagem incorreta',
			text: 'Linguagem',
			title: 'Não insulte nem use linguagem inadequada em artigos ou discussões'
		}, {
			action: 'subst:ortografia',
			text: 'Ortografia',
			title: 'Não mude a versão da língua',
			prompt: 'Em qual artigo a versão da língua foi alterada?',
			label: 'Artigo'
		}, {
			action: 'subst:mostrar previsão',
			text: 'Salvamento sucessivo',
			title: 'Não faça salvamentos sucessivos, utilize o botão \'Mostrar previsão\'',
			prompt: 'Em que artigo foram feitos salvamentos sucessivos?',
			label: 'Página'
		}, {
			action: 'subst:não remova',
			text: 'Não remova',
			title: 'Não remova marcações de eliminação das páginas',
			prompt: 'Qual página em que a marcação de eliminação foi removida? Se desejar, pode especificar o tipo de marcação (er para eliminação rápida, esr para eliminação rápida ou ec para eliminação por consenso).',
			label: 'Página|2=Tipo de marcação[optional]',
			sum: 'Aviso sobre remoção de marcações de eliminação das páginas'
		}, {
			action: 'subst:autobiografia',
			text: 'Autobiografia',
			title: 'Não crie autobiografias',
			prompt: 'Qual autobiografia foi criada?',
			label: 'Página'
		}, {
			action: 'subst:cite fonte',
			text: 'Citar fontes',
			title: 'Faltou citar fontes à página',
			prompt: 'Qual foi a página?',
			label: 'Página'
		}, {
			action: 'subst:Av-npi',
			text: 'Pesquisa inédita',
			title: 'Material não verificável por fontes.',
			prompt: 'Qual foi a página?',
			label: 'Página'
		}, {
			action: 'subst:aviso-GE',
			text: 'Aviso-GE',
			title: 'A página foi protegida devido à guerra de edições',
			prompt: 'Qual página foi protegida?',
			label: 'Página'
		}, {
			action: 'subst:bloqueado',
			text: 'Bloqueado',
			title: 'Notificação de bloqueio quando o usuário NÃO está autorizado a usar a sua discussão',
			prompt: 'Especifique o tempo e o motivo do bloqueio.',
			label: 'Tempo|2=Motivo'
		}, {
			action: 'subst:bloqueado-disc',
			text: 'Bloqueado-disc',
			title: 'Notificação de bloqueio com discussão quando o usuário está autorizado a usar a sua discussão',
			prompt: 'Especifique o tempo e o motivo do bloqueio.',
			label: 'Tempo|2=Motivo'
		}, {
			action: 'subst:bloqueado-CPV',
			text: 'Bloqueado-CPV',
			title: 'Notificação de bloqueio para contas para vandalismo'
		}, {
			action: 'subst:proxy',
			text: 'Proxy',
			title: 'Notificação de proxy bloqueado'
		}
	],

	/**
	 * Submenu [Busca]
	 * @property {Object[]} search
	 */
	search: [ {
			text: 'Google',
			desc: 'Pesquisar o título desta página no Google',
			url: '//www.google.com/search?&as_eq=wikipedia&as_epq='
		}, {
			text: 'Google notícias',
			desc: 'Pesquisar o título desta página no Google Notícias',
			url: '//google.com/search?tbm=nws&q='
		}, {
			text: 'Google livros',
			desc: 'Pesquisar o título desta página no Google Livros',
			url: '//books.google.com/books?&as_brr=0&as_epq='
		}, {
			text: 'Google acadêmico',
			desc: 'Pesquisar o título desta página no Google Acadêmico',
			url: '//scholar.google.com/scholar?q='
		}, {
			text: 'Google Brasil',
			desc: 'Pesquisar o título desta página no Google Brasil',
			url: '//www.google.com/search?cr=countryBR&q='
		}, {
			text: 'Google Portugal',
			desc: 'Pesquisar o título desta página no Google Portugal',
			url: '//www.google.com/search?cr=countryPT&q='
		}, {
			text: 'Bing',
			desc: 'Pesquisar o título desta página no Bing',
			url: '//www.bing.com/search?q='
		}
	],

	/**
	 * Submenu [PetScan]
	 * @property {Object[]} cat
	 */
	cat: [ {
			text: 'Sem fontes',
			desc: 'Procurar páginas desta categoria que precisam de fontes',
			url: '&templates_yes=Sem-fontes'
		}, {
			text: 'Revisão',
			desc: 'Procurar páginas desta categoria que precisam de revisão',
			url: '&templates_yes=Revis%C3%A3o'
		}, {
			text: 'Wikificação',
			desc: 'Procurar páginas desta categoria que precisam de wikificação',
			url: '&templates_yes=Wikifica%C3%A7%C3%A3o'
		}, {
			text: 'Menos de 1 000 bytes ou 4 links',
			desc: 'Procurar páginas desta categoria que possuem menos de 1 000 bytes ou 4 links',
			url: '&smaller=1000&minlinks=4'
		}, {
			text: 'Menos de 500 bytes ou 2 links',
			desc: 'Procurar páginas desta categoria que possuem menos de 500 bytes ou 2 links',
			url: '&smaller=500&minlinks=2'
		}
	],

	/**
	 * Submenu [Pedidos]
	 * @property {Object[]} requests
	 */
	requests: [ {
			action: 'request',
			text: 'Vandalismo',
			title: 'Notificar a ação de um vândalo.',
			placeholder: 'Especifique o nome de usuário/IP do vândalo e dê mais detalhes sobre o vandalismo.',
			page: 'Wikipédia:Pedidos/Notificações de vandalismo'
		}, {
			action: 'request',
			text: 'Desproteção',
			title: 'Requisitar a desproteção de uma página.',
			placeholder: 'Justifique o pedido de desproteção.',
			page: 'Wikipédia:Pedidos/Desproteção'
		}, {
			action: 'request',
			text: 'Edição',
			title: 'Requisitar uma alteração de uma página, pois devido ao fato de estar protegida, não pode ser feita por você.',
			placeholder: 'Especifique a alteração que deseja fazer e o motivo.',
			page: 'Wikipédia:Pedidos/Páginas protegidas'
		}, {
			action: 'request',
			text: 'Histórico',
			title: 'Requisitar a fusão do histórico de uma página com outra.',
			placeholder: 'Justifique o motivo para o pedido de fusão de históricos.',
			page: 'Wikipédia:Pedidos/Histórico'
		}, {
			action: 'request',
			text: 'Proteção',
			title: 'Requisitar a proteção de uma página.',
			placeholder: 'Justifique o motivo para o pedido de proteção.',
			page: 'Wikipédia:Pedidos/Proteção'
		}, {
			action: 'request',
			text: 'Restauro',
			title: 'Requisitar o restauro de uma página',
			placeholder: 'Justifique o motivo para o pedido de restauro.',
			page: 'Wikipédia:Pedidos/Restauro'
		}, {
			action: 'request',
			text: 'Ocultação',
			title: 'Requisitar a ocultação de uma ou mais edições de uma página.',
			placeholder: 'Especifique quais edições devem ser ocultadas e o motivo.',
			page: 'Wikipédia:Pedidos/Ocultação'
		}, {
			action: 'request',
			text: 'Nome impróprio',
			title: 'Notificar sobre um usuário com nome impróprio.',
			placeholder: 'Caso queira, dê mais detalhes.',
			page: 'Wikipédia:Pedidos/Revisão de nomes de usuário'
		}, {
			action: 'request',
			text: 'Incidente',
			title: 'Notificar sobre a existência de incidentes urgentes relacionados à conduta de usuários.',
			placeholder: 'Esclareça o pedido.',
			page: 'Wikipédia:Pedidos/Notificação de incidentes',
		}, {
			action: 'request',
			text: 'Outro',
			title: 'Fazer um pedido sobre algo.',
			placeholder: 'Esclareça o pedido.',
			page: 'Wikipédia:Pedidos/Outros',
		}
	],

	/**
	 * User infomation
	 * @property {Object[]} userInfo
	 */
	userInfo: [ {
			href: mw.util.getUrl( 'Special:Contributions/' ) + userName,
			title: 'Abrir a lista de contribuições deste editor',
			text: 'Contribuições',
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
			title: 'Abrir a contagem de edições deste editor',
			text: 'Contador de edições'
		}, {
			href: 'https://xtools.wmflabs.org/pages/pt.wikipedia.org/' + userName,
			title: 'Abrir a lista de páginas criadas por este editor',
			text: 'Páginas criadas'
		}, {
			href: 'https://alberobot.toolforge.org/voto.php?user=' + userName,
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
			text: 'Páginas vigiadas',
			title: 'Exibir páginas vigiadas que foram alteradas recentemente'
		}, {
			action: function () {
				fastb.callAPI( 'MR' );
			},
			text: 'Mudanças recentes',
			title: 'Exibir mudanças recentes feitas por IPs em páginas do domínio principal'
		}, {
			action: function () {
				fastb.callAPI( 'PN' );
			},
			text: 'Páginas novas',
			title: 'Exibir páginas novas que ainda não foram patrulhadas'
		}, {
			action: function () {
				fastb.callAPI( 'SCORES' );
			},
			text: 'Edições a revisar',
			title: 'Exibir edições com grandes chances de serem desfeitas e que ainda não foram patrulhadas'
		}, {
			action: function () {
				fastb.callAPI( 'ER' );
			},
			text: 'Eliminação rápida',
			title: 'Exibir as páginas que foram marcadas para eliminação rápida'
		}
	]
} );

/**
 * Default justifications for the ESR prompt
 * @property {Object[]} defaultJustifications_ESR
 */
fastb.defaultJustificationsESR = {
	'Arte': 'Artigo sem [[WP:FC|fontes confiáveis]] e [[WP:FI|independentes]] que confirmem as afirmações do texto e atestem'
		+ ' notoriedade. Ver [[WP:V|princípio da verificabilidade]] e [[WP:CDN|critérios de notoriedade]]. Páginas'
		+ ' pessoais, sites de fãs, sites colaborativos (como Discogs, IMDb, etc.), blogues (como Blogspot, Blogger, WordPress, etc.)'
		+ ' e redes sociais (como Facebook, Instagram, Twitter, etc.) não são fontes confiáveis.',

	'Banda': [
		'Artigo sobre banda/grupo musical sem [[WP:FC|fontes confiáveis]] e [[WP:FI|independentes]] que confirmem as afirmações do'
			+ ' texto e atestem a notoriedade do artista ou de sua obra. Ver [[WP:V|princípio da verificabilidade]] e'
			+ ' [[WP:CDN|critérios de notoriedade]] (e o [[Wikipédia:Critérios de notoriedade/Música|critério específico para música]]).'
			+ ' Páginas pessoais, sites de fãs, sites colaborativos (como Discogs, IMDb, etc.), blogues (como Blogspot, Blogger,'
			+ ' WordPress, etc.) e redes sociais (como Facebook, Instagram, Twitter, etc.) não são fontes confiáveis.',
		'ESR-banda'
	],

	'Cantores, álbuns e músicas' : 'Artigo relacionado à música sem [[WP:FC|fontes confiáveis]] e [[WP:FI|independentes]] que confirmem'
		+ ' as afirmações do texto e atestem a notoriedade do artista ou de sua obra. Ver [[WP:V|princípio da verificabilidade]] e'
		+ ' [[WP:CDN|critérios de notoriedade]] (e o [[Wikipédia:Critérios de notoriedade/Música|critério específico para música]]).'
		+ ' Páginas pessoais, sites de fãs, sites colaborativos (como Discogs, IMDb, etc.), blogues (como Blogspot, Blogger, WordPress, etc.)'
		+ ' e redes sociais (como Facebook, Instagram, Twitter, etc.) não são fontes confiáveis.',

	'Ciência': 'Artigo sem [[WP:FC|fontes confiáveis]] e [[WP:FI|independentes]] que confirmem as afirmações do texto e atestem'
		+ ' notoriedade. Ver [[WP:V|princípio da verificabilidade]] e [[WP:CDN|critérios de notoriedade]]. Páginas'
		+ ' pessoais, fóruns, blogues (como Blogspot, Blogger, WordPress, etc.) e redes sociais (como Facebook, Instagram, Twitter, etc.)'
		+ ' não são fontes confiáveis.',

	'Ciências sociais': 'Artigo sem [[WP:FC|fontes confiáveis]] e [[WP:FI|independentes]] que confirmem as afirmações do texto e atestem'
		+ ' notoriedade. Ver [[WP:V|princípio da verificabilidade]] e [[WP:CDN|critérios de notoriedade]]. Páginas'
		+ ' pessoais, fóruns, blogues (como Blogspot, Blogger, WordPress, etc.) e redes sociais (como Facebook, Instagram, Twitter, etc.)'
		+ ' não são fontes confiáveis.',

	'Educação': 'Artigo sem [[WP:FC|fontes confiáveis]] e [[WP:FI|independentes]] que confirmem as afirmações do texto e atestem'
		+ ' notoriedade. Ver [[WP:V|princípio da verificabilidade]] e [[WP:CDN|critérios de notoriedade]] (e o'
		+ ' [[Wikipédia:Critérios de notoriedade/Educação|critério específico para educação]]). Páginas'
		+ ' pessoais, fóruns, blogues (como Blogspot, Blogger, WordPress, etc.) e redes sociais (como Facebook, Instagram, Twitter, etc.)'
		+ ' não são fontes confiáveis.',

	'Entretenimento': 'Artigo sem [[WP:FC|fontes confiáveis]] e [[WP:FI|independentes]] que confirmem as afirmações do texto e atestem'
		+ ' notoriedade. Ver [[WP:V|princípio da verificabilidade]] e [[WP:CDN|critérios de notoriedade]]. Páginas'
		+ ' pessoais, sites de fãs, sites colaborativos (como Discogs, IMDb, etc.), blogues (como Blogspot, Blogger, WordPress, etc.)'
		+ ' e redes sociais (como Facebook, Instagram, Twitter, etc.) não são fontes confiáveis.',

	'Esporte/desporto': 'Artigo sem [[WP:FC|fontes confiáveis]] e [[WP:FI|independentes]] que confirmem as afirmações do texto e atestem'
		+ ' notoriedade. Ver [[WP:V|princípio da verificabilidade]] e [[WP:CDN|critérios de notoriedade]] (e o'
		+ ' [[Wikipédia:Critérios de notoriedade/Desporto|critério específico para desporto]]). Páginas pessoais, sites'
		+ ' de fãs, sites colaborativos (como Zerozero, oGol, etc.), blogues (como Blogspot, Blogger, WordPress, etc.) e redes sociais'
		+ ' (como Facebook, Instagram, Twitter, etc.) não são fontes confiáveis.',

	'História e sociedade': 'Artigo sem [[WP:FC|fontes confiáveis]] e [[WP:FI|independentes]] que confirmem as afirmações do texto'
		+ ' e atestem notoriedade. Ver [[WP:V|princípio da verificabilidade]] e [[WP:CDN|critérios de notoriedade]]. Páginas'
		+ ' pessoais, fóruns, blogues (como Blogspot, Blogger, WordPress, etc.) e redes sociais (como Facebook, Instagram, Twitter, etc.)'
		+ ' não são fontes confiáveis.',

	'Medicina': 'Artigo sem [[WP:FC|fontes confiáveis]] e [[WP:FI|independentes]] que confirmem as afirmações do texto e atestem'
		+ ' notoriedade. Ver [[WP:V|princípio da verificabilidade]] e [[WP:CDN|critérios de notoriedade]]. Páginas'
		+ ' pessoais, fóruns, blogues (como Blogspot, Blogger, WordPress, etc.) e redes sociais (como Facebook, Instagram, Twitter, etc.)'
		+ ' não são fontes confiáveis.',

	'Países': 'Artigo sem [[WP:FC|fontes confiáveis]] e [[WP:FI|independentes]] que confirmem as afirmações do texto e atestem'
		+ ' notoriedade. Ver [[WP:V|princípio da verificabilidade]] e [[WP:CDN|critérios de notoriedade]]. Páginas'
		+ ' pessoais, fóruns, blogues (como Blogspot, Blogger, WordPress, etc.) e redes sociais (como Facebook, Instagram, Twitter, etc.)'
		+ ' não são fontes confiáveis.',

	'Pessoas': [
		'Biografia sem [[WP:FC|fontes confiáveis]] e [[WP:FI|independentes]] que confirmem as afirmações do texto e atestem a'
			+ ' notoriedade do biografado. Ver [[WP:V|princípio da verificabilidade]] e [[WP:CDN|critérios de notoriedade]] (e o'
			+ ' [[Wikipédia:Critérios de notoriedade/Biografias|critério específico para biografias]]). Páginas '
			+ ' pessoais, sites de fãs, sites colaborativos (como Discogs, IMDb, etc.), blogues (como Blogspot, Blogger, WordPress, etc.)'
			+ ' e redes sociais (como Facebook, Instagram, Twitter, etc.) não são considerados fontes confiáveis.',
		'ESR-bio'
	],

	'Política': 'Artigo sem [[WP:FC|fontes confiáveis]] e [[WP:FI|independentes]] que confirmem as afirmações do texto e atestem '
		+ ' notoriedade. Ver [[WP:V|princípio da verificabilidade]] e [[WP:CDN|critérios de notoriedade]] (e o'
		+ ' [[Wikipédia:Critérios de notoriedade/Política|critério específico para política]]). Páginas'
		+ ' pessoais, fóruns, blogues (como Blogspot, Blogger, WordPress, etc.) e redes sociais (como Facebook, Instagram, Twitter, etc.)'
		+ ' não são fontes confiáveis.'
};

}( fastButtons ) );
