var clicky={init:function(site_id){clicky.pageview_fired=0;if(document.location.protocol=="https:"){clicky.domain="https://in.getclicky.com";clicky.secure=1;}else{clicky.domain="http://in.getclicky.com";clicky.secure=0;}clicky.base=clicky.pingbase=clicky.domain+"/in.php?site_id="+site_id;clicky.base+="&res="+screen.width+"x"+screen.height+"&lang="+(navigator.language||navigator.browserLanguage||'en').substr(0,2)+"&secure="+clicky.secure;if(clicky_custom.session){for(var i in clicky_custom.session){clicky.base+="&custom["+clicky.enc(i)+"]="+clicky.enc(clicky_custom.session[i]);}}if(clicky_custom.goal){for(var i in clicky_custom.goal){clicky.base+="&goal["+clicky.enc(i)+"]="+clicky.enc(clicky_custom.goal[i]);}}if(clicky_custom.async){setTimeout(clicky.advanced,1000);}else clicky.add_event(window,'load',clicky.advanced);clicky.ref=RegExp("^https?://[^/]*"+location.host.replace(/^www\./i,"")+"/","i").test(document.referrer)?"":clicky.enc(document.referrer);if(!clicky_custom.pageview_disable)clicky.pageview();},pageview:function(){if(clicky.pageview_fired)return;clicky.pageview_fired=1;if(location.hash.match(/utm_/i)){var href=location.pathname+(location.search?location.search+'&':'?')+location.hash.substr(1);}else{var href=location.pathname+location.search;}clicky.beacon("&href="+clicky.enc(clicky_custom.href||href)+"&title="+clicky.enc(clicky_custom.title||document.title)+"&ref="+clicky.ref);},log:function(href,title,type){type=type||"click";if(type=="pageview")href=href.replace(/^https?:\/\/([^\/]+)/i,"");clicky.beacon("&type="+type+"&title="+clicky.enc(title)+"&href="+clicky.enc(href)+"&ref="+clicky.ref);if(type=="download"||type=="outbound")clicky.pause();},beacon:function(x,ping){var jsuid='';if(!clicky_custom.no_cookies){jsuid=clicky.get_cookie('_jsuid');if(!jsuid){clicky.set_cookie('_jsuid',clicky.randy());jsuid=clicky.get_cookie('_jsuid');}}var s=document.createElement('script');s.type='text/javascript';s.async=true;s.src=(ping?clicky.pingbase:clicky.base)+x+'&jsuid='+jsuid+'&mime=js&x='+Math.random();(document.getElementsByTagName('head')[0]||document.getElementsByTagName('body')[0]).appendChild(s);clicky.ref="";clicky.ping_start();},ping:function(){clicky.beacon("&type=ping",1);},ping_set:function(interval,stop){if(!interval||!stop)return;var pingy=setInterval(clicky.ping,interval*1000);setTimeout("clearInterval("+pingy+")",stop*1000);clicky.ping();},ping_start:function(){if(clicky.pinging)return;clicky.pinging=1;var last_timeout=(clicky_custom.timeout&&clicky_custom.timeout>=5&&clicky_custom.timeout<=240)?((clicky_custom.timeout-1)*60)+5:605;setTimeout("clicky.ping()",30*1000);setTimeout("clicky.ping_set(80,"+last_timeout+")",60*1000);},get_cookie:function(name){var ca=document.cookie.split(';');for(var i=0,l=ca.length;i<l;i++){if(eval("ca[i].match(/\\b"+name+"=/)"))return decodeURIComponent(ca[i].split('=')[1]);}return'';},set_cookie:function(name,value){var ex=new Date;ex.setTime(ex.getTime()+20*365*86400*1000);document.cookie=name+"="+value+";expires="+ex.toGMTString()+";path=/;domain=."+location.hostname.replace(/^www\./i,"")+";";},randy:function(){var r=0,s="",c="0123456789";for(var i=0,l=c.length;i<19;i++){r=Math.floor(Math.random()*l);s+=c.substring(r,r+1);}return s.replace(/^0+/,"");},pause:function(x){var now=new Date();var stop=now.getTime()+(x||clicky_custom.timer||500);while(now.getTime()<stop)var now=new Date();},isset:function(e){return(typeof(window[e])!="undefined");},enc:function(e){return window.encodeURIComponent?encodeURIComponent(e):escape(e);},goal:function(id,revenue){clicky.beacon("&type=goal&goal[id]="+id+"&goal[revenue]="+revenue);},add_event:function(e,type,func){if(e.addEventListener){e.addEventListener(type,func,false);}else if(e.attachEvent){e.attachEvent("on"+type,func);}},download:function(e){clicky.img_src(e,"download");},outbound:function(e){clicky.img_src(e,"outbound");},click:function(e){clicky.img_src(e,"click");},img_src:function(e,type){obj=clicky.get_target(e);clicky.log(clicky.get_href(obj),clicky.get_text(obj),type);},get_text:function(e){do{var txt=e.text?e.text:e.innerText;if(txt)return txt;if(e.alt)return e.alt;if(e.title)return e.title;if(e.src)return e.src;e=clicky.get_parent(e);}while(e);return"";},get_href:function(e){do{if(e.href&&!e.src)return e.href;e=clicky.get_parent(e);}while(e);return"";},get_parent:function(e){return e.parentElement||e.parentNode;},get_target:function(e){if(!e)var e=window.event;var t=e.target?e.target:e.srcElement;if(t.nodeType&&t.nodeType==3)t=t.parentNode;return t;},advanced:function(){if(clicky_custom.advanced_disable)return;var is_download=new RegExp("\\.(7z|aac|avi|cab|csv|dmg|doc(x|m)?|exe|flv|gif|gz|jpe?g|js|m4a|mp(3|4|e?g)|mov|msi|ods|pdf|phps|png|ppt(x|m)?|rar|rtf|sea|sit|tar|torrent|txt|wma|wmv|xls(x|m)?|xml|zip)$","i");var is_link=new RegExp("^(https?|ftp|telnet|mailto):","i");var is_link_internal=new RegExp("^https?:\/\/(.*)"+location.host.replace(/^www\./i,""),"i");var a=document.getElementsByTagName("a");for(var i=0;i<a.length;i++){if(a[i].className.match(/clicky_log/i)){if(a[i].className.match(/clicky_log_download/i)){clicky.add_event(a[i],"mousedown",clicky.download);}else if(a[i].className.match(/clicky_log_outbound/i)){clicky.add_event(a[i],"mousedown",clicky.outbound);}else{clicky.add_event(a[i],"mousedown",clicky.click);}}else{if(is_link.test(a[i].href)&&!a[i].className.match(/clicky_ignore/i)){if(is_download.test(a[i].href)){clicky.add_event(a[i],"mousedown",clicky.download);}else if(!is_link_internal.test(a[i].href)){clicky.add_event(a[i],"mousedown",clicky.outbound);}}}}}};if(!clicky.isset("clicky_custom"))clicky_custom={};if(clicky.isset("clicky_page_title"))clicky_custom.title=clicky_page_title;if(clicky.isset("clicky_advanced_disable"))clicky_custom.advanced_disable=1;if(clicky.isset("clicky_pause_timer"))clicky_custom.timer=clicky_pause_timer;if(clicky.isset("clicky_custom_session"))clicky_custom.session=clicky_custom_session;if(clicky.isset("clicky_goal"))clicky_custom.goal=clicky_goal;if(clicky.isset("async_site_id"))var clicky_site_id=async_site_id;if(clicky.isset("clicky_site_id")){clicky_custom.async=1;clicky.init(clicky_site_id);}function statsgoyes(site_id){clicky.init(site_id);}statsgoyes(118298);