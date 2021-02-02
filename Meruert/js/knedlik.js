/* 
	Knedlik (WYSIWYG Content Editor, Rich Text Editor) 
	Founded 23.04.2014, released 29.04.2014 (v.1), updated 26.12.2018 (v.1.1)
	Website: http://knedlik.kirillpanfilov.com
	Copyrigt: Kirill Panfilov, http://kirillpanfilov.com
	License: free to use, prohibited to change.
	NB: use UTF-8 only, please.
*/

var knedlikEditorNum = 0;
function knedlik(elem, prefs) {
	if(typeof elem == 'undefined') elem = '';
	if(typeof prefs == 'undefined') prefs = {};
	var lang = 'en';
	if(prefs.lang) lang = prefs.lang;
	if(lang == 'ru' || lang == 'uk' || lang == 'be' || lang == 'kz' || lang == 'chm') lang = 'ru';
	else lang = 'en';
	var _ = function(id) { 
		return document.getElementById(id);
		}
	var isIE = function() {
		return (navigator.appVersion.indexOf("MSIE")!=-1 || navigator.appVersion.indexOf("Trident")!=-1) ? true : false;
		}
	var css = function(defined, props) {
		for(i in props) { defined.style[i] = props[i]; }
		}
	var attr = function(defined, props) {
		if(typeof props == 'string' || typeof props == 'String') {
			return defined.getAttribute(props);
			}
		else {
			for(i in props) { defined.setAttribute(i, props[i]); }
			}
		}
	var html = function(defined, s) {
		if(typeof s == 'undefined') { return defined.innerHTML; }
		else {
			defined.innerHTML = s;
			}
		}
	var toggle = function(defined) {
		return defined.style.display = (defined.style.display=='none') ? 'block' : 'none';
		}
	var all = function(tagname, clsname, func) { 
		var getElems = document.getElementsByTagName(tagname); 
		if(typeof clsname == 'undefined') { clsname = ''; } 
		for(i=0; i<getElems.length; i++) { 
			if(clsname == '' || getElems[i].className.indexOf(clsname)==-1) { continue; } 
			_elem = getElems[i]; func(); 
			}
		}
	var getSelText = function(){
		var txt = '';
		if(window.getSelection) { txt = window.getSelection(); }
		else if(document.getSelection) { txt = document.getSelection(); }
		else if (document.selection){ txt = document.selection.createRange().text; }
		return (txt!='') ? txt : '';
		}
	var saveSelection = function() {
		if(window.getSelection) {
			sel = window.getSelection();
			if(sel.getRangeAt && sel.rangeCount) {
				var ranges = [];
				for(var i = 0, len = sel.rangeCount; i < len; ++i) {
					ranges.push(sel.getRangeAt(i));
					}
				return ranges;
				}
			} 
		else if(document.selection && document.selection.createRange) {
			return document.selection.createRange();
			}
		return null;
		}
	var restoreSelection = function(savedSel) {
		if(savedSel) {
			if(window.getSelection) {
				sel = window.getSelection();
				sel.removeAllRanges();
				for(var i = 0, len = savedSel.length; i < len; ++i) {
					sel.addRange(savedSel[i]);
					}
				} 
			else if(document.selection && savedSel.select) {
				savedSel.select();
				}
			}
		}
	var insertHTML = function(s, r) {
		if(isIE()==true) {
			if (r.pasteHTML) {
				r.pasteHTML(s);
				}
			else {
				var range = document.getSelection().getRangeAt(0);
				var nnode = document.createElement("span");
				range.surroundContents(nnode);
				nnode.innerHTML = s;
				}
			}
		else {
			window.document.execCommand('insertHTML', false, s);
			}
		}
	var process = function(el) {
		knedlikEditorNum++;
		var knedlikEditorNb = knedlikEditorNum;
		var designDef = { 'background': '#eee', 'backgroundBtn': '#eee', 'backgroundDrop': '#eee', 'backgroundActive': '#ddd', 'border': '#ddd', 'borderBtn': '#ccc', 'borderDrop': '#ccc', 'borderActive': '#aaa', 'shadowBtn': '#ddd', 'shadowDrop': '#ddd', 'shadowActive': '#bbb', 'shadowColor': '#bbb', 'colorBtn': '#444', 'colorClose': '#bbb', 'colorize': '#070', 'colorizeA': '#00c', 'colorizeH': '#dc143c', 'sizeBtn': 25, fontSizeBtn: 8 };
    var designDef = designDef;
		if(prefs.colors) {
			for(clr in designDef) {
				if(prefs.colors[clr]) designDef[clr] = prefs.colors[clr];
				}
			}
    if(prefs.design) {
			for(clr in designDef) {
				if(prefs.design[clr]) designDef[clr] = prefs.design[clr];
				}
			}
		var kTranslations = (lang == 'ru') ? { 
		'boldName': 'Ж', 'italicName': 'К', 'underlineName': 'Ч', 'fontName': 'Шрифт', 'markupName': 'Стили', 'markupPName': 'Абзац', 'markupH1Name': 'Заголовок 1', 'markupH2Name': 'Заголовок 2', 'markupH3Name': 'Заголовок 3', 'markupH4Name': 'Заголовок 4', 'markupPreName': 'Моноширинный', 'symName': 'Символы', 'fgName': 'Цвет', 'bgName': 'Фон', 'formatName': 'Формат', 'format': 'Украшение', 'markup': 'Абзац и заголовки', 'bold': 'Полужирный', 'italic': 'Курсив', 'underline': 'Подчёркнутый', 'strike': 'Зачёркнутый', 'font': 'Гарнитура и кегль', 'link': 'Добавление и редактирование ссылки', 'unlink': 'Удалить ссылку', 'ul': 'Маркированный список', 'ol': 'Нумерованный список', 'symbols': 'Дополнительные символы', 'sym-mdash': 'Тире', 'sym-ndash': 'Короткое тире', 'sym-copy': 'Знак авторского права', 'sym-euro': 'Евро', 'sym-reg': 'Зарегистрированный товарный знак', 'sym-tm': 'Торговая марка', 'sym-sect': 'Параграф', 'sym-deg': 'Градус', 'sym-times': 'Умножение', 'sym-asymp': 'Приблизительно равно', 'sym-apo': 'Апостроф', 'sym-hellip': 'Многоточие', 'sym-q': 'Кавычки', 'sym-inq': 'Вложенные кавычки', 'sym-enq': 'Английские кавычки', 'diacritic': 'Буквы с дополнительными знаками', 'fgcolor': 'Цвет текста', 'bgcolor': 'Цвет фона', 'clear-format': 'Очистить форматирование', 'align': 'Выравнивание', 'align-left': 'По левому краю', 'align-center': 'По центру', 'align-right': 'По правому краю', 'html': 'Исходный код', 'plushtml': 'Произвольный HTML внутри текста', 'lists': 'Списки', 'image': 'Изображение', 'ok': 'OK', 'close': 'Закрыть', 'newwin': 'Открыть в новом окне', 'table': 'Таблица', 'tableCols': 'колонок', 'tableRows': 'рядов', 'tableHeaders': 'заголовки', 'tableBorder': 'граница', 'imageURL': 'Адрес изображения', 'imageUpload': 'Или загрузите изображение:', 'imageUploading': 'Загрузка…' } : { 
		'boldName': 'B', 'italicName': 'I', 'underlineName': 'U', 'fontName': 'Font', 'markupName': 'Markup', 'markupPName': 'Paragraph', 'markupH1Name': 'Heading 1', 'markupH2Name': 'Heading 2', 'markupH3Name': 'Heading 3', 'markupH4Name': 'Heading 4', 'markupPreName': 'Preformatted', 'symName': 'Symbols', 'fgName': 'Color', 'bgName': 'Highlight', 'formatName': 'Format',
		'format': 'Decorative', 'markup': 'Paragraph or headings', 'bold': 'Bold', 'italic': 'Italic', 'underline': 'Underline', 'strike': 'Strike Through', 'font': 'Font family and size', 'link': 'Add/edit link', 'unlink': 'Remove link', 'ul': 'Unordered list', 'ol': 'Ordered list', 'symbols': 'Additional characters', 'sym-mdash': 'M Dash', 'sym-ndash': 'N Dash', 'sym-copy': 'Copyright', 'sym-euro': 'Euro', 'sym-reg': 'Registered', 'sym-tm': 'Trademark', 'sym-sect': 'Section', 'sym-deg': 'Degree', 'sym-times': 'Multiplication', 'sym-asymp': 'Approximately equal', 'sym-apo': 'Apostrophe', 'sym-hellip': 'Ellipsis', 'sym-q': 'Quotes', 'sym-inq': 'Nested quotes', 'sym-enq': 'English quotes', 'diacritic': 'Diacritics', 'fgcolor': 'Foreground colour', 'bgcolor': 'Background colour', 'clear-format': 'Remove formatting', 'align': 'Align', 'align-left': 'Left align', 'align-center': 'Center align', 'align-right': 'Right align', 'html': 'Source code', 'plushtml': 'Arbitrary object or HTML in any place', 'lists': 'Lists', 'image': 'Picture',
		'ok': 'OK', 'close': 'Close',
		'newwin': 'Open in a new window', 'table': 'Table', 'tableCols': 'columns', 'tableRows': 'rows', 'tableHeaders': 'table headers', 'tableBorder': 'border', 'imageURL': 'Image URL', 'imageUpload': 'Or upload a picture:', 'imageUploading': 'Uploading&hellip;' };
		if(prefs.translations) {
			for(term in kTranslations) {
				if(prefs.translations[term]) kTranslations[term] = prefs.translations[term];
				}
			}
		
		var elw = el.offsetWidth;
		var elh = el.offsetHeight;
    var elc = html(el).trim().length<1 ? '<p><br></p>' : html(el);
		css(el, {border:0, height:0, overflow:'hidden', opacity:0, position:'absolute', left:'-9999px', top:'-9999px'});
		
		var editor = document.createElement('div');
		editor.id = 'knedlik-editor-'+knedlikEditorNb+'-area';
		el.parentNode.insertBefore(editor, el);
		css(editor, {border:'1px solid '+designDef.border, width:(parseInt(elw)+'px'), height:(parseInt(elh)+'px'), overflow:'auto', padding:'7px', margin:0, minWidth:'300px', minHeight:'175px', zIndex:'1000'});
		html(editor, elc.replace(/&lt;/g,'<').replace(/&gt;/g,'>'));
		attr(editor, {'contenteditable':true});
    document.execCommand("defaultParagraphSeparator", false, "p");    

		var panel = document.createElement('div');
		panel.id = 'knedlik-editor-'+knedlikEditorNb+'-panel';
		editor.parentNode.insertBefore(panel, editor);
		css(panel, {border:'1px solid '+designDef.border, borderBottom:0, background:designDef.background, width:(parseInt(elw)+'px'), padding:'7px', margin:0, minWidth:'300px'});

		var panelInner = document.createElement('div');
		panelInner.id = 'knedlik-editor-'+knedlikEditorNb+'-panel-inner';
		panel.appendChild(panelInner);
		css(panelInner, {position:'relative', left:'-2px'});

    window.onresize = function() {
      var elwn = parseInt(el.offsetWidth)+'px';
      css(editor, {width:elwn});
      css(panel, {width:elwn});
    }

		var closeDropdown = function(id) {
			toggle(_('knedlik-editor-'+knedlikEditorNb+'-panel-dropdown-'+id));
			css(_('knedlik-editor-'+knedlikEditorNb+'-button-'+id), {background:designDef.backgroundBtn});
			if(_('knedlik-editor-'+knedlikEditorNb+'-button-closer-'+id)) _('knedlik-editor-'+knedlikEditorNb+'-button-closer-'+id).parentNode.removeChild(_('knedlik-editor-'+knedlikEditorNb+'-button-closer-'+id));
			html(el, html(editor));
			}
		var closeAllDropdowns = function(except) {
			if(typeof except == 'undefined') except = 'fantastic';
			all('div', 'knedlik-editor-'+knedlikEditorNb+'-panel-dropdown', function(){
				if(_elem.style.display == 'block' && _elem.id != 'knedlik-editor-'+knedlikEditorNb+'-panel-dropdown-'+except) {
					closeDropdown(_elem.id.replace('knedlik-editor-'+knedlikEditorNb+'-panel-dropdown-',''));
					}
				});
			}

		var colorize = function(id) {
			var ret = '<div style="width:280px;" id="colorbuttons-'+id+'">';
			var colors = [["Кармин","Carmine","960018"],["Кардинал","Cardinal","c41e3a"],["Тициановый","Titian","d53e07"],["Красный","Red","ff0000"],["Алый","Scarlet","ff2400"],["Карминово-красный","Carmine red","ff0033"],["Киноварь","Vermilion","ff4d00"],["Международный оранжевый","International orange","ff4f00"],["Ализариновый","Alizarin","e32636"],["Малиновый","Crimson","dc143c"],["Каштановый","Chestnut","cd5c5c"],["Темно-коралловый","Dark coral","cd5b45"],["Морковный","Carrot","f36223"],["Сиена жженая","Burnt Siena","e97451"],["Коралловый","Coral","ff7f50"],["Лососевый","Salmon","ff8c69"],["Темно-лососевый","Dark salmon","e9967a"],["Оранжево-розовый","Pink-orange","ff9966"],["Сомон","Saumon","efaf8c"],["Розовый","Pink","ffc0cb"],["Бледно-розовый","Pale pink","fadadd"],["Розовато-лавандовый","Lavender Blush","fff0f5"],["Бледно-песочный","Pale Sandy Brown","fdeaa8"],["Циннвальдитовый","Zinnwaldite","ebc2af"],["Бледно-коричневый","Pale brown","987654"],["Темно-каштановый","Dark chestnut","986960"],["Красновато-коричневый","Russet","755a57"],["Кофейный","Coffee","442d25"],["Бистр","Bistre","3d2b1f"],["Темно-коричневый","Dark brown","654321"],["Коричный","Cinnamon","7b3f00"],["Медвежьего ушка","Byron","834d18"],["Сепия","Sepia","704214"],["Умбра","Umber","734a12"],["Кирпичный","Brick","884535"],["Терракотовый","Terracotta","904d30"],["Коричневый","Brown","964b00"],["Камелопардовый","Camelopardalis","a25f2a"],["Краснобуро-оранжевый","Tenne","cd5700"],["Выгоревший оранжевый","Burnt Orange","cc5500"],["Шоколадный","Chocolate","d2691e"],["Охра","Ochre","cc7722"],["Медный","Copper","b87333"],["Светло-коричневый","Light brown","cd853f"],["Ванильный","Vanilla","d5713f"],["Рыжий","Reddish-brown","d77d31"],["Бронзовый","Bronze","cd7f32"],["Темно-золотой","Dark goldenrod","b8860b"],["Золотисто-березовый","Goldenrod","daa520"],["Гуммигут","Gamboge","e49b0f"],["Сиена","Siena","e28b00"],["Темно-мандариновый","Dark tangerine","ea7500"],["Тыквенный","Pumpkin","ff7518"],["Последний вздох Жако","Jaco","ff9218"],["Мандариновый","Tangerine","ff8800"],["Сигнальный оранжевый","Safety Orange","ff9900"],["Оранжевый","Orange","ffa500"],["Отборный желтый","Selective yellow","ffba00"],["Янтарный","Amber","ffbf00"],["Желтого школьного автобуса","School bus yellow","ffd800"],["Золотистый","Gold","ffd700"],["Горчичный","Mustard","ffdb58"],["Песочный","Sandy brown","fcdd76"],["Кожи буйвола","Buff","f0dc82"],["Старого льна","Flax","eedc82"],["Оранжево-персиковый","Peach orange","ffcc99"],["Белый навахо","Navajo white","ffdead"],["Темно-персиковый","Dark Peach","ffdab9"],["Желто-персиковый","Peach yellow","fadfad"],["Пшеничный","Wheat","f5deb3"],["Персиковый","Peach","ffe5b4"],["Желто-розовый","Yellow Pink","ffe4b2"],["Побега папайи","Papaya whip","ffefd5"],["Морской пены","Seashell","fff5ee"],["Белый","White","ffffff"],["Бежевый","Beige","f5f5dc"],["Льняной","Linen","faf0e6"],["Бедра испуганной нимфы","Scared nymph","faeedd"],["Сливочный","Light cream","f2e8c9"],["Пергидрольной блондинки","Perhydor","eee6a3"],["Желто-коричневый","Tan","d2b48c"],["Шамуа","Chamois","a08040"],["Темный желто-коричневый","Dark tan","918151"],["Хаки","Khaki","806b2a"],["Темный хаки","Dark Khaki","4c3c18"],["Оливковый","Olive","808000"],["Нежно-оливковый","Olive Drab","6b8e23"],["Латунный","Brass","b5a642"],["Темно-грушевый","Dark pear","d8a903"],["Старого золота","Old Gold","cfb53b"],["Шафрановый","Saffron","f4c430"],["Грушевый","Pear","efd334"],["Желтый","Yellow","ffff00"],["Лимонный","Lemon","fde910"],["Детской неожиданности","Child's surprise","f7f21a"],["Кукурузный","Corn","fbec5d"],["Вердепешевый","Vert-de-pеche","dad871"],["Лимонно-кремовый","Lemon Cream","fffacd"],["Слоновой кости","Ivory","fffddf"],["Кремовый","Cream","f2ddc6"],["Серого зеленого чая","Gray Tea Green","cadaba"],["Болотный","Swamp green","acb78e"],["Cпаржи","Asparagus","7ba05b"],["Защитный","Camouflage green","78866b"],["Темно-оливковый","Dark Olive","556832"],["Зеленого папоротника","Fern green","4f7942"],["Травяной","Grass","5da130"],["Влюбленной жабы","Toad in love","3caa3c"],["Вердепомовый","Vert-de-pomme","34c924"],["Зеленый","Green","00ff00"],["Ярко-зеленый","Bright green","66ff00"],["Ядовито-зеленый","Viridian","7fff00"],["Лаймовый","Lime","ccff00"],["Фисташковый","Pistachio","bef574"],["Желто-зеленый","Green-yellow","adff2f"],["Салатовый","Chartreuse","99ff99"],["Зеленой мяты","Mint Green","98ff98"],["Зеленого чая","Tea Green","d0f0c0"],["Темного зеленого чая","Dark Tea Green","badbad"],["Зеленого мха","Moss green","addfad"],["Серо-зеленый","Celadon","ace1af"],["Бледно-зеленый","Pale green","77dd77"],["Зелено-морской","Sea Green","2e8b57"],["Темно-зеленый","Dark green","013220"],["Красного моря","Red Sea","1f4037"],["Темный весенне-зеленый","Dark spring green","177245"],["Нефритовый","Jade","00a86b"],["Изумрудный","Emerald","50c878"],["Темный пастельно-зеленый","Dark pastel green","03c03c"],["Малахитовый","Malachite","0bda51"],["Весенне-зеленый","Spring Green","00ff7f"],["Аквамариновый","Aquamarine","7fffd4"],["Панг","Pang","c7fcec"],["Лягушки в обмороке","Fainted frog","7b917b"],["Маренго","Marengo","4c5866"],["Серой спаржи","Gray Asparagus","465945"],["Аспидно-серый","Dark slate gray","2f4f4f"],["Темно-бирюзовый","Dark turquoise","116062"],["Мурена","Moray","1c6b72"],["Зеленой сосны","Pine Green","01796f"],["Cине-зеленый","Teal","008080"],["Яйца дрозда","Robin egg blue","00cccc"],["Бирюзовый","Turquoise","30d5c8"],["Ярко-бирюзовый","Bright turquoise","08e8de"],["Циан","Cyan","00ffff"],["Электрик","Electric","7df9ff"],["Бледно-синий","Pale Blue","afeeee"],["Серебристый","Silver","c0c0c0"],["Светло-серый","Light Grey","bbbbbb"],["Кварцевый","Quartz","99958c"],["Серого шифера","Slate gray","708090"],["Серый","Gray","808080"],["Мокрого асфальта","Wet asphalt","505050"],["Антрацитовый","Anthracite","464451"],["Черный","Black","000000"],["Берлинской лазури","Prussian blue","003153"],["Сапфировый","Sapphire","082567"],["Полуночно-синий","Midnight Blue","003366"],["Темно-синий","Navy blue","000080"],["Ультрамариновый","Ultramarine","120a8f"],["Синей пыли","Powder blue","003399"],["Темно-лазурный","Dark cerulean","08457e"],["Черного моря","Black Sea","1a4780"],["Синий","Blue","0000ff"],["Кобальтовый","Cobalt","0047ab"],["Лазурно-синий","Cerulean blue","2a52be"],["Джинсовый","Denim","1560bd"],["Королевский синий","Royal Blue","4169e1"],["Лазурно-серый","Cerulean grey","007ba7"],["Синий Клейна","Klein Blue","3a75c4"],["Синей стали","Steel blue","4682b4"],["Воды пляжа Бонди","Bondi Blue","0095b6"],["Лазурный","Azure","007fff"],["Морской волны","Aqua","008cf0"],["Защитно-синий","Dodger blue","1e90ff"],["Голубой","Light Blue","42aaff"],["Васильковый","Cornflower blue","6495ed"],["Сизый","Bluish","79a0c1"],["Ниагара","Niagara","9db1cc"],["Небесный","Sky","7fc7ff"],["Бледно-васильковый","Pale cornflower blue","abcdef"],["Барвинковый","Periwinkle","ccccff"],["Гридеперлевый","Gris de perle","c7d0cc"],["Бороды Абдель-Керима","Abdel Kerim's beard","d5d5d5"],["Лавандовый","Lavender","e6e6fa"],["Чертополоховый","Thistle","d8bfd8"],["Сиреневый","Lilac","c8a2c8"],["Глициниевый","Wisteria","c9a0dc"],["Аметистовый","Amethyst","9966cc"],["Серобуромалиновый","Seroburomalinovyj","735184"],["Фиолетовый","Violet","8b00ff"],["Персидский синий","Persian blue","6600ff"],["Темно-фиолетовый","Dark violet","423189"],["Темный индиго","Dark Indigo","310062"],["Индиго","Indigo","4b0082"],["Темно-пурпурный","Purple","660099"],["Сливовый","Plum","660066"],["Фиолетово-баклажанный","Violet-eggplant","991199"],["Орхидеевый","Orchid","da70d6"],["Гелиотроповый","Heliotrope","df73ff"],["Фиалковый","Violaceous","ea8df7"],["Бледно-пурпурный","Pale magenta","f984e5"],["Фуксии","Fuchsia","f754e1"],["Звезды в шоке","Shocked star","ff47ca"],["Пурпурный","Magenta","ff00ff"],["Ярко-розовый","Hot pink","fc0fc0"],["Ярко-фиолетовый","Bright violet","cd00cd"],["Баклажановый","Eggplant","990066"],["Вишневый","Cherry","911e42"],["Розовато-лиловый","Mauve","993366"],["Фиолетово-красный","Red violet","c71585"],["Светло-вишневый","Cerise","de3163"],["Темно-розовый","Dark pink","e75480"],["Лиловый","Pale red-violet","db7093"],["Бледно-каштановый","Pale chestnut","ddadaf"],["Пюсовый","Puce","cc8899"],["Розовый Маунтбэттена","Mountbatten pink","997a8d"],["Бледный розовато-лиловый","Pale mauve","996666"],["Умбра жженая","Burnt umber","8a3324"],["Блошиного брюшка","Flea belly","4e1609"],["Бурый","Fulvous","45161c"],["Темно-алый","Dark Scarlet","560319"],["Бургундский","Burgundy","900020"],["Коричнево-малиновый","Maroon","800000"],["Сангиновый","Sanguine","92000a"],["Бисмарк-фуриозо","Bismarck-furious","a5260a"],["Бордовый","Wine red","9b2d30"],["Бледно-карминный","Pale carmine","af4035"],["Ржаво-коричневый","Rust","b7410e"],["Яндекса","Yandex","ffcc00"],["Твиттера","Twitter","1faee9"],["ВКонтакте","VKontakte","4d7198"],["Фейсбука","Facebook","3b5998"]];
			var langIndex = (lang == 'ru') ? 0:1;
			for(ci in colors) {
				ret += '<div style="width:16px;height:16px;float:left;margin:2px;overflow:hidden;cursor:pointer;background-color:#'+colors[ci][2]+';box-shadow:0 0 2px '+designDef.shadowColor+';border-radius:2px;" title="'+colors[ci][langIndex]+'" data-color="'+colors[ci][2]+'">&nbsp;</div>';
				}
			ret += '<br clear="all"></div>';
			return ret;
			}

		var btn = function(id, t) {
      return '<input type="button" id="'+id+'" value="'+(typeof t == 'undefined' ? kTranslations.ok : t)+'" style="padding: 3px 6px; border: 0; background: #777; color: #eee; cursor: pointer; border-radius: 5px;">';
      };
    var dialogs = {
			'font': {
				'form': function() {
					var fonts = ['','Arial', 'Tahoma', 'Verdana', 'Trebuchet MS', 'Calibri', 'Times New Roman', 'Georgia', 'Palatino Linotype', 'Courier New', 'Comic Sans', 'Monotype Corsiva', 'Impact'];
					var sizes = ['1', '2', '3', '4', '5', '6', '7'];
					var fontsSelect = '<select id="knedlik-forms-font-select" style="width:200px;">';
					for(f in fonts) {
						fontsSelect += '<option value="'+fonts[f]+'">'+fonts[f]+'</option>';
						}
					fontsSelect += '</select>';
					var form = fontsSelect+' <input id="knedlik-forms-font-size" type="text" style="width:25px;">pt '+btn('knedlik-forms-font-submit');
					return form;
					},
				'responder': function() {
					_('knedlik-forms-font-submit').onclick = function() {
						respFace = _('knedlik-forms-font-select').value;
						respSize = _('knedlik-forms-font-size').value;
						if(respFace!='' || parseInt(respSize)>4) {
							respStyle = '';
							if(respFace!='') respStyle += 'font-family:'+respFace+';';
							if(parseInt(respSize)>4) respStyle += 'font-size:'+respSize+'pt;';
							if(typeof range != 'undefined' && range!=null) { restoreSelection(range); }
							window.document.execCommand('RemoveFormat', false, null);
							insertHTML('<span style="'+respStyle+'">'+getSelText()+'</span>', range);
							}
						closeDropdown('font');
						}
					}
				},
			'link': {
				'form': function() {
					var form = '<div><input type="text" id="knedlik-forms-link-text" placeholder="URL"> '+btn('knedlik-forms-link-submit')+'</div><div style="padding-top:9px;"><input type="checkbox" id="knedlik-forms-link-check" style="display:inline;"> <label for="knedlik-forms-link-check" style="display:inline;">'+kTranslations.newwin+'</label></div><div style="padding-top:9px;"><a href="" id="knedlik-remove-link">'+kTranslations.unlink+'</a></div>';
					return form;
					},
				'responder': function() {
					_('knedlik-forms-link-submit').onclick = function() {
						resp = _('knedlik-forms-link-text').value;
						if(resp.indexOf('www.')>-1 && resp.indexOf('http://')==-1) resp = 'http://'+resp;
						if(typeof range != 'undefined' && range!=null) { restoreSelection(range); } 
						if(_('knedlik-forms-link-check').checked==true) { 
							insertHTML('<a href="'+resp+'" target="_blank">'+getSelText()+'</a>', range); 
							} 
						else { 
							window.document.execCommand('CreateLink', false, resp); 
							}
						closeDropdown('link');
						}
					_('knedlik-remove-link').onclick = function() {
						if(typeof range != 'undefined' && range!=null) { restoreSelection(range); }
						window.document.execCommand('Unlink', false, null);
						closeDropdown('link');
						return false;
						}
					}
				},
			'diacritic': {
				'form': function() {
					var diacr = ['Á', 'á', 'À', 'à', 'Â', 'â', 'Ä', 'ä', 'Ã', 'ã', 'Å', 'å', 'Ą', 'ą', 'Ā', 'ā', 'Ă', 'ă', 'Æ', 'æ', 'Ç', 'ç', 'Č', 'č', 'Ć', 'ć', 'Ð', 'ð', 'đ', 'Ď', 'ď', 'É', 'é', 'È', 'è', 'Ê', 'ê', 'Ë', 'ë', 'Ě', 'ě', 'Ę', 'ę', 'Ē', 'ē', 'Ė', 'ė', 'Ə', 'ə', 'Ğ', 'ğ', 'Ĝ', 'ĝ', 'Í', 'í', 'Ì', 'ì', 'Î', 'î', 'Ï', 'ï', 'Ī', 'ī', 'Į', 'į', 'İ', 'ı', 'Ĵ', 'ĵ', 'Ł', 'ł', 'Ñ', 'ñ', 'Ň', 'ň', 'Ń', 'ń', 'Ó', 'ó', 'Ò', 'ò', 'Ô', 'ô', 'Ö', 'ö', 'Ő', 'ő', 'Õ', 'õ', 'Ø', 'ø', 'Ơ', 'ơ', 'Œ', 'œ', 'Þ', 'þ', 'Ř', 'ř', 'Ş', 'ş', 'Š', 'š', 'Ś', 'ś', 'Ť', 'ť', 'Ţ', 'ţ', 'Ú', 'ú', 'Ù', 'ù', 'Û', 'û', 'Ü', 'ü', 'Ű', 'ű', 'Ů', 'ů', 'Ū', 'ū', 'Ư', 'ư', 'Ý', 'ý', 'ÿ', 'Ž', 'ž', 'Ź', 'ź', 'Ż', 'ż', 'ß', '&#769;', '|', 'Α', 'α', 'Β', 'β', 'Γ', 'γ', 'Δ', 'δ', 'Ε', 'ε', 'Ζ', 'ζ', 'Η', 'η', 'Θ', 'θ', 'Ι', 'ι', 'Κ', 'κ', 'Λ', 'λ', 'Μ', 'μ', 'Ν', 'ν', 'Ξ', 'ξ', 'Ο', 'ο', 'Π', 'π', 'Ρ', 'ρ', 'Σ', 'σ', 'ς', 'Τ', 'τ', 'Υ', 'υ', 'Φ', 'φ', 'Χ', 'χ', 'Ψ', 'ψ', 'Ω', 'ω', '|', '♥', '↑', '↓', '→', '←', '♪', '♫', '♂', '♀', '☺', '•'];
					if(prefs.chars && prefs.chars.length>0) diacr = diacr.concat(['|']).concat(prefs.chars);
					var diacrs = '';
					for(d in diacr) {
						diacrs += (diacr[d]=='|') ? '<br clear="all">' : '<div style="display:block; float:left; height:20px; line-height:20px; overflow:hidden; padding:0 5px; margin:0 4px 4px 0; border-radius:1px; box-shadow:0 0 3px '+designDef.shadowBtn+'; cursor:pointer; color:'+designDef.colorBtn+'; font-family:Courier New, monospace; font-size:10.5pt;" title="'+diacr[d]+'">'+diacr[d]+'</div>';
						}
					return '<div id="diacriticbuttons" style="width:320px;">'+diacrs+'<br clear="all"></div>';
					},
				'responder': function() {
					var getDiacrButtons = _('diacriticbuttons').getElementsByTagName('div');
					for(di in getDiacrButtons) {
						getDiacrButtons[di].onclick = function() {
							getChar = html(this);
							if(typeof range != 'undefined' && range!=null) { restoreSelection(range); }
							insertHTML(getChar, range);
							closeDropdown('diacritic');
							}
						}
					}
				},
			'fgcolor': {
				'form': function() {
					return colorize('fg');
					},
				'responder': function() {
					var getColorButtons = _('colorbuttons-fg').getElementsByTagName('div');
					for(ic in getColorButtons) {
						if(getColorButtons[ic].title) {
							getColorButtons[ic].onclick = function() {
								getColor = '#'+this.getAttribute('data-color');
								if(typeof range != 'undefined' && range!=null) { restoreSelection(range); }
								window.document.execCommand('ForeColor', false, getColor);
								closeDropdown('fgcolor');
								}
							}
						}
					}
				},
			'bgcolor': {
				'form': function() {
					return colorize('bg');
					},
				'responder': function() {
					var getColorButtons = _('colorbuttons-bg').getElementsByTagName('div');
					for(ic in getColorButtons) {
						if(getColorButtons[ic].title) {
							getColorButtons[ic].onclick = function() {
								getColor = '#'+this.getAttribute('data-color');
								if(typeof range != 'undefined' && range!=null) { restoreSelection(range); }
								if(isIE()==true) { window.document.execCommand('BackColor', false, getColor); }
								else { window.document.execCommand('HiliteColor', false, getColor); }
								closeDropdown('bgcolor');
								}
							}
						}
					}
				},
			'html': {
				'form': function() {
					var form = '<textarea id="knedlik-forms-html-text" cols="30" rows="15">'+html(editor)+'</textarea><div style="padding-top: 9px;">'+btn('knedlik-forms-html-submit')+'</div>';
					return form;
					},
				'responder': function() {
					_('knedlik-forms-html-submit').onclick = function() {
						resp = _('knedlik-forms-html-text').value;
						if(typeof range != 'undefined' && range!=null) { restoreSelection(range); }
						html(editor, resp);
						html(el, resp);
						closeDropdown('html');
						}
					}
				},
			'plushtml': {
				'form': function() {
					var form = '<textarea id="knedlik-forms-plushtml-text" cols="30" rows="15"></textarea><div style="padding-top: 9px;">'+btn('knedlik-forms-plushtml-submit')+'</div>';
					return form;
					},
				'responder': function() {
					_('knedlik-forms-plushtml-submit').onclick = function() {
						resp = _('knedlik-forms-plushtml-text').value;
						if(typeof range != 'undefined' && range!=null) { restoreSelection(range); }
						insertHTML(resp, range);
						closeDropdown('plushtml');
						}
					}
				},
			'image': {
				'form': function() {
					var form = '<input type="text" id="knedlik-forms-image-url" placeholder="'+kTranslations.imageURL+'" style="width:150px;"> <input type="button" id="knedlik-forms-image-submit" value="'+kTranslations.ok+'">';
					if(prefs.upload && prefs.upload!='') {

						if(!_('knedlik-forms-imageupload-form')) {
							var uploadTmpForm = document.createElement('form');
							uploadTmpForm.id = 'knedlik-forms-imageupload-form';
							uploadTmpForm.name = 'knedlik-forms-imageupload-form';
							uploadTmpForm.method = 'POST';
							uploadTmpForm.enctype = 'multipart/form-data';
							uploadTmpForm.action = prefs.upload;
							uploadTmpForm.target = 'knedlik-form-iframe-imageupload';
							document.getElementsByTagName('body')[0].appendChild(uploadTmpForm);
							}

						form += '<iframe style="display:none;" id="knedlik-form-iframe-imageupload" name="knedlik-form-iframe-imageupload" src="'+prefs.upload+'"></iframe><div style="padding:15px 0 5px;" id="knedlik-forms-imageupload-msgbox">'+kTranslations.imageUpload+'</div><div id="knedlik-forms-imageupload-placeholder"><input name="file" id="file" type="file" form="knedlik-forms-imageupload-form"> <input type="submit" id="knedlik-forms-imageupload-submit" value="'+kTranslations.ok+'" form="knedlik-forms-imageupload-form"></div>';
						}
					return form;
					},
				'responder': function() {
					_('knedlik-forms-image-submit').onclick = function() {
						resp = _('knedlik-forms-image-url').value;
						if(resp!='') {
							if(typeof range != 'undefined' && range!=null) { restoreSelection(range); }
							window.document.execCommand('InsertImage', false, resp);
							}
						closeDropdown('image');
						}
          if(_('knedlik-forms-imageupload-submit')) {
            _('knedlik-forms-imageupload-submit').onclick = function() {
              toggle(_('knedlik-forms-imageupload-placeholder'));
              html(_('knedlik-forms-imageupload-msgbox'), '<b>'+kTranslations.imageUploading+'</b>');
              checkUpload = function() {
                var answer = _('knedlik-form-iframe-imageupload').contentWindow.document.body.innerHTML;
                if(answer=='') {
                  uptimer = setTimeout(function(){ checkUpload(); },500);
                  }
                else if(answer=='error') {
                  closeDropdown('image');
                  }
                else {
                  resp = answer;
                  if(typeof range != 'undefined' && range!=null) { restoreSelection(range); }
                  if(resp.toLowerCase().indexOf('<img')>-1) {
                    insertHTML(resp, range);
                    }
                  else {
                    window.document.execCommand('InsertImage', false, resp);
                    }
                  if(typeof uptimer != 'undefined') { clearTimeout(uptimer); delete uptimer; }
                  closeDropdown('image');
                  }
                }
              checkUpload();
              }
            }
					}
				},
			'table': {
				'form': function() {
					var form = '<input type="text" id="knedlik-forms-table-cols" value="2" style="width:35px; display:inline;"> '+kTranslations.tableCols+'<br><input type="text" id="knedlik-forms-table-rows" value="3" style="width:35px; display:inline;"> '+kTranslations.tableRows+'<br><input type="checkbox" id="knedlik-forms-table-headers" checked="1" style="display:inline;"> <label for="knedlik-forms-table-headers" style="display:inline;">'+kTranslations.tableHeaders+'</label><br><input type="checkbox" id="knedlik-forms-table-border" checked="1" style="display:inline;"> <label for="knedlik-forms-table-border" style="display:inline;">'+kTranslations.tableBorder+'</label><br><input type="button" id="knedlik-forms-table-submit" value="'+kTranslations.ok+'">';
					return form;
					},
				'responder': function() {
					_('knedlik-forms-table-submit').onclick = function() {
						getCols = _('knedlik-forms-table-cols').value;
						getRows = _('knedlik-forms-table-rows').value;
						if(parseInt(getCols)>0 && parseInt(getRows)>0) {
							var tableMarkup = '<table'+(_('knedlik-forms-table-border').checked==true?' border="1"':'')+'>';
							var tableCounter = 0;
							for(tr=1;tr<=getRows;tr++) {
								tableMarkup += '<tr>';
									var cellTag = (tr<2 && _('knedlik-forms-table-headers').checked==true) ? 'th' : 'td';
										for(tc=1;tc<=getCols;tc++) {
											tableCounter++;
											tableMarkup += '<'+cellTag+'>'+tableCounter+'</'+cellTag+'>';
											}
								tableMarkup += '</tr>';
								}
							tableMarkup += '</table>';
							}
						if(typeof range != 'undefined' && range!=null) { restoreSelection(range); }
						insertHTML(tableMarkup, range);
						closeDropdown('table');
						}
					}
				}
			}

		var prepareOpt = function(s){
			return (isIE()==true) ? '<'+s.toUpperCase()+'>' : s;
			};
		var optCSS = {cssFloat:'none', clear:'both', width:'111px', textAlign:'left'};
    var displayImg = function(src) {
      return '<span style="line-height: '+(designDef.sizeBtn-3)+'px;"><img src="data:image/gif;base64,'+src+'" style="vertical-align: middle; margin-top: -1px;"></span>';
      };
		var buttons = {
			'format': { 'name': kTranslations.formatName, 'dropdown': true },
				'bold': { 'name': kTranslations.boldName, 'css': {fontWeight:'bold'}, 'cmd': 'Bold', 'kbd': 'Ctrl+B', 'inside': 'format' }, 
				'italic': { 'name': kTranslations.italicName, 'css': {fontStyle:'italic'}, 'cmd': 'Italic', 'kbd': 'Ctrl+I', 'inside': 'format' }, 
				'underline': { 'name': kTranslations.underlineName, 'css': {textDecoration:'underline'}, 'cmd': 'Underline', 'kbd': 'Ctrl+U', 'inside': 'format' },
				'strike': { 'name': 'abc', 'css': {textDecoration:'line-through'}, 'cmd': 'StrikeThrough', 'inside': 'format' },
					'special-000': { 'name': '|', 'inside': 'format' },
				'sub': { 'name': 'x<sub style="font-size:6pt; color:'+designDef.colorizeH+'">2</sub>', 'cmd': 'SubScript', 'inside': 'format' },
				'sup': { 'name': '<span style="position:relative;top:-3px;">x<sup style="font-size:6pt; color:'+designDef.colorizeH+'">2</sup></span>', 'cmd': 'SuperScript', 'inside': 'format' },
				'clear-format': { 'name': kTranslations.formatName, 'css': {fontSize:'8pt', textDecoration:'line-through'}, 'cmd': 'RemoveFormat', 'inside': 'format' },

			'font': { 'name': kTranslations.fontName, 'dropdown': true },

			'markup': { 'name': kTranslations.markupName, 'dropdown': true },
				'markup-p': { 'name': kTranslations.markupPName, 'css': optCSS, 'cmd': 'FormatBlock', 'opt': prepareOpt('p'), 'inside': 'markup' },
				'markup-h1': { 'name': kTranslations.markupH1Name, 'css': optCSS, 'cmd': 'FormatBlock', 'opt': prepareOpt('h1'), 'inside': 'markup' },
				'markup-h2': { 'name': kTranslations.markupH2Name, 'css': optCSS, 'cmd': 'FormatBlock', 'opt': prepareOpt('h2'), 'inside': 'markup' },
				'markup-h3': { 'name': kTranslations.markupH3Name, 'css': optCSS, 'cmd': 'FormatBlock', 'opt': prepareOpt('h3'), 'inside': 'markup' },
				'markup-h4': { 'name': kTranslations.markupH4Name, 'css': optCSS, 'cmd': 'FormatBlock', 'opt': prepareOpt('h4'), 'inside': 'markup' },
				'markup-pre': { 'name': kTranslations.markupPreName, 'css': optCSS, 'cmd': 'FormatBlock', 'opt': prepareOpt('pre'), 'inside': 'markup' },

			'align': { 'name': displayImg('R0lGODlhFgAWAID/AMDAwAAAACH5BAEAAAAALAAAAAAWABYAQAIghI+py+0Po5y02ouz3jL4D4JMGELkGYxo+qzl4nKyXAAAOw=='), 'cmd': 'JustifyLeft', 'dropdown': true },
				'align-left': { 'name': displayImg('R0lGODlhFgAWAID/AMDAwAAAACH5BAEAAAAALAAAAAAWABYAQAIghI+py+0Po5y02ouz3jL4D4JMGELkGYxo+qzl4nKyXAAAOw=='), 'cmd': 'JustifyLeft', 'inside': 'align' },
				'align-center': { 'name': displayImg('R0lGODlhFgAWAID/AMDAwAAAACH5BAEAAAAALAAAAAAWABYAQAIfhI+py+0Po5y02ouz3jL4D4JOGI7kaZ5Bqn4sycVbAQA7'), 'cmd': 'JustifyCenter', 'inside': 'align' },
				'align-right': { 'name': displayImg('R0lGODlhFgAWAID/AMDAwAAAACH5BAEAAAAALAAAAAAWABYAQAIghI+py+0Po5y02ouz3jL4D4JQGDLkGYxouqzl43JyVgAAOw=='), 'cmd': 'JustifyRight', 'inside': 'align' },

			'link': { 'name': 'A', 'css': {color:designDef.colorizeA, textDecoration:'underline'}, 'dropdown': true },
			
			'image': { 'name': displayImg('R0lGODlhFgAWAMQYAKbN/+O6abvd/7PW/8edSv3+/+z2/+j0/+Xy/+Lw//T5//f7/9/v//r9//D3/4m1/26g/9XHn5jB/3up/93u/7LK4maZ/////9jY7AAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABgALAAAAAAWABYAAAV6ICaOZGmeaKqubItVcCzLaHXdeH5XdWH9wGCBd6o0IMikskE0VRaTqHS6aJYqiod2y1VYSRWHZEwuO76jigHABhDabANaVDkM7gEC4X4/zF8IAgIBhHqCAgh/FQmDhIUEggmKDBGVlpcMihSbnJ2bijOhMC6kpaanLCEAOw=='), 'dropdown': true },
			
			'lists': { 'name': displayImg('R0lGODlhFgAWAMIGAAAAAB1ChF9vj1iE33mOrqezxv///////yH5BAEAAAcALAAAAAAWABYAAAMyeLrc/jDKSesppNhGRlBAKIZRERBbqm6YtnbfMY7lud64UwiuKnigGQliQuWOyKQykgAAOw=='), 'dropdown': true },
				'ul': { 'name': displayImg('R0lGODlhFgAWAMIGAAAAAB1ChF9vj1iE33mOrqezxv///////yH5BAEAAAcALAAAAAAWABYAAAMyeLrc/jDKSesppNhGRlBAKIZRERBbqm6YtnbfMY7lud64UwiuKnigGQliQuWOyKQykgAAOw=='), 'cmd': 'InsertUnorderedList', 'inside': 'lists' },
				'ol': { 'name': displayImg('R0lGODlhFgAWAMIGAAAAADljwliE35GjuaezxtHa7P///////yH5BAEAAAcALAAAAAAWABYAAAM2eLrc/jDKSespwjoRFvggCBUBoTFBeq6QIAysQnRHaEOzyaZ07Lu9lUBnC0UGQU1K52s6n5oEADs='), 'cmd': 'InsertOrderedList', 'inside': 'lists' },

			'plushtml': { 'name': '+&nbsp;HTML', 'css': {fontSize:'8pt'}, 'dropdown': true },
			
			'fgcolor': { 'name': kTranslations.fgName, 'css': {color:designDef.colorize}, 'dropdown': true },
			'bgcolor': { 'name': kTranslations.bgName, 'css': {color:designDef.colorize}, 'dropdown': true },

			'table': { 'name': displayImg('R0lGODlhFgAWAJECAKa7zqWlpdjY7AAAACH5BAEAAAIALAAAAAAWABYAAAI8lI+py+0PY5i02qAC2Lx3nGjeuIHIhVLZyR6m2xrvK8fCvMJ6HaZozgvegMNd0YYzCpNCme8SiUqn1GkBADs='), 'dropdown': true },

			'symbols': { 'name': kTranslations.symName, 'dropdown': true },
				'sym-mdash': { 'name': '&mdash;', 'insert': ' &mdash; ', 'inside': 'symbols' },
				'sym-ndash': { 'name': '&ndash;', 'insert': ' &ndash; ', 'inside': 'symbols' },
				'sym-hellip': { 'name': '&hellip;', 'insert': '&hellip;', 'inside': 'symbols' },
					'special-001': { 'name': '|', 'inside': 'symbols' },
				'sym-sect': { 'name': '&sect;', 'insert': '&sect; ', 'inside': 'symbols' },
				'sym-deg': { 'name': '&deg;', 'insert': '&deg;', 'inside': 'symbols' },
				'sym-times': { 'name': '&times;', 'insert': '&times;', 'inside': 'symbols' },
				'sym-asymp': { 'name': '&asymp;', 'insert': '&asymp;', 'inside': 'symbols' },
				'sym-apo': { 'name': '&#146;', 'insert': '&#146;', 'inside': 'symbols' },
					'special-002': { 'name': '|', 'inside': 'symbols' },
				'sym-euro': { 'name': '&euro;', 'insert': '&euro;', 'inside': 'symbols' },
				'sym-copy': { 'name': '&copy;', 'insert': '&copy; ', 'inside': 'symbols' },
				'sym-reg': { 'name': '&reg;', 'insert': '&reg;', 'inside': 'symbols' },
				'sym-tm': { 'name': '&trade;', 'insert': '&trade;', 'inside': 'symbols' },
					'special-003': { 'name': '|', 'inside': 'symbols' },
				'sym-q': { 'name': '&laquo;&hellip;&raquo;', 'outtext1': '&laquo;', 'outtext2': '&raquo;', 'inside': 'symbols' },
				'sym-inq': { 'name': '&bdquo;&hellip;&ldquo;', 'outtext1': '&bdquo;', 'outtext2': '&ldquo;', 'inside': 'symbols' },
				'sym-enq': { 'name': '&ldquo;&hellip;&rdquo;', 'outtext1': '&ldquo;', 'outtext2': '&rdquo;', 'inside': 'symbols' },
			'diacritic': { 'name': '&Aring;&aring;', 'dropdown': true },
			
			'html': { 'name': 'HTML', 'css': {fontSize:'8pt', color:designDef.colorizeH}, 'dropdown': true }
			}
		var buttonsPassed = {};
		if(prefs.buttons) {
			for(bt in prefs.buttons) { 
				var key = prefs.buttons[bt];
				if(typeof buttons[key] != 'undefined') { buttonsPassed[key] = buttons[key]; } 
				}
			}
		else {
			buttonsPassed = buttons;
			}

		if(prefs.outside) {
			for(ot in prefs.outside) { 
				outkey = prefs.outside[ot];
				if(typeof buttons[outkey] != 'undefined') { delete buttonsPassed[outkey].inside; } 
				}
			}
		if(prefs.exclude) {
			for(ex in prefs.exclude) { 
				exkey = prefs.exclude[ex];
				if(typeof buttons[exkey] != 'undefined') { delete buttonsPassed[exkey]; } 
				}
			}

		for(ij in buttonsPassed) {
			var button = buttonsPassed[ij];
			var addButton = document.createElement('div');
			addButton.id = 'knedlik-editor-'+knedlikEditorNb+'-button-'+ij;
			var where = (button.inside && _('knedlik-editor-'+knedlikEditorNb+'-panel-dropdown-'+button.inside)) ? _('knedlik-editor-'+knedlikEditorNb+'-panel-dropdown-'+button.inside) : panelInner;
			if(button.name=='|') {
				where.appendChild(addButton);
				html(addButton, '&nbsp;');
				css(addButton, { height:'2px', cssFloat:'none', clear:'both' });
				}
			else {
				where.appendChild(addButton);
				css(addButton, { boxSizing: 'border-box', display:'inline-block', border: '1px solid '+designDef.borderBtn, height:designDef.sizeBtn+'px', lineHeight:parseFloat(designDef.sizeBtn-1)+'px', minWidth:designDef.sizeBtn+'px', padding:'0 '+Math.ceil(designDef.sizeBtn/5)+'px', textAlign:'center', color:designDef.colorBtn, fontSize:designDef.fontSizeBtn+'pt', fontFamily:'Tahoma, Sans-Serif', cursor:'pointer', margin:'1px', cssFloat:'left', boxShadow:'0 0 2px '+designDef.shadowBtn, borderRadius:'3px', background:designDef.backgroundBtn });
				if(prefs.style && prefs.style=='flat') { css(addButton, { boxShadow:'none', borderRadius:'0' }); }
				if(button.css) css(addButton, button.css);
				html(addButton, button.name);
				kbdtooltip = (button.kbd) ? ' ('+button.kbd+')' : '';
				if(kTranslations[ij]) attr(addButton, { 'title': kTranslations[ij]+kbdtooltip });
				attr(addButton, { 'data-rel': ij });
				buttonLeft = addButton.offsetLeft;
				buttonTop = addButton.offsetTop;

				if(button.dropdown) {
					var panelDropdown = document.createElement('div');
					panelDropdown.id = 'knedlik-editor-'+knedlikEditorNb+'-panel-dropdown-'+ij;
					panelInner.appendChild(panelDropdown);
					css(panelDropdown, {position:'absolute', left:(parseInt(buttonLeft)-1)+'px', top:(parseInt(buttonTop)+29)+'px', background:designDef.backgroundDrop, marginLeft:'1px', border: '1px solid '+designDef.borderDrop, padding:'9px', paddingTop:'25px', textAlign:'left', color:designDef.colorBtn, fontSize:'9pt', fontFamily:'Sans-Serif', boxShadow:'0 0 2px '+designDef.shadowDrop, borderRadius:'3px', display:'none', minWidth:'250px', zIndex:'10000' });
					if(prefs.style && prefs.style=='flat') { css(panelDropdown, { boxShadow:'none', borderRadius:'0' }); }
					attr(panelDropdown, {'class': 'knedlik-editor-'+knedlikEditorNb+'-panel-dropdown'});
					}

				addButton.onmouseover = function() { 
					css(this, {border:'1px solid '+designDef.borderActive, boxShadow:'0 0 2px '+designDef.shadowActive}); 
					if(prefs.style && prefs.style=='flat') { css(this, { boxShadow:'none' }); }
					}
				addButton.onmouseout = function() { 
					css(this, {border:'1px solid '+designDef.borderBtn, boxShadow:'0 0 2px '+designDef.shadowBtn});
					if(prefs.style && prefs.style=='flat') { css(this, { boxShadow:'none' }); }
					}
				addButton.onmousedown = function(event) {
					var _this = this;
					var rel = attr(_this, 'data-rel');
					range = saveSelection();
					if(typeof range != 'undefined' && range!=null) { restoreSelection(range); }
					if(_('knedlik-editor-'+knedlikEditorNb+'-panel-dropdown-'+rel)) {
						closeAllDropdowns(rel);
						var disp = toggle(_('knedlik-editor-'+knedlikEditorNb+'-panel-dropdown-'+rel), _this);
						if(disp=='block') {
							css(_this, {background:designDef.backgroundActive});
							if(typeof dialogs[rel] != 'undefined') {
								thisDialog = dialogs[rel];
								if(thisDialog.form && thisDialog.responder) {
									html(_('knedlik-editor-'+knedlikEditorNb+'-panel-dropdown-'+rel), thisDialog.form()); 
									thisDialog.responder();
									}
								}
							var addCloser = document.createElement('div');
							addCloser.id = 'knedlik-editor-'+knedlikEditorNb+'-button-closer-'+rel;
							_('knedlik-editor-'+knedlikEditorNb+'-panel-dropdown-'+rel).appendChild(addCloser);
							html(addCloser, '&times;');
							css(addCloser, {position:'absolute', top:'3px', right:'5px', color:designDef.colorClose, cursor:'pointer', fontSize:'12pt'});
							attr(addCloser, {'title':kTranslations.close});
							_('knedlik-editor-'+knedlikEditorNb+'-button-closer-'+rel).onclick = function() { closeDropdown(rel); };
							}
						else {
							if(_('knedlik-editor-'+knedlikEditorNb+'-button-closer-'+rel)) { _('knedlik-editor-'+knedlikEditorNb+'-button-closer-'+rel).parentNode.removeChild(_('knedlik-editor-'+knedlikEditorNb+'-button-closer-'+rel)); }
							css(_this, {background:designDef.backgroundBtn});
							}
						}
					else {
						var cmd = buttons[rel].cmd;
						if(buttons[rel].insert) {
							insertHTML(buttons[rel].insert, range);
							}
						else if(buttons[rel].outtext1 && buttons[rel].outtext2) {
							insertHTML(buttons[rel].outtext1+getSelText()+buttons[rel].outtext2, range);
							}
						else {
							var opt = (buttons[rel].opt) ? buttons[rel].opt : null;
							window.document.execCommand(cmd, false, opt);
							}
						if(buttons[rel].inside && _('knedlik-editor-'+knedlikEditorNb+'-panel-dropdown-'+buttons[rel].inside)) {
							closeDropdown(buttons[rel].inside);
							}
						html(el, html(editor));
						}
					
					event.preventDefault();
					return false;
					}
				}
			}
		var panelFloatCrutch = document.createElement('br');
		panel.appendChild(panelFloatCrutch);
		attr(panelFloatCrutch,{clear:'all'});
		editor.onclick = function() {
			closeAllDropdowns();
			}

		// updating
		editor.onkeyup = function() {
			html(el, html(editor));
			}
		editor.onmouseup = function() {
			html(el, html(editor));
			}

		}
	// applying editor
	if(elem == '') { el = document.getElementsByTagName('textarea')[0]; }
	else { el = _(elem); }
	if(el) { process(el); }
	else { setTimeout(function() { knedlik(elem, prefs); },10); };
	}