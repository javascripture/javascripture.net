/*globals javascripture, bible*/javascripture.api.reference={getThreeChapters:function(e){var t=this,n=e.book,r=t.getOffsetChapter(e,-1),i=t.getOffsetChapter(e,1),s={reference:e};r.book&&(s.prev=r);i.book&&(s.next=i);javascripture.data.hebrew[n]?s.testament="hebrew":s.testament="greek";s.chapters=[];r.book&&s.chapters.push(javascripture.api.reference.getChapterData(r));s.chapters.push(javascripture.api.reference.getChapterData(e));i.book&&s.chapters.push(javascripture.api.reference.getChapterData(i));return s},getChapterData:function(e){var t=e.book,n=e.chapter,r=n-1,i={},s;javascripture.data.hebrew[t]?s="hebrew":s="greek";if(javascripture.data[e.rightVersion][t][r]){i.right=javascripture.data[e.rightVersion][t][r];javascripture.data[s][t]&&javascripture.data[s][t][r]&&(i.left=javascripture.data[s][t][r])}return i},getOffsetChapter:function(e,t){var n=e.book,r=e.chapter,i={leftVersion:e.leftVersion,rightVersion:e.rightVersion},s=parseInt(r,10)+t,o=s-1,u;if(javascripture.data[e.rightVersion][n]&&javascripture.data[e.rightVersion][n][o]!==undefined){i.book=n;i.chapter=s}else bible.Data.books.forEach(function(e,r){if(e[0]===n){u=r+t;if(bible.Data.books[u]!==undefined){i.book=bible.Data.books[u][0];t>0?i.chapter=1:i.chapter=bible.Data.verses[u].length}}});return i}};