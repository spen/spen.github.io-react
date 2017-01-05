/**
 * External Dependencies
 */

// Needed for redux-saga es6 generator support
import 'babel-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { browserHistory, IndexRoute, Redirect, Route, Router } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import 'normalize.css';

/**
 * Internal Dependencies
 */
import App from 'containers/App';
import AboutPage from 'pages/About';
import BlogPage from 'pages/Blog';
import BlogPageContent from 'pages/Blog/Content';
import ContactPage from 'pages/Contact';
import ProjectsPage from 'pages/Projects';
import ProjectContent from 'pages/Projects/Content';
import configureStore from './store';

import 'assets/temp-styles.css';

const store = configureStore( {}, browserHistory );
const history = syncHistoryWithStore( browserHistory, store );

// TODO: Have modules define their own routes,
// this isn't the place for these actions.
function onBlogRootEnter() {
	store.dispatch( {
		type: 'BLOG_SET_DEFAULT_POST',
	} );
}

function onBlogPostEnter( routeData ) {
	store.dispatch( {
		type: 'BLOG_SET_ACTIVE_POST',
		slug: routeData.params.slug,
	} );
}

function onProjectsRootEnter() {
	store.dispatch( {
		type: 'PROJECTS_SET_DEFAULT',
	} );
}

function onProjectEnter( routeData ) {
	store.dispatch( {
		type: 'PROJECTS_SET_ACTIVE',
		slug: routeData.params.slug,
	} );
}

const originalTitle = document.title;
function resetTitle() {
	// Nasty little hack :/
	window.setTimeout( () => document.title = originalTitle, 0 );
}

const rootElement = document.getElementById( 'root' );

ReactDOM.render(
	<Provider store={ store }>
		<Router history={ history }>
			<Route path="/" component={ App } onEnter={ resetTitle }>
				<IndexRoute onEnter={ resetTitle } />
				<Route path="/about" component={ AboutPage } />
				<Route path="/blog" component={ BlogPage } >
					<IndexRoute component={ BlogPageContent } onEnter={ onBlogRootEnter } />
					<Route
						component={ BlogPageContent }
						path="/blog/:slug"
						onEnter={ onBlogPostEnter }
					/>
				</Route>
				<Route path="/contact" component={ ContactPage } />
				<Route path="/projects" component={ ProjectsPage } >
					<IndexRoute component={ ProjectContent } onEnter={ onProjectsRootEnter } />
					<Route
						component={ ProjectContent }
						path="/projects/:slug"
						onEnter={ onProjectEnter }
					/>
				</Route>
				<Redirect from="/portfolio" to="/projects" />
				<Redirect from="/portfolio/:slug" to="/projects/:slug" />
				<Route path="*" />
			</Route>
		</Router>
	</Provider>,
	rootElement
);
