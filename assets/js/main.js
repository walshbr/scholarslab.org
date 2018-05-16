(function() {
	// flexible-nav.html
	(function() {
		var menu 	  = document.querySelector(".flexnav-main-grid");
		var menuItems = menu.children;
		var prompt 	  = document.querySelector(".flexnav-more__prompt");
		var moreList  = document.querySelector(".flexnav-more__wrapper");
		var moreItems = moreList.children;

		// display only # items that fit, hide rest in sub-menu
		document.addEventListener("DOMContentLoaded", resizeMenu)

		// repeat on resize
		window.addEventListener("resize", resizeMenu)

		// show/hide sub-menu
		prompt.addEventListener("click", showSubMenu);

		// function definitions:
		function resizeMenu() {
			// un-hide all items
			for (let item of menuItems) {
				item.classList.remove("hidden");
			}
			for (let item of moreItems) {
				item.classList.remove("hidden");
			}

			var menuItemWidths = Array.from(menuItems, item => parseInt(item.offsetWidth));
			var sumWidth 	   = 0;
			var i 			   = -1;

			// add more items to menu until run out of room
			while (sumWidth < (menu.offsetWidth - prompt.offsetWidth)) {
				i++;
				sumWidth += menuItemWidths[i];
			}
			
			// mark where that happens
			var splitIndex 	  = i;

			// hide post-split on main menu
			for (i; i < (menuItems.length - 1); i++) {
				menuItems[i].classList.add("hidden");
			}
			// hide pre-split on sub-menu
			for (var j=0; j < splitIndex; j++) {
				moreItems[j].classList.add("hidden");
			}
		}

		function showSubMenu() {
			// toggle if click directly
			moreList.classList.toggle("show-more-menu");

			// if showing and user clicks outside of it, hide again
			if (moreList.classList.length == 2) {
				window.addEventListener("click", function(e) {
					if (e.target.classList.contains("flexnav-more__item") == false && 
						e.target.classList.contains("flexnav-more__prompt") == false) {	
						console.log("this is when it should hide again");
						moreList.classList.remove("show-more-menu");
					}	
				});
			}
		} // end function definitions
	})(); // end flexible-nav.html
	
	// Research gallery:
	(function() {
		if (document.querySelector(".research-main-content")) {
			var items = document.querySelectorAll(".research__item");
			var galleries = document.querySelectorAll(".research-items-wrapper");

			document.addEventListener("DOMContentLoaded", setItemHeight)

			window.addEventListener("resize", setItemHeight);

			// equalize width & height
			function setItemHeight() {
				var width = items[0].offsetWidth;
				for (let item of items) {
					var newHeight = width.toString() + "px";
					item.style.height = newHeight;
				}

	//			var rowHeight = (width / 2).toString() + "px";
	//			for (let gallery of galleries) {
	//				gallery.style.gridAutoRows = "minmax(" + rowHeight + ", auto)";
	//			}
			}
		}
	})();

	// Progress Tracker:
	if (document.querySelector(".progress-main-wrapper")) {
		var statusElems = document.querySelectorAll(".progress-item__status div");
		var statuses = Array.from(statusElems, status => status.innerText.slice(1));
		var titleElems = document.querySelectorAll(".progress-item__name a");
		var numElems = document.querySelectorAll(".progress-item__num");
		for (var i=0; i < statuses.length; i++) {
			console.log(statuses[i]);
			if (statuses[i].includes('prototype done')) {
				var span = statusElems[i].querySelector("span");
				if (window.getComputedStyle(span, null).getPropertyValue('color') == 'rgb(255, 0, 255)') {
					statusElems[i].style.color = 'magenta';
					numElems[i].style.color = 'magenta';
					titleElems[i].style.borderBottomColor = 'magenta';
				}
				else {
					statusElems[i].style.color = 'hsla(186,80%,70%,1)';
					numElems[i].style.color = 'hsla(186,80%,70%,1)';
					titleElems[i].style.borderBottomColor = 'hsla(186,80%,70%,1)';
				}
			}
		}
	}

	// Research:
	if (document.querySelector(".research-landing-wrapper")) {
		var galleryParent = document.querySelector(".research-folio__gallery-wrapper");
		var gallery = document.querySelector(".research-folio__gallery");
		var galleryItems = gallery.children;
		var btnLeft = document.querySelector(".research-nav__btn--left");
		var btnRight = document.querySelector(".research-nav__btn--right");
		var mc = new Hammer(gallery); // touch event handler

		gallery.setAttribute("data-translateX", "0");
		gallery.style.width = parseInt(galleryItems[0].offsetWidth * galleryItems.length) + "px";

		btnRight.addEventListener("click", moveGalleryRight);
		btnLeft.addEventListener("click", moveGalleryLeft);

		// if pan left/right on gallery
	//	mc.on("panright", panGalleryRight);
	//	mc.on("panleft", panGalleryLeft);

		function moveGalleryRight() {
			var screenWidth = galleryItems[0].offsetWidth * Math.floor(galleryParent.offsetWidth / galleryItems[0].offsetWidth); // galleryParent.offsetWidth;
			var totalWidth = galleryItems[0].offsetWidth * galleryItems.length;
			var translateOld = parseInt(gallery.getAttribute("data-translateX"));
			var maxTranslate = Math.floor(totalWidth / screenWidth) * screenWidth - (screenWidth - (totalWidth%screenWidth));

			if ((Math.floor(Math.abs(translateOld) / screenWidth)) == (Math.floor(totalWidth / screenWidth) - 2)) {
				gallery.style.transform = `translateX(-${maxTranslate}px)`;
				gallery.setAttribute("data-translateX", `-${maxTranslate}`);
			}
			else if ((Math.abs(translateOld) + screenWidth) < totalWidth) {
				gallery.style.transform = `translateX(-${Math.abs(translateOld) + screenWidth}px)`;
				gallery.setAttribute("data-translateX", `-${Math.abs(translateOld) + screenWidth}`);
			}
		}

		function moveGalleryLeft() {
			var screenWidth = galleryItems[0].offsetWidth * Math.floor(galleryParent.offsetWidth / galleryItems[0].offsetWidth);
			var translateOld = parseInt(gallery.getAttribute("data-translateX"));

			if ((translateOld + screenWidth) >= 0) {
				gallery.style.transform = `translateX(0px)`;
				gallery.setAttribute("data-translateX", "0");
			}
			else if (translateOld < 0) {
				gallery.style.transform = `translateX(${translateOld + screenWidth}px)`;
				gallery.setAttribute("data-translateX", `${translateOld + screenWidth}`);
			}
		}

		function panGalleryRight() {
			var translateOld = parseInt(gallery.getAttribute("data-translateX"));
			var percentage = 100 * (Math.abs(translateOld) / gallery.offsetWidth);
		}

		

		// run on initial load
//		document.addEventListener("DOMContentLoaded", resizeMenu)
		// repeat on resize
//		window.addEventListener("resize", resizeMenu)
	} // end research

})();