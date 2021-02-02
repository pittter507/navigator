function jsInclude(src, callback) { var head = document.getElementsByTagName('head')[0]; var script = document.createElement('script'); script.type = 'text/javascript'; if(callback) { var userAgent = navigator.userAgent.toLowerCase(); if(/msie/.test( userAgent ) && !/opera/.test( userAgent )) { script.onreadystatechange = function() { if(script.readyState == 'complete') callback(); } } else { script.onload = function() { callback(); } } } script.src = src; head.appendChild(script); }

function _(id) { return document.getElementById(id); }

function ajaxLoad(url, obj, elem_id, method, callback) { function getXmlHttp() { var xmlhttp; try { xmlhttp = new ActiveXObject("Msxml2.XMLHTTP"); } catch(e) { try { xmlhttp = new ActiveXObject("Microsoft.XMLHTTP"); } catch(E) { xmlhttp = false; } } if(!xmlhttp && typeof XMLHttpRequest!='undefined') { xmlhttp = new XMLHttpRequest(); } return xmlhttp; } if(typeof method == 'undefined' || method == '') { method = 'POST'; } if(typeof obj == 'undefined' || obj == '' || method == 'GET') { param = null; } else { var param = ''; var paramN = 0; for(k in obj) { if(paramN>0) { param += '&'; }  param += k+'='+encodeURIComponent(obj[k]); paramN++; } } var req = getXmlHttp(); var elem = (typeof elem_id != 'undefined' && elem_id != '' && _(elem_id)) ? _(elem_id) : ''; req.onreadystatechange = function() { if(req.readyState == 4) { if(elem != '') { elem.innerHTML = req.statusText; } if(req.status == 200) { if(elem != '') { elem.innerHTML = req.responseText; } if(typeof callback != 'undefined' && callback != '') { callback(); } } } }; var mx = 100; var nx = 1000000; var rndx = Math.floor( Math.random( ) * (nx - mx + 1) ) + mx; req.open(method, url+(url.indexOf('?')>0?'&':'?')+'ajax&rnd='+rndx, true); if(method=='POST') { req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); } req.send(param); if(elem != '') { elem.innerHTML = '...'; } return; }

function walkAround(tagname, clsname, func) { var getElems = document.getElementsByTagName(tagname); if(typeof clsname == 'undefined') { clsname = ''; } for(i=0; i<getElems.length; i++) { if(clsname == '' || getElems[i].className.indexOf(clsname)==-1) { continue; } _elem = getElems[i]; func(); } }



var scripts = document.getElementsByTagName('script'),
  index = scripts.length - 1,
  myScript = scripts[index],
  scriptUrlParts = myScript.src.split('meruert.js'),
  scriptBaseFolder = scriptUrlParts[0]
  isMobile = parseInt(screen.width)<=800 ? 1:0;

