/*!
 * FastButtons
 *
 * @author [[es:User:Racso]] (versão original do script, na Wikipédia em espanhol)
 * @author [[en:User:Macy]] (versão adaptada para a Wikipédia inglesa)
 * @author [[pt:User:Danilo.mac]]
 * @author Helder (https://github.com/he7d3r)
 * @author [[pt:User:!Silent]]
 * @source [[en:User:Macy/FastButtons.js]] ([[en:Special:PermaLink/230473471]])
 * @source [[es:Special:PrefixIndex/User:Racso/FB]]
 * @see [[MediaWiki:Gadget-fastbuttons.css]]
 * @see [[MediaWiki:Gadget-fastbuttons.js/buttonsList.js]]
 * @see [[MediaWiki:Gadget-fastbuttons.js/core.js]]
 * @help [[WP:Scripts/FastButtons]]
 */
/* global mw, $ */

( function () {
'use strict';

mw.messages.set( {
	'fastb-FastButtons': 'FastButtons',
	'fastb-showButton': 'exibir',
	'fastb-hideButton': 'esconder',
	'fastb-portletButton-title': 'Exibe/Esconde os botões do FastButtons'
} );

var portletLink = mw.util.addPortletLink(
	'p-cactions',
	'#',
	mw.message( 'fastb-FastButtons' ) + ' (' + mw.message( 'fastb-' + ( localStorage.getItem( 'fastb-hidden' ) === 'true' ? 'show' : 'hide' ) + 'Button' ) + ')',
	'ca-fastbHideButton',
	mw.message( 'fastb-portletButton-title' )
);

if ( localStorage.getItem( 'fastb-hidden' ) === 'true' ) {
	$( portletLink ).click( function( e ) {
		localStorage.setItem( 'fastb-hidden', false );
		mw.loader.load( 'ext.gadget.fastButtonsCore' );
		$( '#ca-fastbHideButton a' ).text(
			mw.message( 'fastb-FastButtons' ) + ' (' + mw.message( 'fastb-' + ( localStorage.getItem( 'fastb-hidden' ) === 'true' ? 'show' : 'hide' ) + 'Button' ) + ')'
		);
		$( this ).off( 'click' );
	} );
} else {
	mw.loader.load( 'ext.gadget.fastButtonsCore' );
}

}() );
