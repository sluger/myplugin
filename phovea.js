/* *****************************************************************************
 * Caleydo - Visualization for Molecular Biology - http://caleydo.org
 * Copyright (c) The Caleydo Team. All rights reserved.
 * Licensed under the new BSD license, available at http://caleydo.org/license
 **************************************************************************** */

//register all extensions in the registry following the given pattern
module.exports = function(registry) {
  /// #if include('extension-type', 'extension-id')	
  //registry.push('extension-type', 'extension-id', function() { return import('./src/extension_impl'); }, {});
  /// #endif
  // generator-phovea:begin



  registry.push('tdpView', 'hello-world', function() { return import('./src/HelloWorldView'); }, {
  'name': 'Hello World',
  'idtype': '.*',
  'selection': 'some'
 });


  registry.push('tdpView', 'hello-ranking', function() { return import('./src/HelloRankingView'); }, {
  'name': 'Hello Ranking',
  'idtype': 'IDTypeA',
  'selection': 'some'
 });


  registry.push('tdpScore', 'myScore', function() { return import('./src/MyScore'); }, {
  'name': 'MyDB Score',
  'idtype': 'IDTypeB'
 });


  registry.push('tdpScoreImpl', 'myScore', function() { return import('./src/MyScore'); }, {
  'factory': 'new'
 });


  registry.push('dTilesSearchProvider', 'mydb', function() { return import('./src/MyDBSearchProvider'); }, {
  'name': 'My DB',
  'idType': 'MyIDType'
 });


  registry.push('tdpView', 'd3-view', function() { return import('./src/D3View'); }, {
  'name': 'Hello D3 View',
  'idtype': 'IDTypeA',
  'selection': 'some'
 });


  registry.push('tdpView', 'chartjs', function() { return import('./src/ChartJS'); }, {
  'name': 'Chart.js',
  'idtype': 'IDTypeA',
  'selection': 'some'
 });
  // generator-phovea:end
};