var getMeruertJS = function() {
	// processing

	// Lang
	var currentLang = document.getElementsByTagName('html')[0].lang;
	if(currentLang=='') { currentLang = 'en'; }

	// Vote Polls
	pollTypes = ['heart','plus','minus'];
	for(i in pollTypes) {
		walkAround('a', 'rating-'+pollTypes[i], function(){
			_elem.onclick = function() {
				var getLink = this.href;
				var getId = this.id.split('-')[2];
				ajaxLoad(getLink, '', 'rating-results-'+getId);
				var getInner = this.innerHTML;
				var insteadElem = document.createElement('SPAN');
				insteadElem.innerHTML = getInner;
				this.parentNode.insertBefore(insteadElem, this);
				this.parentNode.removeChild(this);
				return false;
				}
			});
		}
	// end Vote Polls

	// Slideshow
	walkAround('a', 'attached_image_link', function(){
		_elem.onclick = function() {
			var getImage = this.href;
			var getParent = this.parentNode;
			var getInnerChildren = getParent.childNodes;
			if(getInnerChildren.length<2 && getParent.id != 'avatar') {
				getInnerChildren = document.querySelectorAll('#content a.attached_image_link');
				}
			if(getInnerChildren.length<1) {
				getInnerChildren = document.querySelectorAll('a.attached_image_link');
				}
			var localImageSet = new Array();
			q = 0;
			for(i in getInnerChildren) {
				getInnerChildrenHref = new String(getInnerChildren[i].href);
				if(getInnerChildrenHref!='undefined') {
					localImageSet[q] = getInnerChildrenHref;
					q++;
					}
				}
			var localImageLast = localImageSet.length-1;
			var getLargeImage = getImage;
			if(getImage.indexOf('large')>-1) {
				getImage = getImage.replace('large/','');
				}
			var body = document.getElementsByTagName('body')[0];
			var shadowZone = document.createElement('div');
			shadowZone.setAttribute('style','width:100%; height:100%; position:fixed; left:0; top:0; background:#000; opacity:0.99; z-index:25000;');
			shadowZone.setAttribute('id','shadowZone');
			body.appendChild(shadowZone);
			var imgZone = document.createElement('div');
			imgZone.setAttribute('style','width:100%; height:100%; position:fixed; left:0; top:0; background:url('+getImage+') no-repeat center center; z-index:30000; background-size:contain;');
			imgZone.setAttribute('id','imgZone');
			body.appendChild(imgZone);
			var revZone = document.createElement('div');
			revZone.setAttribute('id','revZone');
			body.appendChild(revZone);
			var xZone = document.createElement('div');
			xZone.innerHTML = '&times;';
			xZone.setAttribute('style','position:fixed; '+(isMobile>0 ? 'right:15px; top:10px;' : 'right:50px; top:40px;')+' z-index:32000; font-size:30pt; font-weight:bold; color:#aaa; cursor:pointer;');
			xZone.setAttribute('id','xZone');
			imgZone.appendChild(xZone);
			var lnkZone = document.createElement('div');
			getLargeImageElements = getLargeImage.split('/');
			lnkZone.innerHTML = '<a href="'+getLargeImage+'" target="_blank" style="color:#555; border-bottom:1px solid #333; text-decoration:none; font-weight:bold;" title="'+getLargeImageElements[getLargeImageElements.length-1]+'">&darr;</a>';
			lnkZone.setAttribute('style','position:fixed; '+(isMobile>0 ? 'left:15px; top:15px;' : 'left:50px; top:55px;')+' z-index:32000; font-size:10pt; color:#fff;');
			lnkZone.setAttribute('id','lnkZone');
			imgZone.appendChild(lnkZone);
			document.getElementsByTagName('body')[0].style.height='100%';
			document.getElementsByTagName('body')[0].style.overflow='hidden';
			if(getLargeImage!=localImageSet[0]) {
				var leftArrowZone = document.createElement('div');
				leftArrowZone.innerHTML = '&larr;';
				leftArrowZone.setAttribute('style','position:fixed; left:'+(isMobile>0 ? 15 : 50)+'px; top:40%; z-index:32000; font-size:24pt; font-weight:bold; color:#aaa; cursor:pointer; font-family:Monospace;');
				leftArrowZone.setAttribute('id','leftArrowZone');
				imgZone.appendChild(leftArrowZone);
				leftArrowZone.onclick = function(e) {
					revZone.click();
					e.stopPropagation();
					}
				}
			if(getLargeImage!=localImageSet[localImageLast]) {
				var rightArrowZone = document.createElement('div');
				rightArrowZone.innerHTML = '&rarr;';
				rightArrowZone.setAttribute('style','position:fixed; right:'+(isMobile>0 ? 15 : 50)+'px; top:40%; z-index:32000; font-size:24pt; font-weight:bold; color:#aaa; cursor:pointer; font-family:Monospace;');
				rightArrowZone.setAttribute('id','rightArrowZone');
				imgZone.appendChild(rightArrowZone);
				}
			eraseShadowNodes = function(event) {
				event = event || window.event;
				xZone.parentNode.removeChild(xZone);
				lnkZone.parentNode.removeChild(lnkZone);
				imgZone.parentNode.removeChild(imgZone);
				revZone.parentNode.removeChild(revZone);
				shadowZone.parentNode.removeChild(shadowZone);
				document.getElementsByTagName('body')[0].style.height='auto';
				document.getElementsByTagName('body')[0].style.overflow='auto';
				event.stopPropagation();
				}
			xZone.onclick = function(event) {
				eraseShadowNodes(event);
				}
			imgZone.onclick = function(event) {
				if(getLargeImage==localImageSet[localImageLast]) {
					eraseShadowNodes(event); 
					}
				else {
					for(find in localImageSet) {
						if(getLargeImage==localImageSet[find]) {
							findPlus = parseInt(find)+1;
							eraseShadowNodes(event);
							for(j in getInnerChildren) {
								getInnerChildHref = new String(getInnerChildren[j].href);
								if(getInnerChildHref.toString()==localImageSet[findPlus].toString()) {
									getInnerChildren[j].click();
									break;
									}
								}
							break;
							}
						else continue;
						}
					}
				}
			revZone.onclick = function(event) {
				if(getLargeImage!=localImageSet[0]) {
					for(find in localImageSet) {
						if(getLargeImage==localImageSet[find]) {
							findPlus = parseInt(find)-1;
							eraseShadowNodes(event);
							for(j in getInnerChildren) {
								getInnerChildHref = new String(getInnerChildren[j].href);
								if(getInnerChildHref.toString()==localImageSet[findPlus].toString()) {
									getInnerChildren[j].click();
									break;
									}
								}
							break;
							}
						else continue;
						}
					}
				}
			document.onkeydown = function(e) {
				keycode = (e == null) ? event.keyCode : e.which;
				if(keycode == 27) {
					eraseShadowNodes(e);
					}
				else if(keycode == 39 || keycode == 40) {
					imgZone.click();
					}
				else if(keycode == 37 || keycode == 38) {
					revZone.click();
					}
				}
			return false;
			}
		});
	// end Slideshow
	
	// Scroll to Top
	var bodyblock = document.getElementsByTagName('body')[0];
	var topLinkBlock = document.createElement('div');
	topLinkBlock.setAttribute('style','width:30px; height:30px; position:fixed; '+(isMobile>0 ? 'right:25px; bottom:25px;' : 'right:75px; bottom:75px;')+' background:#000; opacity:0.5; z-index:20000; border-radius:3px; color:#fff; text-align:center; line-height:28px; font-size:12pt; cursor:pointer; display:none;');
	topLinkBlock.setAttribute('id','topLinkBlock');
	bodyblock.appendChild(topLinkBlock);
	topLink = document.getElementById('topLinkBlock');
	topLink.innerHTML = '&uarr;';

	document.onscroll = function() {
		var scrolled = window.pageYOffset || document.documentElement.scrollTop;
		topLink.style.display = (parseInt(scrolled)>50) ? 'block' : 'none';
		topLink.onclick = function(){
			window.scrollTo(0,0);
			topLink.style.display = 'none';
			}
		}
	// end Scroll to Top

	// RTE
	document.onkeydown = function(e) {
		keycode = (e == null) ? event.keyCode : e.which;
		if(keycode == 0x0D && event.ctrlKey) {
			if(_('text') && _('text').parentElement.parentElement.tagName=='FORM' || _(txtid).parentElement.parentElement.tagName=='form') {
				idOfForm = _('text').parentElement.parentElement.id;
				_(idOfForm).submit();
				}
			}
		}
	if(typeof NoRTE == 'undefined' && isMobile<1) {	
		externalTranslations = {};
		jsInclude(scriptBaseFolder+'knedlik.js', function(){
			if(typeof uploadRef == 'undefined' || !uploadRef) uploadRef = '';
			knedlikProps = { 'lang': currentLang, 'upload': uploadRef, 'translations': externalTranslations, 'outside': ['bold', 'italic'], 'style': 'flat' };
			if(_('part')) { knedlik('part', knedlikProps); }
			if(_('preface')) { knedlik('preface', knedlikProps); }
			if(_('text')) { knedlik('text', knedlikProps); }
			});
		}
	// end RTE

	// Magic Autosave

	if(typeof magicAutoSaveURL != 'undefined') {
		magicAutoSaver = function() {
			if(_('text') && _('h1')) { 
				magicTitle = (_('h1').value) ? _('h1').value : '';
				magicText = (_('text').value) ? _('text').value : '';
				ajaxLoad(magicAutoSaveURL, {'savetitle': magicTitle, 'savetext': magicText});
				}
			saveTimeout = setTimeout('magicAutoSaver()',10000);
			}
		magicAutoSaver();
		window.onbeforeunload = function() { magicAutoSaver(); clearTimeout(saveTimeout); }
		}

	// end Magic Autosave

	// Sorting
	(function mElemSorting() {
		var sorted = document.querySelectorAll('div.sort-elem');
		for(s in sorted) {
			if(!sorted[s].style) continue;
			var slideUp = document.createElement('small');
			slideUp.innerHTML = ' &nbsp; &#9650;';
			slideUp.setAttribute('style','cursor:pointer; font-size:8pt;');
			slideUp.setAttribute('data-num',s);
			sorted[s].appendChild(slideUp);
			var slideDown = document.createElement('small');
			slideDown.innerHTML = ' &#9660;';
			slideDown.setAttribute('style','cursor:pointer; font-size:8pt;');
			slideDown.setAttribute('data-num',s);
			sorted[s].appendChild(slideDown);
			slideUp.onclick = function() {
				var num = this.getAttribute('data-num');
				sorted[num].parentNode.insertBefore(sorted[num], sorted[num].previousSibling);
			}
			slideDown.onclick = function() {
				var num = this.getAttribute('data-num');
				sorted[num].parentNode.insertBefore(sorted[num].nextSibling, sorted[num]);
			}
		}
	})();
	// end Sorting

// end processing
}

window.onload = function() { getMeruertJS(); }