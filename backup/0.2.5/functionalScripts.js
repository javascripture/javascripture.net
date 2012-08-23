	$(document).ready(function(){
		$('input[type=text]').live('focus',function(){
			$(this).select();
		});
		$('.selects select').change(function(){selectOptionDisplay($(this));});
		/*$("ul.bookSelect li").click(function() {
			$('select.bookSelect').val($(this).attr("class")).change();
		});
		$("ul.chapterSelect li").click(function() {
			$('select.chapterSelect').val($(this).text()).change();
		});
		$("ul.verseSelect li").click(function() {
			$('select.verseSelect').val($(this).text()).change();
		});*/
		$('#verse span').live('click',function(){
			var strongsNumber = $(this).attr('class');
			highlightStrongsNumber(strongsNumber);
		});
		$('#verse span').live('dblclick',function(){
			$('input#searchTerm').val($(this).attr('class'));
			$('input#search').click();
			//$(this).unhighlight();
		});
		$('a').live('focus',function(){
			$(this).click();
		});
		$('#references a').live('click',function(){
			var href = $(this).attr('href').split(",");
			var book = href[0];
			var chapter = parseInt(href[1]) + 1;
			var verse = parseInt(href[2]) + 1;
			goToReference(book,chapter,verse);
			return false;
		});
		$('input#search').click(function() {
			searchByStrongsNumber($('input#searchTerm').val());
			return false;
		});
		$('#strongsTracking a.tracker').live('dblclick', function() {
			$('input#searchTerm').val($(this).attr('href'));
			$('input#search').click();
			return false;
		});
		$('#strongsTracking a.close').live('click', function() {
			$(this).closest('li').remove();
			return false;
		});
		$('#strongsTracking a.tracker').live('click', function() {
			highlightStrongsNumber($(this).attr('href'));
			return false;
		});
		/*$('#searchByStrongsNumber').live('submit', function(){
			$('input#search').click();
		});*/
		$('#changeColor').live('submit', function(){
			var strongsNumber = $('#changeColor #colorFormStrongsNumber').val();
			var color = $('#changeColor #colorFormColor').val();
			$('#'+strongsNumber).find('style').html('.'+strongsNumber+'{background:'+color+';color:#fff;}')
			return false;
		});
		$('ul.navigation li#previousBook').live('click',function(){
			var book = $('select#bookSelect option:selected').prev().val();
			if(typeof(book) != "undefined"){
				$('select#bookSelect').val(book).change();
			}
		});
		$('ul.navigation li#previousChapter').live('click',function(){
			var chapter = $('select#chapterSelect option:selected').prev().val();
			if(typeof(chapter) != "undefined"){
				$('select#chapterSelect').val(chapter).change();
			} else {
				var book = $('select#bookSelect option:selected').prev().val();
				if(typeof(book) != "undefined"){
					$('select#bookSelect').val(book).change();
					var lastChapter = $('select#chapterSelect option.show:last').val();
					$('select#chapterSelect').val(lastChapter).change();
				}
			}
		});
		$('ul.navigation li#previousVerse').live('click',function(){
			var verse = $('select#verseSelect option:selected').prev('.show').val();
			if(typeof(verse) != "undefined"){
				$('select#verseSelect').val(verse).change();
			} else {
				var chapter = $('select#chapterSelect option:selected').prev('.show').val();
				if(typeof(chapter) != "undefined"){
					//this fires two changes which means the lookup is done twice. bad.
					$('select#chapterSelect').val(chapter).change();
					var lastVerse = $('select#verseSelect option.show:last').val();
					$('select#verseSelect').val(lastVerse).change();
				} else {
					var book = $('select#bookSelect option:selected').prev().val();
					if(typeof(book) != "undefined"){
						$('select#bookSelect').val(book).change();
						var lastChapter = $('select#chapterSelect option.show:last').val();
						$('select#chapterSelect').val(lastChapter).change();
						var lastVerse = $('select#verseSelect option.show:last').val();
						$('select#verseSelect').val(lastVerse).change();
					}
				}
			}
		});
		$('ul.navigation li#nextBook').live('click',function(){
			var book = $('select#bookSelect option:selected').next().val();
			if(typeof(book) != "undefined"){
				$('select#bookSelect').val(book).change();
			}
		});
		$('ul.navigation li#nextChapter').live('click',function(){
			var chapter = $('select#chapterSelect option:selected').next('.show').val();
			if(typeof(chapter) != "undefined"){
				$('select#chapterSelect').val(chapter).change();
			} else {
				var book = $('select#bookSelect option:selected').next().val();
				if(typeof(book) != "undefined"){
					$('select#bookSelect').val(book).change();
				}
			}
		});
		$('ul.navigation li#nextVerse').live('click',function(){
			var verse = $('select#verseSelect option:selected').next('.show').val();
			if(typeof(verse) != "undefined"){
				$('select#verseSelect').val(verse).change();
			} else {
				var chapter = $('select#chapterSelect option:selected').next('.show').val();
				if(typeof(chapter) != "undefined"){
					$('select#chapterSelect').val(chapter).change();
				} else {
					var book = $('select#bookSelect option:selected').next().val();
					if(typeof(book) != "undefined"){
						$('select#bookSelect').val(book).change();
					}
				}
			}
		});
		$('select#bookSelect').val("Gen");
		$('select#chapterSelect').val(1);
		$('select#verseSelect').val(1).change();
	});
	function selectOptionDisplay(selectObject) {
		var startDate = new Date();
		var context = false;
		var book = $('select#bookSelect').val();
		if(selectObject.attr('id') === "bookSelect"){
//this probably can be done better - how to select an option without extracting the value?
			$('select#chapterSelect option:first').attr('selected','selected');//.val();
			//$('select#chapterSelect').val(chapter);
			//var verse = $('select#verseSelect option:first').val();
			//$('select#verseSelect').val(verse);
			$('select#verseSelect option:first').attr('selected','selected');
		} else if (selectObject.attr('id') === "chapterSelect"){
			//var verse = $('select#verseSelect option:first').val();
			//$('select#verseSelect').val(verse);
			$('select#verseSelect option:first').attr('selected','selected');
		}
		var chapter = $('select#chapterSelect').val() - 1;
		var verse = $('select#verseSelect').val() - 1;
		$('.current').removeClass('current');
		if(typeof(book) != undefined) {
			var bookSize = bibleObject[book].length;
			if(chapter >= bookSize){
				$('select#chapterSelect').val('1').change();
				
			} else {
				//update verse dropdown
				if(typeof(bookSize) != undefined && typeof(chapter) !=  undefined) {
					var chapterSize = bibleObject[book][chapter].length
				}
				verseSelectObject = $('#verseSelect');
				verseSelectObject.attr('size',chapterSize);
				verseSelectObject.children('option').each(function(){
					if($(this).val() <= chapterSize){
						$(this).addClass('show');
					} else {
						$(this).removeClass('show');
					}
				});
				//update chapter dropdown
				chapterSelectObject = $('#chapterSelect');
				chapterSelectObject.attr('size',bookSize);
				chapterSelectObject.children('option').each(function(){
					if($(this).val() <= bookSize){
						$(this).addClass('show');
					} else {
						$(this).removeClass('show');
					}
				});

				if(typeof(verse) != undefined) {
					var reference = book + ' ' + (chapter+1) + ':' + (verse+1);
					$('head title').text(reference);
					$('h1').text(reference);
					var chapterText = '<ol id="start">';
					$.each(bibleObject[book][chapter], function(verseNumber, verseText) {
						chapterText += '<li';
						if(verseNumber === verse) {
							chapterText += ' id="current"';
						}
						if(verseNumber === verse-5) {
							chapterText += ' id="context"';
							context = true;
						}
						chapterText += '>';
						chapterText += verseText;
						chapterText += '</li>';
					});
					chapterText += '</ol>';
					$('#verse').html(chapterText);
				}
				if(context) {
					window.location.href = '#context';
				} else {
					window.location.href = '#start';
				}
				/*var verseString = verse.toString();
				$('ul.bookSelect li[class='+book+']').addClass('current');
				$('ul.chapterSelect li').filter(function() {
					return $(this).text() == chapter.toString();
				});
				$('ul.verseSelect li').filter(function() {
					return $(this).text() == verseString;
				});*/
				//$('ul.chapterSelect li[text='+chapter+']').addClass('current');
				//$('ul.verseSelect li[text='+verse+']').addClass('current');
				var endDate = new Date();
				timer(startDate, endDate);
			}
		}
	}
	//>formatting
	function highlightStrongsNumber(strongsNumber) {
		if(!$('#'+strongsNumber).length > 0) {
			var strongsTracking = '';
			color = Math.random()*100000000*parseInt(strongsNumber.substring(2,strongsNumber.length));
			color = color.toString().substring(0,6);
			r = color.substring(0,2);
			g = color.substring(2,4);
			b = color.substring(4,6);
			strongsTracking += '<li id="'+strongsNumber+'">';
			strongsTracking += '<style type="text/css">.'+strongsNumber+' {color:#fff;background:rgb('+r+','+g+','+b+');}</style>';
			strongsTracking += '<a href="'+strongsNumber+'" class="tracker '+strongsNumber+'">'+strongsNumber+'</a>';
			strongsTracking += '<a href="#" class="close">x</a>';
			strongsTracking += '</li>';
			$('#strongsTracking ul').append(strongsTracking);
		}
		$('#changeColor #colorFormStrongsNumber').val(strongsNumber);
		color = $('#'+strongsNumber+' .'+strongsNumber).css("background-color");
		$('#changeColor #colorFormColor').val(color);
	}
	function searchByStrongsNumber(strongsNumberString) {
		var startDate = new Date();
		$('#references').html('Loading');
		var references = '';
		var strongsNumberArray = new Array();
		var searchType = $('#searchSelect').val();
		strongsNumberArray = strongsNumberString.split(' ');
		references += 'roots: ';
		$.each(strongsNumberArray, function(index, strongsNumber) {
			highlightStrongsNumber(strongsNumber);
			if(typeof(strongsObject[strongsNumber]) != "undefined"){
				references += strongsObject[strongsNumber]['root'] + ' ';
			}
		});
		references += '<ol>';
		var wordCount = 0;

		//to differentiate between strongs numbers and not strongs numbers
		$.each(strongsNumberArray, function(index, strongsNumber) {
			if(parseFloat(strongsNumber.substring(1, strongsNumber.length)) > 0) {
				strongsNumberArray[index] = strongsNumber + '"';
			}
		});
		$.each(bibleObject, function(book, m) {
			$.each(m, function(j, n) {
				$.each(n, function(k, o) {
					var wordCount = 0;
					$.each(strongsNumberArray, function(index, strongsNumber) {
						if(o.indexOf(strongsNumber) > 0) {
							wordCount++;
						}
					});
					if((wordCount > 0 && searchType === 'any') || (wordCount > strongsNumberArray.length-1 && searchType === 'all') ) {
						references += '<li><a href="' + book + ',' + j + ',' + k + '">'+book+' '+(j+1)+':'+(k+1)+'</a> [' + wordCount + ']</li>';
					}
				});
			});
		});
		references += '</ol>';
		$('#references').html(references);
		var endDate = new Date();
		timer(startDate, endDate);

	}
	function goToReference(book,chapter,verse){
		$('select#bookSelect').val(book);
		$('select#chapterSelect').val(chapter);
		$('select#verseSelect').val(verse).change();
	}
	function timer(startDate, endDate){
		var startTime = startDate.getTime();
		var endTime = endDate.getTime();
		if(typeof(console) !== 'undefined'){
			console.log(endTime - startTime);
		}
	}