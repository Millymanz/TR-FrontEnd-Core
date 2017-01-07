define(['vendor/dust'], function (dust){ 
//
// Source file: [c:\Dev\UI\assets\javascripts\app\template\accordion-component-template.dust]
// Template name: [accordion-component-template]
//
(function(){dust.register("accordion-component-template",body_0);function body_0(chk,ctx){return chk.exists(ctx.get(["label"], false),ctx,{"block":body_1},{}).write("<div  id=\"accordion\">").section(ctx.get(["panels"], false),ctx,{"block":body_2},{}).write("</div>");}function body_1(chk,ctx){return chk.write("<h4>").reference(ctx.get(["label"], false),ctx,"h").write("</h4> ");}function body_2(chk,ctx){return chk.write("<h3><a href=\"javascript:;\">").reference(ctx.get(["label"], false),ctx,"h").write("</a></h3><div class=\"accordion-content\">").reference(ctx.get(["view"], false),ctx,"h",["s"]).write("</div>");}return body_0;})();
//
// Source file: [c:\Dev\UI\assets\javascripts\app\template\another-example.dust]
// Template name: [another-example]
//
(function(){dust.register("another-example",body_0);function body_0(chk,ctx){return chk.write("And this is coming from another ").reference(ctx.get(["name"], false),ctx,"h").write(" template that is concatenated into a single template file with the others.");}return body_0;})();
//
// Source file: [c:\Dev\UI\assets\javascripts\app\template\continues-result-item-template.dust]
// Template name: [continues-result-item-template]
//
(function(){dust.register("continues-result-item-template",body_0);function body_0(chk,ctx){return chk.write("<div id=").reference(ctx.get(["QueryID"], false),ctx,"h").write(" ").exists(ctx.get(["selected"], false),ctx,{"block":body_1},{}).write(" ><div class=\"pull-right\"><a href=\"javascript:;\" class=\"btn btn-xs btn-info\">view</a></div><div class=\"blobhead\"><div class=\"list-group-item-heading\"><table class=\"resultHeaderTable\"><tr><td colspan=\"4\"><h4>").reference(ctx.get(["Query"], false),ctx,"h").write("</h4></td></tr><tr><td><div class=\"resultIcon\">").section(ctx.get(["ImageCollection"], false),ctx,{"block":body_2},{}).write("</div></td><td><div class=\"resultSymbol\">").reference(ctx.get(["Source"], false),ctx,"h").write("</div></td><td><div class=\"resultSymbol\">").reference(ctx.get(["SymbolID"], false),ctx,"h").write("</div></td><td><div class=\"resultStartDateTime\">").reference(ctx.get(["StartDateTime"], false),ctx,"h").write("</div></td></tr><tr><td><div class=\"resultTimeFrame\">").reference(ctx.get(["TimeFrame"], false),ctx,"h").write("</div></td><td><div class=\"resultSymbol\"></div></td><td colspan=\"4\"><div class=\"resultEndDateTime\">").reference(ctx.get(["EndDateTime"], false),ctx,"h").write("</div></td></tr></table></div></div><div class=\"list-group-item-text resultFieldsTable\" style=\"display:none\"><table class=\"table\"><tbody>").section(ctx.get(["KeyResultField"], false),ctx,{"block":body_3},{}).write("</tbody></table></div></div>");}function body_1(chk,ctx){return chk.write("class=\"active\"");}function body_2(chk,ctx){return chk.write("<img src=").reference(ctx.getPath(true, []),ctx,"h").write("  />");}function body_3(chk,ctx){return chk.write("<tr><td>").reference(ctx.getPath(true, ["0"]),ctx,"h").write(":</td><td>").reference(ctx.getPath(true, ["1"]),ctx,"h").write("</td></tr>");}return body_0;})();
//
// Source file: [c:\Dev\UI\assets\javascripts\app\template\example.dust]
// Template name: [example]
//
(function(){dust.register("example",body_0);function body_0(chk,ctx){return chk.write("<div class=\"template\">This is coming from a ").reference(ctx.get(["name"], false),ctx,"h").write(" template</div>").partial("example_partial",ctx,{}).write("<div class=\"styled\">And it has all been styled (poorly) using ").reference(ctx.get(["css"], false),ctx,"h").write("</div>");}return body_0;})();
//
// Source file: [c:\Dev\UI\assets\javascripts\app\template\following-query-template.dust]
// Template name: [following-query-template]
//
(function(){dust.register("following-query-template",body_0);function body_0(chk,ctx){return chk.write("<div class=\"savedQuery\" data-id=\"").reference(ctx.get(["QueryID"], false),ctx,"h").write("\"><div class=\"blobhead\"><div class=\"blobuser\"><div class=\"sideBarViewQuery pull-right\"><button class=\"btn  btn-xs action-view btn-info\">View</button><button class=\"btn btn-xs btn-warning action-unsave\" data-query-id=\"").reference(ctx.get(["QueryID"], false),ctx,"h").write("\"><span class=\"glyphicon glyphicon-trash\"></span></button></div></div></div><div class=\"blobcontent\"><div class=\"pull-left text text-success\"><span class=\"glyphicon glyphicon-check\"></span></div><div class=\"query-text\">").reference(ctx.get(["Query"], false),ctx,"h").write("</div></div></div>");}return body_0;})();
//
// Source file: [c:\Dev\UI\assets\javascripts\app\template\footer.dust]
// Template name: [footer]
//
(function(){dust.register("footer",body_0);function body_0(chk,ctx){return chk.write("<footer><p>Some information</p></footer>");}return body_0;})();
//
// Source file: [c:\Dev\UI\assets\javascripts\app\template\header-template.dust]
// Template name: [header-template]
//
(function(){dust.register("header-template",body_0);function body_0(chk,ctx){return chk.write(" <nav class=\"navbar navbar-default navbar-fixed-top trade-riser-header\"><div class=\"container-fluid\"><div class=\"navbar-header\"><button type=\"button\" class=\"navbar-toggle collapsed\" data-toggle=\"collapse\" data-target=\"#navbar\" aria-expanded=\"false\" aria-controls=\"navbar\"><span class=\"sr-only\">Toggle navigation</span><span class=\"icon-bar\"></span><span class=\"icon-bar\"></span><span class=\"icon-bar\"></span></button><a class=\"navbar-brand trade-riser-logo\" href=\"#\"><img src=\"/imgs/Trade-Riser.png\"></a></div><div class=\"header-search col-sm-10 col-md-10\"><div class=\"navbar-form\" role=\"search\"><div class=\"search-box\"><div class=\"input-group \"><input type=\"text\" class=\"form-control searchTextBox\" placeholder=\"Search\" name=\"q\"><div class=\"input-group-btn\"><button class=\"btn btn-default submit-query\" type=\"submit\"><i class=\"glyphicon glyphicon-search\"></i></button></div></div></div></div></div><div id=\"navbar\" class=\"collapse navbar-collapse\"><ul class=\"nav navbar-nav navbar-right\"><li class=\"dropdown\"><a href=\"#\" class=\"dropdown-toggle\" data-toggle=\"dropdown\" role=\"button\" aria-haspopup=\"true\" aria-expanded=\"false\"><span class=\"glyphicon glyphicon-menu-hamburger\"></span></a><ul class=\"dropdown-menu\"><li><a href=\"#\">Action</a></li><li><a href=\"#\">Another action</a></li><li><a href=\"#\">Something else here</a></li><li role=\"separator\" class=\"divider\"></li><li class=\"dropdown-header\">Nav header</li><li><a href=\"#\">Separated link</a></li><li><a href=\"#\">One more separated link</a></li></ul></li></ul></div><!--/.nav-collapse --></div></nav>");}return body_0;})();
//
// Source file: [c:\Dev\UI\assets\javascripts\app\template\historic-query-template.dust]
// Template name: [historic-query-template]
//
(function(){dust.register("historic-query-template",body_0);function body_0(chk,ctx){return chk.write("<div class=\"historicQuery\" data-bind=\"attr: {id: QueryID }\"><div class=\"blobhead\"><div class=\"blobuser\"><div class=\"sideBarViewQuery\" data-bind=\"click: function(Query) {$root.updateMainQuery(Query); }\">View</div><div class=\"btnFollow\" data-bind=\"click: function(QueryID) {$root.saveQuery(QueryID); }\">Save</div><div class=\"btnFollow\" data-bind=\"click: function(QueryID) {$root.followQuery(QueryID); }\">Follow+</div></div></div><div class=\"blobcontent\"><div style=\"font-size: 14px; color: #494747; margin: 0px; padding: 0px; text-shadow:1px 1px 0px rgba(255,255,255,0.55);\" data-bind=\"text: Query\"></div></div></div>");}return body_0;})();
//
// Source file: [c:\Dev\UI\assets\javascripts\app\template\homepage-layout.dust]
// Template name: [homepage-layout]
//
(function(){dust.register("homepage-layout",body_0);function body_0(chk,ctx){return chk.write("<div class=\"container-fluid\"> <div class=\"jumbotron search-container col-md-8 col-md-offset-2 col-sm-8 col-sm-offset-2\"><h4>Enter what you want to <b>calculate</b> or <b>know about</b> the Forex Markets:</h4>        <div class=\"search-box\"></div><div class=\"search-meta\"><div class=\"pull-right\"><ul class=\"nav nav-menu search-menu-list\"><li><a href=\"javascript:;\"><i class=\"fa fa-asterisk\"></i> Example Queries</a></li><li><a href=\"javascript:;\"><i class=\"fa fa-bookmark-o\"></i> Saved Queries</a></li></ul>   </div></div></div></div>");}return body_0;})();
//
// Source file: [c:\Dev\UI\assets\javascripts\app\template\login-page-template.dust]
// Template name: [login-page-template]
//
(function(){dust.register("login-page-template",body_0);function body_0(chk,ctx){return chk.write("<div class=\"container\"><form class=\"form-signin\" id=\"login-form\"><img src=\"/imgs/Trade-Riser.png\" class=\"company-logo\"><h4 class=\"form-signin-heading text-center\">Please Login</h4><div class=\"alert alert-danger login-status\" style=\"display:none;\"></div><label for=\"inputEmail\" class=\"sr-only\">Username</label><input type=\"email\" name=\"login-username-input\" id=\"login-username-input\" class=\"form-control\" placeholder=\"E-mail\" required autofocus><label for=\"inputPassword\" class=\"sr-only\">Password</label><input type=\"password\" name=\"login-password-input\" id=\"login-password-input\" class=\"form-control\" placeholder=\"Password\" required><div class=\"checkbox\"><label><input type=\"checkbox\" name=\"remember-me\" value=\"remember-me\" id=\"remember-me\"> Remember me</label></div><button class=\"btn btn-lg btn-primary btn-block\" id=\"login-btn\" type=\"submit\">Sign in</button></form></div> <!-- /container -->");}return body_0;})();
//
// Source file: [c:\Dev\UI\assets\javascripts\app\template\page-layout-template.dust]
// Template name: [page-layout-template]
//
(function(){dust.register("page-layout-template",body_0);function body_0(chk,ctx){return chk.write("<div class=\"ui-layout-center\">Center</div><div class=\"ui-layout-north\">North</div><div class=\"ui-layout-south\">South</div><div class=\"ui-layout-east\">East</div><div class=\"ui-layout-west\">West</div>");}return body_0;})();
//
// Source file: [c:\Dev\UI\assets\javascripts\app\template\query-item-template.dust]
// Template name: [query-item-template]
//
(function(){dust.register("query-item-template",body_0);function body_0(chk,ctx){return chk.write("<a data-id=").reference(ctx.get(["QueryID"], false),ctx,"h").write(" href=\"#\" >").reference(ctx.get(["Query"], false),ctx,"h").write("</a>");}return body_0;})();
//
// Source file: [c:\Dev\UI\assets\javascripts\app\template\result-card-item-template.dust]
// Template name: [result-card-item-template]
//
(function(){dust.register("result-card-item-template",body_0);function body_0(chk,ctx){return chk.write("<div id=").reference(ctx.get(["QueryID"], false),ctx,"h").write(" ").exists(ctx.get(["selected"], false),ctx,{"block":body_1},{}).write("><table class=\"resultHeaderTable\"><tr><td><div class=\"resultIcon\">").section(ctx.get(["ImageCollection"], false),ctx,{"block":body_2},{}).write("</div></td><td><div class=\"resultSymbol\">").reference(ctx.get(["Source"], false),ctx,"h").write("</div></td><td><div class=\"resultSymbol\">").reference(ctx.get(["SymbolID"], false),ctx,"h").write("</div></td><td><div class=\"resultStartDateTime\">").reference(ctx.get(["StartDateTime"], false),ctx,"h").write("</div></td></tr><tr><td><div class=\"resultTimeFrame\">").reference(ctx.get(["TimeFrame"], false),ctx,"h").write("</div></td><td><div class=\"resultSymbol\"></div></td><td colspan=\"4\"><div class=\"resultEndDateTime\">").reference(ctx.get(["EndDateTime"], false),ctx,"h").write("</div></td></tr></table></div></div><div class=\"list-group-item-text resultFieldsTable\" style=\"display:none\"><table class=\"table table-condensed\"><tbody>").section(ctx.get(["KeyResultField"], false),ctx,{"block":body_3},{}).write("</tbody></table><div class=\"blobhead\"><div class=\"pull-right\"><a class=\"btn btn-xs btn-info\" href=\"javascript:;\">view</a></button></div></div></div>");}function body_1(chk,ctx){return chk.write("class=\"active\"");}function body_2(chk,ctx){return chk.write("<img src=").reference(ctx.getPath(true, []),ctx,"h").write("  />");}function body_3(chk,ctx){return chk.write("<tr><td>").reference(ctx.getPath(true, ["0"]),ctx,"h").write(":</td><td>").reference(ctx.getPath(true, ["1"]),ctx,"h").write("</td></tr>");}return body_0;})();
//
// Source file: [c:\Dev\UI\assets\javascripts\app\template\saved-query-template.dust]
// Template name: [saved-query-template]
//
(function(){dust.register("saved-query-template",body_0);function body_0(chk,ctx){return chk.write("<div class=\"savedQuery\" data-id=\"").reference(ctx.get(["QueryID"], false),ctx,"h").write("\"><div class=\"blobhead\"><div class=\"blobuser\"><div class=\"sideBarViewQuery pull-right\"><button class=\"btn  btn-xs action-view btn-info\">View</button><button class=\"btn btn-xs btn-warning action-unsave\" data-query-id=\"").reference(ctx.get(["QueryID"], false),ctx,"h").write("\"><span class=\"glyphicon glyphicon-trash\"></span></button></div></div></div><div class=\"blobcontent\"><div class=\"pull-left text text-warning\"><span class=\"glyphicon glyphicon-star\"></span></div><div class=\"query-text\">").reference(ctx.get(["Query"], false),ctx,"h").write("</div></div></div>");}return body_0;})();
//
// Source file: [c:\Dev\UI\assets\javascripts\app\template\search-box-template.dust]
// Template name: [search-box-template]
//
(function(){dust.register("search-box-template",body_0);function body_0(chk,ctx){return chk.write("<form method=\"get\" action=\"#search/\"><div class=\"input-group\"><input type=\"text\" autocomplete=\"off\" class=\"form-control  search-text-box\" name=\"q\" value='").reference(ctx.get(["searchText"], false),ctx,"h").write("' placeholder=\"Enter your question\" aria-describedby=\"sizing-addon1\" required><span class=\"input-group-btn\"><button class=\"btn btn-default search-question-btn\"  type=\"button\"><span class=\"glyphicon glyphicon-search\"></span></button></span></div></form><div class=\"search-term-holder search-pop-out\" style=\"display:none\"><div class=\"repeat-search-type\"></div><hr><h5><i class=\"fa fa-life-ring\"></i> Search history</h5><div class=\"search-history\"><ul class=\"history-list\"></ul></div></div>");}return body_0;})();
//
// Source file: [c:\Dev\UI\assets\javascripts\app\template\search-page-template.dust]
// Template name: [search-page-template]
//
(function(){dust.register("search-page-template",body_0);function body_0(chk,ctx){return chk.write("<div class=\"ui-layout-west\"><div id=\"west-content\"><div class=\"loading-text text-muted\"> <p><i class=\"fa fa-cog fa-x2 fa-spin\"></i>...Loading </p></div></div></div><div class=\"ui-layout-center\"><div id=\"center-content\"><div class=\"loading-text text-muted\"> <p><i class=\"fa fa-cog fa-x2 fa-spin\"></i>...Loading </p></div></div></div><div class=\"ui-layout-east\"><div id=\"east-content\"><div class=\"loading-text text-muted\"> <p><i class=\"fa fa-cog fa-x2 fa-spin\"></i>...Loading </p></div></div></div>");}return body_0;})();
//
// Source file: [c:\Dev\UI\assets\javascripts\app\template\tabbed-component-template.dust]
// Template name: [tabbed-component-template]
//
(function(){dust.register("tabbed-component-template",body_0);function body_0(chk,ctx){return chk.exists(ctx.get(["label"], false),ctx,{"block":body_1},{}).write("<ul class=\"nav nav-tabs\" role=\"tablist\">").section(ctx.get(["tabs"], false),ctx,{"block":body_2},{}).write("</ul><!-- Tab panes --><div class=\"tab-content\">").section(ctx.get(["tabcontent"], false),ctx,{"block":body_4},{}).write("</div>");}function body_1(chk,ctx){return chk.write("<h4>").reference(ctx.get(["label"], false),ctx,"h").write("</h4> ");}function body_2(chk,ctx){return chk.write("<li role=\"presentation\" class=\"").exists(ctx.get(["active"], false),ctx,{"block":body_3},{}).write("\"><a href=\"#tab-content-").reference(ctx.get(["cid"], false),ctx,"h").write("\" aria-controls=\"").reference(ctx.get(["cid"], false),ctx,"h").write("\" role=\"tab\" data-toggle=\"tab\">").reference(ctx.get(["label"], false),ctx,"h").write("</a></li>");}function body_3(chk,ctx){return chk.write("active");}function body_4(chk,ctx){return chk.write("<div role=\"tabpanel\" class=\"tab-pane ").exists(ctx.get(["active"], false),ctx,{"block":body_5},{}).write("\" id=\"tab-content-").reference(ctx.get(["cid"], false),ctx,"h").write("\"></div>");}function body_5(chk,ctx){return chk.write("active");}return body_0;})();return dust; });