this["JST"] = this["JST"] || {};

this["JST"]["private/templates/canvas.ejs"] = function(data) {
var __t, __p = '', __e = _.escape;
__p += '';
return __p
};

this["JST"]["private/templates/header.ejs"] = function(data) {
var __t, __p = '', __e = _.escape;
__p += '<div class=\'pure-menu pure-menu-open pure-menu-horizontal\'>\r\n\t<ul>\r\n\t\t<li class=\'pull-left map-toggle map-edit\'>\r\n\t\t\t<a href=\'javascript:;\'>\r\n\t\t\t\t<i class=\'fa fa-pencil\'></i> Edit Map\r\n\t\t\t</a>\r\n\t\t</li>\r\n\t\t<li class=\'pull-left map-toggle map-set\'>\r\n\t\t\t<a href=\'javascript:;\'>\r\n\t\t\t\t<i class=\'fa fa-save\'></i> Set Map\r\n\t\t\t</a>\r\n\t\t</li>\r\n\t\t<li class=\'pull-left map-locate map-locate-gps\'>\r\n\t\t\t<a href=\'javascript:;\'>\r\n\t\t\t\t<i class=\'fa fa-crosshairs\'></i>\r\n\t\t\t</a>\r\n\t\t</li>\r\n\t\t<li class=\'pull-left map-locate map-locate-default\'>\r\n\t\t\t<a href=\'javascript:;\'>\r\n\t\t\t\t<i class=\'fa fa-dot-circle-o\'></i>\r\n\t\t\t</a>\r\n\t\t</li>\r\n\t\t<li class=\'pull-left map-rotate map-rotate-l\'>\r\n\t\t\t<a href=\'javascript:;\'>\r\n\t\t\t\t<i class=\'fa fa-rotate-left\'></i>\r\n\t\t\t</a>\r\n\t\t</li>\r\n\t\t<li class=\'pull-left map-rotate map-rotate-r\'>\r\n\t\t\t<a href=\'javascript:;\'>\r\n\t\t\t\t<i class=\'fa fa-rotate-right\'></i>\r\n\t\t\t</a>\r\n\t\t</li>\r\n\t\t<li class=\'pull-right canvas-clear\'>\r\n\t\t\t<a href=\'javascript:;\'>\r\n\t\t\t\t<i class=\'fa fa-eraser\'></i> Clear\r\n\t\t\t</a>\r\n\t\t</li>\r\n\t</ul>\r\n</div>\r\n';
return __p
};

this["JST"]["private/templates/map.ejs"] = function(data) {
var __t, __p = '', __e = _.escape;
__p += '\n';
return __p
};

this["JST"]["private/templates/playerItemEdit.ejs"] = function(data) {
var __t, __p = '', __e = _.escape;
__p += '<fieldset class=\'pure-group\'>\r\n\t<input type=\'number\' class=\'number pure-input-1\' name=\'player[number]\' id=\'player_number\' value=\'' +
__e( data.number ) +
'\' />\r\n\t<input type=\'text\' class=\'name pure-input-1\' name=\'player[name]\' id=\'player_name\' value=\'' +
__e( data.name ) +
'\' />\r\n</fieldset>\r\n<fieldset class=\'pure-group\'>\r\n\t<a href=\'javascript:;\' class=\'pure-button button-secondary player-queue\'>\r\n\t\t<i class=\'fa fa-save\'></i> Save\r\n\t</a>\r\n</fieldset>\r\n<fieldset class=\'pure-group\'>\r\n\t<a href=\'javascript:;\' class=\'pure-button button-warning player-destroy\'>\r\n\t\t<i class=\'fa fa-trash-o\'></i> Remove\r\n</a>\r\n</fieldset>\r\n';
return __p
};

this["JST"]["private/templates/playerItemMarkerView.ejs"] = function(data) {
var __t, __p = '', __e = _.escape;
__p += '<span class=\'number\'>' +
__e( data.number ) +
'</span>\r\n';
return __p
};

this["JST"]["private/templates/playerItemView.ejs"] = function(data) {
var __t, __p = '', __e = _.escape;
__p += '<span class=\'number\'>' +
__e( data.number ) +
'</span>\r\n<span class=\'name\'>' +
__e( data.name ) +
'</span>\r\n';
return __p
};

this["JST"]["private/templates/playerListCompositeView.ejs"] = function(data) {
var __t, __p = '', __e = _.escape;
__p += '<a href="javascript:;" class="pure-button button-success player-add">\r\n\t<i class="fa fa-plus"></i> Player\r\n</a>\r\n<ul class=\'players clearfix\'></ul>\r\n';
return __p
};