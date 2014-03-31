/*globals javascripture, bible, worker*/javascripture.modules.reference={load:function(e){var t=this,n=e.book,r=e.chapter,i=e.verse;"undefined"==typeof i&&(e.verse=1);e.version=$("#versionSelector").val();worker.postMessage({task:"reference",parameters:e});return this},scrollToVerse:function(e,t){undefined===t&&(t=0);$(document).scrollTop(0);t-=$(".dock").height();$("html").hasClass("reading-mode")&&(t-=50);e.length>0&&$(document).scrollTo(e,{offset:t});$(document).trigger("createWayPoint")},getAnchoringData:function(e){var t="#current",n=0,r=$(document).scrollTop(),i;if(e){e==="prev"&&(i=$(".reference:first-child ol.wrapper li:first-child"));e==="next"&&(i=$(".reference:last-child ol.wrapper li:last-child"));t="#"+i.attr("id");n=r-i.offset().top+$(".dock").height()}return[n,t]},anchorReference:function(e){var t=e[1],n=e[0],r=$(t);t===".current-verse"&&(verseHeight=r.height(),n=-$(window).height()/2+verseHeight);if(r.length===0){r=$("#"+jsonCollection.currentId);n=-$("[data-role=header]").height()}this.scrollToVerse(r,n)},getReferenceFromUrl:function(){var e=window.location.hash.split("&"),t={};if(e.length>1){t.book=e[0].split("=")[1],t.chapter=parseInt(e[1].split("=")[1],10),t.verse=1;e[2]&&(t.verse=parseInt(e[2].split("=")[1],10))}return t},loadReferenceFromHash:function(){var e=window.location.hash;if(e.indexOf("search")>-1){var t=e.split("=")[1];setTimeout(function(){createSearchReferencesPanel({lemma:t})})}else{var n=e.split("&");if(n.length>1){var r=n[0].split("=")[1],i=parseInt(n[1].split("=")[1],10),s=1;n[2]&&(s=parseInt(n[2].split("=")[1],10));localStorage&&(localStorage.reference=[r,i,s]);javascripture.modules.reference.load({book:r,chapter:i,verse:s,anchoringData:javascripture.modules.reference.getAnchoringData(null)})}}},getChapterText:function(e,t,n){var r=this,i=e.book,s=e.chapter,o=e.verse,u=s-1,a=o-1,f=!1,l='<div class="reference frequencyAnalysis" data-book="'+i+'" data-chapter="'+s+'"><h1>'+i+" "+s+"</h1>";l+='<ol class="wrapper">';t.translation&&t.translation.forEach(function(o,u){l+='<li id="'+i.replace(/ /gi,"_")+"_"+s+"_"+(u+1)+'"';u===a&&(l+=' class="current"');l+='data-verse="'+(u+1)+'">';l+='<div class="wrapper"';u===a&&(l+=' id="current"');if(u===a-5){l+=' id="context"';f=!0}l+=">";l+='<div class="english">';e.version==="lc"?t.original[u].forEach(function(t,i){t&&(l+=r.createWordString(t,"english",n,e.version))}):t.translation[u].forEach(function(t,i){t&&(l+=r.createWordString(t,"english",n,e.version))});l+="</div>";if(t.original[u]){l+="<div class='original "+n+"'>";t.original[u].forEach(function(e,t){e&&(l+=r.createWordString(e,n,n))});l+="</div>"}l+="</div>";l+="</li>"});l+="</ol>";l+="</div>";return l},createWordString:function(e,t,n,r){var i=this,s="",o=[];if(typeof e[1]=="undefined")return"<span>"+e[0]+"</span> ";lemma=e[1];if(lemma){lemmaArray=lemma.split(" ");lemmaArray.forEach(function(e,t){o.push(javascripture.api.word.getFamily(e))})}s+="<span";s+=' class="'+o.join(" ")+'"';s+=' title="'+lemma;e[2]&&(s+=" "+e[2]);s+='"';s+=' data-word="'+e[0]+'"';s+=' data-lemma="'+e[1]+'"';s+=' data-language="'+n+'"';s+=' data-range="verse"';s+=' data-family="'+o.join(" ")+'"';e[2]&&(s+=' data-morph="'+e[2]+'"');s+=">";r==="lc"&&t==="english"?s+=javascripture.modules.translateLiterally.getWord(e):s+=e[0];s+="</span> ";return s}};(function(e){var t=javascripture.data.english;e.fn.scrollStopped=function(t){e(this).scroll(function(){var n=this,r=e(n);r.data("scrollTimeout")&&clearTimeout(r.data("scrollTimeout"));r.data("scrollTimeout",setTimeout(t,250,n))})};javascripture.modules.reference.loadReferenceFromHash();e(window).bind("hashchange",function(){var e=new Date;javascripture.modules.reference.loadReferenceFromHash();var t=new Date;timer(e,t)});e(window).scrollStopped(function(){var t=e(document).scrollTop(),n=e(".referencePanel").height()-e(window).height(),r;if(t<=0){var i=e(".three-references").data("prev");if(i){i.anchoringData=javascripture.modules.reference.getAnchoringData("prev");javascripture.modules.reference.load(i)}}if(t>=n){var s=e(".three-references").data("next");if(s){s.anchoringData=javascripture.modules.reference.getAnchoringData("next");javascripture.modules.reference.load(s)}}});e(".goToReference").submit(function(t){t.preventDefault();var n=bible.parseReference(e("#goToReference").val()),r="book="+bible.Data.books[n.bookID-1][0]+"&chapter="+n.chapter+"&verse="+n.verse;window.location.hash=r;e(this).closest(".popup").popup("close");e("#goToReference").blur();e("html").hasClass("reading-mode")&&hideDock();return!1});worker.addEventListener("message",function(t){if(t.data.task==="reference"){var n=t.data.result.reference,r='<div class="three-references"';t.data.result.prev&&(r+=" data-prev='"+JSON.stringify(t.data.result.prev)+"'");t.data.result.next&&(r+=" data-next='"+JSON.stringify(t.data.result.next)+"'");r+=">";if(t.data.result.prev){r+=javascripture.modules.reference.getChapterText(t.data.result.prev,t.data.result.chapters[0],t.data.result.testament);r+=javascripture.modules.reference.getChapterText(n,t.data.result.chapters[1],t.data.result.testament);t.data.result.next&&(r+=javascripture.modules.reference.getChapterText(t.data.result.next,t.data.result.chapters[2],t.data.result.testament))}else{r+=javascripture.modules.reference.getChapterText(n,t.data.result.chapters[0],t.data.result.testament);t.data.result.next&&(r+=javascripture.modules.reference.getChapterText(t.data.result.next,t.data.result.chapters[1],t.data.result.testament))}r+="</div>";e("#verse").html(r);var i=n.book,s=n.chapter-1,o=n.verse-1;typeof s!="undefined"&&(i+=" "+s);typeof o!="undefined"&&(i+=":"+o);e("head title").text(i);e.fn.waypoint&&e(".reference").waypoint("destroy");javascripture.modules.reference.anchorReference(t.data.parameters.anchoringData)}})})(jQuery);