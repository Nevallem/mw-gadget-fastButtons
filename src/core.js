/*!
 * FastButtons Core
 *
 * @author [[es:User:Racso]] (versão original do script, na Wikipédia em espanhol)
 * @author [[en:User:Macy]] (versão adaptada para a Wikipédia inglesa)
 * @author [[pt:User:Danilo.mac]]
 * @author Helder (https://github.com/he7d3r)
 * @author [[pt:User:!Silent]]
 * @source [[en:User:Macy/FastButtons.js]] ([[en:Special:PermaLink/230473471]])
 * @source [[es:Special:PrefixIndex/User:Racso/FB]]
 * @see [[MediaWiki:Gadget-fastbuttons.js]]
 * @see [[MediaWiki:Gadget-fastbuttons.css]]
 * @see [[MediaWiki:Gadget-fastbuttons.js/buttonsList.js]]
 * @help [[WP:Scripts/FastButtons]]
 */
/* jshint laxbreak: true, unused: true, newcap: false */
/* global mw, $, jQuery, wikEd, WikEdUpdateFrame, WikEdUpdateTextarea */

( function () {
'use strict';


var localStorageAvailable = ( function () {
	try {
		return window.localStorage;
	} catch ( e ) {}
}() );

if ( !localStorageAvailable )
	return;

var fastb,
	api = new mw.Api();

/**
 * @constructor FastButtons
 */
function FastButtons() {
	/**
	 * Timestamp of the current version
	 * @property {string}
	 */
	this.version = /*{{subst:Autossubstituição/Estampa com data e hora|js|.*/ '2022-09-16 00:42:13 (UTC)' /*}}.*/;

	/**
	 * List of buttons
	 * @property {Object}
	 */
	this.buttons = {};
}

FastButtons.prototype = {
	/**
	 * Messages
	 * @param {string} name Name of the message
	 * @param {string|number} [$N] Dynamic parameters to the message (i.e. the values for $1, $2, etc)
	 * @see [[mw:ResourceLoader/Default_modules#mediaWiki.message]]
	 * @return {string}
	 */
	message: function ( /*name[, $1[, $2[, ... $N ]]]*/ ) {
		return mw.message.apply( this, arguments ).plain();
	},

	/**
	 * Open a prompt
	 * @param {string} name Name of prompt
	 * @param {string} [extraArg] If the prompt receive arguments, you can pass them
	 * @see fastb.Prompt
	 * @return {undefined}
	 */
	openPrompt: function ( name /*[, extraArg[, extraArg2[, extraArg3[, ... extraArgN ]]]]*/ ) {
		new fastb.Prompt( name ).open.apply( this, Array.prototype.slice.call( arguments, 1 ) );
	},

	/**
	 * Edit a page
	 * @param {Object} info Edit info
	 * @see [[mw:API:Edit]] and [[w:pt:MediaWiki:Gadget-mediawiki.api.ptwiki.js]]
	 * @return {jQuery.Deferred}
	 */
	editPage: function ( info ) {
		var apiDeferred = $.Deferred(),
			edit = function ( value ) {
				if ( typeof info.text === 'function' ) {
					info.text = info.text( value );
				}

				if ( typeof info.getText !== 'undefined' ) {
					delete info.getText;
				}

				info.watchlist = 'preferences';
				info.summary = info.summary;
				info.minor = true;
				info.tags = 'fast-buttons';
				info.done = {
					success: info.done,
					apiError: function ( error ) {
						fastb.notify( $.parseHTML( fastb.message( 'fastb-notify-apiErrorEdit', error.code, error.info ) + fastb.message( 'fastb-notify-errorSufix' ) ) );
					},
					unknownError: function () {
						fastb.notify( $.parseHTML( fastb.message( 'fastb-notify-editFail' ) + fastb.message( 'fastb-notify-errorSufix' ) ) );
					}
				};

				fastb.notify( fastb.message( 'fastb-notify-editingPage' ) );
				api.editPage( info ).done( function () {
					apiDeferred.resolve();
				} );
			};

		// If "info.text" is set and is a function, gets the page content first
		// Set "info.getText" if you need get the content of another page other than "info.title"
		if ( typeof info.getText === 'string' || typeof info.text === 'function' ) {
			fastb.notify( fastb.message( 'fastb-notify-getPageContent' ) );
			api.getCurrentPageText( info.getText || info.title ).done( function ( value ) {
				edit( value );
			} );
		} else {
			edit();
		}

		return apiDeferred.promise();
	},

	/**
	 * Notifications
	 * @param {string} text Notification text
	 * @param {mw.notification.defaults} [options] Additional options of notification
	 * @see [[mw:ResourceLoader/Default modules#mw.notify]]
	 * @return {jQuery.Deferred}
	 */
	notify: function ( text, options ) {
		var optionsDefault = {
			title: fastb.message( 'fastb-FastButtons' ),
			autoHide: true,
			autoHideSeconds: 5
		};

		if ( $.isPlainObject( options ) ) {
			$.extend( optionsDefault, options );
		}

		return mw.notify( text, optionsDefault );
	},

	/**
	 * Refresh or submit an edit (in edit page) the pages
	 * @param {string} [code] Only if action === 'move' or 'redirect'
	 * @param {string} [page] Target page
	 * @return {undefined}
	 */
	refreshPage: function ( code, page ) {
		localStorage.setItem( 'fastb-success', code === 'move' ? 'move' : 'edit' );

		if ( $.inArray( fastb.action, [ 'edit', 'submit' ] ) !== -1/* && !mw.util.getParamValue( 'redlink' )*/ ) {
			$( '#editform' ).trigger( 'submit' );
		} else {
			location.href = mw.util.getUrl( page ) + ( ( code === 'redirect' ? '?redirect=no' : '' ) );
		}
	},

	/**
	 * Creates a dialog
	 * @param {jQuery.dialog} info Dialog info
	 * @return {jQuery}
	 */
	dialog: function ( info ) {
		var $fbDialog = $( '<div class="fastb-dialog" class="ui-widget"></div>' ).append( info.content );

		if ( !info.modal ) {
			info.modal = true;
		}

		if ( !info.buttons ) {
			info.buttons = {
				'OK': function () {
					$( this ).dialog( 'close' );
				}
			};
		}

		$.extend( info, {
			title: fastb.message( 'fastb-FastButtons' ) + ( info.title ? ' - ' + info.title : '' ),
			open: function () {
				$( '.ui-dialog-titlebar-close' ).hide();
			},
			close: function () {
				$fbDialog.dialog( 'destroy' ).remove();
			}
		} );

		return $fbDialog.dialog( info );
	},

	/**
	 * Changes the content of the submenu
	 * @param {string|Array} list The buttons for the submenu
	 * @param {boolean} [append] Appends in submenu instead of replace all content
	 * @param {number|Array} [justEnable] If needs include only some buttons of the list. The numbers are the index in the array of buttons ("list" param).
	 * @example
	 *	fastb.changeSubmenu(
	 *		fastb.buttons.maintenance,
	 *		false,
	 *		[ 14, 16, 20 ]
	 *	);
	 * @return {jQuery}
	 */
	changeSubmenu: function ( list, append, justEnable ) {
		var i, item;

		$( '.tipsy' ).remove();

		if ( !append ) {
			fastb.$submenu.empty().show();
		}

		if ( !Array.isArray( list ) ) {
			list = [ list ];
		}

		if ( justEnable && !Array.isArray( justEnable ) ) {
			justEnable = [ justEnable ];
		}

		for ( i = 0; i < list.length; i++ ) {
			item = list[ i ];

			if ( typeof item === 'function' ) {
				item();
			} else if ( ( typeof item === 'string' ) || ( item instanceof jQuery ) ) {
				fastb.$submenu.append( item );
			} else {
				if ( justEnable && $.inArray( i, justEnable ) === -1 ) {
					item.disable = true;
				}

				fastb.addButton( fastb.$submenu, item );
			}
		}

		return fastb.$submenu.find( 'a, span' ).tipsy( {
			html: true
		} );
	},

	/**
	 * Appends content in submenu
	 * @param {string|Array} list The buttons for the submenu
	 * @see FastButtons.prototype.changeSubmenu
	 * @return {jQuery}
	 */
	appendSubmenu: function ( list ) {
		return fastb.changeSubmenu( list, true );
	},

	/**
	 * Edit function
	 * @param {string} code A template name, possibly preceded by "subst:" and optionally followed by "|" and some parameter(s), ex: "não remova"or "subst:ER|A4" or "subst:ESR-matrad|1=\~\~\~~|língua='"
	 * @param {string|null} [extraText] Extra text for templates and redirects
	 * @param {string} [sum] Summary of edit
	 * @param {boolean} [warn] If a warning is sent
	 * @param {string} [templateName] If the code is a subst, is necessary pass the template name (see fastb.buttons.maintenance in /buttonsList.js)
	 * @return {jQuery.Deferred}
	 */
	run: function ( code, extraText, sum, warn, templateName ) {
		var rcid,
			apiDeferred = $.Deferred();

		if ( $.inArray( fastb.action, [ 'edit', 'submit' ] ) !== -1 ) {
			// wikEd compatibility
			if ( typeof wikEd !== 'undefined' ) {
				if ( wikEd.useWikEd ) {
					WikEdUpdateTextarea();
				}
			}

			fastb.manipulateTextPage( code, extraText, sum, $( '#wpTextbox1' ).val(), warn, templateName ).done( function () {
				apiDeferred.resolve();
			} );
			fastb.addTag();
		} else if ( fastb.action === 'view' ) {
			rcid = mw.util.getParamValue(
				'rcid',
				mw.util.$content.find( 'div.patrollink a' ).prop( 'href' ) || ''
			);

			if ( rcid ) {
				fastb.notify( fastb.message( 'fastb-notify-patrollingPage' ) );
				fastb.callAPI( 'patrolPage' );
			}


			if ( code === 'redirect'
				&& fastb.action === 'view'
				&& fastb.pageNotExist
			) {
				fastb.manipulateTextPage( code, extraText, sum, '', warn, templateName ).done( function () {
					apiDeferred.resolve();
				} );
			} else {
				fastb.notify( fastb.message( 'fastb-notify-getPageContent' ) );
				api.getCurrentPageText().done( function ( value ) {
					fastb.manipulateTextPage( code, extraText, sum, value, warn, templateName ).done( function () {
						apiDeferred.resolve();
					} );
				} );
			}
		}

		return apiDeferred.promise();
	},

	/**
	 * Add the FastButtons revision tag
	 * (based on https://github.com/he7d3r/mw-gadget-APC/blob/master/src/APC.js)
	 * @return {undefined}
	 */
	addTag: function () {
		var $wpChangeTags = $( '#wpChangeTags' );

		if ( $wpChangeTags.length > 0 ) {
			if ( $wpChangeTags.val().indexOf( 'fast-buttons' ) === -1 ) {
				$wpChangeTags.val( $wpChangeTags.val() + ',fast-buttons' );
			}
		} else {
			$( '#editform' ).prepend(
				$( '<input>' ).attr( {
					'id': 'wpChangeTags',
					'type': 'hidden',
					'name': 'wpChangeTags',
					'value': 'fast-buttons'
				} )
			);
		}
	},
};

/**
 * Create new button links
 * @param {jQuery|Array|Object} $target A jQuery object representing the target or
 *	an object representing a button (see 'buttons' param below) or
 *	an Array of this kind of objects
 *	(Defaults to fastb.$menu if it is not an instance of jQuery)
 * @param {Object} buttons Button atributes and others informations of the new button
 * @param {string|Function} buttons.action
 * @param {string} buttons.text
 * @param {string} buttons.title
 * @param {string} [buttons.sum]
 * @param {string} [buttons.label]
 * @param {string} [buttons.prompt]
 * @param {boolean} [buttons.disable]
 * @param {string} [buttons.after]
 * @param {boolean} [buttons.warn]
 * @param {string} [buttons.type]
 * @param {string} [buttons.templateName]
 * @param {function} [buttons.preload]
 * @return {undefined}
 */
FastButtons.prototype.addButton = function ( $target, buttons ) {
	var i, comment, props, button,
		doNothing = function ( event ) {
			event.preventDefault();
		},
		buttonClick = function ( btn ) {
			return function ( event ) {
				var question = ( typeof btn.action === 'string' && btn.action.substr( 0, 2 ) === 'ER' ) ? fastb.message( 'fastb-dialog-note' ) : btn.prompt,
					buttonAction = function () {
						if ( question ) {
							comment = fastb.openPrompt( 'defaultPrompt', question, btn.label, promptCallback );
						} else {
							promptCallback( comment );
						}
					},
					promptCallback = function ( comment ) {
						if ( typeof btn.action === 'function' ) {
							btn.action();
						} else {
							fastb.run( btn.action, comment, btn.sum, btn.warn, btn.templatename );
						}
					};

				doNothing( event );

				if ( $( this ).parent().prop( 'id' ) === 'fastb-menu' ) {
					$( '.fastb-menu-open' ).removeClass( 'fastb-menu-open' );
				}

				if ( fastb.$submenu.text().indexOf( fastb.message( 'fastb-loading' ) ) === -1
					&& typeof btn.action !== 'string'
					&& btn.text === 'Mover' && fastb.textButton === 'Mover a página' || ( fastb.textButton === btn.text
						&& $.inArray( fastb.textButton, [ 'Não assinou', 'Semirrápida', 'Consenso', 'Mover a página', 'Informações', 'Fusão' ] ) === -1
					) || ( btn.text === 'Eliminação'
						&& $.inArray( fastb.textButton, [ 'Semirrápida', 'Consenso' ] ) !== -1
					)
				) {
					fastb.textButton = '';
					fastb.$submenu.empty().hide();
					return;
				}

				if ( fastb.infoLoaded && fastb.textButton === btn.text && btn.text !== 'Mover a página' ) {
					fastb.infoLoaded = false;
					fastb.$submenu.empty().hide();
					return;
				}

				if ( !fastb.editPermission && $.inArray( btn.text, [ 'Eliminação', 'Manutenção', '#R', 'Esboço', 'Aviso', 'Não assinou' ] ) !== -1 ) {
					fastb.textButton = btn.text;
					fastb.changeSubmenu( fastb.message( 'fastb-page-noEditPermission' ) );
					return;
				}

				if ( fastb.$submenu.html() !== ''
					&& ( typeof btn.action === 'string' && $.inArray( btn.text, [ 'Não assinou', 'Eliminação', '#R', 'ER1' ] ) !== -1 )
				) {
					fastb.$submenu.empty().hide();
				}

				if ( typeof btn.preload === 'function' ) {
					btn.preload().done( function ( nextStep ) {
						if ( nextStep === 'continue' ) {
							buttonAction();
						}
					} );
				} else {
					buttonAction();
				}

				if ( typeof btn.action === 'function' ) {
					fastb.textButton = btn.text;
				}

				if ( typeof btn.action === 'function' && $.inArray( btn.text, [ 'Semirrápida', 'Consenso', 'Não assinou'  ] ) === -1 ) {
					$( this ).addClass( 'fastb-menu-open' );
				}
			};
		};

	if ( !$target.jquery ) {
		// if $target is not an instance of jQuery, use it as 'buttons'
		buttons = $target;
		$target = fastb.$menu;
	}

	if ( !Array.isArray( buttons ) ) {
		buttons = [ buttons ];
	}

	for ( i = 0; i < buttons.length; i++ ) {
		button = buttons[ i ];
		props = {
			title: button.title,
			text: button.text,
			'class': 'fastb-button '
		};

		if ( button.disable ) {
			props.class += 'fastb-disabled-button';
			props.click = doNothing;
			props.title = '';
		} else {
			props.class += 'fastb-' + ( button.type || ( typeof button.action === 'function' || button.action === 'request' ? 'menu' : 'action' ) ) + '-button';
			props.click = ( button.action === 'request' ) ? fastb.openPrompt.bind( fastb, 'requests', button ) : buttonClick( button );
		}

		if ( button.after && !!$( '.fastb-button' ).length ) {
			$( '.fastb-button' ).eq( button.after ).after( $( '<a></a>', props ), '' );
		} else {
			$target.append( $( '<a></a>', props ).tipsy(), ' ' );
		}
	}
};

/**
 * API calls
 * @param {string} code Type of request. See "this.ProcessAPI"
 * @param {string} [extra] Used only when "code" param is:
 *	pageQuality	-> Can be 'noCallback' or 'noBeforeRequest' or
 *	requestDeletion	-> Can be "true" (boolean value) or
 *	Anyone code	-> Can be 'justData'.
 * @param {boolean} [noCallback]
 * @return {jQuery.Deferred|undefined}
 */
FastButtons.prototype.callAPI = function ( code, extra, noCallback ) {
	var $doRequest,
		processAPI = new fastb.ProcessAPI( code ),
		requestParams = processAPI.params,
		callbackFunction = noCallback ? false : processAPI.callback;

	if ( $.inArray( code, [ 'PV', 'PN', 'MR', 'SCORES', 'ER' ] ) !== -1 && fastb.$submenu.html() === fastb.message( 'fastb-loading' ) ) {
		return;
	} else if ( code === 'requestDeletion' ) {
		return processAPI.callback( extra );
	}

	if ( code === 'esb' ) {
		requestParams.apprefix = 'Esboço-' + $( '#fastb-esb-input' ).val();
	} else if ( $.inArray( code, [ 'MR', 'PN', 'PV', 'SCORES', 'ER' ] ) !== -1 ) {
		fastb.changeSubmenu( fastb.message( 'fastb-loading' ) );
	}

	if ( $.isPlainObject( callbackFunction ) ) {
		if ( code === 'pageQuality' ) {
			// Is necessary a separated 'if' to prevents "too much recursion" error
			if ( extra === 'noCallback' ) {
				callbackFunction.beforeRequest();
				return;
			}
		} else if ( extra !== 'justData' ) {
			callbackFunction.beforeRequest();
		}

		callbackFunction = callbackFunction.callback;
	}

	requestParams.format = 'json';

	if ( !requestParams.action ) {
		requestParams.action = 'query';
	}

	$doRequest = ( requestParams.action !== 'query' ) ? $.post : $.get;

	return $doRequest(
		mw.util.wikiScript( 'api' ),
		requestParams,
		function ( data ) {
			if ( !data ) {
				fastb.error( fastb.message( 'fastb-error-unableGetList', requestParams.list ) );
				return;
			}

			if ( extra === 'justData' ) {
				return;
			}

			if ( callbackFunction ) {
				callbackFunction.call(
					$.isPlainObject( processAPI.callback ) ? processAPI.callback : processAPI,
					data.query,
					code,
					data
				);
			}
		}
	);
};

/**
 * Sends a warning to a user
 * @param {string} type Type of warning
 * @param {string} [extraArgN] If was necessary pass some another parameter
 * @see fastb.Warn
 * @return {jQuery.Deferred}
 */
FastButtons.prototype.sendWarning = function ( type /*[, extraArg[, extraArg2[, ... extraArgN ]]]*/ ) {
	var warnInfo,
		warn = new fastb.Warn( type ),
		apiDeferred = $.Deferred();

	warn.open.apply( undefined, Array.prototype.slice.call( arguments, 1 ) ).done( function ( userAnswer ) {
		if ( !userAnswer && type === 'elimination' ) {
			apiDeferred.resolve( 'notSent' );
			return;
		}

		warnInfo = warn.info;

		$( '.fastb-dialog' ).last().dialog( 'close' );
		fastb.notify( fastb.message( 'fastb-notify-sendWarning' ) );
		fastb.editPage( {
			title: 'User talk:' + warnInfo.userName,
			appendtext: '\n\n\{\{subst:Aviso-' + warnInfo.template + '}} \~\~\~~',
			summary: warnInfo.summary,
			done: function () {
				apiDeferred.resolve();

				if ( !warnInfo.isPE && !( --fastb.Warn.queue ) ) {
					fastb.refreshPage();
				}
			}
		} );
	} );

	return apiDeferred.promise();
};

/**
 * Manipulate the text page
 * @param {string} code See "fastb.run"
 * @param {string} extraText See "fastb.run"
 * @param {string} sum Summary of edit
 * @param {string} value Text of page
 * @param {boolean} [warn] If a warning is sent
 * @return {jQuery.Deferred}
 */
FastButtons.prototype.manipulateTextPage = function ( code, extraText, sum, value, warn, templateName ) {
	var fbSummary, templatePlacement, valueToLower,
		appendBelowDesambig = /(\{\{(dablink|distinguir|hatnote|(mini|ver )?desambig(?!-)|não confundir|nota\:|outrosusos|redirect|rellink).+\}\}[\n]*)+/gi,
		apiDeferred = $.Deferred(),
		editCallback = function ( e ) {
			if ( fastb.isEditPage ) {
				e.preventDefault();
			}

			if ( code === 'subst:apagar' || ( code.search( 'av(iso)?-' ) === -1
				&& /(ES?R)/.test( code )
				&& !/ER(\|(C1|D1|D2|R1|R2|G1|P1))/i.test( code )
			) ) {
				if ( code !== 'subst:apagar' && code.indexOf( 'ESR' ) === -1 ) {
					fastb.Warn.queue++;
					fastb.sendWarning( 'elimination', code );
				} else {
					apiDeferred.resolve();
				}
			} else if ( warn ) {
				fastb.Warn.queue++;
				fastb.sendWarning( 'maintenanceTags', code );
			} else if ( code === 'Em manutenção' ) {
				fastb.Warn.queue++;
				fastb.openPrompt( 'maintenance' );
			} else if ( !fastb.Warn.queue ) {
				fastb.refreshPage( code );
			}
		};

	value = value || '';
	valueToLower = value.toLowerCase();

	// Prevents same tag
	if ( valueToLower.indexOf( '\{\{esboço' ) !== -1 && code.indexOf( 'Esboço' ) !== -1
		|| valueToLower.indexOf( '{{' + ( templateName && templateName.toLowerCase() ) ) !== -1
	) {
		fastb.dialog( {
			title: fastb.message( 'fastb-warning' ),
			content: code.indexOf( 'Esboço' ) === -1
				? fastb.message( 'fastb-alreadyExistsThisTag', templateName || code )
				: fastb.message( 'fastb-alreadyExistsThisStub' )
		} );

		return apiDeferred.promise();
	}

	// Prevents over one elimination tag
	if ( code.search( /(ES?R|apagar)/g ) !== -1
		&& /\{\{(subst:)?(?:ER|ESR(2?|-banda|-bio|-empresa|-bsre|-organização|-matrad)|apagar|usuário(\(a\))?\:salebot\/impróprio)[\|\}]/i.test( valueToLower )
		&& fastb.nsNum !== 3
	) {
		fastb.dialog( {
			title: fastb.message( 'fastb-warning' ),
			content: fastb.message( 'fastb-alreadyExistsEliminationTag' )
		} );

		return apiDeferred.promise();
	}

	if ( code.indexOf( 'ER' ) === 0 ) {
		fastb.Warn.proponentObservationER = extraText;
		extraText = extraText ? '|3=' + extraText : '';
		extraText = '\{\{' + code + extraText + '|2=\~\~\~~}}\n';
		extraText = ( fastb.nsNum === 10 ) ? '<noinclude>' + extraText + '</noinclude>' : extraText;
		value = extraText + value;
		fbSummary = fastb.message( 'fastb-summary-requestElimination', code.substring( 3 ) );
	} else if ( code === 'redirect' ) {
		extraText = extraText.split( '|2=' );

		if ( fastb.nsNum === 14 ) {
			value = '\{\{Redirecionamento de categoria|' + extraText[ 0 ] + '|2=' + extraText[ 1 ] + '}}';
		} else {
			value = '#REDIRECIONAMENTO [' + '[' + extraText[ 0 ] + ']]';
		}

		fbSummary = fastb.message( 'fastb-summary-redirect', extraText[ 0 ].replace( /_/g, ' ' ), ( ( extraText[ 1 ] !== '' ) ? ' (' + extraText[ 1 ] + ')' : '' ) );
	} else {
		if ( code === 'Global' ) {
			extraText = ( { '1': '/Lusofonia', '2': '/Brasil', '3': '/Portugal' } )[ extraText ] || '';
		} else {
			extraText = extraText ? '|1=' + extraText : '';
		}

		if ( $.inArray( code, [ 'Renomear página', 'Parcial', 'Uma-fonte'] ) !== -1 ) {
			extraText += '|\{\{subst:DATA}}';
		}

		if ( code === 'Insuficiente' ) {
			extraText += '|2=\~\~\~~';
		}

		extraText = '\{\{' + code + extraText + '}}';

		if ( fastb.nsNum === 3 ) {
			if ( /(bv-av|bem-vind)/.test( code ) ) {
				value = extraText + '\n\~\~\~~\n' + value;
			} else if ( code.search( 'Vandalismo repetido' ) !== -1 ) {
				value = extraText + '\n\n' + value;
			} else {
				value += '\n\n' + ( code.search( /(bloqueado|proxy)/ ) !== -1 ? '== Notificação de bloqueio ==\n' : '' ) + extraText + '\n\~\~\~~';
			}

			fbSummary = fastb.message( 'fastb-summary-addMessage', code.replace( 'subst:', '' ) );
		} else if ( code.indexOf( 'Esboço' ) === 0 || code === 'Sem sinopse' ) {
			if ( ( templatePlacement = value.search( /\n+\[\[Categ/ ) ) !== -1 ) {
				value = value.substring( 0, templatePlacement ) + '\n\n' + extraText + value.substring( templatePlacement );
			} else {
				value += '\n\n' + extraText;
			}

			fbSummary = fastb.message( 'fastb-summary-stub' );
		} else {
			if ( /subst:(apagar|ESR)/.test( code ) && fastb.nsNum === 10 ) {
				value = '<noinclude>' + extraText + '</noinclude>' + value;
			} else if ( !!templateName && value.search( appendBelowDesambig ) !== -1 ) {
				value = value.replace( appendBelowDesambig, function ( desambig ) {
					return desambig.replace( /\n+$/, '' ) + '\n' + extraText + '\n';
				} );
			} else {
				value = extraText + '\n' + value;
			}

			if ( code.indexOf( 'ESR' ) !== -1 ) {
				fbSummary = fastb.message( 'fastb-summary-ESR' );
			}

			if ( code.search( /\b(f\-referências|[sm](ais)?[\-\s](fontes|notas)(\-bpv)?)\b/ ) !== -1 ) {
				value = value.replace( /\{\{Sem[\-\s]fontes([\-\s]bpv)?.+\}\n?/gi, '' );
			}

			if ( code.search( /subst:[ms]-fontes-bpv/ ) !== -1 ) {
				value = value.replace( /\{\{(Mais|Sem)[\-\s](fontes|notas)[^(\-\sbpv)].+\}\n?/gi, '' );
			}
		}

		fbSummary = sum || fbSummary || fastb.message( 'fastb-summary-addTag' );
	}

	if ( fastb.isEditPage ) {
		$( '#wpTextbox1' ).val( value );
		$( '#wpSummary' ).val(
			$( '#wpSummary' ).val() + (
				$( '#wpSummary' ).val() !== ''
					? '; ' + fbSummary.replace( /^./, function ( c ) { return c.toLowerCase(); } ) // If already exists a previous summary
					: fbSummary
			)
		);

		if ( !fastb.Warn.queue ) {
			if ( code.search( /(BV|bem-vindo)/i ) !== -1 ) {
				$( '#wpSave' ).trigger( 'click' );
			} else {
				$( '#wpSave' ).on( 'click', editCallback );
			}
		}

		// wikEd compatibility
		if ( typeof wikEd !== 'undefined' ) {
			if ( wikEd.useWikEd ) {
				WikEdUpdateFrame();
			}
		}

		return apiDeferred.promise();
	}

	fastb.disableAllButtons();
	fastb.notify( fastb.message( 'fastb-notify-editingPage' ) );
	fastb.editPage( {
		summary: fbSummary,
		text: value,
		done: editCallback
	} );

	return apiDeferred.promise();
};

/**
 * Initialize the gadget
 * @return {undefined}
 */
FastButtons.prototype.init = function () {
	var ipAddress, buttonsLength;

	if ( localStorage.getItem( 'fastb-success' ) ) {
		fastb.notify( fastb.message( 'fastb-notify-' + localStorage.getItem( 'fastb-success' ) + 'Success' ) );
		localStorage.removeItem( 'fastb-success' );
	}

	if ( mw.config.get( 'skin' ) === 'modern' ) {
		$( '#contentSub' ).before( fastb.$menu ).before( fastb.$submenu );
	} else if ( mw.config.get( 'skin' ) === 'vector-2022' ) {
		$( '#bodyContent' ).before( fastb.$menu ).before( fastb.$submenu );
	} else {
		$( 'h1' ).first().after( fastb.$submenu ).after( fastb.$menu );
	}

	if ( fastb.pageName !== 'Wikipédia:Página_principal'
		&& $.inArray( fastb.action, [ 'view', 'edit', 'submit' ] ) !== -1
	) {
		fastb.addButton( {
			action: fastb.changeSubmenu.bind( fastb, fastb.buttons.elimination ),
			text: 'Eliminação',
			title: 'Exibe as opções de eliminação para esta página',
			disable: fastb.pageNotExist || fastb.nsNum === -1
		} );

		if ( $.inArray( fastb.nsNum, [ 0, 4, 12 ] ) !== -1 ) {
			fastb.addButton( {
				action: function () {
					buttonsLength = fastb.buttons.maintenance.length;

					fastb.changeSubmenu(
						fastb.buttons.maintenance,
						false,
						( $.inArray( fastb.nsNum, [ 4, 12 ] ) !== -1 ) ? [ buttonsLength - 1 ] : undefined
					);
				},
				text: 'Manutenção',
				title: 'Exibir predefinições para manutenção',
				disable: fastb.pageNotExist
			} );
		}

		if ( fastb.nsNum % 2 === 0 ) {
			fastb.addButton( {
				action: 'redirect',
				text: '#R',
				title: 'Redirecionar para outro título',
				prompt: 'Informe a página e o motivo do redirecionamento',
				label: 'Página|2=Motivo' + ( ( fastb.nsNum !== 14 ) ? '[optional]' : '' ),
				disable: $.inArray( fastb.nsNum, [ 6, 8, 828 ] ) !== -1
			} );
		}

		if ( fastb.nsNum === 0 ) {
			fastb.addButton( [ {
					action: fastb.changeSubmenu.bind( fastb, [ {
							action: 'Esboço',
							text: 'Esboço genérico',
							title: 'Artigo ainda pouco desenvolvido'
						},
						fastb.fieldForStubs
					] ),
					text: 'Esboço',
					title: 'Exibir predefinições para esboços',
					disable: fastb.pageNotExist
				}, {
					action: fastb.changeSubmenu.bind( fastb, fastb.searchButtons ),
					text: 'Busca',
					title: 'Exibir opções para a busca de fontes'
				}
			] );
		}

		if ( fastb.nsNum === 3 ) {
			fastb.addButton( {
				action: fastb.changeSubmenu.bind( fastb, fastb.buttons.warn ),
				text: 'Aviso',
				title: 'Exibir lista de predefinições para avisos',
				disable: mw.config.get( 'wgUserName' ) === window.unescape( mw.util.getUrl().split( ':' )[ 1 ] )
			} );
		} else if ( fastb.nsNum === 10 ) {
			fastb.addButton( {
				action: fastb.openPrompt.bind( fastb, 'merging' ),
				text: 'Fusão',
				title: 'Página necessita de fusão',
				disable: fastb.pageNotExist
			} );
		} else if ( fastb.nsNum === 14 ) {
			fastb.addButton( {
				action: fastb.changeSubmenu.bind( fastb, fastb.petScanButtons ),
				text: 'PetScan',
				title: 'Exibir opções do PetScan para procurar páginas nesta categoria',
				disable: fastb.pageNotExist
			} );
		}

		if ( mw.config.get( 'wgAction' ) == 'edit' && ( fastb.nsNum % 2 == 1 || fastb.nsNum == 4 ) ) {
			fastb.addButton( {
				action: function () {
					fastb.openPrompt( 'defaultPrompt',
						'Não assinou',
						'Quem foi o editor que deixou de assinar?|2=Data do comentário[optional]',
						function ( info ) {
							info = info.split( '|2=' );

							$( '#wpSummary' ).val( ( $( '#wpSummary' ).val() !== '' ? $( '#wpSummary' ).val() + '; ' : '' ) + 'Adicionando a "[[Predefinição:Não assinou]]"' );
							$( '#wpTextbox1' ).textSelection(
								'encapsulateSelection', {
									peri: '\{\{subst:Não assinou|' + info[ 0 ] + ( info[ 1 ] !== '' ? '|' + info[ 1 ] : '' ) + '}}'
								}
							);
						}
					);
				},
				type: 'action',
				text: 'Não assinou',
				title: 'Adiciona uma mensagem informando que o editor não assinou a mensagem',
				disable: fastb.pageNotExist
			} );
		}
	}

	if ( $.inArray( fastb.nsNum, [ 2, 3 ] ) !== -1 || mw.config.get( 'wgCanonicalSpecialPageName' ) === 'Contributions' ) {
		ipAddress = ( $.inArray( fastb.nsNum, [ 2, 3 ] ) !== -1 )
			? fastb.title.split( '/' )[ 0 ]
			: ( mw.util.getUrl().split( '/' )[ 3 ] || mw.util.getParamValue( 'target' ) );

		if ( !!ipAddress ) {
			if ( mw.util.isIPAddress( ipAddress.split( '/' )[ 0 ] ) ) {
				fastb.addButton( {
					action: fastb.callAPI.bind( fastb, 'anon' ),
					text: 'Sobre o IP',
					title: 'Exibir informações sobre este IP',
					disable: ipAddress.indexOf( '/' ) !== -1
				} );
			} else {
				fastb.addButton( {
					action: fastb.callAPI.bind( fastb, 'usu' ),
					text: 'Sobre a conta',
					title: 'Exibir informações sobre esta conta',
					disable: mw.config.get( 'wgCanonicalSpecialPageName' ) === 'Contributions'
						&& !( mw.util.getUrl().split( '/' )[ 3 ] || mw.util.getParamValue( 'target' ) )
				} );
			}
		}
	}

	fastb.addButton( [ {
			action: function () {
				if ( fastb.$submenu.text().indexOf( fastb.message( 'fastb-loading' ) ) !== -1 ) {
					return;
				}

				fastb.changeSubmenu( [ fastb.message( 'fastb-loading' ), fastb.$pageInfo.empty().hide() ] );
				api.getCurrentPageText().done( function ( value ) {
					if ( value === undefined ) {
						fastb.callAPI( 'deletionLogs' );
					} else {
						if ( $.inArray( fastb.nsNum, [ 2, 3, 8, 828 ] ) === -1 && fastb.nsNum % 2 === 0 ) {
							fastb.callAPI( 'backLinks' );
						} else {
							fastb.callAPI( 'requestDeletion' );
						}
					}
				} );
			},
			text: 'Informações',
			title: 'Exibe informações sobre a página',
			disable: fastb.nsNum === -1
		}, {
			action: fastb.movePage,
			text: 'Mover',
			title: 'Exibe as opções para moção da página',
			disable: fastb.nsNum === -1 || fastb.pageNotExist
		}, {
			action: fastb.changeSubmenu.bind( fastb, fastb.buttons.requests ),
			text: 'Pedido',
			title: 'Exibe botões para realização de pedidos referentes a uma página ou usuário',
		}, {
			action: fastb.changeSubmenu.bind( fastb, fastb.buttons.list ),
			text: 'Listar',
			title: 'Exibe os botões que listam edições nas páginas novas, mudanças recentes, páginas vigiadas e eliminação rápida'
		}
	] );

	fastb.$menu.append( $( '<a />', {
		'id': 'fastb-hideButton',
		'title': fastb.message( 'fastb-hideButton-title' ),
		'text': '[' + fastb.message( 'fastb-hideButton' ) + ']'
	} ).tipsy() );

	$( '#fastb-hideButton' ).click( function () {
		$( '#ca-fastbHideButton a' ).text( fastb.message( 'fastb-FastButtons' ) + ' (' + fastb.message( 'fastb-showButton' ) + ')' );
		fastb.$menu.fadeOut( 'slow' );
		fastb.$submenu.fadeOut( 'slow' );
		fastb.$pageInfo.fadeOut( 'slow' );
		localStorage.setItem( 'fastb-hidden', true );
	} );

	$( '#ca-fastbHideButton a' ).off( 'click' ).click( function ( e ) {
		e.preventDefault();

		if ( fastb.$menu.css( 'display' ) !== 'none' ) {
			fastb.$menu.fadeOut( 'slow' );
			fastb.$submenu.fadeOut( 'slow' );
			fastb.$pageInfo.fadeOut( 'slow' );
			localStorage.setItem( 'fastb-hidden', true );
		} else {
			fastb.$menu.fadeIn( 'slow' );
			localStorage.setItem( 'fastb-hidden', false );
		}

		$( this ).text(
			mw.message( 'fastb-FastButtons' ) + ' (' + mw.message( 'fastb-' + ( localStorage.getItem( 'fastb-hidden' ) === 'true' ? 'show' : 'hide' ) + 'Button' ) + ')'
		);
	} );
};

/***** Everything above this is public, this means that the members can be acessed through window.fastButtons. Bellow, all is private. ****/

/**
 * @object fastb Instance of FastButtons constructor
 */
fastb = new FastButtons();

$.extend( fastb, {
	/**
	 * @property {jQuery}
	 */
	$menu: $( '<div id="fastb-menu"></div>' ),

	/**
	 * @property {jQuery}
	 */
	$submenu: $( '<div id="fastb-submenu"></div>' ),

	/**
	 * @property {jQuery}
	 */
	$pageInfo: $( '<span id="fastb-pageInfo"></span>' ),

	/**
	 * @property {number}
	 */
	nsNum: mw.config.get( 'wgNamespaceNumber' ),

	/**
	 * @property {string}
	 */
	title: mw.config.get( 'wgTitle' ),

	/**
	 * @property {string}
	 */
	pageName: mw.config.get( 'wgPageName' ),

	/**
	 * @property {string}
	 */
	action: mw.config.get( 'wgAction' ),

	/**
	 * @property {string}
	 */
	userName: ( ( mw.config.get( 'wgCanonicalSpecialPageName' ) !== 'Contributions' )
		? mw.config.get( 'wgTitle' ).split( '/' )[ 0 ]
		: window.decodeURI( mw.util.getUrl().split( '/' )[ 3 ] || mw.util.getParamValue( 'target' ) )
	).replace( /^./, function ( c ) { return c.toUpperCase(); } ), // Upper case the first letter, to avoid problems in API requests

	/**
	 * @property {boolean}
	 */
	isEditPage: mw.config.get( 'wgAction' ) === 'edit',

	/**
	 * @property {boolean}
	 */
	editPermission: !!$( '#ca-edit' ).length,

	/**
	 * @property {boolean}
	 */
	pageNotExist: !!( mw.util.getParamValue( 'redlink' ) === '1'
		|| $( '.noarticletext' ).length
		|| ( fastb.nsNum === 14 && $( '.noarticletext' ).length ) ),

	/**
	 * Throw errors
	 * @param {string} errorText Text describing the error
	 * @return {undefined}
	 */
	error: function ( errorText ) {
		throw new Error( fastb.message( 'fastb-FastButtons' ) + ': ' + errorText );
	},

	/**
	 * Forces fill a field
	 * @param {jQuery} $target
	 * @param {boolean} [condition] Condition to force fill
	 * @return {boolean}
	 */
	forceFill: function ( $target, condition ) {
		if ( ( typeof condition === 'boolean' && condition ) || ( typeof condition !== 'boolean' && $target.val() === '' ) ) {
			$target.addClass( 'fastb-fillField' );
		} else if ( $target.hasClass( 'fastb-fillField' ) ) {
			$target.removeClass( 'fastb-fillField' );
		}

		return ( typeof condition === 'boolean' ? !condition : $target.val() !== '' );
	},

	/**
	 * Disable all buttons
	 * @return {undefined}
	 */
	disableAllButtons: function () {
		$( '.fastb-button' ).each( function () {
			$( this ).addClass( 'fastb-disabled-button' ).off( 'click' );
			$( this ).attr( 'original-title', '' );
		} );
	},

	/**
	 * Format dates
	 * @param {string} unformattedDate The date
	 * @param {boolean} [noHours] If it'sn't necessary to use the hours
	 * @return {string}
	 */
	formatDate: function ( unformattedDate, noHours ) {
		var date = new Date( unformattedDate ),
			formattedDate = '';

		if ( !noHours ) {
			formattedDate = fastb.message( 'fastb-hours', ( date.getHours() < 10 ? '0' : '' ) + date.getHours(), ( date.getMinutes() < 10 ? '0' : '' ) + date.getMinutes() ) + ' ';
		}

		formattedDate += fastb.message( 'fastb-date',
			date.getDate().toString().replace( /^(\d)$/, '0$1' ),
			mw.config.get( 'wgMonthNames' )[ date.getMonth() + 1 ], // FIXME: in JS or CSS pages, the month name ever appears in english
			date.getFullYear()
		);

		return formattedDate;
	},

	/**
	 * Add an input for stubs
	 * @return {undefined}
	 */
	fieldForStubs: function () {
		var $stubInput, $okButton,
			doAction = function () {
				if ( fastb.forceFill( $stubInput ) ) {
					fastb.run( 'Esboço-' + $( '#fastb-esb-input' ).val() );
				}
			};

		$stubInput = $( '<input type="text" id="fastb-esb-input" size="24" />' )
			.autocomplete( {
				source: function ( _request, response ) {
					fastb.callAPI( 'esb' ).done( function ( data ) {
						response( $.map( data.query.allpages, function ( item ) {
							return item.title.replace( /^Predefinição:Esboço-/gi, '' );
						} ) );
					} );
				}
			} )
			.keyup( function ( e ) {
				if ( e.which === $.ui.keyCode.ENTER ) {
					doAction();
				}
			} );

		$okButton = $( '<input value="OK" type="button" class="fastb-button fastb-action-button" />' ).click( doAction );

		fastb.appendSubmenu( [ ' Esboço-', $stubInput, ' ', $okButton ] );
	},

	/**
	 * Add the search buttons
	 * @return {undefined}
	 */
	searchButtons: function () {
		var i, item,
			list = fastb.buttons.search,
			search = encodeURIComponent( fastb.title.indexOf( ' ' ) !== -1 ? '"' + fastb.title + '"' : fastb.title );

		for ( i = 0; i < list.length; i++ ) {
			item = list[ i ];

			fastb.appendSubmenu( $( '<a></a>', {
				'class': 'fastb-button fastb-link-button',
				target: '_blank',
				href: item.url + search,
				text: item.text,
				title: item.desc
			} ) );
		}
	},

	/**
	 * Add the PetScan buttons
	 * @return {undefined}
	 */
	petScanButtons: function () {
		var item,
			i = 0,
			list = fastb.buttons.cat,
			petScanUrl = 'https://petscan.wmflabs.org/?'
				+ $.param( {
					language: mw.config.get( 'wgContentLanguage' ),
					project: 'wikipedia',
					interface_language: mw.config.get( 'wgUserLanguage' ),
					categories: fastb.title,
					depth: 1,
					format: 'html',
					doit: 1
				} );

		fastb.changeSubmenu( fastb.message( 'fastb-petScan' ) + ': ' );

		for ( i = 0; i < list.length; i++ ) {
			item = list[ i ];

			fastb.appendSubmenu( $( '<a></a>', {
				'class': 'fastb-button fastb-link-button',
				target: '_blank',
				href: petScanUrl + item.url,
				text: item.text,
				title: item.desc
			} ) );
		}
	},

	/**
	 * Move pages
	 * @return {undefined}
	 */
	movePage: function () {
		var ns, namespaces, params, $movePage, $newTitle, $reason;

		if ( !$( '#ca-move' ).length ) {
			fastb.changeSubmenu( fastb.message( 'fastb-page-move-noPermissions' ) );
			return;
		}

		fastb.changeSubmenu( '<span id="fastb-movePage"></span>' );

		$movePage = $( '#fastb-movePage' ).append(
			$( '<label for="fastb-movePage-newTitle">' + fastb.message( 'fastb-page-move-newTitle' ) + ': </label>' ),
			$( '<select id="fastb-movePage-select"></select>' ),
			' ',
			$( '<input type="input" id="fastb-movePage-newTitle" size="60" />' ).val( fastb.pageName.replace( /_/g, ' ' ).replace( /.+\:/, '' ) ),
			' ',
			$( '<label for="fastb-movePage-reason">' + fastb.message( 'fastb-page-move-reason' ) + ': </label>' ),
			$( '<input type="input" id="fastb-movePage-reason" size="60" />' )
		);

		for ( ns in ( namespaces = mw.config.get( 'wgFormattedNamespaces' ) ) ) {
			if ( typeof namespaces[ ns ] !== 'undefined' && ( ns >= 0 && ns <= 829 ) ) {
				$( '<option></option>' ).val( ns ).html( namespaces[ ns ] || fastb.message( 'fastb-page-move-mainDomain' ) ).appendTo( '#fastb-movePage-select' );
			}
		}

		$( '#fastb-movePage-select' ).find( 'option[value="' + mw.config.get( 'wgNamespaceNumber' ) + '"]' ).prop( 'selected', true );

		if ( $( '#ca-talk a' ).prop( 'href' ).indexOf( 'redlink=1' ) === -1 ) {
			$movePage.append(
				'<br />',
				$( '<input type="checkbox" id="fastb-movePage-talk" checked />' ),
				' ',
				$( '<label for="fastb-movePage-talk">' + fastb.message( 'fastb-page-move-talk' ) + '</label>' )
			);
		}

		if ( $.inArray( 'sysop', mw.config.get( 'wgUserGroups' ) ) !== -1
			|| $.inArray( 'eliminator', mw.config.get( 'wgUserGroups' ) ) !== -1
		) {
			$movePage.append(
				!$( '#fastb-movePage br' ).length ? '<br />' : ' ',
				$( '<input type="checkbox" id="fastb-movePage-redirect" checked />' ),
				' ',
				$( '<label for="fastb-movePage-redirect">' + fastb.message( 'fastb-page-move-redirect' ) + '</label>' )
			);
		}

		$newTitle = $( '#fastb-movePage-newTitle' );
		$reason = $( '#fastb-movePage-reason' );

		fastb.addButton( $movePage, {
			action: function () {
				if ( !fastb.forceFill( $newTitle, $newTitle.val() === '' || ( $newTitle.val() === fastb.pageName.replace( /_/g, ' ' )
					&& $( '#fastb-movePage-select' ).val() == mw.config.get( 'wgNamespaceNumber' ) ) )
				) {
					return;
				}

				$newTitle = ( $( '#fastb-movePage-select' ).val() != '0' ? $( '#fastb-movePage-select :selected' ).html() + ':' : '' ) + $newTitle.val();
				params = {
					action: 'move',
					from: fastb.pageName,
					to: $newTitle,
					token: mw.user.tokens.get( 'csrfToken' ),
					tags: 'fast-buttons'
				};

				if ( $( '#fastb-movePage-talk' ).prop( 'checked' ) ) {
					params.movetalk = 1;
				}

				if ( !$( '#fastb-movePage-redirect' ).prop( 'checked' ) ) {
					params.noredirect = 1;
				}

				if ( $reason.val() !== '' ) {
					params.reason = $reason.val();
				}

				fastb.notify( fastb.message( 'fastb-page-move-moving' ) );
				fastb.disableAllButtons();
				$.post( mw.util.wikiScript( 'api' ), params ).done( function () {
					fastb.refreshPage( 'move', $newTitle );
				} );
			},
			text: fastb.message( 'fastb-page-move-buttonName' ),
			title: fastb.message( 'fastb-page-move-buttonTitle' ),
			type: 'action'
		} );
	}
} );

/**
 * Brings together all processes calls to API
 * @constructor fastb.ProcessAPI
 * @see FastButtons.prototype.callAPI
 */
fastb.ProcessAPI = function ( typeRequest ) {
	/**
	 * Parameters of the requests
	 * @private {Object}
	 */
	var params = {
		PV: {
			list: 'watchlist',
			wlprop: 'user|comment|title|sizes',
			wlshow: '!bot',
			wltype: 'edit',
			wlexcludeuser: mw.config.get( 'wgUserName' )
		},

		MR: {
			list: 'recentchanges',
			rctype: 'edit',
			rcnamespace: '0',
			rcshow: '!autopatrolled',
			rcprop: 'user|comment|title|sizes'
		},

		PN: {
			list: 'recentchanges',
			rctype: 'new',
			rcnamespace: '0',
			rcshow: '!patrolled|!redirect',
			rcprop: 'user|comment|title|sizes|ids'
		},

		SCORES: {
			list: 'recentchanges',
			rctype: 'edit',
			rcnamespace: '0',
			rclimit: '150',
			rcshow: '!patrolled',
			rcprop: 'user|comment|title|sizes|ids'
		},

		ER: {
			list: 'categorymembers',
			cmtitle: 'Category:!Páginas_para_eliminação_rápida'
		},

		esb: {
			list: 'allpages',
			apnamespace: '10'
		},

		usu: {
			list: 'users',
			usprop: 'editcount|registration|groups|blockinfo',
			meta: 'globaluserinfo',
			guiprop: 'groups|unattached',
			ususers: fastb.userName,
			guiuser: fastb.userName.replace( /_/g, ' ' ) // user_name like this returns a "missing" error in globaluserinfo data
		},

		anon: {
			list: 'usercontribs',
			uclimit: '500',
			ucprop: 'timestamp',
			ucdir: 'newer',
			ucuser: fastb.userName
		},

		pageInfo: {
			prop: 'info|revisions',
			inprop: 'watchers',
			titles: fastb.pageName
		},

		pageQuality: {
			prop: 'categories',
			indexpageids: '1',
			titles: mw.config.get( 'wgFormattedNamespaces' )[ fastb.nsNum + 1 ] + ':' + fastb.title
		},

		backLinks: {
			list: 'backlinks',
			bllimit: '1',
			blfilterredir: 'nonredirects',
			bltitle: fastb.pageName
		},

		deletedEdits: {
			list: 'deletedrevs',
			drlimit: '500',
			titles: fastb.pageName
		},

		deletionLogs: {
			list: 'logevents',
			letype: 'delete',
			letitle: fastb.pageName
		},

		patrolPage: {
			action: 'patrol',
			tags: 'fast-buttons',
			rcid: mw.util.getParamValue( 'rcid', mw.util.$content.find( 'div.patrollink a' ).prop( 'href' ) ),
			token: mw.user.tokens.get( 'patrolToken' )
		},

		pageRevisions: {
			prop: 'revisions',
			rvprop: 'user|comment|timestamp',
			rvlimit: '20',
			rvdir: 'newer',
			titles: fastb.pageName
		},

		pageEditors: {
			prop: 'revisions',
			rvprop: 'user',
			rvlimit: '500',
			titles: fastb.pageName
		}
	},

	/**
	 * Callbacks of the requests
	 * @private {Object}
	 */
	callbacks = {
		PV: this.recentEdits,
		MR: this.recentEdits,
		PN: this.recentEdits,
		SCORES: this.recentEdits,
		ER: this.recentEdits,
		usu: this.userInfo,
		anon: this.userInfo,
		pageInfo: this.pageInfo,
		pageQuality: this.pageQuality,
		backLinks: this.backLinks,
		deletedEdits: this.deletedEdits,
		deletionLogs: this.deletionLogs,
		requestDeletion: this.requestDeletion
	};

	/**
	 * @public {Object} params
	 * @public {Function} callback
	 */
	this.params = params[ typeRequest ];
	this.callback = callbacks[ typeRequest ];
};

/**
 * Callback function for the request of recent edits (from watchlist, recent changes or new pages)
 * @param {Object} query API data
 * @param {string} code Code passed through "fastb.callAPI"
 * @return {undefined}
 */
fastb.ProcessAPI.prototype.recentEdits = function ( query, code ) {
	var revids,
		scoreBatch,
		batchSize = 50,
		i = 0,
		oresData = {},
		info = {
			PV: {
				listName: 'watchlist',
				urlParam: 'diff=last',
				noItems: fastb.message( 'fastb-noRecentChange' ),
				summaryChanges: [
					[ '[[Ajuda:SEA|?]]', '' ],
					[ '/*', '?' ],
					[ '*/', ':' ]
				]
			},

			MR: {
				listName: 'recentchanges',
				urlParam: 'diff=last',
				noItems: fastb.message( 'fastb-noRecentChange' ),
				summaryChanges: [
					[ '/*', '?' ],
					[ '*/', ':' ]
				]
			},

			PN: {
				listName: 'recentchanges',
				urlParam: 'redirect=no&rcid=',
				noItems: fastb.message( 'fastb-noNewPage' ),
				summaryChanges: [
					[ '[[Ajuda:SEA|?]] ', '' ]
				]
			},

			SCORES: {
				listName: 'recentchanges',
				urlParam: 'diff=',
				noItems: fastb.message( 'fastb-noScoredRecentChanges' ),
				summaryChanges: [
					[ '/*', '?' ],
					[ '*/', ':' ]
				]
			},

			ER: {
				listName: 'categorymembers',
				noItems: fastb.message( 'fastb-noER' ),
			}
		},
		list = query[ info[ code ].listName ],
		max = ( list.length < 10 ) ? list.length : 10,
		processScores = function ( data ) {
			list = $.grep( list, function ( rev ) {
				var scores = data[ rev.revid ];

				return scores && !scores.error
					&& !scores.damaging.error && !scores.goodfaith.error
					&& scores.damaging.prediction && !scores.goodfaith.prediction;
			} );

			$.each( list, function ( _i, rev ) {
				var scores = data[ rev.revid ];

				rev.damagingScore = scores.damaging.probability[ 'true' ];
				rev.goodfaithScore = scores.goodfaith.probability[ 'true' ];
			} );

			list = list.sort( function ( a, b ) {
				return b.damagingScore - a.damagingScore;
			} ).slice( 0, max );

			showPages( list );
		},
		showPages = function ( list ) {
			var item, titleItem, length, comment, bytesColor, bold, urlParam,
				pages = [],
				charNum = 0,
				i = 0,
				j = 0;

			while ( i < max ) {
				item = list[ i++ ];

				if ( !item ) {
					continue;
				}

				urlParam = info[ code ].urlParam;
				titleItem = item.title;
				charNum += titleItem.length;

				if ( charNum > 180 ) {
					break;
				}

				length = item.newlen - item.oldlen;

				if ( length > 0 ) {
					length = '+' + length;
				}

				comment = item.comment || '';

				if ( info[ code ].summaryChanges ) {
					for ( ; j < info[ code ].summaryChanges.length; j++ ) {
						comment = comment.replace(
							info[ code ].summaryChanges[ 0 ],
							info[ code ].summaryChanges[ 1 ]
						);
					}
				}

				if ( comment ) {
					comment = '(' + comment + ')';
				}

				if ( code === 'PN' ) {
					urlParam += item.rcid;
				} else if ( code === 'SCORES' ) {
					urlParam += item.revid;
				}

				if ( parseInt( length ) === 0 ) {
					bytesColor = 'gray';
				} else if ( parseInt( length ) > 0 ) {
					bytesColor = 'green';
				} else {
					bytesColor = 'red';
				}

				bold = ( parseInt( length ) >= 500 || parseInt( length ) <= -500 );
				comment = comment.replace( /<[^>]+>/g, '' ); // remove HTML tags

				if ( code === 'ER' ) {
					pages.push( '<a href="' + mw.util.getUrl( titleItem ) + '">' + titleItem + '</a>' );
				} else {
					pages.push(
						'<a href="' + mw.util.getUrl( titleItem ) + '?'
						+ urlParam + '" title="(<span class=\'fastb-' + bytesColor + '\'>' + length + '</span>) ' + item.user
						+ ' ' + comment + '">' + titleItem + '</a>'
					);
				}

				if ( bold ) {
					pages[ pages.length - 1 ] = pages[ pages.length - 1 ].replace( /(<span.+>.+<\/span>)/, '<b>$1</b>' );
				}
			}

			fastb.changeSubmenu( ( pages.join( ' | ' ) || info[ code ].noItems ) );

		};

	if ( code === 'SCORES' ) {
		scoreBatch = function ( idsOnBatch ) {
			$.ajax( {
				url: '//ores.wikimedia.org/scores/ptwiki/',
				data: {
					models: 'damaging|goodfaith',
					revids: idsOnBatch.join( '|' )
				},
				dataType: 'json'
			} )
			.done( function ( data ) {
				$.extend( oresData, data );
				i += batchSize;

				if ( i < revids.length ) {
					scoreBatch( revids.slice( i, i + batchSize ) );
				} else {
					processScores( oresData );
				}
			} )
			.fail( function () {
				mw.log.error( 'FastButtons: the request failed.', arguments );
			} );
		};

		revids = $.map( list, function ( n ) {
			return n.revid;
		} );

		scoreBatch( revids.slice( i, i + batchSize ) );
	} else {
		showPages( list );
	}
};

/**
 * Works with the page info, and process the backlinks request
 */
fastb.ProcessAPI.prototype.backLinks = {
	/**
	 * Executes before request
	 * @return {undefined}
	 */
	beforeRequest: function () {
		var key,
			$catLine = $( '#mw-normal-catlinks' ),
			info = {
				cat: {
					condition: $catLine.length
						&& $catLine.html().indexOf( '><a href="' + mw.config.get( 'wgArticlePath' ).replace( '$1', '' ) ) !== -1,
					title: fastb.message( 'fastb-page-cat' )
				}
			};

		if ( fastb.nsNum === 0 ) {
			$.extend( info, {
				ref: {
					condition: $( '.references' ).length,
					title: fastb.message( 'fastb-page-ref' )
				},

				iw: {
					condition: $( '#p-lang' ).find( '.interlanguage-link' ).length,
					title: fastb.message( 'fastb-page-iw' )
				}
			} );
		}

		fastb.$pageInfo.append( '(' );

		if ( fastb.action !== 'history' && ( fastb.nsNum % 2 ) === 0 && !mw.config.get( 'wgIsMainPage' ) ) {
			for ( key in info ) {
				if ( info[ key ] ) {
					fastb.$pageInfo.append( $( '<span></span>', {
						'class': 'fastb-' + ( info[ key ].condition ? 'ok' : 'missing' ),
						title: fastb.message( 'fastb-page-it' ) + ' '
							+ info[ key ].title.replace( '$1 ', ( info[ key ].condition
								? ''
								: fastb.message( 'fastb-no' ).replace( 'N', 'n' ) + ' '
							) ),
						text: key
					} ), ' · ' );
				}
			}
		}
	},

	/**
	 * Callback function
	 * @param {Object} query API data
	 * @return {undefined}
	 */
	callback: function ( query ) {
		var info = '',
			backlinks = query && query.backlinks;

		if ( !backlinks ) {
			fastb.error( fastb.message( 'fastb-error-backlinksNoData' ) );
			return;
		}

		if ( backlinks.length ) {
			info += '<a href="'
				+ mw.util.getUrl( 'Special:WhatLinksHere/' + fastb.pageName )
				+ '" title="' + fastb.message( 'fastb-page-backlinks' ) + '">afl</a>) ';
		} else {
			info += '<span class="fastb-missing" title="' + fastb.message( 'fastb-page-noBacklinks' ) + '">afl</span>) ';
		}

		fastb.$pageInfo.append( info );
		fastb.callAPI( 'requestDeletion' );
	}
};

/**
 * Works with page quality of article and process the request of categories of the discussion page
 */
fastb.ProcessAPI.prototype.pageQuality = {
	/**
	 * Executes before request
	 * @return {undefined}
	 */
	beforeRequest: function () {
		var $featuredContent;

		if ( !$( '#mw-indicator-featured-star' ).length && !$( '#mw-indicator-good-star' ).length ) {
			fastb.callAPI( 'pageQuality', 'noBeforeRequest' );
			return;
		}

		$featuredContent = $( '#mw-indicator-' + ( $( '#mw-indicator-featured-star' ).length ? 'featured' : 'good' ) + '-star' ).find( 'img' ).prop( 'alt' );

		fastb.callAPI( 'pageInfo' );
		fastb.$pageInfo.append(
			' · <span> ' + fastb.message( 'fastb-page-quality' ) + ': <b>'
				+ $featuredContent.substring( 17, $featuredContent.indexOf( '.' ) )
			+ '</b></span>'
		);
	},

	/**
	 * Callback function
	 * @param {Object} query API data
	 * @return {undefined}
	 */
	callback: function ( query ) {
		var cats, pageids, cat, quality,
			i = 0;

		if ( query ) {
			cats = query.pages;
			pageids = query.pageids;

			if ( cats && pageids && pageids.length ) {
				cats = cats[ pageids[ 0 ] ].categories;
			} else {
				fastb.error( fastb.message( 'fastb-error-categoryIncompleteData' ) );
				return;
			}
		} else {
			fastb.error( fastb.message( 'fastb-error-categoryNoData' ) );
			return;
		}

		if ( cats ) {
			while ( i < cats.length ) {
				cat = cats[ i++ ].title;

				if ( cat && cat.indexOf( '!Artigos de qualidade' ) !== -1 ) {
					// Categoria:!Artigos de qualidade 1 sobre ...
					// 				...^
					quality = cat.substr( 32, 1 );

					if ( quality === 'd' ) {
						quality = fastb.message( 'fastb-page-qualityUnknown' );
					}

					break;
				}
			}
		}

		fastb.callAPI( 'pageInfo' );
		fastb.$pageInfo.append(
			' <span>' + fastb.message( 'fastb-page-quality' ) + ': <b>'
				+ ( quality || fastb.message( 'fastb-page-qualityUnknown' ) )
			+ '</b></span> · '
		);
	}
};

/**
 * Works with user info and process the request of user editcount
 */
fastb.ProcessAPI.prototype.userInfo = {
	/**
	 * Executes before request
	 * @return {undefined}
	 */
	beforeRequest: function () {
		var i, item,
			list = fastb.buttons.userInfo;

		fastb.changeSubmenu( '' );

		for ( i = 0; i < list.length; i++ ) {
			item = list[ i ];

			fastb.appendSubmenu( $( '<a></a>', {
				'class': 'fastb-button fastb-link-button',
				target: '_blank',
				href: item.href,
				title: item.title,
				text: item.text
			} ) );

			if ( item.disable ) {
				fastb.$submenu.find( 'a' ).last()
					.addClass( 'fastb-disabled-button' ).removeClass( 'fastb-link-button' )
					.prop( 'original-title', '' ).removeAttr( 'href target' );
			}
		}

		fastb.appendSubmenu( ' <span id="fastb-editInfo">' + fastb.message( 'fastb-loading' ) + '</span>' );
	},

	/**
	 * Show the data
	 * @param {Object|string} user User name
	 * @param {string} code Is a anon or a registed user
	 * @param {Object} data API data
	 * @param {boolean} [isFallback] If is a fallback
	 * @return {undefined}
	 */
	showData: function ( user, code, data, isFallback ) {
		var groupsMap, userGroups;

		if ( user === 'notExist' ) {
			$( '#fastb-editInfo' ).html( fastb.message( 'fastb-user-notExist' ) );
			return;
		} else if ( !user ) {
			$( '#fastb-editInfo' ).html( fastb.message( 'fastb-user-error' ) );
			return;
		}

		groupsMap = {
			// Local groups
			autoconfirmed: 'Autoconfirmado',
			autoextendedconfirmed: 'Autoconfirmado estendido',
			autoreviewer: 'Autorrevisor',
			bot: [ 'Robô', 'Robôs/Pedidos_de_aprovação' ],
			checkuser: [ 'Verificador de contas', 'CheckUser/Candidaturas' ],
			bureaucrat: [ 'Burocrata', 'Burocratas/Pedidos de aprovação' ],
			confirmed: 'Confirmado',
			eliminator: [ 'Eliminador', 'Eliminadores/Pedidos de aprovação' ],
			epcoordinator: 'Coordenador de curso',
			epinstructor: 'Professor de curso',
			extendedconfirmed: 'Confirmado estendido',
			'interface-admin': 'Administrador de interface',
			'ipblock-exempt': 'Isento de bloqueio de IP',
			patroller: 'Patrulhador',
			suppress: [ 'Supressor', 'Supressão/Candidaturas' ],
			reviewer: 'Revisor',
			rollbacker: 'Reversor',
			sysop: [ 'Administrador', 'Administradores/Pedidos de aprovação' ],

			// Global groups
			'abusefilter-helper': 'Ajudante do filtro de edições',
			'apihighlimits-requestor': 'Solicitante de limites mais altos da API',
			'captcha-exempt': 'Isento de CAPTCHA',
			'global-bot': 'Robô global',
			'global-deleter': 'Eliminador global',
			'global-flow-create': 'Criador de flow global',
			'global-ipblock-exempt': 'Isento de bloqueio de IP global',
			'global-interface-editor': 'Editor de interface global',
			'global-rollbacker': 'Reversor global',
			'global-sysop': 'Administrador global',
			founder: 'Fundador',
			'new-wikis-importer': 'Importador de novas wikis',
			ombudsman: 'Mediador',
			'oathauth-tester': 'Testador do OATHAuth',
			'otrs-member': 'Membro do OTRS',
			'recursive-export': 'Exportador recursivo',
			staff: 'Funcionário da Wikimédia',
			steward: 'Steward',
			sysadmin: 'Administrador do sistema',
			'vrt-permissions': 'Agente de permisões VRT',
			'wmf-ops-monitoring': 'Monitor da operações da WMF',
			'wmf-researcher': 'Investigador da WMF'
		};

		$( '#fastb-editInfo' ).html(
			fastb.message( 'fastb-user-edits' ) + ': <b>'
			+ ( user.editcount ).toLocaleString() + '</b> — ' + ( ( code === 'anon' )
				? fastb.message( 'fastb-user-anonFirstEdit' )
				: fastb.message( 'fastb-user-registryDate' )
			) + ': ' + '<b><span id="fastb-registryDate"></span></b>'
		);

		if ( user.registration ) {
			$( '#fastb-registryDate' ).html(
				( data[ 'continue' ] && code === 'anon' ? fastb.message( 'fastb-user-priorTo' ) + ' ' : '' )
				+ fastb.formatDate( user.registration, true )
			).after(
				( isFallback ) ? '<sup title="' + fastb.message( 'fastb-user-userFirstEdit' ) + '">?</sup>' : ''
			);
		} else {
			$( '#fastb-registryDate' )
				.text( fastb.message( 'fastb-user-undefined' ) )
				.prop( 'title', fastb.message( 'fastb-user-unkownRegisterDate' ) )
				.addClass( 'fastb-help' );
		}

		if ( code !== 'anon' ) {
			userGroups = user.groups.join( ' ' ).replace( /(\*|\buser) ?/g, '' ).split( ' ' );

			if ( data.query.globaluserinfo !== undefined ) {
				userGroups = userGroups.concat( data.query.globaluserinfo.groups );
			}

			userGroups = userGroups.map( function ( el ) {
				if ( typeof groupsMap[ el ] === 'object' ) {
					return '<a href="' + mw.util.getUrl( 'Wikipédia:' + groupsMap[ el ][ 1 ] + '/' + user.name ) + '">' + groupsMap[ el ][ 0 ] + '</a>';
				}

				return groupsMap[ el ] || el;
			} ).sort( function ( x, y ) { // Sort the groups in A-Z
				return ( $( y ).length ? $( y ).text() : y ) < ( $( x ).length ? $( x ).text() : x );
			} );

			// Remove autoconfirmed group if the user have others groups
			if ( userGroups.length > 1 ) {
				userGroups.splice( $.inArray( groupsMap.autoconfirmed, userGroups ), 1 );
			}

			if ( typeof user.blockid === 'number' ) {
				$( '#fastb-editInfo' ).prepend( fastb.message( 'fastb-user-blocked' ) + ' — ' );
			}

			fastb.appendSubmenu( ' — ' + fastb.message( 'fastb-user-groups' ) + ': ' + ( userGroups.join( ' · ' ) || '<span class="fastb-gray">' + fastb.message( 'fastb-none' ).toLowerCase() + '</span>' ) );
		}

		fastb.$submenu.find( 'sup' ).tipsy();
	},

	/**
	 * Callback function
	 * @param {Object} query API data
	 * @param {string} code
	 * @param {Object} data
	 * @return {undefined}
	 */
	callback: function ( query, code, data ) {
		var contribs, globaluserinfo,
			user = {};

		if ( !query ) {
			fastb.error( fastb.message( 'fastb-error-userInfoNoData' ) );
			return;
		}

		if ( code === 'anon' ) {
			if ( query.usercontribs.length === 0 ) {
				$( '#fastb-editInfo' ).text( fastb.message( 'fastb-user-anonNoEdit' ) );
				return;
			}

			contribs = query.usercontribs;
			user.name = contribs[ 0 ].user;
			user.editcount = contribs.length;
			user.registration = contribs[ 0 ].timestamp;

			if ( data[ 'continue' ] ) {
				user.editcount = fastb.message( 'fastb-user-anonLargeEdits', user.editcount );
			}
		} else {
			user = query.users && query.users[ 0 ];

			if ( user.missing !== undefined ) {
				user = 'notExist';
			} else if ( !user.registration ) {
				globaluserinfo = query.globaluserinfo;

				// If isn't possible get the registration date through API call using 'allusers' list
				// uses 'usercontribs' list to get the first edit, setted in "anon" configs (see fastb.ProcessAPI)
				fastb.callAPI( 'anon', undefined, true ).done( function ( data ) {
					data.query.globaluserinfo = globaluserinfo;
					user.registration = data.query.usercontribs[ 0 ] && data.query.usercontribs[ 0 ].timestamp;
					this.showData( user, code, data, true );
				}.bind( this ) );

				return;
			}
		}

		this.showData( user, code, data );
	}
};

/**
 * Callback function for the request of deleted contributions
 * @param {Object} query API data
 * @return {undefined}
 */
fastb.ProcessAPI.prototype.deletedEdits = function ( query ) {
	var deletedRevs = query.deletedrevs[ 0 ],
		none = fastb.message( 'fastb-none' ) + 'a',
		numDeletedRevs = ( !deletedRevs ? 0 : deletedRevs.revisions.length ) || none;

	fastb.$pageInfo.append(
		$( '<a></a>', {
			href: mw.util.getUrl( 'Special:Undelete/' + fastb.pageName ),
			title: fastb.message( 'fastb-page-deletedEdits' ).replace( /^./, 'E' ),
			text: numDeletedRevs
				+ ' ' + fastb.message( 'fastb-page-deletedEdit' + ( $.inArray( numDeletedRevs, [ 1, none ] ) !== -1 ? '' : 's' ) )
		} ),
		' · '
	);

	if ( $.inArray( fastb.nsNum, [ 0, 100 ] ) !== -1 ) {
		fastb.callAPI( 'pageQuality', 'noCallback' );
	} else {
		fastb.callAPI( 'pageInfo' );
	}
};

/**
 * Callback function for the request of page info
 * @param {Object} query API data
 * @param {boolean} [justWatchers] Used by "this.deletionLogs"
 * @return {undefined}
 */
fastb.ProcessAPI.prototype.pageInfo = function ( query, justWatchers ) {
	var text = [],
		info = query.pages[ ( justWatchers === true ) ? -1 : mw.config.get( 'wgArticleId' ) ];

	text[ 1 ] = fastb.message( 'fastb-page-watchers' ) + ': <b>' + ( parseInt( info.watchers ) || fastb.message( 'fastb-none' ).toLowerCase() ) + '</b>';

	if ( justWatchers !== true ) {
		text[ 0 ] = fastb.message( 'fastb-page-size' ) + ': <b>' + ( info.length ).toLocaleString() + ' bytes</b>';
		text[ 2 ] = fastb.message( 'fastb-page-lastEdit' ) + ': <a href="' + mw.util.getUrl() + '?diff=last">' + fastb.formatDate( info.revisions[ 0 ].timestamp ) + '</a>';
	}

	text[ text.length ] = '<a href="' + mw.util.getUrl( 'Special:Log' ) + '?page=' + fastb.pageName + '">' + fastb.message( 'fastb-page-log' ) + '</a>';
	text[ text.length ] = '<a href="https://tools.wmflabs.org/pageviews/?project=pt.wikipedia.org&platform=all-access&agent=user&range=latest-20&pages=' + fastb.pageName + '">' + fastb.message( 'fastb-page-pageviews' ) + '</a>';
	text[ text.length ] = '<a href="' + mw.util.getUrl() + '?action=info">' + fastb.message( 'fastb-page-moreInfo' ) + '</a>';

	if ( fastb.textButton === 'Informações' ) {
		fastb.$pageInfo.append( text.join( ' · ' ) ).show().html();
		fastb.changeSubmenu( fastb.$pageInfo );
	}

	fastb.infoLoaded = true;
};

/**
 * Executed if the page isn't exist
 * @param {Object} query API data
 * @return {undefined}
 */
fastb.ProcessAPI.prototype.deletionLogs = function ( query ) {
	var text, getWatchers,
		logevents = query.logevents;

	if ( logevents.length ) {
		text = fastb.message( 'fastb-page-pageDeleteDate', fastb.formatDate( logevents[ 0 ].timestamp ) );
		getWatchers = true;

	} else {
		text = fastb.message( 'fastb-page-notExist' );
	}

	fastb.$pageInfo.append( text );

	if ( getWatchers ) {
		fastb.callAPI( 'pageInfo', undefined, true ).done( function ( data ) {
			fastb.ProcessAPI.prototype.pageInfo( data.query, true );
		} );
	} else {
		fastb.$pageInfo.show().html();
		fastb.changeSubmenu( fastb.$pageInfo );
		fastb.infoLoaded = true;
	}
};

/**
 * Checks if the page has already been proposed for deletion
 * @param {boolean} [justVerify] If true, only returns if the proposed exists or not
 * @return {jQuery.Deferred}
 */
fastb.ProcessAPI.prototype.requestDeletion = function ( justVerify ) {
	var tagName,
		apiDeferred = $.Deferred();

	api.getCurrentPageText( 'Wikipédia:Páginas para eliminar/' + fastb.pageName ).done( function ( value ) {
		if ( justVerify ) {
			apiDeferred.resolve( !!value );
			return;
		}

		if ( !mw.config.get( 'wgIsMainPage' ) ) {
			tagName = ( !value ) ? 'span' : 'a';
			fastb.$pageInfo.append(
				$( '<' + tagName + ' id="fastb-requestDeletion"></' + tagName + '>' )
					.html( fastb.message( 'fastb-page-requestDeletion' ) + ' · ' )
					.before( ' ' )
			);
		}

		if ( !value ) {
			$( '#fastb-requestDeletion' )
				.prop( 'title', fastb.message( 'fastb-page-neverProposedElimination' ) )
				.addClass( 'fastb-cursorDefault' );
		} else {
			$( '#fastb-requestDeletion' ).prop( {
				title: fastb.message( 'fastb-page-requestDeletionLink' ),
				href: mw.util.getUrl( 'Wikipédia:Páginas para eliminar/' + fastb.pageName )
			} );
		}

		if ( $.inArray( 'sysop', mw.config.get( 'wgUserGroups' ) ) !== -1 || $.inArray( 'eliminator', mw.config.get( 'wgUserGroups' ) ) !== -1 ) {
			fastb.callAPI( 'deletedEdits' );
		} else if ( $.inArray( fastb.nsNum, [ 0, 100 ] ) !== -1 ) {
			fastb.callAPI( 'pageQuality', 'noCallback' );
		} else {
			fastb.callAPI( 'pageInfo' );
		}
	} );

	return apiDeferred.promise();
};

/**
 * Implement warning methods
 * @param {string} type Type of warn (elimination or maintenanceTags)
 * @constructor fastb.Warn
 * @see FastButtons.prototype.sendWarning
 */
fastb.Warn = function ( type ) {
	/**
	 * Info of warn (see FastButtons.prototype.sendWarning)
	 * @property {Object}
	 */
	this.info = {};

	/**
	 * Receives the parameters of warn, pass an calls the warn function
	 *
	 * @param {string|number} [extraArgN] Extra arguments
	 * @return {jQuery.Deferred}
	 */
	this.open = function ( /*[ extraArg[, extraArg2[, extraArgN ] ] ]*/ ) {
		var apiDeferred = $.Deferred();

		this[ type ].apply( this, arguments ).done( apiDeferred.resolve );
		return apiDeferred.promise();
	}.bind( this );
};

/**
 * @property {number}
 */
fastb.Warn.queue = 0;

/**
 * Warns on deleting a page
 * @param {string} code See FastButtons.prototype.run
 * @return {jQuery.Deferred|undefined}
 */
fastb.Warn.prototype.elimination = function ( code ) {
	var revisions, userPageCreator, isPE, eliminationType,
		buttons = {},
		apiDeferred = $.Deferred(),
		callback = function () {
			if ( $( '#fastb-send-message' ).val() === '1' || ( isPE || code === 'ESR' ) ) {
				this.info = {
					userName: userPageCreator,
					template: eliminationType,
					summary: fastb.message( 'fastb-warn-elimination-summary-pageElimination', fastb.pageName.replace( /_/g, ' ' ) ),
					isPE: isPE
				};
			} else if ( $( '#fastb-send-message' ).val() === '2' ) {
				this.info = {
					userName: userPageCreator,
					template: 'não remova',
					summary: fastb.message( 'fastb-warn-elimination-summary-removeEliminationTag' ),
					isPE: isPE
				};
			} else if ( !isPE && code !== 'ESR' ) {
				fastb.refreshPage();
				$( '.fastb-dialog' ).last().dialog( 'close' );
				return;
			}

			apiDeferred.resolve( ( isPE || code === 'ESR' ) ? '1' : $( '#fastb-send-message option:selected' ).attr( 'value' ) );
		}.bind( this );

	eliminationType = ( code === 'subst:apagar' ? 'PE' : 'E' + ( ( code.indexOf( 'ESR' ) !== -1 ) ? 'S' : '' ) + 'R' );
	eliminationType += '|' + fastb.pageName.replace( /_/g, ' ' );
	isPE = eliminationType.indexOf( 'PE' ) !== -1;

	if ( code.indexOf( 'ER' ) !== -1 ) {
		eliminationType += code.substr( code.indexOf( '|' ), code.length ) + ( !!fastb.Warn.proponentObservationER ? '|' + fastb.Warn.proponentObservationER : '' );
	}

	fastb.callAPI( 'pageRevisions' ).done( function ( data ) {
		revisions = data.query.pages[ mw.config.get( 'wgArticleId' ) ].revisions;
		userPageCreator = revisions[ 0 ].user;

		if ( isPE || code === 'ESR' ) {
			callback();
			return;
		}

		if ( userPageCreator === mw.config.get( 'wgUserName' )
			|| ( revisions.length === 1 && /moveu \[\[.+?\]\] para \[\[.+?\]\]/.test( revisions[ 0 ].comment ) )
			|| ( mw.util.isIPAddress( userPageCreator ) && ( Date.parse( revisions[ 0 ].timestamp ) + 86400000 ) < new Date().getTime() )
		) {
			if ( !isPE ) {
				fastb.refreshPage();
			}

			apiDeferred.resolve( undefined );
			return;
		}

		buttons[ fastb.message( 'fastb-OK' ) ] = callback;
		buttons[ fastb.message( 'fastb-cancel' ) ] = function () {
			$( this ).dialog( 'close' );
			apiDeferred.resolve( undefined );

			if ( !isPE && !( --fastb.Warn.queue ) ) {
				fastb.refreshPage();
			}
		};

		fastb.dialog( {
			title: fastb.message( 'fastb-warn-elimination-prompt-title' ),
			width: 'auto',
			height: 'auto',
			content: fastb.message( 'fastb-warn-elimination-prompt-select-' + ( mw.util.isIPAddress( userPageCreator ) ? 'anon' : 'user' ), userPageCreator ) + ':<br /><br />'
				+ '<select id="fastb-send-message">'
					+ '<option value="1">' + fastb.message( 'fastb-warn-elimination-prompt-option-1' ) + '</option>'
					+ '<option value="2">' + fastb.message( 'fastb-warn-elimination-prompt-option-2' ) + '</option>'
					+ '<option>' + fastb.message( 'fastb-warn-elimination-prompt-option-3' ) + '</option>'
				+ '</select><br /><br />',
			buttons: buttons
		} );

		$( '.ui-dialog-buttonset button' ).eq( 0 ).focus();
	} );

	return apiDeferred.promise();
};

/**
 * Warning after a page is tagged with certain maintenance tags
 * @param {string} code See FastButtons.prototype.run
 * @return {jQuery.Deferred}
 */
fastb.Warn.prototype.maintenanceTags = function ( code ) {
	var i, revisions, userPageCreator, revsUsers, sameEditor,
		buttons = {},
		page = fastb.pageName.replace( /_/g, ' ' ),
		apiDeferred = $.Deferred(),
		definitions = {
			's-fontes': {
				name: 'Sem fontes',
				template: 'cite fonte',
				sameEditor: true
			},
			's-fontes-bpv': {
				name: 'Sem fontes-bpv',
				template: 'cite fonte',
				sameEditor: true
			},
			's-cat': {
				name: 'Sem categoria',
				template: 'categoria',
				sameEditor: false
			}
		};

	code = code.replace( 'subst:', '' );

	fastb.callAPI( 'pageRevisions' ).done( function ( data ) {
		revisions = data.query.pages[ mw.config.get( 'wgArticleId' ) ].revisions;
		userPageCreator = revisions[ 0 ].user;
		definitions = definitions[ code ];

		if ( definitions.sameEditor ) {
			sameEditor = true;
			revsUsers = revisions.map( function ( rev ) {
				return rev.user;
			} );

			for ( i = 1; i < revsUsers.length - 1; i++ ) {
				if ( !/moveu \[\[.+?\]\] para \[\[.+?\]\]/.test( revisions[ i - 1 ].comment ) && revsUsers[ i ] !== revsUsers[ i - 1 ] ) {
					sameEditor = false;
					break;
				}
			}
		}

		if ( userPageCreator === mw.config.get( 'wgUserName' )
			|| ( definitions.sameEditor && !sameEditor )
			|| ( ( mw.util.isIPAddress( userPageCreator ) ) && ( Date.parse( revisions[ 0 ].timestamp ) + 86400000 ) < new Date().getTime() )
		) {
			if ( !( --fastb.Warn.queue ) ) {
				fastb.refreshPage();
			}

			return apiDeferred.promise();
		}

		buttons[ fastb.message( 'fastb-yes' ) ] = function () {
			this.info = {
				userName: userPageCreator,
				template: definitions.template + '|' + page,
				summary: fastb.message( 'fastb-warn-maintenanceTags-summary', page, definitions.name )
			};

			apiDeferred.resolve();
		}.bind( this );

		buttons[ fastb.message( 'fastb-no' ) ] = function () {
			fastb.refreshPage();
			$( this ).dialog( 'close' );
		};

		fastb.dialog( {
			title: fastb.message( 'fastb-warn-maintenanceTags-prompt-title', definitions.name ),
			content: fastb.message( 'fastb-warn-maintenanceTags-prompt-content', userPageCreator ),
			width: 'auto',
			height: 'auto',
			buttons: buttons
		} );

		$( '.ui-dialog-buttonset button' ).eq( 0 ).focus();
	}.bind( this ) );

	return apiDeferred.promise();
};

/**
 * Implement prompts
 * @param {string} type Type of prompt
 * @constructor fastb.Prompt
 * @see FastButtons.prototype.openPrompt
 */
fastb.Prompt = function ( type ) {
	/**
	 * Receives the parameters of prompt, pass an calls the warn function
	 * @param {string|number|boolean} [extraArgN] Extra arguments
	 * @return {jQuery.Deferred}
	 */
	this.open = function ( /*[ extraArg[, extraArg2[, extraArgN ] ] ]*/ ) {
		return this[ type ].apply( this, arguments );
	}.bind( this );
};

/**
 * Default prompt
 * @param {string} title Title of prompt
 * @param {string} label Labels of inputs
 *     @example
 *     'field1|2=field2[optional]|3=field3', results in 3 inputs with the respective labels
 *	Set "[optional]" to a label if it's optional.
 *	If exists only one label, by default it be optional. To force the fill, set it "[required]".
 * @param {Function} callback Function to be called after the user input
 * @return {undefined}
 */
fastb.Prompt.prototype.defaultPrompt = function ( title, label, callback ) {
	if ( !label ) {
		label = fastb.message( 'fastb-dialog-labelDefault' );
	}

	var i,
		buttons = {},
		dialogContent = '',
		multipleLabels = label.indexOf( '|2=' ) !== -1;

	if ( multipleLabels ) {
		for ( i = 1, label = label.split( /\|\d+=/ ); i <= label.length; i++ ) {
			dialogContent += '<label for="fastb-nprompt-input' + i + '">'
				+ label[ i - 1 ].replace( /\[.+\]/, '' )
				+ ': <input type="text" class="fastb-field" id="fastb-nprompt-input' + i + '" /></label>';
		}
	} else {
		dialogContent = '<label for="fastb-nprompt-input">'
			+ label.replace( /\[.+\]/, '' )
			+ ': <input type="text" class="fastb-field" id="fastb-nprompt-input" /></label>';
	}

	buttons[ fastb.message( 'fastb-OK' ) ] = function () {
		var awnsers,
			$inputs = $( '.fastb-dialog input' );

		if ( !Array.isArray( label ) ) {
			label = [ label ];
		}

		if ( label !== fastb.message( 'fastb-dialog-labelDefault' ) && label.length !== 1 ) {
			$inputs.each( function ( i ) {
				fastb.forceFill( $( this ), $( this ).val() === '' && label[ i ].indexOf( '[optional]' ) === -1 );
			} );
		} else if ( label.length === 1 && label[ 0 ].indexOf( '[required]' ) !== -1 ) {
			fastb.forceFill( $inputs.eq( 0 ), $inputs.eq( 0 ).val() === '' );
		}

		if ( $( '.fastb-field' ).hasClass( 'fastb-fillField' ) ) {
			return;
		}

		if ( !multipleLabels ) {
			awnsers = $( '#fastb-nprompt-input' ).val();
		} else {
			for ( i = 1; i <= $inputs.length; i++ ) {
				awnsers = ( i === 1 )
					? $( '#fastb-nprompt-input1' ).val()
					: awnsers + '|' + i + '=' + $( '#fastb-nprompt-input' + i ).val();
			}
		}

		$( this ).dialog( 'close' );
		callback( awnsers );
	};

	buttons[ fastb.message( 'fastb-cancel' ) ] = function () {
		$( this ).dialog( 'close' );
	};

	fastb.dialog( {
		title: title,
		content: dialogContent,
		width: 'auto',
		height: 'auto',
		buttons: buttons,
		focus: function () {
			$( ':input', this ).keyup( function ( event ) {
				if ( event.keyCode === 13 ) {
					$( '.ui-dialog-buttonpane button:first' ).click();
				}
			} );
		}
	} );
};

/**
 * ESR ("Eliminação semirrápida") prompt
 * @return {undefined}
 */
fastb.Prompt.prototype.ESR = function () {
	var key, defaultJustifications, templateCode, warning, $subjectSelect,
		buttons = {};

	defaultJustifications = window.fastButtons.defaultJustificationsESR;

	buttons[ fastb.message( 'fastb-OK' ) ] = function () {
		warning = $( '#fastb-ESR-sendWarning' ).prop( 'checked' );
		$subjectSelect = $( '#fastb-ESR-subject-select' );

		if ( fastb.forceFill( $( '#fastb-ESR-matrad-language' ), $( '#fastb-ESR-matrad-language' ).is( ':visible' ) && $( '#fastb-ESR-matrad-language' ).val() === '' )
			&& fastb.forceFill( $( '#fastb-ESR-justification-field' ), $subjectSelect.is( ':visible' ) && $( '#fastb-ESR-justification-field' ).val() === '' )
		) {
			if ( fastb.nsNum === 6 ) {
				templateCode = 'subst:ESR-arquivo|1=' + $( '#fastb-ESR-justification-field' ).val() + ' \~\~\~~';
			} else if ( $( '#fastb-ESR-matrad' ).prop( 'checked' ) ) {
				templateCode = 'subst:ESR-matrad|1=' + $( '#fastb-ESR-justification-field' ).val() + ' \~\~\~~|língua=' + $( '#fastb-ESR-matrad-language' ).val().toLowerCase();
			} else if ( !!$subjectSelect.val().split( ';' )[ 1 ] ) {
				templateCode = 'subst:' + $subjectSelect.val().split( ';' )[ 1 ] + '|1=' + '\~\~\~~' + '|2=' + $( '#fastb-ESR-justification-field' ).val();
			} else {
				templateCode = 'subst:ESR|1=' + $( '#fastb-ESR-justification-field' ).val() + ' \~\~\~~'
					+ ( $subjectSelect.val() !== fastb.message( 'fastb-dialog-ESR-other' ) ? '|assunto=' + $subjectSelect.val() : '' );
			}

			$( this ).dialog( 'close' );
			fastb.run( templateCode ).done( function () {
				if ( warning ) {
					fastb.Warn.queue++;
					fastb.sendWarning( 'elimination', 'ESR' );
				} else {
					fastb.refreshPage();
				}
			} );
		}
	};

	buttons[ fastb.message( 'fastb-cancel' ) ] = function () {
		$( this ).dialog( 'close' );
	};

	fastb.dialog( {
		title: fastb.message( 'fastb-dialog-ESR-title-2' ),
		width: 'auto',
		height: 'auto',
		content: '<div id="fastb-ESR">'
				+ '<label for="fastb-ESR-matrad" class="fastb-labelInline">'
					+ '<input id="fastb-ESR-matrad" type="checkbox" /> ' + fastb.message( 'fastb-dialog-ESR-badTranslation' )
				+ '</label>'
				+ '<label for="fastb-ESR-sendWarning">'
					+ '<input type="checkbox" id="fastb-ESR-sendWarning" /> ' + fastb.message( 'fastb-dialog-ESR-sendWarning' )
				+ '</label>'
				+ '<label for="fastb-ESR-subject">' + fastb.message( 'fastb-dialog-ESR-subject' ) + ':<br />'
					+ '<select id="fastb-ESR-subject-select">'
						+ '<option>' + fastb.message( 'fastb-dialog-ESR-other' ) + '</option>'
					+ '</select>'
				+ '</label>'
				+ '<label for="fastb-ESR-matrad-language">' + fastb.message( 'fastb-dialog-ESR-language' ) + ': '
					+ '<input type="text" maxlength="2" size="2" id="fastb-ESR-matrad-language" />'
				+ '</label>'
				+ '<label for="fastb-ESR-justification-field"><span id="fastb-ESR-justification-field-justify">' + fastb.message( 'fastb-dialog-ESR-reason' ) + '</span>:<br />'
					+ '<textarea id="fastb-ESR-justification-field" placeholder="' + fastb.message( 'fastb-dialog-placeholderDefault' ) + '"></textarea>'
				+ '</label>'
			+ '</div>',
		buttons: buttons
	} );

	// In files domain, disabled all it'sn't necessary
	if ( fastb.nsNum === 6 ) {
		$( '#fastb-ESR-matrad' ).prop( 'disabled', true );
		$( '#fastb-ESR-subject-select' ).prop( 'disabled', true );
		$( '#fastb-ESR label[for="fastb-ESR-matrad"]' ).css( 'color', 'gray' );
		$( '#fastb-ESR label[for="fastb-ESR-subject"]' ).css( 'color', 'gray' );
	}

	$( '#fastb-ESR label[for="fastb-ESR-matrad-language"]' ).hide();

	for ( key in defaultJustifications ) {
		if ( defaultJustifications[ key ] ) {
			$( '#fastb-ESR-subject-select' ).append(
				'<option value="' + key + ( defaultJustifications[ key ] instanceof Array ? ( ';' + defaultJustifications[ key ][ 1 ] ) : '' ) + '">' + key + '</option>'
			);
		}
	}

	$( '#fastb-ESR-subject-select' ).change( function () {
		if ( defaultJustifications[ $( this ).val().split( ';' )[ 0 ] ] ) {
			key =  $( this ).val().split( ';' )[ 0 ];

			$( '#fastb-ESR-justification-field' ).val( defaultJustifications[ key ] instanceof Array
				? defaultJustifications[ key ][ 0 ]
				: defaultJustifications[ key ]
			);
		}
	} );

	$( '#fastb-ESR-matrad' ).click( function () {
		if ( $( this ).prop( 'checked' ) ) {
			$( '#fastb-ESR label[for="fastb-ESR-matrad-language"]' ).fadeIn( 'slow' );
			$( '#fastb-ESR label[for="fastb-ESR-subject"]' ).hide();
			$( '#fastb-ESR-justification-field-justify' ).text( fastb.message( 'fastb-dialog-ESR-addComent' ) );
			$( '#fastb-ESR-justification-field' ).val( '' );
		} else {
			$( '#fastb-ESR label[for="fastb-ESR-subject"]' ).fadeIn( 'slow' );
			$( '#fastb-ESR label[for="fastb-ESR-matrad-language"]' ).hide();
			$( '#fastb-ESR-justification-field-justify' ).text( fastb.message( 'fastb-dialog-ESR-reason' ) );
		}

		$( '#fastb-ESR-matrad-language' ).removeClass( 'fastb-fillField' );
		$( '#fastb-ESR-justification-field' ).removeClass( 'fastb-fillField' );
	} );
};

/**
 * PE ("Páginas para eliminar") prompt
 * @return {undefined}
 */
fastb.Prompt.prototype.PE = function () {
	var $justification, warning, createPE, count,
		buttons = {},
		createPECallback = function ( verifyPE ) {
			if ( verifyPE ) {
				fastb.callAPI( 'requestDeletion', true ).done( function ( exists ) {
					if ( !!exists ) {
						archivePE();
					} else {
						createPECallback();
					}
				} );

				return;
			}

			fastb.notify( fastb.message( 'fastb-notify-creatingEliminationPage' ) );
			fastb.editPage( {
				getText: 'Template:Página para eliminar',
				title: 'Wikipédia:Páginas_para_eliminar/' + fastb.pageName,
				text: function ( value ) {
					return value
						.replace( /<\/?includeonly>/g, '' )
						.replace( /<!--(.|\n)+canceladas -->/, $justification )
						.replace( /\n?<noinclude>(.|\n)+<\/noinclude>\n?/, '' );
				},
				summary: fastb.message( 'fastb-summary-creatingEliminationPage' ),
				done: function () {
					fastb.refreshPage();
				}
			} );
		},
		archivePE = function () {
			var page;

			if ( !count ) {
				fastb.notify( fastb.message( 'fastb-notify-archivingPE' ) );
				count = 1;
			}

			page = 'Wikipédia:Páginas para eliminar/' + fastb.pageName + '/' + count++;

			api.getCurrentPageText( page ).done( function ( value ) {
				if ( value === undefined ) {
					api.post( {
						action: 'move',
						from: page.replace( /\/\d*$/, '' ),
						to: page,
						reason: fastb.message( 'fastb-summary-archivingPE' ),
						token: mw.user.tokens.get( 'csrfToken' ),
						tags: 'fast-buttons'
					} ).done( function () {
						createPECallback();
					} );
				} else {
					archivePE( count );
				}
			} );
		},
		doAction = function () {
			if ( warning ) {
				fastb.Warn.queue++;
				fastb.sendWarning( 'elimination', 'subst:apagar' ).done( function () {
					if ( createPE ) {
						createPECallback( true );
					} else {
						fastb.refreshPage();
					}
				} );
			} else if ( createPE ) {
				createPECallback( true );
			} else {
				fastb.refreshPage();
			}
		};

	buttons[ fastb.message( 'fastb-OK' ) ] = function () {
		warning = $( '#fastb-PE-sendWarning' ).prop( 'checked' );
		createPE = $( '#fastb-PE-createPE' ).prop( 'checked' );
		$justification = $( '#fastb-PE-createPE-justification' );

		if ( !fastb.forceFill( $justification, createPE && $justification.val() === '' ) ) {
			return;
		}

		$justification = $justification.val();

		$( this ).dialog( 'close' );
		fastb.run( 'subst:apagar', '', fastb.message( 'fastb-summary-elimination' ) ).done( function () {
			doAction();
		} );
	};

	buttons[ fastb.message( 'fastb-cancel' ) ] = function () {
		$( this ).dialog( 'close' );
	};

	fastb.dialog( {
		title: fastb.message( 'fastb-dialog-PE-title' ),
		width: 'auto',
		height: 'auto',
		content: '<div id="fastb-PE">'
				+ '<label for="fastb-PE-sendWarning">'
					+ '<input type="checkbox" id="fastb-PE-sendWarning" /> ' + fastb.message( 'fastb-dialog-PE-sendWarning' )
				+ '</label>'
				+ '<label for="fastb-PE-createPE">'
					+ '<input type="checkbox" id="fastb-PE-createPE" /> ' + fastb.message( 'fastb-dialog-PE-create' )
				+ '</label>'
				+ '<textarea id="fastb-PE-createPE-justification" placeholder="' + fastb.message( 'fastb-dialog-PE-reason' ) + '"></textarea>'
			+ '</div>',
		buttons: buttons
	} );

	$( '#fastb-PE-createPE' ).click( function () {
		$justification = $( '#fastb-PE-createPE-justification' );

		if ( !$justification.is( ':visible' ) ) {
			$justification.show( 'fast' );
		} else {
			$( '#fastb-PE-createPE-warning' ).hide();
			$justification.hide( 'fast' ).removeClass( 'fastb-fillField' ).val( '' );
		}
	} );
};

/**
 * Prompt to the tag "Em manutenção"
 * @return {undefined}
 */
fastb.Prompt.prototype.maintenance = function () {
	var $justification,
		button = {};

	button[ fastb.message( 'fastb-OK' ) ] = function () {
		$justification = $( '#fastb-maintenance-justification-field' );

		if ( fastb.forceFill( $justification ) ) {
			$( this ).dialog( 'close' );
			fastb.notify( fastb.message( 'fastb-notify-editingSomePage', 'Wikipédia:Páginas precisando de manutenção' ) );
			fastb.editPage( {
				title: 'Wikipédia:Páginas precisando de manutenção',
				section: 'new',
				sectiontitle: '[[' + fastb.pageName.replace( /_/g, ' ' ) + ']]',
				summary: fastb.message( 'fastb-summary-maintenance', fastb.pageName.replace( /_/g, ' '  ) ),
				text: $justification.val() + ' \~\~\~~',
				done: function () {
					if ( !( --fastb.Warn.queue ) ) {
						fastb.refreshPage();
					}
				}
			} );
		}
	};

	fastb.dialog( {
		width: 380,
		content: '<div id="fastb-maintenance-justification">'
				+ '<label for="fastb-maintenance-justification-field">' + fastb.message( 'fastb-dialog-pageSituation' ) + ':<br />'
					+ '<textarea id="fastb-maintenance-justification-field" placeholder="' + fastb.message( 'fastb-dialog-placeholderDefault' ) + '"></textarea>'
				+ '</label>'
			+ '</div>',
		buttons: button
	} );
};

/**
 * Prompt to requests for the pages
 * @param {Object} data Data of request type
 * @return {undefined}
 */
fastb.Prompt.prototype.requests = function ( data ) {
	var $justification, $historyPageExtra, $target, callback, targetPage,
		buttons = {},
		pageName = fastb.pageName.replace( /_/g, ' ' ),
		isUserPage = mw.config.get( 'wgCanonicalSpecialPageName' ) === 'Contributions' || fastb.nsNum === 2 || fastb.nsNum === 3;

	callback = function ( value ) {
		if ( !value ) {
			value = '';
		} else {
			value = value.replace( /<\/?includeonly>/g, '' );
		}

		$target.val( $target.val().trim() );

		if ( data.text === 'Histórico' ) {
			value = value
				.replace( /Página 1/i, $target.val() )
				.replace( /Página 2/i, $historyPageExtra.val() )
				.replace( /Razão/i, $justification.val() );
		} else if ( data.text !== 'Outro' ) {
			value = value
				.replace( /(Nome( ou IP)?|página|Exemplo)/i, $target.val() )
				.replace( /Razão/i, $justification.val() );
		} else {
			value = '== ' + $target.val() + ' ==\n' + $justification.val() + ' \~\~\~~';
		}

		fastb.notify( fastb.message( 'fastb-notify-editingPage' ) );
		fastb.editPage( {
			title: data.page,
			summary: fastb.message( 'fastb-summary-newRequest' ),
			appendtext: '\n' + value,
			done: function () {
				fastb.refreshPage( 'edit', data.page + '#' + $target.val() + ( data.text === 'Histórico' ? ' e ' + $historyPageExtra.val() : '' ) );
			}
		} );
	};

	buttons[ fastb.message( 'fastb-OK' ) ] = function () {
		$justification = $( '#fastb-requests-justification' );
		$historyPageExtra = $( '#fastb-requests-historyPageExtra' );
		$target = $( '#fastb-requests-page' );

		fastb.forceFill( $target );
		fastb.forceFill( $historyPageExtra );
		fastb.forceFill( $justification );

		if ( $( '#fastb-requests *' ).hasClass( 'fastb-fillField' ) ) {
			return;
		}

		fastb.notify( fastb.message( 'fastb-notify-getPageContent' ) );

		if ( data.text !== 'Outro' ) {
			api.getCurrentPageText( data.page + '/Padrão' ).done( function ( value ) {
				callback( value );
			} );
		} else {
			callback();
		}

		$( this ).dialog( 'close' );
	};

	buttons[ fastb.message( 'fastb-cancel' ) ] = function () {
		$( this ).dialog( 'close' );
	};

	fastb.dialog( {
		width: 'auto',
		height: 'auto',
		title: data.text,
		content:
			'<div id="fastb-requests">'
				+ '<label>'
					+ fastb.message( 'fastb-dialog-requests-' + ( $.inArray( data.text, [ 'Incidente', 'Nome impróprio', 'Vandalismo' ] ) !== -1
						? 'user'
						: 'page'
					) ) + ': <input type="text" id="fastb-requests-page" size="50" />'
				+ '</label>'
				+ ( ( data.text === 'Histórico' ) ? '<label>' + fastb.message( 'fastb-dialog-requests-historyPageExtra' ) + ': <input type="text" id="fastb-requests-historyPageExtra" size="50" /></label>' : '' ) + ( data.text !== 'Nome impróprio'
					? '<label for="fastb-requests-justification">' + fastb.message( 'fastb-dialog-requests-argumentation' ) + ':<br />'
						+ '<textarea id="fastb-requests-justification" placeholder="' + data.placeholder + ' ' + fastb.message( 'fastb-dialog-requests-dontSign' ) + '"></textarea>'
						+ '</label>'
					: ''
				)
			+ '</div>',
		buttons: buttons
	} );

	if ( isUserPage && fastb.userName !== mw.config.get( 'wgUserName' ) && $.inArray( data.text, [ 'Incidente', 'Nome impróprio', 'Vandalismo' ] ) !== -1 ) {
		targetPage = fastb.userName.replace( /_/g, ' ' );
	} else if ( fastb.nsNum !== -1 && $.inArray( data.text, [ 'Incidente', 'Nome impróprio', 'Vandalismo', 'Outro' ] ) === -1 && mw.config.get( 'wgCanonicalSpecialPageName' ) !== 'Contributions' ) {
		targetPage = pageName;
	}

	$( '#fastb-requests-page' ).val( targetPage );
};

/**
 * Prompt to merging pages
 * @return {undefined}
 */
fastb.Prompt.prototype.merging = function () {
	var $mergingPage1, $mergingPage2, template,
		buttons = {};

	buttons[ fastb.message( 'fastb-OK' ) ] = function () {
		$mergingPage1 = $( '#fastb-merging-page1' );
		$mergingPage2 = $( '#fastb-merging-page2' );

		if ( !fastb.forceFill( $mergingPage1 ) || !fastb.forceFill( $mergingPage2 ) ) {
			return;
		}

		fastb.editPage( {
			title: $mergingPage1.val(),
			summary: fastb.message( 'fastb-summary-addMergingPropose' ),
			text: function ( value ) {
				template = '\{\{subst:f-de|' + $mergingPage2.val() + '}}';
				template = ( fastb.nsNum === 10 ? '<noinclude>' + template + '</noinclude>' : template ) + '\n' + value;

				return template;
			},
			done: function () {
				fastb.editPage( {
					title: $mergingPage2.val(),
					summary: fastb.message( 'fastb-summary-addMergingPropose' ),
					text: function ( value ) {
						template = '\{\{subst:f-com|' + $mergingPage1.val() + '}}';
						template = ( fastb.nsNum === 10 ? '<noinclude>' + template + '</noinclude>' : template ) + '\n' + value;

						return template;
					},
					done: function () {
						fastb.refreshPage();
					}
				} );
			}
		} );

		$( this ).dialog( 'close' );
	};

	buttons[ fastb.message( 'fastb-cancel' ) ] = function () {
		$( this ).dialog( 'close' );
	};

	fastb.dialog( {
		width: 'auto',
		height: 'auto',
		title: fastb.message( 'fastb-dialog-merging-title' ),
		content: '<div id="fastb-merging">'
				+ '<label>'
					+ fastb.message( 'fastb-dialog-merging-page1' ) + ': <input type="text" id="fastb-merging-page1" />'
				+ '</label>'
				+ '<label>'
					+ fastb.message( 'fastb-dialog-merging-page2' ) + ': <input type="text" id="fastb-merging-page2" />'
				+ '</label>'
			+ '</div>',
		buttons: buttons
	} );

	$( '#fastb-merging-page1' ).val( fastb.pageName.replace( /_/g, ' ' ) );
};

window.fastButtons = new FastButtons();

if ( mw.util.getParamValue( 'printable' ) !== 'yes' ) {
	$.getScript( '//pt.wikipedia.org/w/index.php?title=MediaWiki:Gadget-fastbuttons.js/buttonsList.js&action=raw&ctype=text/javascript' ).done( function () {
		fastb.buttons = window.fastButtons.buttons;

		// Executes the gadget when document is ready
		$( fastb.init );
	} );
}

}() );
