/*Copyright � PokeIn Library (Free Edition) v2.500 */(function (){function PokeIn(){};var pCall={};PokeIn.encMode=false;/*[%IPO%]*/PokeIn.SocketURL=null;PokeIn.Unique='1';PokeIn.clid='y20000402';/*clid*/ PokeIn.Socket=null;PokeIn.OnError=null;PokeIn.p5='a.PokeIn';PokeIn.p6='a.PokeIn';PokeIn.p10=new Date().getTime();PokeIn.IsConnected=false;var _ua=navigator.userAgent;PokeIn.isMozilla=/Firefox/i.test(_ua);PokeIn.ieVersion=0;PokeIn.isIE=/MSIE/i.test(_ua);if(PokeIn.isIE){PokeIn.isIE6=/MSIE 6/i.test(_ua);PokeIn.isIE8=/MSIE 8/i.test(_ua);PokeIn.isIE7=/MSIE 7/i.test(_ua);PokeIn.isIE9=/MSIE 9/i.test(_ua);PokeIn.isIE10=/MSIE 10/i.test(_ua);PokeIn.ieVersion=(PokeIn.isIE8) ? 8 : (PokeIn.isIE7) ? 7 : (PokeIn.isIE6) ? 6 : (PokeIn.isIE9) ? 9 : (PokeIn.isIE10) ? 10 : 0;}else{PokeIn.isAndroid=/Android/i.test(_ua);PokeIn.isIOS=/Mobile/i.test(_ua) && /Apple/i.test(_ua);PokeIn.isOpera=/Opera/i.test(_ua);PokeIn.isSafari=/Safari/i.test(_ua); };PokeIn.joinedTo="";PokeIn.sleepMode=false;PokeIn.LTimeout=90000;PokeIn.PageUnloading=false;PokeIn.ReConnCounter=0;PokeIn.Chunked=true && !PokeIn.isIE && !PokeIn.isOpera && !PokeIn.isAndroid && !PokeIn.sleepMode;PokeIn.MessageCount=0;PokeIn.CMode=PokeIn.Chunked?3:4;PokeIn.ListenActive=false; PokeIn.p9={ s: [], l: {}, sc: 0, sn: 0, ready: true, force_false: false };PokeIn.IsListenActive=function (){return PokeIn.ListenActive;};PokeIn.eco=function(_i){_i=escape(_i);var xo=[]; var q=0, ln=_i.length; do {var _c1=_i.charCodeAt(q++); var _e1=_c1 >> 2;xo.push(PokeIn._es_.charAt(_e1));var _c2=_i.charCodeAt(q++); var _e2=((_c1 & 3) << 4) | (_c2 >> 4);xo.push(PokeIn._es_.charAt(_e2));var _c3=_i.charCodeAt(q++);var _e3=((_c2 & 15) << 2) | (_c3 >> 6);var _e4; if (isNaN(_c2)){_e3=64; _e4=64;} else if (isNaN(_c3)){_e4=64;}else{_e4=_c3 & 63;};xo.push(PokeIn._es_.charAt(_e3));xo.push(PokeIn._es_.charAt(_e4)); }while (q < ln);return xo.join("");};PokeIn.dco=function(_i){var xo=[];if (PokeIn._rt.exec(_i)){return _i;};_i=_i.replace(PokeIn._rt, "");var q=0, ln=_i.length;do {var _e1=PokeIn._es_.indexOf(_i.charAt(q++));var _e2=PokeIn._es_.indexOf(_i.charAt(q++));var _cb=(_e1 << 2) | (_e2 >> 4);xo.push(String.fromCharCode(_cb));var _e3=PokeIn._es_.indexOf(_i.charAt(q++));if (_e3 != 64){var _ca=((_e2 & 15) << 4) | (_e3 >> 2);xo.push(String.fromCharCode(_ca));};var _e4=PokeIn._es_.indexOf(_i.charAt(q++));if (_e4 != 64){var _cc=((_e3 & 3) << 6) | _e4;xo.push(String.fromCharCode(_cc));};}while (q < ln);return unescape(xo.join(""));};PokeIn._es_="ABCDEFGHIJKLMNOP"; PokeIn.GetJointId=function (){return PokeIn.joinedTo;};PokeIn._ToXML=function (jc, name){if (jc.generic_type){throw "Class " + name + " has a generic type definition. PokeIn has no support for client to server Generic type serialization.";};var msg=[];msg.push('<?xml version="1.0" encoding="utf-8"?>');var mess;if(name.indexOf("ArrayOf")==0){var arg=name.split(".");msg.push('<ArrayOf' + arg[2] + ' xmlns:xsd="http://www.w3.org/2001/XMLSchema">');for(var o in jc){if(jc[o]==null){msg.push("<"+arg[1]+"></"+arg[1]+">");}else {msg.push("<"+arg[1]+">"+jc[o].toString()+"</"+arg[1]+">");}};mess=msg.join("").replace(/[,]/g, "&#24;");mess += '</ArrayOf' + arg[2] + '>';}else{msg.push('<' + name + ' xmlns:xsd="http://www.w3.org/2001/XMLSchema">');msg.push(PokeIn.ToXML(jc));mess=msg.join("").replace(/[,]/g, "&#24;");mess += '</' + name + '>';};return mess;};PokeIn.DateTo=function (dt){var h=dt.getHours();if (parseInt(h) < 10){ h="0" + h; };var m=dt.getMinutes();if (parseInt(m) < 10){ m="0" + m; };var s=dt.getSeconds();if (parseInt(s) < 10){ s="0" + s; };var mm=dt.getMonth();if (mm == 0){ mm=12; };if (parseInt(mm) < 10){ mm="0" + mm; };var dd=dt.getDate();if (parseInt(dd) < 10){ dd="0" + dd; };return dt.getFullYear() + "-" + mm + "-" + dd + "T" + h + ":" + m + ":" + s;};PokeIn._es_+="QRSTUVWXYZabcdef"; PokeIn.ToXML=function (jc, oe, mo){var xm="";if(jc==null){return ;};if (typeof jc == "object"){if (jc instanceof Array){var itemType=mo["Type_" + oe];for (var i=0, ln=jc.length; i < ln; i++){xm += "<" + itemType + ">" + PokeIn.ToXML(jc[i]) + "</" + itemType + ">";};}else if (jc.toUTCString){xm += PokeIn.DateTo(jc);}else {for (var o in jc){if (o.indexOf("Type_") == 0){continue;};var _end="</" + o + ">";xm += "<" + o + ">" + PokeIn.ToXML(jc[o], o, jc) + _end;};};}else if (typeof jc == "string"){xm=jc;}else if (jc.toString){xm=jc.toString();};return xm;};PokeIn._es_+="ghijklmnopqrstuv";PokeIn.AddEvent=function (_e, _n, _h){if (window.attachEvent && !window.addEventListener){_e.attachEvent("on" + _n, _h);}else {_e.addEventListener(_n, _h, false);};};PokeIn.RemoveEvent=function (_e, _n, _h){if (window.detachEvent && !window.removeEventListener){_e.detachEvent("on" + _n, _h);}else {_e.removeEventListener(_n, _h, false);};};PokeIn.GetClientId=function (){ return PokeIn.clid;};window._pci_=PokeIn.GetClientId;PokeIn.FCon=0;PokeIn.Listen=function (cc, qa){if(PokeIn.csed){return true;};if (!PokeIn.IsConnected && cc == null){return false;};if (PokeIn.ListenActive && qa == null){return false;};if(qa!=null){PokeIn.FCon++;if(PokeIn.FCon>qa){PokeIn.ReConnect();return true;};PokeIn.Act("14",true);setTimeout(function(){PokeIn.Act("141",false);PokeIn.p4(-1, cc);},250 * PokeIn.FCon);}else {PokeIn.FCon=0;PokeIn.p4(-1, cc);};return true;};PokeIn.CompilerError=function (message){if (PokeIn.OnCompilerError != null){PokeIn.OnCompilerError(message);};};PokeIn.ClientObjectsDoesntExist=function (){if (PokeIn.OnClientObjectsRemoved != null){PokeIn.OnClientObjectsRemoved();};};PokeIn._es_+="wxyz0123456789+/=";var _______=[{ r: new RegExp(",", "g"), t: "," }, { r: new RegExp("@", "g"), t: "@" },{ r: new RegExp("\\?", "g"), t: "?" }, { r: new RegExp(";", "g"), t: ";" },{ r: new RegExp("&", "g"), t: "&" }, { r: new RegExp("\"", "g"), t: "\"" },{ r: new RegExp("'", "g"), t: "'" }, { r: new RegExp("#", "g"), t: "#" },{ r: new RegExp("\\+", "g"), t: "+" }, { r: new RegExp("%", "g"), t: "%" },{ r: new RegExp("/", "g"), t: "/" }, { r: new RegExp("\\<", "g"), t: "<"}];PokeIn.p18=function (){PokeIn.p13=[]; var clide="~a" + PokeIn.Unique;var le=_______.length;for (var i=0; i < le; i++){PokeIn.p13[i]={ r: new RegExp(":" + clide + i.toString() + ":", "g"), t: ":" + clide + i.toString() + ":" };};};PokeIn.p18();PokeIn.CreateText=function (mess, _in, co){if (mess == null){ return ""; };if(PokeIn.encMode){if (_in){ if(mess=="PokeIn.Listen();" || mess=="PokeIn.Listen();;"){}else {var _mess=mess.split(';');mess="";for (var o in _mess){if (_mess[o] != ""){try {mess += PokeIn.dco(_mess[o]) + ";";}catch(e){mess += _mess[o];};};};};if (co == null){eval(mess);} else {return mess;};} else {if(mess.indexOf(".$PLH()")>0){return mess;}else {return PokeIn.eco(mess);}};}else {var le=_______.length, ve=_______;if (_in){for (var i=0; i < le; i++){mess=mess.replace(PokeIn.p13[i].r, ve[i].t);};mess=mess.replace( /&quot;/g , "&");mess=mess.replace( /&#92;/g , '\\');mess=mess.replace( /&#39;/g , '\\\'');} else {mess=mess.replace( /[\\]/g , '&#92;');for (var i=0; i < le; i++){mess=mess.replace(ve[i].r, PokeIn.p13[i].t);};};if (_in && co == null){eval(mess);} else {return mess;};};};PokeIn.StrFix=function (p23){if (p23 == null){ return ""; };if(p23.replace == null){return ""+p23;};if(PokeIn.encMode){p23=p23.replace(/[,]/g, "&#24;");return p23;};p23=p23.replace(/[&]/g, '&quot;');p23=p23.replace(/[\\]/g, '&#92;');p23=p23.replace(/[,]/g, "&#24;");p23='"' + p23 + '"';return p23;};_pfx_=PokeIn.StrFix; PokeIn.Send=function (mess, sp, pc){ if (!PokeIn.IsConnected){return;};if (!pc){mess=PokeIn.CreateText(mess, false);};PokeIn.p9.ready=false;setTimeout(function (){if(PokeIn){if (!PokeIn.p9.force_false){PokeIn.p9.ready=true;};};}, 90);var _id=PokeIn.p9.sn++;sp=(sp == null) ? false : sp;PokeIn.p9.s[_id]={ p1: false, p2: sp, message: mess, is_send: true };return _id;};PokeIn.p11=0;PokeIn.SendLost++;PokeIn.p15Active =function(){setTimeout(function(){try {if(PokeIn){PokeIn.p15();};}catch(e){};},10);};PokeIn.p15=function (){ try {if (PokeIn.p9.ready && (PokeIn.ListenActive || PokeIn.sleepMode)){if (PokeIn.ListenActive){PokeIn.p11=0;};PokeIn.SendLost=0;if (PokeIn.p9.sn > PokeIn.p9.sc){PokeIn.p9.ready=false;PokeIn.p9.force_false=true;var _pool=PokeIn.p9.sc;if (PokeIn.p9.s[_pool] == null){PokeIn.p9.s[_pool]={ p1: false, p2: false, message: "", is_send: true };};PokeIn.p9.sc++;if (!PokeIn.p9.s[_pool].p2){for (; PokeIn.p9.sc < PokeIn.p9.sn; PokeIn.p9.sc++){if (PokeIn.p9.s[PokeIn.p9.sc] == null){continue;};if (!PokeIn.p9.s[PokeIn.p9.sc].p2){if (PokeIn.p9.s[PokeIn.p9.sc].message != null){PokeIn.p9.s[_pool].message += "\"" + PokeIn.p9.s[PokeIn.p9.sc].message;};PokeIn.p9.s[PokeIn.p9.sc]=null;} else {break;};};};PokeIn.p4(_pool);if (PokeIn.sleepMode){setTimeout(function(){if(PokeIn){PokeIn.p9.ready=true;};}, 100);};};if (PokeIn.ListenActive){PokeIn.p15Active();return;};};if (!PokeIn.ListenActive && PokeIn.IsConnected){PokeIn.p11++;if (PokeIn.p11 > PokeIn.p11Max*60){var reco=true;if (PokeIn.sleepMode){if (PokeIn.p11 * 3 < PokeIn.LTimeout - 4000){reco=false;};};if (reco){PokeIn.p11=0;PokeIn.p9.ready=true;PokeIn.Listen(14);};};} else if (PokeIn.ListenActive && !PokeIn.IsConnected){PokeIn.SendLost++;if (PokeIn.SendLost > 250){PokeIn.kickFrame();PokeIn.SendLost=0;};}else{PokeIn.SendLost=0;PokeIn.p11=0;};}catch(eo){};PokeIn.p15Active();};PokeIn.p11Max=30;PokeIn.fin=false;PokeIn.Close=function (){if(PokeIn.csed){return;};var _id=PokeIn.Send(window._pci_() + '.$PLH();', true);PokeIn.p4(_id, -1); PokeIn.Closed(1);};PokeIn.csed=false;PokeIn.Closed=function (ir){if(PokeIn.csed){return;};if (!PokeIn.IsConnected && ir == null){if (true){PokeIn.ReConnect();return;};};PokeIn.OnError=null;document.PokeInWasConnected=PokeIn.IsConnected;PokeIn.IsConnected=false;PokeIn.Started=false;try {if (!PokeIn.cDom){PokeIn.p9.l.p16.abort();};} catch (e){ };if (!PokeIn._wUnLoad){if (PokeIn.OnClose != null || PokeIn.OnVSJSClosed!=null){setTimeout(function (){if(PokeIn){if(PokeIn.OnClose != null){PokeIn.OnClose();};if(PokeIn.OnVSJSClosed!=null){PokeIn.OnVSJSClosed();};};}, 10);};};};document.PokeInWasConnected=false;PokeIn.Started=false;PokeIn.IR5=0;PokeIn.vsjsCsed=false; PokeIn.Start=function (p3){window.pp3=p3;setTimeout(function (){ if(PokeIn){}else{return;};if (PokeIn.Started){return;};if (PokeIn.IR5 > 3){var p22="?";if (self.location.href.indexOf("?") > 0){p22="&";};self.location=self.location + p22 + "rt=" + PokeIn.p10;if (p3 != null){p3(false);};return;};PokeIn.IR5++; try {PokeIn.RemoveEvent(window, "beforeunload", PokeIn.unlo);PokeIn.RemoveEvent(window, "pagehide", PokeIn.unlo);} catch (e){ };PokeIn.AddEvent(window, "beforeunload", PokeIn.unlo);PokeIn.AddEvent(window, "pagehide", PokeIn.unlo); PokeIn.Started=true;PokeIn.p9.l={ message: "", is_send: false, p16: null };PokeIn.Listen("c");}, 50);};PokeIn.OnConnected=function (){ PokeIn.ReConnCounter=0;PokeIn.IsConnected=true;if (window.pp3 != null){window.pp3(true);};PokeIn.p15Active(); };PokeIn.isInitScript=false;PokeIn.scriptResponse=function (ipa){var que=PokeIn.frames[ipa].docBase.Queue;var str="";while (que.length > 0){str += que.shift();};PokeIn.CreateText(str, true);};PokeIn.ipaOrder=0; PokeIn.lastId=0;PokeIn.sendRequest=function (url, p17){PokeIn.InitScriptLoader();var id=PokeIn.ipaOrder % 3;PokeIn.lastId=id;PokeIn.ipaOrder++;if (PokeIn.ipaOrder > 10000){PokeIn.ipaOrder=0;};PokeIn.frames[id].docBase.callTarget(url, p17);};PokeIn.GetBody=function (){var parents=document.getElementsByTagName("body");if (parents == null){throw "The web page must have a 'body' element";};if (parents.length > 0){return parents[0];} else {throw "The web page must have a 'body' element";}};PokeIn.kickFrame=function (){if (PokeIn.cDom){var parents=PokeIn.GetBody();try {for (var i=0; i < PokeIn.frames.length; i++){delete parents.removeChild(PokeIn.frames[i]);};} catch (e){ };if(PokeIn.OnError){PokeIn.OnError("Fatal connection error. PokeIn can't connect to server.");}else {window.location.reload(true);};} else {PokeIn.Act("14", false);};};PokeIn._rt=/[^A-Za-z0-9\+\/\=]/g;PokeIn.InitScriptLoader=function (){if (PokeIn.isInitScript){ return; };PokeIn.isInitScript=true;PokeIn.frames=[];for (var i=0; i < 3; i++){PokeIn.frames[i]=null;PokeIn.PopFrame(i);};};PokeIn.PopFrame=function (i){var parents=PokeIn.GetBody();if (PokeIn.frames[i] != null){PokeIn.frames[i].src="javascript:''";delete parents.removeChild(PokeIn.frames[i]);};PokeIn.frames[i]=document.createElement("iframe");PokeIn.frames[i].style.cssText="display:none;position:absolute;left:-100px;width:100px";PokeIn.frames[i].src="javascript:''";parents.appendChild(PokeIn.frames[i]);var dBase;if (PokeIn.frames[i].contentDocument){dBase=PokeIn.frames[i].contentDocument;} else {dBase=PokeIn.frames[i].contentWindow.document;};dBase.open();dBase.writeln("<html><head></head><body><div id='di'></div>");dBase.writeln("<script type='text/javascript'>"+ "document.Queue=[];document.dz=document.getElementById('di');"+ "var ift=document.createElement('iframe');document.dz.appendChild(ift);"+ "ift.style.cssText='display:none;position:absolute;left:-1px;'; var db=null;"+ "var str ='\<html\>\<head\>\<\/head\>\<body\>\<script type=\\'text/javascript\\'\>var he=document.getElementsByTagName(\\'head\\')[0];document.callTarget=function(url){';"+ "str += 'var scr=document.createElement(\\'script\\');scr.ol=function(){var _th=this;setTimeout(function(){try{he.removeChild(_th);}catch(ex){};},5);};"+ "if(window.attachEvent){scr.attachEvent(\\'onload\\', scr.ol);}else{scr.addEventListener(\\'load\\',scr.ol, false);};"+ "scr.src=url;he.appendChild(scr);};document.Queue=[];"+ "document.__i=function (a){try{document.Queue.push(a);if(document.resback != null){document.resback();};}catch(e){};"+ "};\\<\/script\\>\\<\/body\\>\\<\/html\\>';"+ "document.fea=function(){"+ "if(ift.contentDocument){db=ift.contentDocument;}else{db=ift.contentWindow.document;};"+ "db.open();db.writeln(str);db.close();"+ "document.callTarget=function(url,cid){"+ "document.cid=cid;"+ "db.callTarget(url);"+ "};};document.fea();"+ "document.zeto=function(){var que=db.Queue; "+ "var ctr=(document.cid==-1)?'PokeIn.ListenActive=false;':'';"+ "while(que.length > 0){document.Queue.push(ctr+que.shift());};"+ "document.fea();db.resback=document.zeto;"+ "if(document.resback!=null){document.resback(" + i + ");}};"+ "db.resback=document.zeto;"+ "</script></body></html>");dBase.close();dBase.resback=PokeIn.scriptResponse;PokeIn.frames[i].docBase=dBase;};PokeIn.HMess=function(_mess){var mess=PokeIn.CreateText(_mess, true, true);if (mess != null && mess!=""){ mess=mess.replace("PokeIn.Listen();", ""); if (PokeIn.OnMessageReceived != null){PokeIn.OnMessageReceived(mess);mess += ";if(PokeIn.OnMessageExecuted!=null){PokeIn.OnMessageExecuted();};";};mess=mess.replace(new RegExp("\n","g"), "\\\n"); /*A*/try {/*E*/if(!PokeIn.IsConnected){eval(mess);}else {var add=true;if (PokeIn.runs.length > 0){if (PokeIn.runs[PokeIn.runs.length - 1] == mess){add=false;}};if (add){PokeIn.runs.push(mess);if (PokeIn.runable){PokeIn.runable=false;setTimeout(PokeIn.runCheck, 8);};};};/*A*/}catch(ee){PokeIn.Notify(ee, mess);};/*E*/};};PokeIn.SocketOpen=false;PokeIn.SFirst=[];PokeIn.SocketDisabled=false;PokeIn.GoSockets=function(p17, cc){if(PokeIn.SocketDisabled){return false;};if(PokeIn.isAndroid || (PokeIn.isIE && PokeIn.ieVersion<9)){PokeIn.SocketDisabled=true;return false;};if(PokeIn.Socket==null){var i8=false;var uri;if(!i8){uri=PokeIn.SocketURL+"/"+PokeIn.clid+"/"+PokeIn.Unique+"/"+PokeIn.IsConnected/*[%IPOS%]*/;}else {uri=PokeIn.SocketURL+"?clid="+PokeIn.clid+"&unqpid="+PokeIn.Unique+"&isc="+PokeIn.IsConnected/*[%IPOSW%]*/;};try{if (window.MozWebSocket){PokeIn.Socket=new MozWebSocket(uri);} else if (window.WebSocket){PokeIn.Socket=new WebSocket(uri);} else {PokeIn.SocketDisabled=true;return false; };}catch(_f){PokeIn.Act("21", false);PokeIn.SocketDisabled=true;return false; };PokeIn.Socket.onopen=function(ev){PokeIn.SocketOpen=true;if(PokeIn.SFirst.length>0){for (var o in PokeIn.SFirst){PokeIn.Socket.send("*" + PokeIn.SFirst[o]);};PokeIn.SFirst=[];};PokeIn.p9.force_false=false;PokeIn.p9.ready=true;};PokeIn.Socket.onclose=function(ev){if(!PokeIn.SocketOpen){PokeIn.p9.ready=true;PokeIn.SocketDisabled=true;PokeIn.Act("15", false);PokeIn.Listen();return;};PokeIn.SocketOpen=false; PokeIn.Socket=null;setTimeout(function(){if(PokeIn){PokeIn.Closed();};},5); };PokeIn.Socket.onerror=function(ev){PokeIn.Socket=null;PokeIn.SocketDisabled=true;PokeIn.Act("15", false);PokeIn.Notify("Socket error. Falling back to reverse ajax.","");setTimeout(function(){PokeIn.Listen(1);if (PokeIn.SFirst.length > 0){for (var o in PokeIn.SFirst){if (PokeIn.SFirst[o] == null){continue;};PokeIn.Send(PokeIn.SFirst[o], false, true);PokeIn.p9.force_false=false;};PokeIn.SFirst=[];};PokeIn.p9.force_false=false;PokeIn.p9.ready=true;}, 800);};PokeIn.Socket.onmessage=function(ev){try {if(ev.data!=";"){if(ev.data == "tbxSocket"){PokeIn.Socket.onerror();return;};PokeIn.HMess(ev.data);}}catch(ee){PokeIn.Notify(ee, ev.data);};};};if(p17==-1){PokeIn.Act("16", true);return true;};if(PokeIn.SocketOpen){PokeIn.Socket.send("*" + PokeIn.p9.s[p17].message);PokeIn.p9.force_false=false;PokeIn.p9.ready=true;}else {PokeIn.SFirst.push(PokeIn.p9.s[p17].message);};return true;};PokeIn.actPos=0;PokeIn.pasPos=0;PokeIn.Act=function(pos, act){if(act){PokeIn.actPos=pos;}else {PokeIn.pasPos=pos;};PokeIn.ListenActive=act; };PokeIn.CRS=false;PokeIn.CORS=(PokeIn.ieVersion<10 && PokeIn.ieVersion>=8) && PokeIn.CRS;PokeIn.cDom=PokeIn.CRS && PokeIn.isIE && PokeIn.ieVersion<8;PokeIn.IEHTTPMode=false;PokeIn.CreateAjax=function (is_send, id){var xmlHttp=null; try {if(PokeIn.CORS){try {xmlHttp=new XDomainRequest();PokeIn.Chunked=false;return xmlHttp;}catch(e){PokeIn.CORS=false;};};if(PokeIn.ieVersion==6){throw null;}else {xmlHttp=new XMLHttpRequest();};}catch (e){if(PokeIn.isIE){try {xmlHttp=new ActiveXObject('Microsoft.XMLHTTP');PokeIn.IEHTTPMode=true;if(xmlHttp){return xmlHttp;};}catch(e){try {xmlHttp=new ActiveXObject('Msxml2.XMLHTTP');PokeIn.IEHTTPMode=true;if(xmlHttp){return xmlHttp;};}catch(e){};};};if(!xmlHttp){if (PokeIn.OnError != null){PokeIn.OnError("Connection Problem : No Ajax Support");};};};return xmlHttp;};PokeIn.runs=[];PokeIn.runable=true;PokeIn.runCheck=function(){if(PokeIn.runs.length==0){PokeIn.runable=true;return;};var msg=PokeIn.runs.shift();if(PokeIn.runs.length>0){msg+=";"+PokeIn.runs.shift();};/*A*/try {/*E*/eval('(function(){' + msg + '})()'); /*A*/}catch(ee){PokeIn.Notify(ee, msg);};/*E*/setTimeout(function (){ PokeIn.runCheck();}, 5);};PokeIn.p4=function (p17, cc){if (!PokeIn.IsConnected && cc == null){return;};if(p17==null){return;};if(p17==-1){PokeIn.MessageCount=0;};if(!PokeIn.SocketDisabled){if (PokeIn.SocketURL != null){var pass=true;if(p17 != -1){if(PokeIn.p9.s[p17].message.length>4096){pass=false;};};if(pass){if (PokeIn.GoSockets(p17, cc)){return;};};};};var txt=[];txt.push('c=' + window._pci_());var p20=PokeIn.p6;var xmlHttp;if (p17 != -1){try {if( PokeIn.p9.s[p17]!=null){txt.push('ms=' + PokeIn.p9.s[p17].message);};} catch (e){return;};xmlHttp=PokeIn.CreateAjax(true, p17);}else {if(PokeIn.rco){txt.push('rco=1');PokeIn.rco=0;};txt.push('io=' + (PokeIn.IsConnected?'1':'0'));p20=PokeIn.p5;if (PokeIn.p9.l.p16 == null){xmlHttp=PokeIn.CreateAjax(true, p17);PokeIn.p9.l.p16=xmlHttp;}else {xmlHttp=PokeIn.p9.l.p16;};};txt.push("unqpid=" + PokeIn.Unique);/*[%IPOC%]*/txt=txt.join('&');var ico=PokeIn.p10++;var uext='co=' + ico;if (p20.indexOf('?') > 0){uext='&' + uext;} else {uext='?' + uext;};if(PokeIn.Chunked && cc==14 && p17==-1){uext += '&rl=' + cc;};if ((PokeIn.isIE && PokeIn.CRS && PokeIn.ieVersion<8)){PokeIn.sendRequest(p20 + uext + "&" + txt, p17);if(p17==-1){setTimeout(function(){if (PokeIn){PokeIn.Act("1", !PokeIn.sleepMode);};}, 100);}else {PokeIn.p9.activeId=p17;setTimeout(function(){PokeIn.p9.force_false=false;PokeIn.p9.ready=true;try { PokeIn.p9.s[PokeIn.p9.activeId].p1=true; } catch (ez){ };}, 100);};return;};if(PokeIn.CORS){uext += "&crs=1";};try {xmlHttp.open("POST", p20 + uext, true);}catch(e){if(PokeIn.OnError){PokeIn.OnError(e); }else {throw e;};return;};if(!PokeIn.CORS){xmlHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');if(!PokeIn.CRS){xmlHttp.setRequestHeader('Content-MAC', ico);};}else {if(p17==-1){xmlHttp.timeout=90000;PokeIn.Act("27", true);}else {xmlHttp.timeout=10000;};xmlHttp.ontimeout=function(){var cid=p17;try {cid=this.p17;}catch(e){};try {if (cid == -1){PokeIn.Act("29", false);} else {PokeIn.p9.force_false=false;PokeIn.p9.ready=true;};}catch(e){};};};if (!PokeIn.IEHTTPMode || PokeIn.CORS){try {xmlHttp.onerror=function (ere){var cid=p17;try {cid=this.p17;}catch(e){};if (cid == -1){ try {PokeIn.Act("2", false);} catch (e){ };};PokeIn.Listen();};} catch (eee){ };};try{xmlHttp.p17=p17;}catch(e){};xmlHttp.onreadystatechange=function (){var _this=this;if(PokeIn.ieVersion==6){_this=xmlHttp;};var oStatus="";try {oStatus=_this.status;}catch (e){ };var cloid=p17;try{if(_this.p17){cloid=_this.p17;};}catch(e){};var rs=_this.readyState;if(PokeIn.CORS){ if (cloid == -1){PokeIn.Act("7", true);}else {PokeIn.p9.force_false=false;PokeIn.p9.ready=true;try { PokeIn.p9.s[cloid].p1=true; } catch (ez){ };};if(_this.responseText){ if(_this.responseText.length>0){ rs=PokeIn.CMode; oStatus=200;}};};if (cloid == -1){if (rs != 4 && oStatus != 503 && oStatus != 404 && oStatus != 500){PokeIn.Act("3", true);} else if (oStatus == 503 || oStatus == 404 || oStatus == 500){PokeIn.Act("4", false);};}else if (rs == 2){PokeIn.p9.force_false=false;PokeIn.p9.ready=true;try { PokeIn.p9.s[cloid].p1=true; } catch (ez){ };};var sm=!PokeIn.sleepMode && cloid != -1;if (sm && rs == 4 && (oStatus == 200 || oStatus == 304)){if (PokeIn.p9.s[cloid] != null){if (!PokeIn.p9.s[cloid].p1){PokeIn.p9.force_false=false;PokeIn.p9.ready=true;};};if(_this.responseText != null){if(_this.responseText.indexOf("PokeIn.Closed")>=0){setTimeout(function(){if(PokeIn){PokeIn.Closed();};},5);};};delete (PokeIn.p9.s[cloid]);xmlHttp.abort();}else if (rs == PokeIn.CMode && (oStatus == 200 || oStatus == 304)){ var mess="";/*A*/try {/*E*/var hl=false; if (_this.responseText != ""){var smes=_this.responseText;var drt=false;if(smes.indexOf("/**/PokeIn.Listen(null,") >= 0){drt=true;};if(!drt){if(PokeIn.Chunked){mess=PokeIn.ParseBase(smes); if(mess==""){PokeIn.Act("5", true);return;};}else {mess=PokeIn.CreateText(smes, true, true);};}else {setTimeout(function (){ if(PokeIn){PokeIn.Act("61", false);PokeIn.ReCall(14);};}, 1);return ;};if (mess != null && mess!=""){ var _mess=mess.replace("PokeIn.Listen();", "");hl=_mess.length != mess.length;if (PokeIn.OnMessageReceived != null){PokeIn.OnMessageReceived(_mess);_mess += ";if(PokeIn.OnMessageExecuted!=null){PokeIn.OnMessageExecuted();};";};/*A*/try {/*E*/if(_mess.length>0){if(!PokeIn.IsConnected){eval(_mess);}else {var add=true;if (PokeIn.runs.length > 0){if (PokeIn.runs[PokeIn.runs.length - 1] == _mess){add=false;}};if (add){PokeIn.runs.push(_mess);if (PokeIn.runable){PokeIn.runable=false;setTimeout(PokeIn.runCheck, 8);};};};};/*A*/}catch(ee){PokeIn.Notify(ee, mess);};/*E*/if(PokeIn.Chunked){if (!hl){PokeIn.Act("5", true);}else{PokeIn.Act("6", false);setTimeout(function (){ if(PokeIn){PokeIn.Act("6", false);PokeIn.ReCall(14);};}, 1);};return;};};if (hl || PokeIn.sleepMode){if (PokeIn.sleepMode){if (PokeIn.ReCallCo < 3){PokeIn.ReCallCo++;setTimeout(function (){ if(PokeIn){PokeIn.Act("73", false);PokeIn.ReCall();};}, 2500);setTimeout(function (){ if(PokeIn){PokeIn.Act("72", false);PokeIn.ReCall();};}, 800);return;};}else{setTimeout(function (){ if(PokeIn){PokeIn.Act("74", false);PokeIn.ReCall();};}, 10);return;};};} else {PokeIn.Act("8", false);if (!PokeIn.sleepMode){if(PokeIn.isIE && oStatus==200){}else {PokeIn.Closed();};};};/*A*/}catch (e){ PokeIn.Act("9", false);if (PokeIn.sleepMode){if (PokeIn.IsConnected){PokeIn.ReCall();} else {PokeIn.Closed();};};PokeIn.Notify(e, mess);};/*E*/ }else if(this.readyState == 4 && (oStatus == 200 || oStatus == 304)){try {if(this.responseText == "" && cloid == -1 && !PokeIn.IsConnected){if (!PokeIn.sleepMode){setTimeout(function (){if(PokeIn){ PokeIn.Closed();};},750);};};if(this.responseText.indexOf("PokeIn.Closed")>=0){PokeIn.Closed();};}catch(e){};};};if(PokeIn.CORS){xmlHttp.onload=xmlHttp.onreadystatechange;xmlHttp.onprogress=xmlHttp.onreadystatechange;};xmlHttp.send(txt);};PokeIn.ParseBase=function(smes){ var arr=smes.split('#');var asub=[];var i=0;for(var o in arr){if(arr[o]!="" && arr[o]!=null){if(arr[o].charAt){asub[i++]=arr[o];};};};var mes="";arr=asub;var pl=false;for(;PokeIn.MessageCount<arr.length;PokeIn.MessageCount++){var str=arr[PokeIn.MessageCount];if(str.charAt(str.length-1)!="?"){if(str.indexOf("PokeIn.Listen")>=0){pl=true;};break;};str=str.substring(0, str.length-1);mes += PokeIn.CreateText(str, true, true);};if(mes.length==0 && pl){mes="PokeIn.Listen();";};return mes; };PokeIn.Notify=function(e,mess){if (PokeIn.OnError != null){var rt="No Response";if(mess!=null){rt=mess;};PokeIn.OnError('Error: ' + e + ' :-: ' + rt, true); };};PokeIn.ReCallCo=0;PokeIn.ReCall=function (q){ if (!PokeIn.Listen(q)){setTimeout(function (){ if(PokeIn){PokeIn.Act("67", false);PokeIn.ReCall(q);};}, 200);} else {if (PokeIn.ReCallCo > 0){PokeIn.ReCallCo--;};};};PokeIn.Controls=[];function p24(settings){var width=settings.size.width;var height=settings.size.height;this.captions=settings.messages;this.colors={ bgColor: settings.bgColor, fontColor: settings.fontColor };this.fileTypes=settings.FileTypes;var element=settings.targetElement;this.Name="UploadControl" + PokeIn.Controls.length;this.Element=document.createElement("DIV");this.Element.style.cssText="position:relative;width:" + width + "px;height:" + height + "px;overflow:hidden;background-color:" + this.colors.bgColor;this.frame=document.createElement("IFRAME");this.frame.style.cssText="position:absolute;left:1px;top:0px;width:" + (width) + "px;height:" + height + "px;border:0;";this.frame.frameBorder=0;this.frame.scrolling="no";this.Element.appendChild(this.frame);this.faker=document.createElement("DIV");this.faker.style.cssText="display:none;position:absolute;left:1px;top:4px;width:" + (width) + "px;height:" + (height - 1) + "px;font:normal normal 12px sans,Arial;";this.faker.innerHTML=" " + this.captions.OnUpload;this.Element.appendChild(this.faker);this.started=false;var _this=this;this._uploading="";this.Start=function (){if (_this.started){return false;};var node=_this.frame.contentDocument;if (node == null){node=_this.frame.contentWindow.document;if(node==null){throw "BODY element is missing";};};if (node.uFile.value != ""){_this._uploading="" + node.uFile.value;var parts=_this._uploading.split('.');var hasType=false;if (parts.length > 0){var ext=parts[parts.length - 1];if (this.fileTypes.length == 0){hasType=true;}else {for (var ft in this.fileTypes){if (this.fileTypes[ft].toLowerCase() == ext.toLowerCase()){hasType=true;break;};};};};if (!hasType){throw "InvalidFileType";};_this.started=true;if (_this.OnUploadStart != null){_this.OnUploadStart(_this.Name, node.uFile.value);};_this.frame.style.display="none";_this.faker.style.display="block";node.StartUpload();} else {throw "FileNotSelected";};};this.OnLoad=function (){if (_this.started){if (!PokeIn.IsConnected){_this.faker.innerHTML="";return;};_this.started=false;if (!_this.errorReceived){_this.faker.innerHTML=_this.captions.OnSuccess;};if (_this.OnUploadCompleted != null){_this.OnUploadCompleted(_this.Name, _this._uploading);};_this._uploading="";setTimeout(function (){_this.faker.style.display="none";_this.frame.style.display="";_this.faker.innerHTML=_this.captions.OnUpload;}, 1000);};};if (this.frame.addEventListener){this.frame.addEventListener("load", this.OnLoad, false);}else if (this.frame.attachEvent){this.frame.attachEvent('onload', this.OnLoad);};_this.idl=PokeIn.Controls.length;_this.width=width;_this.height=height;_this.onduty=true;this.goload=function (){_this.onduty=false;_this.frame.src="Handler.aspx?c=" + PokeIn.clid /*[%IPON%]*/ +"&i=" + (_this.width) + "." + _this.height + "|" + _this.colors.bgColor + "&n=" + _this.idl;};setTimeout(_this.goload, 500);this.faker.style.backgroundColor=this.colors.bgColor;this.Element.style.backgroundColor=this.colors.bgColor;this.faker.style.color=this.colors.fontColor;this.errorReceived=false;element.appendChild(this.Element);this.OnUploadStart=null;this.OnUploadCompleted=null;this.Close=function (){element.removeChild(this.Element);};this.OnFinalizing=function (){_this.faker.innerHTML=_this.captions.OnFinalize;};this.OnError=function (message, custom){_this.faker.innerHTML=_this.captions.OnFail;_this.errorReceived=true;_this.started=false;_this.faker.style.cursor="pointer";if (custom){alert(message);}};_this.faker.onmousedown=function (){if (_this.errorReceived){_this.faker.style.cursor="default";_this.faker.style.display="none";_this.frame.style.display="";_this.faker.innerHTML=_this.captions.OnUpload;}};PokeIn.Controls[PokeIn.Controls.length]=this;};p24.prototype.Size=function (w, h){var _this=this;_this.Element.style.width=w + "px";_this.frame.style.width=w + "px";_this.faker.style.width=w + "px";_this.Element.style.height=h + "px";_this.frame.style.height=h + "px";_this.faker.style.height=(h - 1) + "px";_this.width=w;_this.height=h;if (!_this.onduty){setTimeout(_this.goload, 100);};};p24.prototype.BackgroundColor=function (color){this.Element.style.backgroundColor=color;this.faker.style.backgroundColor=color;this.Element.style.backgroundColor=color;this.colors.bgColor=color;if (!this.onduty){var _this=this;setTimeout(_this.goload, 100);};};p24.prototype.ForeColor=function (color){this.faker.style.color=color;this.colors.fontColor=color;};p24.prototype.Captions=function (messages){this.captions=messages;};PokeIn.CreateUploadControl=function (settings){return new p24(settings);};PokeIn.ReConnect=function (turl){if(PokeIn.fin){return;};if(document.pokeinrcnn == 2){return;};document.pokeinrcnn=2;var rec=document.PokeInWasConnected;if (PokeIn.IsConnected){PokeIn.Close();};PokeIn.Closed(1);PokeIn.ReConnCounter++;if(PokeIn.ReConnCounter>5){if(PokeIn.OnServerNotAvailable){PokeIn.OnServerNotAvailable();};document.pokeinrcnn=1;return;};setTimeout(function (){ try {if(PokeIn){if(PokeIn.Inter!=0){clearInterval(PokeIn.Inter);};};} catch (e){ };document.PokeInWasConnected=rec;var scr=document.createElement("script");scr.type="text/javascript";if(!turl){var elm=document.getElementsByTagName("script");var oe=null;for (var o in elm){oe=elm[o];if (oe == null){continue;};try {if (oe.src.indexOf("ms=connect") > 0){break;};} catch(e){};};if (oe == null){document.pokeinrcnn=1;throw "ReConnection error: Make sure that one of the script elements contain PokeIn connection parameter 'ms=connect'";};scr.src=oe.src + "&rc" + PokeIn.p10 + "=1";}else {scr.src=turl + "&rc" + PokeIn.p10 + "=1";};var bdy=document.getElementsByTagName("body");if (bdy.length == 0){document.pokeinrcnn=1;throw ("document body must be defined to use PokeIn.ReConnect!");};setTimeout(function(){ try {document.pokeinrcnn=1;if (!window.PokeIn.IsConnected){window.PokeIn.ReConnect();};}catch(ee){};},3000);PokeIn.p15=null;bdy[0].appendChild(scr);PokeIn.p10++;}, 1000);};PokeIn.Inter=setInterval(function (){if (document.OnPokeInReady != null){clearInterval(PokeIn.Inter);PokeIn.Inter=0;setTimeout(function (){document.OnPokeInReady();}, 1);};if (document.OnPokeInStart != null){clearInterval(PokeIn.Inter);PokeIn.Inter=0;PokeIn.Start(function (status){document.OnPokeInStart(status);});};if (PokeIn.Started){clearInterval(PokeIn.Inter);PokeIn.Inter=0;};}, 250);window.PokeIn=PokeIn;window.pCall=pCall;PokeIn._wUnLoad=false;PokeIn.unlo=function (_e){PokeIn._wUnLoad=true;PokeIn.PageUnloading=true;try {PokeIn.Close();PokeIn.fin=true;} catch (e){}try {PokeIn.p9.l.p16.abort();}catch (e){};};PokeIn.AddEvent(window, "beforeunload", PokeIn.unlo);PokeIn.AddEvent(window, "pagehide", PokeIn.unlo);document.P_pageShown=0;try{PokeIn.AddEvent(window, "pageshow", function (){if(document.P_pageShown==0){document.P_pageShown++;return;};PokeIn.fin=false;document.pokeinrcnn=0;if(PokeIn.OnClose!=null){PokeIn.OnClose();};if(PokeIn.OnVSJSClosed!=null){PokeIn.OnVSJSClosed();};});}catch (ee){};})(window);;;;;;
function StockDemo(){};pCall['StockDemo'] = StockDemo;pCall['StockDemo'].JoinChannel=function(){PokeIn.Send(_pci_() + ".StockDemo.JoinChannel();");};pCall['StockDemo'].LeaveChannel=function(){PokeIn.Send(_pci_() + ".StockDemo.LeaveChannel();");};